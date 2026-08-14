import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 80 }}>
      <div
        className="shell"
        style={{
          padding: "36px 24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 16,
          fontSize: 13,
          color: "var(--ink-faint)",
        }}
      >
        <span>© {new Date().getFullYear()} AIFlow. Built one milestone at a time.</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/workflows">Workflows</Link>
        </div>
      </div>
    </footer>
  );
}
