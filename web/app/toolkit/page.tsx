"use client";

import { useState } from "react";
import { runToolkit } from "@/lib/api";

type ToolConfig = {
  key: "grammar" | "summarize" | "explain-code";
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
  multiline: boolean;
};

const TOOLS: ToolConfig[] = [
  {
    key: "grammar",
    title: "Grammar Improver",
    description: "Paste any text and get it back with grammar, spelling, and phrasing cleaned up.",
    placeholder: "Paste text to clean up…",
    buttonLabel: "Improve grammar",
    multiline: true,
  },
  {
    key: "summarize",
    title: "Text Summarizer",
    description: "Paste a block of text — notes, an article, a transcript — and get a structured summary.",
    placeholder: "Paste text to summarize…",
    buttonLabel: "Summarize",
    multiline: true,
  },
  {
    key: "explain-code",
    title: "Code Explainer",
    description: "Paste a code snippet and get a plain-language walkthrough of what it does.",
    placeholder: "Paste a code snippet…",
    buttonLabel: "Explain code",
    multiline: true,
  },
];

function ToolkitCard({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await runToolkit(tool.key, input);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: 19 }}>{tool.title}</h2>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 6 }}>{tool.description}</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={tool.placeholder}
        rows={6}
        style={{
          width: "100%",
          marginTop: 16,
          padding: 12,
          borderRadius: 8,
          border: "1px solid var(--line)",
          fontFamily: tool.key === "explain-code" ? "var(--font-mono)" : "inherit",
          fontSize: 14,
          resize: "vertical",
        }}
      />

      <button
        onClick={handleRun}
        disabled={loading || !input.trim()}
        className="btn btn-primary"
        style={{ marginTop: 12 }}
      >
        {loading ? "Working…" : tool.buttonLabel}
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#fdecec", border: "1px solid #e5b5b5" }}>
          <p style={{ fontSize: 13, color: "#8a3a3a" }}>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: "var(--accent-soft)" }}>
          <p style={{ fontSize: 12, color: "var(--accent-dark)", fontWeight: 600, marginBottom: 8 }}>Result</p>
          <p style={{ fontSize: 14, color: "var(--ink)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{result}</p>
        </div>
      )}
    </div>
  );
}

export default function ToolkitPage() {
  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">AI Toolkit</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Try AIFlow's own AI tools</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          These are real, working AI utilities — not directory links to other sites.
          They're the building blocks the Workflow Engine will eventually chain together.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32 }}>
          {TOOLS.map((tool) => (
            <ToolkitCard key={tool.key} tool={tool} />
          ))}
        </div>
      </div>
    </main>
  );
}
