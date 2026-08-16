"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Rect = { x: number; y: number; w: number; h: number };

export default function ImageCropperPage() {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [selection, setSelection] = useState<Rect | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setDownloadUrl(null);
    setSelection(null);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgEl, 0, 0);
    if (selection) {
      ctx.strokeStyle = "#2F6F4E";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      ctx.fillStyle = "rgba(47, 111, 78, 0.12)";
      ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
    }
  }, [imgEl, selection]);

  function getCanvasPoint(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setDownloadUrl(null);
    setDragStart(getCanvasPoint(e));
    setSelection(null);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragStart) return;
    const p = getCanvasPoint(e);
    setSelection({
      x: Math.min(dragStart.x, p.x),
      y: Math.min(dragStart.y, p.y),
      w: Math.abs(p.x - dragStart.x),
      h: Math.abs(p.y - dragStart.y),
    });
  }

  function handleMouseUp() {
    setDragStart(null);
  }

  function handleCrop() {
    if (!imgEl || !selection || selection.w < 1 || selection.h < 1) return;
    const out = document.createElement("canvas");
    out.width = selection.w;
    out.height = selection.h;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imgEl, selection.x, selection.y, selection.w, selection.h, 0, 0, selection.w, selection.h);
    setDownloadUrl(out.toDataURL("image/png"));
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Image Cropper</h1>
        <p className="lede" style={{ marginTop: 8 }}>Click and drag on the image to select the area you want to keep.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="img-input">Choose an image</label>
          <input id="img-input" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {imgEl && (
          <div className="card" style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <canvas
              ref={canvasRef}
              style={{ maxWidth: "100%", height: "auto", cursor: "crosshair" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <button
              onClick={handleCrop}
              disabled={!selection || selection.w < 1 || selection.h < 1}
              className="btn btn-primary"
              style={{ opacity: !selection ? 0.6 : 1 }}
            >
              Crop selection
            </button>
          </div>
        )}

        {downloadUrl && (
          <a href={downloadUrl} download="cropped.png" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download cropped.png
          </a>
        )}
      </div>
    </main>
  );
}
