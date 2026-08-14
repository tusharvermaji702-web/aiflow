import Link from "next/link";
import type { Tool } from "@/lib/mock-data";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="card" style={{ display: "block" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ fontSize: 17 }}>{tool.name}</h3>
        <span className="tag">{tool.pricing}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 4 }}>{tool.category}</p>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 10 }}>{tool.tagline}</p>
      <div style={{ marginTop: 14, fontSize: 13, color: "var(--amber)", fontWeight: 600 }}>
        ★ {tool.rating.toFixed(1)}
      </div>
    </Link>
  );
}
