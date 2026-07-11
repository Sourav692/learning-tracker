---
name: scrape-krishnaik-projects
description: Scrape the Krish Naik real-world projects catalog (krishnaik.in/projects) using the Playwright MCP and write it as a markdown TABLE to krishnaik-projects.md at the project root. Use whenever the user asks to scrape/refresh the krishnaik.in projects listing.
---

# Scrape Krish Naik Projects Catalog

Extracts every project from [krishnaik.in/projects](https://www.krishnaik.in/projects) and writes
a single markdown **table** to `krishnaik-projects.md` at the project root, with columns:
**# · Category · Project (linked) · Difficulty · Description · Tools / Frameworks**.

This is a **full snapshot** — overwrite `krishnaik-projects.md` on each run (don't append).

## When to use

Trigger when the user asks to scrape, re-scrape, or refresh the krishnaik.in projects catalog.

## Key insight — use the embedded `__NEXT_DATA__`, not the DOM cards

The page is Next.js and ships all project records in a `<script id="__NEXT_DATA__">` JSON blob.
Read that instead of scraping visible cards — it's complete and structured, and crucially it
contains the **tools/frameworks** per project (the `subcategories` field), which are NOT shown
as text on the cards.

- Array path: `data.props.pageProps.projects` (79+ items).
- Per-project fields: `title`, `slug`, `overview` (description), `difficulty_level`,
  `category.name`, `subcategories` (→ **Tools / Frameworks**), `skills` (usually empty —
  ignore), `instructors`, `tagmango_url`.
- Detail page URL = `https://www.krishnaik.in/project/<slug>`.

## Procedure

1. **Load Playwright tools** (deferred): `ToolSearch` with
   `select:mcp__playwright__browser_navigate,mcp__playwright__browser_evaluate`.

2. **Navigate** to `https://www.krishnaik.in/projects` with `mcp__playwright__browser_navigate`.

3. **Extract** the project records with one `browser_evaluate` call:

   ```js
   () => {
     const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
     const projects = data.props.pageProps.projects;
     const clean = s => (s || '').replace(/\s+/g, ' ').trim();
     return projects.map(p => ({
       title: clean(p.title),
       category: clean(p.category?.name),
       difficulty: p.difficulty_level,
       description: clean(p.overview),
       tools: (p.subcategories || []).map(clean).filter(Boolean),
       slug: p.slug,
     }));
   }
   ```

   If the result is large, the MCP persists it to a tool-results JSON file and returns only a
   preview. Either way, don't hand-transcribe 79 rows — build the file programmatically (step 4).

4. **Build the table + write the file.** The reliable path is a small Node script (via Bash)
   that reads the persisted tool-result JSON, pulls out the projects array, and writes
   `krishnaik-projects.md`. When reading the persisted file: join the content blocks' `text`,
   slice between `### Result` and the `### Ran Playwright` footer, then `JSON.parse` the `[...]`.

   Table rules:
   - Columns: `# | Category | Project | Difficulty | Description | Tools / Frameworks`.
   - **Project** cell = `[<title>](https://www.krishnaik.in/project/<slug>)`.
   - **Tools / Frameworks** = `tools.join(', ')` (fallback `—` if empty).
   - **Difficulty** = capitalized `difficulty_level` (Beginner/Intermediate/Advanced).
   - **Escape `|`** as `\|` in every cell (titles/descriptions/tools can contain pipes) and
     collapse whitespace — table cells must be single-line.
   - Sort rows by category (largest category first is fine), stable within a category.
   - Header block: title, a one-line "scraped from … on <YYYY-MM-DD>" note, and a
     `**Categories:** <Name> (<n>) · …` summary line.
   - Note the site has BOTH a `Generative AI` and a separate `Gen AI` category — keep them
     distinct (don't merge) to stay faithful to the source.

5. **Confirm** to the user: total project count, number of categories, and that
   `krishnaik-projects.md` was written.

## Notes

- `browser_evaluate`'s `filename` param saves on the MCP server side, not the local repo — don't
  rely on it for local files.
- This catalog is standalone; it is unrelated to the topic-specific Udemy files produced by the
  `scrape-udemy-course` skill.
- **Not part of `courses-index.md`.** That master index tracks Udemy *course curriculums*
  only. This skill produces a *projects* catalog, so do NOT add its projects to
  `courses-index.md`.
