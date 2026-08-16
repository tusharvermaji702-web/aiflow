"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleWatermark() {
    if (!file || !text.trim()) return;
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 48;
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
          opacity,
          rotate: degrees(45),
        });
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't watermark this PDF — make sure it's a valid, unlocked file.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Add Watermark to PDF</h1>
        <p className="lede" style={{ marginTop: 8 }}>Stamp diagonal text across every page of a PDF.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div className="field">
          <label htmlFor="wm-text">Watermark text</label>
          <input id="wm-text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</label>
          <input
            id="opacity"
            type="range"
            min={0.05}
            max={0.8}
            step={0.05}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleWatermark}
          disabled={!file || !text.trim() || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || !text.trim() || working ? 0.6 : 1 }}
        >
          {working ? "Adding watermark…" : "Add watermark"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="watermarked.pdf" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download watermarked.pdf
          </a>
        )}
      </div>
    </main>
  );
}
