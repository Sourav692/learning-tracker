# Tracker architecture — the technical contract

Read this before touching `tracker.js`, `tracker-app.js`, or `topic-status.js`. It documents
the exact data merge, id scheme, sync protocol, animation anatomy, and a copy-paste checklist
for a brand-new tracker. Everything here is derived from the live, verified implementation.

---

## 1. Data model & the merge (`buildModel`)

`data.js` exposes `window.LEARNING_DATA` = `[ module, … ]`. Shape in SKILL.md.

The **hub** does NOT render the raw seed directly when the edit engine is present.
`tracker-app.js` runs `buildModel()` which layers user edits over the seed and **replaces**
`window.LEARNING_DATA` with the merged model, then calls `LT_TRACKER.renderHub("hub")`.

Layers (all in localStorage key `lt-hub-data-v1`, an object):
- `custom` — `{ moduleTitle: { topicTitle: [ item, … ] } }` — user-added items and, for
  brand-new modules/topics, their existence. New modules live *only* here.
- `edits` — `{ id: {…overrides…, deleted?:true} }` — per-item field overrides + soft delete.
- `topicEdits` — `{ "module::topic": {title?, deleted?} }` — sub-topic rename/delete.
- `sectionEdits` — `{ "module": {title?, deleted?} }` — module rename/delete.
- `order` — `{ sections:[titles…], topics:{ module:[topicTitles…] } }` — drag order (by
  ORIGINAL titles, i.e. `_origModule`/`_origTopic`).
- `settings` — reserved.

`buildModel()` walks the seed modules, then appends custom-only modules. For each item it
does `assign({}, seedItem, edits[id] || {}, {_id:id})` then `withStatus(item)`. Deleted
items/topics/modules are skipped. The merged module carries `_origModule` (its seed key) and
each topic carries `_origTopic` — these are what `order`, `edits` ids, and rename lookups key
on. Display title = `sectionEdits[title].title || title`.

**Progress state** is a SEPARATE object, localStorage key `lt-hub-state-v1` =
`{ id: 'todo'|'prog'|'done' }`. `withStatus()`/`fold()` fold it onto `done`/`badge` so the
renderer's dot is correct. `statusOf(item)`: explicit state wins, else seed `done`/`badge`,
else `todo`.

## 2. The stable id scheme (critical — keep identical in all 3 JS files)

```
built-in item:  "b:" + moduleTitle + "::" + topicTitle + "::" + index
custom item:    "c:" + moduleTitle + "::" + topicTitle + "::" + n
```
- `moduleTitle`/`topicTitle` are the **original seed titles** (not display/renamed titles).
- `index` is the item's position in the seed topic's `items[]`. **Positional** — inserting
  an item mid-array reindexes every later item, detaching their saved status. Append, or
  accept the shift.
- `topic-status.js` and `renderTopic` recompute these ids the same way, so status set on the
  hub shows on the topic page and vice-versa. If you change the format anywhere, change it
  everywhere or progress silently breaks.

## 3. Render hooks (how the read-only renderer stays decoupled)

`tracker.js` is standalone and read-only. It calls optional globals only if present:
- `window.LT_EDIT` (hub, from `tracker-app.js`): `.moduleControls(sec)`, `.topicControls(sec,tp)`,
  `.topicAdder(sec)`, `.moduleAdder()` — each returns a DOM node injected into the accordion.
- `window.LT_STATUS` (topic page, from `topic-status.js`): `.fold(it)` (mutate done/badge
  before render), `.attach(it, dot, textEl)` (make the dot clickable to cycle status).
- `window.LT_TRACKER` (exported by tracker.js): `.renderHub`, `.renderTopic`,
  `.rerenderTopic`, `.slugify`. `renderHub`/`renderTopic` clear their mount first, so they're
  safely re-callable after an edit or a sync push.

Invariant: with neither hook present, both views must render the plain seed correctly. Always
guard: `if (window.LT_EDIT && window.LT_EDIT.moduleControls) …`.

## 4. Hub sections & enrichment (`tracker.js` top)

