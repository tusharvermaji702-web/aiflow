"use client";

import { useState } from "react";
import Link from "next/link";
import { createShortLink, ShortLink } from "@/lib/api";

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [result, setResult] = useState<ShortLink | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setWorking(true);
    setError(null);
    setResult(null);
    try {
      const link = await createShortLink(url.trim(), customSlug.trim() || undefined);
      setResult(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setWorking(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url).then(() => {
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
        <h1 style={{ fontSize: 28, marginTop: 12 }}>URL Shortener</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Paste a long URL and get a short one back, backed by your AIFlow database.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="field">
            <label htmlFor="url">Long URL</label>
            <input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/a/really/long/path"
            />
          </div>

          <div className="field">
            <label htmlFor="slug">Custom slug (optional)</label>
            <input
              id="slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-link"
            />
            <span className="field-hint">Leave blank for a random one.</span>
          </div>

          <button type="submit" disabled={!url.trim() || working} className="btn btn-primary btn-block" style={{ opacity: !url.trim() || working ? 0.6 : 1 }}>
            {working ? "Shortening…" : "Shorten"}
          </button>
        </form>

        {error && <p style={{ marginTop: 16, fontSize: 14, color: "var(--amber)" }}>{error}</p>}

        {result && (
          <div className="card" style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>Your short link</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 16, marginTop: 6, wordBreak: "break-all" }}>
              {result.short_url}
            </p>
            <button onClick={handleCopy} className="btn btn-secondary" style={{ marginTop: 12 }}>
              {copied ? "Copied!" : "Copy link"}
            </button>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 12 }}>
              {result.clicks} click{result.clicks === 1 ? "" : "s"} so far
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
