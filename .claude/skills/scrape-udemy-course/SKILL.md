---
name: scrape-udemy-course
description: Scrape a Udemy course curriculum (sections + lecture titles) using the Playwright MCP and append it to a TOPIC-SPECIFIC markdown file at the project root (e.g. prompt-engineering.md, data-engineering.md). Use whenever the user asks to "scrape"/"scrap" a Udemy course, or pastes a udemy.com/course/ link and wants its curriculum captured.
---

# Scrape Udemy Course Curriculum

Extracts the full course content (sections + lecture titles + per-section stats) from a
Udemy course landing page and **appends** it to a **topic-specific** markdown file at the
project root — e.g. all prompt-engineering courses go into `prompt-engineering.md`, data
courses into `data-engineering.md`, and so on. Each course lives as its own `##` section
inside its topic file.

## When to use

Trigger when the user asks to scrape (or "scrap") a Udemy course, or gives a
`https://www.udemy.com/course/...` link and wants the curriculum captured.

## Output document — one file per topic

Courses are grouped by **topic**, one markdown file per topic at the project root, named
`<topic-slug>.md` (kebab-case), e.g. `prompt-engineering.md`, `data-engineering.md`,
`databricks.md`, `ai-engineering.md`.

**Choosing the topic (auto-infer, ask if unsure):**
1. If the user names a topic in their request (e.g. "scrape X into data-engineering"), use
   that — slugified to kebab-case.
2. Otherwise **infer** the topic from the course title and section titles and pick a concise
   kebab-case slug (e.g. a prompt-engineering course → `prompt-engineering`). Prefer reusing
   an existing `<topic>.md` at the project root over inventing a near-duplicate (check the
   existing `*.md` files first).
3. If you can't confidently classify the course into a clear topic (or it plausibly fits two
   existing topics), **ask the user** which topic file to use before writing.

**Writing rules:**
- If `<topic>.md` doesn't exist, create it with the header template below.
- **Never overwrite existing courses** — append the new course as a new `##` section at the
  end of the topic file.
- If a course with the same link already exists in that file, replace that section in place
  instead of adding a duplicate.

Header to use when creating a topic file fresh (`<Topic>` = Title Case of the slug):

```markdown
# <Topic> — Course Curriculums

Scraped Udemy course curriculums on **<topic>** (via Playwright MCP). Each course is a `##` section below.

