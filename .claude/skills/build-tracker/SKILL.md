---
name: build-tracker
description: Build or extend a "topic-first" learning tracker like the AI Engineering one in this repo — a data-driven hub of tracks/modules with collapsible sections, per-item progress (todo → in-progress → done) that syncs across devices via Supabase+Google, an in-browser add/edit/delete UI, per-track topic pages that study by LINK (not course), and bespoke anime.js 3D hero animations. Use when the user asks to add a new tracker/track/module (e.g. "Data Engineering tracker", "Databricks path"), add topics/items to an existing track, or replicate the tracker system elsewhere.
---

# Build a Topic-First Learning Tracker

This repo contains a complete, working tracker system for **AI Engineering**. This skill
captures its architecture and conventions so you can **add new tracks/modules**, **build a
whole new tracker** (Data Engineering, Databricks, …), or **replicate the system** in
another project — without re-deriving how it works.

Study the live implementation as the source of truth. Key files:
`data.js`, `tracker/tracker.js`, `tracker/tracker-app.js`, `tracker/topic-status.js`,
`tracker/tracker-hero.js`, `home-hero.js`, `tracker/tracker.css`, `tracker/index.html`,
`tracker/topics/*.html`, `supabase/schema.sql`, `sw.js`.

For the deep technical contract (data schema, id scheme, sync protocol, gotchas), read
`references/architecture.md` in this skill folder **before** editing engine files.

## Mental model (read this first)

- **One shared data file, two views.** `data.js` (`window.LEARNING_DATA`) is the single
  seed of truth: an array of **modules** (aka "tracks"), each with **topics** (sub-topics),
  each with **items** (the actual resources/links). Both views render from it:
  - **Hub** (`tracker/index.html`) — a two-level expand/collapse **accordion**: sections →
    tracks. Expanding a track shows its topics as **bullets** (with item counts) inline, so
    you see a track's scope *without opening it*. This is the "topic-first" browse view.
  - **Topic page** (`tracker/topics/<slug>.html`) — one module's full detail: every
    sub-topic, every item as a **clickable status dot** (study by **link**, not by course),
    and a Reference section listing every unique link.
- **"Study by topic/link, not by course"** means: items are individual links/resources you
  track and open directly; you are NOT forced through a linear course. The hub surfaces
  *topics covered*; the topic page lists *every link* with its own progress dot.
- **Progress lives in one place.** Per-item status (`todo`/`prog`/`done`) is keyed by a
  **stable id** `b:<moduleTitle>::<topicTitle>::<index>` (built-in) or
  `c:<moduleTitle>::<topicTitle>::<n>` (custom-added). Stored in localStorage
  (`lt-hub-state-v1`) and synced.
- **Additive layers, never mutate the seed.** User edits (add/rename/delete/reorder) are
  stored as *layers* (`custom`, `edits`, `topicEdits`, `sectionEdits`, `order`) in
  localStorage (`lt-hub-data-v1`) and merged over `data.js` at render time by
  `buildModel()`. `data.js` itself is only edited to change the shipped seed.
- **Sync = one Supabase row per Google user**, protected by Row-Level Security. Signed out,
  everything works locally; signed in, the merged snapshot pushes/pulls/realtime-subscribes.

## The file map (responsibilities)

| File | Role | Loaded on |
|---|---|---|
| `data.js` | The seed: `window.LEARNING_DATA` (modules→topics→items). | every page |
| `tracker/tracker.js` | Pure renderer + `HUB_SECTIONS` grouping + `ENRICH` phase-plans. Exposes `window.LT_TRACKER`. Read-only by itself; calls optional `LT_EDIT`/`LT_STATUS` hooks if present. | hub + topic pages |
| `tracker/tracker-app.js` | **Hub-only** edit engine + cloud sync. Merges seed+layers → replaces `LEARNING_DATA` → re-renders. Exposes `window.LT_EDIT` (add/edit/delete modals + inline controls). Owns auth/sync + the sync pill. | hub only |
| `tracker/topic-status.js` | **Topic-page-only** status layer. Exposes `window.LT_STATUS.{fold,attach}` so dots show + cycle status. Same keys/table as the hub; preserves the hub's other layers on push. | topic pages only |
| `tracker/hub-seed.js` | One-time localStorage migration (guarded by a version flag). Merges, never clobbers. | hub + topic pages |
| `tracker/config.js` | `window.APP_CONFIG` = Supabase URL + anon key + table. Safe to ship under RLS. | hub + topic pages |
| `tracker/tracker-hero.js` | anime.js 3D constellation hero for the hub header. Additive, reduced-motion aware. | hub only |
| `home-hero.js` | anime.js 3D circus-confetti hero for the landing page. | `index.html` |
| `tracker/tracker.css` | All hub + topic + edit-UI + 3D-hero styles (dark/teal theme). | hub + topic pages |
| `supabase/schema.sql` | `tracker_state` table + RLS + realtime. Run once in Supabase. | — |
| `sw.js` | PWA precache. **Bump `CACHE` version + add any new file** when shipping. | all |

