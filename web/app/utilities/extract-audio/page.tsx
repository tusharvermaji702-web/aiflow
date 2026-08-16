"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "@/lib/ffmpeg";

export default function ExtractAudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleExtract() {
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
      await ffmpeg.exec(["-i", inputName, "-vn", "-c:a", "libmp3lame", "-q:a", "2", "output.mp3"]);
      const data = await ffmpeg.readFile("output.mp3");
      const blob = new Blob([(data as Uint8Array).buffer as BlobPart], { type: "audio/mpeg" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't extract audio from this video. If this is the first tool you've used on this page, try again — the engine may still be downloading.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Extract Audio from Video</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Pull the audio track out of a video file as an MP3.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="video-input">Choose a video</label>
          <input id="video-input" type="file" accept="video/*" onChange={handleFileChange} />
        </div>

        <button
          onClick={handleExtract}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? `Extracting… ${progress}%` : "Extract audio"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download="audio.mp3" className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download audio.mp3
          </a>
        )}
      </div>
    </main>
  );
}
