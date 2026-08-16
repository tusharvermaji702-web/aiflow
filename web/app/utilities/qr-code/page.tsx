"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

export default function QrCodePage() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text.trim()) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setError(null);
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, {
      width: 240,
      margin: 1,
      color: { dark: "#12141A", light: "#FFFFFF" },
    })
      .then(() => setError(null))
      .catch(() => setError("Couldn't generate a QR code for that input."));
  }, [text]);

  function handleDownload() {
    if (!canvasRef.current || !text.trim()) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>QR Code Generator</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Type a link or any text — the QR code updates as you type.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="qr-text">Text or URL</label>
          <input
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        {error && <p style={{ fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        <div className="card" style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <canvas ref={canvasRef} width={240} height={240} />
          <button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="btn btn-primary"
            style={{ opacity: text.trim() ? 1 : 0.6 }}
          >
            Download PNG
          </button>
        </div>
      </div>
    </main>
  );
}
