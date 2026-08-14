import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/mock-data";

export default function CategoriesPage() {
  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Browse</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Categories</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Every tool in the directory belongs to a category — start here if you know
          the kind of work you're doing but not yet which tool fits.
        </p>

        <div className="grid-cards" style={{ marginTop: 32 }}>
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.name).length;
            return (
              <Link key={cat.slug} href="/tools" className="card" style={{ display: "block" }}>
                <h3 style={{ fontSize: 18 }}>{cat.name}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>
                  {cat.description}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 14, fontFamily: "var(--font-mono)" }}>
                  {count} tool{count !== 1 ? "s" : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
