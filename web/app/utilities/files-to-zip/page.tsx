"use client";

import { useState } from "react";
import Link from "next/link";
import JSZip from "jszip";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FilesToZipPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [working, setWorking] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked]);
    setDownloadUrl(null);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  }

  async function handleZip() {
    if (files.length === 0) return;
    setWorking(true);
    try {
      const zip = new JSZip();
      for (const file of files) {
        zip.file(file.name, await file.arrayBuffer());
      }
      const blob = await zip.generateAsync({ type: "blob" });
      setDownloadUrl(URL.createObjectURL(blob));
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Create ZIP File</h1>
        <p className="lede" style={{ marginTop: 8 }}>Bundle any files together into a single ZIP archive.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="files-input">Add files</label>
          <input id="files-input" type="file" multiple onChange={handleFileChange} />
        </div>

        {files.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: "16px 0" }}>
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{file.name} <span style={{ color: "var(--ink-faint)" }}>({formatBytes(file.size)})</span></span>
                <button onClick={() => removeFile(i)} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleZip}
          disabled={files.length === 0 || working}
          className="btn btn-primary btn-block"
          style={{ opacity: files.length === 0 || working ? 0.6 : 1 }}
        >
          {working ? "Zipping…" : "Create ZIP"}
        </button>

        {downloadUrl && (
          <a href={downloadUrl} download="files.zip" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download files.zip
          </a>
        )}
      </div>
    </main>
  );
}
