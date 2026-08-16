"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "@/lib/ffmpeg";

export default function VideoTrimmerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState("00:00:00");
  const [end, setEnd] = useState("00:00:10");
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleTrim() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setProgress(0);
    setDownloadUrl(null);
    try {
      const ffmpeg = await getFFmpeg((p) => setProgress(Math.round(p * 100)));
      const ext = file.name.match(/\.[^.]+$/)?.[0] || ".mp4";
      const inputName = `input${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-i", inputName, "-ss", start, "-to", end, "-c", "copy", "output.mp4"]);
      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([(data as Uint8Array).buffer as BlobPart], { type: "video/mp4" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't trim this video. If this is the first tool you've used on this page, try again — the video engine may still be downloading.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Video Trimmer</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Cut a video down to a start and end time. Processing happens in your browser.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="video-input">Choose a video</label>
          <input id="video-input" type="file" accept="video/*" onChange={handleFileChange} />
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="start">Start (hh:mm:ss)</label>
            <input id="start" value={start} onChange={(e) => setStart(e.target.value)} placeholder="00:00:00" />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="end">End (hh:mm:ss)</label>
            <input id="end" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="00:00:10" />
          </div>
        </div>

        <button
          onClick={handleTrim}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? `Trimming… ${progress}%` : "Trim video"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="trimmed.mp4" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download trimmed.mp4
          </a>
        )}
      </div>
    </main>
  );
}
