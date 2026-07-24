# RAG Tracker Coverage Analysis: naive → production, Advanced RAG & GraphRAG, Multimodal & Document Intelligence

## Introduction

This document maps the topics required for three planned tracker sections against every learning resource available to the project. Two kinds of resources were analyzed:

1. **Three Notion roadmap pages** (referenced below as N1, N2, N3) and the courses those pages link to. These are the roadmap's own curated course references.
2. **Six scraped Udemy course curricula**, captured in full in `rag.md` and `graph-rag.md`.

**Corrected coverage rule (this replaces the prior version).** The earlier version of this analysis wrongly marked topics as GAP whenever their Notion-linked course had not yet been scraped. That was incorrect — a topic taught by a course that the roadmap already links to is covered regardless of whether we scraped that course's curriculum. The corrected rule is:

- **COVERED** — the topic is in a Notion page **with a course link**, OR it appears in one of the 6 scraped Udemy courses. A Notion mention *with a link* counts as fully covered.
- **PARTIAL** — a bare mention only: no link and no detail.
- **GAP** — absent from **both** the Notion pages **and** the 6 scraped Udemy courses.

The practical effect: genuine gaps are now very few. Most topics previously flagged as gaps were in fact Notion-linked to real courses and are reclassified as COVERED.

## Source inventory

### Scraped Udemy courses (full curriculum captured)

| # | Course | Curriculum file | Status |
|---|---|---|---|
| 1 | Master RAG: Retrieval-Augmented Generation Systems [NEW] | `rag.md` | Scraped |
| 2 | Ultimate RAG Bootcamp | `rag.md` | Scraped |
| 3 | Generative AI with Context: RAG, CAG & KAG | `rag.md` | Scraped |
| 4 | Advanced RAG: Build & Deploy Production GenAI Apps | `rag.md` | Scraped |
| 5 | Neo4j: Cypher, GDS, GraphQL, LLM, KG for RAG | `graph-rag.md` | Scraped |
| 6 | Graph Databases: Neo4j, RDF, KG & GraphRAG | `graph-rag.md` | Scraped |

### Courses referenced and linked in Notion (not scraped, but linked = covered)

| Course | Referenced in | Status |
|---|---|---|
| RAG Systems Essentials (Analytics Vidhya) | N1, N2 | Notion-linked only |
| RAG, AI Agents & GenAI with Python | N1, N2 | Notion-linked only |
| Full stack generative and Agentic AI with Python | N1 | Notion-linked only |
| Complete GenAI with LangChain & HuggingFace | N1, N2 | Notion-linked only |
| LangChain in Action | N1 | Notion-linked only |
| LangChain with Python Bootcamp | N1 | Notion-linked only |
| Ollama and LangChain (2025 Master LangChain and Ollama) | N1 | Notion-linked only |
| Master LangChain + Pinecone | N1 | Notion-linked only |
| Advanced LangChain Techniques | N1, N2 | Notion-linked only |
| Advanced Retrieval Augmented Generation | N2 | Notion-linked only |
| Supercharge AI with Knowledge Graphs | N2, N3 | Notion-linked only |
| DeepLearning.AI / Coursera / Educative KG-RAG graph courses | N3 | Notion-linked only |

## Executive summary of coverage & gaps

**RAG: naive → production**
- Effectively complete. Every in-scope topic from "what is RAG" through production concerns (FastAPI serving, Docker/cloud deployment, observability, guardrails, multi-provider LLMs) is covered by a scraped course, a Notion-linked course, or both.
- Only **one PARTIAL**: cost-efficient/monitored retrieval infrastructure (Postgres/OpenSearch/Qdrant cost tuning, Comet monitoring) appears solely as bare bullets in N2 §11 with no dedicated linked course.
- **No hard gaps.**

**Advanced RAG & GraphRAG**
- Fully covered across advanced retrieval (hybrid, RRF, reranking, MMR, HyDE, decomposition, DPR, contextual retrieval, late chunking), the full agentic/corrective/adaptive/multi-agent RAG family, and the complete graph stack (Neo4j, Cypher, GDS, RDF/SPARQL, GraphQL, KG construction from unstructured data, GraphRAG production architecture).
- Same single **PARTIAL** as above (cost-efficient retrieval/monitoring, N2 §11). CAG's KV-cache internals are covered conceptually but not named as a mechanism — not a true gap.
- **No hard gaps.**

**Multimodal & document intelligence**
- Multimodal RAG (intro, PDF text+images, ColPali, OpenAI File Search) and every document format (PDF, Word, Excel/CSV, PPT, EPUB, JSON, HTML, SQL) are covered.
- **One genuine GAP:** dedicated document layout / structure extraction tooling — table extraction from PDFs, OCR pipelines, and layout-aware libraries (Unstructured.io `partition`, LlamaParse, Azure Document Intelligence). The visual/multimodal angle (ColPali) and messy-PDF handling exist, but structured table/layout extraction is taught nowhere.

---

## RAG: naive → production

### Deduplicated topic coverage

