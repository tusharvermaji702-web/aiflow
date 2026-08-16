/**
 * Parses strings like "1,3,5-7" into a zero-indexed, deduplicated array of
 * page indices, clamped to [0, pageCount - 1]. Used by remove-pages and
 * extract-pages so both tools accept the same input format.
 */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const indices = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (Number.isNaN(start) || Number.isNaN(end)) continue;
      const lo = Math.max(1, Math.min(start, end));
      const hi = Math.min(pageCount, Math.max(start, end));
      for (let i = lo; i <= hi; i++) indices.add(i - 1);
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= pageCount) indices.add(n - 1);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}
