"use client";

import { useState } from "react";
import Link from "next/link";

function encodeUnicode(str: string) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
}
function decodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function Base64EncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleEncode() {
    try {
      setOutput(encodeUnicode(input));
      setError(null);
    } catch {
      setError("Couldn't encode this text.");
    }
  }

  function handleDecode() {
    try {
      setOutput(decodeUnicode(input));
      setError(null);
    } catch {
      setError("That doesn't look like valid Base64.");
      setOutput("");
    }
  }

  function handleFileEncode(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL; strip the "data:...;base64," prefix
      const base64 = result.split(",")[1] ?? "";
      setOutput(base64);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 8,
    border: "1px solid var(--line)",
    fontSize: 13,
    fontFamily: "var(--font-mono)",
    resize: "vertical",
  };

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Base64 Encoder / Decoder</h1>
        <p className="lede" style={{ marginTop: 8 }}>Encode text or a file to Base64, or decode Base64 back to text.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="text-input">Text</label>
          <textarea id="text-input" value={input} onChange={(e) => setInput(e.target.value)} rows={6} style={textareaStyle} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={handleEncode} className="btn btn-primary">Encode</button>
          <button onClick={handleDecode} className="btn btn-secondary">Decode</button>
          <button onClick={handleCopy} disabled={!output} className="btn btn-secondary" style={{ opacity: output ? 1 : 0.6 }}>
            {copied ? "Copied!" : "Copy output"}
          </button>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label htmlFor="file-input">Or encode a file instead</label>
          <input id="file-input" type="file" onChange={handleFileEncode} />
        </div>

        {error && <p style={{ fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {output && (
          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="output">Output</label>
            <textarea id="output" value={output} readOnly rows={6} style={{ ...textareaStyle, background: "var(--surface)" }} />
          </div>
        )}
      </div>
    </main>
  );
}
