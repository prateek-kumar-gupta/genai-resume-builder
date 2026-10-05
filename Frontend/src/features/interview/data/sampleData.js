export const sampleJobDescriptions = [
    {
        id: "fullstack",
        label: "Senior Full-Stack Engineer (React & Node.js)",
        text: `Role: Senior Full-Stack Engineer
Location: Remote / Hybrid
Experience: 3-5+ Years

Key Responsibilities:
- Design, build, and maintain scalable web applications utilizing React, TypeScript, Node.js, and Express.
- Architect RESTful APIs and real-time WebSocket communication pipelines.
- Optimize database schemas and queries using MongoDB and PostgreSQL.
- Implement secure authentication mechanisms (JWT, OAuth 2.0, HTTP-only cookie flows).
- Collaborate with product designers and engineers to deliver intuitive, accessible user interfaces.
- Ensure high performance, high test coverage (Jest, Playwright), and robust CI/CD deployments on AWS.

Requirements:
- Strong proficiency in modern JavaScript/TypeScript, React 18/19, state management, and modern CSS/SCSS.
- Proven backend experience with Node.js, Express, async handling, and distributed caching (Redis).
- Solid knowledge of database design, indexing, and aggregation pipelines in MongoDB.
- Familiarity with Docker, container orchestration, and cloud infrastructure.
- Excellent problem-solving skills and communication in cross-functional teams.`
    },
    {
        id: "frontend",
        label: "Lead Frontend Engineer (React & UI/UX)",
        text: `Role: Lead Frontend Engineer
Company: Next-Gen SaaS Platform
Experience: 4+ Years

What You'll Do:
- Lead the architecture and implementation of responsive, high-performance web applications using React, Next.js, and modern styling libraries.
- Drive web performance optimization initiatives focusing on Core Web Vitals (LCP, INP, CLS).
- Build and maintain a scalable design system with reusable components, micro-animations, and full WCAG 2.1 AA accessibility compliance.
- Mentor junior and mid-level frontend engineers and run rigorous code reviews.

Must Have:
- Deep expertise in JavaScript (ES6+), TypeScript, React Hooks, and performance profiling.
- Strong command of CSS3, SCSS, modern CSS layouts (Grid, Flexbox, Container Queries), and UI animation.
- Experience with unit and integration testing using Vitest, React Testing Library, and Cypress.
- Passion for user experience, typography, micro-interactions, and visual craftsmanship.`
    },
    {
        id: "aiml",
        label: "AI / Machine Learning Application Engineer",
        text: `Role: AI Applications Software Engineer
Focus: LLMs, Generative AI & Python/Node Backends
Experience: 2+ Years

Responsibilities:
- Build production-ready GenAI applications integrating Google Gemini, OpenAI, and Anthropic APIs.
- Design structured prompt engineering workflows, function calling, and Retrieval-Augmented Generation (RAG) pipelines.
- Develop reliable backend endpoints with Node.js / FastAPI to serve AI predictions with low latency and streaming responses.
- Implement rate limiting, vector database indexing (Pinecone / Chroma), and evaluation benchmarks.

Qualifications:
- Hands-on experience developing applications with Large Language Models and prompt tuning.
- Strong proficiency in JavaScript/TypeScript and/or Python.
- Understanding of embeddings, semantic search, and RAG architectures.
- Experience with full-stack development, modern web APIs, and cloud deployments.`
    }
];