| Topic | Status | Covered by |
|---|---|---|
| What is RAG / why RAG / RAG triad | COVERED | N1 "Intro of RAG System" → RAG Systems Essentials (Analytics Vidhya) + RAG, AI Agents & GenAI w/ Python; Master RAG (rag.md §3); Ultimate RAG Bootcamp §2 (rag.md); Gen AI with Context §3 (rag.md) |
| Naive RAG pitfalls / drawbacks | COVERED | Master RAG §3 "What is RAG and Naive RAG Overview and Pitfalls / Deep Dive into Each Naive RAG Drawbacks" (rag.md) |
| Prompt Engineering vs Fine-Tuning vs RAG | COVERED | N1 → RAG Systems Essentials; Ultimate RAG Bootcamp §2.4 (rag.md) |
| RAG vs Agents vs Agentic RAG | COVERED | N1 → RAG Systems Essentials; Ultimate RAG Bootcamp §12.1 & §16.1 (rag.md) |
| Long context vs RAG (when to choose) | COVERED | Master RAG §3.4 "Long Context vs RAG" (rag.md) |
| Core RAG components (ingestion vs query/generation phases) | COVERED | Ultimate RAG Bootcamp §3 (rag.md); N1 "Basics of Retrieval Systems" → RAG AI Agents & GenAI w/ Python |
| Document ingestion / parsing / loaders (text, PDF, Word, CSV/Excel, JSON, SQL) | COVERED | Ultimate RAG Bootcamp §5 (rag.md); N1 §3 → RAG Systems Essentials, LangChain w/ Python Bootcamp, 2025 Master LangChain and Ollama, Complete GenAI w/ LangChain & HuggingFace; RAGWire ingestion (Advanced RAG §3, rag.md) |
| Handling messy/problematic PDFs | COVERED | Ultimate RAG Bootcamp §5.6 "Handling Common PDF Issues" (rag.md) |
| Chunking & text splitting (recursive/character/HTML/JSON) | COVERED | Ultimate RAG Bootcamp §5.4 (rag.md); N1 §5 → RAG Systems Essentials, LangChain in Action, Complete GenAI; Gen AI with Context §3.2 (rag.md) |
| Semantic chunking | COVERED | Ultimate RAG Bootcamp §8 "Semantic Chunking" (rag.md); N1 §5 → Ultimate RAG Bootcamp |
| Custom / LLM-based chunking | COVERED | N1 §5 → Advanced LangChain Techniques (Notion link) |
| Late chunking | COVERED | Master RAG §8.4 "Late Chunking for Better Context" (rag.md) |
| Embeddings (HuggingFace, OpenAI, Ollama) & cosine similarity | COVERED | Ultimate RAG Bootcamp §6 (rag.md); Gen AI with Context §3.3–3.4 & §4.4–4.5 (rag.md); N1 §6 → RAG Systems Essentials, Complete GenAI, Ollama and LangChain |
| Embedding visualization / 2D projection | COVERED | Master RAG §4.6 & §5.3 (rag.md) |
| Vector stores vs vector databases (Chroma, FAISS, Pinecone, Astra, Qdrant, InMemory) | COVERED | Ultimate RAG Bootcamp §7 (rag.md); Advanced RAG (Qdrant, rag.md §1/§3); N1 §6 → RAG Systems Essentials, Master LangChain + Pinecone; graph-rag.md §6.6 "Basics of Vector Databases" |
| Semantic / similarity search | COVERED | Ultimate RAG Bootcamp §6.5 (rag.md); Gen AI with Context §4.7 (rag.md) |
| Retrievers (MultiQuery, context compression, parent-document) | COVERED | N1 §6 → RAG Systems Essentials, LangChain w/ Python Bootcamp; N2 §2/§3 → Advanced LangChain Techniques; Ultimate RAG Bootcamp §16.4 (rag.md) |
| Basic RAG pipeline (LCEL / RetrievalQA) | COVERED | Ultimate RAG Bootcamp §7.5 LCEL & §7.2–7.4 (rag.md); Gen AI with Context §4.8 (rag.md); graph-rag.md §12.7 "Mastering the RAG Pipeline"; N1 §9 → RAG Systems Essentials |
| Prompt augmentation / context generation | COVERED | Gen AI with Context §3.5 "Context Generation and Prompt Augmentation" (rag.md); N1 §4 → RAG AI Agents & GenAI w/ Python |
| Adding new docs / keeping index in sync | COVERED | Ultimate RAG Bootcamp §7.6 (rag.md); N1 §7 "Indexing & Vector DB Management" → LangChain in Action (PgVector + RecordManager), Advanced LangChain Techniques |
| Dedup on ingestion (SHA-256) & metadata schema | COVERED | Advanced RAG §3.10 & §4.3 (rag.md) |
| Hybrid search (dense + sparse / BM25) | COVERED | Ultimate RAG Bootcamp §9 (rag.md); Advanced RAG §2/§3 (BM25+dense+RRF, rag.md); N2 §2 → Complete GenAI (hybrid + RRF), Ultimate RAG Bootcamp |
| Reciprocal Rank Fusion (RRF) | COVERED | Advanced RAG §2.3 (rag.md); N2 §2 → Complete GenAI w/ LangChain & HuggingFace |
| Reranking (cross-encoder / bi-encoder) | COVERED | Master RAG §6 (rag.md); Ultimate RAG Bootcamp §9.4–9.5 (rag.md); N2 §3 → Advanced LangChain Techniques |
| MMR (maximal marginal relevance) | COVERED | Ultimate RAG Bootcamp §9.6–9.8 (rag.md) |
| Metadata filtering (manual + LLM-driven) | COVERED | Advanced RAG §4.5–4.7 (rag.md) |
| Query expansion / multi-query / decomposition / HyDE | COVERED | Ultimate RAG Bootcamp §10 (rag.md); Master RAG §4–5 (rag.md); N2 §2 → Ultimate RAG Bootcamp & Advanced LangChain Techniques |
| Dense Passage Retrieval (DPR) | COVERED | Master RAG §7 (rag.md) |
| Contextual retrieval (Anthropic) | COVERED | Master RAG §8.3 (rag.md); N1 §9 → RAG Systems Essentials |
| Source-aware / citation-aware RAG | COVERED | N1 §9 → RAG Systems Essentials |
| Multimodal RAG (text+images; ColPali) | COVERED | Ultimate RAG Bootcamp §11 (rag.md); Master RAG §8.7 ColPali (rag.md); N2 §1 → RAG Systems Essentials, RAG AI Agents & GenAI w/ Python |
| Conversational / chat-history RAG | COVERED | Ultimate RAG Bootcamp §7.7 (rag.md); N1 §11 → RAG Systems Essentials, Complete GenAI |
| Persistent / memory RAG | COVERED | Ultimate RAG Bootcamp §21 "RAG With Persistant Memory" (rag.md) |
| Agentic RAG (tools, memory, ReAct) | COVERED | Ultimate RAG Bootcamp §15–16 (rag.md); Advanced RAG §4.8–4.11 (rag.md); Master RAG §8.5 (rag.md); N2 §7 → Advanced LangChain Techniques, RAG Systems Essentials, RAG AI Agents & GenAI w/ Python |
| Autonomous RAG (CoT, self-reflection, iterative retrieval) | COVERED | Ultimate RAG Bootcamp §17 (rag.md) |
| Multi-agent RAG (supervisor/hierarchical; CrewAI/AutoGen/MS Agent Framework) | COVERED | Ultimate RAG Bootcamp §18 (rag.md); Advanced RAG §9 (rag.md) |
| Corrective RAG (CRAG) | COVERED | Ultimate RAG Bootcamp §19 (rag.md) |
| Adaptive RAG | COVERED | Ultimate RAG Bootcamp §20 (rag.md) |
| Self-correcting RAG (LangGraph) | COVERED | Advanced RAG §9.2–9.4 (rag.md) |
| Cache-Augmented Generation (CAG / cache RAG) | COVERED | Ultimate RAG Bootcamp §22 (rag.md); Gen AI with Context §5–6 (rag.md) |
| Knowledge-Augmented Generation (KAG) | COVERED | Gen AI with Context §7–8 (rag.md) |
| Vectorless RAG (PageIndex) | COVERED | Ultimate RAG Bootcamp §23 (rag.md) |
| GraphRAG / knowledge-graph RAG | COVERED | Master RAG §8.6 (rag.md); Ultimate RAG Bootcamp §27–28 (rag.md); graph-rag.md §9 (Neo4j GDS course) & §13 (Graph Databases course); N2 §9 & N3 → Supercharge AI w/ KG, Neo4j course, Graph Databases course |
| Routing (embedding vs LLM; SQL vs vectorstore) | COVERED | N2 §4 → Advanced LangChain Techniques |
| RAG evaluation (test datasets, metrics, LLM-as-judge) | COVERED | Ultimate RAG Bootcamp §26 (rag.md); N2 §11 concepts (bare); "evaluating retrieval quality" |
| Guardrails / safety / alignment | COVERED | Ultimate RAG Bootcamp §24 "Guardrails with LangChain" (rag.md); N2 §5 → Advanced LangChain Techniques (NeMo Guardrails) |
| Robust LLM impl (caching, retry/backoff, rate limits) | COVERED | N2 §10 → Advanced Retrieval Augmented Generation (Udemy) |
| LLM Gateways | COVERED | Ultimate RAG Bootcamp §25 "LLM Gateways" (rag.md) |
| Observability / tracing (LangSmith, LangFuse) | COVERED | Ultimate RAG Bootcamp §14.5/§15.6 LangSmith (rag.md); Advanced RAG §1.6 LangSmith (rag.md); N2 §6 → Advanced LangChain Techniques (LangFuse) |
| Scalable RAG w/ async queues & distributed workers (RQ/Redis, worker orchestration) | COVERED | N1 §10 → Full stack generative and Agentic AI with python |
| Chat UI (Streamlit / Chainlit) | COVERED | Ultimate RAG Bootcamp §29.8 Streamlit (rag.md); Advanced RAG §7 Chainlit (rag.md); N2 §8 → LangChain Mastery (Streamlit) |
| FastAPI serving (OpenAI-compatible, SSE streaming, auth) | COVERED | Advanced RAG §8 (rag.md); N1 §6 RAG Service w/ FastAPI → LangChain in Action |
| Deployment (Docker, Render, Railway, AWS ECS, GCP, Azure) | COVERED | Advanced RAG §10–11 (rag.md) |
| API key security / secrets in prod | COVERED | Advanced RAG §10.5/§10.9–10.11 (rag.md) |
| Local vector DB w/ Docker Compose | COVERED | N1 §1 Chat-with-PDF → Full stack generative and Agentic AI with python; Advanced RAG §1.7 Docker+Qdrant (rag.md) |
| Multi-provider LLM/embedding (OpenAI/Groq/Gemini/Ollama) | COVERED | Advanced RAG §5 (rag.md); Ultimate RAG Bootcamp §7.8 GROQ (rag.md) |
| Cost-efficient retrieval (Postgres/OpenSearch/Qdrant) & monitoring (Langfuse/Comet) | PARTIAL | N2 §11 "Some More Concepts in RAG" — bare concept bullets, no dedicated course link |

