import Pipeline from "@/components/Pipeline";
import { WORKFLOWS } from "@/lib/mock-data";

export default function WorkflowsPage() {
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
          {WORKFLOWS.map((wf) => (
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
              <button className="btn btn-primary" style={{ marginTop: 18 }}>
                Run this workflow
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
