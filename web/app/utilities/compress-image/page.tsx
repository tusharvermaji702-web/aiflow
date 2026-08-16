"use client";

import { useState } from "react";
import Link from "next/link";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError(null);
  }

  async function handleCompress() {
    if (!file) return;
    setWorking(true);
    setError(null);
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not read this image."));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported in this browser.");
      ctx.drawImage(img, 0, 0);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
      );
      URL.revokeObjectURL(objectUrl);

      if (!blob) throw new Error("Compression failed.");
      setCompressedUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setWorking(false);
    }
  }

  const reduction =
    file && compressedSize ? Math.round((1 - compressedSize / file.size) * 100) : null;

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Compress Image</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Reduce a JPG or PNG's file size. Output is JPEG — adjust quality and
          re-compress as many times as you like.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="image-input">Choose an image</label>
          <input id="image-input" type="file" accept="image/*" onChange={handleFileChange} />
          {file && (
            <span className="field-hint">
              Original size: {formatBytes(file.size)}
            </span>
          )}
        </div>

        {file && (
          <div className="field">
            <label htmlFor="quality">Quality: {Math.round(quality * 100)}%</label>
            <input
              id="quality"
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ marginTop: 8, opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? "Compressing…" : "Compress"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {compressedUrl && compressedSize !== null && (
          <div className="card" style={{ marginTop: 20 }}>
            <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
              New size: <strong style={{ color: "var(--ink)" }}>{formatBytes(compressedSize)}</strong>
              {reduction !== null && reduction > 0 && (
                <span style={{ color: "var(--accent-dark)" }}> ({reduction}% smaller)</span>
              )}
            </p>
            <a
              href={compressedUrl}
              download={`compressed-${file?.name?.replace(/\.[^.]+$/, "") || "image"}.jpg`}
              className="btn btn-primary"
              style={{ marginTop: 12, display: "inline-block" }}
            >
              Download
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
