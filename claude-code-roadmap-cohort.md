# Claude Code — Cohort & Self-Paced Study Map (4 Courses)

A decision guide + de-duplicated study map for the **four non-Udemy Claude Code courses**:

| # | Course | Platform · Format | Instructor | Size |
|---|---|---|---|---|
| 1 | **Agent Engineer** (formerly "Master Claude Code") | masterclaudecode.com · self-paced, lifetime, always-updated | Ray Amjad | 21 modules · 158 lessons |
| 2 | **Claude Code Mastery — Levels 1–3** | Code4Startup · self-paced video | Code4Startup | 3 levels · 11 modules · 100 lessons |
| 3 | **Build with Claude Code** | ByteByteAI · 2-day live intensive (waitlist; next cohort Jun 18–19, 2026) | John Kim (Staff SWE, Meta) | 2 sessions · ~8–10 hrs |
| 4 | **AI Coding for Real Engineers** ("Claude Code for Real Engineers") | AI Hero · 2-week async cohort + office hours (waitlist) | Matt Pocock | Pre-course + 6 daily modules |

Full curriculums for all four are in [`claude-code.md`](claude-code.md). Source refreshed 2026-07-12.

---

## TL;DR — the two questions you asked

**1. Which one is best / covers *all* Claude Code concepts?**
> **Agent Engineer (masterclaudecode.com).** It is the only one of the four that covers essentially every Claude Code feature and command end-to-end — setup, fundamentals, CLAUDE.md, MCP, skills, commands, hooks, plugins, subagents, 1M context, Chrome, remote/automation, Codex interop, plus a huge "Advanced / Niche Features" catalog — and it is continuously updated. If you watch exactly one course to "know all of Claude Code," watch this one.
>
> Its one weakness: it's a **reference catalog, not a guided build**. It shows you every feature but doesn't march you through shipping a real product. That gap is exactly what the other three fill.

**2. Do you have to cover all 4?**
> **No.** They overlap heavily on the basics (setup, CLAUDE.md, MCP, skills, subagents). Watching all four cover-to-cover means sitting through the same fundamentals ~4 times. But each course owns a **distinct layer that the others barely touch**, so the smart move is: **1 spine + 3 targeted layers**, skipping the overlap. The study map below tells you which course to use for each topic and what to skip.

**The one-line role of each course:**
- **Agent Engineer** → the *completeness spine* and feature reference. Look up any feature here.
- **ByteByteAI** → the *mental-model bootcamp*: context engineering, agentic engineering, multi-agent architecture. Fast and opinionated.
- **AI Hero** → the *senior-engineer discipline* layer: planning, feedback loops, Ralph/AFK autonomy, human-in-the-loop judgment.
- **Code4Startup** → the *build-reps* layer: GitHub issue→PR, UI generation, BMAD, business automation, and a full end-to-end SaaS build.

---

## Coverage matrix

★ = best / primary source · ✓ = covered well · ~ = light or partial · — = not covered

| Concept | Agent Engineer | Code4Startup | ByteByteAI | AI Hero |
|---|:--:|:--:|:--:|:--:|
| Setup & install | ★ | ✓ | ~ | ~ |
| Core fundamentals (sessions, context, permissions, shortcuts, settings.json) | ★ | ✓ | ~ | ~ |
| CLAUDE.md / memory files | ★ | ✓ | ✓ | ✓ |
| Context engineering (mental model) | ✓ | ✓ | ★ | ★ |
| Planning & spec (plan mode, PRDs, decomposition, tracer bullets) | ✓ | ~ | ✓ | ★ |
| MCP (install, custom, *when not to use*) | ★ | ✓ | ✓ | ~ |
| Skills (creation, types, args, forked, composability) | ★ | ✓ | ✓ | ✓ |
| Slash / custom commands | ★ | ✓ | ✓ | — |
| Hooks (lifecycle, notification, pre-commit) | ★ | ✓ | ✓ | ✓ |
| Plugins | ★ | ~ | — | — |
| Subagents | ★ | ✓ | ✓ | ✓ |
| Multi-agent orchestration (worktrees, agent teams, parallel) | ✓ | ✓ | ★ | ~ |
| Feedback loops · Ralph / AFK autonomy · human-in-the-loop | ✓ | ~ | ✓ | ★ |
| Browser automation (/chrome, Claude in Chrome) | ✓ | ~ | ✓ | — |
| Remote / mobile / desktop / scheduled automation | ★ | — | — | — |
| 1M context-window strategies | ★ | — | ~ | ✓ |
| Other LLMs / Claude Code Router (Kimi, OpenRouter, Groq) | — | ★ | — | — |
| UI design tooling (Stitch, UX Pilot, Figma MCP, Shadcn MCP) | ~ | ★ | — | — |
| Codex interop (plugin, consult skill, MCP) | ★ | — | — | — |
| GitHub issue → PR → merge workflow | ✓ | ★ | ~ | ~ |
| Agile BMAD method | — | ★ | — | — |
| Business automation (marketing agents, n8n, Remotion) | ~ | ★ | — | — |
| Full end-to-end SaaS build (Supabase, Stripe, auth, billing) | — | ★ | ~ | ~ |
| Agentic-engineering "five pillars" / scaling | ~ | — | ★ | ✓ |
| Advanced / niche feature catalog (ultraplan, /advisor, LSP, output styles, sandboxing…) | ★ | ~ | — | — |

