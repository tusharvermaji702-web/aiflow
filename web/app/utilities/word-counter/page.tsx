"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim().length ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    return { words, characters, charactersNoSpaces, sentences, paragraphs };
  }, [text]);

  const STAT_ITEMS: [string, number][] = [
    ["Words", stats.words],
    ["Characters", stats.characters],
    ["Characters (no spaces)", stats.charactersNoSpaces],
    ["Sentences", stats.sentences],
    ["Paragraphs", stats.paragraphs],
  ];

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Word Counter</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Paste or type text below — counts update live.
        </p>

        <div className="grid-cards" style={{ marginTop: 20, marginBottom: 20 }}>
          {STAT_ITEMS.map(([label, value]) => (
            <div key={label} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>
                {value}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here…"
          rows={12}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 8,
            border: "1px solid var(--line)",
            fontSize: 15,
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>
    </main>
  );
}