### Gaps (absent from BOTH Notion pages and scraped courses)

No hard gaps for this section. Every RAG topic in scope appears either in a Notion roadmap page with a linked course or in one of the six scraped Udemy curricula. The only near-gaps are production concerns that are named but thinly resourced (see PARTIAL row above), not absent.

### Duplicates / overlaps collapsed

- **Naive vs advanced RAG intro** appears in Master RAG §3, Ultimate RAG Bootcamp §2, Gen AI with Context §3, and N1 "Intro of RAG System" → collapsed into one "What is RAG" + one "Naive RAG pitfalls" entry.
- **Chunking** split across Ultimate RAG Bootcamp §5 (splitting) and §8 (semantic), N1 §5, Gen AI with Context §3.2, Master RAG §8.4 (late chunking) → merged into three distinct entries (general chunking, semantic chunking, late chunking) plus custom chunking.
- **Vector stores/DBs** named separately in Ultimate RAG Bootcamp §6 (embeddings+DBs) and §7 (stores vs DBs), Advanced RAG (Qdrant), graph-rag.md §12.6, N1 §6 → one entry.
- **Hybrid search + RRF + reranking**: Ultimate RAG Bootcamp §9, Advanced RAG §2–3, Master RAG §6, N2 §2–3 all overlap → kept hybrid-search, RRF, reranking, and MMR as separate sub-topics but deduped across courses.
- **Query expansion / multi-query / HyDE / decomposition**: Ultimate RAG Bootcamp §10, Master RAG §4–5, N2 §2 → collapsed into one entry.
- **Agentic RAG** appears in Ultimate RAG Bootcamp §16, Advanced RAG §4/§9, Master RAG §8.5, N2 §7 → one entry (multi-agent, autonomous, corrective, adaptive, self-correcting kept as distinct variants).
- **GraphRAG / knowledge-graph RAG**: Ultimate RAG Bootcamp §27–28, both graph-rag.md courses, Gen AI with Context KAG, N2 §9 / N3 course list → one entry (GraphRAG treated as adjacent-but-in-scope since section scope lists agentic/eval/production, and GraphRAG is a retrieval variant; the dedicated Graph section owns the deep Neo4j/Cypher/GDS topics).
- **Conversational vs persistent-memory RAG**: Ultimate RAG Bootcamp §7.7 (conversational) vs §21 (persistent memory) kept as two entries since one is chat-history and the other is durable cross-session memory.
- **Chat UI**: Streamlit (Ultimate RAG Bootcamp, N2 §8) and Chainlit (Advanced RAG §7) merged into one "Chat UI" entry.
- **Observability**: LangSmith (Ultimate RAG Bootcamp / Advanced RAG) and LangFuse (N2 §6/§10) merged into one tracing/observability entry.

