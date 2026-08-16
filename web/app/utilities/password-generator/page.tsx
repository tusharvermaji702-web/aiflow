"use client";

import { useState } from "react";
import Link from "next/link";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_-+=[]{}";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let pool = LOWER;
    if (useUpper) pool += UPPER;
    if (useNumbers) pool += NUMBERS;
    if (useSymbols) pool += SYMBOLS;

    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    const result = Array.from(values, (v) => pool[v % pool.length]).join("");
    setPassword(result);
    setCopied(false);
  }

  function handleCopy() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 560 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Password Generator</h1>
        <p className="lede" style={{ marginTop: 8 }}>Generate a random password using your browser's secure random source.</p>

        <div className="card" style={{ marginTop: 24 }}>
          {password && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                wordBreak: "break-all",
                padding: "14px 16px",
                background: "var(--bg)",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              {password}
            </div>
          )}

          <div className="field">
            <label htmlFor="length">Length: {length}</label>
            <input id="length" type="range" min={6} max={48} value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 8 }}>
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
            Include uppercase letters
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 8 }}>
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
            Include numbers
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 20 }}>
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
            Include symbols
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={generate} className="btn btn-primary" style={{ flex: 1 }}>
              Generate
            </button>
            <button onClick={handleCopy} disabled={!password} className="btn btn-secondary" style={{ flex: 1, opacity: password ? 1 : 0.6 }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
