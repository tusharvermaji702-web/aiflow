# AIFlow

AI-powered platform that helps users discover AI tools and turn natural-language
goals into executable AI workflows.

> "Tell AIFlow what you want to accomplish, and it figures out the best way to do it."

This repo is the **Month 1 foundation** from the AIFlow project roadmap:
a Next.js frontend and a FastAPI backend that can talk to each other.

```
aiflow/
├── web/       # Next.js (TypeScript) frontend
├── backend/   # FastAPI backend
└── README.md
```

## Milestone: Month 1

Get `web/` and `backend/` running locally, with the frontend page pulling
live data from the backend API. That's it — no database, no auth, no AI
calls yet. Everything after this builds on top of that connection.

## Running it locally

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` — you should see the interactive API docs,
with `/health` and `/tools` endpoints.

### 2. Frontend (Next.js)

In a second terminal:

```bash
cd web
npm install
cp .env.local.example .env.local
npm run dev
```

Visit `http://localhost:3000` — the page should show "Backend status: AIFlow
backend is running." and list the mock tools. If it shows a connection error,
double check the backend is running on port 8000.

## What's next (per the roadmap)

- **Month 2** — build out the full public-facing UI (Home, Explore, Tools,
  Categories, Tool details, Workflows, About, Pricing, Login, Signup) using
  mock data.
- **Month 3** — add PostgreSQL and real CRUD endpoints for `tools`,
  `categories`, `tags`, `reviews`, `favorites`; replace mock data with a real
  database.
- **Month 4** — authentication.

See the full master documentation for the complete 12-month plan, the AI
Toolkit, Workflow Engine, AI Router, and launch checklist.

## Notes

- CORS on the backend is currently locked to `http://localhost:3000` —
  update `backend/main.py` when you deploy anywhere.
- Never commit `.env` or `.env.local` — only the `.example` versions are
  tracked in git.