- `HUB_SECTIONS` = `[{ title, blurb, slugs:[…] }]`. Tracks are grouped by matching
  `slugify(moduleTitle)` to a section's `slugs`. Unmatched tracks collect into a trailing
  "🗂️ More Tracks" section (nothing ever disappears). Sections render collapsed by default
  (`renderSection(..., {open:true})` to force-open one).
- `ENRICH` = `{ slug: { title, body, docs?, phases?, sectionPlans?, topups?, topupNote? } }`
  — an optional curated intro + "phase-wise plan" panel(s) shown on a track's topic page.
  Adds the "Phase-wise plan ready" badge on the hub. Purely presentational. Two examples
  live in `tracker.js`: `claude-agent-sdk-…` (one global plan) and `prompt-context-engineering`
  (per-section plans). Fields:
  - `title` + `body` → the `.enrich` intro box. `docs` (optional) → companion doc-link
    buttons; omit if the track has no companion pages (renderer guards `if (enr.docs)`).
  - `phases` = `[[n, name, outcome, [[courseLabel, url], …]], …]` → ONE global phase plan
    rendered right after the intro (use for a single-discipline track).
  - `sectionPlans` = `{ "<sub-topic title>": { title, lead?, phases } }` → a SEPARATE phase
    plan rendered **immediately after the matching sub-topic section**. Use this to give a
    track with multiple disciplines its own study map per topic list (e.g. one plan under
    "Prompt Engineering — Topics", another under "Context Engineering — Topics"). The key
    must exactly equal the `data.js` sub-topic `title`. Both `phases` and `sectionPlans`
    share the reusable `phasePlanPanel(title, phases, lead)` renderer.
  - `topups` / `topupNote` → optional "does the extra course add anything?" panel.

## 5. Sync protocol (Supabase + Google, RLS)

Both `tracker-app.js` (full snapshot) and `topic-status.js` (status-only, preserving other
layers) implement the same shape:
- `config.js` → `window.APP_CONFIG {SUPABASE_URL, SUPABASE_ANON_KEY, TABLE}`.
- `initCloud()`: if unconfigured → pill "Local only". Else create client, restore session,
  subscribe to `onAuthStateChange`.
- `onSignedIn` → `pull()`: read the user's row; if non-empty `applyRemote` (writes localStorage +
  re-renders); if empty `push()` (seed the cloud from local). Then `subscribe()` to realtime.
- Any local change → `saveData/saveState` → `scheduleSync()` (600ms debounce) → `push()`.
- `push()` upserts `{ user_id, data: localSnapshot(), updated_at }`. `localSnapshot()` =
  `{custom,edits,topicEdits,sectionEdits,order,settings,state}`.
- Realtime `postgres_changes` on the user's row → `applyRemote` (skips while `applyingRemote`).
- **`topic-status.js` must NOT clobber the hub's edit layers**: its `localSnapshot()` reads
  the current `lt-hub-data-v1` verbatim and only replaces `state`. Preserve this if you touch it.

`supabase/schema.sql`: one row per `auth.uid()`, RLS select/insert/update/delete = own row
only, table added to `supabase_realtime`. Run once. The anon key is public-safe *only* because
of RLS. New deploy origin must be in Supabase Auth URL config + the Google OAuth client.

## 6. 3D hero animations (anime.js v3)

Both heroes are self-contained IIFEs, additive, and defensive:
- `reduce = matchMedia('(prefers-reduced-motion: reduce)').matches` → static single paint +
  everything set opacity:1 / transform:none. Also a `!window.anime` fallback that just reveals.
- A `<canvas>` depth field: nodes in a normalized 3D box, projected with a pinhole camera
  (`scale = FOV/(FOV + z*k)`), depth-sorted, glow via radial gradients. Seeded PRNG so layout
  is stable per session. `requestAnimationFrame` loop, **paused via IntersectionObserver when
  the hero scrolls off-screen**.
- Mouse-parallax: eased pointer offset drives `translate3d`/`rotateX`/`rotateY` on the copy
  layer (hub) and node drift.
