# Prompt Engineering — Course Curriculums

Scraped Udemy course curriculums on **prompt engineering** (via Playwright MCP). Each course is a `##` section below.

The first section synthesizes **what prompt-engineering & prompting topics are actually covered** across the two courses; the full per-course curriculums follow.

---

## 📌 Prompt Engineering & Prompt Topics Covered (synthesis)

A distilled map of the **prompt-engineering / prompting** concepts taught across the two courses below. Non-prompting material (platform tours, coding SDK plumbing, image/video model UIs, RAG/agent infrastructure) is noted separately at the end so the prompting signal stays clean.

### Prompting foundations & principles
- **What prompt engineering is & why it matters** — both courses open here.
- **The Five Principles of Prompting** (Bootcamp): Give Direction, Specify Format, Provide Examples, Evaluate Quality, Divide Labor — with a worksheet/one-pager to apply them.
- **Writing clear instructions** (Bootcamp): detailed/specific instructions, specifying the steps, using delimiters, specifying output length.
- **Detailed & specific prompts + best practices** (Frameworks): the core "good prompt" habits.
- **Prompt templates** — reusable, parameterized prompt structures (Frameworks; also LangChain `ChatPromptTemplate` in the Bootcamp).
- **How models process prompts** (Bootcamp): tokens, chat vs reasoning models, AI hallucinations — the mental model behind prompt behavior.

### Core prompting techniques
- **Role / persona prompting** (both — Frameworks explicitly asks "does it even work?").
- **Few-shot learning / providing examples** (both).
- **Chain-of-Thought (CoT)** prompting (both).
- **Self-consistency sampling** (both).
- **Zero-shot helpers** (Bootcamp): Least-to-Most, Explain-It-Like-I'm-Five, Meta prompting.
- **Emotion prompting** (Bootcamp).
- **Reason + Act (ReAct)** (Bootcamp).
- **Personas of Thought** (Bootcamp).
- **Step-back prompting** (Frameworks).
- **Chain-of-Density** for better summaries (Frameworks).

### Advanced "thought structure" prompting
- **Tree-of-Thought** prompting (Frameworks).
- **Skeleton-of-Thought** prompting (Frameworks).
- **Program-of-Thought** prompting (Frameworks).

### Output shaping & format control
- **Different / structured output formats** (Bootcamp): custom formats, structured outputs.
- **Sentiment analysis, review classification, tagging, claim detection** — task-shaped prompting (Bootcamp).
- **Overcoming max output length / token limits**; pre-warming chats; asking for context (Bootcamp).

### Prompt hyperparameters & tuning
- **Prompt hyperparameters** (Frameworks): temperature & top-p; max tokens & stop sequence (length control); presence & frequency penalty (variety); tuning them together.
- **Prompt tuning** (Frameworks): what it is + the implementation process (soft-prompt tuning, distinct from prompt *writing*).

### Prompt optimization, evaluation & testing
- **What evals are** and why (both).
- **Prompt A/B testing** (Frameworks).
- **Prompt evaluation tools:** PromptFoo (Frameworks); DSPy eval metrics & prompt optimization, prompt testing in Google Sheets no-code, RAG-system evals (Bootcamp).
- **Prompt optimization** as a discipline — optimizing against the 5 principles, advanced optimization, DSPy primer (Bootcamp).
- **Prompt caching** — concept + practice (Bootcamp).

### Prompting beyond text (image / video models)
- **Image prompting (Midjourney & Flux):** style modifiers, negative prompts, weighted terms, permutation prompts, prompt reverse-engineering, prompt token analysis, consistent characters (Bootcamp).
- **Video prompting (Google Veo3):** JSON prompting, multi-shot prompting, spatial prompting with annotated frames (Bootcamp).

### Applied / interview practice
- **Mock-interview roleplays** demonstrating prompt-engineering technique (Frameworks).
- **Text-model prompting projects** — ebooks, SEO articles, PRDs, summarization, thought-leadership posts, etc. (Bootcamp).

### Adjacent (not prompt engineering per se — covered but out of scope for prompting)
- OpenAI API/SDK plumbing (keys, Responses API, streaming, tiktoken, tool calling, structured outputs).
- Retrieval/embeddings/vector DBs & RAG (Supabase PGVector, hybrid retrieval).
- LangChain & LangGraph deep dives; agent architectures (routing, parallelization, orchestrators, evaluator-optimizer).
- Platform/product tours (ChatGPT features, Gemini, LLaMA, Whisper, NotebookLM, Groq) and image/video tooling (Fal, ComfyUI, Kling, Runway).

