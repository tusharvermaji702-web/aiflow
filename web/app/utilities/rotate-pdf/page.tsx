"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument, degrees } from "pdf-lib";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleRotate() {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.getPages().forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + angle));
      });
      const outBytes = await doc.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't rotate this PDF — make sure it's a valid, unlocked file.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Rotate PDF</h1>
        <p className="lede" style={{ marginTop: 8 }}>Rotate every page in a PDF by 90, 180, or 270 degrees.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div className="field">
          <label htmlFor="angle">Rotate by</label>
          <select id="angle" value={angle} onChange={(e) => setAngle(Number(e.target.value))}>
            <option value={90}>90° clockwise</option>
            <option value={180}>180°</option>
            <option value={270}>270° clockwise (90° counter-clockwise)</option>
          </select>
        </div>

        <button
          onClick={handleRotate}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Rotating…" : "Rotate PDF"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="rotated.pdf" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download rotated.pdf
          </a>
        )}
      </div>
    </main>
  );
}
