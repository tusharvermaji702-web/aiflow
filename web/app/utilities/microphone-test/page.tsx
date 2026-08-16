"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function MicrophoneTestPage() {
  const [active, setActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      function tick() {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.min(100, Math.round((avg / 255) * 100 * 2)));
        rafRef.current = requestAnimationFrame(tick);
      }
      tick();
      setActive(true);
    } catch {
      setError("Couldn't access your microphone — check browser permissions.");
    }
  }

  function stop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    setActive(false);
    setLevel(0);
  }

  useEffect(() => () => stop(), []);

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 560 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Microphone Test</h1>
        <p className="lede" style={{ marginTop: 8 }}>Speak and watch the level meter respond — nothing is recorded.</p>

        <div className="card" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 24, borderRadius: 12, background: "var(--bg)", overflow: "hidden", border: "1px solid var(--line)" }}>
            <div style={{ height: "100%", width: `${level}%`, background: "var(--accent)", transition: "width 60ms linear" }} />
          </div>
          <button onClick={active ? stop : start} className="btn btn-primary">
            {active ? "Stop test" : "Start test"}
          </button>
          {error && <p style={{ fontSize: 14, color: "var(--amber)" }}>{error}</p>}
        </div>
      </div>
    </main>
  );
}
