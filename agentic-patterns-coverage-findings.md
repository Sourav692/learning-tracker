# Agentic Patterns — Source Coverage Findings

**Question:** Which topics in the two tracks — **Workflow & agent patterns** (Phase 04) and
**Multi-agent orchestration & control** (Phase 05) — are covered by these four sources?

**Sources reviewed:**
1. 🎓 Udemy — *AI Agents & Workflows: The Practical Guide* (Maximilian Schwarzmüller, 5 sections / ~4h)
2. 🎓 Udemy — *Complete Agentic AI Bootcamp with LangGraph and LangChain* (Krish Naik, 27 sections / 183 lectures)
3. 📝 Notion — *🏙️ Agentic AI Design Pattern* (curated link hub → Analytics Vidhya courses + repo + Educative)
4. 💻 GitHub — *FareedKhan-dev/all-agentic-architectures* (35 runnable architectures)

> ✅ **Access notes:** Source 2's full curriculum (27 sections / 184 lectures) was scraped via the
> Playwright MCP — see `agentic-ai.md` for the complete section+lecture list. The Notion page was
> read via the Notion MCP after it was published. Sources 1, 3, 4 as originally noted.

---

## The two tracks (topic checklists)

**Workflow & agent patterns (Phase 04):** Workflows vs agents · Augmented LLM (tools+retrieval+memory) ·
Prompt chaining · Routing/classification · Parallelization (sectioning & voting) · Orchestrator–workers ·
Evaluator–optimizer loop · Reflection/self-critique, ReAct, Plan-and-Execute · Agentic RAG · Pick-the-simplest-pattern.

**Multi-agent orchestration & control (Phase 05):** When multi-agent helps · Supervisor/swarm/handoff ·
Shared state & memory across agents · Human-in-the-loop approvals/interrupts · Guardrails, tool permissions
& sandboxing · Cost & latency.

---

## Coverage matrix — Workflow & agent patterns (Phase 04)

| Track topic | 🎓 Practical Guide | 🎓 Agentic Bootcamp | 📝 Notion (AV) | 💻 GitHub repo |
|---|:---:|:---:|:---:|:---:|
| Workflows vs agents | ✅ | ✅ §9 "AI Agents Vs Agentic AI" | 🟡 | ❌ |
| Augmented LLM / tool use | ✅ (from scratch, fn-calling) | ✅ §10,§12 (tools, ToolNode) | ✅ Tool-Use Pattern | ✅ #21 Tool Use |
| Prompt chaining | ✅ (multi-step workflows) | ✅ §14 "Prompt Chaining" | ❌ | 🟡 (implicit) |
| Routing / classification | 🟡 (control flow) | ✅ §12,§14 "Routers"/"Routing" | ❌ | ✅ #14 Adaptive, #31 Meta-Controller |
| Parallelization (sectioning/voting) | ❌ | ✅ §14 "Parallelization" | ❌ | ✅ #6 Self-Consistency, #10 Ensemble |
| Orchestrator–workers | ❌ | ✅ §14 "Orchestrator-Worker" (+impl) | ❌ | ✅ #27 Multi-Agent, #31 Meta-Controller |
| Evaluator–optimizer loop | ❌ | ✅ §14 "Evaluator-optimizer" | 🟡 (Reflection) | ✅ #1 Reflection, #34 RLHF |
| Reflection / self-critique | ❌ | 🟡 (via evaluator-optimizer) | ✅ Reflection Pattern | ✅ #1–3, #5 |
| ReAct | ❌ | ✅ §12 "ReAct Agent Architecture" (+impl) | ✅ (2nd AV course) | ✅ #22 ReAct |
| Plan-and-Execute | ❌ | 🟡 (deep agents §26, no explicit plan-exec) | ✅ Planning Pattern | ✅ #23 Planning, #24 PEV |
| Agentic RAG | ❌ | ✅ §16 Agentic/Corrective/Adaptive RAG | ❌ | ✅ #11–15 (Agentic/CRAG/Self/Adaptive/Graph) |
| Pick-the-simplest / anti-over-agenting | 🟡 (universal vs specialized) | ❌ | ✅ Best Practices | ❌ |

## Coverage matrix — Multi-agent orchestration & control (Phase 05)

