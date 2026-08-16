"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pipeline from "@/components/Pipeline";
import { WORKFLOWS } from "@/lib/mock-data";
import { fetchSavedItems, saveItem, unsaveItem } from "@/lib/saved";
import { useAuth } from "@/lib/AuthContext";

const RUNNABLE_SLUGS = new Set(["lecture-to-quiz"]);

export default function WorkflowsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());
  const [busySlug, setBusySlug] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchSavedItems(token, "workflow")
      .then((items) => setSavedSlugs(new Set(items.map((i) => i.item_slug))))
      .catch(() => {
        /* non-critical */
      });
  }, [token]);

  async function toggleSave(slug: string, title: string) {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    setBusySlug(slug);
    try {
      if (savedSlugs.has(slug)) {
        await unsaveItem(token, "workflow", slug);
        setSavedSlugs((prev) => {
          const next = new Set(prev);
          next.delete(slug);
          return next;
        });
      } else {
        await saveItem(token, { item_type: "workflow", item_slug: slug, item_name: title });
        setSavedSlugs((prev) => new Set(prev).add(slug));
      }
    } catch {
      /* silently ignore */
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Workflow Engine</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Workflows</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Multi-step pipelines that chain several tools together to go from a goal to
          a finished output. Run one as-is, or use it as a starting point for your own.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
          {WORKFLOWS.map((wf) => {
            const isSaved = savedSlugs.has(wf.slug);
            return (
              <div key={wf.slug} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span className="tag">{wf.category}</span>
                    <h2 style={{ fontSize: 19, marginTop: 8 }}>{wf.title}</h2>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>
                    {wf.runs.toLocaleString()} runs
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>{wf.description}</p>
                <div style={{ marginTop: 16, overflowX: "auto" }}>
                  <Pipeline steps={wf.steps} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
                  {RUNNABLE_SLUGS.has(wf.slug) ? (
                    <Link href={`/workflows/${wf.slug}`} className="btn btn-primary">
                      Run this workflow
                    </Link>
                  ) : (
                    <>
                      <button className="btn btn-secondary" disabled>
                        Run this workflow
                      </button>
                      <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                        Coming soon — needs {wf.steps[0].toLowerCase()} support
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => toggleSave(wf.slug, wf.title)}
                    disabled={busySlug === wf.slug}
                    className="btn btn-secondary"
                  >
                    {isSaved ? "✓ Saved" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
