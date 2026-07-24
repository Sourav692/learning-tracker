# LLMOps + Security Phase-Wise Plan

> **Scope:** A sequenced, phase-by-phase study plan for the two tracker tracks
> **LLMOps & AI infrastructure** (`tracker/topics/llmops-ai-infrastructure.html`) and
> **Security, compliance & private deployment** (`tracker/topics/security-compliance-private-deployment.html`).
> **Built only from the courses those two tracks reference** — no new sources introduced.
> **Date:** 2026-07-25

---

## Source courses (exactly as referenced in the two trackers)

| # | Course | Referenced by | Sections used here |
|---|--------|---------------|--------------------|
| A | **AI Security Bootcamp — Guardrails, LLM Gateways, Observability** ([link](https://www.udemy.com/course/ai-security-bootcamp-guardrailsllm-gatewaysobservability/)) | Both tracks | §4–6 Observability · §7–10 Guardrails · §11–14 Gateways · §20 PyRIT · §21 Redis · §22–25 Projects |
| B | **Complete Agentic AI Bootcamp with LangGraph & LangChain** ([link](https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/)) | Both tracks | §18 Guardrails (LangChain) · §19 LLM Gateways |
| C | **Production RAG: Guardrails, LLM Gateway, Evals, IaC (GCP)** ([link](https://www.krishnaik.in/project/production-grade-cyclic-rag-with-langgraph-gcp-and-groq)) | LLMOps (project) | Capstone integration |

**Course-section legend:** `A§13` = AI Security Bootcamp, section 13. `B§19` = Agentic AI Bootcamp, section 19.

---

## How the two tracks interleave

The two tracks share course A and are best learned as **one continuous build**: you stand up guardrails
first (they gate everything), then routing/gateways, then the observability + caching that make it
operable, then red-teaming to attack what you built, and finally a deployed, secured capstone. Phases
1–3 lean **Security track**; phases 4–6 lean **LLMOps track**; phases 7–8 are shared production work.

```
Phase 1  Foundations & threat model      ── Security
Phase 2  Guardrail frameworks            ── Security   (NeMo · Bedrock · Guardrails AI)
Phase 3  Red-teaming                     ── Security   (PyRIT)
Phase 4  LLM gateways & routing          ── LLMOps     (Portkey · TensorZero · Bifrost)
Phase 5  Observability & tracing         ── LLMOps     (LangSmith · Logfire)
Phase 6  Caching, rate limiting, cost    ── LLMOps     (Redis)
Phase 7  On-prem / private deployment    ── Security + LLMOps (serving + compliance lens)
Phase 8  Secured capstone (CI/CD + IaC)  ── Shared     (Projects 1 & 2 + Krishna Naik GCP)
```

---

# Phase 1 — Foundations & threat model  *(Security track)*

**Goal:** Be able to name the attack surface of an agentic app and know which control mitigates which risk before writing a single guardrail.

| Study | Course source |
|-------|---------------|
| Why security is the biggest concern in GenAI apps | A§1.2 |
| Architecture of agentic AI applications (where controls attach) | A§1.3 |
| What guardrails are — core topics & framework landscape | A§7.1, B§18.1 |
| Prompt injection & jailbreak taxonomy (direct vs indirect) — conceptual first pass | A§20.3 (preview) |

**Tracker topics covered:** *Prompt injection & jailbreaks*; *Guardrails: input/output filtering* (framing).

**Exit criteria / artifact:** A one-page threat model for your reference agent: inputs, tools, data stores, egress — each annotated with the phase that will defend it.

---

# Phase 2 — Guardrail frameworks  *(Security track)*

**Goal:** Implement input/output rails, PII redaction, and denied-topics across the three frameworks the tracker names, and know when to pick each.

### 2a. LangChain-native guardrails (fast start)
| Study | Source |
|-------|--------|
| Guardrails with LangChain — understanding & implementation | B§18.1 |
| Middleware-based PII guardrails in an agent | B (middleware section) |

### 2b. NeMo Guardrails
| Study | Source |
|-------|--------|
| Intro; writing rails; the "raw LLM problem" | A§8.1–8.3 |
| First guardrail; input rails; PII detection via custom rails; output rails | A§8.4–8.7 |
| **Build:** secured HR assistant bot + test it | A§8.8–8.9 |

### 2c. AWS Bedrock Guardrails
| Study | Source |
|-------|--------|
| Setup, clients, anatomy; first guardrail; with vs without | A§9.1–9.2 |
| Content filters, confidence vs threshold, false pos/neg; prompt-attack filter | A§9.4–9.5 |
| Denied topics, word filters, PII redaction; grounding/hallucination control in RAG | A§9.6–9.7 |
| Versioning, monitoring, automated test suite; **cost: OSS vs AWS** | A§9.8–9.9 |

### 2d. Guardrails AI
| Study | Source |
|-------|--------|
| Hub & validators; OnFailAction types | A§10.3–10.5 |
| Validator implementation; OnFailAction impl; input/output structure validation | A§10.6–10.10 |
| Streaming with the Guard object; LangChain integration | A§10.11–10.12 |

**Tracker topics covered:** *Guardrails: input/output filtering, PII redaction*; *Guardrail frameworks: NeMo, Guardrails AI, AWS Bedrock (filters, denied topics, versioning, cost vs OSS)*; *Data governance, PII, secrets handling*.

**Exit criteria / artifact:** The same agent wrapped three ways (NeMo, Bedrock, Guardrails AI) with a short comparison note: latency, cost, control granularity, and your default pick.

---

# Phase 3 — Red-teaming with PyRIT  *(Security track)*

**Goal:** Attack the guardrailed agent from Phase 2 and quantify what gets through.

| Study | Source |
|-------|--------|
| PyRIT intro & setup; core concepts — targets, scorers, converters | A§20.1–20.2 |
| Direct prompt injection | A§20.3 |
| Jailbreaks — PAIR, Crescendo, TAP, Many-Shot | A§20.4 |
| Encoding & obfuscation attacks | A§20.5 |
| Multi-turn red-teaming (RedTeamingOrchestrator) | A§20.6 |
| XPIA — cross-prompt injection on agents & RAG | A§20.7 |
| Skeleton Key & persuasion attacks | A§20.8 |
| Automated scoring & custom scorer pipelines | A§20.9 |
| Multimodal attacks (files, images, audio) | A§20.10 |
| Fuzzing, dataset generation, bulk scanning | A§20.11 |
| **Build:** AI security red-teaming dashboard web app | A§20.12 |

**Tracker topics covered:** *Red-teaming with PyRIT* (full item — targets/scorers/converters, PAIR/Crescendo/TAP/Many-Shot, encoding, multi-turn orchestrators, XPIA, Skeleton Key, automated scorers, multimodal, fuzzing & bulk scanning).

**Exit criteria / artifact:** A red-team report on your Phase-2 agent: attack → did the rail hold? → fix. Re-run after fixes and show the delta on the dashboard.

---

# Phase 4 — LLM gateways & routing  *(LLMOps track)*

**Goal:** Put a gateway in front of the app for fallbacks, multi-provider routing, load balancing, and unified tool-calling; benchmark the routing.

### 4a. Concepts
| Study | Source |
|-------|--------|
| What an LLM gateway is; terminology | A§11.1, B§19.1 |

### 4b. Portkey
| Study | Source |
|-------|--------|
| Setup; first experiment | A§12.1–12.2 |
| User tracing, retry, timeout, fallback | A§12.3 |
| Load balancing & caching; LangChain integration | A§12.4–12.5 |

### 4c. TensorZero
| Study | Source |
|-------|--------|
| Setup; TOML; direct vs gateway request; client, episodes, UI | A§13.1–13.4 |
| Routing architecture & types; fallback routing demo + **latency benchmarking** | A§13.5–13.6 |
| MiniJinja prompt templates + structured JSON; unified tool-calling | A§13.7–13.8 |
| A/B testing & feedback loop; **gateway-powered support chatbot project** | A§13.9–13.10 |

### 4d. Bifrost
| Study | Source |
|-------|--------|
| Setup & providers; the "problem without gateways"; first call | A§14.1–14.4 |
| Fallback, streaming, logging; virtual keys + **MCP through the gateway** | A§14.5–14.6 |
| Mini-RAG with Qdrant (ingestion + retrieval) through Bifrost | A§14.7–14.8 |

**Tracker topics covered:** *LLM gateways & model routing (fallbacks, multi-provider, load balancing)*; *LLM gateway implementations: Portkey, TensorZero, Bifrost — config/TOML, virtual keys, unified tool-calling, gateway + MCP, benchmarked routing*.

**Exit criteria / artifact:** Reference agent behind one gateway with a documented fallback chain + a benchmark table (p50/p95 latency, cost per provider) that justifies the routing policy.

---

# Phase 5 — Observability & tracing  *(LLMOps track)*

**Goal:** Full request/agent tracing so the gateway + guardrail decisions from phases 2–4 are visible in production.

| Study | Source |
|-------|--------|
| Why observability; frameworks landscape | A§4.1–4.2 |
| **LangSmith:** intro; manual & custom tracing | A§5.1–5.2 |
| LangSmith: simple & agentic RAG tracing; LangGraph app + Studio execution | A§5.3–5.5 |
| **Pydantic Logfire:** intro & setup; basics of tracing LLMs | A§6.1–6.3 |
| Logfire: trace simple RAG, ReAct agent, agentic workflow; test & execute | A§6.4–6.7 |

**Tracker topics covered:** *Observability & tracing (LangSmith, OpenTelemetry-GenAI, Pydantic Logfire)*; *Drift & regression monitoring in production* (via traced eval runs); *Prompt / agent versioning & deploys* (LangSmith).

**Exit criteria / artifact:** Every call in the reference agent traced end-to-end in both LangSmith and Logfire, with a dashboard view showing guardrail hits and gateway fallbacks.

---

# Phase 6 — Caching, rate limiting & cost control  *(LLMOps track)*

**Goal:** Cut cost and latency with exact + semantic caching, and protect providers with rate limiting.

| Study | Source |
|-------|--------|
| Redis setup & prerequisites; intro to Redis for AI/LLM caching | A§21.1–21.2 |
| Exact-match LLM caching | A§21.3 |
| Semantic caching with embeddings | A§21.4 |
| AI-agent conversation memory with Redis | A§21.5 |
| **Rate limiting & API cost control** with Redis | A§21.6 |
| RAG caching + final web app demo | A§21.7 |

**Tracker topics covered:** *Caching: prompt & semantic (Redis / semantic cache store)*; *Rate limiting: token buckets, provider limits, backoff, queueing, concurrency*; *Cost & latency optimization*.

**Exit criteria / artifact:** Before/after cost + latency numbers on the reference agent with exact and semantic caching enabled, plus a working rate limiter with backoff.

---

# Phase 7 — On-prem / private deployment  *(Security + LLMOps)*

**Goal:** The runtime/serving side (LLMOps lens) and the compliance/data-residency side (Security lens) of running models yourself.

| Study | Source |
|-------|--------|
| Self-hosted model serving: vLLM, GPU, containers (Docker), autoscaling | A (project infra: §22–23 Docker/Cloud Run) as the serving pattern |
| Deployment strategies: canary, rollback, feature flags; circuit breakers, HA/DR | A§24 (integration) + Phase-4 fallback patterns |
| On-prem / VPC / Private Link deployment (compliance & data-residency lens) | Applied from your existing Databricks/VPC experience — formalize against the above |
| Tenant isolation & multi-tenant safety; model risk, audit & compliance | A§25 (auth, IAM, isolation in the deployed project) |

**Tracker topics covered (LLMOps):** *Self-hosted model serving (infra lens): vLLM, GPU, containers, autoscaling*; *Deployment strategies: canary, rollback, feature flags; circuit breakers, HA/DR*.
**Tracker topics covered (Security):** *On-prem / VPC / Private Link deployment*; *Tenant isolation & multi-tenant safety*; *Model risk, audit & compliance in regulated verticals*; *Tool / permission sandboxing*.

**Exit criteria / artifact:** A deployment design doc for the reference agent: where it runs (VPC/Private Link), how tenants are isolated, and the rollout/rollback strategy.

---

# Phase 8 — Secured capstone: CI/CD + IaC  *(Shared)*

**Goal:** Ship one end-to-end system that composes every prior phase, deployed via IaC with CI/CD — this is where both tracks converge.

### 8a. Project 1 — Secured Agentic RAG on GCP (course A)
| Study | Source |
|-------|--------|
| Data ingestion pipeline; RAG architecture; GCP + Qdrant + IAM/.env | A§22 |
| Agentic RAG: planner/responder, FlashRank re-rank, retriever graph; API + UI | A§23 |
| Docker → Artifact Registry → Cloud Run deploy | A§23.8–23.9 |
| **Add security:** integrate guardrails → gateways → evals; full eval pipeline | A§24 |

### 8b. Project 2 — Agentic Research Platform w/ Security, Red-Teaming & Memory (course A)
| Study | Source |
|-------|--------|
| Architecture; **Terraform + AWS CLI IaC** setup | A§25.4–25.7 |
| Retry logic, DB connection pool; auth, guardrails, caching; memory + queueing | A§25.9–25.11 |
| Multi-agent system; LangSmith eval; FastAPI + Dockerfile; TensorZero config | A§25.12–25.15 |
| **PyRIT red-teaming dashboard**; frontend; **GitHub Actions CI/CD**; full deploy & test | A§25.16–25.20 |

### 8c. Capstone integration (course C)
| Study | Source |
|-------|--------|
| Production cyclic RAG: guardrails + LLM gateway + evals + IaC on GCP/Groq | C |

**Tracker topics covered:** *CI/CD for prompts & agents; SLOs for nondeterministic systems*; the LLMOps *Project* (Production RAG); the Security *end-to-end secured* deliverables.

**Exit criteria / artifact:** A deployed, publicly-runnable secured agent with: guardrails, a gateway with fallbacks, full tracing, caching + rate limiting, a red-team dashboard, and a green CI/CD pipeline provisioned by Terraform.

---

## Coverage check — every tracker topic maps to a phase

### LLMOps & AI infrastructure
| Tracker topic | Phase |
|---------------|:-----:|
| Serving & inference: latency, throughput, batching | 4, 7 |
| LLM gateways & model routing | 4 |
| Gateway implementations (Portkey/TensorZero/Bifrost, TOML, virtual keys, gateway+MCP, benchmarking) | 4 |
| Observability & tracing (LangSmith, Logfire) | 5 |
| Prompt / agent versioning & deploys | 5, 8 |
| Caching: prompt & semantic (Redis) | 6 |
| Rate limiting (token buckets, backoff, queueing, concurrency) | 6 |
| Cost & latency optimization | 4, 6 |
| CI/CD for prompts & agents; SLOs | 8 |
| Deployment strategies (canary, rollback, flags, circuit breakers, HA/DR) | 7 |
| Drift & regression monitoring | 5 |
| Self-hosted serving (vLLM, GPU, containers, autoscaling) | 7 |

### Security, compliance & private deployment
| Tracker topic | Phase |
|---------------|:-----:|
| Prompt injection & jailbreaks (direct & indirect) | 1, 3 |
| Data governance, PII, secrets; data-poisoning awareness | 2 |
| Tool / permission sandboxing | 7 |
| Guardrails: input/output filtering, PII redaction | 2 |
| Guardrail frameworks (NeMo, Guardrails AI, Bedrock) | 2 |
| Red-teaming with PyRIT (full taxonomy) | 3 |
| On-prem / VPC / Private Link deployment | 7 |
| Model risk, audit & compliance in regulated verticals | 7 |
| Tenant isolation & multi-tenant safety | 7 |

> **Sequencing note:** Phases 1→3 are the Security track end-to-end; 4→6 are the LLMOps track end-to-end;
> 7–8 are shared. If you'd rather finish one tracker fully before the other, do **1,2,3,7(security parts),8a**
> for Security, then **4,5,6,7(infra parts),8b,8c** for LLMOps — the phase artifacts still chain cleanly.
