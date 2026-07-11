import React, { useState, useEffect, useMemo, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  FDE READINESS — Agentic Engineering Deployment Plan
 *  Noob→expert curriculum tuned to the live Anthropic / OpenAI
 *  Forward Deployed Engineer bar, for a senior Databricks RSA.
 *  Target window: Q1 2027.
 * ------------------------------------------------------------------ */

const C = {
  bg: "#0E1420",
  panel: "#17202E",
  panelHi: "#1E2A3B",
  line: "#26344A",
  ink: "#E7ECF4",
  inkDim: "#95A1B5",
  inkFaint: "#5E6B80",
  teal: "#34D6C1",
  tealSoft: "rgba(52,214,193,0.14)",
  amber: "#F4A93C",
  amberSoft: "rgba(244,169,60,0.14)",
};

// The 5 real FDE competencies the postings screen for. Structure encodes truth.
const SIGNALS = {
  found: { label: "foundations", color: C.inkDim },
  agent: { label: "agent dev", color: C.teal },
  eval: { label: "eval-driven", color: C.teal },
  ship: { label: "full-stack ship", color: C.teal },
  deploy: { label: "secure deploy", color: C.teal },
  discovery: { label: "discovery", color: C.teal },
};

const PHASES = [
  {
    id: "p0",
    tag: "00",
    name: "Calibrate",
    window: "Jul · wk 0–1",
    thesis: "Aim before you run. Map yourself to the real bar and lock your capstones.",
    modules: [
      {
        id: "m0",
        title: "Position against the real FDE bar",
        why: "You clear the experience bar already — the win is knowing exactly which 3 gaps to spend the year on.",
        signals: ["discovery"],
        tag: null,
        critical: true,
        topics: [
          "Read the live Anthropic + OpenAI FDE job descriptions line by line",
          "Map each RSA engagement (Barclays, AIA, Bajaj) to a JD requirement",
          "Write your honest gap list: full-stack TS, formal eval rigor, MCP depth, safety literacy",
          "Decide target teams / geos + confront the visa + relocation reality",
          "Lock your 2 flagship capstones now (Insurance Claims + Post-Trade Recon)",
          "Set a public build cadence (repo + writeup per capstone milestone)",
          "Map the Anthropic + OpenAI product surface (API, Claude Code, Cowork, connectors/MCP) so you can advise build-vs-buy",
        ],
        build: "A one-page FDE readiness scorecard for yourself — you'll re-score it monthly.",
        resources: ["Anthropic + OpenAI live FDE postings", "Your own resume + repo list"],
      },
    ],
  },
  {
    id: "p1",
    tag: "01",
    name: "LLM Foundations",
    window: "Jul – early Aug",
    thesis: "Enough internals to reason about failure modes and whiteboard a transformer. Move fast — you can compress this.",
    modules: [
      {
        id: "m1",
        title: "Math & ML intuition for LLMs",
        why: "You need enough to reason, not to re-derive. Skip the PhD detour.",
        signals: ["found"],
        tag: "compress",
        critical: false,
        topics: [
          "Linear algebra for attention: dot products, matmuls, softmax",
          "Probability & sampling: logits, temperature, top-p / top-k",
          "Gradients & backprop — conceptual, not from scratch",
          "Embeddings as geometry (why nearest-neighbour works)",
          "Next-token objective & cross-entropy loss",
          "Tokenization (BPE, SentencePiece) and where it bites you in production",
        ],
        build: "Tokenizer + softmax attention in ~50 lines of NumPy.",
        resources: ["Karpathy — Neural Networks: Zero to Hero", "3Blue1Brown — neural nets series"],
      },
      {
        id: "m2",
        title: "Transformer architecture",
        why: "Be able to draw it on a whiteboard and explain KV cache & long-context cost.",
        signals: ["found", "eval"],
        tag: "compress",
        critical: false,
        topics: [
          "Self-attention & multi-head attention",
          "Positional encodings (RoPE) and long-context",
          "Decoder-only vs encoder-decoder",
          "Residual streams, layernorm, the block",
          "KV cache; prefill vs decode (why latency behaves as it does)",
          "Decoding strategies: greedy, beam, sampling",
          "Inference internals awareness: Flash Attention, MoE, speculative decoding (drives cost/latency)",
        ],
        build: "Train nanoGPT on a tiny corpus, then annotate the attention maps.",
        resources: ["Attention Is All You Need", "Karpathy — Let's build GPT", "The Illustrated Transformer"],
      },
      {
        id: "m3",
        title: "Model landscape & Hugging Face",
        why: "FDEs must know when NOT to fine-tune. Learn the decision, not just the API.",
        signals: ["found", "ship"],
        tag: null,
        critical: false,
        topics: [
          "Frontier vs open model families & their tradeoffs",
          "HF Hub / Transformers / Datasets ecosystem",
          "Serving OSS models: vLLM / TGI awareness",
          "Quantization intuition (GGUF / AWQ)",
          "Adaptation decision: prompt vs RAG vs fine-tune",
          "LoRA / PEFT + SFT basics — and when fine-tuning is the wrong answer",
        ],
        build: "LoRA-tune a small OSS model on a toy task, then write the 'should we have just prompted?' retro.",
        projects: [{ title: "AI-Powered Content Summarization", url: "https://www.krishnaik.in/project/ai-powered-content-summarization", note: "A HuggingFace/PyTorch build to ground the model-landscape & adaptation choices." }],
        resources: ["Hugging Face LLM Course", "HF Transformers docs"],
      },
      {
        id: "m3t",
        title: "Pretraining, fine-tuning & RL",
        why: "Off the FDE path — you flagged this yourself — but here as first-class depth so you understand how models are actually made and adapted. Pays off as credibility in deep technical conversations. Not counted toward your readiness %.",
        signals: ["found"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "① Pretraining — objective, data pipelines, scaling laws (Chinchilla)",
          "Tokenization & data curation at scale; compute / cost of a training run",
          "Distributed training: data / tensor / pipeline parallelism (awareness)",
          "② Fine-tuning — SFT / instruction tuning",
          "Parameter-efficient FT: LoRA, QLoRA, adapters",
          "Full FT vs PEFT vs prompt / RAG — the adaptation decision",
          "Distillation & quantization for deployment",
          "Data prep for a fine-tune; how to eval whether it actually helped",
          "③ RL & alignment — RLHF (reward model + PPO)",
          "RLAIF & Constitutional AI",
          "DPO & preference optimization (simpler alternatives to PPO)",
          "Reward hacking, over-optimization & alignment pitfalls",
          "When fine-tuning / RL is the wrong tool (usually — for an FDE)",
        ],
        build: "LoRA-fine-tune a small OSS model, then run DPO on a small preference set; write up when this beats prompting/RAG (usually it doesn't).",
        projects: [{ title: "AI-Powered Web App with LLM Fine-Tuning", url: "https://www.krishnaik.in/project/bs", note: "Actually fine-tune an LLM end-to-end — the optional depth made concrete." }],
        resources: ["Hugging Face TRL + PEFT docs", "RLHF / DPO papers; Karpathy on LLM training"],
      },
    ],
  },
  {
    id: "p2",
    tag: "02",
    name: "Context, Retrieval & RAG",
    window: "August",
    thesis: "Retrieval quality is almost always the real bottleneck. Learn to measure it, not vibe it.",
    modules: [
      {
        id: "m4",
        title: "Prompt & context engineering",
        why: "Context engineering is the actual craft behind every 'prompt' — and behind middleware/harnesses later.",
        signals: ["ship", "eval"],
        tag: null,
        critical: false,
        topics: [
          "System / developer / user roles & message design",
          "Few-shot & example selection",
          "Structured outputs: JSON schema, constrained decoding",
          "Tool-use prompting & decomposition (CoT, plan-then-act)",
          "Prompt caching & context-window budgeting / compression",
          "Prompt versioning (treat prompts like code)",
          "XML prompting (Claude-specific) & structured prompt formats",
          "Reasoning models & extended thinking: CoT / ToT, and when to reach for one",
        ],
        build: "A versioned prompt library + a schema-validated structured extractor.",
        projects: [{ title: "Telegram Chatbot (stateful context)", url: "https://www.krishnaik.in/project/zomato-chatbot-using-chainlit", note: "Context injection across turns — minimal prompt/context engineering." }],
        resources: ["Anthropic prompt engineering docs", "OpenAI structured outputs docs"],
      },
      {
        id: "m5",
        title: "Embeddings & vector databases",
        why: "You'll be asked to justify a retrieval stack to a client. Know the index tradeoffs cold.",
        signals: ["ship", "deploy"],
        tag: null,
        critical: false,
        topics: [
          "Embedding models & tradeoffs; cosine / dot / L2",
          "Chunking strategies (fixed, semantic, hierarchical)",
          "ANN indexes: HNSW, IVF, PQ",
          "pgvector vs Pinecone vs Weaviate vs Qdrant / Milvus / FAISS / Chroma / Databricks Vector Search",
          "Metadata filtering & hybrid search (BM25 + dense)",
          "Scaling, freshness, and cost of a vector store",
        ],
        build: "Index a real corpus in pgvector + one managed store; benchmark recall / latency / cost.",
        projects: [{ title: "End-to-End Medical Chatbot (Pinecone RAG)", url: "https://www.krishnaik.in/project/end-to-end-medical-chatbot", note: "Embeddings to a Pinecone vector store to retrieval — the vector-DB layer hands-on." }, { title: "Knowledge Intelligence System (RAG)", url: "https://www.krishnaik.in/project/knowledge-intelligence-system", note: "Ingest/organize/search internal docs over a vector layer." }],
        resources: ["pgvector docs", "Vendor docs for one managed store"],
      },
      {
        id: "m6",
        title: "RAG: naive → production",
        why: "Everyone builds a demo RAG. FDEs build one that cites, grounds, and stays fresh.",
        signals: ["eval", "deploy"],
        tag: null,
        critical: false,
        topics: [
          "The RAG loop & why retrieval is the bottleneck",
          "Reranking (cross-encoders / rerank APIs)",
          "Citations & grounding enforcement",
          "Chunk / window tradeoffs & parent-child retrieval in practice",
          "Freshness & incremental indexing",
          "Failure taxonomy: retrieval error vs generation error",
        ],
        build: "Production RAG over your own domain docs, with inline citations.",
        projects: [{ title: "RAG-Based Document Search Application", url: "https://www.krishnaik.in/project/building-a-rag-based-document-search-application", note: "Chat-with-your-docs taken from naive to production/modular." }, { title: "Flipkart Recommender Chatbot (RAG)", url: "https://www.krishnaik.in/project/flipkart-product-recommender-chatbot-with-rag", note: "Production RAG chatbot with microservices + Grafana/Prometheus." }, { title: "Air India RAG Chatbot (Bedrock)", url: "https://www.krishnaik.in/project/air-india-rag-chatbot-development", note: "Baseline RAG on AWS Bedrock — a simpler contrast to the advanced build." }],
        resources: ["Anthropic contextual retrieval writeup", "LangChain RAG docs"],
      },
      {
        id: "m7",
        title: "Advanced RAG & GraphRAG",
        why: "Multi-hop and entity-graph retrieval is where enterprise questions actually live.",
        signals: ["eval", "agent"],
        tag: null,
        critical: false,
        topics: [
          "Query transformation: rewriting, HyDE, decomposition, fusion (RRF)",
          "Multi-hop & iterative retrieval",
          "Named variants: RAPTOR, Self-RAG, CRAG (corrective), adaptive RAG — when each applies",
          "Agentic RAG (retrieval as a tool the agent calls)",
          "GraphRAG: entity / community graphs (incl. LightRAG) — when it beats vector RAG",
          "RAG evaluation with ragas (faithfulness, context precision/recall)",
        ],
        build: "A/B a baseline RAG vs GraphRAG on a multi-hop question set; report with ragas.",
        projects: [{ title: "Enterprise Advanced RAG (HyDE, CRAG, Self-RAG, Text2SQL, Guardrails)", url: "https://www.krishnaik.in/project/enterprise-advanced-rag-with-hybrid-search-reranking-hyde-crag-self-rag-text2sql-caching-and-guardrails-in-langgraph", note: "Builds nearly every advanced-RAG variant in this module, in one LangGraph system." }, { title: "Neural-Semantic Job Matching (LLM + MCP)", url: "https://www.krishnaik.in/project/neural-semantic-matching-protocol-for-real-time-job-interoperability", note: "Semantic matching over meaning/context, not keywords." }],
        resources: ["Microsoft GraphRAG", "ragas docs"],
      },
      {
        id: "m7b",
        title: "Multimodal & document intelligence",
        why: "Your capstones (insurance claims, post-trade) are document-heavy — scanned PDFs, tables, forms. Enterprise RAG lives or dies here, and it's thin in most roadmaps.",
        signals: ["ship", "eval"],
        tag: null,
        critical: true,
        topics: [
          "Multimodal models: vision, PDF, audio inputs",
          "Document parsing & layout understanding",
          "OCR for scanned / low-quality documents",
          "Table & form extraction into structured data",
          "Vision RAG / multimodal RAG over document images",
          "Text-to-SQL / SQL RAG (your Genie domain); Code RAG over repos",
          "Evaluating extraction accuracy (field-level, not vibes)",
        ],
        build: "A document-intelligence pipeline over claims or trade docs: parse → extract → structure → eval field-level accuracy. Feeds your Insurance Claims capstone.",
        projects: [{ title: "Azure Multi-Modal Compliance QA (LangGraph)", url: "https://www.krishnaik.in/project/azure-video-compliance-qa-pipeline-with-langgraph", note: "Multimodal ingestion (OCR/transcripts) + compliance — mirrors your regulated-doc capstones." }],
        resources: ["Provider vision/PDF docs (Claude, GPT)", "Doc parsing libs (docling, unstructured)"],
      },
    ],
  },
  {
    id: "p3",
    tag: "03",
    name: "Agents — the core",
    window: "late Aug – Oct",
    thesis: "Spend the most time here. This is the job. Go from 'calls tools in a loop' to reliable, controllable systems.",
    modules: [
      {
        id: "m8",
        title: "Agent fundamentals & tool use",
        why: "Build an agent by hand — the raw model-tool loop — before any framework hides it. This is the muscle that lets you debug an agent in a client's production system.",
        signals: ["agent", "ship", "eval"],
        tag: null,
        critical: true,
        topics: [
          "What 'agentic' actually means; the ReAct model-tool loop",
          "Function / tool calling: single, parallel, forced",
          "Structured tool schemas & argument validation",
          "Writing the loop by hand: dispatch, stop conditions, step caps",
          "Planning, reflection, retries & error recovery",
          "The '5/10 reliability is useless' problem — designing for consistency",
          "You own tool execution — so you own the security surface",
        ],
        build: "Hand-write the agent loop with no framework — tool schemas, dispatch, error handling, a step cap. (You'll standardize these tools as MCP servers later in this phase.)",
        projects: [{ title: "Notion ReAct Planner Agent", url: "https://www.krishnaik.in/project/notion-react-planner-agent", note: "A ReAct tool-calling agent — the loop and tool use made real." }, { title: "Candidate Interview & Evaluation Agent", url: "https://www.krishnaik.in/project/automated-candidate-interview-evaluation-system", note: "Autonomous agent that perceives, decides, and synthesizes." }],
        resources: ["Anthropic — Building effective agents", "Messages API tool-use docs"],
      },
      {
        id: "m8p",
        title: "Workflow & agent patterns",
        why: "Single-system patterns: how to structure one agent or workflow, and the FDE's core judgment call — does this even need an agent, or just a fixed workflow? (Multi-agent coordination patterns — supervisor, swarm, handoffs — live in Multi-agent orchestration below.)",
        signals: ["agent", "discovery"],
        tag: null,
        critical: true,
        topics: [
          "Workflows vs agents — when autonomy is worth the unpredictability",
          "Augmented LLM (tool use + retrieval + memory) as the base building block",
          "Prompt chaining (decompose into fixed steps)",
          "Routing / classification (send input down the right path)",
          "Parallelization: sectioning & voting",
          "Orchestrator–workers (dynamic subtask delegation)",
          "Evaluator–optimizer loop (generate → critique → refine)",
          "Reflection & self-critique; ReAct; Plan-and-Execute",
          "Agentic RAG: your Phase-02 retrieval becomes a tool the agent invokes, reformulates & iterates on — not a fixed step",
          "Pick the simplest pattern that works — resist over-agenting (FDE anti-pattern)",
        ],
        build: "Take one accelerator use case, map it to 2–3 candidate patterns, and write the 'why this one' memo — the exact decision you'll defend in an interview.",
        projects: [{ title: "Autonomous Blog Generation Agent (LangGraph DAG)", url: "https://www.krishnaik.in/project/production-grade-content-generation-engine-with-langgraph-fastapi-and-uv", note: "Workflow/DAG patterns with specialized agents + a router." }, { title: "Personalized Holiday Management Agent", url: "https://www.krishnaik.in/project/personalized-holiday-management-agent", note: "Phased planning + specialized agents with real-time validation." }],
        resources: ["Anthropic — Building effective agents", "DeepLearning.AI — agentic design patterns"],
      },
      {
        id: "m9s",
        title: "Agent SDKs (first-party / lab)",
        why: "The loop you hand-built in fundamentals — done right by the people who made the model. For an Anthropic/OpenAI FDE these are the house tools you'll actually deploy: closest to the loop, minimal abstraction.",
        signals: ["agent", "ship"],
        tag: null,
        critical: true,
        topics: [
          "Claude Agent SDK — the harness behind Claude Code, as a library",
          "OpenAI Agents SDK — agents, handoffs, guardrails, sessions",
          "How each wraps your raw loop: what they add, what they hide",
          "Tool use, structured outputs & MCP through the SDK — MCP covered in depth after Memory",
          "Sessions, state & memory primitives the SDK gives you",
          "When the first-party SDK is enough (and you don't need an orchestration framework)",
        ],
        build: "Rebuild your fundamentals loop with the Claude Agent SDK and the OpenAI Agents SDK; note exactly what each one removed.",
        projects: [{ title: "Google ADK: Build & Deploy AI Agents", url: "https://www.krishnaik.in/project/google-adk-build-ai-agents-and-deploy-to-the-cloud", note: "A first-party agent SDK (Google ADK) end-to-end — the SDK tier." }],
        resources: ["Claude Agent SDK docs", "OpenAI Agents SDK docs"],
      },
      {
        id: "m9",
        title: "Orchestration frameworks",
        why: "Higher-level frameworks that manage the loop, state, and multi-step control for you. The FDE skill: knowing which tier a problem needs — and when to drop the framework and write the loop yourself.",
        signals: ["agent", "ship"],
        tag: null,
        critical: true,
        topics: [
          "LangChain 1.0 + Middleware (before_model / after_model, HITL, summarization)",
          "LangGraph: state, nodes, edges, checkpointing, durable execution",
          "CrewAI (role-based crews) & AutoGen (conversable agents)",
          "DSPy: programmatic prompting & optimization",
          "How to choose your tier — and when to abandon the abstraction",
          "OSS agent landscape: Hermes Agent (Nous), OpenClaw — know them well enough to compare, not to adopt",
          "Also on the board: PydanticAI (type-safe), LlamaIndex Workflows, SmolAgents, Semantic Kernel, Haystack",
        ],
        build: "Implement the SAME agent three ways — raw loop, a lab SDK, LangGraph — and write the tradeoff memo across all three tiers.",
        projects: [{ title: "Stateful Agentic AI with LangGraph + Llama 3", url: "https://www.krishnaik.in/project/building-stateful-agentic-ai-with-langgraph-and-llama-3", note: "LangGraph orchestration: state, tools, deployment." }, { title: "AutoGen Data Analyzer GPT", url: "https://www.krishnaik.in/project/autogen-data-analyzer-gpt-build-an-ai-powered-data-analysis-system", note: "AutoGen multi-agent team over CSV data — a framework alternate." }, { title: "Gen AI Clothing Store (Pydantic AI)", url: "https://www.krishnaik.in/project/gen-ai-powered-clothing-store-with-pydantic-ai", note: "PydanticAI agent — a type-safe framework alternate." }],
        resources: ["LangChain 1.0 middleware blog", "LangGraph docs"],
      },
      {
        id: "m10m",
        title: "Memory & state",
        why: "Long-running production agents live or die on memory. You already built genie_memory.py — this turns that instinct into a rigorous, evaluated layer.",
        signals: ["agent", "ship"],
        tag: null,
        critical: true,
        topics: [
          "Short-term (scratchpad / context) vs long-term memory",
          "Memory types: episodic, semantic, procedural",
          "Session / conversation memory vs persistent knowledge",
          "Vector-backed memory: retrieval, relevance + recency, consolidation",
          "Writing, updating, summarizing & forgetting memory",
          "State & checkpointing (LangGraph checkpointers / store)",
          "File-based memory: AGENTS.md / CLAUDE.md (deepagents, Claude Code)",
          "Memory frameworks: mem0, Letta / MemGPT, Zep — tradeoffs",
          "Evaluating memory: does recall actually raise task success?",
          "Case study: how Hermes Agent (Nous) does persistent memory + autonomously-generated skills",
        ],
        build: "Add a two-tier memory layer (short + long-term store) to one agent and eval whether it improves multi-session task success — building directly on your genie_memory.py.",
        projects: [{ title: "Insurance Claims Copilot (LangMem + RAG)", url: "https://www.krishnaik.in/project/insurance-claims-copilot-with-memory-and-tool-calling", note: "Memory + tool calling in your insurance vertical — doubles as a capstone seed." }, { title: "AI Customer Support Agent (Memory + Tools)", url: "https://www.krishnaik.in/project/ai-powered-customer-support-agent-with-memory-and-tool-calling", note: "Alt memory build: Mem0 + RAG + CRM/billing tool calls." }],
        resources: ["LangGraph memory & persistence docs", "mem0 / Letta docs"],
      },
      {
        id: "m8mcp",
        title: "MCP (Model Context Protocol)",
        why: "Your agent can now reason, orchestrate, and remember — MCP is how it reaches the outside world through one standard interface. The inline tools from fundamentals become reusable, secure servers any agent or lab SDK can consume. For an Anthropic FDE, close to a house skill.",
        signals: ["agent", "ship", "deploy"],
        tag: null,
        critical: true,
        topics: [
          "The protocol: servers, clients, tools, resources, prompts",
          "Transports: stdio, SSE, streamable HTTP; local vs remote MCP",
          "Building custom MCP servers (expose your own tools & data)",
          "MCP clients: how agents and the lab SDKs consume servers",
          "Auth & security: the MCP attack surface, scoping, sandboxing",
          "The ecosystem: filesystem, GitHub, browser, database — and Databricks MCP (your domain)",
          "When MCP earns its keep vs. inline tools",
        ],
        build: "Build an MCP server exposing 3 tools (one over a real data source) + wire it into your memory-backed agent — extend your Clone-Xs / dev-mcp work.",
        projects: [{ title: "MCP with AutoGen (Notion integration)", url: "https://www.krishnaik.in/project/mcp-with-autogen-integrating-ai-agents-with-notion", note: "Stand up MCP and connect an agent to a real workspace." }, { title: "Medical Diagnosis App (FastMCP)", url: "https://www.krishnaik.in/project/medical-diagnosis-app", note: "An MCP alternate built on FastMCP." }],
        resources: ["MCP specification & docs", "Anthropic MCP announcement + reference servers"],
      },
      {
        id: "m11",
        title: "Multi-agent orchestration & control",
        why: "Knowing when multi-agent is overkill is as valuable as building one.",
        signals: ["agent", "deploy"],
        tag: null,
        critical: false,
        topics: [
          "When multi-agent actually helps (and when a single agent wins)",
          "Supervisor / swarm / handoff patterns",
          "Shared state & memory across agents",
          "Human-in-the-loop: approvals & interrupts",
          "Guardrails, tool permissions & sandboxing",
          "Cost & latency of multi-agent systems",
        ],
        build: "A supervised multi-agent workflow (e.g. claims triage) with HITL approval gates.",
        projects: [{ title: "AI GitHub PR Code Reviewer (multi-agent)", url: "https://www.krishnaik.in/project/lfnm", note: "Four parallel review agents merged into one verdict — multi-agent, production-grade." }, { title: "SwarmAI Multi-Agent Personal Assistant", url: "https://www.krishnaik.in/project/swarmai-build-a-multi-agent-personal-assistant", note: "Specialized agents collaborating across email/calendar/research." }],
        resources: ["LangGraph multi-agent docs", "Anthropic multi-agent research writeup"],
      },
      {
        id: "m10",
        title: "Deep agents & harness engineering",
        why: "The scaffolding around the model — tools, memory, sub-agents, context — is where long-horizon reliability is won or lost. It's last on purpose: it composes everything before it.",
        signals: ["agent", "ship"],
        tag: null,
        critical: true,
        topics: [
          "Context engineering as the real discipline",
          "The harness = tools + memory + filesystem + sub-agents + context mgmt",
          "deepagents: planning todo tool, sub-agent delegation, skills, memory, harness profiles, backends",
          "Claude Code mastery: CLAUDE.md, commands, skills, subagents, hooks (go operator-deep past your cert)",
          "AI-coding-tool landscape: Cursor, Codex, Aider, Windsurf, Cline, Roo Code — know them to compare, not adopt",
          "Deep research agents: long-horizon, multi-source synthesis",
          "Durable / long-running agents & checkpointing",
          "Computer use & browser agents (powers Cowork; a major 2026 pattern)",
        ],
        build: "A deep-research agent with sub-agents + memory over a domain — or a Claude Code skill+subagent pipeline for a real PS workflow.",
        projects: [{ title: "Realtime Source Code Analyzer", url: "https://www.krishnaik.in/project/realtime-source-code-analyzer", note: "Repo-indexing code agent — adjacent to the coding-agent/harness theme." }],
        resources: ["LangChain Deep Agents docs", "Claude Code docs", "Deep Agents vs Claude Agent SDK comparison"],
      },
    ],
  },
  {
    id: "p4",
    tag: "04",
    name: "Production & FDE Differentiators",
    window: "Oct – Nov",
    thesis: "This phase is where the offer is decided. Evals, ops, and your governance moat.",
    modules: [
      {
        id: "m12",
        title: "Evaluation & eval harnesses",
        why: "THE 2026 non-negotiable. If you build one world-class artifact this year, make it this.",
        signals: ["eval", "discovery"],
        tag: "gap",
        critical: true,
        topics: [
          "Why evals are the demo→prod gap-closer (FDE framing)",
          "Taxonomy: offline vs online, component vs end-to-end, reference-based vs free",
          "LLM-as-judge: rubrics, pairwise, bias & mitigation",
          "Building eval datasets from real traffic",
          "Regression suites & CI gates for nondeterministic systems",
          "Agent-specific eval: trajectory, tool-call correctness, task success",
          "Hallucination / grounding / faithfulness metrics",
          "Red-teaming & adversarial evals",
          "Tooling: LangSmith, Braintrust, promptfoo, DeepEval, ragas",
          "Synthetic data generation for eval sets",
          "Trace replay & failure harnesses (replay prod traces to catch regressions)",
        ],
        build: "GenieBench — a real eval harness for one of your agents: dataset, LLM-judge, regression gate, dashboard. Your most FDE-credible artifact.",
        projects: [{ title: "Anime Recommender w/ LLM-as-Judge + LangSmith", url: "https://www.krishnaik.in/project/anibaba-ai-powered-anime-recommendation-system", note: "LLM-as-judge evaluation + tracing — the eval discipline in practice." }, { title: "AI Travel Planner (GCP + ELK + DeepEval)", url: "https://www.krishnaik.in/project/ai-powered-travel-itinerary-planner", note: "Eval alternate: a full LLMOps pipeline scored with DeepEval." }],
        resources: ["Hamel Husain — evals writing", "LangSmith / Braintrust eval docs", "ragas"],
      },
      {
        id: "m13d",
        title: "DevOps & deployment foundations",
        why: "FDEs deploy AI into a client's environment — so containerizing, shipping, and running it reliably is part of the job, not someone else's. You flagged this as a gap, so it's scheduled here at FDE-working-level (deep SRE / platform depth stays optional in mo5).",
        signals: ["deploy", "ship"],
        tag: "gap",
        critical: true,
        topics: [
          "Containerization: Docker images, multi-stage builds, docker-compose",
          "Kubernetes essentials: pods, deployments, services, scaling (working level)",
          "CI/CD pipelines: GitHub Actions — build, test, deploy on push",
          "Infrastructure as Code: Terraform basics (providers, state, modules)",
          "Cloud deploy end-to-end: pick one — AWS ECS / GCP Cloud Run / Azure",
          "Secrets, config & environment promotion (dev → staging → prod)",
          "Observability basics: logs, metrics, health checks (Prometheus / Grafana)",
          "Deploy an AI app into a client-like environment — the FDE reality",
        ],
        build: "Containerize one of your agents and ship it end-to-end: Dockerfile → GitHub Actions CI/CD → Terraform-provisioned cloud deploy, with health checks and a rollback path.",
        projects: [
          { title: "MLOps Jenkins Shared Library CI/CD", url: "https://www.krishnaik.in/project/nknk", note: "A reusable CI/CD pipeline: Docker build → Kubernetes deploy on GCP." },
          { title: "YouTube SEO — Jenkins, ArgoCD & Kubernetes", url: "https://www.krishnaik.in/project/cnxm", note: "GitOps: ship an app to K8s with Jenkins + Argo CD." },
          { title: "AWS Cost Optimizer (Terraform, Lambda, API Gateway)", url: "https://www.krishnaik.in/project/kjckx", note: "Infrastructure as Code + serverless, end-to-end." },
          { title: "AI Image Analyzer (Terraform, Bedrock, Lambda, S3)", url: "https://www.krishnaik.in/project/dnskc", note: "IaC-deployed cloud AI app — Terraform from scratch." },
          { title: "Kubernetes Pen Testing & Benchmarking", url: "https://www.krishnaik.in/project/nmn", note: "Harden a K8s cluster (KubeHunter / KubeBench) — deployment security." },
          { title: "AWS Threat Detection (GuardDuty, Lambda, SNS)", url: "https://www.krishnaik.in/project/jn", note: "Event-driven serverless incident-response pipeline." },
          { title: "AI Job Analyzer (Filebeat, ELK, Kubernetes)", url: "https://www.krishnaik.in/project/fmlml", note: "Full ELK observability stack on a K8s deployment." },
        ],
        resources: ["Docker docs", "kubectl basics / Kubernetes docs", "Terraform docs", "GitHub Actions docs"],
      },
      {
        id: "m13",
        title: "LLMOps & AI infrastructure",
        why: "Rate limiting, gateways, tracing, cost/latency — the unglamorous stuff that makes deployments survive contact with production.",
        signals: ["deploy", "ship"],
        tag: "gap",
        critical: true,
        topics: [
          "Serving & inference: latency, throughput, batching",
          "LLM gateways & model routing (fallbacks, multi-provider, load balancing)",
          "Observability & tracing (LangSmith, OpenTelemetry-GenAI)",
          "Prompt / agent versioning & deploys",
          "Caching: prompt & semantic (Redis / semantic cache store)",
          "Rate limiting: token buckets, provider limits, backoff, queueing, concurrency",
          "Cost & latency optimization",
          "CI/CD for prompts & agents; SLOs for nondeterministic systems",
          "Deployment strategies: canary, rollback, feature flags; circuit breakers, HA / disaster recovery",
          "Drift & regression monitoring in production",
          "Self-hosted / on-prem model serving: vLLM, GPU, containers (Docker), autoscaling — ties to your VPC moat",
        ],
        build: "Put an agent behind a gateway with tracing, semantic cache, rate limiting + a cost/latency dashboard.",
        projects: [{ title: "Production RAG: Guardrails, LLM Gateway, Evals, IaC (GCP)", url: "https://www.krishnaik.in/project/production-grade-cyclic-rag-with-langgraph-gcp-and-groq", note: "LLM gateway, guardrails, Terraform/IaC, microservices — the ops layer." }],
        resources: ["LiteLLM / gateway docs", "LangSmith tracing", "Provider rate-limit docs"],
      },
      {
        id: "m14",
        title: "Security, compliance & private deployment",
        why: "This is YOUR moat. Barclays/AIA VPC + Unity Catalog governance is exactly what banks pay FDEs for. Package it.",
        signals: ["deploy", "discovery"],
        tag: "strength",
        critical: true,
        topics: [
          "Prompt injection & jailbreaks: direct & indirect defenses",
          "Data governance, PII, secrets handling; data-poisoning awareness",
          "Tool / permission sandboxing",
          "Guardrails: input/output filtering, PII redaction",
          "On-prem / VPC / Private Link deployment (already yours — formalize it)",
          "Model risk, audit & compliance in regulated verticals",
          "Tenant isolation & multi-tenant safety",
        ],
        build: "Threat-model an accelerator + implement injection defenses & PII redaction; write 'Deploying Claude inside a bank's VPC' as a reference doc.",
        resources: ["OWASP LLM Top 10", "Your own VNet/Private Link/UC governance experience"],
      },
      {
        id: "m15",
        title: "Safety & alignment literacy",
        why: "Anthropic culture-fit signal. You don't need to be a researcher — you need to talk about it credibly.",
        signals: ["discovery"],
        tag: "gap",
        critical: false,
        topics: [
          "Why safety is commercial, not just ethical",
          "Core concepts: RLHF, Constitutional AI, responsible scaling — at a literate level",
          "How safety shows up in deployment: refusals, misuse, guardrails",
          "Being able to discuss it in an Anthropic interview loop",
        ],
        build: "A short written POV: 'How I'd deploy a frontier model safely in a regulated enterprise.'",
        resources: ["Anthropic — Constitutional AI & RSP posts", "Anthropic transparency hub"],
      },
    ],
  },
  {
    id: "p5",
    tag: "05",
    name: "FDE Craft & Landing",
    window: "Nov – Q1 2027",
    thesis: "Turn skills into an offer: the consulting muscle, the full-stack gap, the portfolio, the loop.",
    modules: [
      {
        id: "m16",
        title: "Discovery & solutioning",
        why: "The actual FDE job: ambiguous business ask → technical roadmap. The interview tests exactly this.",
        signals: ["discovery"],
        tag: "strength",
        critical: true,
        topics: [
          "Ambiguous ask → technical roadmap (your RSA superpower, sharpened)",
          "Scoping POC vs production; sequencing scope/speed/quality tradeoffs",
          "Success metrics & eval-driven acceptance criteria",
          "Stakeholder mapping & exec-level communication",
          "Writing SOWs / technical proposals (you already do this)",
          "Codifying repeatable patterns — the FDE feedback loop to product",
          "Build-custom vs deploy a product (Claude Cowork / Claude Code): the buy-vs-build call",
        ],
        build: "Timeboxed 90-min drill: vague prompt ('automate supply-chain compliance with Claude') → discovery doc + roadmap + eval plan.",
        resources: ["Your PS SOW / effort-estimator work", "FDE interview writeups"],
      },
      {
        id: "m17",
        title: "Full-stack shipping",
        why: "Your biggest gap coming from a Python/data world. OpenAI wants frontend AND backend, production-grade.",
        signals: ["ship"],
        tag: "gap",
        critical: true,
        topics: [
          "TypeScript fundamentals for a Python-first engineer",
          "React + Next.js essentials",
          "Streaming UIs: SSE, token streaming, tool-call rendering",
          "FastAPI backends & clean API design",
          "Auth: OAuth, M2M (you've touched this on Databricks Apps)",
          "Deploy: Vercel / Fly / containers",
          "Calling LLM APIs from both TS and Python",
          "Async / concurrency patterns for LLM apps (parallel calls, streaming, backpressure)",
          "Testing & mocking nondeterministic LLM/agent code; Pydantic for typed I/O",
        ],
        build: "Rebuild one accelerator's front-end in Next.js with streaming; ship it publicly.",
        projects: [{ title: "Real-Time Voice AI Agent (FastAPI + React + AWS)", url: "https://www.krishnaik.in/project/real-time-voice-ai-agent-with-rag-and-low-latency-voice-processing", note: "Full-stack: React front-end, FastAPI back-end, cloud deploy." }, { title: "Resume Genie Career Suite", url: "https://www.krishnaik.in/project/resume-genie-an-ai-powered-career-suite", note: "A simpler full-stack Streamlit app on AWS EC2." }],
        resources: ["Next.js docs", "Vercel AI SDK", "FastAPI docs"],
      },
      {
        id: "m18",
        title: "Capstones & portfolio",
        why: "Proof over claims. Two polished, eval-backed builds beat any certificate.",
        signals: ["agent", "eval", "ship", "deploy", "discovery"],
        tag: null,
        critical: true,
        topics: [
          "Capstone A — Insurance Claims Intelligence Agent (end-to-end + evals + private-deploy story)",
          "Capstone B — Banking Post-Trade Reconciliation Agent (your Barclays domain: ambiguity→roadmap→build→eval)",
          "Capstone C (optional) — GenieBench as an open eval harness / OSS",
          "Each: public repo + README + short demo + eval report",
          "Anonymize ALL client detail (you already flag this — hold the line)",
          "One meaningful OSS contribution (LangGraph, MCP SDK, DSPy, or a Databricks AI repo) — visible proof you work in frontier codebases",
        ],
        build: "2 flagship capstones live, with eval dashboards + a written 'deployment story' for each.",
        projects: [{ title: "Multi-Agent Quantitative Analysis System", url: "https://www.krishnaik.in/project/multi-agent-quantitative-analysis-system-with-azure-cloud-integration", note: "Finance multi-agent + reporting — a Post-Trade-Recon-flavored capstone." }],
        resources: ["Your Auto-Genie Accelerator / PSINNOV-978 assets", "Your GitHub"],
      },
      {
        id: "m19",
        title: "Interview & positioning",
        why: "Package everything into an offer. Your Databricks network is a referral goldmine into partner FDE pods.",
        signals: ["discovery", "ship"],
        tag: null,
        critical: true,
        topics: [
          "Resume tuned to FDE language: shipped production LLM systems + evals + governance",
          "GitHub + LinkedIn as your FDE shopfront",
          "The FDE loop: ambiguity/deployment thinking, take-home build, AI system design, discovery role-play, values",
          "Mock discovery + mock build reviews with a peer",
          "Referrals: Databricks network → Anthropic/OpenAI + partner FDE pods (Deloitte etc.)",
          "Apply Q1 2027 with 2 capstones already live",
          "AI system-design reps: design a RAG platform, a deep-research agent, a multi-agent orchestration, a GraphRAG system",
          "Behavioral: driving ambiguous projects, customer influence, technical storytelling",
        ],
        build: "A full mock FDE loop with a peer + a tightened resume + a 20-company target shortlist.",
        projects: [{ title: "Pipecat AI Interview Coach (real-time voice)", url: "https://www.krishnaik.in/project/pipecat-ai-interview-coach-real-time-voice-interaction", note: "Build an AI interviewer to practice against while you prep." }],
        resources: ["Live FDE JDs (re-read)", "Your reformatted resume"],
      },
    ],
  },
  {
    id: "p6",
    tag: "06",
    name: "Live Cycle & Deepening",
    window: "Feb – Apr 2027",
    thesis: "First applications are in. Run the loop like an engineer — instrument it, learn from every round — and go deep on one thing that makes you unmistakable.",
    modules: [
      {
        id: "m20",
        title: "Running the interview loop",
        why: "Treat the loop as a system with feedback, not a string of one-shots. Every round should sharpen the next.",
        signals: ["discovery"],
        tag: null,
        critical: true,
        topics: [
          "Instrument every round: what was asked, where you stalled, what follow-ups came",
          "Post-mortem each loop into a concrete fix list",
          "Rehearse the take-home build under real time pressure",
          "Tighten discovery / ambiguity role-plays (the actual FDE screen)",
          "Manage process & timing across parallel pipelines",
          "Keep a live pipeline tracker (stage, contact, next action)",
        ],
        build: "An interview-loop retro doc that converts each round into 2–3 specific fixes.",
        resources: ["Your Phase 05 mock-loop notes", "FDE interview writeups"],
      },
      {
        id: "m21",
        title: "Pick a spike — go deep on one differentiator",
        why: "Generalists are common. One area of genuine, five-layers-deep expertise is what interviewers remember.",
        signals: ["eval", "deploy"],
        tag: null,
        critical: true,
        topics: [
          "Choose your spike: eval methodology, agent reliability/harness, or regulated-vertical deployment (your moat)",
          "Read primary sources + source code, not just docs",
          "Reproduce a hard result end-to-end",
          "Write the definitive explainer others would cite",
          "Be able to go five layers deep when probed",
        ],
        build: "A deep-dive artifact (repo + writeup) in your spike — e.g. an agent-reliability or eval methodology others reference.",
        resources: ["Primary papers / source repos in your spike", "Your GenieBench harness"],
      },
      {
        id: "m22",
        title: "Third capstone — a frontier-signal build",
        why: "A third, more ambitious build shipped while you interview shows range and momentum — not a portfolio you finished months ago.",
        signals: ["agent", "eval", "ship"],
        tag: null,
        critical: false,
        topics: [
          "Pick a stretch build: computer-use agent, multi-agent platform w/ observability, or an autonomous data-eng agent",
          "Production-grade: evals + deploy story from day one",
          "Build in public — document as you go",
          "Tie it to your spike so depth and portfolio compound",
        ],
        build: "Third capstone live with an eval report and a 'what broke and how I fixed it' writeup.",
        resources: ["Your Clone-Xs / Auto-Genie assets", "Your GitHub"],
      },
    ],
  },
  {
    id: "p7",
    tag: "07",
    name: "Compounding & Second Wave",
    window: "May – Jul 2027",
    thesis: "Turn the first cycle's signal into leverage: publish, get referred, and reapply from strength — until an offer lands.",
    modules: [
      {
        id: "m23",
        title: "Public presence & technical storytelling",
        why: "The FDE bar explicitly values codifying patterns and technical storytelling — and this doubles as the YouTube/consulting channel you're already planning.",
        signals: ["discovery"],
        tag: null,
        critical: true,
        topics: [
          "Launch your production-war-stories content (channel/blog) — fully anonymized",
          "Turn each capstone + your spike into a talk or post",
          "Do a meetup talk or a conference CFP",
          "Build the 'teach it to prove it' habit",
          "Keep client confidentiality & anonymization airtight",
        ],
        build: "3–5 published artifacts (posts / videos / a talk) that show senior-depth thinking.",
        projects: [{ title: "YouTube Content Creation Agent", url: "https://www.krishnaik.in/project/youtube-content-creation-storyforge-agent", note: "Dogfood your own channel: an agent that scripts short-form video." }],
        resources: ["Your planned 10-video launch slate", "Your linkedin-viral skill"],
      },
      {
        id: "m24",
        title: "Network & referral activation",
        why: "Your Databricks network is a direct line into Anthropic/OpenAI and partner FDE pods — a referral beats a cold application every time.",
        signals: ["discovery"],
        tag: null,
        critical: true,
        topics: [
          "Map warm paths: ex-colleagues now at labs or partners",
          "Reconnect authentically before you ask for anything",
          "Get referred, not cold-applied",
          "Work the partner-pod route (Deloitte & other badged FDE teams)",
          "Rank a second-wave target list with role-fit reasoning",
        ],
        build: "5+ warm referral conversations + a ranked second-wave target list.",
        resources: ["Your Databricks / EMEA network", "LinkedIn (Sales Navigator if you go that route)"],
      },
      {
        id: "m25",
        title: "Second wave & decision point",
        why: "Reapply from strength, and set an honest checkpoint so July 2027 is a decision, not a drift.",
        signals: ["discovery"],
        tag: null,
        critical: true,
        topics: [
          "Reapply with sharpened portfolio + referrals behind you",
          "Resolve the geo/route call: US relo vs EMEA/APAC vs partner pod (flagged back in Phase 0)",
          "July 2027 honest reassessment: offer in hand, or adjust the plan",
          "Keep the consulting track alive as a parallel path (your 2026 freelance goals)",
        ],
        build: "Second-wave applications submitted + a written 'where I am / next move' decision at July 2027.",
        resources: ["Your Phase 0 readiness scorecard (re-score)", "Live FDE postings"],
      },
    ],
  },
  {
    id: "p8",
    tag: "OPT",
    name: "Optional depth — off the FDE path",
    window: "optional · not counted",
    thesis: "Everything from the reference ChatGPT roadmap that sits outside the FDE critical path — added for completeness at your request. Fully checkable so you can track it, but excluded from your readiness % and phase math. Study by interest, not obligation.",
    modules: [
      {
        id: "mo1",
        title: "Math & theory foundations",
        why: "The deep math most 'AI engineer' roadmaps front-load. You need intuition (Phase 01), not this — but here in full if you want the rigour.",
        signals: ["found"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "Linear algebra: eigenvalues/vectors, norms, orthogonality, matrix decompositions",
          "Probability: Bayes, Gaussian, likelihood & MLE",
          "Information theory: entropy, cross-entropy, KL divergence",
          "Calculus: gradients, chain rule, backprop by hand",
          "Statistics: variance, covariance, correlation, sampling, confidence intervals",
          "Optimization: gradient descent, SGD, Adam, LR schedulers, loss functions",
        ],
        build: "Implement backprop + Adam from scratch on a tiny MLP; derive the gradients by hand.",
        resources: ["3Blue1Brown — linear algebra & calculus", "Deep Learning (Goodfellow) ch. 2–4"],
      },
      {
        id: "mo2",
        title: "Classic deep learning",
        why: "How we got to transformers. One paragraph of this is FDE-useful; the rest is history worth knowing if you're curious.",
        signals: ["found"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "Neural network basics: layers, activations, the training loop",
          "CNNs — convolution, pooling, vision",
          "RNNs, LSTMs, GRUs — sequence modelling before attention",
          "Why attention replaced recurrence (the bridge to transformers)",
          "Embeddings, normalization, residual connections — from the theory side",
        ],
        build: "Train a small CNN and an LSTM on toy tasks; note where each breaks down.",
        projects: [{ title: "Elephant Species Classification (CNN + Transfer Learning)", url: "https://www.krishnaik.in/project/elephant-species-classification-using-deep-learning-and-transfer-learning", note: "Classic CNN + transfer learning, hands-on." }],
        resources: ["Karpathy — Neural Networks: Zero to Hero", "d2l.ai / CS231n"],
      },
      {
        id: "mo3",
        title: "Software & API engineering foundations",
        why: "Production-SWE hygiene. Async/testing/Pydantic are already in Full-stack (m17); this is the fuller list — much of it your existing strength.",
        signals: ["ship"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "Async deep: asyncio, threads vs processes, generators, context managers, decorators",
          "Typing & Pydantic; dependency injection",
          "Packaging & envs: uv, Poetry, virtualenvs",
          "API styles: REST, WebSockets, SSE, gRPC, OpenAPI",
          "Auth: OAuth, JWT",
          "Testing, mocking, logging, config & secrets management",
        ],
        build: "Ship a small FastAPI service with async endpoints, typed models, tests, and structured logging.",
        projects: [{ title: "End-to-End NexusView Python Package", url: "https://www.krishnaik.in/project/end-to-end-nexusview-package", note: "Build & publish a Python package — packaging/tooling discipline." }],
        resources: ["FastAPI docs", "Pydantic docs"],
      },
      {
        id: "mo4",
        title: "Hugging Face ecosystem (full)",
        why: "The whole HF stack. The FDE-relevant core is in Model landscape (m3); this is the completionist version.",
        signals: ["found", "ship"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "Transformers & Datasets in depth",
          "PEFT, TRL, Accelerate",
          "Evaluate; the Inference API",
          "Hub & Spaces; Gradio demos",
          "Safetensors, Tokenizers, Model Cards",
        ],
        build: "Publish a fine-tuned model + a Gradio Space demo to the Hub with a proper model card.",
        projects: [{ title: "End-to-End NLP: Summarization w/ HF Transformers", url: "https://www.krishnaik.in/project/building-a-dialogue-summarization-system-with-hugging-face-transformers", note: "Fine-tune Pegasus; full HF pipeline (TRL/Datasets/Hub)." }],
        resources: ["Hugging Face docs", "HF LLM Course"],
      },
      {
        id: "mo5",
        title: "Inference & serving infrastructure (deep)",
        why: "The serving layer an FDE consumes but rarely builds. General container/deploy skills now live in DevOps foundations (m13d); this optional module is the deep AI-serving layer — KV-cache, batching, GPU serving.",
        signals: ["deploy"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "GPU & CUDA basics; memory & KV-cache management",
          "Batching & throughput; continuous batching",
          "Serving engines: vLLM, TGI, TensorRT-LLM, SGLang, Ollama, LM Studio",
          "Ray / Ray Serve for distributed inference",
          "Docker, Kubernetes, autoscaling, load balancing (foundations in m13d; here at serving scale)",
          "Kafka, queues, Redis for streaming pipelines (closer to your data-eng background)",
          "NVIDIA stack; monitoring the serving layer",
        ],
        build: "Self-host an OSS model on vLLM in a container with continuous batching; load-test throughput vs latency.",
        projects: [{ title: "Realtime Flight Data Engineering (Airflow + Snowflake)", url: "https://www.krishnaik.in/project/nkdn", note: "A data-eng pipeline — validate your existing strength, don't relearn." }],
        resources: ["vLLM docs", "Ray Serve docs"],
      },
      {
        id: "mo6",
        title: "LLMOps tooling (broader)",
        why: "Experiment-tracking & registry tools beyond the FDE-relevant slice in LLMOps (m13). MLflow is your existing strength.",
        signals: ["deploy"],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "MLflow: tracking, registry, deployment (your strength)",
          "Weights & Biases — experiment tracking",
          "Phoenix / Arize — LLM observability",
          "Experiment tracking & model-versioning discipline",
          "Drift detection tooling",
        ],
        build: "Instrument one agent run end-to-end in W&B or Phoenix; compare against your LangSmith setup.",
        projects: [{ title: "Network Security ML (MLflow + Dagshub)", url: "https://www.krishnaik.in/project/automated-data-pipeline-for-machine-learning-projects", note: "Full MLOps with MLflow/Dagshub experiment tracking." }],
        resources: ["MLflow docs", "W&B / Phoenix docs"],
      },
      {
        id: "mo7",
        title: "Interview coding / DSA",
        why: "Classic algorithm prep. Low signal for the FDE loop (which tests deployment thinking, not leetcode) — here only if you also target generalist SWE loops.",
        signals: [],
        tag: "optional",
        critical: false,
        optional: true,
        topics: [
          "Python medium/hard problem patterns",
          "Arrays, strings, hashmaps",
          "Trees & graphs: BFS / DFS",
          "Recursion & dynamic-programming basics",
          "Complexity analysis; async coding problems",
        ],
        build: "A steady problem cadence only if a generalist SWE loop is on your list — otherwise skip.",
        projects: [{ title: "Timetable Generator (Genetic Algorithm)", url: "https://www.krishnaik.in/project/intelligent-timetable-generator-with-genetic-algorithm", note: "An algorithmic build for the DSA-adjacent track." }],
        resources: ["NeetCode / LeetCode patterns"],
      },
    ],
  },
  {
    id: "p9",
    tag: "LAB",
    name: "Extra project library — off-path builds",
    window: "reference · not counted",
    thesis: "The rest of the Krish Naik catalog — projects that don't map to a skill this tracker teaches (classic ML, computer vision, BI, Python utilities). Grouped by category, read-only. Build one only if the topic genuinely pulls you; none of it moves the FDE needle.",
    modules: [
      {
        id: "mp1",
        title: "Classic & tabular ML builds",
        why: "Off-path for an FDE (there's no classic-ML module here) — but a strong bench of end-to-end tabular/ML projects if the topic pulls you.",
        signals: [],
        tag: null,
        critical: false,
        reference: true,
        topics: [],
        build: null,
        projects: [
          { title: "Cancer Risk Assessment (ML)", url: "https://www.krishnaik.in/project/predictive-modeling-for-cancer-risk-assessment-using-machine-learning", note: "Classification with SMOTE + hyperparameter tuning." },
          { title: "Telecom Churn Prediction", url: "https://www.krishnaik.in/project/telecom-customer-churn-prediction-using-machine-learning", note: "Full ML lifecycle through deployment." },
          { title: "Academic Risk & Engagement", url: "https://www.krishnaik.in/project/academic-risk-engagement-prediction-system", note: "Classification + probabilistic modeling." },
          { title: "2-Stage Loan Approval & Valuation", url: "https://www.krishnaik.in/project/loan-approval-and-loan-amount-prediction-system", note: "Two-stage fintech ML, production-ready." },
          { title: "Thunderstorm Forecasting (MLflow)", url: "https://www.krishnaik.in/project/thunderstorm-forecasting-with-mlflow-tracking", note: "ML with MLflow experiment tracking." },
          { title: "Drinks Quality Prediction", url: "https://www.krishnaik.in/project/drinks-quality-prediction-system", note: "Modular end-to-end ML pipeline." },
          { title: "Collaborative Filtering Recommender", url: "https://www.krishnaik.in/project/collaborative-filtering-recommendation-system", note: "Recommender with a full MLOps pipeline." },
          { title: "Social Video Sentiment", url: "https://www.krishnaik.in/project/social-video-audience-sentiment-intelligence", note: "NLP sentiment classification." },
          { title: "Global Mobility Analyzer", url: "https://www.krishnaik.in/project/global-mobility-application-analyzer", note: "Feature-eng + model + deploy pipeline." },
          { title: "Books Recommender", url: "https://www.krishnaik.in/project/books-recommender-system", note: "A beginner recommender system." },
        ],
        resources: [],
      },
      {
        id: "mp2",
        title: "Computer vision & medical imaging",
        why: "One CV exemplar already sits in Classic DL (mo2); this is the rest of the catalog's vision/imaging work — near-duplicates of the same CNN/YOLO skill.",
        signals: [],
        tag: null,
        critical: false,
        reference: true,
        topics: [],
        build: null,
        projects: [
          { title: "Object Detection (Faster R-CNN + DVC)", url: "https://www.krishnaik.in/project/jhjh", note: "Faster R-CNN with DVC pipelines." },
          { title: "Chest Disease Identification", url: "https://www.krishnaik.in/project/chest-disease-identification", note: "CNN classifier + full MLOps." },
          { title: "Discarded Material Detection", url: "https://www.krishnaik.in/project/discarded-material-identification-system", note: "Object detection, production-ready." },
          { title: "Facial Emotion Detection", url: "https://www.krishnaik.in/project/facial-emotion-detection-system", note: "YOLOv11 emotion detection." },
          { title: "Waste Detection (YOLOv5)", url: "https://www.krishnaik.in/project/end-to-end-waste-materials-detection-system", note: "YOLOv5 waste detection." },
          { title: "Sign Language Detection", url: "https://www.krishnaik.in/project/sign-language-detection-systems-for-deaf-and-mute-individuals", note: "YOLOv5 gesture recognition." },
          { title: "Mosquito Detection", url: "https://www.krishnaik.in/project/mosquito-detection-system-prevent-mosquito-borne-diseases", note: "YOLOv5 public-health CV." },
          { title: "Thyroid Cancer Detection (Grad-CAM XAI)", url: "https://www.krishnaik.in/project/thyrocheck-ai-deep-learning-for-thyroid-nodule-classification", note: "Custom CNN + Grad-CAM interpretability." },
          { title: "Kidney Tumor Identification", url: "https://www.krishnaik.in/project/kidney-tumor-identification-system", note: "CNN + MLOps over CT scans." },
          { title: "Tumor Detection XAI (GCP)", url: "https://www.krishnaik.in/project/end-2-end-tumor-detection-with-xai-and-gcp", note: "Full-stack medical imaging + Grad-CAM." },
          { title: "Poultry Disease Identification", url: "https://www.krishnaik.in/project/poultry-disease-identification", note: "CNN classifier with DVC/Docker." },
          { title: "Solar Panel Defect Classification", url: "https://www.krishnaik.in/project/solar-panel-defect-classification-using-deep-learning", note: "Transfer learning + hyperparam tuning." },
          { title: "Heart Murmur Detection (LSTM)", url: "https://www.krishnaik.in/project/ai-powered-heart-murmur-detection-system", note: "Audio signal processing + LSTM." },
        ],
        resources: [],
      },
      {
        id: "mp3",
        title: "Data analytics & BI (Power BI)",
        why: "Pure BI / analytics — off the FDE path entirely; here only so the catalog is complete.",
        signals: [],
        tag: null,
        critical: false,
        reference: true,
        topics: [],
        build: null,
        projects: [
          { title: "Regional Sales Performance", url: "https://www.krishnaik.in/project/regional-sales-performance-analysis-and-visualization", note: "EDA + Power BI dashboards." },
          { title: "Telecom Churn Dashboard", url: "https://www.krishnaik.in/project/telecom-customer-churn-analysis-and-dashboarding-project", note: "EDA + interactive dashboards." },
          { title: "Solar Energy (Power BI + MySQL)", url: "https://www.krishnaik.in/project/solar-energy-data-analysis-and-reporting-with-power-bi-mysql", note: "Power BI over MySQL with ETL." },
          { title: "Diamonds Data Analysis (Power BI)", url: "https://www.krishnaik.in/project/interactive-diamonds-data-analysis-and-visualization-with-power-bi", note: "Power BI + DAX visualization." },
          { title: "SQL Server + Power BI Sales", url: "https://www.krishnaik.in/project/sql-server-and-power-bi-for-end-to-end-sales-data-analysis-and-visualization", note: "SQL Server modeling + Power BI." },
        ],
        resources: [],
      },
      {
        id: "mp4",
        title: "Python utilities & misc",
        why: "General Python builds — fun, but tangential to the FDE path.",
        signals: [],
        tag: null,
        critical: false,
        reference: true,
        topics: [],
        build: null,
        projects: [
          { title: "Personal AI Voice Assistant (JARVIS)", url: "https://www.krishnaik.in/project/python-mega-project-personal-ai-voice-assistant-system", note: "Voice assistant: speech + Gemini." },
          { title: "PCAP StoryTeller", url: "https://www.krishnaik.in/project/pcap-storyteller", note: "Network forensics from packet data." },
          { title: "YouTube Mixtape Creation", url: "https://www.krishnaik.in/project/automated-youtube-mixtape-creation-with-python", note: "Audio-to-video automation with FastAPI." },
          { title: "Smart Attendance Portal (Supabase)", url: "https://www.krishnaik.in/project/smart-attendance-portal-with-supabase", note: "Streamlit + Supabase CRUD app." },
        ],
        resources: [],
      },
    ],
  },

];

