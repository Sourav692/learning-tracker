# AI Security — Course Curriculums

Scraped Udemy course curriculums on **AI security** (guardrails, LLM gateways, observability, red-teaming, evals) via Playwright MCP. Each course is a `##` section below.

---

## AI Security Bootcamp — Guardrails, LLM Gateways, Observability

- **Link:** https://www.udemy.com/course/ai-security-bootcamp-guardrailsllm-gatewaysobservability/
- **Scraped:** 2026-07-24
- **Overview:** 27 sections · 225 lectures. Security-focused agentic AI: guardrails (NeMo, Bedrock, Guardrails AI), LLM gateways (Portkey, TensorZero, Bifrost), observability (LangSmith, Pydantic Logfire), evals (RAGAS, DeepEval), agentic memory (mem0, LangMem), red-teaming (PyRIT), Redis caching/rate-limiting, and two end-to-end secured projects.

### 1. Introduction — _4 lectures • 31min_
1. Introduction to the course
2. Why security is the biggest concern in Gen Ai Applications
3. Architecture of Agentic Ai Applications
4. An Important Initiative Announcement

### 2. Langchain — _13 lectures • 3hr 9min_
1. Introduction To Langchain Updates
2. Creating Virtual Environment With UV Package
3. Agents With Langchain
4. Langchain Model Integration
5. Streaming And Batch With Langchain
6. Tools In Langchain
7. Messages In Langchain
8. Pydantic Structured Output
9. TypeDict Structured Output
10. Data Class Structured Output
11. MiddleWare Summarization
12. Human In the Loop MiddleWare
13. Introduction To Guardrails And Implementation

### 3. Building AI Agents With LangGraph — _9 lectures • 3hr 39min_
1. Introduction to Langgraph
2. Project structure And Environment Set up
3. Building Basic AI Chatbots With LangGraph
4. Building React Agent With LangGraph
5. Memory Implementation In Ai Agents With LangGraph
6. Human In the Loop Implementation
7. Debugging,Monitoring And Observability Langsmith
8. Multi agent Implementation With LangGraph
9. MCP Implementation With LanGraph

### 4. Observability — _2 lectures • 12min_
1. Introduction to observability
2. Frameworks for Observability

### 5. Observability with Langsmith — _5 lectures • 1hr 30min_
1. Introduction To Langsmith
2. Manual and Custom Tracing
3. Simple and Agentic Rag Tracing
4. Langraph App Development
5. App Execution with Langgraph Studio

### 6. Observability With Pydantic Logfire — _7 lectures • 1hr 54min_
1. Introduction to Pydantic Logfire
2. Setting up logfire
3. Basics of Tracing LLM's with logfire
4. Tracing a Simple Rag
5. Tracing a React Agent
6. Creating Agentic workflow
7. Testing Trace and Agentic App Execution

### 7. Guardrails — _1 lecture • 8min_
1. What are Guardrails and core topics And Frameworks

### 8. Nemo Guardrails — _9 lectures • 2hr 25min_
1. Introduction To Nemo Guardrails
2. How to write Rails in Nemo Guardrails
3. The raw LLM Problem
4. Our First Guradrail
5. Input Rails
6. PII Detection using Custom Rails
7. Output Rails
8. Secured HR assistant bot development
9. Testing Secured HR assistant

### 9. AWS Bedrock Guardrails — _9 lectures • 4hr 24min_
1. M1_P1 : Introduction, Setup , Clients and Anatomy
2. M1_P2 : Creating your First Guardrail & With vs Without Guardrails
3. M1_P3 : Types of Guardrails and Trace Structure
4. M2_P1 : Content Filters, Confidence vs Threshold & False Positives and Negatives
5. M2_P2 : Testing Filters , High vs Low Threshold & Prompt Attack
6. M3 : Denied Topics, Word Filters & PII Redaction
7. M4 : Grounding and Hallucination Control in RAG
8. M5_P1 : Versioning , Monitoring & Automated Testing Suite Strategy
9. M5_P2 : Cost & Pricing , OpenSource vs AWS Guardrails

### 10. Guardrails AI — _13 lectures • 3hr 4min_
1. Introduction to Guardrails AI
2. Why Learn Guardrails AI
3. Guardrails Hub and Validators Explained
4. OnFailAction Overview
5. Types of OnFailAction Explained
6. Basic setup and validators installation from hub
7. Validators Implementation Explained
8. OnFailAction Implementation Explained Part 1
9. OnFailAction Implementation Explained Part 2
10. Input and Output Structure Validation using Guardrails AI
11. Orchestration & Real-Time Streaming with Guard Object
12. Using Guardrails AI with langchain
13. Ways to Implement Guardrails in your applications using Guardrails AI

