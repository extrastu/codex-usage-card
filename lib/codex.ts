// Deterministic helpers for the Codex usage card.

// Simple string hash -> 32-bit int
function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32 seeded PRNG
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const GRID_COLS = 26
export const GRID_ROWS = 7
const TOTAL_CELLS = GRID_COLS * GRID_ROWS

// Format a number into Chinese 万 / 亿 notation, e.g. 1300000000 -> "13亿"
export function formatCn(n: number): string {
  if (!isFinite(n) || n <= 0) return "0"
  const trim = (v: number) => {
    const r = Math.round(v * 10) / 10
    return Number.isInteger(r) ? String(r) : r.toFixed(1)
  }
  if (n >= 1e8) return `${trim(n / 1e8)}亿`
  if (n >= 1e4) return `${trim(n / 1e4)}万`
  return String(Math.round(n))
}

/**
 * Generate a heatmap intensity grid (values 0-4) seeded by the username and
 * token amount. A larger token total increases overall fill density and
 * intensity, so the heatmap visibly changes with the user's token.
 */
export function generateHeatmap(username: string, token: number): number[] {
  const seed = hashString(`${username}::${token}`)
  const rng = mulberry32(seed)

  // Map token magnitude -> base fill probability (0.15 .. 0.85)
  const mag = Math.log10(Math.max(token, 1)) // 0 .. ~11
  const density = Math.min(0.85, Math.max(0.15, 0.15 + (mag / 11) * 0.7))

  const cells: number[] = new Array(TOTAL_CELLS).fill(0)

  // Activity tends to cluster toward the right side (recent activity),
  // mimicking the reference design.
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const col = i % GRID_COLS
    const rightBias = 0.55 + (col / (GRID_COLS - 1)) * 0.9 // left sparse, right dense
    const p = density * rightBias
    if (rng() < p) {
      // Weighted intensity 1-3, occasionally 4
      const r = rng()
      let level = 1
      if (r > 0.85) level = 4
      else if (r > 0.62) level = 3
      else if (r > 0.32) level = 2
      cells[i] = level
    }
  }

  // Guarantee at least one peak cell (darkest) for the "peak day".
  const peakIndex = Math.floor(rng() * TOTAL_CELLS)
  cells[peakIndex] = 4

  return cells
}

// Peach/clay palette matching the reference. Index 0 = empty.
export const HEATMAP_COLORS = [
  "#e6e4e1", // 0 empty
  "#f3e1d6", // 1
  "#eac9b4", // 2
  "#dca582", // 3
  "#c06a3e", // 4 peak
]

export function randomStreak(): number {
  return Math.floor(Math.random() * 30) + 1
}
