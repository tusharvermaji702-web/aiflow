"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type DiffLine = { type: "same" | "added" | "removed"; text: string };

function diffLines(a: string[], b: string[]): DiffLine[] {
  const m = a.length;
  const n = b.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: "removed", text: a[i] });
      i++;
    } else {
      result.push({ type: "added", text: b[j] });
      j++;
    }
  }
  while (i < m) {
    result.push({ type: "removed", text: a[i] });
    i++;
  }
  while (j < n) {
    result.push({ type: "added", text: b[j] });
    j++;
  }
  return result;
}

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");

  const diff = useMemo(() => diffLines(original.split("\n"), changed.split("\n")), [original, changed]);

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 8,
    border: "1px solid var(--line)",
    fontSize: 13,
    fontFamily: "var(--font-mono)",
    resize: "vertical",
  };

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 900 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Text Diff Checker</h1>
        <p className="lede" style={{ marginTop: 8 }}>Compare two blocks of text, line by line.</p>

        <div className="grid-2" style={{ marginTop: 20, gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Original</label>
            <textarea value={original} onChange={(e) => setOriginal(e.target.value)} rows={10} style={textareaStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Changed</label>
            <textarea value={changed} onChange={(e) => setChanged(e.target.value)} rows={10} style={textareaStyle} />
          </div>
        </div>

        {(original || changed) && (
          <div className="card" style={{ marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 13 }}>
            {diff.map((line, i) => (
              <div
                key={i}
                style={{
                  padding: "2px 8px",
                  background: line.type === "added" ? "var(--accent-soft)" : line.type === "removed" ? "var(--amber-soft)" : "transparent",
                  color: line.type === "added" ? "var(--accent-dark)" : line.type === "removed" ? "var(--amber)" : "var(--ink)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {line.type === "added" ? "+ " : line.type === "removed" ? "− " : "  "}
                {line.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
