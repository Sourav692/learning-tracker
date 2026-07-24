/* ===========================================================================
   topic-status.js — lightweight status layer for the read-only topic pages.

   Loaded ONLY on tracker/topics/*.html, AFTER data.js + tracker.js (and,
   optionally, config.js + the Supabase CDN). It is the topic-page counterpart
   to tracker-app.js — but far smaller: it does NOT add/rename/delete anything.
   It only:
     1. reads the SAME per-item status the hub writes
        (localStorage "lt-hub-state-v1", ids "b:<module>::<topic>::<index>");
     2. exposes window.LT_STATUS.{fold,attach} so tracker.js's renderItem folds
        that status onto the dot and makes the dot clickable to cycle
        todo → in-progress → done;
     3. persists changes to localStorage and — when signed in with Google —
        syncs them to the same per-user Supabase row as the hub, without
        clobbering the hub's other edit layers (custom/edits/topicEdits/…).

   The hub (tracker/index.html) does NOT load this file; there tracker-app.js
   owns status, so LT_STATUS is absent and renderItem's hooks stay inert.
   =========================================================================== */
(function () {
  "use strict";

  // Same keys + table the hub (tracker-app.js) uses, so status is shared.
  var DATA_KEY = "lt-hub-data-v1";     // non-status edit layers — preserved untouched on push
  var STATE_KEY = "lt-hub-state-v1";   // { id: 'todo'|'prog'|'done' }

  var CFG = window.APP_CONFIG || {};
  var SUPABASE_URL = CFG.SUPABASE_URL || "";
  var SUPABASE_ANON_KEY = CFG.SUPABASE_ANON_KEY || "";
  var TABLE = CFG.TABLE || "tracker_state";

  var state = {};
  try { state = JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch (e) { state = {}; }

  function readDataLayers() {
    try { return JSON.parse(localStorage.getItem(DATA_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveState() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
    scheduleSync();
  }

  // Resolve an item's current status: an explicit override wins; else fall back
  // to the item's own seed flags. Mirrors tracker-app.js statusOfRaw().
  function statusOf(it) {
    var v = state[it._id];
    if (v === "todo" || v === "prog" || v === "done") return v;
    if (it.done) return "done";
    if (it.badge === "prog") return "prog";
    return "todo";
  }

  // Fold saved status onto done/badge before render. Mirrors tracker-app.js withStatus().
  function fold(it) {
    var v = state[it._id];
    if (v === "done") { it.done = true; delete it.badge; }
    else if (v === "prog") { it.done = false; it.badge = "prog"; }
    else if (v === "todo") { it.done = false; if (it.badge === "prog") delete it.badge; }
    return it;
  }

  var NEXT = { todo: "prog", prog: "done", done: "todo" };
  var LABEL = { todo: "To do", prog: "In progress", done: "Done" };

  // Make the dot interactive: click cycles status, persists, syncs, re-renders.
  function attach(it, dot, text) {
    var cur = statusOf(it);
    dot.classList.add("clickable");
    dot.setAttribute("role", "button");
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("aria-label", "Status: " + LABEL[cur] + " — click to change");
    dot.title = "Status: " + LABEL[cur] + " (click to cycle)";

    function cycle(e) {
      e.preventDefault(); e.stopPropagation();
      var next = NEXT[statusOf(it)] || "todo";
      state[it._id] = next;
      saveState();
      if (window.LT_TRACKER && window.LT_TRACKER.rerenderTopic) window.LT_TRACKER.rerenderTopic();
    }
    dot.addEventListener("click", cycle);
    dot.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") cycle(e);
    });
  }

  window.LT_STATUS = { fold: fold, attach: attach, statusOf: statusOf };

  // ===========================================================================
  //  CLOUD SYNC + GOOGLE AUTH  (status-only; preserves the hub's other layers)
  // ===========================================================================
  var sb = null, user = null, realtimeChan = null, syncTimer = null, applyingRemote = false;

  function cloudConfigured() { return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !!window.supabase; }

  // Full snapshot = the hub's untouched edit layers + our (possibly changed) state.
  function localSnapshot() {
    var d = readDataLayers();
    return {
      custom: d.custom || {}, edits: d.edits || {}, topicEdits: d.topicEdits || {},
      sectionEdits: d.sectionEdits || {}, order: d.order || {}, settings: d.settings || {},
      state: state
    };
  }
  function isEmptySnapshot(d) {
    if (!d) return true;
    return !Object.keys(d.custom || {}).length && !Object.keys(d.edits || {}).length
      && !Object.keys(d.topicEdits || {}).length && !Object.keys(d.sectionEdits || {}).length
      && !Object.keys(d.order || {}).length && !Object.keys(d.state || {}).length;
  }
  // Apply a remote snapshot: persist the hub's edit layers verbatim (so the two
  // views stay consistent) and adopt its status, then re-render.
  function applyRemote(d) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify({
        custom: d.custom || {}, edits: d.edits || {}, topicEdits: d.topicEdits || {},
        sectionEdits: d.sectionEdits || {}, order: d.order || {}, settings: d.settings || {}
      }));
    } catch (e) {}
    state = d.state || {};
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
    applyingRemote = true;
    if (window.LT_TRACKER && window.LT_TRACKER.rerenderTopic) window.LT_TRACKER.rerenderTopic();
    applyingRemote = false;
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

  // ---- sync pill (same look/behaviour as the hub) ---------------------------
  var pill = null;
  function makePill() {
    pill = document.createElement("button");
    pill.id = "lt-sync-pill";
    pill.type = "button";
    pill.addEventListener("click", onPillClick);
    document.body.appendChild(pill);
  }
  function setPill(kind, label) {
    if (!pill) return;
    var c = { ok: "#1f9d6b", sync: "#c98a16", err: "#d23f2f", off: "#5E6B80", local: "#5E6B80" }[kind] || "#5E6B80";
    var dot = kind === "sync" ? "◴" : kind === "ok" ? "✔" : kind === "err" ? "!" : kind === "off" ? "○" : "•";
    pill.style.background = c; pill.textContent = dot + "  " + label;
  }
  function onPillClick() {
    if (!cloudConfigured()) { alert("Cloud sync isn’t set up. Add your Supabase URL and anon key to tracker/config.js. Status still saves locally in this browser."); return; }
    if (user) { if (confirm("Signed in. Sign out of cloud sync?")) signOut(); return; }
    signInWithGoogle();
  }
  function signInWithGoogle() {
    try {
      sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href.split("#")[0] } })
        .then(function (r) { if (r && r.error) throw r.error; });
    } catch (e) { console.error("[auth] google sign-in", e); setPill("err", "Sign-in error"); }
  }
  function signOut() { try { sb.auth.signOut(); } catch (e) { console.error("[auth] sign-out", e); } }

  function initCloud() {
    makePill();
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
  // LT_STATUS is set synchronously above (before renderTopic runs from the page's
  // inline script), so the very first render already folds saved status. Wire the
  // cloud pill once the DOM is ready.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCloud);
  else initCloud();
})();
