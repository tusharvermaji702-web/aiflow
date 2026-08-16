"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<"bottom-center" | "bottom-right">("bottom-center");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleAddNumbers() {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const total = doc.getPageCount();

      doc.getPages().forEach((page, i) => {
        const { width } = page.getSize();
        const label = `${i + 1} / ${total}`;
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const x = position === "bottom-center" ? width / 2 - textWidth / 2 : width - textWidth - 36;
        page.drawText(label, { x, y: 24, size: fontSize, font, color: rgb(0.35, 0.35, 0.35) });
      });

      const outBytes = await doc.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't add page numbers — make sure it's a valid, unlocked PDF.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Add Page Numbers</h1>
        <p className="lede" style={{ marginTop: 8 }}>Stamp "1 / N" style page numbers on every page.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="pdf-input">Choose a PDF</label>
          <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div className="field">
          <label htmlFor="position">Position</label>
          <select id="position" value={position} onChange={(e) => setPosition(e.target.value as "bottom-center" | "bottom-right")}>
            <option value="bottom-center">Bottom center</option>
            <option value="bottom-right">Bottom right</option>
          </select>
        </div>

        <button
          onClick={handleAddNumbers}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Adding page numbers…" : "Add page numbers"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="numbered.pdf" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download numbered.pdf
          </a>
        )}
      </div>
    </main>
  );
}
