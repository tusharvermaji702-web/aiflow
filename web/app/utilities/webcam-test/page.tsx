"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function WebcamTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setActive(true);
    } catch {
      setError("Couldn't access your webcam — check browser permissions.");
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }

  useEffect(() => () => stop(), []);

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Webcam Test</h1>
        <p className="lede" style={{ marginTop: 8 }}>Check that your webcam works — nothing is recorded or uploaded.</p>

        <div className="card" style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", maxWidth: 480, borderRadius: 8, background: "#000", aspectRatio: "4 / 3" }} />
          <button onClick={active ? stop : start} className="btn btn-primary">
            {active ? "Stop camera" : "Start camera"}
          </button>
          {error && <p style={{ fontSize: 14, color: "var(--amber)" }}>{error}</p>}
        </div>
      </div>
    </main>
  );
}