### 11. LLM Gateways — _1 lecture • 11min_
1. What is a LLM Gateways and terminologies

### 12. Portkey Gateway — _5 lectures • 1hr 43min_
1. Introduction to Portkey and Project Setup
2. Our First Experiment with Portkey
3. User Tracing, retry, timeout and fallback
4. Load balancing and Caching
5. Langchain Integration with Portkey

### 13. TensorZero LLM Gateway — _10 lectures • 4hr 32min_
1. M1_P1 Introduction to TensorZero and Setting Up LLM Gateways
2. M1_P2 TOML and Direct vs LLM Gateway Request Comparison
3. Introduction to Portkey and project setup
4. M1_P3 TensorZero Client , Episodes and Exploring UI
5. M2_P1 Routing Architecture and Types of Routing
6. M2_P2 Fallback Routing Practical Demo and Benchmarking Latency
7. M3_P1 Prompt Templates using Minijinja and Structured JSON Output
8. M3_P2 TensorZero Unified Tool Calling Demo
9. M4 A/B Testing and Feedback Loop
10. M5 Gateway Powered Customer Support Chatbot Project

### 14. Bifrost Ai Gateway — _8 lectures • 2hr 27min_
1. Introduction to Bifrost Ai Gateway
2. Setting up Bifrost and other LLM Providers
3. Problem without Gateways
4. Our First Bifrost Call
5. Fallback , streaming and logging with bifrost
6. Playing with Virtual keys and MCP
7. MINI RAG with Qdrant Cloud - Data Ingestion
8. MINI RAG with Qdrant Cloud - Data Retreival

### 15. RAGAS — _7 lectures • 1hr 33min_
1. Introduction to LLM EVALUATION
2. RAGAS DEMO
3. Terminologies for Understanding Ragas
4. Understanding Evaluation Metrics for Ragas
5. Token Efficiency and experiment notebook setup
6. Faithfulness, Answer relevancy, Context Precision
7. Context Recall, Answer and tool correctness

### 16. Deep Eval — _14 lectures • 4hr 23min_
1. Introduction to DeepEvals for Evaluations
2. Understanding Goldens, llmTestCases and Evaluation pipeline in Terms of DeepEval
3. (IMPORTANT) The Complete llm Evaluation Pipeline Explained
4. DeepEval Metrics Overview: G-Eval, DAG, and QAG
5. Custom Metrics: G-Eval Demo and Working Explained
6. Custom Metrics: G-Eval Implemenation Explained
7. Custom Metrics: DAG Demo and Working Explained
8. Custom Metrics: DAG Implemenation Explained
9. Custom Metrics: QAG Explained
10. RAG evals metrics explained
11. Evaluation of RAG with DeepEvals
12. Understanding AI Agents Evaluations
13. Agentic Evals Metrics explained
14. Evaluation of AI Agent with DeepEvals

### 17. BASICS OF AGENTIC MEMORY — _10 lectures • 1hr 56min_
1. Intro to memory in Ai agents
2. MEMORY DEMO
3. Problems with Agents WITHOUT Memory
4. Conversation buffer and sliding window memory
5. Summary and Token buffer memory
6. Vector store and Entity memory
7. Episodic memory
8. Semantic Memory
9. Procedural memory
10. Self reflection , memory routing and various frameworks

### 18. MEM0 for Agenitc memory — _3 lectures • 56min_
1. What is memory and why its needed in LLM Applications
2. Mem0 Quick start Explained
3. Mem0 Core Concepts Explained

### 19. LangMem for Agentic Memory — _2 lectures • 48min_
1. LangMem Quick start Explained
2. LangMem Core concepts Explained

