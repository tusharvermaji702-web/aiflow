"use client";

import { useState } from "react";
import Link from "next/link";
import { runRouter, RouterPlan } from "@/lib/api";

const EXAMPLES = [
  "I have lecture notes and want a quiz to study from",
  "Fix the grammar in my cover letter",
  "Explain this Python function to me",
  "I need to generate product images from text",
];

const TOOLKIT_LABELS: Record<string, string> = {
  grammar: "Grammar Improver",
  summarize: "Text Summarizer",
  "explain-code": "Code Explainer",
};

export default function ExplorePage() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<RouterPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);

  async function handleRoute(g: string) {
    setGoal(g);
    if (!g.trim()) return;

    setAsked(true);
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await runRouter(g);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const hasAnyRecommendation =
    plan && (plan.recommended_tools.length > 0 || plan.suggested_workflow_slug || plan.toolkit_steps.length > 0);

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">AI Router</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Tell AIFlow what you want to accomplish</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Describe your goal in plain language. AIFlow figures out which directory tools fit,
          whether a built-in workflow can do the whole job, and which of its own AI utilities
          would help — instead of you searching page by page.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRoute(goal);
          }}
          style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. I need to turn a podcast into blog posts"
            style={{
              flex: 1,
              minWidth: 260,
              padding: "14px 16px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontSize: 15,
            }}
            aria-label="Describe your goal"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Thinking…" : "Get a plan"}
          </button>
        </form>

        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleRoute(ex)}
              className="tag"
              style={{ border: "none", cursor: "pointer" }}
            >
              {ex}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          {!asked && (
            <p style={{ color: "var(--ink-faint)" }}>
              Your plan will appear here — try one of the examples above.
            </p>
          )}

          {asked && loading && (
            <p style={{ color: "var(--ink-faint)" }}>Working out the best plan…</p>
          )}

          {asked && !loading && error && (
            <div className="card" style={{ borderColor: "#e5b5b5" }}>
              <p style={{ fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {asked && !loading && !error && plan && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card" style={{ background: "var(--accent-soft)", border: "none" }}>
                <p style={{ fontSize: 14, color: "var(--accent-dark)" }}>{plan.message}</p>
              </div>

              {plan.suggested_workflow_slug && (
                <div className="card">
                  <p className="eyebrow">Best fit: a full workflow</p>
                  <h2 style={{ fontSize: 18, marginTop: 8 }}>
                    Notes → Summary, Flashcards & Quiz
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 6 }}>
                    This workflow can do the whole job in one run.
                  </p>
                  <Link
                    href={`/workflows/${plan.suggested_workflow_slug}`}
                    className="btn btn-primary"
                    style={{ marginTop: 14 }}
                  >
                    Run this workflow
                  </Link>
                </div>
              )}

              {plan.toolkit_steps.length > 0 && (
                <div className="card">
                  <p className="eyebrow">AIFlow toolkit steps that would help</p>
                  <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                    {plan.toolkit_steps.map((step) => (
                      <Link key={step} href="/toolkit" className="tag" style={{ padding: "8px 14px" }}>
                        {TOOLKIT_LABELS[step] ?? step}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {plan.recommended_tools.length > 0 && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: 12 }}>Directory tools that fit</p>
                  <div className="grid-cards">
                    {plan.recommended_tools.map((tool) => (
                      <Link key={tool.slug} href={`/tools/${tool.slug}`} className="card" style={{ display: "block" }}>
                        <h3 style={{ fontSize: 16 }}>{tool.name}</h3>
                        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>{tool.category}</p>
                        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>{tool.tagline}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!hasAnyRecommendation && (
                <div className="card">
                  <p style={{ fontWeight: 600 }}>Nothing specific matched yet.</p>
                  <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>
                    Try rephrasing your goal, or browse the{" "}
                    <Link href="/tools" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
                      full tools list
                    </Link>{" "}
                    instead.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