**Read of the matrix:** Agent Engineer holds the most ★/✓ by a wide margin (it "owns" ~13 topics) → the completeness winner. Code4Startup owns the six *build/unique-tooling* rows (other LLMs, UI, GitHub, BMAD, business automation, SaaS build). ByteByteAI and AI Hero are narrow but deep on the *how-to-work-well* layer (agentic architecture; planning + feedback loops + autonomy).

---

## Choose your path

**If you want just ONE course:** Agent Engineer. Supply your own project to build alongside it.

**If you want the best overall outcome (recommended):** use all four, de-duplicated —
1. **ByteByteAI** first as a 2-day conceptual on-ramp (context → agentic → multi-agent).
2. **AI Hero** for the professional discipline (planning, feedback loops, Ralph, human-in-the-loop).
3. **Agent Engineer** as your always-open reference — look up any feature you hit, and mine the Advanced/Niche catalog.
4. **Code4Startup** for build reps — do only the project tracks you actually care about (GitHub, UI, BMAD, SaaS).

**If you learn best by building:** Code4Startup as the spine, Agent Engineer as the reference. Skip most lecture-style theory.

**If you want a fast, time-boxed cohort experience:** ByteByteAI (2 days) + AI Hero (2 weeks) and treat the two self-paced courses as reference only.

You do **not** need to complete all 4 end-to-end. The value is in stacking the *unique layers*, not re-watching shared fundamentals four times.

---

## The study map (de-duplicated, by concept)

**How to read each row:** watch the **▶ Primary**, pull only the listed **➕ Add** bits from other courses, **⏭ Skip** the duplicate coverage, then do the **🔨 Build**. A "—" means nothing is needed in that column.

| Phase | Focus | ▶ Primary — watch this | ➕ Add — pull only these bits | ⏭ Skip — duplicates | 🔨 Build |
|:--:|---|---|---|---|---|
| **0** | Decide & set up | Agent Engineer §1–2 (Introduction, Set Up & Workflows) — *or* Code4Startup L1·M01 for a project-first install | — | ByteByteAI "Installation"; AI Hero "Pre-course" setup | Run Claude Code in `learning-tracker`; do the edit → review loop |
| **1** | Core fundamentals | Agent Engineer §3 *The Fundamentals* (17 lessons: sessions, /clear, /rewind, model, permissions, /context, slash commands, bash mode, settings.json) | Code4Startup L1·M02 *Advanced hacks* (5-hour-window trick, status line, template) | Fundamentals inside ByteByteAI / AI Hero | — |
| **2** | Context engineering & CLAUDE.md | ByteByteAI *Context Engineering* (finite memory, "fresh & condensed," Second Brain, lazy loading) | AI Hero *Steering* (AGENTS.md, progressive disclosure, token-efficient patterns); Agent Engineer §6 *CLAUDE.md* (8 lessons: hierarchical, conditions, Memory.md) | Code4Startup "Context and Memory" | Write/refine a `CLAUDE.md` (stack, commands, file map, edit boundaries) |
| **3** | Planning & spec discipline | AI Hero *Planning* (Plan/Execute/Clear, decomposition, PRDs, tracer bullets, multi-phase) — strongest of the four | Agent Engineer §4–5 (Planning Mode, Spec Developer) | — | Write a PRD, decompose it, validate with a tracer bullet |
| **4** | MCP | Agent Engineer §7 *MCP Servers* (servers, connectors, MCP search, code mode) | Code4Startup L1·M04 (Context7, Playwright — real installs); ByteByteAI *when NOT to use MCP* (token cost, signal-to-noise) | — | Install one MCP server you'll actually use |
| **5** | Skills, commands, hooks, plugins | Agent Engineer §13 Skills (14 lessons) + §14 Plugins + §15 Shortcuts + §16 Hooks | Code4Startup L1·M02 (command/hook/status-line reps); AI Hero pre-commit + quality-bar skills; ByteByteAI hook lifecycle + notification hooks + composability | — | One slash command, one skill, one verification hook |
| **6** | Subagents & multi-agent orchestration | ByteByteAI *Parallel Development* (worktrees, subagents vs Agent Teams, notification hooks, Five Pillars) | Agent Engineer §11 (forked subagents, /batch, dynamic workflows) + §12 1M Context (scout/worker/synthesizer); Code4Startup L2·M07 (orchestrating subagents) | — | Run a planner → builder → reviewer subagent workflow |
| **7** | Feedback loops, Ralph & autonomy | AI Hero *Feedback Loops* + *AFK Agents* (green CI, test categorization, Ralph supervised vs AFK, sandboxing, human-in-the-loop) — best of the four | ByteByteAI self-correcting chain (build → screenshot → detect → fix → verify); Agent Engineer /loop, Monitor tool, headless/background | — | Backlog item: plan → implement → verify → inspect failure → fix → summarize |
| **8** | Browser, remote & automation | Agent Engineer §8 (Claude in Chrome), §9–10 (Web/Desktop, Slack/GitHub apps), §17 (Telegram, Discord, remote, scheduled) | ByteByteAI `/chrome` for automated visual regression | none — largely unique to Agent Engineer | — |

