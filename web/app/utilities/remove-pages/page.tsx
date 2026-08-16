"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { parsePageRanges } from "@/lib/pageRanges";

export default function RemovePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setDownloadUrl(null);
    setError(null);
    setPageCount(null);
    if (picked) {
      try {
        const bytes = await picked.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        setPageCount(doc.getPageCount());
      } catch {
        setError("Couldn't read this PDF.");
      }
    }
  }

  async function handleRemove() {
    if (!file || !pageCount) return;
    const toRemove = new Set(parsePageRanges(ranges, pageCount));
    if (toRemove.size === 0) {
      setError("Enter at least one valid page number, e.g. 1,3,5-7");
      return;
    }
    if (toRemove.size >= pageCount) {
      setError("That would remove every page — leave at least one.");
      return;
    }
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes);
      const keepIndices = source.getPageIndices().filter((i) => !toRemove.has(i));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(source, keepIndices);
      pages.forEach((p) => out.addPage(p));
      const outBytes = await out.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't process this PDF.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Delete PDF Pages</h1>
        <p className="lede" style={{ marginTop: 8 }}>Remove specific pages from a PDF, keep the rest.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
          {pageCount !== null && <span className="field-hint">{pageCount} pages found</span>}
        </div>

        {pageCount !== null && (
          <div className="field">
            <label htmlFor="ranges">Pages to delete</label>
            <input
              id="ranges"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="e.g. 1,3,5-7"
            />
            <span className="field-hint">Comma-separated numbers or ranges.</span>
          </div>
        )}

        <button
          onClick={handleRemove}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Removing…" : "Delete pages"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="pages-removed.pdf" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download result
          </a>
        )}
      </div>
    </main>
  );
}
