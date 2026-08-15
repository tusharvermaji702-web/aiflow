"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { useAuth } from "@/lib/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { logIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser(email, name, password);
      logIn(res.access_token, res.user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 400 }}>
        <h1 style={{ fontSize: 26 }}>Create your account</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 8 }}>
          Takes a few seconds — no email confirmation needed yet.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div className="field">
            <label htmlFor="name">Username</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your username"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
            <span className="field-hint">Use 8+ characters with a mix of letters and numbers.</span>
          </div>

          {error && (
            <p style={{ fontSize: 13, color: "#b64545", marginBottom: 12 }}>{error}</p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 14, color: "var(--ink-soft)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