### Phase 9 — Build reps & projects (Code4Startup track)

Do only the tracks relevant to your goals — these are Code4Startup's unique, hands-on value.

| Track | Where | What you get |
|---|:--:|---|
| GitHub pro workflow | L2·M05 | issue → PR review → merge |
| UI design | L2·M06 | Stitch, UX Pilot, Figma MCP, Shadcn MCP/registry |
| Other LLMs / router | L1·M03 | Claude Code Router, OpenRouter, Groq/Kimi *(only course covering this)* |
| Agile BMAD | L3·M09 | Analyst → PM/PRD → Architect → sharding → dev/test |
| Business automation | L3·M10 | marketing agents, n8n-mcp, Remotion |
| Full end-to-end SaaS build | L3·M11 | Supabase auth, Stripe, credits, pricing, subscription, billing, image API *(flagship capstone)* |

### Phase 10 — Reference & niche (ongoing)

Keep **Agent Engineer §18 (Codex interop), §19 Advanced (26 lessons), §20 Niche Features (23 lessons)** open as a **look-up catalog**, not a linear watch — reach for it when you hit ultraplan, /advisor, /code-review, output styles, LSP, sandboxing, worktrees, /handoff, etc.

---

## Recommended sequence (most people)

1. **ByteByteAI** — 2-day framing (context → agentic → multi-agent). *(Phases 2, 6 mental models)*
2. **AI Hero** — planning, feedback loops, Ralph, human-in-the-loop. *(Phases 3, 7)*
3. **Agent Engineer** — fundamentals pass + keep open as reference for every feature. *(Phases 0–1, 4–5, 8, 10)*
4. **Code4Startup** — pick 1–3 build tracks that match your goals. *(Phase 9)*

This covers **100% of Claude Code concepts** while watching each shared topic **once**.

---

## Minimum vs complete

| Goal | Watch | Roughly |
|---|---|---|
| **Know all concepts, one course** | Agent Engineer (skim the Advanced/Niche catalog) | 1 course |
| **Concepts + discipline, fast** | ByteByteAI + AI Hero | ~2 wks + 2 days |
| **Concepts + build a real product** | Agent Engineer (reference) + Code4Startup L3 (SaaS build) | 1 spine + 1 project track |
| **Completionist, de-duplicated** | all 4, following the study map above | full stack, no repeats |

---

## Completion checklist

- [ ] Claude Code running confidently in `learning-tracker`.
- [ ] A maintained `CLAUDE.md` (+ tried hierarchical / memory files).
- [ ] Used plan mode + wrote one PRD and decomposed a feature.
- [ ] Installed one MCP server; understand when *not* to use MCP.
- [ ] Created one slash command, one skill, one hook.
- [ ] Ran a planner → builder → reviewer subagent workflow.
- [ ] Tried a worktree-based parallel / agent-team run.
- [ ] Ran a Ralph / feedback loop with a green-CI safety net and human-in-the-loop control.
- [ ] Used the Agent Engineer catalog to adopt at least 3 "niche" features.
- [ ] (Optional) Shipped one end-to-end project from the Code4Startup track.

---

## Capstone

Same capstone as the main roadmap, now cohort-flavored:

**Claude-powered learning-tracker assistant** that:
- reads tracker data and picks the next best learning item,
- detects stale or duplicated courses,
- produces a weekly summary,
- uses one slash command, one skill, one reviewer subagent, and one MCP/tool integration,
- runs a verification step before writing output.

Apply each course's layer: ByteByteAI's context/agentic design, AI Hero's feedback-loop discipline, Agent Engineer's features, and (optionally) Code4Startup's build patterns.
