"use client";

import { useState } from "react";
import Link from "next/link";
import { createWorker } from "tesseract.js";

export default function ImageToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setText("");
    setError(null);
    setProgress(0);
    setPreview(picked ? URL.createObjectURL(picked) : null);
  }

  async function handleExtract() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setProgress(0);
    setText("");
    try {
      const worker = await createWorker("eng", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data } = await worker.recognize(file);
      setText(data.text.trim());
      await worker.terminate();
    } catch {
      setError("Couldn't extract text from this image. Try a clearer, higher-resolution image.");
    } finally {
      setWorking(false);
    }
  }

  function handleCopy() {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Image to Text (OCR)</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Extract text from a photo or screenshot. First run downloads a small language model —
          after that it's fast.
        </p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="img-input">Choose an image</label>
          <input id="img-input" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {preview && (
          <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8, border: "1px solid var(--line)", marginBottom: 16 }} />
        )}

        <button
          onClick={handleExtract}
          disabled={!file || working}
          className="btn btn-primary btn-block"
          style={{ opacity: !file || working ? 0.6 : 1 }}
        >
          {working ? `Reading text… ${progress}%` : "Extract text"}
        </button>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {text && (
          <div className="field" style={{ marginTop: 20 }}>
            <label htmlFor="output">Extracted text</label>
            <textarea
              id="output"
              value={text}
              readOnly
              rows={10}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
            />
            <button onClick={handleCopy} className="btn btn-secondary" style={{ marginTop: 12 }}>
              {copied ? "Copied!" : "Copy text"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
