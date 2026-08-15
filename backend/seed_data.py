"""
Run this once after setting up the database to populate it with starter
tools data (the same tools that used to live in the frontend's mock-data.ts).

    python seed_data.py

Safe to re-run — it skips tools that already exist by slug.
"""

from database import SessionLocal, engine, Base
from models import Tool

Base.metadata.create_all(bind=engine)

SEED_TOOLS = [
    dict(
        slug="whisper", name="Whisper", category="Audio",
        tagline="Speech to text transcription",
        description="Converts spoken audio into accurate text across dozens of languages. Commonly used as the first step in lecture, meeting, and podcast workflows.",
        pricing="Free", tags="transcription,speech-to-text,multilingual",
        pros="High accuracy,Handles accents well,Open source",
        cons="No built-in speaker labels,Slower on long files",
        rating=4.6, website="",
    ),
    dict(
        slug="gpt-4", name="GPT-4", category="Text",
        tagline="General purpose language model",
        description="A large language model used for writing, summarizing, reasoning, and answering questions. The default text engine behind many AIFlow toolkit utilities.",
        pricing="Freemium", tags="writing,summarization,reasoning",
        pros="Versatile,Strong reasoning,Wide plugin support",
        cons="Usage limits on free tier,Can be verbose",
        rating=4.7, website="",
    ),
    dict(
        slug="stable-diffusion", name="Stable Diffusion", category="Image",
        tagline="Text to image generation",
        description="Generates images from text prompts. Runs locally or via hosted APIs, making it a flexible base for product photography and illustration workflows.",
        pricing="Free", tags="image-generation,open-source",
        pros="Free to self-host,Highly customizable,Large model ecosystem",
        cons="Steeper learning curve,Needs a capable GPU locally",
        rating=4.4, website="",
    ),
    dict(
        slug="grammar-improver", name="Grammar Improver", category="Text",
        tagline="Cleans up grammar and phrasing",
        description="Fixes grammar, awkward phrasing, and tone issues in any block of text. Used as a final pass in most AIFlow writing workflows.",
        pricing="Free", tags="grammar,editing",
        pros="Fast,Keeps original meaning,Works on any language pair",
        cons="Not a full style rewrite",
        rating=4.3, website="",
    ),
    dict(
        slug="pdf-summarizer", name="PDF Summarizer", category="Documents",
        tagline="Condenses long PDFs into key points",
        description="Extracts text from PDFs and produces a structured summary with key findings, useful as the first step in research and study workflows.",
        pricing="Free", tags="pdf,summarization,research",
        pros="Handles long documents,Preserves section structure",
        cons="Struggles with scanned/handwritten PDFs",
        rating=4.5, website="",
    ),
    dict(
        slug="pdf-chat", name="PDF Chat", category="Documents",
        tagline="Ask questions directly against a document",
        description="Lets you ask natural-language questions about a PDF's contents instead of reading the whole thing. Pairs well with the PDF Summarizer.",
        pricing="Freemium", tags="pdf,q&a",
        pros="Fast lookups,Cites source pages",
        cons="Free tier caps document size",
        rating=4.2, website="",
    ),
    dict(
        slug="code-explainer", name="Code Explainer", category="Coding",
        tagline="Explains what a code snippet does",
        description="Breaks down unfamiliar code into a plain-language explanation, line by line or at a high level. Useful for onboarding onto new codebases.",
        pricing="Free", tags="coding,learning",
        pros="Supports most languages,Explains at adjustable depth",
        cons="Can miss project-specific context",
        rating=4.4, website="",
    ),
    dict(
        slug="debugging-assistant", name="Debugging Assistant", category="Coding",
        tagline="Finds and explains likely bugs",
        description="Analyzes a code snippet and an error message to suggest likely causes and fixes, with reasoning shown so you can verify it.",
        pricing="Freemium", tags="coding,debugging",
        pros="Explains its reasoning,Works across common languages",
        cons="Not a substitute for a real test suite",
        rating=4.3, website="",
    ),
    dict(
        slug="image-to-text", name="Image to Text", category="Image",
        tagline="OCR and image description",
        description="Extracts text from images (OCR) and can describe image contents for accessibility or cataloguing purposes.",
        pricing="Free", tags="ocr,accessibility",
        pros="Fast,Good on printed text",
        cons="Handwriting accuracy varies",
        rating=4.1, website="",
    ),
]


def run():
    db = SessionLocal()
    added = 0
    try:
        for data in SEED_TOOLS:
            exists = db.query(Tool).filter(Tool.slug == data["slug"]).first()
            if exists:
                continue
            db.add(Tool(**data))
            added += 1
        db.commit()
    finally:
        db.close()
    print(f"Seed complete. Added {added} new tool(s), skipped {len(SEED_TOOLS) - added} already present.")


if __name__ == "__main__":
    run()
