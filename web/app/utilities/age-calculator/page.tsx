"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function calculateAge(dob: Date, at: Date) {
  let years = at.getFullYear() - dob.getFullYear();
  let months = at.getMonth() - dob.getMonth();
  let days = at.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(at.getFullYear(), at.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((at.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}

export default function AgeCalculatorPage() {
  const [dobStr, setDobStr] = useState("");

  const result = useMemo(() => {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    if (dob > today) return null;
    return calculateAge(dob, today);
  }, [dobStr]);

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 560 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Age Calculator</h1>
        <p className="lede" style={{ marginTop: 8 }}>Enter a date of birth to see the exact age as of today.</p>

        <div className="field" style={{ marginTop: 24 }}>
          <label htmlFor="dob">Date of birth</label>
          <input id="dob" type="date" value={dobStr} onChange={(e) => setDobStr(e.target.value)} max={new Date().toISOString().split("T")[0]} />
        </div>

        {result && (
          <div className="grid-cards" style={{ marginTop: 8 }}>
            {[
              ["Years", result.years],
              ["Months", result.months],
              ["Days", result.days],
              ["Total days lived", result.totalDays],
            ].map(([label, val]) => (
              <div key={label as string} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {dobStr && !result && (
          <p style={{ fontSize: 14, color: "var(--amber)" }}>Enter a valid date that isn't in the future.</p>
        )}
      </div>
    </main>
  );
}
