"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { fetchSavedItems, unsaveItem, SavedItem } from "@/lib/saved";

export default function SavedPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }
    fetchSavedItems(token)
      .then(setItems)
      .catch(() => setError("Could not reach the backend. Is it running on :8000?"))
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  async function handleRemove(item: SavedItem) {
    if (!token) return;
    try {
      await unsaveItem(token, item.item_type, item.item_slug);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      /* silently ignore */
    }
  }

  const savedTools = items.filter((i) => i.item_type === "tool");
  const savedWorkflows = items.filter((i) => i.item_type === "workflow");

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Your library</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Saved</h1>

        {!authLoading && !user && (
          <div className="card" style={{ marginTop: 28 }}>
            <p style={{ fontWeight: 600 }}>Log in to see your saved tools and workflows.</p>
            <Link href="/login" className="btn btn-primary" style={{ marginTop: 14, display: "inline-flex" }}>
              Log in
            </Link>
          </div>
        )}

        {user && loading && (
          <p style={{ marginTop: 28, color: "var(--ink-faint)" }}>Loading your saved items…</p>
        )}

        {user && !loading && error && (
          <div className="card" style={{ marginTop: 28, borderColor: "#e5b5b5" }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {user && !loading && !error && items.length === 0 && (
          <div className="card" style={{ marginTop: 28 }}>
            <p style={{ fontWeight: 600 }}>Nothing saved yet.</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6 }}>
              Save a tool or a workflow and it'll show up here.
            </p>
          </div>
        )}

        {user && !loading && !error && items.length > 0 && (
          <>
            {savedTools.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h2 style={{ fontSize: 18 }}>Tools</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                  {savedTools.map((item) => (
                    <div key={item.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link href={`/tools/${item.item_slug}`} style={{ fontWeight: 600 }}>
                        {item.item_name}
                      </Link>
                      <button onClick={() => handleRemove(item)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 13 }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {savedWorkflows.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h2 style={{ fontSize: 18 }}>Workflows</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                  {savedWorkflows.map((item) => (
                    <div key={item.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600 }}>{item.item_name}</span>
                      <button onClick={() => handleRemove(item)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: 13 }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