---

## Advanced RAG & GraphRAG

### Deduplicated topic coverage

| Topic | Status | Covered by |
|---|---|---|
| Naive/traditional RAG vs advanced RAG (drawbacks, long-context vs RAG) | COVERED | Master RAG: Retrieval-Augmented Generation Systems (scraped); Ultimate RAG Bootcamp (scraped) |
| Hybrid search — dense + sparse / BM25 | COVERED | Ultimate RAG Bootcamp (scraped, §9); Advanced RAG: Build & Deploy Production GenAI Apps (scraped, RAGWire BM25+dense); N2 "Improve RAG Performance" → Complete GenAI w/ LangChain & HuggingFace; N2 §11 → Ultimate RAG Bootcamp |
| Reciprocal Rank Fusion (RRF) | COVERED | Advanced RAG: Build & Deploy (scraped, RAGWire "Dense + Sparse Search with RRF"); N2 → Complete GenAI w/ LangChain & HuggingFace |
| Reranking with cross-encoder / bi-encoder | COVERED | Master RAG (scraped, §6 Re-Ranking w/ Cross-encoder); Ultimate RAG Bootcamp (scraped, reranking hybrid); N2 §3 "Postprocessing" → Advanced LangChain Techniques |
| Maximal Marginal Relevance (MMR) | COVERED | Ultimate RAG Bootcamp (scraped, §9 MMR theory + impl + when to use); N2 → Ultimate RAG Bootcamp |
| Query expansion / enhancement | COVERED | Ultimate RAG Bootcamp (scraped, §10); Master RAG (scraped, §4 expansion w/ generated answers); N2 → Ultimate RAG Bootcamp |
| Multi-query retrieval | COVERED | Master RAG (scraped, §5 Query Expansion w/ Multiple Queries); N2 "Multi Query Retrieval" → Advanced LangChain Techniques; N1 §6 Retrievers & MultiQuery → RAG Systems Essentials |
| Query decomposition / planning | COVERED | Ultimate RAG Bootcamp (scraped, §10 decomposition; §17 query planning & decomposition) |
| HyDE (Hypothetical Document Embeddings) | COVERED | Ultimate RAG Bootcamp (scraped, §10 HyDE); N2 → Ultimate RAG Bootcamp + Advanced LangChain Techniques |
| Dense Passage Retrieval (DPR) | COVERED | Master RAG (scraped, §7 DPR) |
| Parent-document / two-stage retrieval | COVERED | N2 §2 "Parent Document Retriever – Two-Stage Retrieval" → Advanced LangChain Techniques |
| Contextual retrieval (Anthropic technique) | COVERED | Master RAG (scraped, §8 Contextual Retrieval); N1 §9 Contextual retrieval RAG → RAG Systems Essentials |
| Late chunking | COVERED | Master RAG (scraped, §8 Late Chunking for Better Context) |
| Semantic / advanced chunking | COVERED | Ultimate RAG Bootcamp (scraped, §8); N1 §5 → Ultimate RAG Bootcamp / Complete GenAI / Advanced LangChain Techniques |
| Routing (embedding-based vs LLM; SQL vs vectorstore) | COVERED | N2 §4 "Routing" → Advanced LangChain Techniques; Ultimate RAG Bootcamp (scraped, LangGraph router) |
| Postprocessing / context compression / filtering | COVERED | N2 §3 "Postprocessing Documents" (LLM-based compression/filtering) → Advanced LangChain Techniques; N1 §6 Context Compression → RAG Systems Essentials / LangChain with Python Bootcamp |
| Corrective RAG (CRAG) | COVERED | Ultimate RAG Bootcamp (scraped, §19); Advanced RAG: Build & Deploy (scraped, LangGraph self-correcting RAG) |
| Adaptive RAG | COVERED | Ultimate RAG Bootcamp (scraped, §20) |
| Self / autonomous RAG (self-reflection, iterative retrieval, CoT) | COVERED | Ultimate RAG Bootcamp (scraped, §17 Autonomous RAG) |
| Agentic RAG | COVERED | Ultimate RAG Bootcamp (scraped, §16); Advanced RAG: Build & Deploy (scraped, §4/§6); Master RAG (scraped, §8); N2 §7 → Advanced LangChain Techniques / RAG Systems Essentials / RAG AI Agents & GenAI w/ Python |
| Multi-agent RAG (supervisor, hierarchical; CrewAI/AutoGen/MS Agent Framework) | COVERED | Ultimate RAG Bootcamp (scraped, §18); Advanced RAG: Build & Deploy (scraped, §9 LangGraph/CrewAI/AutoGen/Microsoft) |
| RAG with persistent memory | COVERED | Ultimate RAG Bootcamp (scraped, §21) |
| Cache-Augmented Generation (CAG) | COVERED | Ultimate RAG Bootcamp (scraped, §22); Generative AI with Context: RAG, CAG & KAG (scraped, §5–6) |
| Knowledge-Augmented Generation (KAG) | COVERED | Generative AI with Context: RAG, CAG & KAG (scraped, §7–8) |
| Vectorless RAG (PageIndex) | COVERED | Ultimate RAG Bootcamp (scraped, §23) |
| Multimodal RAG (incl. ColPali) | COVERED | Ultimate RAG Bootcamp (scraped, §11); Master RAG (scraped, §8 ColPali); N2 §1 → RAG Systems Essentials / RAG AI Agents & GenAI w/ Python |
| Guardrails (LangChain / NeMo) | COVERED | Ultimate RAG Bootcamp (scraped, §24); N2 §5 NeMo Guardrails → Advanced LangChain Techniques |
| LLM gateways | COVERED | Ultimate RAG Bootcamp (scraped, §25) |
| Metadata filtering (manual + LLM-driven auto) | COVERED | Advanced RAG: Build & Deploy (scraped, §4) |
| RAG evaluation / eval harness | COVERED | Ultimate RAG Bootcamp (scraped, §26 LLM-as-judge, test datasets) |
| Tracing / observability (LangFuse) | COVERED | N2 §6 LangFuse → Advanced LangChain Techniques; N2 §10 → Advanced Retrieval Augmented Generation |
| Neo4j fundamentals / property graph model / installation | COVERED | Neo4j: Cypher, GDS, GraphQL, LLM, KG for RAG (scraped, §1); Graph Databases: Neo4j, RDF, KG & GraphRAG (scraped, §5); Ultimate RAG Bootcamp (scraped, §27) |
| Cypher query language (basic → advanced, UNWIND/COLLECT) | COVERED | Neo4j: Cypher, GDS... (scraped, §2, §4); Ultimate RAG Bootcamp (scraped, §27) |
| Graph Data Science (GDS) — centrality, community detection, node similarity, pathfinding | COVERED | Neo4j: Cypher, GDS... (scraped, §3) |
| Classic graph algorithms (DFS/BFS/Dijkstra/APOC) | COVERED | Graph Databases: Neo4j, RDF... (scraped, §8) |
| RDF & SPARQL | COVERED | Graph Databases: Neo4j, RDF... (scraped, §9 RDF, GraphDB, SPARQL) |
| GraphQL (schema, query, mutation, client/server) | COVERED | Neo4j: Cypher, GDS... (scraped, §5); Graph Databases: Neo4j, RDF... (scraped, §10) |
| Neo4j performance tuning / indexing (PROFILE, INDEX) | COVERED | Neo4j: Cypher, GDS... (scraped, §7); Graph Databases: Neo4j, RDF... (scraped, §5 indexing) |
| Python + Neo4j driver | COVERED | Neo4j: Cypher, GDS... (scraped, §8); Graph Databases: Neo4j, RDF... (scraped, §7) |
| Loading data into graph (CSV/JSON) | COVERED | Neo4j: Cypher, GDS... (scraped, §6) |
| Knowledge graphs from unstructured data with LLMs | COVERED | Neo4j: Cypher, GDS... (scraped, §9 Build KG from Unstructured Data with LLMs) |
| Knowledge graphs — concepts & use cases (fraud detection) | COVERED | Graph Databases: Neo4j, RDF... (scraped, §11); Generative AI with Context (scraped, §7 KG) |
| Knowledge-graph RAG / GraphRAG (KG for RAG in Python) | COVERED | Neo4j: Cypher, GDS... (scraped, §9 GraphRAG); Graph Databases: Neo4j, RDF... (scraped, §13); N3 → all listed KG-RAG courses (DeepLearning.AI, Coursera, Educative) |
| GraphRAG production architecture + traceability | COVERED | Graph Databases: Neo4j, RDF... (scraped, §13 GraphRAG Production Architecture; AI Traceability) |
| LangChain + graph DB integration (GraphQuery chain, prompting strategies) | COVERED | Ultimate RAG Bootcamp (scraped, §28); N2 §9 → Ultimate RAG Bootcamp |
| LightRAG | COVERED | N2 §9 "Knowledge Graph with LightRAG" → RAG AI Agents & GenAI w/ Python |
| Bloom / graph visualization | COVERED | Neo4j: Cypher, GDS... (scraped, §6 Bloom for Visualization) |
| Source-aware / citation-aware RAG | COVERED | N1 §9 → RAG Systems Essentials |
| Cost-efficient retrieval / monitoring (Postgres/OpenSearch/Qdrant, Comet) | PARTIAL | N2 §11 "Some More Concepts in RAG" — bare concept list, no dedicated course link |