## Common tasks

### A. Add items/topics/modules to the EXISTING tracker
Two ways — prefer the UI for one-offs, edit `data.js` for shipped seed content:
1. **Via the hub UI** (no code): open `tracker/index.html`, expand a section→track, use the
   inline controls (`＋` add item, `☰` view/edit items, `✎` rename, `🗑` delete), "＋ Add
   topic", or "＋ Add new track" at the bottom. Saves to localStorage + syncs. Best for the
   single user's own additions.
2. **In `data.js`** (ships to everyone): add to the `topics`/`items` arrays following the
   exact object shape (see below). Keep it valid JSON-in-JS. Then, if the module is new,
   it auto-appears; assign it to a hub section in `HUB_SECTIONS` (`tracker/tracker.js`) or
   it falls into "🗂️ More Tracks".

### B. Add a NEW module/track (shipped)
1. Append a module object to `window.LEARNING_DATA` in `data.js`.
2. In `tracker/tracker.js`, add its **slug** to the right `HUB_SECTIONS` entry (slug =
   `slugify(title)` = lowercase, non-alphanumerics → `-`). Skipping this drops it into the
   auto "More Tracks" section — harmless but ungrouped.
3. Generate its **topic page**: copy an existing `tracker/topics/<slug>.html`, and change
   the final `renderTopic("<slug>", "topic")` call + the `<title>`. The slug must equal
   `slugify(moduleTitle)` or the page shows "Track not found".
4. Bump `sw.js` `CACHE` and add the new topic page to `SHELL`.

### B2. Structure a topic page well (the house style)
When a track's content comes from courses/blogs, DON'T dump everything as one flat item list
with duplicated reading sub-bullets — it reads as clutter. Follow the pattern used by
`prompt-context-engineering` (and `claude-agent-sdk-…`):

1. **Segregate by discipline** into a few clean, **deduplicated** topic sub-topics — one
   concept per bullet, phrased as a study topic (e.g. "Prompt Engineering — Topics",
   "Context Engineering — Topics"). No `sub:true` reading trees, no repeating the same
   concept across sections.
2. **Put the courses/reading in a phase-wise plan, not in the topic list.** Add an `ENRICH`
   entry keyed by the track slug. For a multi-discipline track use `sectionPlans` so **each
   topic list is followed by its own phase-wise study map** — phases with a one-line outcome
   and the primary course/reading link(s) per phase (see `references/architecture.md` §4 and
   the `phasePlanPanel` renderer). This is how "for each topic, provide the phase-wise study
   with course links" is done. Break a course down by section/phase **only** inside the phase
   plan's per-phase link labels (e.g. "Course — §6–9") — NEVER as `sub:true` pseudo-items in a
   sub-topic. A course/blog is ONE linked item; its section breakdown belongs in the plan.
3. **Every driving course/reading must ALSO be a linked item in a `Courses` (or
   `Courses & Reading`) sub-topic in `data.js` — not only in the `ENRICH` phase plan.** The
   `ENRICH` layer is presentational: a source that lives *only* in a phase plan has no progress
   dot and never appears in the auto **Reference** section, so it silently isn't trackable and
   looks "missing" from the track's data. List the driving course(s) as `data.js` items (mark
   the spine course, e.g. "… — primary course; drives the phase plan"); the phase plan then
   references those same sources per-phase. Keep the two in sync — if a course appears in the
   plan, it must appear in `Courses`.
4. **Mirror the FDE module's companion fields** when the track maps to an FDE module: add a
   **Build** sub-topic (the FDE `build` deliverable, `tags:["build"]`), keep the **Projects**
   sub-topic, and add a **Resources** sub-topic for the FDE `resources` (as links,
   `tags:["docs"]`).

Result order on the page: intro box → [Topics A → its phase plan] → [Topics B → its phase
plan] → Courses & Reading → Build → Projects → Resources → auto Reference. Verify FDE
coverage (below) after.

### B3. Verify a track covers its FDE module (do this for tracks on the FDE path)
The FDE roadmap is the source of truth for which topics a track must cover. Its modules live
in `files/fde-agentic-engineering-tracker.jsx` as `{ id, title, topics:[…], build, projects,
resources }`. When creating/editing an FDE-path track (its slug is in a `📍`-prefixed
`HUB_SECTIONS` entry), open the matching FDE module and confirm **every** string in its
`topics` array is represented in the track's topic lists. Restructures can silently drop
topics (removing a "Topics" section drops whatever only lived there) — so after any cleanup,
re-map FDE topics → track items and re-add any that fell out. The track should be a
**superset** of the FDE module (extra depth is fine; missing FDE topics is not).

