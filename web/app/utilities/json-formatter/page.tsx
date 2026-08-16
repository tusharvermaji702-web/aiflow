"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function format(minify: boolean) {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
      setOutput("");
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>JSON Formatter</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Paste JSON on the left, format or minify it, copy the result.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <button onClick={() => format(false)} className="btn btn-primary">
            Format (pretty)
          </button>
          <button onClick={() => format(true)} className="btn btn-secondary">
            Minify
          </button>
          <button onClick={handleCopy} disabled={!output} className="btn btn-secondary" style={{ opacity: output ? 1 : 0.6 }}>
            {copied ? "Copied!" : "Copy result"}
          </button>
        </div>

        {error && <p style={{ marginTop: 12, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        <div className="grid-2" style={{ marginTop: 20, gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"example": true}'
              rows={16}
              style={textareaStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Output
            </label>
            <textarea value={output} readOnly rows={16} style={{ ...textareaStyle, background: "var(--surface)" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
