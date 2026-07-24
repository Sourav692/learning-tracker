# DevOps & Deployment — Course Curriculums

Scraped Udemy course curriculums for the **DevOps & deployment foundations** track (Docker, Kubernetes, Terraform, CI/CD, observability) via Playwright MCP. Each course is a `##` section below.

---

## Terraform for the Absolute Beginners with Labs

- **Link:** https://www.udemy.com/course/terraform-for-the-absolute-beginners/
- **Scraped:** 2026-07-24
- **Overview:** 12 sections · 87 lectures. IaC fundamentals → HCL → providers/variables/state → commands → AWS (IAM/S3/DynamoDB/EC2) → remote state → provisioners → import/taint/debug → modules → functions/workspaces.

### Sections
1. Introduction
2. Introduction to Infrastructure as Code — challenges with traditional infra; types of IaC tools; why Terraform
3. Getting Started — install; HCL basics; update & destroy; labs
4. Terraform Basics — providers, configuration directory, multiple providers, input variables, resource attributes, dependencies, output variables
5. Terraform State — intro, purpose of state, state considerations
6. Working with Terraform — commands; mutable vs immutable; lifecycle rules; datasources; meta-arguments (count, for_each); version constraints
7. Terraform with AWS — IAM, policies, S3, DynamoDB (with Terraform)
8. Remote State — remote state & state locking; S3 backend; state commands
9. Terraform Provisioners — EC2 with Terraform; provisioners & behaviour
10. Import, Tainting & Debugging — taint, debugging, import
11. Terraform Modules — creating & using; registry modules
12. Functions & Conditional Expressions — functions, conditionals, workspaces (OSS)

---

## Full stack generative and Agentic AI with python — Docker section only

- **Link:** https://www.udemy.com/course/full-stack-ai-with-python/
- **Scraped:** 2026-07-24
- **Overview:** Only the **"Mastering Docker for Developers"** section (33 lectures · 4hr 58min) is in scope per request. Covers Docker basics → CLI → Dockerfile → networking → volumes → Compose → orchestration & AWS ECS deploy.

### Mastering Docker for Developers – From Basics to CLI and Dockerfile — _33 lectures • 4hr 58min_
- Intro to Docker & containerization; the real-world problem Docker solves; Docker vs VMs; install
- Containers vs images; Docker CLI & common commands; running containers; working with images; container management/debugging
- Dockerfile to containerize a Node.js app; best practices to optimize images; port mapping (manual & auto)
- Publishing images to Docker Hub / private registries; multi-stage builds for production; container security best practices
- Bridge networking; custom bridges for isolation; other networking modes
- Host volumes for data sharing; custom named volumes for persistence
- Docker Compose (intro, networking, volumes); custom builds
- Orchestration intro & why it's crucial; AWS account for ECS; ECR (push images); ECS clusters; task definitions; ECS services + load balancer (HA); cleanup; debugging ECS health-check failures

---

## Docker for the Absolute Beginner - Hands On - DevOps

- **Link:** https://www.udemy.com/course/learn-docker/
- **Scraped:** 2026-07-24
- **Overview:** 11 sections · 60 lectures. Docker fundamentals with hands-on labs → commands → images → Compose → engine/storage/networking → registry → orchestration intro.

### Sections
1. Introduction — why Docker; containers; how Docker works; containers vs VMs; images & registries; Docker & DevOps; install
2. Docker Commands — basic commands (+ labs)
3. Docker Run Commands — image tags; interactive mode; port mapping; volumes & bind mounts; inspect & logs
4. Docker Images — creating images; traditional builds' problems; BuildKit; docker init; CMD vs ENTRYPOINT; environment variables
5. Docker Compose — intro; example voting app with Compose
6. Docker Engine, Storage & Networking — engine; namespaces; cgroups; storage
7. Networking — Docker networking
8. Docker Registry
9. Docker on Mac & Windows
10. Container Orchestration — Docker Swarm; Kubernetes introduction
11. Conclusion — YAML intro