### C. Build a WHOLE NEW tracker (e.g. Data Engineering)
The lightest path reuses the entire engine — only the **data** and **section grouping**
change. Follow `references/architecture.md` "New tracker checklist". In short:
- New `*-data.js` (or reuse `data.js` with more modules), new hub HTML mounting
  `LT_TRACKER.renderHub`, the same `tracker.js`/`tracker-app.js`/`topic-status.js`/CSS, a
  topic-page template, and (optionally) a themed hero. Point the landing card at it.

## The data shape (authoritative)

```js
window.LEARNING_DATA = [
  {
    "title": "🎓 Module / Track Title",     // unique; slug = slugify(title)
    "topics": [
      {
        "title": "Sub-topic name",
        "items": [
          {
            "t": "Resource title (required)",
            "link": "https://…",            // optional; omit for a plain checklist line
            "done": true,                    // optional seed status
            "badge": "prog",                 // optional seed status = in-progress
            "stars": 5,                      // optional 0–6 rating
            "due": "2026-06-25",             // optional YYYY-MM-DD
            "priority": true,                // optional ⚑
            "tags": ["udemy","github"],      // optional chips
            "sub": true                      // optional: render as indented sub-item
          }
        ]
      }
    ]
  }
];
```
Rules: `title` per module must be **unique** (it's the id namespace + slug source). Item
`t` is required; everything else optional. Don't reorder/delete built-in items casually —
their `b:` ids are positional, so inserting mid-array shifts every later item's id (and thus
its saved status). Append within a topic when possible; if you must reorder, know that saved
progress keyed to old indexes will move.

## UI + progress features (what exists — preserve these)

- **Hub accordion**: sections + tracks collapsible (`<details>`/`<summary>`), Expand/Collapse
  all, per-track topic bullets with counts, "Phase-wise plan ready" badge (from `ENRICH`),
  live stat pills.
- **Phase-wise study plans (topic page)**: `ENRICH[slug]` renders an intro box + one or more
  phase plans (per-phase outcome + course/reading links). Use `phases` for one global plan or
  `sectionPlans` to render a plan after each matching sub-topic section — see task B2.
- **Editing (hub)**: add/edit/delete items; add/rename/delete sub-topics; add/rename/delete
  modules — all via a modal, persisted + synced.
- **Progress (topic page)**: click a dot to cycle `○ todo → ◐ in-progress → ✓ done`; folds
  onto the seed flags; shared with the hub via the same id + storage key.
- **Sync**: bottom-right pill — "Local only" (no config), "Sign in to sync", "Syncing…",
  "Synced". Google OAuth → per-user RLS row → realtime across devices.
- **3D heroes**: anime.js constellation (hub) + confetti (home), mouse-parallax, staggered
  word reveals, count-up stats. Reduced-motion + no-anime fallbacks; loop pauses off-screen.

## Guardrails

- **Never mutate `data.js` to store a user's progress** — progress belongs in `state`
  (localStorage/Supabase). `data.js` is the shared seed only.
- **Don't silently drop FDE topics when restructuring.** For any FDE-path track, re-check
  coverage against its `files/fde-agentic-engineering-tracker.jsx` module after edits (task
  B3). Deleting/merging a sub-topic can remove the only place an FDE topic lived.
- **Keep the two id schemes identical** across `tracker.js`, `tracker-app.js`,
  `topic-status.js` (`b:module::topic::index`). If they drift, progress silently detaches.
- **Keep the read-only path working**: `tracker.js` must render fine when `LT_EDIT` and
  `LT_STATUS` are both absent (that's how the raw seed renders). Guard every hook with
  `if (window.LT_EDIT …)`.
- **Any new file → add to `sw.js` `SHELL` and bump `CACHE`**, or it won't load offline / a
  stale cache will serve old assets. After shipping, hard-reload (SW is network-first for
  same-origin, so a normal reload usually suffices; ignore-cache reload is the sure fix).
- **Supabase key is public-safe ONLY because of RLS.** If you spin up a new project, run
  `supabase/schema.sql` first, and add the deploy origin to Supabase Auth + Google OAuth
  redirect URLs. Rotate the key if it ever lived in a public repo.
- **Verify in a browser** (serve with `python3 -m http.server`, drive with Chrome DevTools
  MCP): no console errors, hub renders N tracks, a status cycle persists, topic pages render,
  reduced-motion/no-anime fallbacks show content.
- **After any track edit, run the `review-tracker` skill** (or directly
  `node .claude/skills/review-tracker/scripts/validate.mjs . <slug>`) — it catches schema
  breaks, slug↔page↔`renderTopic` mismatches, and `sectionPlans` keys that don't match a
  sub-topic title (which silently drop a phase plan).

## Terminology (this project)
- **new tracker** = `tracker/index.html` (topic-first hub). **old tracker** = the deleted
  `ai-engineering.html`; do not resurrect it.
- "module" and "track" are the same top-level unit. "topic" = sub-topic. "item" = a resource/link.
