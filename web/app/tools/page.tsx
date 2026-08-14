"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import { TOOLS, CATEGORIES } from "@/lib/mock-data";

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All" ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">AI Directory</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>All tools</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          {TOOLS.length} tools across {CATEGORIES.length} categories, reviewed and kept up to date.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
          {["All", ...CATEGORIES.map((c) => c.name)].map((cat) => (
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

        {filtered.length === 0 ? (
          <div className="card" style={{ marginTop: 32 }}>
            <p style={{ fontWeight: 600 }}>No tools in this category yet.</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>
              Check back soon, or browse another category.
            </p>
          </div>
        ) : (
          <div className="grid-cards" style={{ marginTop: 28 }}>
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
