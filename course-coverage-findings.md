# Course Coverage Findings — 4 Udemy Courses vs. Tracker

**Date:** 2026-07-24
**Method:** Full curricula scraped via Playwright MCP, then a parallel multi-agent workflow (one agent per course + a synthesis pass) compared each course against the tracker's complete topic list (`data.js`, 74 modules).

## Courses analyzed

| Course | Curriculum file | Scale |
|---|---|---|
| Ultimate RAG Bootcamp (LangChain/LangGraph/LangSmith) | [`rag.md`](rag.md) | 29 sections |
| Complete Generative AI Course (LangChain + HuggingFace) | [`generative-ai.md`](generative-ai.md) | 56 sections / 258 lectures (GenAI-only subset judged) |
| Complete Agentic AI Bootcamp (LangGraph + LangChain) | [`agentic-ai.md`](agentic-ai.md) | 27 sections / 184 lectures |
| AI Security Bootcamp (Guardrails, LLM Gateways, Observability) | [`ai-security.md`](ai-security.md) | 27 sections / 225 lectures |

> Per your instruction, the GenAI course's Python / data-analysis / ML / deep-learning / transformer / math
> prerequisite sections were excluded from the analysis.

---

## TL;DR — Bottom line

**The tracker already covers the overwhelming majority of all four courses.** Across ~100 course
topics judged, only **8 genuinely new topics** surfaced (after dedup) — and *none* require a new track.
Almost all are **specific tool/product names** the tracker teaches conceptually but never names, plus a
couple of distinct techniques.

The **AI Security Bootcamp** is the richest source of new material (5 of 8). The other three courses map
almost entirely onto existing tracks (they're the same Krish Naik LangChain/LangGraph spine you've already
captured).

---

## NEW topics not yet in the tracker (8, deduplicated)

Ranked roughly by how much they add.

### 1. Concrete LLM-gateway implementations — Portkey, TensorZero, Bifrost
- **From:** AI Security Bootcamp (§12–14)
- **Why new:** The tracker teaches the LLM-gateway *concept* (routing, fallback, load balancing, caching) but names **no product**. These three add hands-on: config/TOML, virtual keys, unified tool-calling, gateway+MCP, benchmarked routing.
- **Suggested home:** `LLMOps & AI infrastructure` → "LLM gateways & model routing"

### 2. Named guardrail implementations — Guardrails AI + AWS Bedrock Guardrails
- **From:** AI Security Bootcamp (§9–10)
- **Why new:** Tracker names only **NeMo Guardrails**. Missing: the **Guardrails AI** OSS framework (Hub, validators, OnFailAction, Guard object, streaming validation, LangChain integration) and **AWS Bedrock Guardrails** managed service (content filters, confidence-vs-threshold, denied topics, PII redaction, versioning, cost vs OSS).
- **Suggested home:** `Security, compliance & private deployment` → Guardrails

### 3. PyRIT red-teaming toolkit + offensive attack taxonomy
- **From:** AI Security Bootcamp (§20)
- **Why new:** Tracker's "Red-teaming & adversarial evals" bullet is generic. PyRIT adds a concrete tool + the attack catalog: targets/scorers/converters, PAIR/Crescendo/TAP/Many-Shot jailbreaks, encoding/obfuscation, multi-turn orchestrators, **XPIA cross-prompt injection**, Skeleton Key, automated/custom scorers, multimodal attacks, fuzzing & bulk scanning.
- **Suggested home:** `Evaluation & eval harnesses` → "Red-teaming & adversarial evals" (cross-list under Security)

### 4. Document summarization chains — Stuff / Map-Reduce / Refine
- **From:** Complete GenAI Course
- **Why new:** Tracker has summarization *projects* and "progressive summarization" as a memory idea, plus a "Summarization Middleware" for agent context — but never teaches LangChain's **document-summarization chain patterns** for docs longer than the context window.
- **Suggested home:** `LangChain Fundamentals` → Chain types

### 5. Cache-Augmented Generation (CAG) with LangGraph
- **From:** Ultimate RAG Bootcamp (§22)
- **Why new:** Retrieval-**free** generation that preloads the corpus into context/KV cache instead of running a retriever. Architecturally distinct from the tracker's named RAG variants (RAPTOR/Self-RAG/CRAG/adaptive) **and** from LLMOps "prompt & semantic caching" (a cost optimization, not a generation pattern).
- **Suggested home:** `Advanced RAG & GraphRAG` → Topics

### 6. Pydantic Logfire — observability/tracing tool
- **From:** AI Security Bootcamp (§6)
- **Why new:** Tracker names LangSmith, LangFuse, Phoenix/Arize, OpenTelemetry-GenAI for observability — but not **Pydantic Logfire**. Concept covered; this specific tool isn't.
- **Suggested home:** `LLMOps & AI infrastructure` → "Observability & tracing"

