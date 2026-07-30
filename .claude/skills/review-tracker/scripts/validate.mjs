#!/usr/bin/env node
// Structural validator for the topic-first learning tracker.
// Deterministic checks only — semantic FDE-coverage judgment is left to the agent (see SKILL.md).
//
// Usage:
//   node validate.mjs [repoRoot]        # validate every module
//   node validate.mjs [repoRoot] <slug> # validate one track by slug
//
// Exit code 0 = no errors (warnings allowed), 1 = at least one error, 2 = could not run.

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.argv[2] && !process.argv[2].startsWith('-') ? process.argv[2] : '.');
const onlySlug = process.argv[3] || null;

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// slugify — MUST match tracker/tracker.js slugify() exactly.
const slugify = (t) => (String(t).toLowerCase().match(/[a-z0-9]+/g) || []).join('-');

function read(rel) {
  const p = path.join(repoRoot, rel);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

// ---- Load data.js (window shim) ----
const dataSrc = read('data.js');
if (dataSrc == null) { console.error('FATAL: data.js not found at ' + repoRoot); process.exit(2); }
let LEARNING_DATA;
try {
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function('window', dataSrc + '\n;return window.LEARNING_DATA;');
  LEARNING_DATA = new Function('window', dataSrc + '\n;return window.LEARNING_DATA;')(win);
} catch (e) {
  console.error('FATAL: data.js did not evaluate: ' + e.message); process.exit(2);
}
if (!Array.isArray(LEARNING_DATA)) { console.error('FATAL: window.LEARNING_DATA is not an array'); process.exit(2); }

// ---- Load tracker.js text for HUB_SECTIONS / ENRICH / sectionPlans extraction ----
const trackerSrc = read('tracker/tracker.js') || '';

// Slugs referenced in HUB_SECTIONS (best-effort: quoted slugs inside the HUB_SECTIONS array).
function extractHubSlugs(src) {
  const start = src.indexOf('HUB_SECTIONS');
  if (start < 0) return new Set();
  // Grab from the opening [ after HUB_SECTIONS to the matching ]; fall back to a big window.
  const open = src.indexOf('[', start);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  const block = end > open ? src.slice(open, end + 1) : src.slice(open, open + 20000);
  const slugs = new Set();
  const re = /["']([a-z0-9]+(?:-[a-z0-9]+)*)["']/g;
  let m;
  while ((m = re.exec(block))) slugs.add(m[1]);
  return slugs;
}

// Slice the `{...}` block that starts at/after index `from`, returning [block, endIndex].
function braceBlock(src, from) {
  const open = src.indexOf('{', from);
  if (open < 0) return ['', -1];
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return [src.slice(open, i + 1), i]; }
  }
  return [src.slice(open), src.length];
}

