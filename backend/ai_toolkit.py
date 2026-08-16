"""
AIFlow's AI Toolkit.

If ANTHROPIC_API_KEY is set in .env, these call the real Anthropic API for
genuine AI output. Without a key, they fall back to clearly-labeled mock
output instead — so the toolkit page always works and demos the intended
experience, without requiring anyone to set up billing to try the project.

Get a key at https://console.anthropic.com to switch on real AI output.
"""

import os
import json
import re
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


# ---------- AI Router ----------
# Given a plain-language goal, decides which tools to recommend, whether
# the runnable "lecture-to-quiz" workflow fits, and which toolkit steps
# (if any) would help — instead of the user picking a workflow by hand.

TOOLKIT_STEP_NAMES = {"grammar", "summarize", "explain-code"}


def _contains_any(text: str, phrases: list[str]) -> bool:
    """Word-boundary match so e.g. 'script' doesn't false-match inside 'descriptions'."""
    return any(re.search(r"\b" + re.escape(p) + r"\b", text) for p in phrases)


def _mock_route(goal: str, tools: list[dict]) -> dict:
    goal_lower = goal.lower()

    toolkit_steps = []
    if _contains_any(goal_lower, ["grammar", "proofread", "fix my writing", "correct my"]):
        toolkit_steps.append("grammar")
    if _contains_any(goal_lower, ["summarize", "summarise", "summary", "tl;dr", "condense"]):
        toolkit_steps.append("summarize")
    if _contains_any(goal_lower, ["code", "debug", "function", "script"]):
        toolkit_steps.append("explain-code")

    suggested_workflow = None
    if _contains_any(goal_lower, ["lecture", "notes", "quiz", "flashcard", "study"]):
        suggested_workflow = "lecture-to-quiz"

    words = [w for w in re.findall(r"[a-z]+", goal_lower) if len(w) > 3]
    recommended_slugs = []
    for tool in tools:
        haystack = f"{tool['name']} {tool['category']} {tool['tagline']}".lower()
        if any(re.search(r"\b" + re.escape(w) + r"\b", haystack) for w in words):
            recommended_slugs.append(tool["slug"])
        if len(recommended_slugs) >= 4:
            break

    return {
        "message": (
            "Demo routing (no AI key configured) — matched based on keywords in your goal. "
            "Set ANTHROPIC_API_KEY in backend/.env for real intent-based routing."
        ),
        "recommended_tool_slugs": recommended_slugs,
        "suggested_workflow_slug": suggested_workflow,
        "toolkit_steps": toolkit_steps,
    }


def route_goal(goal: str, tools: list[dict]) -> dict:
    if not ANTHROPIC_API_KEY:
        return _mock_route(goal, tools)

    tool_list_text = "\n".join(
        f"- {t['slug']}: {t['name']} ({t['category']}) — {t['tagline']}" for t in tools
    )
    system = (
        "You are AIFlow's AI Router. Given a user's goal, a list of available directory "
        "tools, and AIFlow's own built-in capabilities, decide the best plan.\n\n"
        "AIFlow's built-in toolkit steps (run directly, not directory links): "
        "'grammar' (fixes grammar/phrasing), 'summarize' (summarizes text), "
        "'explain-code' (explains a code snippet).\n\n"
        "AIFlow's one runnable workflow: 'lecture-to-quiz' — turns pasted notes into "
        "a summary, key concepts, flashcards, and a quiz, in one run.\n\n"
        "Respond with ONLY valid JSON (no markdown fences, no commentary), exactly these keys:\n"
        '{"message": "one or two sentence explanation of the plan for the user", '
        '"recommended_tool_slugs": ["slug", ...] (0-4 slugs from the provided tool list that '
        "genuinely fit, or [] if none fit), "
        '"suggested_workflow_slug": "lecture-to-quiz" or null (only if it genuinely fits), '
        '"toolkit_steps": ["grammar"|"summarize"|"explain-code", ...] (0+ steps, in the order '
        "they should run, only if genuinely useful for this goal)}"
    )
    user_message = f"Goal: {goal}\n\nAvailable directory tools:\n{tool_list_text}"

    raw = call_claude(system, user_message, max_tokens=500)

    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if "\n" in cleaned:
            cleaned = cleaned.split("\n", 1)[1]

    try:
        data = json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        return _mock_route(goal, tools)

    valid_slugs = {t["slug"] for t in tools}
    return {
        "message": str(data.get("message") or "Here's a plan for your goal."),
        "recommended_tool_slugs": [
            s for s in (data.get("recommended_tool_slugs") or []) if s in valid_slugs
        ][:4],
        "suggested_workflow_slug": (
            data.get("suggested_workflow_slug")
            if data.get("suggested_workflow_slug") == "lecture-to-quiz"
            else None
        ),
        "toolkit_steps": [
            s for s in (data.get("toolkit_steps") or []) if s in TOOLKIT_STEP_NAMES
        ],
    }