### Quick take
- **"Prompt Engineering Frameworks & Methodologies"** is the **prompting-pure** course: techniques, thought structures, hyperparameters, tuning, and evaluation — no coding-infra detours.
- **"The Complete Prompt Engineering for AI Bootcamp"** is much broader: it covers all the core + advanced prompting techniques *plus* a full applied AI-engineering stack (APIs, RAG, agents, LangChain/LangGraph, image/video generation, evals).

---

## The Complete Prompt Engineering for AI Bootcamp (2026)

- **Link:** https://www.udemy.com/course/prompt-engineering-for-ai/
- **Scraped:** 2026-07-24
- **Overview:** 21 sections · 216 lectures. Broad prompt-engineering + applied AI-engineering bootcamp spanning text, image, and video models, with coding tracks (OpenAI SDK, RAG, LangChain/LangGraph, agents, evals).

### 1. Introduction — _8 lectures • 14min_
1. Introduction to the Course
2. What is Prompt Engineering?
3. Accessing Resources and Prompts
4. Optional Videos to only do if you Know Coding
5. ChatGPT AI Prompt Pack - 705 Effective Prompts
6. Github Repository for the Course - Coding
7. AI Resource Hub
8. Curriculum Overview

### 2. Five Principles of Prompting — _6 lectures • 37min_
1. Give Direction
2. Specify Format
3. Provide Examples
4. Evaluate Quality
5. Divide Labor
6. Applying The Five Principles + Worksheet & One Pagers

### 3. How Does AI Work? — _3 lectures • 15min_
1. What are Tokens?
2. Chat Models vs Reasoning Models
3. AI Hallucinations

### 4. Deep Dive on ChatGPT — _22 lectures • 1hr 18min_
1. What is ChatGPT?
2. Prompting ChatGPT
3. ChatGPT - Capabilities and Limitations
4. ChatGPT - Search
5. ChatGPT - Deep Research
6. ChatGPT - Data Analysis
7. ChatGPT - Image Generation
8. ChatGPT - Adding Files
9. ChatGPT - Agent Mode
10. ChatGPT - Custom Instructions
11. ChatGPT - Shortcuts
12. ChatGPT - Canvas
13. ChatGPT - Memory
14. ChatGPT - Projects
15. ChatGPT - Scheduled Tasks
16. ChatGPT - Vision
17. Vision Prompting Guide
18. ChatGPT - Desktop Application
19. ChatGPT - Atlas
20. ChatGPT - Study & Learn
21. ChatGPT - Group Chats
22. GPT Store - Building Custom GPTs

### 5. Standard Text Model Practices — _14 lectures • 31min_
1. Role Prompting
2. Different Output Formats
3. Least to Most
4. Explain It Like I'm Five
5. Meta Prompting
6. Overcoming the Maximum Token Output Length
7. Sentiment Analysis
8. Writing Clear Instructions - Detailed Instructions
9. Writing Clear Instructions - Specifying the Steps
10. Writing Clear Instructions - Delimiters
11. Writing Clear Instructions - Specifying Length
12. Ask for Context
13. Pre-Warming Chats
14. Overcoming the Token Limit in ChatGPT

### 6. OpenAI Features & Functionality - Coding — _16 lectures • 1hr 41min_
1. OpenAI Features - Coding
2. Setting up an OpenAI Account & API Key - Coding
3. Using OpenAI Playground & Exploring The Platform - Coding
4. Responses API & Messages - Coding
5. Coding Notebook with Different OpenAI Services - Coding
6. How to Count Tokens using tiktoken - Coding
7. Managing The Message History - Coding
8. What is Streaming? - Coding
9. Rate Limits, Retrying and How to Overcome These Problems
10. Chat Completions vs Responses API - Coding
11. What are Structured Outputs?
12. Structured Outputs for OpenAI - Coding
13. Understanding Tool Calling
14. Tool (Function) Calling
15. Building a Simple Agent with Tools
16. Parallelization of requests with Async OpenAI

### 7. Retrieval, Embeddings and Vector Databases - Coding — _8 lectures • 1hr 20min_
1. Introduction To Retrieval - Coding
2. Understanding Vector Embeddings - Coding
3. Retrieval Augmented Generation (RAG) with Vector Databases - Coding
4. What is Supabase?
5. RAG with Supabase PGVector - Coding
6. Introduction to Hybrid Retrieval with SQL filtering & Embeddings - Coding
7. How to Evaluate Retrievers - Coding
8. Extra Notebooks for Advanced Users - Coding

