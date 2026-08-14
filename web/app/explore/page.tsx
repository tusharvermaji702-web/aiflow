"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/mock-data";

const EXAMPLES = [
  "I need to create realistic product images for my online store.",
  "Turn my research papers into a presentation.",
  "I have messy meeting audio and need clean action items.",
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  function handleSearch(q: string) {
    setQuery(q);
    setSearched(q.trim().length > 0);
  }

  // Simple mock relevance match against tags/description - real matching
  // arrives with the AI Router in a later phase of the roadmap.
  const results = searched
    ? TOOLS.filter((t) =>
        (t.name + t.description + t.tags.join(" ")).toLowerCase().includes(query.toLowerCase().split(" ")[0] ?? "")
      )
    : [];

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">AI Search</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Describe what you want to accomplish</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Skip the keyword search. Tell AIFlow your goal in plain language and it will
          identify the intent, the output you need, and which tools can get you there.
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
            onChange={(e) => setQuery(e.target.value)}
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
              Results will appear here once you search — try one of the examples above.
            </p>
          )}

          {searched && results.length === 0 && (
            <div className="card">
              <p style={{ fontWeight: 600 }}>No matching tools yet.</p>
              <p style={{ color: "var(--ink-soft)", marginTop: 6, fontSize: 14 }}>
                AIFlow&apos;s tool directory is still growing. Try browsing the{" "}
                <a href="/tools" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
                  full tools list
                </a>{" "}
                instead.
              </p>
            </div>
          )}

          {searched && results.length > 0 && (
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
