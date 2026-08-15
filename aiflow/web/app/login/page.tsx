"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 400 }}>
        <h1 style={{ fontSize: 26 }}>Log in</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 8 }}>
          Real accounts arrive with the database milestone — this form is UI-only for now.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          style={{ marginTop: 28 }}
        >
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
            Log in
          </button>

          {submitted && (
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--accent-dark)" }}>
              Accounts aren&apos;t connected yet — check back once the database milestone ships.
            </p>
          )}
        </form>

        <p style={{ marginTop: 24, fontSize: 14, color: "var(--ink-soft)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
