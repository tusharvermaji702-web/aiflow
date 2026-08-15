"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import { fetchTools, ApiTool } from "@/lib/api";

const EXAMPLES = [
  "product images",
  "research papers",
  "meeting audio",
  "grammar",
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiTool[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(q: string) {
    setQuery(q);
    const trimmed = q.trim();
    if (!trimmed) {
      setSearched(false);
      setResults([]);
      return;
    }

    setSearched(true);
    setLoading(true);
    setError(null);
    try {
      const tools = await fetchTools({ q: trimmed });
      setResults(tools);
    } catch {
      setError("Could not reach the backend. Is it running on :8000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">AI Search</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Describe what you want to accomplish</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Search across every tool's name, tagline, and description — or try a keyword
          below. Full intent-based matching arrives with the AI Router later in the roadmap.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="e.g. transcription, summarizer, image generation"
            style={{
              flex: 1,
              minWidth: 260,
              padding: "14px 16px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontSize: 15,
            }}
            aria-label="Search tools"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleSearch(ex)}
              className="tag"
              style={{ border: "none", cursor: "pointer" }}
            >
              {ex}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          {!searched && (
            <p style={{ color: "var(--ink-faint)" }}>
              Results will appear here as you type — try one of the examples above.
            </p>
          )}

          {searched && loading && (
            <p style={{ color: "var(--ink-faint)" }}>Searching…</p>
          )}

          {searched && !loading && error && (
            <div className="card" style={{ borderColor: "#e5b5b5" }}>
              <p style={{ fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {searched && !loading && !error && results.length === 0 && (
            <div className="card">
              <p style={{ fontWeight: 600 }}>No matching tools yet.</p>
              <p style={{ color: "var(--ink-soft)", marginTop: 6, fontSize: 14 }}>
                Try a different keyword, or browse the{" "}
                <a href="/tools" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
                  full tools list
                </a>{" "}
                instead.
              </p>
            </div>
          )}

          {searched && !loading && !error && results.length > 0 && (
            <>
              <p style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 16 }}>
                {results.length} tool{results.length > 1 ? "s" : ""} matched
              </p>
              <div className="grid-cards">
                {results.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