export const sampleDemoReport = {
    title: "Senior Full-Stack Engineer (React & Node.js)",
    matchScore: 86,
    user: "demo-user",
    createdAt: new Date().toISOString(),
    skillGaps: [
        {
            skill: "Docker & Container Orchestration",
            severity: "medium"
        },
        {
            skill: "Distributed Caching with Redis",
            severity: "low"
        },
        {
            skill: "Automated End-to-End Testing (Playwright / Cypress)",
            severity: "medium"
        }
    ],
    technicalQuestions: [
        {
            question: "How do you handle state synchronization and race conditions when multiple async API calls update shared React state?",
            intention: "Assessing understanding of React 19/18 concurrent rendering, cleanup functions in useEffect, AbortController, and optimistic UI updates.",
            answer: "Explain using AbortController inside effects or custom hooks to cancel stale HTTP requests. Mention React's useTransition or state management libraries (TanStack Query / Zustand) with query keys, deduplication, and optimistic update rollback strategies."
        },
        {
            question: "How would you optimize a slow MongoDB aggregation query handling millions of documents?",
            intention: "Testing knowledge of MongoDB index creation (compound indexes, covered queries), explain() execution statistics, and aggregation pipeline staging order.",
            answer: "Walk through using explain('executionStats') to identify COLLSCAN vs IXSCAN. Place $match and $project as early as possible in the pipeline to reduce document volume. Ensure compound indexes cover query fields in ESR (Equality, Sort, Range) order."
        },
        {
            question: "Explain how you implement secure JWT authentication using HTTP-only cookies while mitigating XSS and CSRF risks.",
            intention: "Evaluating full-stack security acumen, understanding of browser storage vulnerabilities, and real-world auth architecture.",
            answer: "Explain storing tokens in HTTP-only, Secure, SameSite=Lax/Strict cookies to eliminate JavaScript token theft via XSS. Discuss CSRF mitigation using SameSite protection or Double Submit Cookie / Anti-CSRF header tokens, short-lived access tokens with refresh token rotation."
        }
    ],
    behavioralQuestions: [
        {
            question: "Describe a situation where you identified a critical performance bottleneck in production right before a major launch. How did you resolve it?",
            intention: "Assessing composure under pressure, root-cause diagnostics, cross-team communication, and delivery focus.",
            answer: "Use the STAR technique: Situation (high traffic launch deadline, unexpected latency spike), Task (isolate and fix without delaying launch), Action (used DevTools/profiler, spotted unmemoized heavy re-renders and N+1 DB queries, applied caching & virtualization), Result (latency dropped 72%, launched smoothly on schedule)."
        },
        {
            question: "Tell me about a disagreement you had with a product manager or team lead regarding technical debt versus new features.",
            intention: "Evaluating business empathy, negotiation skills, and ability to advocate for technical health using quantifiable business impact.",
            answer: "Highlight focusing on business outcomes: explain how you translated technical debt (e.g. refactoring auth or API layers) into business metrics like reduced bug rates, faster feature velocity, and lower server costs, agreeing on a dedicated 20% sprint allocation."
        }
    ],
    preparationPlan: [
        {
            day: 1,
            focus: "System Architecture & Core React Deep-Dive",
            tasks: [
                "Review React 18/19 rendering pipeline, Concurrent Mode, and memoization rules.",
                "Practice state management tradeoffs: Context vs Zustand vs TanStack Query.",
                "Draft explanations for component lifecycle and custom hooks."
            ]
        },
        {
            day: 2,
            focus: "Node.js Concurrency, Streams & Event Loop",
            tasks: [
                "Refresh Node.js event loop phases: microtasks, timers, and I/O polling.",
                "Review Express middleware chains, error handling, and async wrappers.",
                "Build a fast prototype demonstrating streaming or chunked HTTP responses."
            ]
        },
        {
            day: 3,
            focus: "Database Schema Design & Query Optimization",
            tasks: [
                "Review MongoDB indexing strategies (compound indexes, TTL, partial indexes).",
                "Practice writing complex aggregation queries ($lookup, $facet, $unwind).",
                "Understand ACID transactions in MongoDB and connection pooling best practices."
            ]
        },
        {
            day: 4,
            focus: "Security, Authentication & API Hardening",
            tasks: [
                "Practice explaining JWT refresh token rotation with HTTP-only cookies.",
                "Review OWASP Top 10 vulnerabilities (CORS, CSRF, XSS, rate-limiting, injection).",
                "Implement Helmet.js, express-rate-limit, and sanitize inputs in your mental checklist."
            ]
        },
        {
            day: 5,
            focus: "System Design & Scalability Scenarios",
            tasks: [
                "Diagram a scalable real-time notification or chat system.",
                "Study distributed caching with Redis (cache-aside, write-through, TTL eviction).",
                "Review load balancing, horizontal scaling, and database replication."
            ]
        },
        {
            day: 6,
            focus: "Behavioral Scenarios & STAR Stories",
            tasks: [
                "Formulate 4 STAR stories: conflict resolution, leadership, failure/learning, and high-impact delivery.",
                "Practice 2-minute concise elevator pitch introducing your background and passion.",
                "Prepare 5 insightful questions to ask the interviewer about their engineering culture."
            ]
        },
        {
            day: 7,
            focus: "Mock Interview Simulation & Final Polish",
            tasks: [
                "Simulate a 45-minute live technical coding session out loud.",
                "Conduct a 30-minute system design mock interview on a whiteboard/canvas.",
                "Get good rest, prepare audio/camera setup, and review key project accomplishments."
            ]
        }
    ]
};