### 20. Red Teaming with PYRIT — _14 lectures • 5hr 2min_
1. 01_Introduction to PyRIT & Setup
2. 02_Core Concepts — Targets, Scorers & Converters
3. 03_ Direct Prompt Injection Attacks
4. 04_Jailbreaking — PAIR, Crescendo,TAP and Many Shot Attacks
5. 05_Encoding & Obfuscation Attacks
6. 06_Multi-Turn Red-Teaming with RedTeamingOrchestrator
7. 07_XPIA — Cross-Prompt Injection on AI Agents & RAG
8. What is memory and why its needed in LLM Applications
9. 08_Skeleton Key & Persuasion Attacks
10. Mem0 Quick start Explained
11. 09_Automated Scoring & Custom Scorer Pipelines
12. 10_Multimodal Attacks - Injecting Through Files, Images, and Spoken Audio
13. 11_Fuzzing, Dataset Generation & Bulk Scanning
14. 12_Building a Real AI Security Red Teaming Dashboard Web App

### 21. Redis for LLM Caching & Rate Limiting — _7 lectures • 2hr 32min_
1. 01_Redis Setup and Prerequisites
2. 02_Introduction to Redis for AI & LLM Caching
3. 03_Exact Match LLM Caching
4. 04_Semantic Caching with Embeddings
5. 05_AI Agent Conversation Memory with Redis
6. 06_Rate Limiting & API Cost Control with Redis
7. 07_RAG Caching and Final Web Application Demo

### 22. Project 1 - Introduction to project and Data Ingestion — _13 lectures • 3hr 6min_
1. Project Introduction
2. Understanding Data Ingestion Pipeline
3. Understanding Rag Architecture
4. Moving to next phase of project
5. Enabling GCP Qdrant and other AI services
6. Understanding Requirements and goals
7. Setting Up GCP permissions
8. Understanding I AM roles and .env setup
9. Data ingestion Process
10. Code setup for Data Ingestion
11. Data Parsing
12. Final data Processing
13. Testing Data Ingestion Pipeline

### 23. Project 1 - Agentic Rag Development and deployment — _9 lectures • 2hr 13min_
1. Agentic Rag Intuition
2. Planner and responder node
3. Flash Rank Re-ranking
4. Qdrant and Re-rank Service
5. Retriver node and building agentic graph
6. API and UI development
7. Local Testing and Assignments
8. Docker container in Artifact Registry
9. Cloud Run App deployment

### 24. Project 1 - Adding LLM security — _14 lectures • 3hr 33min_
1. Why we need guardrails
2. Integration guardrails in our system
3. Why we need gateways
4. Integrating gateways in our App
5. Why we need to evaluate our app
6. Different LLM evaluation terminologies
7. Various Evaluation Frameworks
8. Token Efficieny and experiment notebook setup
9. Faithfullnes , Answer relevancy , Context Precision
10. Context Recall , Answer and tool correctness
11. Understanding Evaluations integration process
12. Eval pipeline phase 1
13. Eval Pipeline Phase 2
14. Final Evaluation App Testing

### 25. Project - 2 : Agentic AI Research Platform with Security, Red Teaming & Memory — _21 lectures • 4hr 26min_
1. 01_Problem Statement
2. 02_What will Students learn in this Project
3. 03_Most Asked Questions
4. 04_Project Architecture Explained
5. 05_How Terraform Works
6. 06_Installing and Setting Up our Terraform and AWS CLI
7. 07_Terraform Infrastructure Setup for AWS
8. 08_App Requirements and Configuration
9. 09_Retry Logic and Database Connection Pool
10. 10_Authentication , Guardrails and Caching
11. 11_Memory and Queueing
12. 12_Multi-Agent AI System
13. 13_LLM Evaluation using Langsmith and Output Formats
14. 14_FastAPI Main Code and Dockerfile
15. 15_TensorZero Configuration
16. 16_PYRIT Red Teaming Dashboard
17. 17_Frontend Code and Github Configuration
18. 18_GitHub Actions CI-CD
19. 19_Full Deployment of the Project
20. 20_Full Testing of the Project
21. 21_How to make this project better ?

### 26. Claude Code For Developers — _7 lectures • 2hr 17min_
1. Claude Ecosystem
2. Claude Code Working
3. Agents With Claude Code
4. Agent Views In Claude Code
5. Agent Teams In Claude Code
6. Hooks Claude Code
7. Skills And Plugins

### 27. Building Deep Agents With Langchain — _8 lectures • 2hr 42min_
1. What Are Deep Agents And Its basics Implementation
2. Deep Agents Customization
3. Deep Agents Vs Claude SDK
4. Backend In Deep Agents
5. Context Engineering- In put Context and Memory
6. Skills Context Engineering
7. Subagents Deep Agents
8. Deep Agents Projects With All Features
