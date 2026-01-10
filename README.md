# LearnLog AI

An intelligent, visually stunning daily learning tracker that uses AI to validate authentic learning entries.

## Features

- **Daily Learning Tracker**: Log your daily learning activities and track your progress over time.
- **AI-Powered Validation**: Uses advanced NLP (SentenceTransformers) to verify that your entries are meaningful and authentic.
- **Visual Analytics**: Gain insights into your learning habits with beautiful, interactive charts.
- **Gamification**: Earn achievements and maintain streaks to stay motivated.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, GSAP, Framer Motion
- **Backend**: FastAPI, Python 3.11+, PostgreSQL (pgvector), Redis
- **AI**: SentenceTransformers, Scikit-learn

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Docker Desktop**: Required for the Database and Redis containers.
2.  **Node.js 20+**: Required for the frontend.
3.  **Python 3.11+**: Required for the backend.
4.  **Git**: For version control.

## Project Structure

- `backend/`: FastAPI application code.
- `frontend/`: Next.js application code.
- `docker-compose.yml`: Docker configuration for the entire stack.

## Configuration

### Backend
1.  Navigate to the `backend` directory.
2.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *Note: The default `DATABASE_URL` in `.env.example` is configured to work with the Docker setup.*

### Frontend
1.  Navigate to the `frontend` directory.
2.  (Optional) Create a `.env.local` file if you want to enable Google or GitHub authentication.
    ```env
    # .env.local
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    ```
    *The `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000/api/v1`, which is correct for local development.*

## Getting Started (Hybrid Setup - Recommended)

This setup runs the heavy infrastructure (DB, Redis) in Docker while keeping the application code (Backend, Frontend) running locally for the best development experience (hot reloading, debugging).

### 1. Start Database & Redis

Start the infrastructure containers in the background:

```bash
docker-compose up -d db redis
```

### 2. Start Backend

**Windows:**
```batch
.\run_backend_local.bat
```

**Linux / macOS:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend server will start at [http://localhost:8000](http://localhost:8000).*

### 3. Start Frontend

**Windows:**
```batch
.\run_frontend_local.bat
```
*Note: If this is your first time running the frontend, you may need to run `npm install` inside the `frontend` folder first.*

**Linux / macOS:**
```bash
cd frontend
npm install
npm run dev
```
*The frontend server will start at [http://localhost:3000](http://localhost:3000).*

## Full Docker Setup (Alternative)

If you prefer to run the entire application stack in Docker containers:

1.  Ensure you have set up the `.env` file in the `backend` directory.
2.  Run the following command from the root directory:
    ```bash
    docker-compose up --build
    ```
3.  Access the application:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Troubleshooting

-   **Port Conflicts**: Ensure ports `5432` (Postgres), `6379` (Redis), `8000` (Backend), and `3000` (Frontend) are not being used by other applications.
-   **Database Connection Issues**: If the backend fails to connect to the database, ensure the `db` container is running (`docker ps`) and the `DATABASE_URL` in `backend/.env` matches the credentials in `docker-compose.yml`.
