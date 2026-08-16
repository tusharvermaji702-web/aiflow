"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "@/lib/ffmpeg";

const FORMATS = [
  { ext: "mp3", mime: "audio/mpeg" },
  { ext: "wav", mime: "audio/wav" },
  { ext: "ogg", mime: "audio/ogg" },
];

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState(FORMATS[0].ext);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setDownloadUrl(null);
    setError(null);
  }

  async function handleConvert() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setProgress(0);
    setDownloadUrl(null);
    try {
      const ffmpeg = await getFFmpeg((p) => setProgress(Math.round(p * 100)));
      const inputExt = file.name.match(/\.[^.]+$/)?.[0] || ".mp3";
      const inputName = `input${inputExt}`;
      const outputName = `output.${format}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-i", inputName, outputName]);
      const data = await ffmpeg.readFile(outputName);
      const mime = FORMATS.find((f) => f.ext === format)?.mime || "audio/mpeg";
      const blob = new Blob([(data as Uint8Array).buffer as BlobPart], { type: mime });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't convert this file. If this is the first tool you've used on this page, try again — the engine may still be downloading.");
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Audio Converter</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Convert an audio file between MP3, WAV, and OGG.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="audio-input">Choose an audio file</label>
          <input id="audio-input" type="file" accept="audio/*" onChange={handleFileChange} />
        </div>

        <div className="field">
          <label htmlFor="format">Convert to</label>
          <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
            {FORMATS.map((f) => (
              <option key={f.ext} value={f.ext}>{f.ext.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? `Converting… ${progress}%` : "Convert"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {downloadUrl && (
          <a href={downloadUrl} download={`converted.${format}`} className="btn btn-primary btn-block" style={{ marginTop: 16, background: "var(--accent-dark)" }}>
            Download converted.{format}
          </a>
        )}
      </div>
    </main>
  );
}