---

## Kubernetes for the Absolute Beginners - Hands-on

- **Link:** https://www.udemy.com/course/learn-kubernetes/
- **Scraped:** 2026-07-24
- **Overview:** 11 sections · 102 lectures. K8s architecture → concepts → YAML → Pods/ReplicaSets/Deployments → networking → Services → microservices → K8s on cloud (GKE/EKS/AKS) → kubeadm multi-node.

### Sections
1. Introduction
2. Kubernetes Overview — containers; orchestration; architecture; Docker vs containerd; Docker deprecation note
3. Kubernetes Concepts — setup (Minikube); Pods
4. YAML Introduction
5. Pods, ReplicaSets, Deployments — Pods with YAML; ReplicaSets; Deployments; updates & rollbacks (rolling updates/rollback)
6. Networking in Kubernetes — basics
7. Services — NodePort; ClusterIP; LoadBalancer
8. Microservices Architecture — deploying the voting app on K8s (with Deployments)
9. Kubernetes on Cloud — GKE, EKS, AKS
10. Conclusion
11. Appendix — multi-node cluster with kubeadm

---

## Observability with Grafana, Prometheus, Loki, Alloy and Tempo — Grafana + Prometheus only

- **Link:** https://www.udemy.com/course/grafana-prometheus-loki-alloy-tempo/
- **Scraped:** 2026-07-24
- **Overview:** Only the **Grafana + Prometheus** sections are in scope per request (Loki, Alloy, Tempo, Mimir, AI, admin/HA sections excluded).

### Foundations of Observability — _7 lectures • 18min_
- Monoliths → microservices: why observability; what is monitoring; methods of monitoring; what is observability; push vs scrape; types of telemetry data

### Installing Prometheus & Collecting Metrics — _23 lectures • 1hr 31min_
- Install Prometheus (Windows/Mac/Linux); collecting metrics; Node Exporter (parts 1–3, run as a service)
- Prometheus data model; data types; PromQL — binary arithmetic/comparison/set operators; matchers & selectors; aggregation operators; time offsets; clamping/checking functions; delta/idelta; sorting & timestamp; aggregations over time

### Installing and Configuring Grafana — _7 lectures • 26min_
- Cloud vs on-prem; install on Ubuntu / RHEL family / Windows / Mac; configuring Grafana; launching Grafana + Prometheus with Docker

### Using Grafana — _18 lectures • 50min_
- Dashboard design best practices; connecting Grafana to Prometheus; creating & managing dashboards; time-series panel; multiple/accumulative queries; data transformations; pie charts; time shift; thresholds; variables & dynamic dashboards; logarithmic scaling; gauge & bar-gauge panels

### Working with Alerts, Notifications & Annotations — _7 lectures • 20min_
- Alerts in Grafana; alert rules; notification policies & contact points; alerts to Slack; silencing; annotations

---

## GitHub Actions - The Complete Guide

- **Link:** https://www.udemy.com/course/github-actions-the-complete-guide/
- **Scraped:** 2026-07-24
- **Overview:** 11 sections · 143 lectures. CI/CD with GitHub Actions: building blocks → workflows/events → artifacts/outputs → env vars & secrets → execution control → Docker containers in jobs → custom actions → security & permissions.

### Sections
1. Getting Started
2. Git & GitHub Crash Course [Optional]
3. GitHub Actions — Basic Building Blocks & Components (workflows, jobs, steps, runners, actions)
4. Workflows & Events — Deep Dive (event triggers, filters)
5. Job Artifacts & Outputs
6. Using Environment Variables & Secrets
7. Controlling Workflow & Job Execution (conditionals, matrix, continue-on-error, caching)
8. Jobs & Docker Containers (container jobs, services)
9. Building & Using Custom Actions (composite, JS, Docker actions)
10. Security & Permissions (GITHUB_TOKEN, permissions, secrets security)
11. Wrap Up
