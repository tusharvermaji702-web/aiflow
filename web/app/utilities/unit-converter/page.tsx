"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const CATEGORIES: Record<string, Record<string, number>> = {
  Length: { Millimeters: 0.001, Centimeters: 0.01, Meters: 1, Kilometers: 1000, Inches: 0.0254, Feet: 0.3048, Yards: 0.9144, Miles: 1609.34 },
  Weight: { Milligrams: 0.001, Grams: 1, Kilograms: 1000, Ounces: 28.3495, Pounds: 453.592 },
};

function convertTemperature(value: number, from: string, to: string): number {
  const toCelsius: Record<string, (v: number) => number> = {
    Celsius: (v) => v,
    Fahrenheit: (v) => ((v - 32) * 5) / 9,
    Kelvin: (v) => v - 273.15,
  };
  const fromCelsius: Record<string, (v: number) => number> = {
    Celsius: (v) => v,
    Fahrenheit: (v) => (v * 9) / 5 + 32,
    Kelvin: (v) => v + 273.15,
  };
  return fromCelsius[to](toCelsius[from](value));
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<"Length" | "Weight" | "Temperature">("Length");
  const units = category === "Temperature" ? ["Celsius", "Fahrenheit", "Kelvin"] : Object.keys(CATEGORIES[category]);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [value, setValue] = useState("1");

  function handleCategoryChange(next: "Length" | "Weight" | "Temperature") {
    setCategory(next);
    const nextUnits = next === "Temperature" ? ["Celsius", "Fahrenheit", "Kelvin"] : Object.keys(CATEGORIES[next]);
    setFrom(nextUnits[0]);
    setTo(nextUnits[1]);
  }

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return null;
    if (category === "Temperature") return convertTemperature(num, from, to);
    const table = CATEGORIES[category];
    return (num * table[from]) / table[to];
  }, [value, from, to, category]);

  return (
    <main className="section">
      <div className="shell" style={{ maxWidth: 560 }}>
        <Link href="/utilities" style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
          ← All utilities
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>Unit Converter</h1>
        <p className="lede" style={{ marginTop: 8 }}>Convert between length, weight, and temperature units.</p>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => handleCategoryChange(e.target.value as "Length" | "Weight" | "Temperature")}>
              <option value="Length">Length</option>
              <option value="Weight">Weight</option>
              <option value="Temperature">Temperature</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="value">Value</label>
            <input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="from">From</label>
              <select id="from" value={from} onChange={(e) => setFrom(e.target.value)}>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="to">To</label>
              <select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {result !== null && (
            <p style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700, marginTop: 8 }}>
              {value || 0} {from} = {result.toFixed(4).replace(/\.?0+$/, "")} {to}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