// ENRICH top-level keys → { sectionPlanKeys:Set, urls:Set } (best-effort static parse).
// urls = every http(s) URL that appears anywhere in that slug's ENRICH sub-block (i.e. the
// course/reading links referenced by its phase plans).
function extractEnrich(src) {
  const out = {};
  const start = src.indexOf('ENRICH');
  if (start < 0) return out;
  const [block] = braceBlock(src, start);
  // Walk top-level slug keys and slice each one's own sub-block.
  const keyRe = /["']([a-z0-9]+(?:-[a-z0-9]+)*)["']\s*:\s*\{/g;
  let m;
  while ((m = keyRe.exec(block))) {
    const slug = m[1];
    const [sub, end] = braceBlock(block, m.index + m[0].length - 1);
    const urls = new Set();
    let u;
    const urlRe = /https?:\/\/[^\s"'`)\]]+/g;
    while ((u = urlRe.exec(sub))) urls.add(u[0].replace(/[.,]+$/, ''));
    const sectionPlanKeys = new Set();
    const spIdx = sub.indexOf('sectionPlans');
    if (spIdx >= 0) {
      const [spBlock] = braceBlock(sub, spIdx);
      const titleRe = /["']([^"']+)["']\s*:\s*\{/g;
      let tm;
      while ((tm = titleRe.exec(spBlock))) sectionPlanKeys.add(tm[1]);
    }
    if (!out[slug]) out[slug] = { sectionPlanKeys, urls };
    // advance past this slug's block so nested keys aren't treated as top-level
    keyRe.lastIndex = end > 0 ? end : keyRe.lastIndex;
  }
  return out;
}

const hubSlugs = extractHubSlugs(trackerSrc);
const enrich = extractEnrich(trackerSrc);

const KNOWN_ITEM_FIELDS = new Set(['t', 'link', 'done', 'badge', 'stars', 'due', 'priority', 'tags', 'sub']);

let modulesChecked = 0;
const seenTitles = new Set();

for (const mod of LEARNING_DATA) {
  const title = mod && mod.title;
  const slug = slugify(title || '');
  if (onlySlug && slug !== onlySlug) continue;
  modulesChecked++;

  if (!title || typeof title !== 'string') { err(`Module with no/blank title (slug="${slug}")`); }
  if (seenTitles.has(title)) err(`Duplicate module title "${title}" — titles must be unique (they namespace ids + slug).`);
  seenTitles.add(title);
  if (!Array.isArray(mod.topics)) { err(`[${title}] has no topics array`); continue; }

  const subTitles = new Set();
  const itemLinks = new Set();
  mod.topics.forEach((tp, ti) => {
    if (!tp || typeof tp.title !== 'string' || !tp.title.trim())
      err(`[${title}] topic #${ti} has no title`);
    if (subTitles.has(tp.title)) warn(`[${title}] duplicate sub-topic title "${tp.title}"`);
    subTitles.add(tp.title);
    if (!Array.isArray(tp.items)) { err(`[${title} › ${tp.title}] has no items array`); return; }
    const seenItemT = new Set();
    tp.items.forEach((it, ii) => {
      const where = `[${title} › ${tp.title}] item #${ii}`;
      if (!it || typeof it.t !== 'string' || !it.t.trim()) err(`${where}: missing required "t"`);
      if (it && it.t) {
        if (seenItemT.has(it.t)) warn(`${where}: duplicate item text "${it.t}" within this sub-topic`);
        seenItemT.add(it.t);
      }
      if (it && it.link != null) {
        if (typeof it.link !== 'string' || !/^https?:\/\//.test(it.link))
          err(`${where}: link is not an http(s) URL: ${JSON.stringify(it.link)}`);
        else itemLinks.add(it.link.replace(/[.,]+$/, ''));
      }
      if (it && it.tags != null && !Array.isArray(it.tags)) err(`${where}: tags must be an array`);
      if (it && it.stars != null && (typeof it.stars !== 'number' || it.stars < 0 || it.stars > 6))
        warn(`${where}: stars should be 0–6`);
      if (it && it.due != null && !/^\d{4}-\d{2}-\d{2}$/.test(it.due)) warn(`${where}: due should be YYYY-MM-DD`);
      if (it) for (const k of Object.keys(it)) if (!KNOWN_ITEM_FIELDS.has(k)) warn(`${where}: unknown field "${k}"`);
    });
  });

  // Topic page exists + renders this slug
  const pageRel = `tracker/topics/${slug}.html`;
  const page = read(pageRel);
  if (page == null) err(`[${title}] missing topic page ${pageRel} (slug must equal slugify(title))`);
  else if (!page.includes(`renderTopic("${slug}"`) && !page.includes(`renderTopic('${slug}'`))
    err(`[${title}] ${pageRel} does not call renderTopic("${slug}", …)`);

  // NOTE: individual topic pages are intentionally NOT in sw.js SHELL — they are
  // cached at runtime (network-first). Only the app shell (core files + hub) is
  // precached, so absence from SHELL is by design and not flagged here.

  // HUB_SECTIONS grouping
  if (hubSlugs.size && !hubSlugs.has(slug))
    warn(`[${title}] slug "${slug}" not in any HUB_SECTIONS group — falls into auto "More Tracks".`);

  // ENRICH sectionPlans keys must match real sub-topic titles (else silent no-render)
  const en = enrich[slug];
  if (en && en.sectionPlanKeys.size) {
    for (const key of en.sectionPlanKeys) {
      if (!subTitles.has(key))
        err(`[${title}] ENRICH.sectionPlans key "${key}" matches no sub-topic title — its phase plan will silently NOT render. Sub-topics: ${[...subTitles].map(s => `"${s}"`).join(', ')}`);
    }
  }

  // B2 rule: every course/reading URL used in the ENRICH phase plan must ALSO be a linked
  // item in data.js (else it has no progress dot + never shows in the Reference section).
  if (en && en.urls.size) {
    // compare on a normalized key (strip trailing slash + query/hash) so coupon params etc. don't cause false misses
    const norm = (u) => u.replace(/[#?].*$/, '').replace(/\/+$/, '');
    const itemNorm = new Set([...itemLinks].map(norm));
    for (const url of en.urls) {
      if (!itemNorm.has(norm(url)))
        warn(`[${title}] ENRICH phase plan links ${url} but it is not a linked item in data.js — add it to a "Courses"/"Reading" sub-topic so it's trackable + shows in Reference.`);
    }
  }
}

// ---- Report ----
const line = '─'.repeat(60);
console.log(line);
console.log(`Tracker structural validation — ${modulesChecked} module(s) checked` + (onlySlug ? ` (slug=${onlySlug})` : ''));
console.log(line);
if (!errors.length && !warnings.length) console.log('✅ No structural issues found.');
if (errors.length) { console.log(`\n❌ ERRORS (${errors.length}):`); errors.forEach(e => console.log('  • ' + e)); }
if (warnings.length) { console.log(`\n⚠️  WARNINGS (${warnings.length}):`); warnings.forEach(w => console.log('  • ' + w)); }
if (onlySlug && modulesChecked === 0) { console.log(`\n(no module found whose slugify(title) === "${onlySlug}")`); }
console.log('');
process.exit(errors.length ? 1 : 0);
