# LearnLog AI Backend

FastAPI application for LearnLog AI.

## Setup

1.  Run with Docker Compose from root:
    ```bash
    docker-compose up --build
    ```

2.  Docs available at http://localhost:8000/docs

## Structure

- `app/main.py`: Entry point
- `app/models`: Database models
- `app/schemas`: Pydantic schemas
- `app/routers`: API endpoints
- `app/services`: Business logic (AI Validator)
