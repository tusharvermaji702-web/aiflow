"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

type Meta = {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pageCount: number;
};

export default function MetadataViewerPage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setMeta(null);
    setError(null);
    if (!file) return;
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setMeta({
        title: doc.getTitle() || "—",
        author: doc.getAuthor() || "—",
        subject: doc.getSubject() || "—",
        keywords: doc.getKeywords() || "—",
        creator: doc.getCreator() || "—",
        producer: doc.getProducer() || "—",
        creationDate: doc.getCreationDate()?.toLocaleString() || "—",
        modificationDate: doc.getModificationDate()?.toLocaleString() || "—",
        pageCount: doc.getPageCount(),
      });
    } catch {
      setError("Couldn't read this PDF's metadata.");
    }
  }

  const rows: [string, string][] = meta
    ? [
        ["Title", meta.title],
        ["Author", meta.author],
        ["Subject", meta.subject],
        ["Keywords", meta.keywords],
        ["Creator", meta.creator],
        ["Producer", meta.producer],
        ["Created", meta.creationDate],
        ["Modified", meta.modificationDate],
        ["Pages", String(meta.pageCount)],
      ]
    : [];

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>View PDF Metadata</h1>
        <p className="lede" style={{ marginTop: 8 }}>See a PDF's title, author, and other embedded details.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        {error && <p style={{ fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {meta && (
          <div className="card" style={{ marginTop: 8 }}>
            {rows.map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                <span style={{ color: "var(--ink-faint)" }}>{label}</span>
                <span style={{ fontWeight: 500, textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
