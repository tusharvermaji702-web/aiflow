import { notFound } from "next/navigation";
import Link from "next/link";
import { TOOLS } from "@/lib/mock-data";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = TOOLS.find((t) => t.slug === params.slug);
  if (!tool) notFound();

  const alternatives = TOOLS.filter((t) => tool.alternatives.includes(t.name));

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 760 }}>
        <Link href="/tools" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          ← Back to tools
        </Link>

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
          <span>Last verified {tool.lastVerified}</span>
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
            <h2 style={{ fontSize: 16 }}>Alternatives in the directory</h2>
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
      </div>
    </main>
  );
}
