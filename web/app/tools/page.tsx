"use client";

import { useEffect, useState } from "react";
import ToolCard from "@/components/ToolCard";
import { fetchTools, fetchCategories, ApiTool, ApiCategory } from "@/lib/api";

type SortKey = "rating" | "name";

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const [tools, setTools] = useState<ApiTool[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        /* categories are non-critical; the "All" filter still works without them */
      });
  }, []);

  // Debounce the text search so every keystroke doesn't fire a request.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTools({ category: activeCategory, q: debouncedQuery || undefined })
      .then(setTools)
      .catch(() => setError("Could not reach the backend. Is it running on :8000?"))
      .finally(() => setLoading(false));
  }, [activeCategory, debouncedQuery]);

  const totalToolCount = categories.reduce((sum, c) => sum + c.count, 0);

  const sortedTools = [...tools].sort((a, b) =>
    sortKey === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name)
  );

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">AI Directory</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>All tools</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          {totalToolCount || tools.length} tools across {categories.length || "several"} categories, reviewed and kept up to date.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name or description…"
            aria-label="Search tools"
            style={{
              flex: 1,
              minWidth: 240,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontSize: 14,
            }}
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Sort tools"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontSize: 14,
              background: "var(--surface)",
            }}
          >
            <option value="rating">Sort: Highest rated</option>
            <option value="name">Sort: Name (A–Z)</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {["All", ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn"
              style={{
                padding: "7px 14px",
                fontSize: 13,
                background: activeCategory === cat ? "var(--accent)" : "var(--surface)",
                color: activeCategory === cat ? "#fff" : "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ marginTop: 32, color: "var(--ink-faint)" }}>Loading tools…</p>
        )}

        {!loading && error && (
          <div className="card" style={{ marginTop: 32, borderColor: "#e5b5b5" }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>
              Start the backend with <code>uvicorn main:app --reload --port 8000</code> from the{" "}
              <code>backend</code> folder, then refresh this page.
            </p>
          </div>
        )}

        {!loading && !error && sortedTools.length === 0 && (
          <div className="card" style={{ marginTop: 32 }}>
            <p style={{ fontWeight: 600 }}>No tools match your search.</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>
              Try a different keyword, or clear the category filter.
            </p>
          </div>
        )}

        {!loading && !error && sortedTools.length > 0 && (
          <div className="grid-cards" style={{ marginTop: 28 }}>
            {sortedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
