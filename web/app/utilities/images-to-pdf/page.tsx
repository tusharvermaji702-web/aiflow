"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked]);
    setDownloadUrl(null);
    setError(null);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  }

  async function handleConvert() {
    if (files.length === 0) return;
    setWorking(true);
    setError(null);
    try {
      const doc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const outBytes = await doc.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't convert these images — only JPG and PNG are supported.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>JPG/PNG to PDF</h1>
        <p className="lede" style={{ marginTop: 8 }}>Combine images into a single PDF, one image per page, in order.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="img-input">Add images</label>
          <input id="img-input" type="file" accept="image/jpeg,image/png" multiple onChange={handleFileChange} />
        </div>

        {files.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "16px 0" }}>
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{i + 1}. {file.name}</span>
                <button onClick={() => removeFile(i)} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleConvert}
          disabled={files.length === 0 || working}
          className="btn btn-primary btn-block"
          style={{ opacity: files.length === 0 || working ? 0.6 : 1 }}
        >
          {working ? "Converting…" : "Convert to PDF"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="images.pdf" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download images.pdf
          </a>
        )}
      </div>
    </main>
  );
}
