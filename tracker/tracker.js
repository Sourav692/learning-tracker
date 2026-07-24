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
    "claude-agent-sdk-claude-code-and-agent-skills": {
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
      title: "🧠 Core AI Engineering Track",
      blurb: "The main build path: Claude & agent SDKs, LangChain/LangGraph, RAG & evals, agent memory, frameworks, theory, and hands-on projects.",
      slugs: [
        "core-ai-engineering-track",
        "claude-agent-sdk-claude-code-and-agent-skills",
        "langchain-langgraph",
        "rag-evals-production",
        "agentic-memory-context",
        "agent-frameworks-builds",
        "ai-engineering-projects",
        "theory-math-for-core-llm-and-genai"
      ]
    },
    // FDE-mirrored roadmap: each FDE phase is a hub section; each module inside it
    // is a track. Generated from files/fde-agentic-engineering-tracker.jsx.
    {
      title: "📍 00 · Calibrate",
      blurb: "Aim before you run. Map yourself to the real bar and lock your capstones.",
      slugs: [
        "position-against-the-real-fde-bar"
      ]
    },
    {
      title: "📍 01 · LLM Foundations",
      blurb: "Enough internals to reason about failure modes and whiteboard a transformer. Move fast — you can compress this.",
      slugs: [
        "math-ml-intuition-for-llms",
        "transformer-architecture",
        "model-landscape-hugging-face",
        "pretraining-fine-tuning-rl-optional"
      ]
    },
    {
      title: "📍 02 · Context, Retrieval & RAG",
      blurb: "Retrieval quality is almost always the real bottleneck. Learn to measure it, not vibe it.",
      slugs: [
        "prompt-context-engineering",
        "embeddings-vector-databases",
        "rag-naive-production",
        "advanced-rag-graphrag",
        "multimodal-document-intelligence"
      ]
    },
    {
      title: "📍 03 · Agents — foundations & frameworks",
      blurb: "Build one capable agent from first principles: the reasoning loop and tool use, the workflow patterns, then the SDKs and frameworks you'll actually build with.",
      slugs: [
        "agent-fundamentals-tool-use",
        "workflow-agent-patterns",
        "agent-sdks-first-party-lab",
        "orchestration-frameworks"
      ]
    },
    {
      title: "📍 04 · Agents — memory, MCP & multi-agent",
      blurb: "Turn a single agent into a system: give it persistent memory, connect it to the world through MCP, compose multiple agents, and master the deep-agent harness (Claude Code).",
      slugs: [
        "memory-state",
        "mcp-model-context-protocol",
        "multi-agent-orchestration-control",
        "deep-agents-harness-engineering"
      ]
    },
    {
      title: "📍 05 · Claude Code & AI coding tools",
      blurb: "Claude Code is Anthropic's flagship agentic coding harness — for an FDE targeting Anthropic, mastering it is table stakes, and knowing the wider tool landscape is how you advise clients credibly. It sits here because it composes everything in the agent arc.",
      slugs: [
        "claude-code-operator-mastery",
        "the-ai-coding-tool-landscape"
      ]
    },
    {
      title: "📍 06 · Production & FDE Differentiators",
      blurb: "This phase is where the offer is decided. Evals, ops, and your governance moat.",
      slugs: [
        "evaluation-eval-harnesses",
        "devops-deployment-foundations",
        "llmops-ai-infrastructure",
        "security-compliance-private-deployment",
        "safety-alignment-literacy"
      ]
    },
    {
      title: "📍 07 · FDE Craft & Landing",
      blurb: "Turn skills into an offer: the consulting muscle, the full-stack gap, the portfolio, the loop.",
      slugs: [
        "discovery-solutioning",
        "full-stack-shipping",
        "capstones-portfolio",
        "interview-positioning"
      ]
    },
    {
      title: "📍 08 · Live Cycle & Deepening",
      blurb: "First applications are in. Run the loop like an engineer — instrument it, learn from every round — and go deep on one thing that makes you unmistakable.",
      slugs: [
        "running-the-interview-loop",
        "pick-a-spike-go-deep-on-one-differentiator",
        "third-capstone-a-frontier-signal-build"
      ]
    },
    {
      title: "📍 09 · Compounding & Second Wave",
      blurb: "Turn the first cycle's signal into leverage: publish, get referred, and reapply from strength — until an offer lands.",
      slugs: [
        "public-presence-technical-storytelling",
        "network-referral-activation",
        "second-wave-decision-point"
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