### Gaps (absent from BOTH Notion pages and scraped courses)

No hard gaps within the defined scope. Every topic in the section scope is either covered by a scraped Udemy curriculum or by a Notion roadmap entry with a linked course. Notes on thin/adjacent items:

- **CAG-specific caching internals (e.g., KV-cache preloading) as a named technique** — Covered conceptually (CAG modules exist in Ultimate RAG Bootcamp §22 and Generative AI with Context §5–6), but neither scraped curriculum names the KV-cache mechanism explicitly. Not a true gap since the paradigm is covered.
- **Cost-efficient/monitored retrieval infrastructure** (Postgres/OpenSearch/Qdrant cost tuning, Comet monitoring) — only appears as the bare bullet list in N2 §11 with no dedicated course link → marked PARTIAL above, the closest thing to a gap in this section.

### Duplicates / overlaps collapsed

- **Hybrid search** appears in 3 sources (Ultimate RAG Bootcamp §9, Advanced RAG: Build & Deploy RAGWire, N2 §2 → Complete GenAI) plus the N2 §11 bare mention — collapsed into one entry.
- **Reranking / cross-encoder** appears in Master RAG §6, Ultimate RAG Bootcamp §9 (reranking hybrid), and N2 §3 postprocessing — merged into one "reranking with cross-encoder" entry (kept distinct from generic postprocessing/compression).
- **Query expansion**, **query decomposition**, and **HyDE** are grouped in Ultimate RAG Bootcamp §10 and split across Master RAG §4/§5 and N2 §2 — kept as three distinct sub-topics (expansion, decomposition, HyDE) but noted they share the same modules.
- **Multi-query retrieval** vs **query expansion with multiple queries** (Master RAG §5) — treated as the same technique, merged.
- **Agentic RAG** vs **Multi-agent RAG** — collapsed the many overlapping mentions (Ultimate RAG Bootcamp §16/§18, Advanced RAG: Build & Deploy §4/§6/§9, N2 §7) into two entries (single-agent agentic vs multi-agent).
- **Corrective RAG** — the standalone Ultimate RAG Bootcamp §19 and the "LangGraph self-correcting RAG" in Advanced RAG: Build & Deploy §9 are the same concept, merged.
- **GraphRAG / KG-for-RAG** — appears in both scraped Neo4j courses (§9 / §13), Generative AI with Context (KAG), and the entire N3 course list (DeepLearning.AI, Coursera, Educative KG-RAG courses) — collapsed into one KG-RAG entry plus a separate "production architecture/traceability" entry.
- **Neo4j property graph model / Cypher basics** appear in all three of Ultimate RAG Bootcamp §27, Neo4j: Cypher GDS course, and Graph Databases course — deduplicated into the Neo4j-fundamentals and Cypher entries.
- **GraphQL** and **RDF/SPARQL** each appear across both graph-rag.md courses — merged per topic.

