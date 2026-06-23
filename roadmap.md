# Learning Tracker — Product Roadmap

Plan to evolve this from a personal tracker into a production-grade learning product.
Status legend: ✅ done · 🚧 in progress · ⬜ planned.

---

## 0. Architecture / refactor

- ✅ **Split the monolith** — extracted the single `index.html` into:
  - `index.html` — landing page (shell)
  - `ai-engineering.html` — the AI Engineering tracker shell
  - `styles.css` — all styling (tracker + landing/placeholder)
  - `data.js` — seed learning content (`window.LEARNING_DATA`)
  - `config.js` — Supabase project config
  - `app.js` — application logic (render, edit, drag-reorder, sync, auth)
- ✅ **Multi-tracker landing page** — `index.html` is now the front door with three
  ticket-stub cards: AI Engineering (live), Data Engineering + Databricks Path
  (`data-engineering.html` / `databricks.html` coming-soon placeholders).
- ⬜ **Namespace storage per tracker** — `app.js` currently uses fixed keys
  (`cip-tracker-data-v2`, `cip-tracker-v2`) and a single Supabase row, so all
  trackers would share one progress blob. Before Data Engineering / Databricks
  become real trackers, key localStorage + the cloud row by a `trackId`
  (e.g. `tracker_state` row per `(user_id, track)` or a `track` field in `data`)
  so each path tracks progress independently. Pass the active `trackId` into the
  app from each tracker page.
- ⬜ Move seed content out of a JS literal into the DB / a fetched JSON so content
  can change without a code deploy (pairs naturally with per-tracker data files,
  e.g. `data/ai-engineering.json`).
- ⬜ Introduce a build step (bundling, minification, cache-busting) once the app
  outgrows plain `<script>` tags.
- ⬜ Add a `schemaVersion` field to persisted data + a migration runner.
- ⬜ Automated tests (unit for model/order logic, smoke/E2E for the UI).
- ⬜ Error monitoring (e.g. Sentry) and a visible toast layer instead of silent
  `catch{}` / `console.error`.

## 1. Production foundations

- ✅ **Auth — Google OAuth** via Supabase Auth (sign in / sign out, account pill).
- ✅ **Per-user data isolation + RLS** — one row per `auth.uid()` in
  `tracker_state`, owner-only Row-Level Security policies (`supabase/schema.sql`).
- ✅ **Local-first fallback** — fully usable logged out; cloud sync layers on after
  sign-in (seeds cloud from local on first login, else cloud wins).
- ✅ Data **export / import** (JSON) + manual backup/restore — Export/Import buttons
  on the tracker; backup carries `{custom, edits, topicEdits, order, activity, state}`.
  *(Markdown/CSV export still ⬜.)*
- ✅ **PWA**: `manifest.json` + `sw.js` (app-shell cache, offline-capable, installable);
  registered on all pages, `icon.svg` marquee mark.
- ⬜ Full **mobile-responsive** layout pass.
- ⬜ **Accessibility**: keyboard-accessible drag-reorder, ARIA on custom
  checkboxes/menus, focus management in modals.
- ⬜ Conflict handling for simultaneous multi-device edits (currently last-write-wins).

## 2. Learning-specific features

- ✅ **Due dates** per item with overdue / due-soon pills (stored in `edits[id]`).
  *(Calendar reminders / "in progress since" staleness still ⬜.)*
- ✅ **Notes** per item (free text, shown under the item, searchable).
- ⬜ **Reminders & notifications** (email / push) for due or stalled items.
- ⬜ **Time tracking** — estimated vs. actual hours; weekly totals.
- ⬜ **Spaced-repetition / review queue** to resurface completed material.
- ⬜ **Resource enrichment** — auto-fetch title/favicon/duration, classify type
  (video / course / article / repo), per-item rating (stars already exist).
- ⬜ **Tags & priority** with filtering.

## 3. Insights & motivation

- ✅ **Insights modal** — current/longest streak, items-done, completions logged.
- ✅ **Activity heatmap** (GitHub-style, last 18 weeks) driven by an `activity`
  completion log (date → count), synced in the data blob.
- ✅ **Per-module progress** bars in the Insights view.
- ⬜ **Goals** — weekly goals / targets (streak counter shipped above).
- ⬜ **Gamification** — badges / XP / levels.
- ⬜ **Weekly digest** email ("finished this week / slipping").

## 4. Sharing & growth

- ⬜ **Shareable / public learning paths** (read-only, clonable).
- ⬜ **Templates / starter tracks** users can fork.
- ⬜ **Import** from Notion / Markdown / YouTube playlists.
- ⬜ **Accountability partners / cohorts** with shared progress visibility.

## 5. UX polish

- ⬜ **Command palette (⌘K)** + keyboard shortcuts.
- ⬜ **Undo / redo** (esp. after delete & reorder) and **bulk actions** (multi-select).
- ⬜ **Light / dark theme** toggle.
- ⬜ **Hide-completed** toggle and saved filter views.
- ⬜ First-run **onboarding** + empty states.

---

## Suggested sequence

1. ✅ Refactor → ✅ Auth + RLS
2. ✅ Export/import + PWA  *(durability)*
3. ✅ Due dates + notes  *(core learning value)*
4. ✅ Analytics + streaks + heatmap  *(engagement)*
5. ⬜ Mobile-responsive + accessibility pass  *(polish — now public)*
6. ⬜ Sharing + templates  *(growth)*

> **Note:** Auth uses Google OAuth, which requires the app to be hosted over
> http/https. See `SUPABASE_SETUP.md` for the one-time Supabase + Google Cloud setup.
