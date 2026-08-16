"use client";

import { useState } from "react";
import Link from "next/link";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ColourPickerPage() {
  const [color, setColor] = useState("#2F6F4E");
  const [copied, setCopied] = useState<"hex" | "rgb" | null>(null);
  const [eyedropperSupported] = useState(
    typeof window !== "undefined" && "EyeDropper" in window
  );

  function handleCopy(value: string, which: "hex" | "rgb") {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
    });
  }

  async function handleEyedropper() {
    try {
      // EyeDropper isn't yet in TypeScript's DOM lib, so it's accessed dynamically.
      const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      if (!EyeDropperCtor) return;
      const dropper = new EyeDropperCtor();
      const result = await dropper.open();
      setColor(result.sRGBHex);
    } catch {
      /* user cancelled — no-op */
    }
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 560 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Colour Picker</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Pick a colour and copy its hex or RGB value.
        </p>

        <div className="card" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ width: "100%", height: 120, borderRadius: 8, background: color, border: "1px solid var(--line)" }} />

          <div className="field">
            <label htmlFor="color-input">Pick a colour</label>
            <input id="color-input" type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ height: 44, padding: 4 }} />
          </div>

          {eyedropperSupported && (
            <button onClick={handleEyedropper} className="btn btn-secondary">
              Pick from screen
            </button>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => handleCopy(color, "hex")} className="btn btn-primary" style={{ flex: 1 }}>
              {copied === "hex" ? "Copied!" : `Copy ${color.toUpperCase()}`}
            </button>
            <button onClick={() => handleCopy(hexToRgb(color), "rgb")} className="btn btn-primary" style={{ flex: 1 }}>
              {copied === "rgb" ? "Copied!" : `Copy ${hexToRgb(color)}`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