### 7. Streamlit — rapid Python-native UI for agent/LLM demos
- **From:** Agentic AI Bootcamp (§20–22) — recurs across GenAI & AI-Security project builds too
- **Why new:** `Full-stack shipping` covers only TypeScript/React/Next.js and FastAPI. **Streamlit** — the standard Python-native prototyping UI for LLM/agent demos — appears in almost every project build but is nowhere in the tracker.
- **Suggested home:** `Full-stack shipping` (or note under AI Agents with LangGraph project delivery)

### 8. Smithery AI — MCP server registry/marketplace
- **From:** Agentic AI Bootcamp (§24)
- **Why new:** The MCP track covers protocol/transports/building servers & clients/the tool ecosystem, but not the **registry/marketplace discovery-and-distribution layer** (discovering & installing prebuilt MCP servers).
- **Suggested home:** `MCP (Model Context Protocol)` → "The ecosystem"

---

## Coverage confirmation per course (already in the tracker)

### Ultimate RAG Bootcamp — 25/26 sections covered
Fully mapped: RAG intro & core components, data ingestion/parsing, embeddings & vector DBs (§6–9 already
cited in the tracker), semantic chunking, hybrid search, query enhancement (HyDE/decomposition), multimodal
RAG, agents-vs-agentic, LangChain v1, LangGraph basics, ReAct agents, Agentic/Corrective/Adaptive RAG,
multi-agent RAG, persistent-memory RAG, Vectorless RAG, guardrails, LLM gateways, RAG evaluation, GraphDB/Cypher,
and the E2E project. **Only new:** CAG (#5 above).

### Complete GenAI Course — all judged GenAI sections covered
LangChain ecosystem/LCEL/LangServe, embeddings & vector stores, chatbots with history, LangChain v1 + agents,
LangGraph agents (ReAct/memory/HITL/multi-agent/MCP), Q&A & chat-with-PDF, search-engine agent, chat-with-SQL,
HuggingFace integration, AstraDB, YouTube/URL summarization app, code assistant, Streamlit/HF-Spaces deploy,
GenAI-on-AWS (Bedrock/Lambda/SageMaker), NVIDIA NIM, CrewAI, hybrid search, GraphDB/Cypher, fine-tuning
(LoRA/QLoRA/quantization), Claude Code, Deep Agents, MCP. **Only new:** summarization chains (#4 above).

### Agentic AI Bootcamp — all agentic sections covered
(Already wired into the tracker in prior sessions.) LangChain hands-on, LangGraph components, §14 workflow
patterns, HITL, RAG-with-LangGraph, Vectorless RAG, Guardrails, LLM Gateways, E2E projects, MCP (§24), Claude
Code (§25), Deep Agents (§26), multi-agent (§27). **New:** Smithery AI (#8) and Streamlit (#7).

### AI Security Bootcamp — ~19 topics covered, 5 new
Covered: observability concept + LangSmith, guardrails concept + NeMo, grounding/hallucination control, gateway
concept, A/B testing, RAGAS, DeepEval, LLM-as-judge, agentic eval metrics, agentic memory types, mem0, LangMem,
red-teaming concept, Redis exact/semantic caching, rate limiting, Flash Rank reranking, and both secured E2E
projects (Terraform/CI-CD/Cloud Run). **New:** Portkey/TensorZero/Bifrost (#1), Guardrails AI + Bedrock Guardrails (#2),
PyRIT (#3), Pydantic Logfire (#6).

---

## Recommendation

All 8 new topics are **small, additive** — mostly naming concrete tools under concepts the tracker already
teaches. No new track needed.

### ✅ Applied (2026-07-24)

All 8 new topics have been added to `data.js`:

| # | Topic | Landed in |
|---|---|---|
| 1 | Portkey / TensorZero / Bifrost gateways | `LLMOps & AI infrastructure` → new topic + AI Security Bootcamp course link |
| 2 | Guardrails AI + AWS Bedrock Guardrails | `Security…` → new "Guardrail frameworks" topic + course link |
| 3 | PyRIT red-teaming + attack taxonomy | `Security…` → new PyRIT topic; `Evaluation` red-teaming line cross-refs it |
| 4 | Summarization chains (Stuff/Map-Reduce/Refine) | `LangChain Fundamentals` → Chain types |
| 5 | Cache-Augmented Generation (CAG) | `Advanced RAG & GraphRAG` → new topic + Ultimate RAG Bootcamp course link |
| 6 | Pydantic Logfire | `LLMOps & AI infrastructure` → folded into "Observability & tracing" line |
| 7 | Streamlit for Python-native agent UIs | `Full-stack shipping` → new topic |
| 8 | Smithery AI (MCP registry) | `MCP` → new topic under "The ecosystem" |

`data.js` validated (74 modules).

*Full scraped curricula live in the per-topic `.md` files linked at the top; this analysis was produced by a
parallel 5-agent workflow (4 course auditors + 1 synthesizer).*
