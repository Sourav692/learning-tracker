---
name: review-tracker
description: Validate the structure and conventions of the topic-first learning tracker in this repo — checks the data.js schema, slug↔topic-page↔renderTopic wiring, ENRICH/sectionPlans key matching, HUB_SECTIONS grouping, the house-style topic-page layout (task B2 of build-tracker), and FDE-module coverage (task B3). Use whenever the user asks to review/validate/check a track, a topic page, or the whole tracker, or after editing data.js / tracker.js / topic pages.
---

# Review a Topic-First Learning Tracker

Companion to **`build-tracker`** (which *creates* tracks). This skill *validates* them —
run it after any change to `data.js`, `tracker/tracker.js`, `tracker/topics/*.html`, or the
`ENRICH` layer, and whenever the user asks to "review / validate / check" a track or the
tracker as a whole. Read `../build-tracker/SKILL.md` and its `references/architecture.md` for
the conventions being enforced here.

## Two layers of review

1. **Deterministic structure** → run the validator script. It cannot judge meaning, only shape.
2. **Semantic review** → you do this by reading, because it needs judgment (FDE coverage,
   dedup quality, whether the house-style layout actually reads well).

Always run BOTH. The script is fast and catches the silent-breakage bugs; the read-through
catches the "technically valid but wrong" ones.

## Step 1 — run the structural validator

```bash
node .claude/skills/review-tracker/scripts/validate.mjs .                          # whole tracker
node .claude/skills/review-tracker/scripts/validate.mjs . <slug>                   # one track
```

It loads `data.js` (via a `window` shim), statically parses `tracker/tracker.js`
(`HUB_SECTIONS`, `ENRICH`, `sectionPlans`), and checks:

- **Schema**: every module has a unique non-empty `title` + a `topics` array; every topic has
  a `title` + `items`; every item has required `t`; `link` is http(s); `tags` is an array;
  `stars` 0–6; `due` is `YYYY-MM-DD`; flags unknown item fields; flags duplicate item text
  within a sub-topic and duplicate sub-topic titles.
- **Wiring**: a `tracker/topics/<slug>.html` exists for each module where `slug =
  slugify(title)`, and it calls `renderTopic("<slug>", …)`. Mismatch → the page shows "Track
  not found".
- **ENRICH/sectionPlans**: every `sectionPlans` key **exactly equals** a real sub-topic title
  — a mismatch makes that phase plan silently not render (this is the #1 easy-to-miss bug).
- **Grouping**: warns if a slug isn't in any `HUB_SECTIONS` group (falls into auto "More
  Tracks").

Exit code: `0` = no errors (warnings OK), `1` = errors, `2` = couldn't run (bad `data.js`).
Report the script's ERRORS and WARNINGS to the user verbatim; fix errors, triage warnings
(some duplicates are intentional).

The validator's `slugify` is copied from `tracker/tracker.js`. If that function ever changes,
update the copy in `scripts/validate.mjs`.

## Step 2 — semantic review (read the track)

Open the module in `data.js` (and its `ENRICH` entry in `tracker.js`) and judge against the
`build-tracker` house style:

- **B2 layout**: Are topics **segregated by discipline** into clean, **deduplicated** topic
  lists (one concept per bullet), rather than a flat dump with `sub:true` reading trees? Are
  courses/reading in **phase plans** (`ENRICH` `phases`/`sectionPlans`), not stuffed into the
  topic bullets? Expected page order: intro → [Topics A → its phase plan] → [Topics B → its
  phase plan] → Build → Projects → Resources → auto Reference.
- **B3 FDE coverage** (only for FDE-path tracks — slug is in a `📍`-prefixed `HUB_SECTIONS`
  entry): open the matching module in `files/fde-agentic-engineering-tracker.jsx` (match by
  `title`). Confirm **every** string in its `topics` array is represented somewhere in the
  track's topic lists, and that `build` / `projects` / `resources` are reflected (as a Build
  sub-topic, Projects items, Resources links). The track must be a **superset** — extra depth
  is fine, missing FDE topics is a defect. List any gaps explicitly.
- **Link sanity**: spot-check that phase-plan course links and Resources links point where the
  labels claim (the script only checks URL shape, not destination).

## Step 3 — report

Give the user a short verdict:
- ✅/❌ structural (from the script, with any errors/warnings),
- ✅/❌ house-style B2,
- ✅/❌ FDE coverage B3 (with a topic-by-topic gap list if anything is missing).

Offer to fix what you found (via `build-tracker`) rather than fixing silently, unless the user
already asked for fixes.

## Guardrails
- **Read-only by default.** Reviewing ≠ editing. Don't change `data.js`/`tracker.js` during a
  review unless the user asks; if you do fix, re-run Step 1 afterward.
- **Don't "fix" intentional duplicates** — some repeated links across tracks are deliberate.
  Surface them as warnings and let the user decide.
- **A green script is necessary, not sufficient** — always also do Step 2. Structure can be
  valid while coverage or layout is wrong.