- Reveal: `anime.timeline` with per-word title spans (split preserving `<em>`), spring easing,
  `anime.stagger`. Hub also count-ups the stat pills (watches for async-rendered pills).
- CSS pre-hides copy (`.hero3d-on`/`.home3d-on … {opacity:0}`) so nothing flashes before JS;
  a reduced-motion `@media` block forces it visible. If JS never runs, add a safety timeout
  (home-hero does) so content can't stay hidden.

Theme per page: hub = dark/teal constellation; home = warm circus confetti. Match the host
page's palette + fonts.

## 7. New-tracker checklist (copy-paste)

To stand up a brand-new tracker (e.g. Data Engineering) reusing the whole engine:

1. **Data**: create the seed array (either extend `data.js` with new modules, or a new
   `de-data.js` that sets `window.LEARNING_DATA`). Follow the item shape exactly.
2. **Hub page**: copy `tracker/index.html` → e.g. `data-tracker/index.html`. Keep the
   `<header class="hdr">` hero markup (eyebrow/h1/sub/stat-row/hub-controls) and
   `<section class="hub" id="hub">`. Fix relative script `src`s. Ensure load order:
   `data.js → tracker.js → hub-seed.js(optional) → config.js → supabase CDN → tracker-app.js`,
   then the fallback `if(!window.LT_EDIT) LT_TRACKER.renderHub("hub")`, then
   `anime CDN → tracker-hero.js`.
3. **Sections**: set `HUB_SECTIONS` for the new module set (or rely on "More Tracks").
   NOTE: `HUB_SECTIONS`/`ENRICH` currently live inside `tracker.js`. For a second, independent
   tracker prefer parameterizing them (e.g. `window.LT_CONFIG.sections`) rather than forking
   `tracker.js`; if you fork, keep the id scheme + hooks identical.
4. **Topic pages**: copy a `tracker/topics/*.html` per module; set `renderTopic("<slug>")` +
   `<title>`; fix `src` depth. slug must = `slugify(moduleTitle)`.
5. **Storage keys**: if the new tracker must NOT share progress with the AI one, change
   `DATA_KEY`/`STATE_KEY` (`lt-hub-*-v1`) to a new namespace in the engine files it loads
   (and the Supabase row is still per-user — consider a `track` column or separate table if
   one user runs multiple trackers). If it SHOULD share, keep the keys.
6. **CSS**: reuse `tracker.css`. Retheme via the `:root` custom properties if a different look
   is wanted.
7. **Landing card**: point an `index.html` `.track-card` `href` at the new hub.
8. **`sw.js`**: add every new file to `SHELL`, bump `CACHE`.
9. **Supabase**: reuse the project + `schema.sql` (already per-user). Add the deploy origin to
   Auth + Google OAuth.
10. **Verify** in-browser (see SKILL.md guardrails).

## 8. Gotchas learned the hard way

- **Service worker caching**: after editing, a plain reload may serve stale JS. SW is
  network-first for same-origin so it usually updates, but use an **ignore-cache reload** to
  be certain; bumping `CACHE` forces all clients to refresh on next visit.
- **Async stat pills**: `tracker-app.js` writes the stat-row after boot; `tracker-hero.js`
  polls (`watchStats`) so the count-up still fires. Any code reading the stat pills must
  tolerate them not existing yet.
- **Renames vs stale snapshots**: a saved snapshot keyed to an OLD module title renders as a
  *duplicate* module after you rename the seed, unless a `sectionEdits` alias maps old→new.
  This bit the project once (old "Cohorts & Live Programs" vs new title). When renaming a
  shipped module, consider existing users' snapshots.
- **Positional ids**: reordering/deleting built-in items shifts later items' `b:` ids and
  detaches their saved status. Prefer appending; soft-delete via `edits[id].deleted` rather
  than splicing the seed.
- **Migration**: `hub-seed.js` shows the pattern — match old→new by **item title** (stable),
  not by id (unstable across restructures); guard with a version flag; merge, don't clobber.
