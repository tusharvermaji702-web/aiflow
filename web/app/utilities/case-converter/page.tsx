"use client";

import { useState } from "react";
import Link from "next/link";

function toTitleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function toSentenceCase(s: string) {
  const lower = s.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}
function toCamelCase(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
function toSnakeCase(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const TRANSFORMS: [string, (s: string) => string][] = [
  ["UPPERCASE", (s) => s.toUpperCase()],
  ["lowercase", (s) => s.toLowerCase()],
  ["Title Case", toTitleCase],
  ["Sentence case", toSentenceCase],
  ["camelCase", toCamelCase],
  ["snake_case", toSnakeCase],
];

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const output = active ? TRANSFORMS.find(([name]) => name === active)?.[1](text) ?? "" : "";

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Case Converter</h1>
        <p className="lede" style={{ marginTop: 8 }}>Paste text, pick a case style.</p>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActive(null);
          }}
          placeholder="Type or paste text…"
          rows={6}
          style={{ width: "100%", marginTop: 20, padding: "14px 16px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 15, fontFamily: "inherit", resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {TRANSFORMS.map(([name]) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={active === name ? "btn btn-primary" : "btn btn-secondary"}
              style={{ fontSize: 13 }}
            >
              {name}
            </button>
          ))}
        </div>

        {active && (
          <div className="card" style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 8 }}>{active} result</p>
            <p style={{ whiteSpace: "pre-wrap", fontSize: 15 }}>{output}</p>
            <button onClick={handleCopy} className="btn btn-secondary" style={{ marginTop: 12 }}>
              {copied ? "Copied!" : "Copy result"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
