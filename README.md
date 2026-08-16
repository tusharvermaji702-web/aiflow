# AIFlow

AI-powered platform that helps users discover AI tools and turn natural-language
goals into executable AI workflows.

> "Tell AIFlow what you want to accomplish, and it figures out the best way to do it."

```
aiflow/
├── web/       # Next.js (TypeScript) frontend
├── backend/   # FastAPI backend
└── README.md
```

## Status

- ✅ **Month 1** — Frontend/backend foundation
- ✅ **Month 2** — Full UI with design system (10 pages)
- ✅ **Month 3** — Real database (SQLAlchemy models, full CRUD, frontend connected to live data)
- ✅ **Month 4** — Authentication (register/login/me wired end-to-end, token persisted, Navbar reflects login state)
- ✅ **Month 5** — Search & filtering (live text search, category filter, and sort on Tools; live search on Explore)
- ✅ **Month 6** — Saved tools & workflows (save/unsave buttons, `/saved` library page, tied to real user accounts)
- ✅ **Month 7** — AI Toolkit: real AI-powered utilities (Grammar Improver, Text Summarizer, Code Explainer) at `/toolkit`. Works out of the box in demo mode (clearly-labeled mock output); set `ANTHROPIC_API_KEY` to switch on real AI output
- ✅ **Month 8** — Workflow Engine: `/workflows/lecture-to-quiz` actually runs end-to-end (notes → summary → key concepts → flashcards → quiz, 4 chained AI calls). The other 4 workflows still preview their pipeline — they need audio/video/PDF input handling that isn't built yet

## Running it locally

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seed_data.py           # populates the database with starter tools
uvicorn main:app --reload --port 8000
```

By default this uses a local SQLite file (`aiflow.db`) so it runs without
installing Postgres. To use real Postgres, set `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://username:password@localhost:5432/aiflow
```

Visit `http://localhost:8000/docs` for interactive API docs.

### 2. Frontend (Next.js)

In a second terminal:

```bash
cd web
npm install
cp .env.local.example .env.local
npm run dev
```

Visit `http://localhost:3000` — Tools, Categories, and Tool detail pages now
pull live data from the backend. If a page shows a connection error, make
sure the backend is running on port 8000.

## API reference (current)

| Method | Path              | Description                                  |
|--------|-------------------|-----------------------------------------------|
| GET    | `/health`         | Health check                                  |
| GET    | `/tools`          | List tools — supports `?category=` and `?q=`  |
| GET    | `/tools/{slug}`   | Get one tool                                  |
| POST   | `/tools`          | Create a tool                                 |
| PUT    | `/tools/{slug}`   | Update a tool                                 |
| DELETE | `/tools/{slug}`   | Delete a tool                                 |
| GET    | `/categories`     | Categories with live tool counts              |
| POST   | `/auth/register`  | Create a user account, returns a token + user  |
| POST   | `/auth/login`     | Log in, returns a token + user                 |
| GET    | `/auth/me`        | Get the current user (requires Bearer token)  |
| GET    | `/saved`          | List current user's saved items (requires auth, optional `?item_type=`) |
| POST   | `/saved`          | Save a tool or workflow (requires auth)        |
| DELETE | `/saved/{type}/{slug}` | Remove a saved item (requires auth)      |
| POST   | `/toolkit/grammar` | Improve grammar/phrasing of `{text}`         |
| POST   | `/toolkit/summarize` | Summarize `{text}` into notes              |
| POST   | `/toolkit/explain-code` | Explain a code snippet in `{text}`       |
| POST   | `/workflows/lecture-to-quiz/run` | Runs the full notes→quiz pipeline on `{text}`, returns 4 chained step results |

## What's next (per the roadmap)

- **Month 9** — the AI Router: given a plain-language goal, automatically
  pick and chain the right tools instead of the user choosing a workflow
  by hand.
- Wiring up the remaining 4 workflows once audio/video/PDF input handling exists.

See the full master documentation for the complete 12-month plan, the AI
Toolkit, Workflow Engine, AI Router, and launch checklist.

## Notes

- CORS on the backend is currently locked to `http://localhost:3000` —
  update `backend/main.py` when you deploy anywhere.
- Never commit `.env` or `.env.local` — only the `.example` versions are
  tracked in git.
- `SECRET_KEY` in `.env` should be set to a real random string before any
  real deployment — there's a dev-only fallback so it still runs without one.
