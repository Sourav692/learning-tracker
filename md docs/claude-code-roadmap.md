# Claude Code Final Roadmap

Goal: learn Claude Code without watching the same setup, `CLAUDE.md`, MCP, skills, hooks, and agent videos across six Udemy courses.

Source: [`claude-code.md`](claude-code.md), scraped 2026-07-11.

Rule: for each topic, watch the primary source only. Use the optional source only when you are actively building that exact project.

---

## Course Roles

| Course | Use it for | Do not use it for |
|---|---|---|
| **Claude Code - The Practical Guide** | Main spine. Watch this first. It covers setup, sessions, context, permissions, `CLAUDE.md`, plan mode, MCP, subagents, skills, commands, hooks, plugins, feedback loops, Ralph, and remote/cloud usage in 3h 11m. | Rewatching the same topics elsewhere. |
| **AI Coder: Complete Claude Code & Coding Agents Course** | Professional engineering workflows: Jira/GitHub/MCP, large codebases, remote/cloud sandboxes, Agent SDK, agent teams, orchestration, deployment. | Week 1 and basic Claude Code setup after you finish the Practical Guide. |
| **Claude AI Masterclass** | MCP buildout, Claude Agent SDK/API, CI/security/browser/office integrations. | Its Claude Code setup/fundamentals section, which duplicates the Practical Guide. |
| **Mastering Claude Code & AI Agents [2026]** | Optional project reps for apps, slash commands, plugins, and agent builds. | Core setup/fundamentals if you already did the Practical Guide. |
| **Claude Code Fast-Track** | Optional automation projects: n8n, website, phone remote, lead scraping, YouTube/content workflows. | General intro/setup. |
| **Complete Claude Code & Claude Cowork Masterclass** | Optional Cowork and personal-agent automation workflows. | Claude Code Foundations / app / agent sections, which duplicate Practical Guide + Mastering. |

---

## Non-Udemy Courses (Cohorts & Self-Paced)

Four Claude Code courses that are **not on Udemy**. Two are live cohorts, two are self-paced.
Treat these as the pattern/project spine and depth layer — the Udemy phases below stay the core
watch order. Full curriculums for all four are captured in [`claude-code.md`](claude-code.md)
(the two self-paced from saved pages, the two cohorts from their live course pages).

