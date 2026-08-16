"use client";

import { useState } from "react";
import Link from "next/link";
import Pipeline from "@/components/Pipeline";
import { runWorkflow, WorkflowStepResult } from "@/lib/api";

const STEPS = ["Notes", "Summary / Notes", "Key Concepts", "Flashcards", "20-Question Quiz"];

export default function LectureToQuizPage() {
  const [notes, setNotes] = useState("");
  const [results, setResults] = useState<WorkflowStepResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const steps = await runWorkflow("lecture-to-quiz", notes);
      setResults(steps);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 760 }}>
        <Link href="/workflows" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          ← Back to workflows
        </Link>

        <p className="eyebrow" style={{ marginTop: 16 }}>Workflow</p>
        <h1 style={{ fontSize: 30, marginTop: 8 }}>Notes → Summary, Flashcards & Quiz</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Paste lecture or study notes below. AIFlow chains four AI steps together to turn
          them into a summary, key concepts, flashcards, and a quiz — all in one run.
        </p>

        <div style={{ marginTop: 20, overflowX: "auto" }}>
          <Pipeline steps={STEPS} />
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your notes here…"
          rows={8}
          style={{
            width: "100%",
            marginTop: 24,
            padding: 14,
            borderRadius: 8,
            border: "1px solid var(--line)",
            fontSize: 14,
            resize: "vertical",
          }}
        />

        <button
          onClick={handleRun}
          disabled={loading || !notes.trim()}
          className="btn btn-primary"
          style={{ marginTop: 14 }}
        >
          {loading ? "Running workflow…" : "Run workflow"}
        </button>

        {error && (
          <div className="card" style={{ marginTop: 20, borderColor: "#e5b5b5" }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {results && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
            {results.map((step) => (
              <div key={step.title} className="card">
                <h2 style={{ fontSize: 16 }}>{step.title}</h2>
                <p style={{ fontSize: 14, color: "var(--ink)", marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {step.output}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