---

## Multimodal & document intelligence

### Deduplicated topic coverage

| Topic | Status | Covered by |
|---|---|---|
| Multimodal RAG — concepts / introduction | COVERED | N2 "Multimodal RAG Systems" → RAG Systems Essentials (Analytics Vidhya); rag.md **Ultimate RAG Bootcamp** §11.1 "Introduction To MultiModal RAG"; rag.md **Master RAG** §8.7 |
| Multimodal RAG over PDFs (text + images) | COVERED | rag.md **Ultimate RAG Bootcamp** §11.2 "MultiModal RAG Implementation (PDF With Text And Images)"; N2 → Ultimate RAG Bootcamp |
| Multimodal RAG with ColPali | COVERED | rag.md **Master RAG: Retrieval-Augmented Generation Systems [NEW]** §8.7 "Multimodal RAG with ColPali" |
| RAG with OpenAI File Search | COVERED | N2 "Multimodal RAG Systems" → RAG AI Agents & GenAI w/ Python (Udemy) |
| Multimodal RAG projects (end-to-end) | COVERED | N2 → RAG AI Agents & GenAI w/ Python |
| Document loaders — fundamentals & practice | COVERED | N1 §3 → RAG Systems Essentials, LangChain with Python Bootcamp; rag.md **Ultimate RAG Bootcamp** §5 "Data Ingestion And Data Parsing Techniques" |
| Document structure / object model (LangChain) | COVERED | rag.md **Ultimate RAG Bootcamp** §5.2 "Document Structure In LangChain"; N1 §3 → RAG Systems Essentials |
| Text data parsing/ingestion | COVERED | rag.md **Ultimate RAG Bootcamp** §5.3; N1 §3 |
| PDF parsing + handling common PDF issues | COVERED | rag.md **Ultimate RAG Bootcamp** §5.5–5.6; N1 §3 PyMuPDFLoader → 2025 Master LangChain and Ollama |
| Word (.docx) parsing | COVERED | rag.md **Ultimate RAG Bootcamp** §5.7; N1 §3 "RAG with Unstructured Data (Word)" → RAG AI Agents & GenAI w/ Python |
| Excel / CSV parsing | COVERED | rag.md **Ultimate RAG Bootcamp** §5.8; graph-rag.md **Neo4j: Cypher, GDS, GraphQL…** §6.2 "Load Data from a CSV file" |
| PowerPoint (PPT) parsing | COVERED | N1 §3 "RAG with Unstructured Data (PowerPoint)" → RAG AI Agents & GenAI w/ Python |
| EPUB parsing | COVERED | N1 §3 "RAG with Unstructured Data (EPUB)" → RAG AI Agents & GenAI w/ Python |
| JSON parsing / processing | COVERED | rag.md **Ultimate RAG Bootcamp** §5.9; N1 §3 Recursive JSON splitter → Complete GenAI w/ LangChain & HuggingFace; graph-rag.md **Neo4j…** §6.3 "Load Data from JSON file" |
| HTML parsing / structure splitting | COVERED | N1 §3 "HTML Header" text splitter → Complete GenAI w/ LangChain & HuggingFace |
| SQL database parsing / ingestion | COVERED | rag.md **Ultimate RAG Bootcamp** §5.10 "SQL Databases Parsing And Processing" |
| Chunking strategies for different formats | COVERED | N1 §3 "RAG with Unstructured Data (chunking strategies per type)" → RAG AI Agents & GenAI w/ Python; rag.md **Ultimate RAG Bootcamp** §8 (advanced/semantic chunking) |
| Unified pipelines over diverse documents | COVERED | N1 §3 "RAG with Unstructured Data (unified pipelines)" → RAG AI Agents & GenAI w/ Python; rag.md **Ultimate RAG Bootcamp** §29 End-to-End RAG Document Search Project |
| Layout/structure-aware parsing beyond visual (table extraction, OCR, dedicated layout-detection libraries e.g. Unstructured.io/LlamaParse) | GAP | Only touched via §5.6 "Handling Common PDF Issues" and ColPali (visual); no dedicated table-extraction / layout-detection module in any provided resource |

