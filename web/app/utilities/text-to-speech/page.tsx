"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function handleSpeak() {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex];
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 640 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Text to Speech</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Uses your browser's built-in voices — no upload, no account.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to hear it read aloud…"
          rows={6}
          style={{ width: "100%", marginTop: 20, padding: "14px 16px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 15, fontFamily: "inherit", resize: "vertical" }}
        />

        {voices.length > 0 && (
          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="voice">Voice</label>
            <select id="voice" value={voiceIndex} onChange={(e) => setVoiceIndex(Number(e.target.value))}>
              {voices.map((v, i) => (
                <option key={`${v.name}-${i}`} value={i}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: "flex", gap: 16 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="rate">Rate: {rate.toFixed(1)}x</label>
            <input id="rate" type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="pitch">Pitch: {pitch.toFixed(1)}</label>
            <input id="pitch" type="range" min={0} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
          </div>
        </div>

        <button onClick={speaking ? handleStop : handleSpeak} disabled={!text.trim()} className="btn btn-primary btn-block" style={{ opacity: !text.trim() ? 0.6 : 1 }}>
          {speaking ? "Stop" : "Speak"}
        </button>
      </div>
    </main>
  );
}
