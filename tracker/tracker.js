/* Shared renderer for the topic-first tracker.
   Reads window.LEARNING_DATA (from ../data.js or ../../data.js) and renders the hub
   and per-track topic pages. Slugs are derived from module titles the same way in
   Python (generator) and here, so topics/<slug>.html always resolves to one module. */
(function () {
  "use strict";

  function slugify(t) {
    return (String(t).toLowerCase().match(/[a-z0-9]+/g) || []).join("-");
  }

  // The four non-Udemy cohort / self-paced courses that drive the study map.
  var CC = {
    ae:   "https://masterclaudecode.com",                                        // Agent Engineer (Ray Amjad)
    c4s1: "https://code4startup.com/courses/claude-code-mastery-level-1/",        // Code4Startup L1
    c4s2: "https://code4startup.com/courses/claude-code-mastery-level-2/",        // Code4Startup L2
    c4s3: "https://code4startup.com/courses/claude-code-mastery-level-3/",        // Code4Startup L3
    bb:   "https://bytebyteai.com/c/build-with-claude-code",                      // ByteByteAI (John Kim)
    ah:   "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-m0k0w",    // AI Hero (Matt Pocock)
    // Udemy courses referenced only by the optional top-ups (building around Claude, niche workflows)
    mc:   "https://www.udemy.com/course/claude-ai-masterclass/",
    aic:  "https://www.udemy.com/course/ai-coder-from-vibe-coder-to-agentic-engineer/",
    ft:   "https://www.udemy.com/course/claude-code-fast-track/"
  };

  // Phase plan mirrors claude-code-roadmap-cohort.md (the de-duplicated study map
  // across the 4 non-Udemy courses) — NOT the Udemy claude-code-roadmap.md.
  var ENRICH = {
    "claude-agent-sdk-claude-code-and-agent-skills": {
      title: "Curated, phase-wise study plan (cohort study map)",
      body: "This plan follows the de-duplicated cohort & self-paced study map across the four non-Udemy courses — Agent Engineer, Code4Startup, ByteByteAI, and AI Hero — so you watch each concept once. Each phase links to its primary course; both full roadmaps (rendered) are below.",
      docs: [
        ["🎓 Cohort & self-paced study map", "../../claude-code-roadmap-cohort.html"],
        ["📘 Udemy roadmap (11 phases)", "../../claude-code-roadmap.html"]
      ],
      phases: [
        ["0", "Decide & set up", "Install Claude Code and do the edit → review loop.", [["Agent Engineer §1–2", CC.ae], ["Code4Startup L1", CC.c4s1]]],
        ["1", "Core fundamentals", "Sessions, permissions, /context, slash commands, settings.json.", [["Agent Engineer §3", CC.ae], ["Code4Startup L1·M02", CC.c4s1]]],
        ["2", "Context engineering & CLAUDE.md", "Finite memory, \"fresh & condensed,\" Second Brain, CLAUDE.md.", [["ByteByteAI", CC.bb], ["AI Hero — Steering", CC.ah], ["Agent Engineer §6", CC.ae]]],
        ["3", "Planning & spec discipline", "Plan/Execute/Clear, decomposition, PRDs, tracer bullets.", [["AI Hero — Planning", CC.ah], ["Agent Engineer §4–5", CC.ae]]],
        ["4", "MCP", "Servers, connectors, MCP search — and when NOT to use MCP.", [["Agent Engineer §7", CC.ae], ["Code4Startup L1·M04", CC.c4s1], ["ByteByteAI", CC.bb]]],
        ["5", "Skills, commands, hooks & plugins", "Skills, slash commands, hooks, plugins, composability.", [["Agent Engineer §13–16", CC.ae], ["AI Hero", CC.ah], ["ByteByteAI", CC.bb]]],
        ["6", "Subagents & multi-agent orchestration", "Worktrees, subagents vs agent teams, parallel development.", [["ByteByteAI", CC.bb], ["Agent Engineer §11–12", CC.ae], ["Code4Startup L2·M07", CC.c4s2]]],
        ["7", "Feedback loops, Ralph & autonomy", "Green CI, test categorization, Ralph supervised vs AFK, human-in-the-loop.", [["AI Hero", CC.ah], ["ByteByteAI", CC.bb], ["Agent Engineer", CC.ae]]],
        ["8", "Browser, remote & automation", "Claude in Chrome, Web/Desktop, Slack/GitHub apps, Telegram/remote/scheduled.", [["Agent Engineer §8–10, §17", CC.ae], ["ByteByteAI /chrome", CC.bb]]],
        ["9", "Build reps & projects", "GitHub issue→PR, UI design, Agile BMAD, business automation, full SaaS build.", [["Code4Startup L2", CC.c4s2], ["Code4Startup L3", CC.c4s3]]],
        ["10", "Reference & niche (ongoing)", "Codex interop + Advanced + Niche catalog — a look-up reference, not a linear watch.", [["Agent Engineer §18–20", CC.ae]]]
      ],
      // Do the Udemy courses add anything? (optional top-ups) — gaps the 4 cohort
      // courses don't cover. [gap, why, [[source,url],...], priority]
      topups: [
        ["Anthropic API", "Python SDK, streaming, vision, structured outputs, prompt caching, batch, extended thinking — coding against the API, not the CLI.", [["Claude AI Masterclass §7", CC.mc]], "High"],
        ["Claude Agent SDK", "Production agents, multi-tool, orchestration — programmatic agent-building.", [["Claude AI Masterclass §3", CC.mc], ["AI Coder — Wk3", CC.aic]], "High"],
        ["Claude Code in CI/CD", "Wiring headless Claude Code into a pipeline (the 4 teach green-CI only as a concept).", [["Claude AI Masterclass §2", CC.mc]], "Medium"],
        ["Jira issue → PR", "The 4 cover GitHub, not Jira — just another MCP.", [["AI Coder — Wk2", CC.aic]], "Low"],
        ["Content & social-media automation", "AI-influencer/product images, YouTube Shorts auto-generate & post.", [["Fast-Track §3–4", CC.ft]], "Low"],
        ["Lead-gen, outreach & CRM", "Lead scraper, LinkedIn + email outreach, personal CRM.", [["Fast-Track §7–8", CC.ft]], "Low"],
        ["Google ADK + Claude", "Cross-framework (non-Anthropic) agent building.", [["Claude AI Masterclass §3", CC.mc]], "Low"],
        ["Disciplined debugging", "Error-analysis → fix pipelines as a method (partly covered by /debug + feedback loops).", [["Claude AI Masterclass §2", CC.mc], ["AI Coder — Wk2", CC.aic]], "Low (partial)"],
        ["Large team / enterprise-codebase practices", "Enterprise / large-team specifics (AI Hero covers the basics).", [["AI Coder — Wk3", CC.aic]], "Low (partial)"],
        ["Third-party cloud sandboxes", "Sprites.dev, \"5 ways to run remotely\" (Agent Engineer covers the rest).", [["AI Coder — Wk3", CC.aic]], "Low (partial)"]
      ],
      topupNote: "Verdict: the core stays the 4-course plan. The only top-up most people should plan for is the High-priority API + Agent SDK section of Claude AI Masterclass — pull it when you move from using Claude Code to building on Claude. The rest are niche; add only if that exact workflow is your goal. (Deliberately left out: Cowork/personal-agent automation, Excel/PowerPoint, prompt-engineering 101, OpenAI Agents SDK, Cursor/Copilot/Codex.)"
    }
  };

  // Hub sections — group the top-level tracks into a small number of study
  // "sections" on the hub. Tracks are matched to a section by their slug (the
  // same slugify() used for topic pages), so this layer is purely presentational
  // and never touches data.js. Any track whose slug isn't listed here collects
  // into a trailing "More Tracks" section, so nothing can ever disappear.
  var HUB_SECTIONS = [
    {
      title: "🎯 Certification Track",
      blurb: "Structured prep for the Anthropic Claude certifications — official courses, prep repos, and guides.",
      slugs: ["anthropic-certification-prep"]
    },
    {
      title: "🧑‍🏫 Cohorts & Bootcamps",
      blurb: "Time-boxed cohorts, instructor-led programs, and multi-month bootcamps — the ones with sessions, assignments, and due dates.",
      slugs: ["cohorts-bootcamps"]
    },
    {
      title: "🧠 Core AI Engineering Track",
      blurb: "The main build path: Claude & agent SDKs, LangChain/LangGraph, RAG & evals, agent memory, frameworks, theory, and hands-on projects.",
      slugs: [
        "core-ai-engineering-track",
        "claude-agent-sdk-claude-code-and-agent-skills",
        "langchain-langgraph",
        "rag-evals-production",
        "agentic-memory-context",
        "agent-frameworks-builds",
        "ai-engineering-projects",
        "theory-math-for-core-llm-and-genai"
      ]
    },
    {
      title: "⚙️ Forward Deployed Engineer Foundations",
      blurb: "Python depth, infrastructure, and DevOps (Docker, Kubernetes, Terraform) for shipping to production.",
      slugs: ["forward-deployed-engineer-foundations"]
    },
    {
      title: "📚 Reference & Reading",
      blurb: "Books, newsletters, and blogs to revisit.",
      slugs: [
        "books-reading-list",
        "newsletters-substacks-and-medium-blogs"
      ]
    }
  ];

  function counts(sec) {
    var subs = (sec.topics || []).length, items = 0, links = 0;
    (sec.topics || []).forEach(function (tp) {
      (tp.items || []).forEach(function (it) { items++; if (it.link) links++; });
    });
    return { subs: subs, items: items, links: links };
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function chip(text, cls) { return el("span", "chip " + cls, text); }

  function renderItem(it) {
    var li = el("li", "item" + (it.sub ? " sub-item" : ""));
    var dot = el("span", "item-dot");
    if (it.done) { dot.classList.add("done"); dot.textContent = "✓"; }
    else if (it.badge === "prog") { dot.classList.add("prog"); dot.textContent = "◐"; }
    else { dot.textContent = "○"; }
    li.appendChild(dot);

    var main = el("div", "item-main");
    var text;
    if (it.link) {
      text = el("a", "item-text", it.t || "(untitled)");
      text.href = it.link; text.target = "_blank"; text.rel = "noopener";
    } else {
      text = el("span", "item-text", it.t || "(untitled)");
    }
    if (it.done) text.classList.add("done");
    main.appendChild(text);

    var chips = el("span", "chips");
    if (it.priority) chips.appendChild(chip("⚑ priority", "chip-pri"));
    if (it.stars) chips.appendChild(chip("★".repeat(it.stars), "chip-star"));
    if (it.due) chips.appendChild(chip("📅 " + it.due, "chip-due"));
    (it.tags || []).forEach(function (tg) { chips.appendChild(chip(tg, "chip-tag")); });
    if (chips.childNodes.length) main.appendChild(chips);

    li.appendChild(main);
    return li;
  }

  // Build one track as a collapsible <details> accordion. Collapsed, it shows the
  // track title + counts; expanded, it lists every topic covered (as bullets) so
  // you can see a track's scope without opening its dedicated page. `n` is the
  // 1-based sequence number shown on the row.
  function trackAccordion(sec, n) {
    var c = counts(sec);
    var slug = slugify(sec.title);
    var acc = el("details", "track-acc");

    // --- summary row (always visible) ---
    var head = el("summary", "track-acc-head");
    var caret = el("span", "ta-caret"); caret.setAttribute("aria-hidden", "true"); caret.textContent = "▸";
    head.appendChild(caret);
    head.appendChild(el("span", "tc-num", String(n).padStart(2, "0")));

    var titleWrap = el("div", "ta-title-wrap");
    titleWrap.appendChild(el("span", "tc-title", sec.title));
    titleWrap.appendChild(el("span", "tc-meta",
      c.subs + " sub-topics · " + c.items + " resources · " + c.links + " links"));
    head.appendChild(titleWrap);

    if (ENRICH[slug]) head.appendChild(el("span", "badge-ready", "Phase-wise plan ready"));
    acc.appendChild(head);

    // --- body (revealed on expand): bulleted topic list + link out ---
    var body = el("div", "ta-body");
    var topics = sec.topics || [];
    if (topics.length) {
      body.appendChild(el("p", "ta-topics-label", "Topics covered in this track"));
      var ul = el("ul", "ta-topics");
      topics.forEach(function (tp) {
        var li = el("li", "ta-topic");
        li.appendChild(el("span", "ta-topic-name", tp.title));
        var cnt = (tp.items || []).length;
        li.appendChild(el("span", "ta-topic-count", cnt + (cnt === 1 ? " item" : " items")));
        ul.appendChild(li);
      });
      body.appendChild(ul);
    } else {
      body.appendChild(el("p", "ta-empty", "No topics added to this track yet."));
    }

    var open = el("a", "ta-open", "Open full track →");
    open.href = "topics/" + slug + ".html";
    body.appendChild(open);
    acc.appendChild(body);

    return acc;
  }

  function renderHub(mountId) {
    var data = window.LEARNING_DATA || [];
    var mount = document.getElementById(mountId || "hub");
    if (!mount) return;

    var tItems = 0, tLinks = 0;
    data.forEach(function (s) { var c = counts(s); tItems += c.items; tLinks += c.links; });

    var statRow = document.getElementById("stat-row");
    if (statRow) {
      statRow.innerHTML = "";
      statRow.appendChild(el("span", "stat", data.length + " tracks"));
      statRow.appendChild(el("span", "stat", tItems + " resources"));
      statRow.appendChild(el("span", "stat", tLinks + " links"));
      statRow.appendChild(el("span", "stat alt", "Claude Code · phase-wise plan ready"));
    }

    // Index tracks by slug so sections can pull them in a defined order while
    // preserving the original data.js order within each section.
    var bySlug = {}, order = [];
    data.forEach(function (sec) {
      var slug = slugify(sec.title);
      bySlug[slug] = sec;
      order.push(slug);
    });

    var placed = {};   // slugs already assigned to a section
    var n = 0;         // running track number across all sections

    // Each section is itself a collapsible <details>, open by default, holding a
    // stack of per-track accordions. Two levels of expand/collapse: section, then
    // track (which reveals the bulleted topic list).
    function renderSection(title, blurb, secs, opts) {
      if (!secs.length) return;
      var wrap = el("details", "hub-section");
      if (opts && opts.open === true) wrap.setAttribute("open", "");

      var head = el("summary", "hub-section-head");
      var caret = el("span", "hs-caret"); caret.setAttribute("aria-hidden", "true"); caret.textContent = "▸";
      head.appendChild(caret);
      head.appendChild(el("h2", "hub-section-title", title));
      head.appendChild(el("span", "hub-section-count",
        secs.length + (secs.length === 1 ? " track" : " tracks")));
      wrap.appendChild(head);

      var inner = el("div", "hub-section-body");
      if (blurb) inner.appendChild(el("p", "hub-section-blurb", blurb));
      var list = el("div", "track-list");
      secs.forEach(function (sec) { list.appendChild(trackAccordion(sec, ++n)); });
      inner.appendChild(list);
      wrap.appendChild(inner);
      mount.appendChild(wrap);
    }

    HUB_SECTIONS.forEach(function (def) {
      var secs = [];
      def.slugs.forEach(function (slug) {
        if (bySlug[slug] && !placed[slug]) { placed[slug] = 1; secs.push(bySlug[slug]); }
      });
      renderSection(def.title, def.blurb, secs);
    });

    // Anything not claimed by a section (e.g. new tracks added to data.js) still
    // shows up, so tracks can never silently disappear from the hub.
    var leftovers = order.filter(function (slug) { return !placed[slug]; })
      .map(function (slug) { return bySlug[slug]; });
    renderSection("🗂️ More Tracks", "Other tracks in your data not yet assigned to a section above.", leftovers);

    wireHubControls(mount);
  }

  // Wire the Expand all / Collapse all buttons (if present) to every <details>
  // in the hub — both section-level and track-level accordions.
  function wireHubControls(mount) {
    var expandBtn = document.getElementById("hub-expand");
    var collapseBtn = document.getElementById("hub-collapse");
    if (!expandBtn && !collapseBtn) return;
    function setAll(open) {
      var all = mount.querySelectorAll("details");
      for (var i = 0; i < all.length; i++) {
        if (open) all[i].setAttribute("open", "");
        else all[i].removeAttribute("open");
      }
    }
    if (expandBtn) expandBtn.addEventListener("click", function () { setAll(true); });
    if (collapseBtn) collapseBtn.addEventListener("click", function () { setAll(false); });
  }

  function renderTopic(slug, mountId) {
    var data = window.LEARNING_DATA || [];
    var sec = null;
    for (var i = 0; i < data.length; i++) {
      if (slugify(data[i].title) === slug) { sec = data[i]; break; }
    }
    var mount = document.getElementById(mountId || "topic");
    var titleEl = document.getElementById("tk-title");
    var subEl = document.getElementById("tk-sub");
    var crumbEl = document.getElementById("crumb-current");

    if (!sec) {
      if (titleEl) titleEl.textContent = "Track not found";
      if (mount) mount.appendChild(el("p", "notfound", "No track matches “" + slug + "” in data.js."));
      return;
    }

    var c = counts(sec);
    document.title = sec.title + " — Study Track";
    if (titleEl) titleEl.textContent = sec.title;
    if (crumbEl) crumbEl.textContent = sec.title;
    if (subEl) subEl.textContent =
      c.subs + " sub-topics · " + c.items + " resources · " + c.links + " links. "
      + "This page renders live from the tracker's data — every original link is preserved in the Reference section below.";

    // Optional enrichment (curated companion plan)
    var enr = ENRICH[slug];
    if (enr) {
      var box = el("div", "enrich");
      box.appendChild(el("p", "enrich-title", enr.title));
      box.appendChild(el("p", null, enr.body));
      var dl = el("div", "doclinks");
      enr.docs.forEach(function (d) {
        var a = el("a", "doclink", d[0]); a.href = d[1];
        a.target = "_blank"; a.rel = "noopener";
        dl.appendChild(a);
      });
      box.appendChild(dl);
      mount.appendChild(box);

      // Phase-wise plan with per-phase course links
      if (enr.phases) {
        var pp = el("section", "panel");
        pp.appendChild(el("p", "panel-title", "🗺️ Phase-wise plan (cohort study map) — the primary course per phase"));
        var list = el("div", "phase-plan");
        enr.phases.forEach(function (ph) {
          var row = el("div", "phase");
          row.appendChild(el("span", "phase-n", ph[0]));
          var b = el("div", "phase-b");
          b.appendChild(el("p", "phase-name", "Phase " + ph[0] + " — " + ph[1]));
          b.appendChild(el("p", "phase-out", ph[2]));
          var courses = el("div", "phase-courses");
          ph[3].forEach(function (c) {
            var a = el("a", "course-link", "▶ " + c[0]);
            a.href = c[1]; a.target = "_blank"; a.rel = "noopener";
            courses.appendChild(a);
          });
          b.appendChild(courses);
          row.appendChild(b);
          list.appendChild(row);
        });
        pp.appendChild(list);
        mount.appendChild(pp);
      }

      // Optional Udemy top-ups — what the 6 Udemy courses add on top of the 4
      if (enr.topups) {
        var tu = el("section", "panel");
        tu.appendChild(el("p", "panel-title", "➕ Do the Udemy courses add anything? (optional top-ups)"));
        tu.appendChild(el("p", "panel-lead", "The 4 cohort courses cover Claude Code end-to-end. These are the only gaps worth pulling from Udemy — mostly building around Claude (API/SDK) plus a few niche workflows."));
        var tlist = el("div", "topup-list");
        enr.topups.forEach(function (t) {
          var row = el("div", "topup");
          var head = el("div", "topup-head");
          head.appendChild(el("span", "topup-name", t[0]));
          head.appendChild(el("span", "chip pri-" + t[3].toLowerCase().split(" ")[0], t[3]));
          row.appendChild(head);
          row.appendChild(el("p", "topup-why", t[1]));
          var srcs = el("div", "phase-courses");
          t[2].forEach(function (c) {
            var a = el("a", "course-link", "▶ " + c[0]);
            a.href = c[1]; a.target = "_blank"; a.rel = "noopener";
            srcs.appendChild(a);
          });
          row.appendChild(srcs);
          tlist.appendChild(row);
        });
        tu.appendChild(tlist);
        if (enr.topupNote) tu.appendChild(el("p", "topup-verdict", enr.topupNote));
        mount.appendChild(tu);
      }
    }

    // Sub-topics with their items
    (sec.topics || []).forEach(function (tp) {
      var block = el("section", "subtopic");
      var h = el("h2", "subtopic-title", tp.title);
      h.appendChild(el("span", "subtopic-count", (tp.items || []).length + " item"
        + ((tp.items || []).length === 1 ? "" : "s")));
      block.appendChild(h);
      if ((tp.items || []).length) {
        var ul = el("ul", "item-list");
        tp.items.forEach(function (it) { ul.appendChild(renderItem(it)); });
        block.appendChild(ul);
      }
      mount.appendChild(block);
    });

    // Reference — every unique link in this track
    var seen = {}, refs = [];
    (sec.topics || []).forEach(function (tp) {
      (tp.items || []).forEach(function (it) {
        if (it.link && !seen[it.link]) { seen[it.link] = 1; refs.push(it); }
      });
    });
    if (refs.length) {
      var panel = el("section", "panel");
      panel.appendChild(el("p", "panel-title", "🔗 Reference — original links in this track"));
      var ref = el("div", "ref");
      ref.appendChild(el("p", "ref-label", refs.length + " unique links"));
      var ol = el("ul", "ref-list");
      refs.forEach(function (it) {
        var li = el("li");
        var a = el("a", null, it.t || it.link);
        a.href = it.link; a.target = "_blank"; a.rel = "noopener";
        li.appendChild(a);
        ol.appendChild(li);
      });
      ref.appendChild(ol);
      panel.appendChild(ref);
      mount.appendChild(panel);
    }
  }

  window.LT_TRACKER = { slugify: slugify, renderHub: renderHub, renderTopic: renderTopic };
})();
