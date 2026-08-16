"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setDownloadUrl(null);
    setError(null);
    if (!picked) return;
    const img = new Image();
    const url = URL.createObjectURL(picked);
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = url;
    });
    setOriginalDims({ w: img.width, h: img.height });
    setWidth(img.width);
    setHeight(img.height);
    URL.revokeObjectURL(url);
  }

  function handleWidthChange(w: number) {
    setWidth(w);
    if (lockAspect && originalDims) {
      setHeight(Math.round((w * originalDims.h) / originalDims.w));
    }
  }

  function handleHeightChange(h: number) {
    setHeight(h);
    if (lockAspect && originalDims) {
      setWidth(Math.round((h * originalDims.w) / originalDims.h));
    }
  }

  async function handleResize() {
    if (!file || width <= 0 || height <= 0) return;
    setWorking(true);
    setError(null);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Couldn't read this image."));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
      if (!blob) throw new Error("Resize failed.");
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Image Resizer</h1>
        <p className="lede" style={{ marginTop: 8 }}>Resize an image to exact pixel dimensions.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="img-input">Choose an image</label>
          <input id="img-input" type="file" accept="image/*" onChange={handleFileChange} />
          {originalDims && <span className="field-hint">Original: {originalDims.w} × {originalDims.h}px</span>}
        </div>

        {originalDims && (
          <>
            <div style={{ display: "flex", gap: 16 }}>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="width">Width (px)</label>
                <input id="width" type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="height">Height (px)</label>
                <input id="height" type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} />
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 16 }}>
              <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
              Lock aspect ratio
            </label>
          </>
        )}

        <button
          onClick={handleResize}
          disabled={!file || width <= 0 || height <= 0 || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Resizing…" : "Resize"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="resized.png" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download resized.png
          </a>
        )}
      </div>
    </main>
  );
}
