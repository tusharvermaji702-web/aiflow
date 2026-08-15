"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchTool, fetchTools, ApiTool } from "@/lib/api";

export default function ToolDetailPage() {
  const params = useParams<{ slug: string }>();
  const [tool, setTool] = useState<ApiTool | null>(null);
  const [alternatives, setAlternatives] = useState<ApiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetchTool(params.slug)
      .then((t) => {
        setTool(t);
        return fetchTools({ category: t.category });
      })
      .then((sameCategory) => {
        setAlternatives(sameCategory.filter((t) => t.slug !== params.slug).slice(0, 3));
      })
      .catch((err: Error) => {
        if (err.message.includes("404")) {
          setNotFound(true);
        } else {
          setError("Could not reach the backend. Is it running on :8000?");
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 760 }}>
        <Link href="/tools" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          ← Back to tools
        </Link>

        {loading && <p style={{ marginTop: 24, color: "var(--ink-faint)" }}>Loading tool…</p>}

        {!loading && error && (
          <div className="card" style={{ marginTop: 24, borderColor: "#e5b5b5" }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {!loading && notFound && (
          <div className="card" style={{ marginTop: 24 }}>
            <p style={{ fontWeight: 600 }}>Tool not found.</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>
              It may have been removed, or the link is out of date.
            </p>
          </div>
        )}

        {!loading && tool && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 16 }}>
              <div>
                <p className="eyebrow">{tool.category}</p>
                <h1 style={{ fontSize: 32, marginTop: 6 }}>{tool.name}</h1>
                <p className="lede" style={{ marginTop: 8 }}>{tool.tagline}</p>
              </div>
              <span className="tag" style={{ fontSize: 13 }}>{tool.pricing}</span>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 20, fontSize: 13, color: "var(--ink-faint)" }}>
              <span>★ {tool.rating.toFixed(1)} rating</span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
              {tool.tags.map((t) => (
                <span key={t} className="tag tag-amber">{t}</span>
              ))}
            </div>

            <p style={{ marginTop: 28, color: "var(--ink-soft)", fontSize: 16 }}>{tool.description}</p>

            <div className="grid-2" style={{ marginTop: 32 }}>
              <div>
                <h2 style={{ fontSize: 16 }}>Pros</h2>
                <ul style={{ marginTop: 10, paddingLeft: 20, color: "var(--ink-soft)", fontSize: 14 }}>
                  {tool.pros.map((p) => <li key={p} style={{ marginBottom: 6 }}>{p}</li>)}
                </ul>
              </div>
              <div>
                <h2 style={{ fontSize: 16 }}>Cons</h2>
                <ul style={{ marginTop: 10, paddingLeft: 20, color: "var(--ink-soft)", fontSize: 14 }}>
                  {tool.cons.map((c) => <li key={c} style={{ marginBottom: 6 }}>{c}</li>)}
                </ul>
              </div>
            </div>

            {alternatives.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h2 style={{ fontSize: 16 }}>More in {tool.category}</h2>
                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  {alternatives.map((a) => (
                    <Link key={a.slug} href={`/tools/${a.slug}`} className="card" style={{ padding: "10px 16px" }}>
                      {a.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 40, display: "flex", gap: 10 }}>
              <button className="btn btn-primary">Save tool</button>
              <button className="btn btn-secondary">Use in a workflow</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
