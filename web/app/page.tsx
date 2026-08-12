"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tool = {
  id: number;
  name: string;
  category: string;
  description: string;
};

export default function Home() {
  const [status, setStatus] = useState<string>("checking...");
  const [tools, setTools] = useState<Tool[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setError("Could not reach the backend. Is it running on :8000?"));

    fetch(`${API_URL}/tools`)
      .then((res) => res.json())
      .then((data) => setTools(data))
      .catch(() => {});
  }, []);

  return (
    <main style={{ maxWidth: 640, margin: "60px auto", padding: "0 20px" }}>
      <h1>AIFlow</h1>
      <p style={{ color: "#555" }}>
        Tell AIFlow what you want to accomplish, and it figures out the best way to do it.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 8,
          background: error ? "#fee" : "#eef7ee",
          border: `1px solid ${error ? "#f5b5b5" : "#b5d9b5"}`,
        }}
      >
        <strong>Backend status:</strong> {error ?? status}
      </div>

      <h2 style={{ marginTop: 32 }}>Tools (from backend)</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id} style={{ marginBottom: 8 }}>
            <strong>{tool.name}</strong> ({tool.category}) — {tool.description}
          </li>
        ))}
      </ul>
      {tools.length === 0 && !error && <p>Loading tools…</p>}
    </main>
  );
}
