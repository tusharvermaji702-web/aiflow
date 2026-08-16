"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function PixelateImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [pixelSize, setPixelSize] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    if (!picked) {
      setImgEl(null);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(picked);
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = url;
    });
    setImgEl(img);
  }

  useEffect(() => {
    if (!imgEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = Math.max(1, Math.floor(imgEl.width / pixelSize));
    const h = Math.max(1, Math.floor(imgEl.height / pixelSize));

    const small = document.createElement("canvas");
    small.width = w;
    small.height = h;
    const smallCtx = small.getContext("2d");
    if (!smallCtx) return;
    smallCtx.drawImage(imgEl, 0, 0, w, h);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(small, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  }, [imgEl, pixelSize]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixelated.png";
    a.click();
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Pixelate Image</h1>
        <p className="lede" style={{ marginTop: 8 }}>Apply a mosaic/pixelation effect — updates live as you adjust.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="img-input">Choose an image</label>
          <input id="img-input" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {imgEl && (
          <div className="field">
            <label htmlFor="pixel-size">Block size: {pixelSize}px</label>
            <input id="pixel-size" type="range" min={2} max={40} value={pixelSize} onChange={(e) => setPixelSize(Number(e.target.value))} />
          </div>
        )}

        {imgEl && (
          <div className="card" style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
            <button onClick={handleDownload} className="btn btn-primary">
              Download PNG
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