---
```

## Procedure

1. **Navigate** to the course URL with `mcp__playwright__browser_navigate`.
   - Udemy may redirect (e.g. swapping the `couponCode`) and re-render; that's fine.
   - The Playwright MCP tools are deferred — load them first via
     `ToolSearch` with `select:mcp__playwright__browser_navigate,mcp__playwright__browser_evaluate,mcp__playwright__browser_click`.

   Do the next three sub-steps as **separate tool calls** (do not combine "reveal", "expand",
   and "extract" into one evaluate — freshly-toggled panels aren't laid out yet, see gotchas).

2a. **Reveal all hidden sections.** Udemy previews only ~10 sections and hides the rest behind
   a button labelled "N more sections". That button is `button[data-purpose="show-more"]`
   **inside** `[data-purpose="course-curriculum"]`. A JS `.click()` does **not** reliably fire
   its React handler — click it with the real Playwright click tool:

   ```
   mcp__playwright__browser_click  target: '[data-purpose="course-curriculum"] button[data-purpose="show-more"]'
   ```

   ⚠️ Do NOT click the page's other `_full-width` "Show more" button — that one is the course
   **description** expander (it lives *outside* the curriculum container) and clicking it can
   blank out the curriculum. Always scope to `[data-purpose="course-curriculum"]`.
   Repeat the click until `[data-purpose="course-curriculum"] button[data-purpose="show-more"]`
   no longer exists (larger courses reveal all remaining sections in one click, but re-check).

2b. **Expand every section panel** (lecture rows only exist in the DOM once expanded), via
   `browser_evaluate`:

   ```js
   () => {
     const root = document.querySelector('[data-purpose="course-curriculum"]');
     root.querySelectorAll('[aria-expanded="false"]').forEach(t => t.click());
     return {
       sections: root.querySelectorAll('[class*="section-title"]:not([class*="container"])').length,
       lectureTitles: root.querySelectorAll('[class*="course-lecture-title"]').length,
       moreSectionsLeft: !!root.querySelector('button[data-purpose="show-more"]'),
     };
   }
   ```

2c. **Extract** in a *separate* `browser_evaluate` call, walking section titles / stats /
   lecture titles in document order. Udemy's class names are CSS-module hashed (e.g.
   `curriculum-section-module-scss-module__XXXX__course-lecture-title`), so match on class
   **substrings**. Use **`textContent`**, NOT `innerText` — `innerText` returns `''` for
   just-expanded panels whose layout hasn't computed, silently dropping every lecture title.

   ```js
   () => {
     const clean = s => (s || '').replace(/\s+/g, ' ').trim();
     const root = document.querySelector('[data-purpose="course-curriculum"]');
     if (!root) return { error: 'no curriculum container found' };
     const nodes = root.querySelectorAll(
       '[class*="section-title"], [class*="section-content-stats"], [class*="course-lecture-title"]'
     );
     const sections = [];
     let cur = null;
     nodes.forEach(n => {
       const cls = n.getAttribute('class') || '';
       const txt = clean(n.textContent);
       if (/section-title/.test(cls) && !/container/.test(cls)) {
         cur = { section: txt, stats: '', lectures: [] };
         sections.push(cur);
       } else if (/section-content-stats/.test(cls)) {
         if (cur && !cur.stats) cur.stats = txt;
       } else if (/course-lecture-title/.test(cls)) {
         if (cur) cur.lectures.push(txt);
       }
     });
     return {
       courseTitle: clean(document.querySelector('h1')?.textContent) || document.title,
       totalSections: sections.length,
       totalLectures: sections.reduce((a, s) => a + s.lectures.length, 0),
       sections,
     };
   }
   ```

   Sanity check: the number of rendered `[class*="section-title"]` (from 2b) should equal
   `totalSections`. If any section's `lectures` array is empty or full of blank strings,
   re-run 2c (layout hadn't settled). If sections are missing, a "N more sections" button was
   left unclicked — go back to 2a.

   Notes:
   - `browser_evaluate`'s `filename` param saves on the MCP server side, not the local repo —
     capture the result inline instead.
   - Use the real on-page course title (`h1`), which can differ from the URL slug.

3. **Decide the topic** (see "Choosing the topic" above), then **append to `<topic>.md`** in
   this format (use the canonical link with the `couponCode` query param stripped):

   ```markdown

   ---

   ## <Course Title>

   - **Link:** https://www.udemy.com/course/<slug>/
   - **Scraped:** <YYYY-MM-DD>
   - **Overview:** <N sections · N lectures>. <one-line description if known>

   ### 1. <Section Title> — _<stats, e.g. 9 lectures • 25min>_
   1. <Lecture title>
   2. <Lecture title>
   ...
   ```

4. **Update the master index `courses-index.md`** (project root). This file lists every
   scraped course with its Udemy link and the topic file that holds its curriculum. Keep it
   in sync on every scrape:
   - If `courses-index.md` doesn't exist, create it with this shape:

     ```markdown
     # Course Index

     Master index of scraped Udemy course curriculums. Each row links to the course on Udemy and to the topic markdown file that holds its full curriculum.

     **Total: <N> courses across <M> topic files.**

     | # | Course | Curriculum File | Udemy Link |
     |---|---|---|---|
     | 1 | <Course Title> | [`<topic>.md`](<topic>.md) | [Udemy](https://www.udemy.com/course/<slug>/) |
     ```

   - Add one row per newly scraped course: `<Course Title>`, a link to its `<topic>.md`, and
     the canonical Udemy link (couponCode stripped). Escape `|` in the title.
   - If the course (same Udemy link) is already in the index, update its row in place instead
     of adding a duplicate. Re-number rows and refresh the "Total: N courses across M topic
     files" line (and any "By topic" summary) after changes.
   - The simplest robust way to keep it correct is to **regenerate** it by parsing the `##`
     course headings and `**Link:**` lines out of every topic `*.md` file (skip non-course
     files like `krishnaik-projects.md`, `roadmap.md`). A short Node/Bash script that walks the
     topic files and rewrites `courses-index.md` avoids drift.

5. **Confirm** to the user: course title, section count, lecture count, which topic file it was
   appended to (or created), and that `courses-index.md` was updated.

## Tips

- Udemy's "N lectures" stat can differ slightly from the number of rendered rows (extra
  notice/resource items). Report the scraped counts; don't force them to match.
- No Udemy login is required — the curriculum preview is on the public landing page.
- When scraping several courses at once, group them into the same topic file where they
  belong rather than one file per course.