const ALL_TOPICS = PHASES.flatMap((p) =>
  p.modules.filter((m) => !m.reference && !m.optional).flatMap((m) => m.topics.map((_, i) => `${m.id}.${i}`))
);
const TOTAL = ALL_TOPICS.length;
const SCHEDULED_PHASES = PHASES.filter((p) => p.modules.some((m) => !m.reference && !m.optional)).length;
const SCHEDULED_MODULES = PHASES.flatMap((p) => p.modules).filter((m) => !m.reference && !m.optional).length;
const OPTIONAL_MODULES = PHASES.flatMap((p) => p.modules).filter((m) => m.optional).length;
const SUMMARY = `${SCHEDULED_PHASES} phases · ${SCHEDULED_MODULES} scheduled modules · ${TOTAL} tracked topics · +${OPTIONAL_MODULES} optional modules (off-path, not counted)`;
const STORAGE_KEY = "fde-tracker-progress-v2";

const TAG_STYLES = {
  gap: { label: "likely new for you", bg: C.amberSoft, fg: C.amber, bd: "rgba(244,169,60,0.4)" },
  strength: { label: "your strength", bg: C.tealSoft, fg: C.teal, bd: "rgba(52,214,193,0.4)" },
  compress: { label: "move fast here", bg: "rgba(149,161,181,0.12)", fg: C.inkDim, bd: C.line },
  optional: { label: "optional · off the FDE path", bg: "rgba(149,161,181,0.10)", fg: C.inkDim, bd: C.line },
};