### 8. Building AI Agents - Coding — _5 lectures • 1hr 13min_
1. AI Agents and Workflows - Coding
2. Multi-Source Customer Support Agent - Coding
3. Introduction to OpenAI Agents SDK - Coding
4. Exercise - Blog Post Generator Agent (Workflow) - Coding
5. Building a Coding Agent - Coding

### 9. Advanced Text Model Techniques - Coding — _11 lectures • 1hr 6min_
1. Role Prompting - Coding
2. Few Shot Learning - Coding
3. Emotion Prompting - Coding
4. Chain of Thought - Coding
5. Self-Consistency Sampling - Coding
6. Reason and Act (ReAct) - Coding
7. Personas of Thought - Coding
8. Prompt Optimization - Coding
9. What is Prompt Caching? - Coding
10. Prompt Caching in Practice - Coding
11. OpenAI Realtime - Example - Coding

### 10. Deep Dive on LangChain - Coding — _17 lectures • 1hr 41min_
1. What Is LangChain? - Coding
2. Installation - Coding
3. Chat Models - Coding
4. Chat Prompt Templates - Coding
5. Streaming - Coding
6. Output Parsers - Coding
7. Summarizing Large Amounts of Text - Coding
8. Document Loaders, Text Splitting & Creating LangChain Documents - Coding
9. Tagging Documents - Coding
10. LCEL - The Runnable Protocol - Coding
11. LCEL - Chat Models, itemgetter & RAG - Coding
12. LCEL - Chat Message History & Memory - Coding
13. LCEL - Creating Multiple Chains - Coding
14. LCEL - Conditional Logic, Branching & Merging - Coding
15. LangChain Vector Databases + The Indexing API - Coding
16. LCEL Configurable Fields - Coding
17. LangChain Agents & Tools - Coding

### 11. Deep Dive On LangGraph - Coding — _9 lectures • 1hr 9min_
1. Introduction To LangGraph - Coding
2. Simple LangGraph Flows - Coding
3. Tool Usage and Persistence - Coding
4. Human In The Loop - Coding
5. Manually Updating The State - Coding
6. Customizing State in LangGraph - Coding
7. Time Travel - Coding
8. RAG in LangGraph (Self Corrective RAG) - Coding
9. Extra Content To Explore In Your Own Time Advanced Branching/Subgraphs - Coding

### 12. AI Text Model Projects — _22 lectures • 3hr 8min_
1. Tell me a funny joke
2. Create an Entire Ebook
3. SEO Blog Articles
4. Thought Leadership Posts
5. Write a PRD
6. Summarize a News Story - Coding
7. Summarizing An Entire Book - Coding
8. Review Classification - Coding
9. Text To Speech using OpenAI - Coding
10. Using LangChain + Llama3 Locally with LMStudio - Coding
11. Transcribing audio from a Youtube Video - Coding
12. Fine-Tuning on Writing Style - Coding
13. Social Media Posting - Coding
14. Progressive Summarization - Coding
15. Reverse Engineering a Publication - Coding
16. Building a GPT wrapper with Flask and HTMX - Coding
17. Qualitative Analysis- Coding
18. Claim Detection - Coding
19. OpenAI Realtime - Twilio Example - Coding
20. Automating Product Descriptions via GPT-V - Coding
21. Automating UX Landing Page Analysis via GPT-V - Coding
22. Memetic Analysis with GPT-V

### 13. Deep Dive on Midjourney v6 — _3 lectures • 16min_
1. What is Midjourney?
2. Prompting Midjourney
3. Midjourney Capabilities and Limitations

### 14. Standard Image Model Practices — _11 lectures • 52min_
1. Style Modifiers
2. Negative Prompts
3. Weighted Terms
4. Realistic Models
5. Midjourney Inpainting (Vary Region)
6. Midjourney Outpainting (Zoom Out / Pan)
7. Consistent Characters
8. Permutations Prompts
9. Prompt Reverse-Engineering
10. Prompt Token Analysis
11. Meme Unbundling

### 15. Advanced Image Generation Techniques — _16 lectures • 1hr 10min_
1. Fal AI Playground
2. Text to Image with Flux
3. Async Text to Image with Flux
4. X/Y/Z Prompt Grids
5. Image Upscaling with Clarity
6. Image to Image with Flux
7. Image Editing with Flux.Kontext
8. Advanced Inpainting with Flux
9. Draw Image Mask with Gradio
10. Segment Anything Masking
11. Advanced Outpainting with Flux
12. Advanced Consistent Characters
13. ControlNet with Flux Pro
14. Fine-Tuning with Flux Lora
15. Image to Video with Kling AI
16. Comfy UI