| Course | Platform · Format | Instructor | Link | Where it fits |
|---|---|---|---|---|
| **Claude Code Mastery — Levels 1–3** | Code4Startup · self-paced video (3 levels, 11 modules, 100 lessons) | Code4Startup | see level links below | Project reps across Phases 1–7; full curriculum in `claude-code.md` |
| **AI Coding for Real Engineers** (you may know it as "Claude Code for Real Engineers") | AI Hero · ~2-week async cohort + live office hours (waitlist) | Matt Pocock | [aihero.dev/cohorts/ai-coding-for-real-engineers-m0k0w](https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-m0k0w) | Advanced patterns: steering, planning, feedback loops, **Ralph**, human-in-the-loop → Phases 2, 3, 5; full curriculum in `claude-code.md` |
| **Build with Claude Code** | ByteByteAI · 2-day live intensive (waitlist) | John Kim (Staff SWE, Meta) | [bytebyteai.com/c/build-with-claude-code](https://bytebyteai.com/c/build-with-claude-code) | Context engineering, agentic engineering (skills/MCP), multi-agent orchestration → Phases 2, 4, 5, 9; full curriculum in `claude-code.md` |
| **Agent Engineer** (formerly "Master Claude Code") | masterclaudecode.com (platform: agenticcoding.school) · self-paced, lifetime, always-updated (21 modules, 158 lessons) | Ray Amjad | [masterclaudecode.com](https://masterclaudecode.com) | Granular, always-current reference for every phase; full curriculum in `claude-code.md` |
| **▶ Which of these 4 to pick + study map** | Companion decision doc · coverage matrix + de-duplicated 11-phase plan | — | [claude-code-roadmap-cohort.md](claude-code-roadmap-cohort.md) | Answers "which is best," "do I need all 4," and maps all four into one non-overlapping path |

**Code4Startup — Claude Code Mastery, per-level links:**
- Level 1 — [code4startup.com/courses/claude-code-mastery-level-1](https://code4startup.com/courses/claude-code-mastery-level-1/) — fundamentals, advanced hacks, other LLMs, MCP
- Level 2 — [code4startup.com/courses/claude-code-mastery-level-2](https://code4startup.com/courses/claude-code-mastery-level-2/) — pro workflows (GitHub), UI design, subagents, context engineering
- Level 3 — [code4startup.com/courses/claude-code-mastery-level-3](https://code4startup.com/courses/claude-code-mastery-level-3/) — Agile BMAD, business/productivity automation, full end-to-end SaaS build

How to use them without duplicating the Udemy spine:
- **AI Hero** is the best *advanced* companion — reach for it in Phase 5 (feedback loops / Ralph / autonomy) and for steering/planning depth in Phases 2–3.
- **ByteByteAI** is a fast, opinionated 2-day framing of context → agentic → multi-agent; a good intensive if you prefer a live cohort over the Practical Guide's Phase 2/4/9 topics.
- **Code4Startup** is project-first — use it for build reps (GitHub issue→PR, UI generation, SaaS build) alongside Phases 1–7, not as another theory pass.
- **Agent Engineer (masterclaudecode)** is a huge always-updated catalog — use it as a 🔎 reference to look up one specific feature/command, not an end-to-end watch.

---

## Phase 0 - Install And First Run

Outcome: Claude Code runs in a real repo and you understand the basic edit/review loop.

Watch:
- **Claude Code - The Practical Guide**
- Section 1: `1-8`
  - Welcome To This Course!
  - Course Overview
  - Claude Code Setup
  - Claude Code in Different Terminals
  - Using Bun
  - Base Usage & IDE Integration
  - A Glimpse At The Claude Desktop App
  - Configuring Claude Code

Skip duplicates:
- Mastering Claude Code section 1 lectures `1-7`
- Claude AI Masterclass section 2 lectures `1-4`
- Claude Code Fast-Track sections `1-2`
- Cowork Masterclass section 6 lectures `1-4`
- AI Coder Week 2 lectures `1-3`

Build:
- Open `learning-tracker` with Claude Code.
- Ask it to explain `app.js`, `data.js`, and how local state works.

---

## Phase 1 - Daily Claude Code Workflow

Outcome: you can use Claude Code safely for normal coding work.

Watch:
- **Claude Code - The Practical Guide**
- Section 1: `9-18`
  - Choosing AI Models
  - Understanding Sessions & Context
  - When To Start New Sessions & Making Sense Of Compaction
  - Core Features You May Not Know Yet
  - Advanced Permissions Management
  - Running Claude Code via Docker Sandboxes
  - Using Claude Code's Native Sandboxing
  - Undoing Actions & The Importance of Version Control Systems
  - Commands, Shortcuts & Settings Cheat Sheet
  - Course Resources & Community

Skip duplicates:
- AI Coder Week 2 lectures `7-11`
- Claude AI Masterclass section 2 lectures `5-12`
- AI Coder Week 1 lectures `15-27`, unless you specifically want Cursor/Copilot/Codex comparisons.

Build:
- Use Claude Code to make one small improvement in this repo.
- Require it to show a plan, edit files, and run a verification command before you accept the work.

---

## Phase 2 - Context Engineering And `CLAUDE.md`

Outcome: you can steer Claude instead of re-explaining your project every session.

Watch:
- **Claude Code - The Practical Guide**
- Section 2: `1-8`
  - Module Introduction
  - Making Sense of Prompt & Context Engineering
  - Prompt Engineering In Action & Working with Specs
  - Prompt & Context Engineering Recommendation
  - Initializing Claude Projects
  - Crafting Great CLAUDE.MD Files
  - CLAUDE.md vs "Auto Memory"
  - Leveraging Plan Mode

Optional, only if context windows still feel confusing:
- **AI Coder**, Week 1 lectures `9-14`

Skip duplicates:
- Mastering Claude Code section 3 lectures `1-2`
- Cowork Masterclass section 7 lectures `1-2`
- Claude AI Masterclass section 9, until you hit real context-window pain.

Build:
- Create or refine a `CLAUDE.md` for this repo.
- Include stack, commands, file map, testing expectations, and edit boundaries.

---

## Phase 3 - Built-In Tools, MCP Basics, And Subagents

Outcome: you know when to use native tools, MCP, and subagents.

Watch:
- **Claude Code - The Practical Guide**
- Section 2: `9-13`
  - Using Claude Code's Built-in Tools
  - Using MCP Servers & More On Permissions
  - Understanding Subagents
  - Creating & Using A Custom Subagent
  - Encouraging Agent Usage

For deeper MCP, watch once:
- **Claude AI Masterclass**
- Section 6: `1-5`
  - Introduction to MCP + Connecting Claude to Tools
  - Setting Up MCP Servers in Claude Desktop
  - Running MCP Servers in Claude Code
  - Create Custom MCP Server Part 1
  - Create Custom MCP Server Part 2

Skip duplicates:
- AI Coder Week 2 lectures `12-18` for MCP/skills/plugin theory.
- Mastering Claude Code section 4 lectures `4-5`.
- Cowork Masterclass section 8 lectures `4-5`.

Build:
- Add one MCP server you will actually use.
- Create one `reviewer` subagent and have it review a Claude Code diff.

---

## Phase 4 - Skills, Slash Commands, Hooks, And Plugins

Outcome: you can package repeatable workflows instead of prompting from scratch.

Watch:
- **Claude Code - The Practical Guide**
- Section 2: `14-23`
  - Introducing Agent Skills
  - Adding Custom Skills
  - Using Agent Skills as Commands
  - Enhancing Skills & Adding Third-Party Skills
  - Iterating On The Demo App
  - On Custom Commands
  - Building & Using Custom Commands
  - Using Screenshots For Prompting With Feedback
  - Understanding & Using Hooks
  - Installing & Using Plugins

Optional project reps, pick only one:
- **Mastering Claude Code**, section 2 lectures `3-20` if you want extra skills/slash/plugin practice.
- **Cowork Masterclass**, section 6 lectures `6-23` if you want the same idea in a Cowork-heavy style.

Skip duplicates:
- Do not watch both optional project reps.
- Skip Claude AI Masterclass section 2 lectures `13-17` unless you need its hook examples.

Build:
- Create one project slash command, for example `/scrape-course-outline`.
- Create one skill folder for a workflow you repeat, such as "summarize scraped course curriculum."
- Add one hook that runs a safe verification command after JS/CSS changes.

---

## Phase 5 - Feedback Loops, Ralph, And Autonomy

Outcome: Claude can build, verify, inspect failures, and continue with bounded autonomy.

Watch:
- **Claude Code - The Practical Guide**
- Section 2: `24-27`
  - Creating Feedback Loops by Granting Browser Access
  - Providing Feedback via Automated Tests
  - Running Claude Code In A (Ralph) Loop
  - Using Claude Code Web (Cloud)

Optional, if you want a concrete implementation:
- **Mastering Claude Code**, section 3 lectures `8-9`
  - Implement AI Feedback Loops using Ralph Loop Plugin

Skip duplicates:
- AI Coder Week 2 lecture `11`, unless you skipped the Practical Guide Ralph lecture.
- Repeated "YOLO mode" demos from AI Coder Week 1/2 are not required.

Build:
- Give Claude a real backlog item in `roadmap.md`.
- Require: plan, implement, run verification, inspect failure, fix, summarize.

---

## Phase 6 - Real Engineering Workflow With GitHub, Jira, And Large Codebases

Outcome: you can use Claude Code like an engineering teammate, not just a coding autocomplete.

Watch:
- **AI Coder**
- Week 2 lectures `19-30`
  - Building with Claude Code, Jira, MCP & Plugins Workflow
  - Connecting Claude Code to Jira MCP Server & GitHub Repository
  - Setting Up GitHub MCP Server & Featured Dev Plugin
  - Claude Code Autonomy: From Jira Issue to PR
  - Claude Code Builds a Full Next.js App from a Jira Ticket
  - Debugging Strategies for Claude Code
  - Building a SaaS Platform
  - Writing `claude.md` and Creating Custom Skills
  - Setting Up Jira Tickets
  - Building Features with Claude Code, Jira, and FastAPI
  - Testing the AI Legal Doc Generator
  - Final PR Merge, Full SaaS Demo

Skip duplicates:
- Fast-Track section 11 "Synchronizing Claude Code with Github" unless you only need a quick GitHub sync demo.
- Claude AI Masterclass section 2 lectures `18-20` unless CI/CD is your immediate target.

Build:
- Turn one tracker feature into a GitHub issue.
- Have Claude Code work from the issue to a diff.
- Review with your `reviewer` subagent before accepting.

---

## Phase 7 - Remote, Cloud, Sandboxes, And Large-Codebase Practices

Outcome: you can run Claude Code safely outside your local happy path.

Watch:
- **AI Coder**
- Week 3 lectures `8-18`
  - Claude Code Sandboxing and Cloud Execution
  - Remote Execution & Cloud Sandboxes
  - Claude Code Sandbox & GitHub Integration
  - 5 Ways to Run Claude Code Remotely
  - Third-Party Cloud Sandboxes
  - Cloud Sandbox Recap
  - Large Codebases with Claude Code, Codex & Sprites.dev
  - Best Practices for Large Team Codebases
  - Driving Claude Code Programmatically with Claude Agent SDK
  - Claude Cowork demo
  - OpenClaw demo

Skip duplicates:
- AI Coder Week 3 lectures `1-7` (sub-agents, hooks, slash commands, plugins) — already covered in Phases 3-4.
- Practical Guide section 3 remote/mobile lectures if you already watched this AI Coder block.
- Fast-Track section 10 phone remote unless mobile control is specifically useful to you.

Build:
- Document a safe "remote run" policy in `CLAUDE.md`.
- Include when autonomous mode is allowed, which commands are safe, and when human approval is mandatory.

---

## Phase 8 - Claude Agent SDK And API Integration

Outcome: you can build code around Claude instead of only using the Claude Code CLI.

Watch:
- **Claude AI Masterclass**
- Section 3 lectures `1-5`
  - Claude Agent SDK: Build Production Agents Part 1
  - Claude Agent SDK: Build Production Agents Part 2
  - Building a Multi-Tool Agent from Scratch
  - Google ADK + Claude
  - Multi-Agent Orchestration

Then watch:
- **Claude AI Masterclass**
- Section 7 lectures `1-13`
  - Anthropic Python SDK
  - Streaming
  - Vision
  - PDFs/CSVs/large files
  - Structured outputs
  - Cost optimization
  - Prompt caching
  - Batch processing
  - Extended thinking

Skip duplicates:
- Mastering Claude Code section 4 lectures `6-14`, because those are OpenAI Agents SDK focused.
- Cowork Masterclass section 8 lectures `6-14`, same reason.

Build:
- Build a small script that reads your tracker data and produces a weekly learning summary.
- Keep Claude Code as the implementation assistant, but use the SDK/API in the app/script itself.

---

## Phase 9 - Multi-Agent Orchestration

Outcome: you can split work across specialized agents and judge when orchestration is worth the overhead.

Watch:
- **AI Coder**
- Week 3 lectures `19-30`
  - Claude Code Agent Teams
  - Setting Up Agent Teams
  - Multi-Agent Team Build
  - GSD spec-driven design
  - Trading platform deep dive
  - GSD vs Claude Agent Teams
  - Gastown orchestration
  - Parallel agents
  - Orchestrator comparison
  - Final deployment
  - Course recap

Skip duplicates:
- Mastering Claude Code section 4 lectures `15-20`.
- Cowork Masterclass section 8 lectures `15-20`.

Build:
- Run a three-role workflow on this repo:
  - planner agent creates implementation plan
  - builder agent edits
  - reviewer agent checks the diff and test evidence

---

## Phase 10 - Optional Specializations

Only do these after the core path, and only if the workflow is relevant.

### Claude Cowork / Personal Agent Automation

Watch:
- **Complete Claude Code & Claude Cowork Masterclass**
- Section 2 for Cowork, skills, plugins, Gmail, Excel, PowerPoint workflows.
- Sections 10-14 for personal agent architecture and automation blueprints.

Skip:
- Sections 6-8, because they duplicate Claude Code foundations, app building, and AI agents.

### n8n / Business Automation

Watch:
- **Claude Code Fast-Track**
- Section 9 only.

Optional:
- Section 7 or 8 if you specifically want lead scraping/outreach.

Skip:
- Fast-Track sections 1-2 setup.

### Website / Stripe / Security Project

Watch:
- **Claude Code Fast-Track**
- Section 6 only.

Skip:
- Mastering section 3 if you choose this website project.

### Office / Browser Workflows

Watch:
- **Claude AI Masterclass**
- Section 5 only.

Optional:
- Cowork Masterclass sections 4-5 if Excel/PowerPoint is a major use case.

---

## Final Watch Order

Do this in order:

1. **Practical Guide**: all 3 sections.
2. **Claude AI Masterclass**: section 6 only for MCP depth.
3. **AI Coder**: Week 2 lectures `19-30`.
4. **AI Coder**: Week 3 lectures `8-30`.
5. **Claude AI Masterclass**: sections 3 and 7 for Agent SDK/API.
6. Pick exactly one optional specialization from Phase 10.

Approximate required load:
- Core Claude Code: **54 lectures**
- MCP/API/SDK depth: **23 lectures**
- Professional engineering + orchestration: **35 lectures**
- Optional specialization: **1 focused block**

This avoids the large duplicated blocks:
- AI Coder Week 1
- Mastering sections 1-2
- Claude AI Masterclass section 2
- Fast-Track sections 1-2
- Cowork Masterclass sections 6-8

---

## Completion Checklist

- [ ] Run Claude Code confidently in `learning-tracker`.
- [ ] Maintain a useful `CLAUDE.md`.
- [ ] Use plan mode for non-trivial work.
- [ ] Create one slash command.
- [ ] Create one skill.
- [ ] Add one hook.
- [ ] Configure one MCP server.
- [ ] Build one custom MCP server or tool integration.
- [ ] Use a reviewer subagent on a real diff.
- [ ] Ship one GitHub issue using Claude Code end to end.
- [ ] Run a remote/cloud/sandboxed Claude Code workflow safely.
- [ ] Build one SDK/API script.
- [ ] Complete one capstone.

---

## Capstone

Build this after Phase 9:

**Claude-powered learning tracker assistant**

It should:
- read tracker data
- identify the next best learning item
- detect stale or duplicated courses
- produce a weekly summary
- use a Claude Code slash command
- use one skill
- use one reviewer subagent
- use one MCP/tool integration
- run a verification step before writing final output

This capstone uses the whole stack without requiring you to watch duplicate course material.
