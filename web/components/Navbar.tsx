"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/tools", label: "Tools" },
  { href: "/toolkit", label: "Toolkit" },
  { href: "/categories", label: "Categories" },
  { href: "/workflows", label: "Workflows" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();

  function handleLogOut() {
    logOut();
    router.push("/");
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <Link
          href="/"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}
        >
          AIFlow
        </Link>

        <nav
          style={{
            display: "flex",
            gap: 24,
            fontSize: 14,
            fontWeight: 500,
          }}
          className="navbar-links"
        >
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "var(--ink-soft)" }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {loading ? null : user ? (
            <>
              <Link href="/saved" style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                Saved
              </Link>
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                Hi, {user.username}
              </span>
              <button onClick={handleLogOut} className="btn btn-secondary">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