export default function App() {
  const [done, setDone] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState({});
  const [filter, setFilter] = useState("all");
  const [activePhase, setActivePhase] = useState("p0");
  const phaseRefs = useRef({});

  // Load persisted progress
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (!cancelled && res && res.value) {
          const parsed = JSON.parse(res.value);
          setDone(parsed.done || {});
        }
      } catch (e) {
        // no saved state yet — expected on first run
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = async (nextDone) => {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify({ done: nextDone }));
    } catch (e) {
      // storage failed — progress stays in-session
    }
  };

  const toggle = (tid) => {
    setDone((prev) => {
      const next = { ...prev };
      if (next[tid]) delete next[tid];
      else next[tid] = true;
      persist(next);
      return next;
    });
  };

  const resetAll = () => {
    if (!window.confirm("Clear all progress? This can't be undone.")) return;
    setDone({});
    persist({});
  };

  const moduleStats = (m) => {
    const total = m.topics.length;
    const complete = m.topics.filter((_, i) => done[`${m.id}.${i}`]).length;
    return { total, complete, pct: total ? complete / total : 0 };
  };
  const phaseStats = (p) => {
    const ts = p.modules.filter((m) => !m.reference && !m.optional).flatMap((m) => m.topics.map((_, i) => `${m.id}.${i}`));
    const complete = ts.filter((t) => done[t]).length;
    return { total: ts.length, complete, pct: ts.length ? complete / ts.length : 0 };
  };

  const completedCount = useMemo(
    () => ALL_TOPICS.filter((t) => done[t]).length,
    [done]
  );
  const overallPct = TOTAL ? completedCount / TOTAL : 0;

  // First incomplete phase = "current front line"
  const currentPhaseId = useMemo(() => {
    const real = PHASES.filter((p) => p.modules.some((m) => !m.reference && !m.optional));
    for (const p of real) if (phaseStats(p).pct < 1) return p.id;
    return real[real.length - 1].id;
  }, [done]);

  const moduleVisible = (m) => {
    if (filter === "optional") return !!m.optional;
    if (m.reference || m.optional) return filter === "all";
    if (filter === "all") return true;
    if (filter === "critical") return m.critical;
    if (filter === "gap") return m.tag === "gap";
    if (filter === "todo") return moduleStats(m).pct < 1;
    return true;
  };

  const scrollToPhase = (pid) => {
    const el = phaseRefs.current[pid];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={styles.root}>
      <style>{CSS}</style>

      {/* ===== Header / mission readout ===== */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.eyebrow}>FORWARD DEPLOYED ENGINEER · READINESS PLAN</div>
          <h1 style={styles.h1}>
            Noob → expert in agentic engineering,
            <br />
            <span style={{ color: C.teal }}>aimed at the Anthropic / OpenAI FDE bar.</span>
          </h1>
          <p style={styles.sub}>
            {SUMMARY} · sequenced <b style={{ color: C.ink }}>Jul 2026 → Jul 2027</b>. Every scheduled module
            is tagged by which of the five real FDE competencies it builds. Check things off — progress saves automatically.
          </p>

          <div style={styles.meterWrap}>
            <div style={styles.meterTop}>
              <span style={styles.meterPct}>{Math.round(overallPct * 100)}%</span>
              <span style={styles.meterLabel}>
                {completedCount} / {TOTAL} topics · deployment readiness
              </span>
            </div>
            <div style={styles.meterTrack}>
              <div
                className="fill"
                style={{ ...styles.meterFill, width: `${overallPct * 100}%` }}
              />
            </div>
          </div>

          {/* signal legend */}
          <div style={styles.legend}>
            <span style={styles.legendLabel}>FDE competencies →</span>
            {Object.entries(SIGNALS).filter(([k]) => k !== "found").map(([k, v]) => (
              <span key={k} style={styles.legendPill}>
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div style={styles.body}>
        {/* ===== Deployment spine (phase nav) ===== */}
        <nav style={styles.spine} aria-label="Phases">
          {PHASES.map((p, idx) => {
            const st = phaseStats(p);
            const isCurrent = p.id === currentPhaseId;
            return (
              <button
                key={p.id}
                className="spine-node"
                onClick={() => scrollToPhase(p.id)}
                style={{
                  ...styles.spineNode,
                  borderColor: isCurrent ? C.amber : C.line,
                }}
              >
                <div style={styles.spineRail}>
                  <div
                    style={{
                      ...styles.spineDot,
                      background: st.pct === 1 ? C.teal : isCurrent ? C.amber : C.panelHi,
                      borderColor: st.pct === 1 ? C.teal : isCurrent ? C.amber : C.line,
                      boxShadow: st.pct === 1 ? `0 0 0 3px ${C.tealSoft}` : "none",
                    }}
                  >
                    {st.pct === 1 ? "✓" : p.tag}
                  </div>
                  {idx < PHASES.length - 1 && <div style={styles.spineLine} />}
                </div>
                <div style={styles.spineText}>
                  <div style={styles.spineName}>{p.name}</div>
                  <div style={styles.spineWindow}>{p.window}</div>
                  <div style={styles.spineMini}>
                    <div
                      style={{
                        ...styles.spineMiniFill,
                        width: `${st.pct * 100}%`,
                        background: st.pct === 1 ? C.teal : C.inkDim,
                      }}
                    />
                  </div>
                  {isCurrent && st.pct < 1 && (
                    <div style={styles.frontLine}>◂ front line</div>
                  )}
                </div>
              </button>
            );
          })}
          <button onClick={resetAll} className="reset" style={styles.reset}>
            reset progress
          </button>
        </nav>

        {/* ===== Main column ===== */}
        <main style={styles.main}>
          {/* filters */}
          <div style={styles.filters}>
            {[
              ["all", "All modules"],
              ["critical", "FDE-critical"],
              ["gap", "Likely new for you"],
              ["todo", "Unfinished"],
              ["optional", "Optional"],
            ].map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className="filter-btn"
                style={{
                  ...styles.filterBtn,
                  color: filter === k ? C.bg : C.inkDim,
                  background: filter === k ? C.teal : "transparent",
                  borderColor: filter === k ? C.teal : C.line,
                  fontWeight: filter === k ? 600 : 500,
                }}
              >
                {lbl}
              </button>
            ))}
          </div>

          {PHASES.map((p) => {
            const visibleModules = p.modules.filter(moduleVisible);
            if (visibleModules.length === 0) return null;
            const st = phaseStats(p);
            return (
              <section
                key={p.id}
                ref={(el) => (phaseRefs.current[p.id] = el)}
                style={styles.phaseBlock}
              >
                <div style={styles.phaseHead}>
                  <span style={styles.phaseTag}>{p.tag}</span>
                  <div style={{ flex: 1 }}>
                    <h2 style={styles.phaseName}>
                      {p.name}
                      <span style={styles.phaseWindow}>{p.window}</span>
                    </h2>
                    <p style={styles.phaseThesis}>{p.thesis}</p>
                  </div>
                  <span style={styles.phasePct}>{st.total === 0 ? "optional" : `${Math.round(st.pct * 100)}%`}</span>
                </div>

                <div style={styles.moduleGrid}>
                  {visibleModules.map((m) => {
                    const isRef = !!m.reference;
                    const ms = moduleStats(m);
                    const isOpen = open[m.id];
                    const complete = !isRef && ms.pct === 1;
                    return (
                      <article
                        key={m.id}
                        style={{
                          ...styles.card,
                          borderColor: complete
                            ? "rgba(52,214,193,0.4)"
                            : m.critical
                            ? "rgba(244,169,60,0.28)"
                            : C.line,
                        }}
                      >
                        <button
                          className="card-head"
                          onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))}
                          style={styles.cardHead}
                          aria-expanded={!!isOpen}
                        >
                          <div style={styles.cardHeadLeft}>
                            <div style={styles.cardTitleRow}>
                              {m.critical && (
                                <span style={styles.critDot} title="FDE-critical">◆</span>
                              )}
                              <h3 style={styles.cardTitle}>{m.title}</h3>
                            </div>
                            <p style={styles.cardWhy}>{m.why}</p>
                            <div style={styles.tagRow}>
                              {m.signals.map((s) => (
                                <span key={s} style={styles.sigPill}>
                                  {SIGNALS[s].label}
                                </span>
                              ))}
                              {m.tag && TAG_STYLES[m.tag] && (
                                <span
                                  style={{
                                    ...styles.metaPill,
                                    background: TAG_STYLES[m.tag].bg,
                                    color: TAG_STYLES[m.tag].fg,
                                    borderColor: TAG_STYLES[m.tag].bd,
                                  }}
                                >
                                  {TAG_STYLES[m.tag].label}
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={styles.cardHeadRight}>
                            <div style={styles.ring}>
                              <span
                                style={{
                                  ...styles.ringPct,
                                  color: complete ? C.teal : C.inkDim,
                                }}
                              >
                                {isRef ? "ref" : `${ms.complete}/${ms.total}`}
                              </span>
                            </div>
                            <span
                              style={{
                                ...styles.chev,
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              }}
                            >
                              ▾
                            </span>
                          </div>
                        </button>

                        {/* module progress bar */}
                        {!isRef && (
                          <div style={styles.cardBar}>
                            <div
                              className="fill"
                              style={{
                                ...styles.cardBarFill,
                                width: `${ms.pct * 100}%`,
                                background: complete ? C.teal : C.inkDim,
                              }}
                            />
                          </div>
                        )}

                        {isOpen && (
                          <div style={styles.cardBody}>
                            <ul style={styles.topicList}>
                              {m.topics.map((t, i) => {
                                const tid = `${m.id}.${i}`;
                                const checked = !!done[tid];
                                if (isRef) {
                                  return (
                                    <li key={i} style={styles.topicItem}>
                                      <span style={{ color: C.inkFaint, flexShrink: 0, marginTop: 1 }}>▹</span>
                                      <span style={{ ...styles.topicText, color: C.inkDim }}>{t}</span>
                                    </li>
                                  );
                                }
                                return (
                                  <li key={tid} style={styles.topicItem}>
                                    <button
                                      className="check"
                                      onClick={() => toggle(tid)}
                                      aria-pressed={checked}
                                      style={{
                                        ...styles.check,
                                        background: checked ? C.teal : "transparent",
                                        borderColor: checked ? C.teal : C.inkFaint,
                                      }}
                                    >
                                      {checked && <span style={styles.checkMark}>✓</span>}
                                    </button>
                                    <span
                                      style={{
                                        ...styles.topicText,
                                        color: checked ? C.inkFaint : C.ink,
                                        textDecoration: checked ? "line-through" : "none",
                                      }}
                                      onClick={() => toggle(tid)}
                                    >
                                      {t}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>

                            {m.build && (
                              <div style={styles.buildBox}>
                                <span style={styles.buildLabel}>BUILD</span>
                                <span style={styles.buildText}>{m.build}</span>
                              </div>
                            )}

                            {m.projects && m.projects.length > 0 && (
                              <div style={styles.projectBox}>
                                <span style={styles.projectLabel}>
                                  {isRef ? "PROJECTS ↗" : m.projects.length > 1 ? "PARALLEL PROJECTS ↗" : "PARALLEL PROJECT ↗"}
                                </span>
                                {m.projects.map((pr, i) => (
                                  <div key={i} style={styles.projectItem}>
                                    <a
                                      href={pr.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={styles.projectLink}
                                    >
                                      {pr.title}
                                    </a>
                                    <span style={styles.projectNote}>{pr.note}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {m.resources && m.resources.length > 0 && (
                              <div style={styles.resRow}>
                                <span style={styles.resLabel}>anchor resources:</span>
                                {m.resources.map((r, i) => (
                                  <span key={i} style={styles.resItem}>
                                    {r}
                                    {i < m.resources.length - 1 ? " · " : ""}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <footer style={styles.footer}>
            <p style={styles.footNote}>
              ◆ = FDE-critical module. Compress Phases 01–02 (you already have the depth), and spend the
              bulk of your calendar on Phases 03–05. The single highest-leverage artifact you can produce
              this year is the <b style={{ color: C.teal }}>eval harness</b> in Phase 04 — build it early
              and let it pull the capstones behind it. Phases 06–07 aren't more theory — they're reps,
              referrals, and shipping in public until an offer lands.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }
.spine-node:hover .spineName { color: ${C.teal}; }
.filter-btn:hover { border-color: ${C.teal} !important; }
.card-head:hover h3 { color: ${C.teal}; }
.check:hover { border-color: ${C.teal} !important; }
.reset:hover { color: ${C.amber} !important; border-color: ${C.amber} !important; }
button:focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; border-radius: 4px; }
.fill { transition: width .5s cubic-bezier(.4,0,.2,1); }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: ${C.bg}; }
::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) { .fill { transition: none; } * { scroll-behavior: auto !important; } }
@media (max-width: 900px) {
  .body-grid { flex-direction: column !important; }
  .spine-nav { position: static !important; flex-direction: row !important; overflow-x: auto !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid ${C.line} !important; }
  .spine-node { min-width: 150px; }
}
`;

const styles = {
  root: {
    minHeight: "100vh",
    background: C.bg,
    color: C.ink,
    fontFamily: "'Inter', system-ui, sans-serif",
    WebkitFontSmoothing: "antialiased",
  },
  header: {
    borderBottom: `1px solid ${C.line}`,
    background: `linear-gradient(180deg, ${C.panel} 0%, ${C.bg} 100%)`,
  },
  headerInner: { maxWidth: 1180, margin: "0 auto", padding: "44px 28px 34px" },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.22em",
    color: C.teal,
    marginBottom: 16,
  },
  h1: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "clamp(26px, 4vw, 42px)",
    lineHeight: 1.12,
    fontWeight: 600,
    margin: "0 0 16px",
    letterSpacing: "-0.02em",
  },
  sub: { fontSize: 15, lineHeight: 1.6, color: C.inkDim, maxWidth: 720, margin: "0 0 26px" },
  meterWrap: { maxWidth: 560, marginBottom: 22 },
  meterTop: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 },
  meterPct: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 30,
    fontWeight: 700,
    color: C.teal,
    lineHeight: 1,
  },
  meterLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11.5,
    color: C.inkFaint,
    letterSpacing: "0.04em",
  },
  meterTrack: {
    height: 8,
    background: C.panelHi,
    borderRadius: 20,
    overflow: "hidden",
    border: `1px solid ${C.line}`,
  },
  meterFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${C.teal}, #5fe8d6)`,
    borderRadius: 20,
  },
  legend: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 },
  legendLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: C.inkFaint,
    letterSpacing: "0.04em",
  },
  legendPill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    padding: "3px 9px",
    borderRadius: 20,
    background: C.tealSoft,
    color: C.teal,
    border: `1px solid rgba(52,214,193,0.3)`,
  },
  body: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 28px",
    display: "flex",
    gap: 34,
    alignItems: "flex-start",
  },
  spine: {
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    width: 210,
    flexShrink: 0,
    padding: "30px 0",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  spineNode: {
    display: "flex",
    gap: 12,
    textAlign: "left",
    background: "transparent",
    border: "none",
    padding: "2px 0",
  },
  spineRail: { display: "flex", flexDirection: "column", alignItems: "center", width: 30 },
  spineDot: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: `1.5px solid ${C.line}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 500,
    color: C.bg,
    flexShrink: 0,
  },
  spineLine: { width: 2, flex: 1, minHeight: 26, background: C.line, marginTop: 2 },
  spineText: { paddingBottom: 14, minWidth: 0 },
  spineName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    transition: "color .2s",
  },
  spineWindow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    color: C.inkFaint,
    marginTop: 2,
  },
  spineMini: {
    height: 3,
    background: C.panelHi,
    borderRadius: 3,
    marginTop: 7,
    width: 90,
    overflow: "hidden",
  },
  spineMiniFill: { height: "100%", borderRadius: 3, transition: "width .5s" },
  frontLine: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: C.amber,
    marginTop: 6,
    letterSpacing: "0.05em",
  },
  reset: {
    marginTop: 18,
    marginLeft: 42,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    color: C.inkFaint,
    background: "transparent",
    border: `1px solid ${C.line}`,
    borderRadius: 6,
    padding: "5px 10px",
    alignSelf: "flex-start",
    transition: "all .2s",
  },
  main: { flex: 1, minWidth: 0, padding: "30px 0 60px" },
  filters: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 },
  filterBtn: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11.5,
    padding: "6px 13px",
    borderRadius: 20,
    border: `1px solid ${C.line}`,
    transition: "all .2s",
  },
  phaseBlock: { marginBottom: 40 },
  phaseHead: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: `1px solid ${C.line}`,
  },
  phaseTag: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 30,
    fontWeight: 700,
    color: C.panelHi,
    WebkitTextStroke: `1px ${C.line}`,
    lineHeight: 1,
    flexShrink: 0,
  },
  phaseName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 21,
    fontWeight: 600,
    margin: 0,
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    flexWrap: "wrap",
    letterSpacing: "-0.01em",
  },
  phaseWindow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: C.amber,
    fontWeight: 400,
    letterSpacing: "0.03em",
  },
  phaseThesis: { fontSize: 13.5, color: C.inkDim, margin: "6px 0 0", lineHeight: 1.5, maxWidth: 640 },
  phasePct: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: C.inkDim,
    flexShrink: 0,
  },
  moduleGrid: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    background: C.panel,
    border: `1px solid ${C.line}`,
    borderRadius: 12,
    overflow: "hidden",
    transition: "border-color .3s",
  },
  cardHead: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    padding: "18px 20px 14px",
    background: "transparent",
    border: "none",
    textAlign: "left",
  },
  cardHeadLeft: { minWidth: 0, flex: 1 },
  cardTitleRow: { display: "flex", alignItems: "center", gap: 9 },
  critDot: { color: C.amber, fontSize: 10, flexShrink: 0 },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16.5,
    fontWeight: 600,
    margin: 0,
    transition: "color .2s",
    letterSpacing: "-0.01em",
  },
  cardWhy: { fontSize: 13, color: C.inkDim, margin: "6px 0 10px", lineHeight: 1.5 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  sigPill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    padding: "2.5px 8px",
    borderRadius: 5,
    background: C.panelHi,
    color: C.inkDim,
    border: `1px solid ${C.line}`,
  },
  metaPill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    padding: "2.5px 8px",
    borderRadius: 5,
    border: "1px solid",
    fontWeight: 500,
  },
  cardHeadRight: { display: "flex", alignItems: "center", gap: 14, flexShrink: 0 },
  ring: { display: "flex", alignItems: "center", justifyContent: "center" },
  ringPct: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 500,
  },
  chev: { color: C.inkFaint, fontSize: 12, transition: "transform .25s" },
  cardBar: { height: 3, background: C.panelHi, width: "100%" },
  cardBarFill: { height: "100%" },
  cardBody: { padding: "16px 20px 20px" },
  topicList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 },
  topicItem: { display: "flex", alignItems: "flex-start", gap: 11 },
  check: {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: `1.5px solid ${C.inkFaint}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
    transition: "all .15s",
    padding: 0,
  },
  checkMark: { color: C.bg, fontSize: 11, fontWeight: 700, lineHeight: 1 },
  topicText: { fontSize: 13.5, lineHeight: 1.5, cursor: "pointer", transition: "color .15s" },
  buildBox: {
    marginTop: 16,
    padding: "12px 14px",
    background: C.tealSoft,
    borderRadius: 8,
    borderLeft: `2px solid ${C.teal}`,
    display: "flex",
    gap: 10,
    alignItems: "baseline",
  },
  buildLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: C.teal,
    flexShrink: 0,
  },
  buildText: { fontSize: 13, color: C.ink, lineHeight: 1.5 },
  projectBox: {
    marginTop: 12,
    padding: "12px 14px",
    background: C.amberSoft,
    borderRadius: 8,
    borderLeft: `2px solid ${C.amber}`,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  projectLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: C.amber,
  },
  projectLink: {
    fontSize: 13.5,
    fontWeight: 600,
    color: C.teal,
    textDecoration: "none",
    lineHeight: 1.4,
  },
  projectItem: { display: "flex", flexDirection: "column", gap: 3 },
  projectNote: { fontSize: 12.5, color: C.inkDim, lineHeight: 1.5 },
  resRow: { marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "baseline" },
  resLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    color: C.inkFaint,
    letterSpacing: "0.04em",
    marginRight: 4,
  },
  resItem: { fontSize: 12, color: C.inkDim },
  footer: { marginTop: 30, paddingTop: 22, borderTop: `1px solid ${C.line}` },
  footNote: { fontSize: 13, color: C.inkDim, lineHeight: 1.6, maxWidth: 720 },
};