### 16. AI Image Model Projects — _7 lectures • 51min_
1. AI Custom Illustrations
2. Making a Brand Logo
3. AI Stock Photos
4. Runway - Creating b-roll footage
5. Product Placement - Coding
6. Tagging Ad Creative - Coding
7. AI Profile Picture - Coding

### 17. Prompt Optimization & Evals — _9 lectures • 2hr 45min_
1. What are Evals (Evaluations)?
2. LLM & Image Model Performance: Advanced Evaluation Strategies - Coding
3. Prompt Testing in GSheets (without code)
4. Eval for a RAG system (special guest*)
5. Prompt Optimization with DSPy - Coding
6. Eval metrics with DSPy - Coding
7. Prompt Optimization: 5 Principles of Prompting - Coding
8. Prompt Optimization: Advanced - Coding
9. DSPy Primer (with the Every team)

### 18. Agent Architectures - Coding — _8 lectures • 58min_
1. Prompt Chaining - Coding
2. Routing - Coding
3. Parallelization - Coding
4. LLM Orchestrators - Coding
5. Agents - Coding
6. Mixture of Experts - Aggregator
7. Evaluator Optimizer - Coding
8. Additional Agent Architectures - Coding

### 19. Deep Dive on Google Veo3 — _7 lectures • 22min_
1. What is Google Veo3?
2. Prompting Google Veo3 in Flow
3. JSON Prompting Veo3
4. Multi-Shot Prompting with Veo3
5. Frames to Video in Google Flow
6. Ingredients to Video in Google Flow
7. Spatial Prompting with Annotated Frames using Veo3

### 20. Deep Dive on other AI Models — _11 lectures • 50min_
1. What is Google Gemini?
2. Gemini 2.0 Native Image Generation
3. Google Gemini - Deep Research
4. What is Meta LLaMA?
5. Runway ML
6. What is Google Vision?
7. What is OpenAI Whisper?
8. Testing Open-Source Models
9. What is Flux?
10. Google NotebookLM
11. Groq Cloud

### 21. Conclusion — _3 lectures • 7min_
1. Free PDF Prompt Engineering Book (CH01)
2. Sources of Inspiration
3. Next steps after the course

---

## Prompt Engineering Frameworks & Methodologies

- **Link:** https://www.udemy.com/course/prompt-engineering-frameworks/
- **Scraped:** 2026-07-24
- **Overview:** 8 sections · 36 lectures. A focused, prompting-pure course on frameworks, thought structures, hyperparameters, prompt tuning, and evaluation — with mock-interview roleplays.

### 1. Introduction — _3 lectures • 14min_
1. Introduction and course resources
2. What is Prompt Engineering and why we need it?
3. This is a milestone

### 2. Prompt engineering basics and best practices — _3 lectures • 22min_
1. Key to good prompting - Detailed and Specific prompts
2. Prompting best practices
3. Prompt templates
4. Quiz

### 3. Prompting frameworks — _7 lectures • 41min_
1. Chain-of-thought prompting
2. Step-back prompting
3. Role prompting - does it even work?
4. Self-consistency
5. Chain-of-Density for better summaries
6. Quiz
7. About the upcoming roleplay
8. Applying Prompt Engineering Techniques in a Mock Interview

### 4. Thought structures — _3 lectures • 29min_
1. Tree-of-thought prompting
2. Skeleton-of-thought prompting
3. Program-of-thought prompting
4. Quiz

### 5. Prompt hyperparameters and their tuning — _5 lectures • 36min_
1. What are prompt hyperparameters
2. Temperature and top-p
3. Max tokens and Stop sequence for controlling length of output
4. Presence penalty and frequency penalty for variety in response
5. Tuning prompt parameters
6. Quiz

### 6. Prompt tuning — _2 lectures • 13min_
1. What is prompt tuning
2. Process of implementing prompt tuning
3. Quiz

### 7. Prompt evaluation — _5 lectures • 35min_
1. Three ways of evaluating prompts
2. Prompt A/B testing
3. Prompt evaluation using PromptFoo
4. Quiz
5. Interview Role Play: Demonstrating Prompt Engineering Knowledge
6. The final milestone!

### 8. Conclusion — _2 lectures • 2min_
1. About your certificate
2. Bonus Lecture
