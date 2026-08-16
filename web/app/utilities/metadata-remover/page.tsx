"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function MetadataRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleClean() {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setCreator("");
      doc.setProducer("");
      const now = new Date();
      doc.setCreationDate(now);
      doc.setModificationDate(now);

      const outBytes = await doc.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't clean this PDF's metadata.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Remove PDF Metadata</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Strip title, author, subject, and other identifying details from a PDF.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <button
          onClick={handleClean}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Cleaning…" : "Remove metadata"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="cleaned.pdf" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download cleaned.pdf
          </a>
        )}
      </div>
    </main>
  );
}