### Gaps (absent from BOTH Notion pages and scraped courses)

- **Dedicated document layout / structure extraction tooling** — parsing complex layouts, table extraction from PDFs, OCR pipelines, and layout-aware libraries (e.g., Unstructured.io `partition`, LlamaParse, Azure Document Intelligence). ColPali (Master RAG §8.7) covers the *visual/multimodal* retrieval angle and "Handling Common PDF Issues" (Ultimate RAG Bootcamp §5.6) touches messy PDFs, but no resource teaches structured table/layout extraction as a distinct skill. This is the only genuine gap in the section; every listed format (PDF, Word, Excel/CSV, PPT, EPUB, JSON, HTML, SQL) is otherwise covered.

### Duplicates / overlaps collapsed

- **"Introduction to Multimodal RAG"** appeared three times — N2 (RAG Systems Essentials), rag.md Ultimate RAG Bootcamp §11.1, and rag.md Master RAG §8 — collapsed into one COVERED entry.
- **JSON parsing** appeared as Ultimate RAG Bootcamp §5.9, N1's "Recursive JSON" splitter (Complete GenAI), and Neo4j course §6.3 "Load Data from JSON" — merged.
- **CSV/Excel parsing** appeared as Ultimate RAG Bootcamp §5.8 and Neo4j course §6.2 "Load Data from a CSV file" — merged.
- **Document loaders / data ingestion** is spread across N1 §3 (RAG Systems Essentials, LangChain with Python Bootcamp, 2025 Master LangChain and Ollama, Complete GenAI) plus Ultimate RAG Bootcamp §5 — collapsed into "Document loaders — fundamentals & practice."
- **Word / PowerPoint / EPUB / PDF via "RAG with Unstructured Data"** (N1 §3 → RAG AI Agents & GenAI w/ Python) is a single Notion bullet spanning multiple formats; split into per-format rows for clarity but all trace to the same linked course.
- **Chunking-per-format vs. general advanced chunking**: the format-specific chunking (N1 "RAG with Unstructured Data") is kept here; generic semantic/advanced chunking (Ultimate RAG Bootcamp §8) belongs primarily to the chunking/retrieval section and is only cross-referenced.

