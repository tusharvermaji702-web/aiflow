"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ColourInverterPage() {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
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
    ctx.drawImage(imgEl, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
  }, [imgEl]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "inverted.png";
    a.click();
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Colour Inverter</h1>
        <p className="lede" style={{ marginTop: 8 }}>Invert every pixel's colour in an image.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="img-input">Choose an image</label>
          <input id="img-input" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

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
