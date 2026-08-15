"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Pipeline from "@/components/Pipeline";
import ToolCard from "@/components/ToolCard";
import { WORKFLOWS } from "@/lib/mock-data";
import { fetchTools, ApiTool } from "@/lib/api";

export default function Home() {
  const featuredWorkflow = WORKFLOWS[0];
  const [featuredTools, setFeaturedTools] = useState<ApiTool[]>([]);
  const [toolsError, setToolsError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools()
      .then((tools) => setFeaturedTools(tools.slice(0, 3)))
      .catch(() => setToolsError("Could not reach the backend. Is it running on :8000?"));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="section">
        <div className="shell">
          <p className="eyebrow">AI discovery + workflow automation</p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", marginTop: 12, maxWidth: 780 }}>
            Tell AIFlow what you want to accomplish.
          </h1>
          <p className="lede" style={{ marginTop: 16, fontSize: 20 }}>
            It figures out which tools you need, builds the workflow, and runs it —
            instead of you searching across a dozen AI websites.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/explore" className="btn btn-primary">
              Try AI Search
            </Link>
            <Link href="/tools" className="btn btn-secondary">
              Browse tool directory
            </Link>
          </div>

          <div style={{ marginTop: 48 }}>
            <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 10 }}>
              Example: “I have a two-hour lecture. Make revision notes, flashcards and a 20-question quiz.”
            </p>
            <div style={{ overflowX: "auto" }}>
              <Pipeline steps={featuredWorkflow.steps} />
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="shell grid-2">
          <div>
            <h2 style={{ fontSize: 24 }}>Thousands of AI tools. One problem.</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
              It&apos;s hard to know which tool fits a task, most jobs need several tools chained
              together, and switching between websites wastes time — while existing directories
              stop at discovery and leave the actual work to you.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 24 }}>AIFlow connects discovery and execution.</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: 12 }}>
              Discover → Understand → Recommend → Build → Execute → Save → Share. Describe a goal,
              review the workflow AIFlow builds, then run it — start to finish, in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section className="section">
        <div className="shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ fontSize: 24 }}>Featured tools</h2>
            <Link href="/tools" style={{ fontSize: 14, color: "var(--accent-dark)", fontWeight: 600 }}>
              View all →
            </Link>
          </div>

          {toolsError && (
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-faint)" }}>{toolsError}</p>
          )}

          {!toolsError && featuredTools.length === 0 && (
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-faint)" }}>Loading tools…</p>
          )}

          <div className="grid-cards" style={{ marginTop: 24 }}>
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured workflow */}
      <section className="section" style={{ background: "var(--accent-soft)" }}>
        <div className="shell">
          <p className="eyebrow">Signature feature</p>
          <h2 style={{ fontSize: 24, marginTop: 8 }}>Goal → Workflow</h2>
          <p className="lede" style={{ marginTop: 8 }}>
            {featuredWorkflow.description}
          </p>
          <div style={{ marginTop: 20, overflowX: "auto" }}>
            <Pipeline steps={featuredWorkflow.steps} />
          </div>
          <Link href="/workflows" className="btn btn-primary" style={{ marginTop: 24 }}>
            Explore workflows
          </Link>
        </div>
      </section>
    </main>
  );
}
