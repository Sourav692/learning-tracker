/* ===========================================================================
   tracker-app.js — optional editing + cloud-sync layer for the topic-first hub.

   Loaded ONLY on tracker/index.html, AFTER data.js and tracker.js. When present
   it:
     1. merges the built-in data.js seed with the user's saved edit layers
        (custom / edits / topicEdits / sectionEdits / order) from localStorage,
        exposing the MERGED model as window.LEARNING_DATA so tracker.js renders
        the editable data;
     2. exposes window.LT_EDIT with decoration hooks (moduleControls,
        topicControls, topicAdder, moduleAdder) that tracker.js calls to inject
        add / edit / delete affordances into the accordion UI;
     3. drives a small modal editor for add/edit/delete of items, sub-topics
        (topics) and modules (sections);
     4. keeps everything in localStorage and — when signed in with Google —
        syncs it to a per-user Supabase row (RLS-protected) in realtime across
        devices.

   The read-only topic pages (topics/*.html) do NOT load this file, so they keep
   rendering the plain seed.
   =========================================================================== */
(function () {
  "use strict";

  // ---- keys + config --------------------------------------------------------
  var DATA_KEY = "lt-hub-data-v1";     // edit layers (custom/edits/topicEdits/sectionEdits/order)
  var STATE_KEY = "lt-hub-state-v1";   // per-item status overrides
  var SEP = "::";

  var CFG = window.APP_CONFIG || {};
  var SUPABASE_URL = CFG.SUPABASE_URL || "";
  var SUPABASE_ANON_KEY = CFG.SUPABASE_ANON_KEY || "";
  var TABLE = CFG.TABLE || "tracker_state";

  // The pristine seed from data.js — never mutated; the model is rebuilt from it.
  var SEED = (window.LEARNING_DATA || []).map(function (s) { return s; });

  // ---- persisted edit layers ------------------------------------------------
  var custom = {};        // { module: { topic: [ {t,link,...}, ... ] } } — user additions
  var edits = {};         // { id: {t?,link?,stars?,priority?,due?,tags?,badge?,done?,deleted?} }
  var topicEdits = {};    // { "module::topic": {title?, deleted?} }
  var sectionEdits = {};  // { "module": {title?, deleted?} }
  var order = {};         // { sections:[...], topics:{ module:[...] } }
  var hubSections = {};   // { "<hub section title>": [trackSlug, ...] } — user "Add track" placements
  var settings = {};      // reserved
  var state = {};         // { id: 'todo'|'prog'|'done' }

  try { var d = JSON.parse(localStorage.getItem(DATA_KEY)) || {}; custom = d.custom || {}; edits = d.edits || {}; topicEdits = d.topicEdits || {}; sectionEdits = d.sectionEdits || {}; order = d.order || {}; hubSections = d.hubSections || {}; settings = d.settings || {}; } catch (e) {}
  try { state = JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch (e) { state = {}; }

  function dataLayers() {
    return { custom: custom, edits: edits, topicEdits: topicEdits, sectionEdits: sectionEdits, order: order, hubSections: hubSections, settings: settings };
  }

  function saveData() {
    try { localStorage.setItem(DATA_KEY, JSON.stringify(dataLayers())); } catch (e) {}
    scheduleSync();
  }
  function saveState() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
    scheduleSync();
  }

  // ---- build the merged model (seed + edit layers) --------------------------
  // Ported from the old app.js buildModel(), producing the shape tracker.js
  // renders: [ { title, topics:[ { title, items:[ {t,link,_id,...} ] } ] } ].
  function buildModel() {
    var model = [];
    var seen = {};
    SEED.forEach(function (sec) {
      var topics = [];
      var seenTopics = {};
      (sec.topics || []).forEach(function (top) {
        var items = [];
        (top.items || []).forEach(function (it, i) {
          var id = "b:" + sec.title + SEP + top.title + SEP + i;
          var e = edits[id];
          if (e && e.deleted) return;
          items.push(withStatus(assign({}, it, e || {}, { _id: id })));
        });
        ((custom[sec.title] && custom[sec.title][top.title]) || []).forEach(function (it, n) {
          var id = "c:" + sec.title + SEP + top.title + SEP + n;
          var e = edits[id];
          if (e && e.deleted) return;
          items.push(withStatus(assign({}, it, e || {}, { _id: id })));
        });
        seenTopics[top.title] = 1;
        var meta = topicEdits[sec.title + SEP + top.title];
        if (meta && meta.deleted) return;
        topics.push({ title: (meta && meta.title) || top.title, _origTopic: top.title, items: items });
      });
      // custom sub-topics added under a built-in module
      if (custom[sec.title]) {
        Object.keys(custom[sec.title]).forEach(function (tt) {
          if (seenTopics[tt]) return;
          var items = (custom[sec.title][tt] || []).map(function (it, n) {
            var id = "c:" + sec.title + SEP + tt + SEP + n;
            var e = edits[id];
            if (e && e.deleted) return null;
            return withStatus(assign({}, it, e || {}, { _id: id }));
          }).filter(Boolean);
          var meta = topicEdits[sec.title + SEP + tt];
          if (meta && meta.deleted) return;
          topics.push({ title: (meta && meta.title) || tt, _origTopic: tt, items: items });
        });
      }
      seen[sec.title] = 1;
      var smeta = sectionEdits[sec.title];
      if (smeta && smeta.deleted) return;
      model.push({ title: (smeta && smeta.title) || sec.title, _origModule: sec.title, topics: topics });
    });
    // brand-new modules that live only in custom
    Object.keys(custom).forEach(function (title) {
      if (seen[title]) return;
      var smeta = sectionEdits[title];
      if (smeta && smeta.deleted) return;
      var topics = [];
      Object.keys(custom[title]).forEach(function (tt) {
        var items = (custom[title][tt] || []).map(function (it, n) {
          var id = "c:" + title + SEP + tt + SEP + n;
          var e = edits[id];
          if (e && e.deleted) return null;
          return withStatus(assign({}, it, e || {}, { _id: id }));
        }).filter(Boolean);
        var meta = topicEdits[title + SEP + tt];
        if (meta && meta.deleted) return;
        topics.push({ title: (meta && meta.title) || tt, _origTopic: tt, items: items });
      });
      model.push({ title: (smeta && smeta.title) || title, _origModule: title, topics: topics });
    });
    applyOrder(model);
    return model;
  }

  function applyOrder(model) {
    var rank = function (arr, t) { var i = arr ? arr.indexOf(t) : -1; return i === -1 ? 1e9 : i; };
    if (order.sections && order.sections.length) {
      model.sort(function (a, b) { return rank(order.sections, a._origModule) - rank(order.sections, b._origModule); });
    }
    if (order.topics) {
      model.forEach(function (sec) {
        var ord = order.topics[sec._origModule];
        if (ord && ord.length) sec.topics.sort(function (a, b) { return rank(ord, a._origTopic) - rank(ord, b._origTopic); });
      });
    }
  }

  function assign(t) {
    for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; }
    return t;
  }

  // Fold the per-item status override (state{}) onto done/badge so the read-only
  // renderer (tracker.js) shows the right dot. state[id] wins over the item's own flags.
  function withStatus(item) {
    var v = state[item._id];
    if (v === "done") { item.done = true; delete item.badge; }
    else if (v === "prog") { item.done = false; item.badge = "prog"; }
    else if (v === "todo") { item.done = false; if (item.badge === "prog") delete item.badge; }
    return item;
  }

  // Rebuild the merged model, expose it, and re-render the hub.
  function refresh() {
    window.LEARNING_DATA = buildModel();
    if (window.LT_TRACKER && window.LT_TRACKER.renderHub) window.LT_TRACKER.renderHub("hub");
  }

  // ---- small DOM helper -----------------------------------------------------
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ===========================================================================
  //  EDIT HOOKS — called by tracker.js while it renders the accordion
  // ===========================================================================
  function iconBtn(label, title, cls, onClick) {
    var b = el("button", "lt-ebtn " + (cls || ""), label);
    b.type = "button";
    b.title = title;
    b.setAttribute("aria-label", title);
    b.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); onClick(e); });
    return b;
  }

  // Controls shown on a module (section) summary row: rename + delete.
  function moduleControls(sec) {
    var wrap = el("span", "lt-ctrls");
    wrap.appendChild(iconBtn("✎", "Rename module", "", function () { openModuleEditor(sec._origModule); }));
    wrap.appendChild(iconBtn("🗑", "Delete module", "danger", function () { deleteModule(sec._origModule); }));
    return wrap;
  }

  // Controls shown on each topic (sub-topic) bullet: view items / add item / rename / delete.
  function topicControls(sec, tp) {
    var wrap = el("span", "lt-ctrls");
    wrap.appendChild(iconBtn("＋", "Add item to this topic", "", function () { openItemEditor(null, sec._origModule, tp._origTopic); }));
    wrap.appendChild(iconBtn("☰", "View / edit items", "", function () { openTopicItems(sec._origModule, tp._origTopic, tp.title); }));
    wrap.appendChild(iconBtn("✎", "Rename topic", "", function () { openTopicEditor(sec._origModule, tp._origTopic); }));
    wrap.appendChild(iconBtn("🗑", "Delete topic", "danger", function () { deleteTopic(sec._origModule, tp._origTopic); }));
    return wrap;
  }

  // "Add topic" row at the bottom of a track body.
  function topicAdder(sec) {
    var row = el("div", "lt-add-row");
    row.appendChild(iconBtn("＋ Add topic", "Add a sub-topic to this track", "wide", function () { openTopicAdder(sec._origModule); }));
    return row;
  }

  // Controls shown on a section summary header: add track (reachable while the
  // section is collapsed, where the bottom "Add track" row is hidden).
  function sectionControls(title, def) {
    var wrap = el("span", "lt-ctrls");
    wrap.appendChild(iconBtn("＋", "Add track to " + title, "", function () { openTrackAdderForSection(def); }));
    return wrap;
  }

  // "Add track" row at the bottom of a section's track list — the section-level
  // twin of topicAdder()'s "Add topic" row inside a track.
  function trackAdder(def) {
    var row = el("div", "lt-add-row lt-add-track");
    row.appendChild(iconBtn("＋ Add track", "Add a new track to this section", "wide", function () { openTrackAdderForSection(def); }));
    return row;
  }

  // Track slugs the user filed into a hub section, so tracker.js can pull them
  // into that section on every render (not just the one right after creation).
  function sectionSlugs(title) { return (hubSections[title] || []).slice(); }

  // "Add new track/module" control at the very bottom of the hub.
  function moduleAdder() {
    var row = el("div", "lt-add-module");
    row.appendChild(iconBtn("＋ Add new track", "Create a brand-new track / module", "wide", function () { openModuleAdder(); }));
    return row;
  }

  window.LT_EDIT = {
    moduleControls: moduleControls,
    topicControls: topicControls,
    topicAdder: topicAdder,
    moduleAdder: moduleAdder,
    sectionControls: sectionControls,
    trackAdder: trackAdder,
    sectionSlugs: sectionSlugs
  };

  // ===========================================================================
  //  MODAL  — a single reusable dialog built on the fly
  // ===========================================================================
  var modalWrap = null;
  function closeModal() { if (modalWrap) { modalWrap.remove(); modalWrap = null; } }
  function openModal(title, bodyNode, actions) {
    closeModal();
    modalWrap = el("div", "lt-modal open");
    var card = el("div", "lt-modal-card");
    card.appendChild(el("h3", "lt-modal-title", title));
    card.appendChild(bodyNode);
    var act = el("div", "lt-modal-actions");
    (actions || []).forEach(function (a) {
      var b = el("button", "lt-btn " + (a.cls || ""), a.label);
      b.type = "button";
      b.addEventListener("click", a.onClick);
      act.appendChild(b);
      if (a.spacerAfter) act.appendChild(el("span", "lt-spacer"));
    });
    card.appendChild(act);
    modalWrap.appendChild(card);
    modalWrap.addEventListener("click", function (e) { if (e.target === modalWrap) closeModal(); });
    document.body.appendChild(modalWrap);
    var first = card.querySelector("input,textarea,select");
    if (first) first.focus();
  }
  function field(labelText, inputNode) {
    var f = el("label", "lt-field");
    f.appendChild(el("span", "lt-field-label", labelText));
    f.appendChild(inputNode);
    return f;
  }
  function input(value, placeholder) { var i = el("input", "lt-input"); i.type = "text"; if (value != null) i.value = value; if (placeholder) i.placeholder = placeholder; return i; }

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  // ===========================================================================
  //  ITEM add / edit / delete
  // ===========================================================================
  // Find an item's live values by id from the current model.
  function findItem(id) {
    var data = window.LEARNING_DATA || [];
    for (var a = 0; a < data.length; a++) {
      var secs = data[a].topics || [];
      for (var b = 0; b < secs.length; b++) {
        var items = secs[b].items || [];
        for (var c = 0; c < items.length; c++) if (items[c]._id === id) return items[c];
      }
    }
    return null;
  }

  function openItemEditor(id, presetModule, presetTopic) {
    var existing = id ? findItem(id) : null;
    var tIn = input(existing ? existing.t : "", "e.g. Advanced RAG Bootcamp");
    var linkIn = input(existing ? existing.link : "", "https://… (optional)");
    var starsIn = el("input", "lt-input"); starsIn.type = "number"; starsIn.min = "0"; starsIn.max = "6"; starsIn.value = (existing && existing.stars) || 0;
    var dueIn = el("input", "lt-input"); dueIn.type = "date"; if (existing && existing.due) dueIn.value = existing.due;
    var statusSel = el("select", "lt-input");
    [["todo", "To do"], ["prog", "In progress"], ["done", "Done"]].forEach(function (o) { var op = el("option", null, o[1]); op.value = o[0]; statusSel.appendChild(op); });
    statusSel.value = existing ? statusOfRaw(existing) : "todo";
    var tagsIn = input(existing && existing.tags ? existing.tags.join(", ") : "", "rag, agents, must-read");
    var priIn = el("input"); priIn.type = "checkbox"; if (existing && existing.priority) priIn.checked = true;
    var priLabel = el("label", "lt-check"); priLabel.appendChild(priIn); priLabel.appendChild(el("span", null, " ⚑ Mark as priority"));

    var body = el("div");
    body.appendChild(field("Title (required)", tIn));
    body.appendChild(field("Link (optional)", linkIn));
    var rowA = el("div", "lt-field-row");
    rowA.appendChild(field("Status", statusSel));
    rowA.appendChild(field("Due (optional)", dueIn));
    rowA.appendChild(field("Stars (0–6)", starsIn));
    body.appendChild(rowA);
    body.appendChild(field("Tags (comma-separated)", tagsIn));
    body.appendChild(priLabel);

    var actions = [];
    if (id) actions.push({ label: "Delete", cls: "ghost danger", onClick: function () { deleteItem(id); closeModal(); } });
    actions.push({ label: "Cancel", cls: "ghost", spacerAfter: false, onClick: closeModal });
    actions.push({ label: "Save", cls: "primary", onClick: function () {
      var t = tIn.value.trim();
      if (!t) { tIn.focus(); return; }
      var payload = { t: t };
      var link = linkIn.value.trim(); if (link) payload.link = link;
      var stars = parseInt(starsIn.value, 10); if (stars > 0) payload.stars = stars;
      if (dueIn.value) payload.due = dueIn.value;
      var tags = tagsIn.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean); if (tags.length) payload.tags = tags;
      if (priIn.checked) payload.priority = true;
      var st = statusSel.value;
      if (st === "done") payload.done = true; else if (st === "prog") payload.badge = "prog";
      if (id) applyItemEdit(id, payload, st); else addItem(presetModule, presetTopic, payload, st);
      closeModal();
    } });
    // reorder so Cancel/Save sit right with Delete far left
    if (id) actions = [actions[0], { label: "", cls: "lt-flexspacer", onClick: function () {} }, actions[1], actions[2]];
    openModal(id ? "Edit item" : "Add item", body, actions);
  }

  function statusOfRaw(it) { if (state[it._id] === "todo" || state[it._id] === "prog" || state[it._id] === "done") return state[it._id]; if (it.done) return "done"; if (it.badge === "prog") return "prog"; return "todo"; }

  // Add a fresh custom item under module/topic.
  function addItem(mod, topic, payload, status) {
    custom[mod] = custom[mod] || {};
    custom[mod][topic] = custom[mod][topic] || [];
    var n = custom[mod][topic].length;
    custom[mod][topic].push(payload);
    var id = "c:" + mod + SEP + topic + SEP + n;
    if (status && status !== "todo") state[id] = status; // best-effort; done/prog also encoded in payload
    saveData(); saveState(); refresh();
  }

  // Edit any item (built-in or custom) by layering an override.
  function applyItemEdit(id, payload, status) {
    // reset status flags we manage explicitly
    var e = assign({}, edits[id] || {}, payload);
    // clear stale done/badge when status changed away
    if (status === "todo") { delete e.done; delete e.badge; }
    if (status === "prog") { delete e.done; e.badge = "prog"; }
    if (status === "done") { e.done = true; delete e.badge; }
    edits[id] = e;
    state[id] = status;
    saveData(); saveState(); refresh();
  }

  function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    edits[id] = assign({}, edits[id] || {}, { deleted: true });
    delete state[id];
    saveData(); saveState(); refresh();
  }

  // A modal listing a topic's items with edit/delete each.
  function openTopicItems(mod, topic, displayTitle) {
    var data = window.LEARNING_DATA || [];
    var items = [];
    for (var a = 0; a < data.length; a++) {
      if (data[a]._origModule !== mod) continue;
      var secs = data[a].topics || [];
      for (var b = 0; b < secs.length; b++) if (secs[b]._origTopic === topic) { items = secs[b].items || []; break; }
    }
    var body = el("div", "lt-itemlist");
    if (!items.length) body.appendChild(el("p", "lt-note", "No items yet. Use “Add item”."));
    items.forEach(function (it) {
      var row = el("div", "lt-itemrow");
      var name = el("span", "lt-itemname", (it.done ? "✓ " : it.badge === "prog" ? "◐ " : "○ ") + (it.t || "(untitled)"));
      row.appendChild(name);
      var acts = el("span", "lt-ctrls");
      acts.appendChild(iconBtn("✎", "Edit", "", function () { openItemEditor(it._id); }));
      acts.appendChild(iconBtn("🗑", "Delete", "danger", function () { deleteItem(it._id); closeModal(); }));
      row.appendChild(acts);
      body.appendChild(row);
    });
    openModal("Items in “" + displayTitle + "”", body, [
      { label: "Add item", cls: "primary", onClick: function () { openItemEditor(null, mod, topic); } },
      { label: "Close", cls: "ghost", onClick: closeModal }
    ]);
  }

  // ===========================================================================
  //  TOPIC (sub-topic) add / rename / delete
  // ===========================================================================
  function openTopicAdder(mod) {
    var nameIn = input("", "New sub-topic name…");
    openModal("Add sub-topic", field("Sub-topic name (required)", nameIn), [
      { label: "Cancel", cls: "ghost", onClick: closeModal },
      { label: "Add", cls: "primary", onClick: function () {
        var name = nameIn.value.trim(); if (!name) { nameIn.focus(); return; }
        custom[mod] = custom[mod] || {};
        if (!custom[mod][name]) custom[mod][name] = [];
        saveData(); refresh();
        closeModal();
      } }
    ]);
  }

  function openTopicEditor(mod, topic) {
    var cur = (topicEdits[mod + SEP + topic] && topicEdits[mod + SEP + topic].title) || topic;
    var nameIn = input(cur, "Sub-topic name…");
    openModal("Rename sub-topic", field("Sub-topic name (required)", nameIn), [
      { label: "Cancel", cls: "ghost", onClick: closeModal },
      { label: "Save", cls: "primary", onClick: function () {
        var name = nameIn.value.trim(); if (!name) { nameIn.focus(); return; }
        topicEdits[mod + SEP + topic] = assign({}, topicEdits[mod + SEP + topic] || {}, { title: name });
        saveData(); refresh();
        closeModal();
      } }
    ]);
  }

  function deleteTopic(mod, topic) {
    if (!confirm("Delete this sub-topic and all its items?")) return;
    topicEdits[mod + SEP + topic] = assign({}, topicEdits[mod + SEP + topic] || {}, { deleted: true });
    saveData(); refresh();
  }

  // ===========================================================================
  //  MODULE (section / track) add / rename / delete
  // ===========================================================================
  function openModuleAdder() {
    openTrackAdderForSection(null);
  }

  function openTrackAdderForSection(def) {
    var nameIn = input("", "e.g. 🎓 11 · My New Track");
    var topicIn = input("", "First sub-topic (optional, default: Course Details)");
    var body = el("div");
    body.appendChild(field("Track name (required)", nameIn));
    body.appendChild(field("First sub-topic (optional)", topicIn));
    if (def) body.appendChild(el("p", "lt-note", "It will be added to “" + def.title + "”."));
    openModal(def ? ("Add track to “" + def.title + "”") : "Add new track", body, [
      { label: "Cancel", cls: "ghost", onClick: closeModal },
      { label: "Create track", cls: "primary", onClick: function () {
        var name = nameIn.value.trim(); if (!name) { nameIn.focus(); return; }
        if (findModuleTitle(name)) { alert("A track with that name already exists."); return; }
        var firstTopic = topicIn.value.trim() || "Course Details";
        custom[name] = custom[name] || {};
        if (!custom[name][firstTopic]) custom[name][firstTopic] = [];
        if (def) {
          var list = hubSections[def.title] = hubSections[def.title] || [];
          var slug = slugOf(name);
          if (list.indexOf(slug) === -1) list.push(slug);
        }
        saveData(); refresh();
        closeModal();
      } }
    ]);
  }

  function slugOf(title) {
    return (window.LT_TRACKER && window.LT_TRACKER.slugify)
      ? window.LT_TRACKER.slugify(title)
      : String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function findModuleTitle(title) {
    if (custom[title]) return true;
    return SEED.some(function (s) { return s.title === title; });
  }

  function openModuleEditor(mod) {
    var cur = (sectionEdits[mod] && sectionEdits[mod].title) || mod;
    var nameIn = input(cur, "Track name…");
    openModal("Rename track", field("Track name (required)", nameIn), [
      { label: "Cancel", cls: "ghost", onClick: closeModal },
      { label: "Save", cls: "primary", onClick: function () {
        var name = nameIn.value.trim(); if (!name) { nameIn.focus(); return; }
        sectionEdits[mod] = assign({}, sectionEdits[mod] || {}, { title: name });
        saveData(); refresh();
        closeModal();
      } }
    ]);
  }

  function deleteModule(mod) {
    if (!confirm("Delete this entire track and everything in it?")) return;
    sectionEdits[mod] = assign({}, sectionEdits[mod] || {}, { deleted: true });
    saveData(); refresh();
  }

  // ===========================================================================
  //  CLOUD SYNC + GOOGLE AUTH  (ported from the old app.js)
  // ===========================================================================
  var sb = null, user = null, realtimeChan = null, syncTimer = null, applyingRemote = false;

  function cloudConfigured() { return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !!window.supabase; }

  var pill = el("button", null, "");
  pill.id = "lt-sync-pill";
  pill.addEventListener("click", onPillClick);
  function setPill(kind, label) {
    var c = { ok: "#1f9d6b", sync: "#c98a16", err: "#d23f2f", off: "#5E6B80", local: "#5E6B80" }[kind] || "#5E6B80";
    var dot = kind === "sync" ? "◴" : kind === "ok" ? "✔" : kind === "err" ? "!" : kind === "off" ? "○" : "•";
    pill.style.background = c; pill.textContent = dot + "  " + label;
  }
  function onPillClick() {
    if (!cloudConfigured()) return openAuthModal("unconfigured");
    openAuthModal(user ? "account" : "signin");
  }

  var GOOGLE_SVG = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">'
    + '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.5 29.5 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 45.5 35.9 45.5 24c0-1.2-.1-2.3-.4-3.5z"/>'
    + '<path fill="#FF3D00" d="M5 14.7l6.6 4.8C13.4 15.1 18.3 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.5 29.5 2.5 24 2.5 16 2.5 9.1 7 5 14.7z"/>'
    + '<path fill="#4CAF50" d="M24 45.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.5C29.6 36 26.9 37 24 37c-5.2 0-9.6-3.3-11.3-8L6 33.9C10 41 16.4 45.5 24 45.5z"/>'
    + '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.9 41.4 45.5 35.5 45.5 24c0-1.2-.1-2.3-.4-3.5z"/></svg>';

  function openAuthModal(mode) {
    var body = el("div");
    if (mode === "unconfigured") {
      body.appendChild(el("p", "lt-note", "Cloud sync isn’t set up. Add your Supabase URL and anon key to tracker/config.js and run supabase/schema.sql. Until then the tracker still works locally in this browser."));
      openModal("Cloud sync not set up", body, [{ label: "Close", cls: "ghost", onClick: closeModal }]);
      return;
    }
    if (mode === "account") {
      body.innerHTML = '<p class="lt-note">Signed in as <strong>' + esc(user.email || user.id) + '</strong>. Your tracker is backed up and syncs across your devices automatically.</p>';
      openModal("Account", body, [
        { label: "Sign out", cls: "ghost", onClick: function () { signOut(); closeModal(); } },
        { label: "Done", cls: "primary", onClick: closeModal }
      ]);
      return;
    }
    body.innerHTML = '<p class="lt-note">Back up your tracker and sync it across devices. Your data is private to your Google account.</p>';
    var g = el("button", "lt-btn google", ""); g.innerHTML = GOOGLE_SVG + "<span>Continue with Google</span>";
    g.addEventListener("click", signInWithGoogle);
    body.appendChild(g);
    openModal("Sign in to sync", body, [{ label: "Maybe later", cls: "ghost", onClick: closeModal }]);
  }

  function signInWithGoogle() {
    try {
      sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href.split("#")[0] } })
        .then(function (r) { if (r && r.error) throw r.error; });
    } catch (e) { console.error("[auth] google sign-in", e); setPill("err", "Sign-in error"); }
  }
  function signOut() { try { sb.auth.signOut(); } catch (e) { console.error("[auth] sign-out", e); } }

  function localSnapshot() { return assign(dataLayers(), { state: state }); }
  function isEmptySnapshot(d) {
    if (!d) return true;
    return !Object.keys(d.custom || {}).length && !Object.keys(d.edits || {}).length
      && !Object.keys(d.topicEdits || {}).length && !Object.keys(d.sectionEdits || {}).length
      && !Object.keys(d.order || {}).length && !Object.keys(d.hubSections || {}).length
      && !Object.keys(d.state || {}).length;
  }
  function applyRemote(d) {
    custom = d.custom || {}; edits = d.edits || {}; topicEdits = d.topicEdits || {}; sectionEdits = d.sectionEdits || {};
    order = d.order || {}; hubSections = d.hubSections || {}; settings = d.settings || {}; state = d.state || {};
    try { localStorage.setItem(DATA_KEY, JSON.stringify(dataLayers())); } catch (e) {}
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
    applyingRemote = true; refresh(); applyingRemote = false;
  }
  function pull() {
    if (!sb || !user) return Promise.resolve();
    setPill("sync", "Syncing…");
    return sb.from(TABLE).select("data").eq("user_id", user.id).maybeSingle().then(function (r) {
      if (r.error) throw r.error;
      if (r.data && r.data.data && !isEmptySnapshot(r.data.data)) { applyRemote(r.data.data); setPill("ok", "Synced"); }
      else { return push(); }
    }).catch(function (e) { console.error("[sync] pull", e); setPill("err", "Sync error"); });
  }
  function push() {
    if (!sb || !user) return Promise.resolve();
    setPill("sync", "Saving…");
    return sb.from(TABLE).upsert({ user_id: user.id, data: localSnapshot(), updated_at: new Date().toISOString() }).then(function (r) {
      if (r.error) throw r.error;
      setPill("ok", "Synced");
    }).catch(function (e) { console.error("[sync] push", e); setPill("err", "Sync error"); });
  }
  function scheduleSync() {
    if (!sb || !user || applyingRemote) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(push, 600);
  }
  function subscribe() {
    if (realtimeChan) { sb.removeChannel(realtimeChan); realtimeChan = null; }
    realtimeChan = sb.channel("tracker-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: TABLE, filter: "user_id=eq." + user.id }, function (payload) {
        var d = payload["new"] && payload["new"].data; if (!d) return;
        applyRemote(d); setPill("ok", "Synced");
      })
      .subscribe();
  }
  function onSignedIn(u) { user = u; setPill("sync", "Syncing…"); pull().then(subscribe); }
  function onSignedOut() { user = null; if (realtimeChan) { sb.removeChannel(realtimeChan); realtimeChan = null; } setPill("off", "Sign in to sync"); }

  function initCloud() {
    document.body.appendChild(pill);
    if (!cloudConfigured()) { setPill("local", "Local only"); return; }
    var url = SUPABASE_URL.indexOf("http") === 0 ? SUPABASE_URL : "https://" + SUPABASE_URL;
    sb = window.supabase.createClient(url, SUPABASE_ANON_KEY);
    setPill("off", "Sign in to sync");
    sb.auth.getSession().then(function (r) { if (r.data && r.data.session) onSignedIn(r.data.session.user); });
    sb.auth.onAuthStateChange(function (evt, session) {
      if (session && session.user) { if (!user || user.id !== session.user.id) onSignedIn(session.user); }
      else if (user) { onSignedOut(); }
    });
  }

  // ---- boot -----------------------------------------------------------------
  // Expose status-cycling for future use; build the model and render, then cloud.
  window.LT_EDIT.refresh = refresh;
  refresh();
  initCloud();
})();