---

## Recommendations for building the 3 tracker sections

1. **Build all three sections now — coverage is strong.** Under the corrected rule, there is exactly one genuine content gap across all three sections (document layout/table/OCR extraction). Everything else is either scraped or Notion-linked, so each section can be populated with real, linkable resources.

2. **RAG: naive → production.** Use the deduplicated table above as the topic spine, ordered roughly ingestion → retrieval → generation → advanced variants → production. Lead each topic with the scraped course section (`rag.md` anchors) where one exists, and fall back to the Notion-linked course otherwise. Flag the single PARTIAL item (cost-efficient retrieval + Comet/Langfuse monitoring) as "concept only — needs a dedicated resource" rather than complete.

3. **Advanced RAG & GraphRAG.** Split visually into two lanes: (a) advanced retrieval + agentic RAG family (mostly Ultimate RAG Bootcamp, Master RAG, Advanced RAG: Build & Deploy), and (b) the graph stack (both scraped Neo4j/graph courses plus the N3 DeepLearning.AI/Coursera/Educative KG-RAG list). Keep the same PARTIAL caveat for cost/monitoring. Note CAG KV-cache internals as "covered conceptually, mechanism not named" so expectations are accurate.

4. **Multimodal & document intelligence.** Populate the multimodal-RAG and per-format-parsing rows directly from the table. Surface the one real GAP prominently as a "recommended add-on": source a short module or resource on layout-aware extraction (Unstructured.io `partition`, LlamaParse, or Azure Document Intelligence) plus table extraction and OCR. This is the single highest-value acquisition to make the trio fully complete.

5. **Cross-section hygiene.** GraphRAG legitimately spans both the RAG-production section (as a retrieval variant) and the Advanced/GraphRAG section (as the deep Neo4j/Cypher/GDS track). Cross-reference rather than duplicate: keep the deep graph topics owned by the Advanced section and link to them from the RAG-production GraphRAG entry.

6. **Record provenance in each tracker entry.** For every topic, store whether the source is *scraped* (with the `rag.md`/`graph-rag.md` section anchor) or *Notion-linked-only* (with the course name). This preserves the distinction that drove the corrected rule and makes it obvious which entries would benefit from future scraping without ever being mislabeled as gaps.