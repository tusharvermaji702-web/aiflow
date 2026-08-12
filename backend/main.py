"""
AIFlow Backend - Month 1 Foundation
A minimal FastAPI app that proves the backend is alive and can talk to the frontend.
As the roadmap progresses, this file will split into routers (tools, categories,
workflows, auth, etc.) under an `app/` package - see README for the planned structure.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AIFlow API",
    description="Backend for AIFlow - AI tool discovery and workflow automation platform",
    version="0.1.0",
)

# Allow the local Next.js dev server to call this API.
# Tighten this list before deploying anywhere public.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    message: str


class Tool(BaseModel):
    id: int
    name: str
    category: str
    description: str


# Mock data for now - Month 3 replaces this with a real Postgres-backed table.
MOCK_TOOLS = [
    Tool(id=1, name="Whisper", category="Audio", description="Speech to text transcription."),
    Tool(id=2, name="GPT-4", category="Text", description="General purpose language model."),
    Tool(id=3, name="Stable Diffusion", category="Image", description="Text to image generation."),
]


@app.get("/health", response_model=HealthResponse)
def health_check():
    """Simple endpoint so the frontend (and you) can confirm the backend is running."""
    return HealthResponse(status="ok", message="AIFlow backend is running.")


@app.get("/tools", response_model=list[Tool])
def list_tools():
    """Returns mock AI tools. This is the seed for the real AI Directory (Month 3+)."""
    return MOCK_TOOLS


@app.get("/")
def root():
    return {"message": "Welcome to the AIFlow API. Visit /docs for interactive API docs."}
