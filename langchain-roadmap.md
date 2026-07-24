# LangChain Roadmap — Fundamentals · Agents · Vector Store · Memory

> **Scope:** LangChain-specific topics only (LangChain / LangGraph / LangSmith / LangServe / LangMem / LCEL). Non-LangChain prerequisites (raw Python, generic Pydantic, Anaconda/VS Code setup, cloud/DevOps, DSA, etc.) are intentionally **excluded**.
> **Purpose:** A detailed study roadmap built from scraping the 5 source links below, with a column marking which topics are **already covered** in our current tracker. **No tracker changes have been made** — this is a planning document only.
> **Date:** 2026-07-24

---

## Sources Scraped

| # | Source | URL | Accessible | Notes |
|---|--------|-----|:----------:|-------|
| 1 | **LangChain Academy — Introduction to LangChain (Python)** | [link](https://academy.langchain.com/courses/foundation-introduction-to-langchain-python) | ✅ | Free course, ~30 lessons across 3 modules (Create Agent → Advanced Agent → Production-Ready Agent). Agent-first curriculum. |
| 2 | **Udemy — Advanced LangChain Techniques: Mastering RAG Applications** (Markus Lang) | [link](https://www.udemy.com/course/advanced-langchain-techniques-mastering-rag-applications/) | ⚠️ Partial | The URL now **redirects to a different course**. Curriculum reconstructed from web search + Inflearn/Class Central mirrors. Sections 1–10 have verified lecture titles; sections 11–15 (Routing, NeMo Guardrails, LangFuse, Tool Calling, wrap-up) had only section names verifiable — lecture titles **not fabricated**. |
| 3 | **Udemy — Complete Agentic AI Bootcamp with LangGraph and Langchain** | [link](https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/) | ✅ | Full public preview scraped (27 sections / 184 lectures). Heavy LangChain + LangGraph focus. |
| 4 | **Notion — LangChain Deep Dive Part 1** | [link](https://app.notion.com/p/LangChain-Deep-Dive-Part-1-2a61bd0081a981f5bfa5c13489444ef8) | ✅ | Curated roadmap aggregating multiple courses. Sections: Setup & Basics, Core Concepts & Components, LangChain w/ HuggingFace, Chains/Memory/Callbacks. |
| 5 | **Notion — LangChain Deep Dive Part 2** | [link](https://app.notion.com/p/LangChain-Deep-Dive-Part-2-2cd1bd0081a98052adb5d14d171d03ad) | ✅ | Sections: Jupyter AI, Vector Store with LangChain, LangChain + Gemini, Projects. |

**Legend for "In Tracker?" column**
- ✅ **Covered** — topic already exists in a tracker module (module named in the cell).
- 🟡 **Partial** — related/adjacent topic exists but this specific item is narrower/deeper or only implied.
- ❌ **Not covered** — not currently in the tracker; candidate to add.

Tracker modules referenced: `LangChain Fundamentals` · `Tool-Calling AI Agent with LangChain` · `LangGraph Fundamentals` · `AI Agents with LangGraph` · `Memory & state` · `Agentic Memory & Context` · `Embeddings & vector databases`.

---

## 1) LangChain Fundamentals

Core LangChain building blocks: models, prompts, LCEL, output parsing, chains, messages, loaders, and deployment (LangServe).

| Topic | In Tracker? | Tracker Module | Source(s) |
|-------|:-----------:|----------------|-----------|
| What LangChain is; the ecosystem (langchain / langgraph / langsmith) & when to use it | ✅ | LangChain Fundamentals | Notion P1, Bootcamp |
| Complete LangChain ecosystem overview; commercial vs open-source LLMs in LangChain | ✅ | LangChain Fundamentals | Notion P1 |
| Getting started with LangChain + OpenAI / Groq / Ollama | 🟡 | LangChain Fundamentals (chat models) | Bootcamp, Notion P1 |
| Chat models & model I/O interface | ✅ | LangChain Fundamentals | Notion P1, Adv. RAG |
| Prompts & prompt templates | ✅ | LangChain Fundamentals | Notion P1, Bootcamp |
| Few-shot prompt templates | 🟡 | LangChain Fundamentals (prompts) | Notion P1 |
| Caching LLM responses | ❌ | — | Notion P1 |
| LLM streaming (invoke / stream / batch) | ✅ | LangChain Fundamentals (LCEL invoke/stream/batch) | Notion P1, Bootcamp |
| **LCEL** — the Runnable interface | ✅ | LangChain Fundamentals | Adv. RAG, Notion P1, Bootcamp |
| LCEL — build your own mini-LCEL / operator overloading | 🟡 | LangChain Fundamentals (LCEL piping) | Adv. RAG, Notion P1 |
| Most important Runnables (RunnableLambda, RunnablePassthrough, itemgetter) | 🟡 | LangChain Fundamentals (LCEL) | Adv. RAG, Notion P1 |
| LCEL configurable fields; conditional logic, branching & merging | ❌ | — | Notion P1 |
| LCEL pipelines with chat history | 🟡 | LangChain Fundamentals (memory basics) | Adv. RAG, Notion P1 |
| Output parsers & structured output (Pydantic / TypedDict / dataclass / JSON / CSV / Datetime) | ✅ | LangChain Fundamentals | Bootcamp, Notion P1 |
| `.with_structured_output()` method | ✅ | LangChain Fundamentals (structured output) | Notion P1 |
| Chains: sequential & parallel composition | ✅ | LangChain Fundamentals | Notion P1, Bootcamp |
| LLMChain, SimpleSequentialChain, SequentialChain | 🟡 | LangChain Fundamentals (chains) | Notion P1 |
| Router chains (LLMRouterChain) & routing to correct chain | 🟡 | LangChain Fundamentals (chains) / LangGraph (routing) | Notion P1, Adv. RAG (§11) |
| TransformChain, MathChain, QA-documents chains | ❌ | — | Notion P1 |
| Custom chains (`@chain` decorator, custom Runnables) | ❌ | — | Notion P1 |
| Legacy chain → LCEL/Runnable migration | ❌ | — | Notion P1, Adv. RAG |
| Callbacks | ❌ | — | Notion P1 |
| Messages & message types in LangChain | ✅ | LangChain Fundamentals | Bootcamp |
| Document loaders & text splitters (recursive char, char, HTML header, JSON) | 🟡 | LangChain Fundamentals (loaders intro) | Bootcamp, Notion P1 |
| Tagging / summarizing large documents | ❌ | — | Notion P1 |
| Tracing with LangSmith; LangChain Hub | 🟡 | LangGraph Fundamentals (LangSmith debugging) | Notion P1, Bootcamp |
| **LangServe** — deploy Runnable/chain as an API | ❌ | — | Bootcamp, Notion P1 |
| LangChain **v1** updates & middleware (before_model / after_model) | ✅ | LangChain Fundamentals + Tool-Calling Agent | Bootcamp |
| Middleware: summarization & human-in-the-loop | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp, LC Academy (M3) |
| LangChain + HuggingFace integration | 🟡 | Embeddings & vector databases (HF embeddings) | Notion P1, Bootcamp |
| LangChain + Google Gemini (multimodal, safety settings, streaming) | ❌ | — | Notion P2 |
| Jupyter AI & coding companions | ❌ | — | Notion P2 |

**Gap highlights (Fundamentals):** LangServe deployment, callbacks, LCEL configurable fields / branching, custom chains & the `@chain` decorator, legacy→LCEL migration, response caching, Gemini integration, Jupyter AI.

---

## 2) AI Agent with LangChain

Tool calling, agent construction, ReAct, middleware, multi-agent, MCP, and deep agents — the LangChain + LangGraph agent surface.

| Topic | In Tracker? | Tracker Module | Source(s) |
|-------|:-----------:|----------------|-----------|
| Foundational models for agents | ✅ | LangChain Fundamentals / Agent fundamentals | LC Academy (M1 L1) |
| Tools in LangChain: define, bind, call | ✅ | Tool-Calling AI Agent with LangChain | LC Academy, Bootcamp, Adv. RAG (§14) |
| Tool/function calling: single, parallel, forced | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp |
| Pre-built tools (Tavily / DuckDuckGo / Wikipedia / web search) | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp |
| Creating agents using LangChain (v1 `create_agent`) | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp |
| Multimodal messages to agents | 🟡 | Multimodal & document intelligence | LC Academy (M1 L4) |
| Short-term memory for agents | ✅ | Memory & state / Tool-Calling Agent | LC Academy (M1 L3) |
| **ReAct agent** (reason → act → observe) in LangChain | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp, LC Academy |
| ReAct agent architecture in LangGraph (build & implement) | ✅ | AI Agents with LangGraph | Bootcamp |
| Agent with a custom RAG tool (retrieval as a callable tool) | ✅ | Tool-Calling AI Agent with LangChain | Adv. RAG (§9), Bootcamp |
| Agentic RAG (LLM + tools) | ✅ | Advanced RAG & GraphRAG / AI Agents w/ LangGraph | Adv. RAG, Bootcamp |
| Corrective RAG (CRAG) & Adaptive RAG with LangGraph | 🟡 | Advanced RAG & GraphRAG (named variants) | Bootcamp |
| Conversational & custom agents; prompt selection for agents | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp, Notion P1 |
| Building chatbot with multiple tools | ✅ | AI Agents with LangGraph (multi-tool chatbot) | Bootcamp |
| **Agent middleware**: before_model / after_model | ✅ | Tool-Calling AI Agent with LangChain | Bootcamp, LC Academy (M3) |
| Middleware — managing long conversations / summarization | ✅ | Tool-Calling AI Agent with LangChain | LC Academy (M3), Bootcamp |
| Middleware — human-in-the-loop | ✅ | Tool-Calling Agent / Multi-agent control | LC Academy, Bootcamp |
| Dynamic agents (runtime-configured) | 🟡 | AI Agents with LangGraph (reliable agents) | LC Academy (M3 L4) |
| **Multi-agent systems** | ✅ | AI Agents with LangGraph / Multi-agent orchestration | LC Academy (M2 L3), Bootcamp |
| Supervisor & hierarchical multi-agent workflows | ✅ | AI Agents with LangGraph | Bootcamp |
| Context & state for agents | ✅ | LangGraph Fundamentals / Memory & state | LC Academy (M2 L2) |
| **Model Context Protocol (MCP)** with LangChain | ✅ | MCP (Model Context Protocol) | LC Academy (M2 L1), Bootcamp |
| Building MCP servers with tools & client from scratch (LangChain) | ✅ | MCP (building custom servers) | Bootcamp |
| **Deep Agents** with LangChain (planning, sub-agents, backends, skills) | ✅ | Deep agents & harness engineering / AI Agents w/ LangGraph | Bootcamp |
| Deep Agents vs Claude SDK | 🟡 | Agent SDKs (first-party / lab) | Bootcamp |
| Context engineering & its types (for deep agents) | ✅ | Deep agents & harness engineering | Bootcamp |
| Guardrails with LangChain / NeMo Guardrails | 🟡 | Security, compliance & private deployment (guardrails) | Bootcamp, Adv. RAG (§12) |
| LLM Gateways | ✅ | LLMOps & AI infrastructure (LLM gateways) | Bootcamp |
| Agent Chat UI (bonus) | ❌ | — | LC Academy (M3 L6) |
| Agent observability with LangFuse | 🟡 | LLMOps (observability) / Evaluation | Adv. RAG (§13) |
| Email Assistant / Personal Chef / Wedding Planner agent projects | 🟡 | (project examples) | LC Academy |

**Gap highlights (Agents):** Agent Chat UI, LangFuse-specific observability, NeMo Guardrails specifics. Most agent topics are **well covered** across Tool-Calling Agent + AI Agents with LangGraph + MCP + Deep Agents modules.

---

## 3) Vector Store with LangChain

Embeddings, vector stores, retrievers, and retrieval improvement — all through the LangChain interface.

| Topic | In Tracker? | Tracker Module | Source(s) |
|-------|:-----------:|----------------|-----------|
| Short recap of embeddings | ✅ | Embeddings & vector databases | Notion P2 |
| Introduction to vector databases | ✅ | Embeddings & vector databases | Notion P2 |
| OpenAI embeddings (incl. Gen-3 models) | ✅ | Embeddings & vector databases (OpenAI vs HF) | Bootcamp, Notion P2, Adv. RAG (§6) |
| Ollama embeddings | 🟡 | Embeddings & vector databases | Bootcamp, Notion P2 |
| HuggingFace embeddings | ✅ | Embeddings & vector databases (HF vs OpenAI) | Bootcamp, Notion P2 |
| Open-source vs proprietary embedding models | ✅ | Embeddings & vector databases | Adv. RAG (§6) |
| Vector stores — **FAISS** | ✅ | Embeddings & vector databases (FAISS listed) | Bootcamp, Notion P2 |
| Vector store & retriever — **Chroma DB** | ✅ | Embeddings & vector databases (Chroma listed) | Bootcamp, Notion P2 |
| **Pinecone**: auth, indexes, vectors, namespaces | 🟡 | Embeddings & vector databases (Pinecone listed) | Notion P2 |
| Splitting & embedding text using LangChain → insert into index | 🟡 | Embeddings & vector databases (chunking) | Notion P2, Bootcamp |
| Similarity search / asking questions over a vector store | ✅ | Embeddings & vector databases (semantic search) | Notion P2 |
| Vector store + retriever pattern; understanding retrievers & chains | ✅ | LangChain Fundamentals / Embeddings & VDB | Bootcamp, Notion P1 |
| **Indexing API** — keep raw data in sync with the vector store | ❌ | — | Adv. RAG (§3), Notion P1 |
| Chunking techniques (CharacterTextSplitter → custom LLM-based splitter) | ✅ | Embeddings & vector databases (chunking strategies) | Adv. RAG (§5), Bootcamp |
| **MultiQuery** retrieval | 🟡 | Advanced RAG & GraphRAG (query transformation) | Adv. RAG (§7) |
| **HyDE** (hypothetical document embeddings) | ✅ | Advanced RAG & GraphRAG (HyDE) | Adv. RAG (§7) |
| **Parent Document Retriever** (two-stage retrieval; InMemory & Postgres DocStore) | 🟡 | RAG: naive→production (parent-child retrieval) | Adv. RAG (§8) |
| Retrieval post-processing — reranking with a cross-encoder | ✅ | RAG: naive→production (reranking) / Embeddings (reranking & MMR) | Adv. RAG (§10) |
| LLM-based document compression / filtering | 🟡 | RAG: naive→production | Adv. RAG (§10) |
| Routing (query routing to retrievers) | 🟡 | Advanced RAG & GraphRAG | Adv. RAG (§11) |
| Vectorless RAG (PageIndex) vs traditional RAG | ❌ | — | Bootcamp |
| RAGAS — evaluating RAG performance (testset, LLM eval, v0.1→v0.2) | ✅ | RAG evals / Evaluation & eval harnesses (ragas) | Adv. RAG (§4) |

**Gap highlights (Vector Store):** LangChain **Indexing API** (data sync/dedup), Vectorless RAG (PageIndex). Most embedding/vector-store/retriever topics map cleanly onto the existing **Embeddings & vector databases** and **Advanced RAG & GraphRAG** modules.

---

## 4) Memory with LangChain

Conversation history, memory classes, LangGraph state/checkpointing, and LangMem.

| Topic | In Tracker? | Tracker Module | Source(s) |
|-------|:-----------:|----------------|-----------|
| Introduction to memory in LangChain | ✅ | Memory & state | Notion P1 |
| `ChatMessageHistory` object | 🟡 | Memory & state (session/conversation memory) | Notion P1 |
| `ConversationBufferMemory` | 🟡 | Memory & state | Notion P1 |
| `ConversationBufferWindowMemory` | 🟡 | Memory & state | Notion P1 |
| `ConversationSummaryMemory` | 🟡 | Memory & state (summarizing memory) | Notion P1 |
| Managing chat conversation history (trim / filter / summarize) | ✅ | Memory & state (writing/updating/summarizing/forgetting) | Bootcamp, Notion P1 |
| Building chatbot with message history using LangChain | ✅ | Memory & state / LangChain Fundamentals | Bootcamp, Notion P1 |
| Prompt template + `MessagesPlaceholder` for history | 🟡 | LangChain Fundamentals (prompts) / Memory & state | Notion P1, Bootcamp |
| Conversational Q&A chatbot with message history | ✅ | Memory & state | Notion P1 |
| Conversational Q&A — chat with PDF + chat history | 🟡 | RAG: naive→production (project) | Notion P1 |
| Save & load chat message history | 🟡 | Memory & state (persistent knowledge) | Notion P1 |
| LCEL chat message history & memory | 🟡 | Memory & state / LangChain Fundamentals (LCEL) | Adv. RAG, Notion P1 |
| Short-term memory for agents | ✅ | Memory & state | LC Academy (M1 L3) |
| Short-term (scratchpad/context) vs long-term memory | ✅ | Memory & state | (tracker) |
| Memory types: episodic, semantic, procedural | ✅ | Memory & state / Agentic Memory & Context | (tracker) |
| Vector-backed memory: retrieval, relevance + recency, consolidation | ✅ | Memory & state | (tracker) |
| Agent with memory in **LangGraph** | ✅ | AI Agents with LangGraph / LangGraph Fundamentals | Bootcamp |
| **LangGraph state & checkpointing** (persistent state) | ✅ | LangGraph Fundamentals / Memory & state | Bootcamp |
| State schema with Pydantic / dataclasses | ✅ | LangGraph Fundamentals | Bootcamp |
| **LangMem** — semantic / episodic / procedural memory series | ✅ | Agentic Memory & Context (LangMem series) | (tracker) |
| Memory frameworks: mem0, Letta/MemGPT, Zep (tradeoffs) | ✅ | Memory & state | (tracker) |
| File-based memory (AGENTS.md / CLAUDE.md) | ✅ | Memory & state | (tracker) |
| Evaluating memory (does recall raise task success?) | ✅ | Memory & state | (tracker) |

**Gap highlights (Memory):** The **specific LangChain memory classes** (`ConversationBufferMemory`, `BufferWindowMemory`, `SummaryMemory`, `ChatMessageHistory`, `MessagesPlaceholder`) are only implied by the tracker's conceptual memory topics — worth adding as concrete named items. Conceptual memory + LangGraph checkpointing + LangMem are **fully covered**.

---

## Summary — Coverage at a Glance

| Track | ✅ Covered | 🟡 Partial | ❌ Not Covered | Biggest gaps to consider adding |
|-------|:---------:|:----------:|:--------------:|---------------------------------|
| **1. LangChain Fundamentals** | ~13 | ~11 | ~8 | LangServe, callbacks, custom chains / `@chain`, LCEL configurable fields & branching, legacy→LCEL migration, response caching, Gemini, Jupyter AI |
| **2. AI Agent with LangChain** | ~20 | ~8 | ~2 | Agent Chat UI, LangFuse observability, NeMo Guardrails specifics |
| **3. Vector Store with LangChain** | ~12 | ~7 | ~2 | Indexing API (data sync), Vectorless RAG (PageIndex) |
| **4. Memory with LangChain** | ~15 | ~8 | 0 | Concrete LangChain memory classes (Buffer/Window/Summary/MessagesPlaceholder) as named items |

**Overall:** The tracker already covers the **majority** of LangChain-specific material, especially agents (Tool-Calling + LangGraph + MCP + Deep Agents) and memory (Memory & state + Agentic Memory + LangMem). The clearest **net-new candidates** are: **LangServe**, the **Indexing API**, **callbacks**, **custom chains / `@chain` decorator**, **LCEL configurable fields & branching**, **legacy→LCEL migration**, **Vectorless RAG**, **Gemini integration**, and surfacing the **named LangChain memory classes** explicitly.

> Reminder: source #2 (Advanced LangChain Techniques) redirected to a different course; its sections 11–15 lecture titles could not be verified and were **not fabricated**. If you want those, the Inflearn mirror (`inflearn.com/en/course/markus_advanced_langchain`) is the best next source.
