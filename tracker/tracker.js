/* Shared renderer for the topic-first tracker.
   Reads window.LEARNING_DATA (from ../data.js or ../../data.js) and renders the hub
   and per-track topic pages. Slugs are derived from module titles the same way in
   Python (generator) and here, so topics/<slug>.html always resolves to one module. */
(function () {
  "use strict";

  var LAST_TOPIC = null;   // {slug, mountId} of the most recent renderTopic call

  function slugify(t) {
    return (String(t).toLowerCase().match(/[a-z0-9]+/g) || []).join("-");
  }

  // Re-render the current topic page (used by an optional status layer after a
  // status change or a remote sync). No-op if renderTopic hasn't run.
  function rerenderTopic() {
    if (LAST_TOPIC) renderTopic(LAST_TOPIC.slug, LAST_TOPIC.mountId);
  }

  // The four non-Udemy cohort / self-paced courses that drive the study map.
  var CC = {
    ae:   "https://masterclaudecode.com",                                        // Agent Engineer (Ray Amjad)
    c4s1: "https://code4startup.com/courses/claude-code-mastery-level-1/",        // Code4Startup L1
    c4s2: "https://code4startup.com/courses/claude-code-mastery-level-2/",        // Code4Startup L2
    c4s3: "https://code4startup.com/courses/claude-code-mastery-level-3/",        // Code4Startup L3
    bb:   "https://bytebyteai.com/c/build-with-claude-code",                      // ByteByteAI (John Kim)
    ah:   "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-m0k0w",    // AI Hero (Matt Pocock)
    // Udemy courses referenced only by the optional top-ups (building around Claude, niche workflows)
    mc:   "https://www.udemy.com/course/claude-ai-masterclass/",
    aic:  "https://www.udemy.com/course/ai-coder-from-vibe-coder-to-agentic-engineer/",
    ft:   "https://www.udemy.com/course/claude-code-fast-track/"
  };

  // Phase plan mirrors claude-code-roadmap-cohort.md (the de-duplicated study map
  // across the 4 non-Udemy courses) — NOT the Udemy claude-code-roadmap.md.
  var ENRICH = {
    "claude-code-operator-mastery": {
      title: "Curated, phase-wise study plan (cohort study map)",
      body: "This plan follows the de-duplicated cohort & self-paced study map across the four non-Udemy courses — Agent Engineer, Code4Startup, ByteByteAI, and AI Hero — so you watch each concept once. Each phase links to its primary course; both full roadmaps (rendered) are below.",
      docs: [
        ["🎓 Cohort & self-paced study map", "../../claude-code-roadmap-cohort.html"],
        ["📘 Udemy roadmap (11 phases)", "../../claude-code-roadmap.html"]
      ],
      phases: [
        ["0", "Decide & set up", "Install Claude Code and do the edit → review loop.", [["Agent Engineer §1–2", CC.ae], ["Code4Startup L1", CC.c4s1]]],
        ["1", "Core fundamentals", "Sessions, permissions, /context, slash commands, settings.json.", [["Agent Engineer §3", CC.ae], ["Code4Startup L1·M02", CC.c4s1]]],
        ["2", "Context engineering & CLAUDE.md", "Finite memory, \"fresh & condensed,\" Second Brain, CLAUDE.md.", [["ByteByteAI", CC.bb], ["AI Hero — Steering", CC.ah], ["Agent Engineer §6", CC.ae]]],
        ["3", "Planning & spec discipline", "Plan/Execute/Clear, decomposition, PRDs, tracer bullets.", [["AI Hero — Planning", CC.ah], ["Agent Engineer §4–5", CC.ae]]],
        ["4", "MCP", "Servers, connectors, MCP search — and when NOT to use MCP.", [["Agent Engineer §7", CC.ae], ["Code4Startup L1·M04", CC.c4s1], ["ByteByteAI", CC.bb]]],
        ["5", "Skills, commands, hooks & plugins", "Skills, slash commands, hooks, plugins, composability.", [["Agent Engineer §13–16", CC.ae], ["AI Hero", CC.ah], ["ByteByteAI", CC.bb]]],
        ["6", "Subagents & multi-agent orchestration", "Worktrees, subagents vs agent teams, parallel development.", [["ByteByteAI", CC.bb], ["Agent Engineer §11–12", CC.ae], ["Code4Startup L2·M07", CC.c4s2]]],
        ["7", "Feedback loops, Ralph & autonomy", "Green CI, test categorization, Ralph supervised vs AFK, human-in-the-loop.", [["AI Hero", CC.ah], ["ByteByteAI", CC.bb], ["Agent Engineer", CC.ae]]],
        ["8", "Browser, remote & automation", "Claude in Chrome, Web/Desktop, Slack/GitHub apps, Telegram/remote/scheduled.", [["Agent Engineer §8–10, §17", CC.ae], ["ByteByteAI /chrome", CC.bb]]],
        ["9", "Build reps & projects", "GitHub issue→PR, UI design, Agile BMAD, business automation, full SaaS build.", [["Code4Startup L2", CC.c4s2], ["Code4Startup L3", CC.c4s3]]],
        ["10", "Reference & niche (ongoing)", "Codex interop + Advanced + Niche catalog — a look-up reference, not a linear watch.", [["Agent Engineer §18–20", CC.ae]]]
      ],
      // Do the Udemy courses add anything? (optional top-ups) — gaps the 4 cohort
      // courses don't cover. [gap, why, [[source,url],...], priority]
      topups: [
        ["Anthropic API", "Python SDK, streaming, vision, structured outputs, prompt caching, batch, extended thinking — coding against the API, not the CLI.", [["Claude AI Masterclass §7", CC.mc]], "High"],
        ["Claude Agent SDK", "Production agents, multi-tool, orchestration — programmatic agent-building.", [["Claude AI Masterclass §3", CC.mc], ["AI Coder — Wk3", CC.aic]], "High"],
        ["Claude Code in CI/CD", "Wiring headless Claude Code into a pipeline (the 4 teach green-CI only as a concept).", [["Claude AI Masterclass §2", CC.mc]], "Medium"],
        ["Jira issue → PR", "The 4 cover GitHub, not Jira — just another MCP.", [["AI Coder — Wk2", CC.aic]], "Low"],
        ["Content & social-media automation", "AI-influencer/product images, YouTube Shorts auto-generate & post.", [["Fast-Track §3–4", CC.ft]], "Low"],
        ["Lead-gen, outreach & CRM", "Lead scraper, LinkedIn + email outreach, personal CRM.", [["Fast-Track §7–8", CC.ft]], "Low"],
        ["Google ADK + Claude", "Cross-framework (non-Anthropic) agent building.", [["Claude AI Masterclass §3", CC.mc]], "Low"],
        ["Disciplined debugging", "Error-analysis → fix pipelines as a method (partly covered by /debug + feedback loops).", [["Claude AI Masterclass §2", CC.mc], ["AI Coder — Wk2", CC.aic]], "Low (partial)"],
        ["Large team / enterprise-codebase practices", "Enterprise / large-team specifics (AI Hero covers the basics).", [["AI Coder — Wk3", CC.aic]], "Low (partial)"],
        ["Third-party cloud sandboxes", "Sprites.dev, \"5 ways to run remotely\" (Agent Engineer covers the rest).", [["AI Coder — Wk3", CC.aic]], "Low (partial)"]
      ],
      topupNote: "Verdict: the core stays the 4-course plan. The only top-up most people should plan for is the High-priority API + Agent SDK section of Claude AI Masterclass — pull it when you move from using Claude Code to building on Claude. The rest are niche; add only if that exact workflow is your goal. (Deliberately left out: Cowork/personal-agent automation, Excel/PowerPoint, prompt-engineering 101, OpenAI Agents SDK, Cursor/Copilot/Codex.)"
    },

    // Prompt & context engineering — two disciplines, each with its own phase-wise
    // study map rendered right after its topic list. Prompt-engineering phases are
    // driven by the two Udemy courses; context-engineering phases by the DailyDoseofDS
    // LLMOps crash-course reading (Parts 5–8).
    "prompt-context-engineering": {
      title: "Curated, phase-wise study plan",
      body: "Two disciplines kept separate: Prompt Engineering (how you write and manage prompts) and Context Engineering (how you assemble everything the model sees). Each topic list below is followed by its own phase-wise plan with the primary course / reading per phase.",
      sectionPlans: {
        "Prompt Engineering — Topics": {
          title: "🗺️ Prompt Engineering — phase-wise plan (primary course per phase)",
          lead: "Driven by the two Udemy courses; work top-to-bottom, watching each concept once.",
          phases: [
            ["1", "Foundations & the Five Principles", "How AI works (tokens, chat vs. reasoning, hallucinations); Give Direction / Specify Format / Provide Examples / Evaluate Quality / Divide Labor.", [["Prompt Engineering for AI Bootcamp", "https://www.udemy.com/course/prompt-engineering-for-ai/"]]],
            ["2", "Clear instructions & prompt templates", "Detailed/specific prompts, steps, delimiters, length control; reusable/parameterized templates & best practices.", [["Prompt Engineering for AI Bootcamp", "https://www.udemy.com/course/prompt-engineering-for-ai/"], ["Frameworks & Methodologies", "https://www.udemy.com/course/prompt-engineering-frameworks/"]]],
            ["3", "Core & reasoning techniques", "Role/persona, few-shot, least-to-most, ELI5, meta prompting; CoT, self-consistency, ReAct, step-back, emotion, personas of thought, chain-of-density.", [["Prompt Engineering for AI Bootcamp", "https://www.udemy.com/course/prompt-engineering-for-ai/"], ["Frameworks & Methodologies", "https://www.udemy.com/course/prompt-engineering-frameworks/"]]],
            ["4", "Thought structures & output shaping", "Tree-/Skeleton-/Program-of-Thought; structured/JSON outputs, format control, classification / tagging.", [["Frameworks & Methodologies", "https://www.udemy.com/course/prompt-engineering-frameworks/"]]],
            ["5", "Hyperparameters, optimization & evaluation", "Temperature, top-p, max tokens, stop sequence, penalties, soft prompts; evals, A/B testing, PromptFoo, DSPy, prompt caching.", [["Prompt Engineering for AI Bootcamp", "https://www.udemy.com/course/prompt-engineering-for-ai/"], ["Frameworks & Methodologies", "https://www.udemy.com/course/prompt-engineering-frameworks/"]]],
            ["6", "Prompt management & defense (reading)", "Treat prompts like code: versioning (immutable, semver, metadata, eval gate, rollback), templates in YAML/JSON, defensive prompting.", [["LLMOps Part 5 — Fundamentals", "https://www.dailydoseofds.com/llmops-crash-course-part-5/"], ["LLMOps Part 6 — Management & Defense", "https://www.dailydoseofds.com/llmops-crash-course-part-6/"]]],
            ["7", "Multimodal prompting", "Image prompting (Midjourney / Flux) and video prompting (Veo3): style modifiers, negative/weighted prompts, JSON/multi-shot/spatial prompting.", [["Prompt Engineering for AI Bootcamp", "https://www.udemy.com/course/prompt-engineering-for-ai/"]]]
          ]
        },
        "Context Engineering — Topics": {
          title: "🗺️ Context Engineering — phase-wise plan (primary reading per phase)",
          lead: "Driven by the DailyDoseofDS LLMOps crash-course reading (Parts 5, 7, 8).",
          phases: [
            ["1", "Prompt vs. context engineering", "Where prompting ends and context engineering begins; context engineering as the real discipline of managing information flow.", [["LLMOps Part 5 — Fundamentals", "https://www.dailydoseofds.com/llmops-crash-course-part-5/"]]],
            ["2", "Taxonomy of context types", "Instruction, query/user, knowledge (RAG), memory, tool, user-specific, environmental/temporal; modular, conditional construction within finite windows.", [["LLMOps Part 7 — Context Engineering & Taxonomy", "https://www.dailydoseofds.com/llmops-crash-course-part-7/"]]],
            ["3", "Window budgeting & compression", "Context-window budgeting, compression, and prompt caching to maximize signal in a finite window.", [["LLMOps Part 7 — Context Engineering & Taxonomy", "https://www.dailydoseofds.com/llmops-crash-course-part-7/"]]],
            ["4", "Memory context", "Short-term (session) vs. long-term (cross-session); loading persistent → working memory; long-term design (storage / retrieval / caching / maintenance).", [["LLMOps Part 8 — Memory & Temporal Context", "https://www.dailydoseofds.com/llmops-crash-course-part-8/"]]],
            ["5", "Dynamic & temporal context injection", "Real-time data, current date/time, tool outputs; temporal context, knowledge decay, progressive summarization; injection methods (event-driven, scheduled, user-specific).", [["LLMOps Part 8 — Memory & Temporal Context", "https://www.dailydoseofds.com/llmops-crash-course-part-8/"]]],
            ["6", "Knowledge & user-specific context", "Knowledge context & the RAG hand-off; user-specific context & personalization (profiles, preferences, privacy).", [["LLMOps Part 7 — Context Engineering & Taxonomy", "https://www.dailydoseofds.com/llmops-crash-course-part-7/"]]]
          ]
        }
      }
    },

    // Embeddings & vector databases — a single-discipline track, so ONE global phase
    // plan (enr.phases). Driven by the Udemy course "Vector Databases Fundamentals to
    // Production [2026]" (17 sections), reordered into a fundamentals → hands-on →
    // production arc that mirrors FDE m5.
    "embeddings-vector-databases": {
      title: "Curated, phase-wise study plan",
      body: "A build-oriented path through embeddings and the vector-DB layer, driven by the \"Vector Databases Fundamentals to Production [2026]\" course. Each phase links the course; the end goal (FDE m5) is to justify a retrieval stack and know the index tradeoffs cold.",
      phases: [
        ["1", "Fundamentals: what & why", "What a vector DB is, why nearest-neighbour works, benefits, use cases, traditional vs. vector DBs, how embeddings power retrieval.", [["Vector Databases 2026 — §3–5", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["2", "Embeddings & similarity metrics", "Embeddings as geometry; cosine similarity, Euclidean/L2, dot product; the math behind why similarity metrics work.", [["Vector Databases 2026 — §7, §9", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["3", "First store hands-on (Chroma) + LLM workflow", "Env setup, OpenAI embeddings, create/query/persist a Chroma store; the full embed → retrieve chunks → LLM answer flow.", [["Vector Databases 2026 — §6, §8", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["4", "Framework & managed store (LangChain + Pinecone)", "LangChain loaders/splitters/wrappers; Pinecone index create/upsert/query, retriever + chain; explore other stores.", [["Vector Databases 2026 — §10–11", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["5", "Chunking strategies", "Why chunking makes or breaks RAG; fixed / semantic / hierarchical strategies; hands-on semantic chunking.", [["Vector Databases 2026 — §12", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["6", "pgvector, indexes & metadata filtering", "pgvector on Postgres/Docker; similarity search; metadata filters; ANN indexes HNSW & IVFFLAT hands-on; RAG with LangChain; production hosting (Supabase / Neon / AWS RDS).", [["Vector Databases 2026 — §13", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["7", "Hybrid search", "Why pure vector search fails (BM25 + dense); building a production hybrid retrieval pipeline. For a second, LangChain-native take — dense+sparse retrievers, reranking, MMR — see the RAG Bootcamp §9.", [["Vector Databases 2026 — §14", "https://www.udemy.com/course/vector-databases-ai/"], ["RAG Bootcamp — §9 Hybrid Search", "https://www.udemy.com/course/ultimate-rag-bootcamp-using-langchainlanggraph-langsmith/"]]],
        ["8", "Production: scaling, freshness & cost", "Index tuning & scaling, the real cost of vector search — plus a 2026 comparison + decision framework for choosing the right store for your use case.", [["Vector Databases 2026 — §15–16", "https://www.udemy.com/course/vector-databases-ai/"]]],
        ["+", "More stores in a RAG context (optional)", "Embeddings (HuggingFace/OpenAI) and extra vector stores — Chroma, FAISS, InMemory, DataStax Astra, Pinecone — plus semantic chunking, all wired inside LangChain RAG pipelines.", [["RAG Bootcamp — §6–8 Embeddings, Stores & Chunking", "https://www.udemy.com/course/ultimate-rag-bootcamp-using-langchainlanggraph-langsmith/"]]]
      ]
    }
  };

    // === RAG tracks (24–26) ===
    // Phase plans below are driven by the coverage analysis in rag-coverage-findings.md.
    // Coverage rule used there: a topic is COVERED if it is in one of the 6 scraped Udemy
    // courses (rag.md / graph-rag.md) OR in a Notion roadmap page WITH a course link.
    // Per-phase course labels are prefixed ✅ (in a scraped course) or ➕ (Notion-linked
    // course, not scraped). Full per-topic status table: ../../rag-coverage-findings.html.
    var RU = {
      urb:   "https://www.udemy.com/course/ultimate-rag-bootcamp-using-langchainlanggraph-langsmith/", // scraped
      master:"https://www.udemy.com/course/retrieval-augmented-gen/",                                   // scraped
      advp:  "https://www.udemy.com/course/advanced-rag-build-deploy-production-genai-apps/",           // scraped
      ckag:  "https://www.udemy.com/course/generative-ai-with-context-rag-cag-kag-applications/",       // scraped
      neo4j: "https://www.udemy.com/course/knowledge-graph-with-neo4j-cypher-gds/",                     // scraped
      graphdb:"https://www.udemy.com/course/graph-databases-neo4j-rdf-knowledge-graphs-graphrag/",      // scraped
      // Notion-linked (not scraped) — every course URL referenced across the 3 Notion pages
      rse:   "https://courses.analyticsvidhya.com/courses/take/rag-systems-essentials/lessons/60149553-brief-on-agentic-rag-systems",
      genai: "https://www.udemy.com/course/generative-ai-rag/",
      fullstack:"https://www.udemy.com/course/full-stack-ai-with-python/",
      alt:   "https://www.udemy.com/course/advanced-langchain-techniques-mastering-rag-applications/",
      cgai:  "https://www.udemy.com/course/complete-generative-ai-course-with-langchain-and-huggingface/",
      lia:   "https://www.udemy.com/course/langchain-in-action-develop-llm-powered-applications/",
      ollama:"https://www.udemy.com/course/ollama-and-langchain/",
      lcpb:  "https://www.udemy.com/course/langchain-with-python-bootcamp/",
      pinecone:"https://www.udemy.com/course/master-langchain-pinecone-openai-build-llm-applications/",
      adv2:  "https://www.udemy.com/course/advanced-retrieval-augmented-generation/",
      kgrag: "https://www.udemy.com/course/knowledge-graphs-rag/",
      privrag:"https://www.udemy.com/course/agentic-ai-private-agentic-rag-with-langgraph-and-ollama/",
      // Notion page 3 (RAG with Graph) — other platforms
      dlaiKg:"https://www.deeplearning.ai/short-courses/knowledge-graphs-rag/",
      dlaiKgApi:"https://www.deeplearning.ai/short-courses/knowledge-graphs-for-ai-agent-api-discovery/",
      dlaiAkg:"https://www.deeplearning.ai/short-courses/agentic-knowledge-graph-construction/",
      courseraKg:"https://www.coursera.org/learn/packt-ai-enhancement-with-knowledge-graphs-mastering-rag-systems-lnmqm",
      courseraKg2:"https://www.coursera.org/projects/knowledge-graphs-rag",
      educativeGraphRag:"https://www.educative.io/courses/graph-rag",
      educativeKg:"https://www.educative.io/projects/create-a-knowledge-graph-from-text"
    };

    // Slug: "RAG: naive → production" → "rag-naive-production"
    ENRICH["rag-naive-production"] = {
      title: "Curated, phase-wise study plan",
      body: "The full RAG lifecycle from naive → production, ordered as a build path. Each phase names its primary course(s): ✅ = taught in a course you've scraped (rag.md); ➕ = Notion-linked course (not scraped, but on your roadmap). Every topic below is COVERED by the resources — see the coverage report for the per-topic status table.",
      docs: [
        ["📊 RAG coverage report (naive → production)", "../../rag-coverage-findings.html"],
        ["📘 Scraped curricula (rag.md)", "../../rag.md"]
      ],
      phases: [
        ["1", "Foundations: what & why", "What RAG is, the RAG triad, naive-RAG pitfalls & drawbacks, RAG vs fine-tuning vs prompt-engineering, RAG vs agents vs agentic RAG, long-context vs RAG.", [["✅ Master RAG §3", RU.master], ["✅ Ultimate RAG Bootcamp §2", RU.urb], ["➕ RAG Systems Essentials", RU.rse]]],
        ["2", "Ingestion & parsing", "Document loaders & parsing for text, PDF (incl. handling messy PDFs), Word, CSV/Excel, JSON, SQL; document structure in LangChain.", [["✅ Ultimate RAG Bootcamp §5", RU.urb], ["✅ Advanced RAG: Build & Deploy §3", RU.advp], ["➕ RAG Systems Essentials", RU.rse]]],
        ["3", "Chunking & splitting", "Recursive/character/HTML/JSON splitters, semantic chunking, late chunking, custom LLM-based splitters.", [["✅ Ultimate RAG Bootcamp §8", RU.urb], ["✅ Master RAG §8", RU.master], ["➕ Complete GenAI w/ LangChain & HuggingFace", RU.cgai]]],
        ["4", "Embeddings & vector stores", "Embedding models (HuggingFace/OpenAI/Ollama), cosine similarity, vector stores vs vector DBs — Chroma, FAISS, Pinecone, Astra, Qdrant, InMemory; semantic search. (Deep-dive lives in the Embeddings & Vector DBs track.)", [["✅ Ultimate RAG Bootcamp §6–7", RU.urb], ["✅ Gen AI with Context §4", RU.ckag], ["➕ Master LangChain + Pinecone", RU.pinecone], ["➕ Embeddings & stores — Complete GenAI w/ LangChain & HuggingFace", RU.cgai], ["➕ Ollama & LangChain", RU.ollama]]],
        ["5", "Basic RAG pipeline", "Retrievers, LCEL / RetrievalQA, prompt augmentation & answer synthesis, RAG Document Q&A (GROQ + Llama3).", [["✅ Ultimate RAG Bootcamp §7", RU.urb], ["✅ Gen AI with Context §4", RU.ckag], ["➕ RAG Systems Essentials", RU.rse], ["➕ RAG Service w/ FastAPI — LangChain in Action", RU.lia], ["➕ VectorStore & Retriever — LangChain with Python Bootcamp", RU.lcpb]]],
        ["6", "Retrieval quality", "Hybrid search (dense+sparse/BM25 + RRF), reranking (cross-encoder + MMR), query enhancement (expansion / decomposition / HyDE / multi-query), contextual retrieval, DPR.", [["✅ Ultimate RAG Bootcamp §9–10", RU.urb], ["✅ Master RAG §4–7", RU.master], ["✅ Advanced RAG: Build & Deploy §2–4", RU.advp]]],
        ["7", "Conversational & memory RAG", "Chat-with-PDF + chat history, multi-user conversational RAG, persistent memory.", [["✅ Ultimate RAG Bootcamp §21", RU.urb], ["➕ RAG Systems Essentials", RU.rse], ["➕ Complete GenAI w/ LangChain & HuggingFace", RU.cgai]]],
        ["8", "Agentic & advanced-pattern RAG", "Agentic RAG (ReAct, tools), corrective / adaptive / autonomous / self-reflective RAG, multi-agent RAG, CAG, KAG/GraphRAG entry point (→ Advanced RAG & GraphRAG track).", [["✅ Ultimate RAG Bootcamp §16–22", RU.urb], ["✅ Advanced RAG: Build & Deploy §9", RU.advp], ["✅ Gen AI with Context §5–8", RU.ckag], ["➕ Private Agentic RAG (LangGraph + Ollama)", RU.privrag]]],
        ["9", "Tools, function calling & agents", "Intro to tool calling; pre-built tools (Tavily, DuckDuckGo, Wikipedia, PubMed); custom tools & binding, function calling; agent basics & agents with a custom RAG-tool.", [["✅ Ultimate RAG Bootcamp §13", RU.urb], ["➕ Tools & agents — Ollama & LangChain", RU.ollama], ["➕ Custom tools — Advanced LangChain Techniques", RU.alt], ["➕ Agents — LangChain with Python Bootcamp", RU.lcpb], ["➕ Agents — LangChain in Action", RU.lia]]],
        ["9b", "RAG evaluation", "RAG evaluation (LLM-as-judge, metrics, test datasets), source-aware & citation-aware RAG.", [["✅ Ultimate RAG Bootcamp §26", RU.urb], ["➕ Source/citation-aware — RAG Systems Essentials", RU.rse]]],
        ["10", "Serving & UI", "LLM gateways / multi-provider serving (OpenAI/Groq/Gemini/Ollama), FastAPI OpenAI-compatible endpoints + SSE streaming, production chat UI (Chainlit / Streamlit).", [["✅ Advanced RAG: Build & Deploy §5, §7–8", RU.advp], ["✅ Ultimate RAG Bootcamp §25", RU.urb]]],
        ["11", "Production hardening", "Docker & cloud deployment (Render/Railway/AWS ECS/GCP/Azure), API-key security, indexing/sync (Indexing API, PgVector, RecordManager), async queues & distributed workers (Redis/RQ), routing/fallback, robustness (retry/backoff, rate limits), observability (LangSmith/LangFuse).", [["✅ Advanced RAG: Build & Deploy §10–11", RU.advp], ["➕ Indexing/sync + routing — Advanced LangChain Techniques", RU.alt], ["➕ Async scaling — Full-stack GenAI w/ Python", RU.fullstack]]]
      ]
    };

    // Slug: "Advanced RAG & GraphRAG" → "advanced-rag-graphrag"
    ENRICH["advanced-rag-graphrag"] = {
      title: "Curated, phase-wise study plan",
      body: "Two arcs kept in one track: advanced retrieval/RAG techniques, then the graph stack (Neo4j → GraphRAG). ✅ = scraped course (rag.md / graph-rag.md); ➕ = Notion-linked course. Everything here is COVERED by your resources; see the coverage report for the full status table and the one flagged gap.",
      docs: [
        ["📊 RAG coverage report (Advanced RAG & GraphRAG)", "../../rag-coverage-findings.html"],
        ["📘 Scraped graph curricula (graph-rag.md)", "../../graph-rag.md"]
      ],
      phases: [
        ["1", "Advanced retrieval", "Hybrid search (dense+sparse/BM25), Reciprocal Rank Fusion, reranking (cross-encoder), MMR — and when to use each.", [["✅ Ultimate RAG Bootcamp §9", RU.urb], ["✅ Advanced RAG: Build & Deploy §2", RU.advp], ["➕ Complete GenAI w/ LangChain & HuggingFace", RU.cgai]]],
        ["2", "Query enhancement & multi-stage retrieval", "Query expansion, decomposition, HyDE, multi-query retrieval; parent-document / two-stage retrieval (InMemory + custom Postgres DocStore).", [["✅ Ultimate RAG Bootcamp §10", RU.urb], ["➕ Parent-doc & multi-query — Advanced LangChain Techniques", RU.alt]]],
        ["3", "Postprocessing & routing", "Reranking with a cross-encoder, LLM-based document compression/filtering; routing (embeddings vs LLM), SQL chain + injection prevention, table vs vectorstore routing.", [["➕ Advanced LangChain Techniques", RU.alt]]],
        ["4", "Corrective / adaptive / self RAG", "Corrective RAG (CRAG), adaptive RAG, self-reflection / iterative retrieval, LangGraph self-correcting RAG. (Named 'Self-RAG' framework is the one thin spot — see report.)", [["✅ Ultimate RAG Bootcamp §17, §19–20", RU.urb], ["✅ Advanced RAG: Build & Deploy §9", RU.advp]]],
        ["5", "Agentic & multi-agent RAG", "Agentic RAG (retrieval as a tool), supervisor / hierarchical multi-agent RAG, CrewAI / AutoGen / MS Agent Framework; persistent-memory RAG.", [["✅ Ultimate RAG Bootcamp §16, §18", RU.urb], ["✅ Advanced RAG: Build & Deploy §9", RU.advp], ["➕ Agentic RAG — RAG Systems Essentials", RU.rse], ["➕ Private Agentic RAG (LangGraph + Ollama)", RU.privrag]]],
        ["6", "CAG & KAG", "Cache-Augmented Generation (KV-cache) and Knowledge-Augmented Generation (entity/fact fusion over a knowledge graph).", [["✅ Ultimate RAG Bootcamp §22 (Cache RAG)", RU.urb], ["✅ Gen AI with Context §5–8", RU.ckag]]],
        ["6b", "Guardrails, tracing & robustness", "NeMo Guardrails (Colang, RunnableRails); LangFuse tracing; robust LLM impl (structured outputs, caching, retry/backoff, rate limits); Streamlit app front-end.", [["➕ NeMo Guardrails / LangFuse — Advanced LangChain Techniques", RU.alt], ["➕ Robust LLM — Advanced Retrieval Augmented Generation", RU.adv2], ["➕ Streamlit — Master LangChain + Pinecone", RU.pinecone]]],
        ["7", "Graph foundations: Neo4j & Cypher", "Property graph model, Neo4j setup/CRUD/indexing, Cypher basics → advanced (UNWIND/COLLECT, shortest path), GraphQL.", [["✅ Neo4j: Cypher/GDS §1–2, §5", RU.neo4j], ["✅ Graph Databases: Neo4j/RDF §5, §10", RU.graphdb], ["✅ Ultimate RAG Bootcamp §27", RU.urb]]],
        ["8", "Graph data science & RDF", "Graph Data Science library (centrality, community detection, node similarity, pathfinding, DFS/BFS/Dijkstra/APOC); RDF & SPARQL.", [["✅ Neo4j: Cypher/GDS §3", RU.neo4j], ["✅ Graph Databases: Neo4j/RDF §8–9", RU.graphdb]]],
        ["9", "Knowledge graphs & GraphRAG", "Build KGs from unstructured data with LLMs, knowledge-graph RAG (GraphQuery chains), GraphRAG concept + production architecture, LightRAG, fraud-detection KG use case.", [["✅ Neo4j: Cypher/GDS §9", RU.neo4j], ["✅ Graph Databases: Neo4j/RDF §11–13", RU.graphdb], ["✅ Ultimate RAG Bootcamp §28", RU.urb], ["➕ LightRAG — RAG, AI Agents & GenAI w/ Python", RU.genai], ["➕ Supercharge AI with Knowledge Graphs", RU.kgrag]]],
        ["+", "More GraphRAG courses (Notion 'RAG with Graph')", "Additional knowledge-graph / GraphRAG courses your Notion page links across other platforms — use as depth/alternates.", [["➕ DeepLearning.AI — Knowledge Graphs for RAG", RU.dlaiKg], ["➕ DeepLearning.AI — KG for AI Agent API Discovery", RU.dlaiKgApi], ["➕ DeepLearning.AI — Agentic KG Construction", RU.dlaiAkg], ["➕ Coursera — AI Enhancement with KGs (Packt)", RU.courseraKg], ["➕ Coursera — Knowledge Graphs for RAG", RU.courseraKg2], ["➕ Educative — Graph RAG with Neo4j (CURRENT)", RU.educativeGraphRag], ["➕ Educative — Create a KG from Text", RU.educativeKg]]]
      ]
    };

    // Slug: "Multimodal & document intelligence" → "multimodal-document-intelligence"
    ENRICH["multimodal-document-intelligence"] = {
      title: "Curated, phase-wise study plan",
      body: "Multimodal RAG plus document-intelligence parsing. ✅ = scraped course; ➕ = Notion-linked course. Note the one genuine GAP flagged in the report: dedicated layout/table/OCR extraction tooling (Unstructured.io / LlamaParse / Azure Document Intelligence) is not in any provided resource — treat Phase 4 as a recommended external add-on.",
      docs: [
        ["📊 RAG coverage report (Multimodal & doc intelligence)", "../../rag-coverage-findings.html"],
        ["📘 Scraped curricula (rag.md)", "../../rag.md"]
      ],
      phases: [
        ["1", "Multimodal RAG concept", "What multimodal RAG is (text + image), multimodal RAG over PDFs with text + images, project builds.", [["✅ Ultimate RAG Bootcamp §11", RU.urb], ["➕ Multimodal RAG concepts — RAG Systems Essentials", RU.rse]]],
        ["2", "Vision retrieval techniques", "ColPali (page-image / vision retrieval), RAG with OpenAI File Search.", [["✅ ColPali — Master RAG §8", RU.master], ["➕ OpenAI File Search — RAG, AI Agents & GenAI w/ Python", RU.genai]]],
        ["3", "Document parsing per format", "Document loaders; parsing PDF (incl. common-issue handling), Word, CSV/Excel, JSON, SQL, HTML; PPT/EPUB via unstructured-data handling; format-specific splitters.", [["✅ Ultimate RAG Bootcamp §5", RU.urb], ["➕ Unstructured formats (Excel/Word/PPT/EPUB/PDF) — RAG, AI Agents & GenAI w/ Python", RU.genai], ["➕ Loaders — RAG Systems Essentials", RU.rse]]],
        ["4", "Layout / table / OCR extraction (GAP — external add-on)", "NOT covered by any provided resource: layout-aware parsing, table extraction from PDFs, OCR pipelines. Recommended external sources: Unstructured.io `partition`, LlamaParse, Azure Document Intelligence, Docling.", [["🔎 Unstructured.io (recommended)", "https://docs.unstructured.io/"], ["🔎 LlamaParse", "https://docs.llamaindex.ai/en/stable/llama_cloud/llama_parse/"]]],
        ["5", "Unified pipelines over documents", "Build robust retrieval/generation pipelines that work across multiple document formats end-to-end.", [["✅ Ultimate RAG Bootcamp §29 (E2E doc processing)", RU.urb], ["➕ Unified multi-format pipelines — RAG, AI Agents & GenAI w/ Python", RU.genai]]]
      ]
    };

    // === Guided Learning Path + framework tracks ===
    // Course-link map. ✅ = scraped course (rag.md/graph-rag.md); ➕ = course link already
    // in data.js (LangChain/LangGraph Udemy + LangChain Academy); 🔎 = external reference.
    var LU = {
      urb:    "https://www.udemy.com/course/ultimate-rag-bootcamp-using-langchainlanggraph-langsmith/", // scraped
      advp:   "https://www.udemy.com/course/advanced-rag-build-deploy-production-genai-apps/",          // scraped
      lc:     "https://www.udemy.com/course/langchain/",                                                 // LangChain- Agentic AI Engineering
      advlg:  "https://www.udemy.com/course/advanced-langgraph-workflows-multi-agents-deep-agents/",
      bootcamp:"https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/",
      lcv1prod:"https://www.udemy.com/course/langchain-ai-agent-projects/",
      internals:"https://www.udemy.com/course/agentic-ai-internals/",
      // LangChain Academy
      acLc:   "https://academy.langchain.com/courses/langchain-essentials-python",
      acLg:   "https://academy.langchain.com/courses/langgraph-essentials-python",
      acIntro:"https://academy.langchain.com/courses/intro-to-langgraph",
      acReliable:"https://academy.langchain.com/courses/building-reliable-agents",
      acObs:  "https://academy.langchain.com/courses/intro-to-langsmith",
      // Framework docs (reference)
      dspy:   "https://dspy.ai/",
      crewaiDocs:"https://docs.crewai.com/",
      pydDocs:"https://ai.pydantic.dev/",
      autogenDocs:"https://microsoft.github.io/autogen/"
    };

    ENRICH["langchain-fundamentals"] = {
      title: "Curated, phase-wise study plan",
      body: "Step 1 of the guided path — the LangChain building blocks everything else sits on. ✅ = scraped course (rag.md); ➕ = course already linked in your tracker (LangChain Udemy / LangChain Academy).",
      phases: [
        ["1", "Ecosystem & setup", "What LangChain / LangGraph / LangSmith are and when to use each; environment & project setup.", [["➕ LangChain Essentials — LangChain Academy", LU.acLc], ["➕ LangChain — Agentic AI Engineering", LU.lc]]],
        ["2", "Models, prompts & LCEL", "Chat models, prompt templates, and LCEL — piping runnables with invoke / stream / batch.", [["✅ Ultimate RAG Bootcamp §13 (LangChain v1 hands-on)", LU.urb], ["➕ LangChain Essentials — LangChain Academy", LU.acLc]]],
        ["3", "Output parsers & structured output", "Output parsers; structured output with Pydantic, TypedDict and dataclasses.", [["✅ Ultimate RAG Bootcamp §13", LU.urb], ["➕ LangChain — Agentic AI Engineering", LU.lc]]],
        ["4", "Chains & messages", "Sequential & parallel chains; message types; basic conversation state.", [["➕ LangChain — Agentic AI Engineering", LU.lc], ["➕ LangChain Essentials — LangChain Academy", LU.acLc]]],
        ["5", "Tools, retrievers & memory (intro)", "Defining tools, retriever basics (deep-dive in the RAG track), chat-history memory, streaming, and a first look at middleware.", [["✅ Ultimate RAG Bootcamp §13 (tools, middleware)", LU.urb], ["➕ LangChain — Agentic AI Engineering", LU.lc]]]
      ]
    };

    ENRICH["tool-calling-ai-agent-with-langchain"] = {
      title: "Curated, phase-wise study plan",
      body: "Build a real tool-calling agent in LangChain — the bridge from chains to agents. Do this after Agent Fundamentals (concepts) so the loop makes sense. ✅ = scraped course; ➕ = course linked in your tracker.",
      phases: [
        ["1", "Tool calling foundations", "Function/tool calling — single, parallel, forced; structured tool schemas & argument validation.", [["✅ Ultimate RAG Bootcamp §13 (tools in LangChain)", LU.urb], ["➕ LangChain — Agentic AI Engineering", LU.lc]]],
        ["2", "Custom & pre-built tools", "Create custom tools & bind to an LLM; pre-built tools (Tavily, DuckDuckGo, Wikipedia, PubMed); pass tool results back to the LLM.", [["➕ LangChain — Agentic AI Engineering", LU.lc], ["✅ Ultimate RAG Bootcamp §13", LU.urb]]],
        ["3", "ReAct agent in LangChain", "The reason→act→observe loop; building a ReAct agent; an agent with a custom RAG-tool.", [["✅ Ultimate RAG Bootcamp §15–16 (ReAct, RAG tools)", LU.urb], ["➕ LangChain — Agentic AI Engineering", LU.lc]]],
        ["4", "Middleware & conversational agents", "Agent middleware (before_model / after_model), human-in-the-loop, summarization; conversational & custom agents.", [["✅ Ultimate RAG Bootcamp §13 (middleware)", LU.urb], ["➕ Deploy LangChain v1 Agent Projects to Production", LU.lcv1prod]]]
      ]
    };

    ENRICH["langgraph-fundamentals"] = {
      title: "Curated, phase-wise study plan",
      body: "The graph model behind durable, stateful agents. ✅ = scraped course; ➕ = course linked in your tracker (LangChain Academy / Udemy).",
      phases: [
        ["1", "Why graphs; first graph", "Graphs vs chains; state, nodes & edges; build & run a simple graph.", [["➕ Introduction to LangGraph — LangChain Academy", LU.acIntro], ["✅ Ultimate RAG Bootcamp §14 (LangGraph basics)", LU.urb]]],
        ["2", "State schema & validation", "State schema with dataclasses & Pydantic; data validation across nodes.", [["✅ Ultimate RAG Bootcamp §14", LU.urb], ["➕ LangGraph Essentials — LangChain Academy", LU.acLg]]],
        ["3", "Routing, tools & control flow", "Conditional edges & routers; chains inside a graph; tool-node integration.", [["✅ Ultimate RAG Bootcamp §14", LU.urb], ["➕ LangGraph Essentials — LangChain Academy", LU.acLg]]],
        ["4", "Checkpointing & streaming", "Checkpointing, durable execution & persistent state; streaming (astream / stream events); debugging with LangGraph Studio & LangSmith.", [["➕ Advanced LangGraph: Workflows, Multi-Agents, Deep Agents", LU.advlg], ["➕ Intro to Agent Observability — LangChain Academy", LU.acObs]]]
      ]
    };

    ENRICH["ai-agents-with-langgraph"] = {
      title: "Curated, phase-wise study plan",
      body: "Assemble production-grade agents on LangGraph. Leads into Agentic RAG (Advanced RAG & GraphRAG track) and the Deep Agents track. ✅ = scraped course; ➕ = course linked in your tracker.",
      phases: [
        ["1", "ReAct agent architecture", "Build the ReAct agent in LangGraph; tools & tool-node integration.", [["✅ Ultimate RAG Bootcamp §15 (Agents architecture)", LU.urb], ["➕ Advanced LangGraph…", LU.advlg]]],
        ["2", "Memory & multi-tool agents", "Agent with memory; multi-tool chatbot; streaming techniques.", [["✅ Ultimate RAG Bootcamp §15", LU.urb], ["➕ Complete Agentic AI Bootcamp with LangGraph & LangChain", LU.bootcamp]]],
        ["3", "Multi-agent workflows", "Supervisor & hierarchical multi-agent workflows; agent handoff.", [["✅ Ultimate RAG Bootcamp §18 (Multi-Agents)", LU.urb], ["➕ Advanced LangGraph…", LU.advlg]]],
        ["4", "Reliable & observable agents", "Retries, error handling, durable execution; observability & debugging (LangSmith, Studio).", [["➕ Building Reliable Agents — LangChain Academy", LU.acReliable], ["✅ Ultimate RAG Bootcamp §15 (debugging)", LU.urb]]],
        ["5", "Toward deep agents", "Planning, sub-agent delegation, skills & harness — bridge to the Deep Agents & Harness Engineering track.", [["➕ Advanced LangGraph: … Deep Agents", LU.advlg], ["➕ Deploy LangChain v1 Agent Projects to Production", LU.lcv1prod]]]
      ]
    };

    ENRICH["dspy"] = {
      title: "Curated, phase-wise study plan",
      body: "Alternative framework — programmatic prompting & optimization. 🔎 Reference-only: no owned/scraped course yet; driven by the official DSPy docs. Flagged as a coverage gap if you want a course later.",
      phases: [
        ["1", "Concept & signatures", "Why programmatic prompting; declaring behavior with typed signatures instead of hand-written prompts.", [["🔎 DSPy docs — Signatures", LU.dspy]]],
        ["2", "Modules & composition", "Predict, ChainOfThought, ReAct modules and composing them into programs.", [["🔎 DSPy docs — Modules", LU.dspy]]],
        ["3", "Optimizers & metrics", "Teleprompters/compilers (bootstrap few-shot, MIPRO); metric-driven optimization; when DSPy beats hand-prompting.", [["🔎 DSPy docs — Optimizers", LU.dspy]]]
      ]
    };

    ENRICH["crewai"] = {
      title: "Curated, phase-wise study plan",
      body: "Alternative framework — role-based multi-agent crews. ✅ = scraped course (Advanced RAG: Build & Deploy §9 has a CrewAI section); 🔎 = official docs.",
      phases: [
        ["1", "Crews, agents & tasks", "Role-based crews; defining agents, tasks and tools.", [["✅ CrewAI Document Assistant — Advanced RAG: Build & Deploy §9", LU.advp], ["🔎 CrewAI docs", LU.crewaiDocs]]],
        ["2", "Process & delegation", "Sequential vs hierarchical process; delegation & collaboration between agents; memory.", [["✅ CrewAI multi-agent analyst — Advanced RAG: Build & Deploy §9", LU.advp], ["🔎 CrewAI docs", LU.crewaiDocs]]],
        ["3", "When to choose CrewAI", "CrewAI vs LangGraph vs raw loops — pick the right tier.", [["🔎 CrewAI docs", LU.crewaiDocs]]]
      ]
    };

    ENRICH["pydanticai"] = {
      title: "Curated, phase-wise study plan",
      body: "Alternative framework — type-safe, validation-first agents. Project-backed (krishnaik build); 🔎 = official docs.",
      phases: [
        ["1", "Type-safe agents", "Validation-first agents; structured & validated outputs with Pydantic models as the contract.", [["🔎 PydanticAI docs", LU.pydDocs]]],
        ["2", "Tools & dependencies", "Dependency injection & typed context; tools & function calling; model-agnostic design.", [["🔎 PydanticAI docs", LU.pydDocs]]],
        ["3", "Build", "Ship a typed agent end-to-end.", [["🛠️ Gen AI Clothing Store (Pydantic AI)", "https://www.krishnaik.in/project/gen-ai-powered-clothing-store-with-pydantic-ai"]]]
      ]
    };

    ENRICH["autogen"] = {
      title: "Curated, phase-wise study plan",
      body: "Alternative framework — conversable agents & group chat (incl. Microsoft Agent Framework). ✅ = scraped course (Advanced RAG: Build & Deploy §9); 🔎 = official docs.",
      phases: [
        ["1", "Conversable agents", "The AutoGen model; conversable agents; model client setup (OpenAI / Gemini).", [["✅ Microsoft AutoGen — Advanced RAG: Build & Deploy §9", LU.advp], ["🔎 AutoGen docs", LU.autogenDocs]]],
        ["2", "Group chat & multi-agent", "Group chat, multi-agent collaboration, research-team patterns.", [["✅ AutoGen research team — Advanced RAG: Build & Deploy §9", LU.advp], ["🔎 AutoGen docs", LU.autogenDocs]]],
        ["3", "Microsoft Agent Framework", "Task-specialist agents & aggregating specialist responses; when AutoGen fits vs CrewAI / LangGraph.", [["✅ MS Agent Framework — Advanced RAG: Build & Deploy §9", LU.advp]]]
      ]
    };

    // Memory & state — a systems-design track, not a single-course one. Phases are
    // built from the curated agent-memory reading in this track (scraped Nov 2026):
    // the DailyDoseofDS AI-Agents crash-course memory parts, MLMastery's 7-steps,
    // NirDiamant's runnable notebooks, the LangMem series, and the Awesome-Memory
    // reference — reordered into a taxonomy → short-term → long-term → optimization
    // → LangGraph/LangMem → frameworks → eval arc that covers the topic checklist.
    // 📘 = DailyDoseofDS reading · 💻 = runnable notebooks · 📝 = LangMem series ·
    // 📄 = article · 🎓 = Udemy course · 📚 = reference list.
    var MEM = {
      dd8:   "https://www.dailydoseofds.com/ai-agents-crash-course-part-8-with-implementation/#in-part-9",
      dd9:   "https://www.dailydoseofds.com/ai-agents-crash-course-part-9-with-implementation/",
      dd15:  "https://www.dailydoseofds.com/ai-agents-crash-course-part-15-with-implementation/#long-term-memory",
      dd16:  "https://www.dailydoseofds.com/ai-agents-crash-course-part-16-with-implementation/",
      dd17:  "https://www.dailydoseofds.com/ai-agents-crash-course-part-17-with-implementation/",
      mlm7:  "https://machinelearningmastery.com/7-steps-to-mastering-memory-in-agentic-ai-systems/",
      awesome:"https://github.com/TsinghuaC3I/Awesome-Memory-for-Agents",
      amt:   "https://github.com/NirDiamant/Agent_Memory_Techniques",
      lm1:   "https://levelup.gitconnected.com/managing-agentic-meomery-with-langmem-1-5-introduction-to-agentic-meomery-0f6f48633e73",
      lm2:   "https://levelup.gitconnected.com/managing-agentic-memory-with-langmem-2-5-building-baseline-agent-4598bbd33236",
      lm3:   "https://levelup.gitconnected.com/managing-agentic-meomery-with-langmem-3-5-assistant-agent-with-semantic-memory-c3c76ddc7d98",
      lm4:   "https://levelup.gitconnected.com/managing-agentic-meomery-with-langmem-4-5-building-agent-with-semantic-episodic-memory-f1c892df97b1",
      lm5:   "https://levelup.gitconnected.com/building-agent-with-semantic-episodic-procedural-memory-8f481aee9614",
      humanlike:"https://rajuhemanth456.medium.com/how-to-build-memory-driven-ai-agents-with-short-term-long-term-and-episodic-memory-98d5257f315d",
      udemy: "https://www.udemy.com/course/full-stack-ai-with-python/?couponCode=PMNVD2025"
    };

    ENRICH["memory-state"] = {
      title: "Curated, phase-wise study plan",
      body: "Memory is a systems-design problem, not a bigger context window. This plan sequences the curated agent-memory reading already in this track into a build arc: taxonomy → short-term → long-term → optimization → LangGraph state & LangMem → frameworks → evaluation. Work top-to-bottom; each phase names its primary source. 📘 DailyDoseofDS reading · 💻 runnable notebooks · 📝 LangMem series · 📄 article · 🎓 Udemy · 📚 reference.",
      phases: [
        ["1", "Why memory & the memory taxonomy", "Memory as architecture (not a property of the model); memory vs. knowledge vs. tools; short-term vs. long-term; the four types — working, episodic, semantic, procedural. When memory beats RAG.", [["📄 7 Steps to Mastering Memory — steps 1–3", MEM.mlm7], ["📘 Memory for Agentic Systems (Part A)", MEM.dd8], ["💻 Agent Memory Techniques — overview", MEM.amt]]],
        ["2", "Short-term & conversation memory", "Scratchpad/context vs. persistence; session vs. persistent knowledge; LangChain memory classes (Buffer, Window, Summary, Summary-Buffer, Token-Buffer); message history with RunnableWithMessageHistory & MessagesPlaceholder; save/load chat history.", [["💻 Agent Memory Techniques §1–5 (short-term)", MEM.amt], ["🎓 Full-Stack GenAI — The Memory Layer", MEM.udemy]]],
        ["3", "Long-term & vector-backed memory", "Vector-store, entity, episodic & semantic memory; retrieval by relevance + recency; consolidation; writing, updating, summarizing & forgetting memory across sessions.", [["💻 Agent Memory Techniques §6–11 + §20–22 (long-term, retrieval, cross-session)", MEM.amt], ["📘 Memory for Agentic Systems (Part B)", MEM.dd9], ["📄 Memory-Driven AI Agents (short/long/episodic)", MEM.humanlike]]],
        ["4", "Memory optimization & the context budget", "The context window as a constrained resource: cost, latency, attention degradation; compaction, hierarchical layers, temporal memory, forgetting & decay; memory-aware retrieval as an explicit tool inside the agent loop.", [["📘 Memory Optimization (Parts A–C)", MEM.dd15], ["📘 Memory Optimization (Part B)", MEM.dd16], ["💻 Agent Memory Techniques §12–19 (cognitive architectures)", MEM.amt]]],
        ["5", "State, checkpointing & LangMem", "LangGraph checkpointers & the store; durable/persistent state across runs; hot-path vs. background memory formation; building agents with semantic → episodic → procedural memory using LangMem.", [["📝 LangMem 1–2 (intro + baseline agent)", MEM.lm1], ["📝 LangMem 3 (semantic memory)", MEM.lm3], ["📝 LangMem 4–5 (episodic + procedural)", MEM.lm4], ["📘 Memory Optimization (Part C — LangGraph)", MEM.dd17]]],
        ["6", "Memory frameworks & graph memory", "Production memory systems and their tradeoffs — mem0, Letta / MemGPT, Zep, Graphiti; graph memory & knowledge graphs as a memory substrate; file-based memory (AGENTS.md / CLAUDE.md).", [["💻 Agent Memory Techniques §24–27 (Graphiti, mem0, Letta, Zep)", MEM.amt], ["🎓 Full-Stack GenAI — Graph Memory & Knowledge Graph", MEM.udemy]]],
        ["7", "Evaluation & production", "Does recall actually raise task success? Retrieval-specific metrics; benchmarks (LoCoMo, LongMemEval, MemoryAgentBench); production patterns; case study — how the Hermes Agent (Nous) does persistent memory + autonomously-generated skills.", [["💻 Agent Memory Techniques §28–30 (eval, benchmarks, production)", MEM.amt], ["📄 7 Steps to Mastering Memory — step 7", MEM.mlm7], ["📚 Awesome-Memory-for-Agents (benchmarks & surveys)", MEM.awesome]]]
      ]
    };

    // Agentic patterns tracks (Phase 04 & 05). Phases are built from the coverage
    // analysis in agentic-patterns-coverage-findings.md across four sources (scraped
    // Nov 2026): the Complete Agentic AI Bootcamp (LangGraph+LangChain, full 27-section
    // scrape in agentic-ai.md), AI Agents & Workflows: The Practical Guide, the
    // FareedKhan all-agentic-architectures repo (35 patterns), and the Analytics-Vidhya
    // Agentic Design Patterns course. 🎓 = Udemy · 💻 = runnable repo · 📘 = AV course.
    var AP = {
      bootcamp: "https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/?couponCode=PMNVD2025",
      practical:"https://www.udemy.com/course/ai-agents-workflows-the-practical-guide/?couponCode=PMNVD2025",
      repo:     "https://github.com/FareedKhan-dev/all-agentic-architectures",
      av1:      "https://courses.analyticsvidhya.com/courses/take/agentic-ai-system-architectures-and-design-patterns/lessons/62114823-agentic-ai-unleashing-the-future-of-autonomy",
      av2:      "https://courses.analyticsvidhya.com/courses/take/copy-of-agentic-ai-system-architectures-and-design-patterns/lessons/65704730-course-introduction",
      educative:"https://www.educative.io/module/P1vxGOtNzNBPX5PJY/10370001/4640179653312512"
    };

    ENRICH["workflow-agent-patterns"] = {
      title: "Curated, phase-wise study plan",
      body: "Build one capable agent from first principles, then learn each workflow/agent pattern once. Sequenced foundation → deterministic workflows → autonomous-agent loops → advanced/self-improving → judgment. The Bootcamp's §14 \"Different Workflows In LangGraph\" covers almost the whole pattern list in one place; the 35-pattern repo is the deep catalog. 🎓 = Udemy course · 💻 = runnable repo · 📘 = Analytics Vidhya course. Full coverage table: ../../agentic-patterns-coverage-findings.html.",
      phases: [
        ["1", "Foundations: workflows vs agents & the augmented LLM", "When autonomy is worth the unpredictability; the augmented LLM (tool use + retrieval + memory) as the base building block; tool calling from scratch (single / parallel / forced) and structured outputs.", [["🎓 Practical Guide — augmented LLM & tool use from scratch", AP.practical], ["🎓 Bootcamp §9 (AI Agents vs Agentic AI), §10 & §12 (tools, ToolNode)", AP.bootcamp], ["📘 Agentic Design Patterns — Tool-Use Pattern", AP.av1]]],
        ["2", "Deterministic workflows: chaining, routing, parallelization", "Prompt chaining (decompose into fixed steps); routing / classification (send input down the right path); parallelization by sectioning & voting.", [["🎓 Bootcamp §14 — Prompt Chaining, Routing, Parallelization", AP.bootcamp], ["💻 all-agentic-architectures — Self-Consistency #6, Ensemble #10, Adaptive routing #14", AP.repo], ["🎓 Practical Guide — multi-step & multi-model workflows", AP.practical]]],
        ["3", "Orchestration workflows: orchestrator–workers & evaluator–optimizer", "Dynamic subtask delegation (orchestrator–workers); the evaluator–optimizer loop (generate → critique → refine).", [["🎓 Bootcamp §14 — Orchestrator-Worker (+impl) & Evaluator-optimizer", AP.bootcamp], ["💻 all-agentic-architectures — Multi-Agent #27, Meta-Controller #31, Reflection #1, RLHF #34", AP.repo]]],
        ["4", "Autonomous-agent loops: Reflection, ReAct & Plan-and-Execute", "Reflection & self-critique; the ReAct reason→act→observe loop; Plan-and-Execute (decompose → execute → replan).", [["🎓 Bootcamp §12 — ReAct Agent Architecture (+impl)", AP.bootcamp], ["📘 Agentic Design Patterns — Reflection & Planning/ReAct", AP.av2], ["💻 all-agentic-architectures — Reflection #1–3, ReAct #22, Planning #23, PEV #24", AP.repo]]],
        ["5", "Agentic RAG", "Retrieval becomes a tool the agent invokes, reformulates & iterates on — not a fixed step; Agentic, Corrective (CRAG) & Adaptive RAG variants.", [["🎓 Bootcamp §16 — Agentic / Corrective / Adaptive RAG", AP.bootcamp], ["💻 all-agentic-architectures — Agentic RAG #11, CRAG #12, Self-RAG #13, Adaptive #14, GraphRAG #15", AP.repo]]],
        ["6", "Advanced & self-improving patterns (reference)", "Beyond the core list — tree/graph search & self-improvement: Tree-of-Thoughts, LATS, Self-Discover, Chain-of-Verification, Constitutional AI. A look-up catalog, not a linear watch.", [["💻 all-agentic-architectures — Tree-of-Thoughts #7, LATS #8, Self-Discover #4, CoVe #3, Constitutional AI #5", AP.repo], ["📘 Master Agentic Design Patterns — Educative", AP.educative]]],
        ["7", "Judgment: pick the simplest pattern", "Resist over-agenting (the FDE anti-pattern) — choose the least-autonomous pattern that works; best practices for effective agentic systems.", [["📘 Agentic Design Patterns — Best Practices & Key Takeaways", AP.av2], ["🎓 Practical Guide — universal vs specialized agents", AP.practical]]]
      ]
    };

    ENRICH["multi-agent-orchestration-control"] = {
      title: "Curated, phase-wise study plan",
      body: "Compose single agents into systems — and govern them. Sequenced when-to vs when-not → coordination topologies → shared state → human-in-the-loop → guardrails & sandboxing → cost & latency. Builds on the single-agent patterns from the Workflow & agent patterns track. 🎓 = Udemy course · 💻 = runnable repo · 📘 = Analytics Vidhya course. Full coverage table: ../../agentic-patterns-coverage-findings.html.",
      phases: [
        ["1", "When multi-agent helps (and when a single agent wins)", "The decision: one capable agent vs. a team; universal vs. specialized agents; why (and why not) to add agents.", [["📘 Agentic Design Patterns — Multi-Agent Pattern: why & when", AP.av2], ["🎓 Practical Guide — universal vs specialized agents", AP.practical], ["🎓 Bootcamp §9 & §27 (agentic AI, multi-agent)", AP.bootcamp]]],
        ["2", "Coordination topologies: supervisor / swarm / handoff", "Supervisor coordinating specialists, swarm, and hand-off patterns; sub-agent delegation; blackboard/debate/STORM as alternative topologies.", [["🎓 Bootcamp §27 Multi-Agent Travel Assistant + §26 sub-agents", AP.bootcamp], ["💻 all-agentic-architectures — Multi-Agent #27, Blackboard #28, Debate #29, STORM #30", AP.repo]]],
        ["3", "Shared state & memory across agents", "Passing state between agents; shared/blackboard workspaces; cross-agent memory so the team doesn't repeat itself.", [["🎓 Bootcamp §12 — state schema + agent memory in LangGraph", AP.bootcamp], ["💻 all-agentic-architectures — Blackboard #28; memory patterns #16–20", AP.repo]]],
        ["4", "Human-in-the-loop: approvals & interrupts", "Interrupting a run for approval; editing agent feedback; runtime human feedback; propose → simulate → approve gates.", [["🎓 Bootcamp §15 (4 HITL lectures) + §10 HITL middleware", AP.bootcamp], ["🎓 Practical Guide — adding a human in the loop", AP.practical], ["💻 all-agentic-architectures — Dry-Run #32 (propose→simulate→approve)", AP.repo]]],
        ["5", "Guardrails, tool permissions & sandboxing", "Input/output guardrails; scoping tool permissions; sandboxing agent actions (file-system, browser) so autonomy stays safe.", [["🎓 Bootcamp §18 — Guardrails With LangChain", AP.bootcamp], ["💻 all-agentic-architectures — SWE-Agent #25 (sandboxed FS), BrowserAgent #26 (safety gates)", AP.repo], ["🎓 Practical Guide — problems & security risks", AP.practical]]],
        ["6", "Cost & latency of multi-agent systems", "The real bill: token cost, latency and failure modes of running many agents; LLM-gateway routing/fallbacks as a lever. (Thin across sources — see the gap note in the findings doc.)", [["🎓 Bootcamp §19 — LLM Gateways (routing & cost)", AP.bootcamp], ["🎓 Practical Guide — pricing & when NOT to use MCP/agents", AP.practical]]]
      ]
    };

    // Deep agents & harness engineering. Phases built from four scraped courses
    // (Nov 2026, full curricula in agentic-ai.md): Agentic Harness Engineering
    // (the 6-component harness model — the spine), Ed Donner's Complete Agent & MCP
    // Course (Deep Agents Wk4, Deep Research Wk2, harness+MCP Wk6), Deep Agent —
    // Multi-Agent RAG with Gemini/LangChain (deep researcher from scratch + LangChain
    // Deep Agent), and the Agentic AI Engineering Masterclass (ADK, HITL LRO, deep
    // research project). 🎓 = Udemy course.
    var DA = {
      harness:  "https://www.udemy.com/course/agentic-harness-engineering/?couponCode=PMNVD2025",
      eddonner: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/?couponCode=PMNVD2025",
      deepagent:"https://www.udemy.com/course/deep-agent/?couponCode=PMNVD2025",
      masterclass:"https://www.udemy.com/course/agentic-ai-engineering-design-build-deploy-agents/?couponCode=PMNVD2025",
      bootcamp: "https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/?couponCode=PMNVD2025"
    };

    ENRICH["deep-agents-harness-engineering"] = {
      title: "Curated, phase-wise study plan",
      body: "The harness is what turns a raw model into a capable, long-running agent. This plan follows the harness-engineering arc: the raw-model problem → the 6 harness components → build each layer (loop → file-system/env → sandbox → memory/context → long-horizon) → deep-research agents → observability & optimization. Driven mainly by the Agentic Harness Engineering course, with deep-agent builds from Ed Donner, the Deep Agent (Gemini) course, and the Masterclass. 🎓 = Udemy course. Full curricula: ../../agentic-ai.md.",
      phases: [
        ["1", "The raw-model problem & the harness model", "Why a bare LLM isn't enough; the harness = 6 core components (loop, tools, context, environment, memory, observability) and how they connect; decomposing a real harness (Claude Code).", [["🎓 Agentic Harness Engineering — 'Agent Harness: All the Parts' (6 components; decompose Claude Code)", DA.harness], ["🎓 Ed Donner — Wk6 D1 'Agent frameworks and the agent harness'", DA.eddonner]]],
        ["2", "The conversation loop & context engineering", "The bare conversation loop; system prompt as the first harness primitive; context engineering as the real discipline — input/memory/skills context and progressive disclosure.", [["🎓 Agentic Harness Engineering — 'Designing the Harness Conversation Loop'", DA.harness], ["🎓 Ed Donner — Wk1 D5 context engineering; visible agent loop with checklist tools", DA.eddonner], ["🎓 Masterclass — Context Engineering: sessions & memory", DA.masterclass]]],
        ["3", "File system, environment & sandbox layers", "Why a file system comes first; the FS abstraction, Git versioning, durable memory via AGENTS.md; safe code execution in Docker / UV sandboxes.", [["🎓 Agentic Harness Engineering — 'The File System Layer' (FS, Git, AGENTS.md) + Code-Execution/Sandbox layers", DA.harness], ["🎓 Ed Donner — Wk4 D4 'first Deep Agent with a file system & to-do tools'; Wk3 Docker/UV sandbox tools", DA.eddonner]]],
        ["4", "Deep agents: skills, sub-agents & delegation", "The deepagents harness — planning to-do tool, sub-agent delegation (Task tool), skills (SKILL.md, progressive disclosure), backends & harness profiles; deep agents vs the Claude SDK.", [["🎓 Ed Donner — Wk4 D4 Deep Agents (harness for long-running tasks, SKILL.md, sub-agents, Skills)", DA.eddonner], ["🎓 Bootcamp §26 Building Deep Agents (customization, backends, deep agents vs Claude SDK, sub-agents)", DA.bootcamp], ["🎓 Deep Agent (Gemini) — LangChain's Deep Agent: file backend + research sub-agent", DA.deepagent]]],
        ["5", "Memory, context management & long-horizon execution", "Short-term memory (SQLite) + summarization middleware to survive long context; durable/long-running agents & checkpointing; time-travel/replay; limiting model & tool calls with fallbacks.", [["🎓 Deep Agent (Gemini) — LangChain v1 Agent Bootcamp (SQLite memory, SummarizationMiddleware, TODO planner, PII guardrails)", DA.deepagent], ["🎓 Agentic Harness Engineering — Memory/Search + Context-Management + Long-Horizon Execution layers", DA.harness], ["🎓 Ed Donner — Wk4 D2 LangGraph memory & time travel (MemorySaver, SQLite, replay)", DA.eddonner]]],
        ["6", "Deep research agents (long-horizon, multi-source)", "The research team pattern: orchestrator → researcher → editor; research-plan → run-researcher → run-editor tools; multi-source synthesis into a report; production deploy.", [["🎓 Deep Agent (Gemini) — Multi-Agent Deep Finance Researcher from scratch (orchestrator/researcher/editor, DeepAgentState, file tools)", DA.deepagent], ["🎓 Ed Donner — Wk2 Deep Research Agent (planner/writer/email agents, orchestrated by code)", DA.eddonner], ["🎓 Masterclass — Project 1: open-source Deep Research AI Agent", DA.masterclass]]],
        ["7", "Observability, evaluation & harness optimization", "Traces, evaluation and feedback loops on the harness; human-in-the-loop for long-running ops; production logging; optimizing the harness end-to-end.", [["🎓 Agentic Harness Engineering — 'Observability, Evaluation & Harness Optimization'", DA.harness], ["🎓 Masterclass — Observability for agents + HITL long-running operations", DA.masterclass], ["🎓 Ed Donner — Wk6 capstone: observability, evaluation & feedback", DA.eddonner]]]
      ]
    };

    // LLMOps & AI infrastructure + Security, compliance & private deployment.
    // Both tracks are driven by the same two courses (AI Security Bootcamp &
    // Complete Agentic AI Bootcamp) plus the Krishna Naik production-RAG project,
    // so their phase plans are two halves of one continuous build. Section cites
    // (e.g. A§13) map to the scraped curricula in ../../ai-security.md &
    // ../../agentic-ai.md. Full combined plan: ../../llmops-security-phase-plan.md.
    var LSP = {
      sec:      "https://www.udemy.com/course/ai-security-bootcamp-guardrailsllm-gatewaysobservability/?couponCode=PMNVD2025",
      bootcamp: "https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/?couponCode=PMNVD2025",
      prodrag:  "https://www.krishnaik.in/project/production-grade-cyclic-rag-with-langgraph-gcp-and-groq"
    };

    ENRICH["llmops-ai-infrastructure"] = {
      title: "Curated, phase-wise study plan",
      body: "The operability half of the build: put a gateway in front of the app (routing & fallbacks), make every decision observable, then cut cost with caching & rate limiting before shipping it on real infra. Driven by the AI Security Bootcamp (gateways §11–14, observability §4–6, Redis §21, projects §22–25) with the LLM-Gateways section of the Agentic AI Bootcamp (§19), and closed out by the Krishna Naik production-RAG project. Pairs with the Security track (guardrails → red-teaming), which shares the same courses. Full combined plan: ../../llmops-security-phase-plan.md. 🎓 = Udemy · 🛠️ = project.",
      phases: [
        ["1", "LLM gateways & routing", "One gateway in front of the reference agent with a documented fallback chain and a benchmark table (p50/p95 latency, cost per provider) justifying the routing policy.", [["🎓 A§11–12 — Portkey: setup, retry/timeout/fallback, load balancing, caching, LangChain integration", LSP.sec], ["🎓 A§13 — TensorZero: TOML, routing types, latency benchmarking, MiniJinja templates, unified tool-calling, A/B testing", LSP.sec], ["🎓 A§14 — Bifrost: fallback/streaming/logging, virtual keys + MCP through the gateway, mini-RAG w/ Qdrant", LSP.sec], ["🎓 B§19 — LLM Gateways: understanding & implementation", LSP.bootcamp]]],
        ["2", "Observability & tracing", "Every call in the reference agent traced end-to-end in both LangSmith and Logfire, with guardrail hits and gateway fallbacks visible on a dashboard.", [["🎓 A§4 — Why observability; frameworks landscape", LSP.sec], ["🎓 A§5 — LangSmith: manual & custom tracing, agentic-RAG tracing, LangGraph app + Studio", LSP.sec], ["🎓 A§6 — Pydantic Logfire: trace simple RAG, ReAct agent & agentic workflow", LSP.sec]]],
        ["3", "Caching, rate limiting & cost control", "Before/after cost + latency numbers with exact and semantic caching enabled, plus a working rate limiter with backoff.", [["🎓 A§21 — Redis: exact-match caching, semantic caching w/ embeddings, agent conversation memory, rate limiting & API cost control, RAG caching demo", LSP.sec]]],
        ["4", "Serving & deployment strategies", "A deployment design doc: self-hosted serving (containers/autoscaling), plus a rollout/rollback strategy (canary, flags, circuit breakers) built on the Phase-1 fallback patterns.", [["🎓 A§22–23 — Docker → Artifact Registry → Cloud Run as the serving/runtime pattern", LSP.sec], ["🎓 A§24 — Integrating gateways + guardrails + evals into the deployed app", LSP.sec]]],
        ["5", "Secured capstone — CI/CD + IaC", "A deployed, runnable agent composing gateway + tracing + caching, provisioned by Terraform behind a green CI/CD pipeline.", [["🎓 A§25 — Research platform: Terraform+AWS IaC, TensorZero config, LangSmith eval, GitHub Actions CI/CD, full deploy", LSP.sec], ["🛠️ Production RAG: Guardrails, LLM Gateway, Evals, IaC (GCP)", LSP.prodrag]]]
      ]
    };

    ENRICH["security-compliance-private-deployment"] = {
      title: "Curated, phase-wise study plan",
      body: "The safety half of the build: model the attack surface, wrap the app in guardrails (they gate everything downstream), then attack what you built with PyRIT and quantify what gets through — before formalizing private/on-prem deployment and shipping a secured capstone. Driven by the AI Security Bootcamp (guardrails §7–10, PyRIT §20, projects §22–25) with the Guardrails section of the Agentic AI Bootcamp (§18). Pairs with the LLMOps track (gateways → observability), which shares the same courses. Full combined plan: ../../llmops-security-phase-plan.md. 🎓 = Udemy · 🛠️ = project.",
      phases: [
        ["1", "Foundations & threat model", "A one-page threat model for the reference agent: inputs, tools, data stores, egress — each annotated with the phase that defends it.", [["🎓 A§1 — Why security is the #1 GenAI concern; architecture of agentic apps (where controls attach)", LSP.sec], ["🎓 A§7 — What guardrails are; the framework landscape", LSP.sec], ["🎓 B§18 — Guardrails with LangChain: framing", LSP.bootcamp]]],
        ["2", "Guardrail frameworks", "The same agent wrapped three ways (NeMo, Bedrock, Guardrails AI) with a comparison note: latency, cost, control granularity, and your default pick.", [["🎓 A§8 — NeMo Guardrails: input/output rails, PII via custom rails, secured HR-assistant build", LSP.sec], ["🎓 A§9 — AWS Bedrock Guardrails: content filters, denied topics, PII redaction, versioning, cost vs OSS", LSP.sec], ["🎓 A§10 — Guardrails AI: Hub & validators, OnFailAction, streaming Guard object, LangChain integration", LSP.sec], ["🎓 B§18 — PII guardrails in an agent (middleware)", LSP.bootcamp]]],
        ["3", "Red-teaming with PyRIT", "A red-team report on the Phase-2 agent (attack → did the rail hold? → fix), re-run after fixes with the delta shown on a dashboard.", [["🎓 A§20 — PyRIT: targets/scorers/converters, PAIR/Crescendo/TAP/Many-Shot jailbreaks, encoding/obfuscation, multi-turn orchestrators, XPIA, Skeleton Key, automated scorers, multimodal attacks, fuzzing & bulk scanning, red-team dashboard app", LSP.sec]]],
        ["4", "On-prem / private deployment", "A deployment design doc: where the agent runs (VPC/Private Link), how tenants are isolated, permission sandboxing, and the compliance/data-residency posture.", [["🎓 A§25 — Auth, IAM, connection pooling & tenant isolation in the deployed project", LSP.sec], ["🛠️ Applied against your existing Databricks / VPC / Private Link experience — formalize it", LSP.prodrag]]],
        ["5", "Secured capstone", "A deployed, runnable agent composing guardrails + red-team dashboard + evals, with the security integration validated end-to-end.", [["🎓 A§22–24 — Secured Agentic RAG on GCP: ingestion → agentic graph → integrate guardrails/gateways/evals → eval pipeline", LSP.sec], ["🛠️ Production RAG: Guardrails, LLM Gateway, Evals, IaC (GCP)", LSP.prodrag]]]
      ]
    };

    // DevOps & deployment foundations. Phases built from six scraped beginner-to-
    // working-level courses (Nov 2026, full curricula in devops.md): Docker (Mumshad),
    // the Full-Stack GenAI Docker section, Kubernetes (Mumshad), Terraform (Mumshad),
    // GitHub Actions (Schwarzmüller), and the Grafana+Prometheus half of the
    // Observability course. Ordered containers → orchestration → IaC → CI/CD →
    // observability → ship-an-AI-app. 🎓 = Udemy course.
    var DV = {
      docker:   "https://www.udemy.com/course/learn-docker/?couponCode=PMNVD2025",
      fsdocker: "https://www.udemy.com/course/full-stack-ai-with-python/?couponCode=PMNVD2025",
      k8s:      "https://www.udemy.com/course/learn-kubernetes/",
      terraform:"https://www.udemy.com/course/terraform-for-the-absolute-beginners/?couponCode=PMNVD2025",
      ghactions:"https://www.udemy.com/course/github-actions-the-complete-guide/?couponCode=PMNVD2025",
      grafana:  "https://www.udemy.com/course/grafana-prometheus-loki-alloy-tempo/?couponCode=PMNVD2025"
    };

    ENRICH["devops-deployment-foundations"] = {
      title: "Curated, phase-wise study plan",
      body: "The infra layer an FDE needs to ship an AI app into a client environment. Sequenced containers → orchestration → infrastructure-as-code → CI/CD → observability → deploy end-to-end. Each phase names its primary course (all beginner-to-working level; full curricula in ../../devops.md). 🎓 = Udemy course. Scoped per request: only the Docker section of Full-Stack GenAI, and only the Grafana + Prometheus half of the Observability course.",
      phases: [
        ["1", "Containers: Docker fundamentals", "Why containers (vs VMs); images vs containers; the Docker CLI; run commands (tags, interactive, port mapping, volumes/bind mounts, logs); engine internals (namespaces, cgroups), storage & networking; registries.", [["🎓 Docker for the Absolute Beginner — commands, run, images, engine/storage/networking, registry", DV.docker]]],
        ["2", "Dockerfiles, Compose & image delivery", "Writing Dockerfiles; multi-stage builds & image optimization; CMD vs ENTRYPOINT; env vars; docker-compose (networking, volumes); publishing to Docker Hub / private registries.", [["🎓 Full-Stack GenAI — 'Mastering Docker for Developers' (Dockerfile, multi-stage, Compose, registries)", DV.fsdocker], ["🎓 Docker for the Absolute Beginner — Images & Docker Compose", DV.docker]]],
        ["3", "Orchestration: Kubernetes essentials", "K8s architecture (control plane, nodes, containerd); Pods, ReplicaSets, Deployments; YAML manifests; Services (NodePort/ClusterIP/LoadBalancer); rolling updates & rollbacks; scaling; managed K8s on GKE/EKS/AKS.", [["🎓 Kubernetes for the Absolute Beginners — Pods/ReplicaSets/Deployments, Services, updates, K8s on cloud", DV.k8s]]],
        ["4", "Infrastructure as Code: Terraform", "IaC & why Terraform; HCL; providers; input/output variables; resource attributes & dependencies; state (remote state + locking on S3); commands; lifecycle, count/for_each; modules; Terraform on AWS (IAM/S3/EC2).", [["🎓 Terraform for the Absolute Beginners with Labs — HCL → state → modules → AWS", DV.terraform]]],
        ["5", "CI/CD: GitHub Actions", "Workflows, jobs, steps, runners & actions; event triggers & filters; job artifacts & outputs; environment variables & secrets; execution control (conditionals, matrix, caching); container jobs & services; custom actions; token permissions & security.", [["🎓 GitHub Actions — The Complete Guide (build → test → deploy on push; secrets; matrix; custom actions; security)", DV.ghactions]]],
        ["6", "Observability: metrics, logs & dashboards", "Monitoring vs observability; push vs scrape; telemetry types; install Prometheus + Node Exporter; PromQL (selectors, operators, aggregations, over-time); Grafana dashboards & panels; connecting Grafana → Prometheus; alerts, notification policies & annotations.", [["🎓 Observability with Grafana & Prometheus — Prometheus + PromQL, Grafana dashboards, alerts", DV.grafana]]],
        ["7", "Ship an AI app into a client-like environment", "Put it together: containerize the app, deploy to a cloud runtime (ECS / Cloud Run / K8s), wire CI/CD, provision with Terraform, add health checks + Prometheus/Grafana observability, and promote dev → staging → prod with secrets/config. The FDE reality.", [["🎓 Full-Stack GenAI — Docker orchestration & AWS ECS/ECR deploy (HA, health checks, cleanup)", DV.fsdocker], ["🎓 Terraform on AWS + GitHub Actions CI/CD as the IaC + pipeline layer", DV.terraform]]]
      ]
    };

  // Hub sections — group the top-level tracks into a small number of study
  // "sections" on the hub. Tracks are matched to a section by their slug (the
  // same slugify() used for topic pages), so this layer is purely presentational
  // and never touches data.js. Any track whose slug isn't listed here collects
  // into a trailing "More Tracks" section, so nothing can ever disappear.
  var HUB_SECTIONS = [
    {
      title: "🎯 Certification Track",
      blurb: "Structured prep for the Anthropic Claude certifications — official courses, prep repos, and guides.",
      slugs: ["anthropic-certification-prep"]
    },
    // Single contiguous learning spine (Phase 00 → 11). Ordered by prerequisite:
    // calibrate → theory foundations → LangChain → retrieval/RAG → agents →
    // advanced agentic systems → frameworks → Claude Code → production → craft →
    // live cycle → compounding. Each track appears in exactly one phase (first
    // section wins), so there are no gaps or duplicates.
    {
      title: "📍 00 · Calibrate",
      blurb: "Aim before you run. Map yourself to the real bar and lock your capstones.",
      slugs: [
        "position-against-the-real-fde-bar"
      ]
    },
    {
      title: "📍 01 · LLM & Theory Foundations (optional — compressible)",
      blurb: "Enough internals to reason about failure modes and whiteboard a transformer. The applied path below does not hard-depend on this — do it first if you like, or compress/skip and come back.",
      slugs: [
        "math-ml-intuition-for-llms",
        "transformer-architecture",
        "model-landscape-hugging-face",
        "pretraining-fine-tuning-rl-optional"
      ]
    },
    {
      title: "📍 02 · Foundations & LangChain",
      blurb: "Start the applied path here. The LangChain building blocks, then how to write and assemble what the model sees (prompt & context engineering). Everything downstream depends on this.",
      slugs: [
        "langchain-fundamentals",
        "prompt-context-engineering"
      ]
    },
    {
      title: "📍 03 · Retrieval & RAG",
      blurb: "Give models real knowledge. Learn the retrieval layer FIRST — embeddings & vector databases — then build RAG from naive to production, and extend it to multimodal / document intelligence.",
      slugs: [
        "embeddings-vector-databases",
        "rag-naive-production",
        "multimodal-document-intelligence"
      ]
    },
    {
      title: "📍 04 · Agents — Build Order",
      blurb: "Build one capable agent from first principles: the reasoning + tool-use loop, a tool-calling agent in LangChain, LangGraph fundamentals, then full agents on LangGraph — plus workflow/agent patterns and the first-party SDKs.",
      slugs: [
        "agent-fundamentals-tool-use",
        "tool-calling-ai-agent-with-langchain",
        "langgraph-fundamentals",
        "ai-agents-with-langgraph",
        "workflow-agent-patterns",
        "agent-sdks-first-party-lab"
      ]
    },
    {
      title: "📍 05 · Advanced Agentic Systems",
      blurb: "Compose agents into systems. Agentic RAG & GraphRAG (needs both RAG and agents), then persistent memory, multi-agent orchestration, the deep-agent harness, and evaluation. (Agent protocols — MCP, ACP, A2A — are grouped in their own hub below.)",
      slugs: [
        "advanced-rag-graphrag",
        "memory-state",
        "multi-agent-orchestration-control",
        "deep-agents-harness-engineering",
        "evaluation-eval-harnesses"
      ]
    },
    {
      title: "🔌 Agent Protocols",
      blurb: "The interoperability layer for agentic systems: how models reach tools & data (MCP), and how independent agents describe, discover & talk to each other (ACP, A2A). Learn MCP first — it's the most established and the one your domain uses — then the agent-to-agent protocols.",
      slugs: [
        "mcp-model-context-protocol",
        "acp-agent-communication-protocol",
        "a2a-agent2agent-protocol"
      ]
    },
    {
      title: "📍 06 · Alternative Agent Frameworks",
      blurb: "Framework-specific tracks to pick up after the LangChain/LangGraph core path. Each is standalone — learn the one your project needs. The Orchestration overview compares all tiers and helps you choose.",
      slugs: [
        "dspy",
        "crewai",
        "pydanticai",
        "autogen",
        "orchestration-frameworks"
      ]
    },
    {
      title: "📍 07 · Claude Code & AI Coding Tools",
      blurb: "Claude Code is Anthropic's flagship agentic coding harness — for an FDE targeting Anthropic, mastering it is table stakes, and knowing the wider tool landscape is how you advise clients credibly. It sits here because it composes everything in the agent arc.",
      slugs: [
        "claude-code-operator-mastery",
        "the-ai-coding-tool-landscape"
      ]
    },
    {
      title: "📍 08 · Production & FDE Differentiators",
      blurb: "This phase is where the offer is decided. Ops, deployment, and your governance moat (evaluation lives with Advanced Agentic Systems above).",
      slugs: [
        "devops-deployment-foundations",
        "llmops-ai-infrastructure",
        "security-compliance-private-deployment",
        "safety-alignment-literacy"
      ]
    },
    {
      title: "📍 09 · FDE Craft & Landing",
      blurb: "Turn skills into an offer: the consulting muscle, the full-stack gap, the portfolio, the loop.",
      slugs: [
        "discovery-solutioning",
        "full-stack-shipping",
        "capstones-portfolio",
        "interview-positioning"
      ]
    },
    {
      title: "📍 10 · Live Cycle & Deepening",
      blurb: "First applications are in. Run the loop like an engineer — instrument it, learn from every round — and go deep on one thing that makes you unmistakable.",
      slugs: [
        "running-the-interview-loop",
        "pick-a-spike-go-deep-on-one-differentiator",
        "third-capstone-a-frontier-signal-build"
      ]
    },
    {
      title: "📍 11 · Compounding & Second Wave",
      blurb: "Turn the first cycle's signal into leverage: publish, get referred, and reapply from strength — until an offer lands.",
      slugs: [
        "public-presence-technical-storytelling",
        "network-referral-activation",
        "second-wave-decision-point"
      ]
    },
    // Supplementary groupings — parallel to the numbered spine, not part of it.
    {
      title: "🧑‍🏫 Cohorts & Bootcamps",
      blurb: "Time-boxed cohorts, instructor-led programs, and multi-month bootcamps — the ones with sessions, assignments, and due dates. Each course is its own track.",
      slugs: [
        "google-genai-academy",
        "analytics-vidhya-agentic-ai-pioneer-program",
        "become-an-ai-engineer-learn-by-doing-bytebytego",
        "systematically-improving-rag-applications",
        "bootcamps-courses",
        "anthropic-academy",
        "langchain-academy"
      ]
    },
    {
      title: "🧠 Core AI Engineering Track (course bundles)",
      blurb: "Course-list view of the main build path: Claude & agent SDKs, the LangChain/LangGraph bundle, RAG & evals, agent memory, frameworks, theory, and hands-on projects. Overlaps the numbered spine above — use whichever framing you prefer.",
      slugs: [
        "core-ai-engineering-track",
        "langchain-langgraph",
        "rag-evals-production",
        "agentic-memory-context",
        "agent-frameworks-builds",
        "ai-engineering-projects",
        "theory-math-for-core-llm-and-genai"
      ]
    },
    {
      title: "📍 OPT · Optional depth — off the FDE path",
      blurb: "Everything from the reference ChatGPT roadmap that sits outside the FDE critical path — added for completeness at your request. Fully checkable so you can track it, but excluded from your readiness % and phase math. Study by interest, not obligation.",
      slugs: [
        "math-theory-foundations-optional",
        "classic-deep-learning-optional",
        "software-api-engineering-foundations-optional",
        "hugging-face-ecosystem-full-optional",
        "inference-serving-infrastructure-deep-optional",
        "llmops-tooling-broader-optional",
        "interview-coding-dsa-optional"
      ]
    },
    {
      title: "📍 LAB · Extra project library — off-path builds",
      blurb: "The rest of the Krish Naik catalog — projects that don't map to a skill this tracker teaches (classic ML, computer vision, BI, Python utilities). Grouped by category, read-only. Build one only if the topic genuinely pulls you; none of it moves the FDE needle.",
      slugs: [
        "classic-tabular-ml-builds",
        "computer-vision-medical-imaging",
        "data-analytics-bi-power-bi",
        "python-utilities-misc"
      ]
    },
    {
      title: "⚙️ Forward Deployed Engineer Foundations",
      blurb: "Python depth, infrastructure, and DevOps (Docker, Kubernetes, Terraform) for shipping to production.",
      slugs: ["forward-deployed-engineer-foundations"]
    },
    {
      title: "📚 Reference & Reading",
      blurb: "Books, newsletters, and blogs to revisit.",
      slugs: [
        "books-reading-list",
        "newsletters-substacks-and-medium-blogs"
      ]
    }
  ];

  function counts(sec) {
    var subs = (sec.topics || []).length, items = 0, links = 0;
    (sec.topics || []).forEach(function (tp) {
      (tp.items || []).forEach(function (it) { items++; if (it.link) links++; });
    });
    return { subs: subs, items: items, links: links };
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function chip(text, cls) { return el("span", "chip " + cls, text); }

  // Build a "phase-wise plan" panel (used by the ENRICH layer). `phases` is an
  // array of [n, name, outcome, [[courseLabel, url], ...]]. Optional `lead` adds
  // a one-line intro under the title.
  function phasePlanPanel(title, phases, lead) {
    var pp = el("section", "panel");
    pp.appendChild(el("p", "panel-title", title));
    if (lead) pp.appendChild(el("p", "panel-lead", lead));
    var list = el("div", "phase-plan");
    phases.forEach(function (ph) {
      var row = el("div", "phase");
      row.appendChild(el("span", "phase-n", ph[0]));
      var b = el("div", "phase-b");
      b.appendChild(el("p", "phase-name", "Phase " + ph[0] + " — " + ph[1]));
      b.appendChild(el("p", "phase-out", ph[2]));
      var courses = el("div", "phase-courses");
      (ph[3] || []).forEach(function (c) {
        var a = el("a", "course-link", "▶ " + c[0]);
        a.href = c[1]; a.target = "_blank"; a.rel = "noopener";
        courses.appendChild(a);
      });
      b.appendChild(courses);
      row.appendChild(b);
      list.appendChild(row);
    });
    pp.appendChild(list);
    return pp;
  }

  function renderItem(it) {
    var li = el("li", "item" + (it.sub ? " sub-item" : ""));
    var dot = el("span", "item-dot");
    if (it.done) { dot.classList.add("done"); dot.textContent = "✓"; }
    else if (it.badge === "prog") { dot.classList.add("prog"); dot.textContent = "◐"; }
    else { dot.textContent = "○"; }
    li.appendChild(dot);

    var main = el("div", "item-main");
    var text;
    if (it.link) {
      text = el("a", "item-text", it.t || "(untitled)");
      text.href = it.link; text.target = "_blank"; text.rel = "noopener";
    } else {
      text = el("span", "item-text", it.t || "(untitled)");
    }
    if (it.done) text.classList.add("done");
    main.appendChild(text);

    // Optional status layer (topic pages only): fold saved progress onto the dot
    // and make it clickable to cycle status. Absent on the hub, so no-op there.
    if (window.LT_STATUS && window.LT_STATUS.attach && it._id) {
      window.LT_STATUS.attach(it, dot, text);
    }

    var chips = el("span", "chips");
    if (it.priority) chips.appendChild(chip("⚑ priority", "chip-pri"));
    if (it.stars) chips.appendChild(chip("★".repeat(it.stars), "chip-star"));
    if (it.due) chips.appendChild(chip("📅 " + it.due, "chip-due"));
    (it.tags || []).forEach(function (tg) { chips.appendChild(chip(tg, "chip-tag")); });
    if (chips.childNodes.length) main.appendChild(chips);

    li.appendChild(main);
    return li;
  }

  // Build one track as a collapsible <details> accordion. Collapsed, it shows the
  // track title + counts; expanded, it lists every topic covered (as bullets) so
  // you can see a track's scope without opening its dedicated page. `n` is the
  // 1-based sequence number shown on the row.
  function trackAccordion(sec, n) {
    var c = counts(sec);
    var slug = slugify(sec.title);
    var edit = window.LT_EDIT || null;   // editing layer (tracker-app.js), if present
    var acc = el("details", "track-acc");
    acc.dataset.module = sec.title;

    // --- summary row (always visible) ---
    var head = el("summary", "track-acc-head");
    var caret = el("span", "ta-caret"); caret.setAttribute("aria-hidden", "true"); caret.textContent = "▸";
    head.appendChild(caret);
    head.appendChild(el("span", "tc-num", String(n).padStart(2, "0")));

    var titleWrap = el("div", "ta-title-wrap");
    titleWrap.appendChild(el("span", "tc-title", sec.title));
    titleWrap.appendChild(el("span", "tc-meta",
      c.subs + " sub-topics · " + c.items + " resources · " + c.links + " links"));
    head.appendChild(titleWrap);

    if (ENRICH[slug]) head.appendChild(el("span", "badge-ready", "Phase-wise plan ready"));
    if (edit && edit.moduleControls) head.appendChild(edit.moduleControls(sec));
    acc.appendChild(head);

    // --- body (revealed on expand): bulleted topic list + link out ---
    var body = el("div", "ta-body");
    var topics = sec.topics || [];
    if (topics.length) {
      body.appendChild(el("p", "ta-topics-label", "Topics covered in this track"));
      var ul = el("ul", "ta-topics");
      topics.forEach(function (tp) {
        var li = el("li", "ta-topic");
        li.appendChild(el("span", "ta-topic-name", tp.title));
        var cnt = (tp.items || []).length;
        li.appendChild(el("span", "ta-topic-count", cnt + (cnt === 1 ? " item" : " items")));
        if (edit && edit.topicControls) li.appendChild(edit.topicControls(sec, tp));
        ul.appendChild(li);
      });
      body.appendChild(ul);
    } else {
      body.appendChild(el("p", "ta-empty", "No topics added to this track yet."));
    }

    if (edit && edit.topicAdder) body.appendChild(edit.topicAdder(sec));

    var open = el("a", "ta-open", "Open full track →");
    open.href = "topics/" + slug + ".html";
    body.appendChild(open);
    acc.appendChild(body);

    return acc;
  }

  function renderHub(mountId) {
    var data = window.LEARNING_DATA || [];
    var mount = document.getElementById(mountId || "hub");
    if (!mount) return;
    mount.innerHTML = "";   // clear so renderHub can be called again after edits

    var tItems = 0, tLinks = 0;
    data.forEach(function (s) { var c = counts(s); tItems += c.items; tLinks += c.links; });

    var statRow = document.getElementById("stat-row");
    if (statRow) {
      statRow.innerHTML = "";
      statRow.appendChild(el("span", "stat", data.length + " tracks"));
      statRow.appendChild(el("span", "stat", tItems + " resources"));
      statRow.appendChild(el("span", "stat", tLinks + " links"));
      statRow.appendChild(el("span", "stat alt", "Claude Code · phase-wise plan ready"));
    }

    // Index tracks by slug so sections can pull them in a defined order while
    // preserving the original data.js order within each section.
    var bySlug = {}, order = [];
    data.forEach(function (sec) {
      var slug = slugify(sec.title);
      bySlug[slug] = sec;
      order.push(slug);
    });

    var placed = {};   // slugs already assigned to a section
    var n = 0;         // running track number across all sections

    // Each section is itself a collapsible <details>, open by default, holding a
    // stack of per-track accordions. Two levels of expand/collapse: section, then
    // track (which reveals the bulleted topic list).
    function renderSection(title, blurb, secs, opts) {
      if (!secs.length) return;
      var wrap = el("details", "hub-section");
      if (opts && opts.open === true) wrap.setAttribute("open", "");

      var head = el("summary", "hub-section-head");
      var caret = el("span", "hs-caret"); caret.setAttribute("aria-hidden", "true"); caret.textContent = "▸";
      head.appendChild(caret);
      head.appendChild(el("h2", "hub-section-title", title));
      head.appendChild(el("span", "hub-section-count",
        secs.length + (secs.length === 1 ? " track" : " tracks")));
      wrap.appendChild(head);

      var inner = el("div", "hub-section-body");
      if (blurb) inner.appendChild(el("p", "hub-section-blurb", blurb));
      var list = el("div", "track-list");
      secs.forEach(function (sec) { list.appendChild(trackAccordion(sec, ++n)); });
      inner.appendChild(list);
      wrap.appendChild(inner);
      mount.appendChild(wrap);
    }

    HUB_SECTIONS.forEach(function (def) {
      var secs = [];
      def.slugs.forEach(function (slug) {
        if (bySlug[slug] && !placed[slug]) { placed[slug] = 1; secs.push(bySlug[slug]); }
      });
      renderSection(def.title, def.blurb, secs);
    });

    // Anything not claimed by a section (e.g. new tracks added to data.js) still
    // shows up, so tracks can never silently disappear from the hub.
    var leftovers = order.filter(function (slug) { return !placed[slug]; })
      .map(function (slug) { return bySlug[slug]; });
    renderSection("🗂️ More Tracks", "Other tracks in your data not yet assigned to a section above.", leftovers);

    // Editing layer (tracker-app.js): a control to add a brand-new track/module.
    var edit = window.LT_EDIT || null;
    if (edit && edit.moduleAdder) mount.appendChild(edit.moduleAdder());

    wireHubControls(mount);
  }

  // Wire the Expand all / Collapse all buttons (if present) to every <details>
  // in the hub — both section-level and track-level accordions.
  function wireHubControls(mount) {
    var expandBtn = document.getElementById("hub-expand");
    var collapseBtn = document.getElementById("hub-collapse");
    if (!expandBtn && !collapseBtn) return;
    function setAll(open) {
      var all = mount.querySelectorAll("details");
      for (var i = 0; i < all.length; i++) {
        if (open) all[i].setAttribute("open", "");
        else all[i].removeAttribute("open");
      }
    }
    if (expandBtn) expandBtn.addEventListener("click", function () { setAll(true); });
    if (collapseBtn) collapseBtn.addEventListener("click", function () { setAll(false); });
  }

  function renderTopic(slug, mountId) {
    LAST_TOPIC = { slug: slug, mountId: mountId };   // so a status layer can re-render after a change/sync
    var data = window.LEARNING_DATA || [];
    var sec = null;
    for (var i = 0; i < data.length; i++) {
      if (slugify(data[i].title) === slug) { sec = data[i]; break; }
    }
    var mount = document.getElementById(mountId || "topic");
    var titleEl = document.getElementById("tk-title");
    var subEl = document.getElementById("tk-sub");
    var crumbEl = document.getElementById("crumb-current");

    if (mount) mount.innerHTML = "";   // clear so renderTopic can re-render after a status change / sync

    if (!sec) {
      if (titleEl) titleEl.textContent = "Track not found";
      if (mount) mount.appendChild(el("p", "notfound", "No track matches “" + slug + "” in data.js."));
      return;
    }

    // Stamp each item with the hub's stable id (b:<module>::<topic>::<index>) and,
    // if a status layer is present, fold saved progress onto done/badge so the dot
    // reflects real status. Ids match tracker-app.js so status is shared with the hub.
    (sec.topics || []).forEach(function (tp) {
      (tp.items || []).forEach(function (it, i) {
        it._id = "b:" + sec.title + "::" + tp.title + "::" + i;
        if (window.LT_STATUS && window.LT_STATUS.fold) window.LT_STATUS.fold(it);
      });
    });

    var c = counts(sec);
    document.title = sec.title + " — Study Track";
    if (titleEl) titleEl.textContent = sec.title;
    if (crumbEl) crumbEl.textContent = sec.title;
    if (subEl) subEl.textContent =
      c.subs + " sub-topics · " + c.items + " resources · " + c.links + " links. "
      + "This page renders live from the tracker's data — every original link is preserved in the Reference section below.";

    // Optional enrichment (curated companion plan)
    var enr = ENRICH[slug];
    if (enr) {
      var box = el("div", "enrich");
      box.appendChild(el("p", "enrich-title", enr.title));
      box.appendChild(el("p", null, enr.body));
      if (enr.docs) {
        var dl = el("div", "doclinks");
        enr.docs.forEach(function (d) {
          var a = el("a", "doclink", d[0]); a.href = d[1];
          a.target = "_blank"; a.rel = "noopener";
          dl.appendChild(a);
        });
        box.appendChild(dl);
      }
      mount.appendChild(box);

      // Phase-wise plan with per-phase course links
      if (enr.phases) {
        mount.appendChild(phasePlanPanel(
          "🗺️ Phase-wise plan (cohort study map) — the primary course per phase", enr.phases));
      }

      // Optional Udemy top-ups — what the 6 Udemy courses add on top of the 4
      if (enr.topups) {
        var tu = el("section", "panel");
        tu.appendChild(el("p", "panel-title", "➕ Do the Udemy courses add anything? (optional top-ups)"));
        tu.appendChild(el("p", "panel-lead", "The 4 cohort courses cover Claude Code end-to-end. These are the only gaps worth pulling from Udemy — mostly building around Claude (API/SDK) plus a few niche workflows."));
        var tlist = el("div", "topup-list");
        enr.topups.forEach(function (t) {
          var row = el("div", "topup");
          var head = el("div", "topup-head");
          head.appendChild(el("span", "topup-name", t[0]));
          head.appendChild(el("span", "chip pri-" + t[3].toLowerCase().split(" ")[0], t[3]));
          row.appendChild(head);
          row.appendChild(el("p", "topup-why", t[1]));
          var srcs = el("div", "phase-courses");
          t[2].forEach(function (c) {
            var a = el("a", "course-link", "▶ " + c[0]);
            a.href = c[1]; a.target = "_blank"; a.rel = "noopener";
            srcs.appendChild(a);
          });
          row.appendChild(srcs);
          tlist.appendChild(row);
        });
        tu.appendChild(tlist);
        if (enr.topupNote) tu.appendChild(el("p", "topup-verdict", enr.topupNote));
        mount.appendChild(tu);
      }
    }

    // Sub-topics with their items. If the enrichment layer defines a phase-wise
    // plan keyed to a sub-topic title (enr.sectionPlans), render that plan right
    // after the matching section so each topic list is followed by its study map.
    var sectionPlans = (enr && enr.sectionPlans) || {};
    (sec.topics || []).forEach(function (tp) {
      var block = el("section", "subtopic");
      var h = el("h2", "subtopic-title", tp.title);
      h.appendChild(el("span", "subtopic-count", (tp.items || []).length + " item"
        + ((tp.items || []).length === 1 ? "" : "s")));
      block.appendChild(h);
      if ((tp.items || []).length) {
        var ul = el("ul", "item-list");
        tp.items.forEach(function (it) { ul.appendChild(renderItem(it)); });
        block.appendChild(ul);
      }
      mount.appendChild(block);

      var plan = sectionPlans[tp.title];
      if (plan) mount.appendChild(phasePlanPanel(plan.title, plan.phases, plan.lead));
    });

    // Reference — every unique link in this track
    var seen = {}, refs = [];
    (sec.topics || []).forEach(function (tp) {
      (tp.items || []).forEach(function (it) {
        if (it.link && !seen[it.link]) { seen[it.link] = 1; refs.push(it); }
      });
    });
    if (refs.length) {
      var panel = el("section", "panel");
      panel.appendChild(el("p", "panel-title", "🔗 Reference — original links in this track"));
      var ref = el("div", "ref");
      ref.appendChild(el("p", "ref-label", refs.length + " unique links"));
      var ol = el("ul", "ref-list");
      refs.forEach(function (it) {
        var li = el("li");
        var a = el("a", null, it.t || it.link);
        a.href = it.link; a.target = "_blank"; a.rel = "noopener";
        li.appendChild(a);
        ol.appendChild(li);
      });
      ref.appendChild(ol);
      panel.appendChild(ref);
      mount.appendChild(panel);
    }
  }

  window.LT_TRACKER = { slugify: slugify, renderHub: renderHub, renderTopic: renderTopic, rerenderTopic: rerenderTopic };
})();
