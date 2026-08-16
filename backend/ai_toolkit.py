"""
AIFlow's AI Toolkit.

If ANTHROPIC_API_KEY is set in .env, these call the real Anthropic API for
genuine AI output. Without a key, they fall back to clearly-labeled mock
output instead — so the toolkit page always works and demos the intended
experience, without requiring anyone to set up billing to try the project.

Get a key at https://console.anthropic.com to switch on real AI output.
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-5"

DEMO_NOTE = (
    "\n\n---\n*This is mock demo output — no AI key is configured. "
    "Set ANTHROPIC_API_KEY in backend/.env for real AI results.*"
)


class ToolkitUpstreamError(Exception):
    """Raised when the Anthropic API itself returns an error."""
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


def call_claude(system: str, user_message: str, max_tokens: int = 1024) -> str:
    try:
        response = httpx.post(
            ANTHROPIC_URL,
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": MODEL,
                "max_tokens": max_tokens,
                "system": system,
                "messages": [{"role": "user", "content": user_message}],
            },
            timeout=30.0,
        )
    except httpx.RequestError as e:
        raise ToolkitUpstreamError(f"Could not reach the AI provider: {e}")

    if response.status_code == 401:
        raise ToolkitUpstreamError(
            "The AI provider rejected the API key. Check ANTHROPIC_API_KEY in backend/.env.",
            status_code=502,
        )
    if response.status_code != 200:
        raise ToolkitUpstreamError(
            f"AI provider returned an error ({response.status_code}).",
            status_code=502,
        )

    data = response.json()
    parts = [block["text"] for block in data.get("content", []) if block.get("type") == "text"]
    return "".join(parts).strip()


# ---------- mock fallbacks (used when no API key is configured) ----------

def _mock_grammar(text: str) -> str:
    cleaned = text.strip()
    if cleaned and not cleaned[0].isupper():
        cleaned = cleaned[0].upper() + cleaned[1:]
    if cleaned and cleaned[-1] not in ".!?":
        cleaned += "."
    return cleaned + DEMO_NOTE


def _mock_summarize(text: str) -> str:
    word_count = len(text.split())
    preview = text.strip()[:120] + ("…" if len(text.strip()) > 120 else "")
    return (
        f"**Summary (demo):** {preview}\n\n"
        f"- Input was {word_count} words\n"
        f"- Key points would be extracted here by the real AI\n"
        f"- A structured takeaway would appear here"
        f"{DEMO_NOTE}"
    )


def _mock_explain_code(code: str) -> str:
    line_count = len(code.strip().splitlines())
    return (
        f"**What this code does (demo):** A {line_count}-line snippet.\n\n"
        f"- A plain-language walkthrough would appear here\n"
        f"- Key functions/logic would be called out here"
        f"{DEMO_NOTE}"
    )


def _mock_key_concepts(text: str) -> str:
    return (
        "**Key concepts (demo):**\n\n"
        "- Concept one would appear here\n"
        "- Concept two would appear here\n"
        "- Concept three would appear here"
        f"{DEMO_NOTE}"
    )


def _mock_flashcards(text: str) -> str:
    return (
        "**Flashcards (demo):**\n\n"
        "1. Q: Sample question one? — A: Sample answer one\n"
        "2. Q: Sample question two? — A: Sample answer two\n"
        "3. Q: Sample question three? — A: Sample answer three"
        f"{DEMO_NOTE}"
    )


def _mock_quiz(text: str) -> str:
    return (
        "**Quiz (demo):**\n\n"
        "1. Sample multiple-choice question one?\n"
        "   a) Option A  b) Option B  c) Option C  d) Option D\n"
        "2. Sample multiple-choice question two?\n"
        "   a) Option A  b) Option B  c) Option C  d) Option D"
        f"{DEMO_NOTE}"
    )


# ---------- public functions ----------

def improve_grammar(text: str) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_grammar(text)
    return call_claude(
        system=(
            "You are a grammar and phrasing editor. Fix grammar, spelling, and awkward "
            "phrasing in the user's text while keeping their meaning and tone intact. "
            "Return ONLY the corrected text, with no preamble, explanation, or quotes around it."
        ),
        user_message=text,
    )


def summarize_text(text: str) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_summarize(text)
    return call_claude(
        system=(
            "You summarize text into clear, structured notes. Produce a short summary "
            "followed by 3-6 bullet points covering the key ideas. Use markdown. "
            "Do not add commentary about the summarization process itself."
        ),
        user_message=text,
        max_tokens=1024,
    )


def explain_code(code: str) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_explain_code(code)
    return call_claude(
        system=(
            "You explain code clearly for someone learning an unfamiliar codebase. "
            "Give a brief high-level summary of what the code does, then a short "
            "walkthrough of the key parts. Use markdown. Be concise — this is an "
            "explanation, not a rewrite or a code review."
        ),
        user_message=code,
        max_tokens=1024,
    )


def extract_key_concepts(text: str) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_key_concepts(text)
    return call_claude(
        system=(
            "Extract the key concepts and terms from the given notes as a markdown "
            "bullet list, one concept per line, each with a one-sentence definition. "
            "Return ONLY the list, no preamble."
        ),
        user_message=text,
        max_tokens=800,
    )


def generate_flashcards(text: str) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_flashcards(text)
    return call_claude(
        system=(
            "Turn the given notes into 6-10 study flashcards. Format each as a "
            "numbered 'Q: ... — A: ...' line in markdown. Return ONLY the flashcards, "
            "no preamble."
        ),
        user_message=text,
        max_tokens=1024,
    )


def generate_quiz(text: str) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_quiz(text)
    return call_claude(
        system=(
            "Write a multiple-choice quiz (8-12 questions) testing understanding of "
            "the given notes. Each question has 4 options (a-d) with one correct answer "
            "marked at the end of each question in the format '(Answer: x)'. Use markdown. "
            "Return ONLY the quiz, no preamble."
        ),
        user_message=text,
        max_tokens=1500,
    )
