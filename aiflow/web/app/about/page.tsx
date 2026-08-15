export default function AboutPage() {
  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 700 }}>
        <p className="eyebrow">About</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Why AIFlow exists</h1>

        <p style={{ marginTop: 24, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7 }}>
          New AI tools launch every week, but finding the right one for a specific task
          is still mostly guesswork — search around, read a few reviews, open five tabs,
          try each one. And most real tasks need more than one tool: transcribe, then
          summarize, then format. Directories stop at discovery. AIFlow doesn&apos;t.
        </p>

        <p style={{ marginTop: 20, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7 }}>
          AIFlow is a single project, built one milestone at a time: first a directory
          you can trust, then a toolkit of small AI-powered utilities, then a workflow
          engine that chains tools together to go from a goal straight to a finished
          output — audio to notes, papers to a presentation, a resume to interview prep.
        </p>

        <h2 style={{ fontSize: 20, marginTop: 40 }}>How it&apos;s built</h2>
        <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.7 }}>
          In the open, in public commits, month by month — directory and design first,
          then the toolkit, then real accounts and data, then workflows, and finally an
          AI Router that recommends the right chain of tools for a goal automatically.
        </p>
      </div>
    </main>
  );
}
