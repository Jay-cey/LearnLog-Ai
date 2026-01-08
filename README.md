# LearnLog AI

An intelligent, visually stunning daily learning tracker that uses AI to validate authentic learning entries.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, GSAP
- **Backend**: FastAPI, Python 3.11+, PostgreSQL (pgvector), Redis
- **AI**: SentenceTransformers, Scikit-learn

## Getting Started (Hybrid Setup - Recommended)

This is the recommended setup for development:
- **Database & Redis**: Run via Docker (easiest setup).
- **Backend & Frontend**: Run locally for fast development.

### Prerequisites

1.  **Docker Desktop** installed and running.
2.  **Node.js 20+**
3.  **Python 3.11+**

### 1. Start Database & Redis
Start the infrastructure containers in the background:
```bash
docker-compose up -d db redis
```

### 2. Start Backend
Run the backend script. This will install Python dependencies and start the server at http://localhost:8000.
```bash
.\run_backend_local.bat
```

### 3. Start Frontend
Run the frontend script. This will start the Next.js server at http://localhost:3000.
```bash
.\run_frontend_local.bat
```
