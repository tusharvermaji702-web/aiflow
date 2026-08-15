"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories, ApiCategory } from "@/lib/api";

const DESCRIPTIONS: Record<string, string> = {
  Text: "Writing, rewriting, summarizing, and grammar tools.",
  Image: "Generation, editing, and image understanding.",
  Audio: "Transcription, voice, and audio summarization.",
  Documents: "PDF chat, summarizers, and document extraction.",
  Coding: "Code explanation and debugging assistants.",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Could not reach the backend. Is it running on :8000?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Browse</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Categories</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Every tool in the directory belongs to a category — start here if you know
          the kind of work you're doing but not yet which tool fits.
        </p>

        {loading && <p style={{ marginTop: 32, color: "var(--ink-faint)" }}>Loading categories…</p>}

        {!loading && error && (
          <div className="card" style={{ marginTop: 32, borderColor: "#e5b5b5" }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid-cards" style={{ marginTop: 32 }}>
            {categories.map((cat) => (
              <Link key={cat.name} href="/tools" className="card" style={{ display: "block" }}>
                <h3 style={{ fontSize: 18 }}>{cat.name}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>
                  {DESCRIPTIONS[cat.name] ?? "Tools in this category."}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 14, fontFamily: "var(--font-mono)" }}>
                  {cat.count} tool{cat.count !== 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
