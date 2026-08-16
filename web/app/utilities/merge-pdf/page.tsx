"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked]);
    setDownloadUrl(null);
    setError(null);
    e.target.value = ""; // allow re-selecting the same file
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  }

  async function handleMerge() {
    if (files.length < 2) {
      setError("Add at least two PDF files to merge.");
      return;
    }
    setMerging(true);
    setError(null);
    setDownloadUrl(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't merge these files — make sure every file is a valid, unlocked PDF.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Merge PDF</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Pick two or more PDFs. They'll be combined in the order shown below.
          Nothing leaves your browser.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Add PDF files</label>
          <input id="pdf-input" type="file" accept="application/pdf" multiple onChange={handleFileChange} />
        </div>

        {files.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "16px 0" }}>
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="card"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", marginBottom: 8 }}
              >
                <span style={{ fontSize: 14 }}>
                  {i + 1}. {file.name}
                </span>
                <button
                  onClick={() => removeFile(i)}
                  className="btn btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 12 }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleMerge}
          disabled={files.length < 2 || merging}
          className="btn btn-primary btn-block"
          style={{ marginTop: 8, opacity: files.length < 2 || merging ? 0.6 : 1 }}
        >
          {merging ? "Merging…" : "Merge PDFs"}
        </button>

        {error && (
          <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>
        )}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download="merged.pdf"
            className="btn btn-primary btn-block"
            style={{ marginTop: 16, background: "var(--accent-dark)" }}
          >
            Download merged.pdf
          </a>
        )}
      </div>
    </main>
  );
}
