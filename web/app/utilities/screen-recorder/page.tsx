"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export default function ScreenRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  async function start() {
    setError(null);
    setDownloadUrl(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setDownloadUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      // Auto-stop if the user ends sharing from the browser's own UI.
      stream.getVideoTracks()[0].onended = () => {
        if (recorderRef.current?.state === "recording") recorderRef.current.stop();
        setRecording(false);
      };

      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Screen recording was cancelled or isn't available in this browser.");
    }
  }

  function stop() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 560 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Screen Recorder</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Record your screen (or a tab/window) and download it as a .webm file. Nothing is uploaded.
        </p>

        <div className="card" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <button onClick={recording ? stop : start} className="btn btn-primary">
            {recording ? "Stop recording" : "Start recording"}
          </button>
          {recording && <p style={{ fontSize: 13, color: "var(--accent-dark)" }}>● Recording…</p>}
          {error && <p style={{ fontSize: 14, color: "var(--amber)" }}>{error}</p>}
        </div>

        {downloadUrl && (
          <a href={downloadUrl} download="recording.webm" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download recording.webm
          </a>
        )}
      </div>
    </main>
  );
}
