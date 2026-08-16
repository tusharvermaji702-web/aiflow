"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

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

  async function handleSplit() {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes);
      const zip = new JSZip();
      for (let i = 0; i < source.getPageCount(); i++) {
        const single = await PDFDocument.create();
        const [page] = await single.copyPages(source, [i]);
        single.addPage(page);
        const singleBytes = await single.save();
        zip.file(`page-${i + 1}.pdf`, singleBytes);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setDownloadUrl(URL.createObjectURL(zipBlob));
    } catch {
      setError("Couldn't split this PDF — make sure it's a valid, unlocked file.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Split PDF</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Upload a PDF — every page is exported as its own file, bundled into a ZIP.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
          {pageCount !== null && <span className="field-hint">{pageCount} pages found</span>}
        </div>

        <button
          onClick={handleSplit}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Splitting…" : "Split into pages"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="split-pages.zip" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download pages.zip
          </a>
        )}
      </div>
    </main>
  );
}