| Track topic | 🎓 Practical Guide | 🎓 Agentic Bootcamp | 📝 Notion (AV) | 💻 GitHub repo |
|---|:---:|:---:|:---:|:---:|
| When multi-agent helps | ✅ (universal vs specialized) | ✅ §9,§27 | ✅ ("Why Multi-Agent") | 🟡 (#31, #33 routing) |
| Supervisor / swarm / handoff | 🟡 (connect specialized agents) | ✅ §27 Multi-Agent Travel Assistant; §26 sub-agents | 🟡 (generic) | ✅ #27, #28 Blackboard, #29 Debate, #30 STORM |
| Shared state & memory across agents | 🟡 (agent memory) | ✅ §12 agent memory + §12 state schema | ❌ | ✅ #28 Blackboard; #16–20 memory |
| Human-in-the-loop | ✅ | ✅ §10,§15 (middleware + 4 HITL lectures) | ❌ | ✅ #32 Dry-Run |
| Guardrails / permissions / sandboxing | ✅ (security risks) | ✅ §18 "Guardrails With Langchain" | ❌ | ✅ #25 SWE-Agent, #26 BrowserAgent, #32 Dry-Run |
| Cost & latency of multi-agent | 🟡 (pricing) | 🟡 (§19 LLM Gateways touches routing/cost) | ❌ | ❌ |

> **Bonus coverage in the Bootcamp** (beyond these two tracks): **MCP** (§24), **Claude Code** (§25 — agents,
> teams, hooks, skills, plugins), **Deep Agents & context engineering** (§26), and 4 end-to-end LangGraph
> projects (§20–23). These feed the MCP, Claude Code operator-mastery, and Deep Agents tracks respectively.

**Legend:** ✅ covered · 🟡 partial/implicit · ❌ not covered

---

## Per-source verdict

- **🎓 AI Agents & Workflows: The Practical Guide** — the *hands-on foundation*. Best for the base building
  blocks: augmented LLM, tool use from scratch, function calling, structured outputs, workflows-vs-agents,
  HITL, and security awareness. Also teaches CrewAI. Does **not** cover the advanced named patterns.

- **🎓 Complete Agentic AI Bootcamp (LangGraph + LangChain)** — the *broadest single course* (27 sections /
  184 lectures, fully scraped → `agentic-ai.md`). Its **§14 "Different Workflows In LangGraph"** covers almost
  the entire Phase 04 pattern list in one place — Prompt Chaining, Parallelization, Routing, Orchestrator-Worker,
  Evaluator-optimizer — plus ReAct (§12) and Agentic/Corrective/Adaptive RAG (§16). For Phase 05 it covers
  multi-agent (§27), shared state + agent memory (§12), HITL (§10, §15), and Guardrails (§18). Also feeds the
  RAG, LLMOps, Security, MCP, Claude Code, and Deep Agents tracks. **The single best source across both tracks.**

- **📝 Notion — Agentic AI Design Pattern** — a *concept-level 101* on the classic 4 patterns
  (Reflection · Tool Use · Planning/ReAct · Multi-Agent) via two Analytics Vidhya courses, plus links to the
  GitHub repo and an Educative module. Narrow but good first-principles framing + a "best practices" wrap-up.

- **💻 all-agentic-architectures (35 patterns)** — the *deep pattern catalog*. Covers nearly every advanced
  named pattern in both tracks, plus extras (Tree-of-Thoughts, LATS, Self-Discover, STORM, MemGPT, Voyager).
  Implementation-first; no "when to use what" judgment framing.

## Combined gaps (not covered well by ANY source)

After the full scrape, **Phase 04 is now almost entirely covered** by the Bootcamp's §14 + §12 + §16. Two gaps remain:

1. **Cost & latency of multi-agent systems** — only pricing asides + LLM-gateway routing; no systematic treatment.
2. **"Pick the simplest pattern / resist over-agenting"** — only the Notion "best practices" lecture touches it.

---

## Screenshot sections → where they land in the tracker

The four sections you flagged in the Bootcamp curriculum are **not** part of the two agent-pattern tracks —
they belong to the RAG / LLMOps / Security tracks. All four already exist as concept items; this course is
now linked against them:

| Bootcamp section (verified) | Belongs to track | Status in tracker |
|---|---|---|
| **§16 RAG With LangGraph** (Agentic/Corrective/Adaptive RAG) | Advanced RAG & GraphRAG | + new topic "RAG with LangGraph: cyclic/stateful graphs" + course added |
| **§17 Vectorless RAG** (PageIndex; Traditional vs Vectorless) | Embeddings & vector databases | "Vectorless RAG (PageIndex)" topic exists → course added |
| **§18 Guardrails** (Guardrails With Langchain) | Security, compliance & private deployment | "Guardrails: input/output filtering, PII redaction" exists → course added |
| **§19 LLM Gateways** (understanding & implementation) | LLMOps & AI infrastructure | "LLM gateways & model routing" topic exists → course added |

---

*Generated 2026-07-24. Sources: two Udemy course pages, the published Notion page, and the GitHub repo README.*
