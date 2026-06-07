import { seasonalPalettes, type SeasonalPalette } from './seasonal-palettes'

export interface ColorMatch {
  hex: string
  name: string
  paletteName: string
  season: SeasonalPalette['season']
  confidence: number
}

// Convert hex to LAB for perceptual color comparison
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ]
}

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // Convert RGB to XYZ
  let rr = r / 255
  let gg = g / 255
  let bb = b / 255

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92

  const x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047
  const y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750)
  const z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883

  // Convert XYZ to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
  const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
  const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116

  const L = (116 * fy) - 16
  const a = 500 * (fx - fy)
  const bVal = 200 * (fy - fz)

  return [L, a, bVal]
}

// Calculate Delta E (CIE76) - perceptual color difference
function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
    Math.pow(lab1[1] - lab2[1], 2) +
    Math.pow(lab1[2] - lab2[2], 2)
  )
}


// ─── Named colour reference (CIELAB nearest-neighbour) ───────────────────────
// Replaces the HSL rule-tree which could not reliably distinguish perceptually
// similar colours at hue boundaries (e.g. dusty pink vs peach at H≈15°).
// CIELAB nearest-neighbour matches human perception directly.
//
// Reference: ~130 fashion-relevant colour names defined as hex anchors.
// getColorName finds the closest anchor in CIELAB and returns its name.

const COLOR_REFERENCE: Array<[string, string]> = [
  // Whites & near-whites
  ['#FFFFFF', 'White'],
  ['#FFFEF2', 'Ivory'],
  ['#FFF8E7', 'Cream'],
  ['#F5F5F0', 'Off-White'],
  ['#ECDDD0', 'Warm White'],

  // Neutrals / greys
  ['#E8E8E8', 'Silver'],
  ['#D0D0D0', 'Light Grey'],
  ['#A8A8A8', 'Grey'],
  ['#707070', 'Medium Grey'],
  ['#484848', 'Charcoal'],
  ['#282828', 'Dark Charcoal'],
  ['#111111', 'Black'],

  // Warm neutrals / beiges
  ['#EDE0CE', 'Pearl'],
  ['#E0CEB0', 'Sand'],
  ['#D4BA94', 'Warm Beige'],
  ['#C8A87A', 'Tan'],
  ['#B89060', 'Camel'],
  ['#A87848', 'Warm Tan'],
  ['#8C6840', 'Khaki Brown'],
  ['#D8C8A8', 'Khaki'],
  ['#BFB080', 'Dark Khaki'],

  // Dusty / muted pinks — placed before saturated pinks so they win at low saturation
  ['#E8D0CA', 'Powder Pink'],
  ['#D9B8B0', 'Dusty Pink'],
  ['#C8A09A', 'Dusty Rose'],
  ['#B88880', 'Rose Blush'],
  ['#A87068', 'Antique Rose'],
  ['#C8B0B8', 'Dusty Mauve'],
  ['#B090A0', 'Mauve'],
  ['#906878', 'Deep Mauve'],

  // Saturated pinks / roses
  ['#FFD0DA', 'Blush'],
  ['#FFB0C0', 'Light Pink'],
  ['#FF80A0', 'Pink'],
  ['#FF5080', 'Hot Pink'],
  ['#E8306A', 'Deep Pink'],
  ['#FF40A0', 'Fuchsia Pink'],
  ['#D800A0', 'Fuchsia'],
  ['#B00090', 'Magenta'],

  // Reds
  ['#FFB8B0', 'Blush Red'],
  ['#E07070', 'Rose'],
  ['#D84040', 'Red'],
  ['#C02020', 'Crimson'],
  ['#800020', 'Burgundy'],
  ['#600018', 'Wine'],
  ['#400010', 'Maroon'],

  // Corals & salmons
  ['#FFD0B8', 'Salmon'],
  ['#FFA888', 'Light Coral'],
  ['#FF8060', 'Coral'],
  ['#E86040', 'Coral Red'],

  // Peaches & apricots — distinctly orange-hued, higher saturation than dusty pink
  ['#FFE0C8', 'Peach'],
  ['#FFCCA8', 'Light Peach'],
  ['#FFB888', 'Apricot'],
  ['#FFA070', 'Soft Apricot'],

  // Oranges
  ['#FF8C00', 'Orange'],
  ['#E87000', 'Deep Orange'],
  ['#CC5500', 'Burnt Orange'],
  ['#C85020', 'Rust'],
  ['#A03818', 'Dark Rust'],

  // Terracottas & earth tones
  ['#D08060', 'Terracotta'],
  ['#B86840', 'Sienna'],
  ['#9A5030', 'Brick'],

  // Dark warm neutrals / taupes — distinct from cool charcoal (b≈0) and
  // saturated brown (a>10). These live at L≈28–45, a≈1–5, b≈8–16.
  ['#706050', 'Warm Taupe'],       // L≈42, slightly warm mid-tone
  ['#5A4D3C', 'Dark Taupe'],       // L≈33, close to #514837 territory
  ['#514837', 'Deep Taupe'],       // L≈31, the exact colour family reported
  ['#403830', 'Dark Warm Brown'],  // L≈25, very dark warm neutral
  ['#7A6A58', 'Taupe'],            // L≈46, classic mid taupe

  // Browns
  ['#D0A880', 'Caramel'],
  ['#B88858', 'Golden Brown'],
  ['#906038', 'Toffee'],
  ['#704020', 'Chocolate'],
  ['#502808', 'Dark Brown'],
  ['#301800', 'Espresso'],

  // Yellows & golds
  ['#FFF8B0', 'Pale Yellow'],
  ['#FFE860', 'Yellow'],
  ['#FFD000', 'Golden Yellow'],
  ['#F0B800', 'Amber'],
  ['#D09800', 'Mustard'],
  ['#A07800', 'Ochre'],
  ['#FFF0C0', 'Butter Yellow'],
  ['#E8D880', 'Straw'],

  // Yellow-greens & olives
  ['#C8E060', 'Lime'],
  ['#A0C030', 'Chartreuse'],
  ['#808018', 'Olive'],
  ['#686810', 'Dark Olive'],
  ['#98A060', 'Olive Green'],
  ['#787840', 'Moss'],

  // Greens
  ['#B8F0C8', 'Mint'],
  ['#80E0A0', 'Light Green'],
  ['#48C878', 'Green'],
  ['#20A050', 'Forest Green'],
  ['#106030', 'Dark Green'],
  ['#A8C8A0', 'Sage'],
  ['#688860', 'Fern'],

  // Teals & cyans
  ['#A0E8D8', 'Pale Teal'],
  ['#40C0B0', 'Teal'],
  ['#208878', 'Dark Teal'],
  ['#106058', 'Deep Teal'],
  ['#60D8C8', 'Turquoise'],

  // Blues
  ['#C0E0FF', 'Baby Blue'],
  ['#80C0F0', 'Sky Blue'],
  ['#60A0D8', 'Cornflower Blue'],
  ['#4080C0', 'Blue'],
  ['#1860A8', 'Cobalt Blue'],
  ['#103880', 'Navy'],
  ['#333648', 'Dark Navy'],      // L≈23 a≈3 b≈-12: muted dark blue-grey, distinct from saturated navy
  ['#081840', 'Midnight Blue'],
  ['#8090B0', 'Steel Blue'],
  ['#9090C0', 'Slate Blue'],
  ['#A0B8D8', 'Dusty Blue'],

  // Periwinkle & violet-blues
  ['#C0C8E8', 'Periwinkle'],
  ['#9090D0', 'Blue Lavender'],
  ['#6060B0', 'Indigo'],
  ['#400880', 'Deep Indigo'],

  // Purples & lavenders
  ['#E8D8F0', 'Pale Lavender'],
  ['#C8A8E0', 'Lavender'],
  ['#E0C8E8', 'Lilac'],
  ['#A870C8', 'Purple'],
  ['#8040A8', 'Deep Purple'],
  ['#602888', 'Plum'],
  ['#400868', 'Deep Plum'],
  ['#B090C0', 'Dusty Purple'],
  ['#806890', 'Muted Violet'],
  ['#A040C0', 'Violet'],
]

// Pre-compute Lab values for all reference colours (done once at module load)
const COLOR_REFERENCE_LAB: Array<[string, [number, number, number]]> = COLOR_REFERENCE.map(
  ([hex, name]) => [name, rgbToLab(...hexToRgb(hex))]
)

function getColorName(r: number, g: number, b: number): string {
  const inputLab = rgbToLab(r, g, b)
  let bestName = 'Unknown'
  let bestDist = Infinity
  for (const [name, lab] of COLOR_REFERENCE_LAB) {
    const d = deltaE(inputLab, lab)
    if (d < bestDist) { bestDist = d; bestName = name }
  }
  return bestName
}

// ─── Lab ↔ RGB ───────────────────────────────────────────────────────────────

function labToRgb(L: number, a: number, bVal: number): [number, number, number] {
  const fy = (L + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - bVal / 200
  const x = (fx > 0.206897 ? fx * fx * fx : (fx - 16 / 116) / 7.787) * 0.95047
  const y = fy > 0.206897 ? fy * fy * fy : (fy - 16 / 116) / 7.787
  const z = (fz > 0.206897 ? fz * fz * fz : (fz - 16 / 116) / 7.787) * 1.08883
  let r = x * 3.2404542 - y * 1.5371385 - z * 0.4985314
  let g = -x * 0.9692660 + y * 1.8760108 + z * 0.0415560
  let b = x * 0.0556434 - y * 0.2040259 + z * 1.0572252
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b
  return [
    Math.max(0, Math.min(255, Math.round(r * 255))),
    Math.max(0, Math.min(255, Math.round(g * 255))),
    Math.max(0, Math.min(255, Math.round(b * 255))),
  ]
}

/**
 * Extract the dominant textile color from a set of raw pixels using:
 *   1. L* filtering — discard specular highlights (L* > 88) and deep shadows (L* < 12),
 *      approximating the Specular + Shading layer removal from Intrinsic Image Decomposition.
 *   2. K-Means clustering in CIELAB — groups remaining pixels perceptually, finds the
 *      densest cluster, and returns its centroid as the true fabric color.
 *
 * @param pixels  Raw [r, g, b] pixels from the sample region (already cast-corrected).
 * @param k       Number of clusters (default 4 — captures main hue + texture variants).
 * @returns       [r, g, b] of the dominant cluster centroid.
 */
export function extractDominantColor(
  pixels: Array<[number, number, number]>,
  k = 4
): [number, number, number] {
  if (pixels.length === 0) return [128, 128, 128]

  // Step 1 — Convert to Lab, filter specular highlights and deep shadows
  const labPixels: Array<[number, number, number]> = []
  for (const [r, g, b] of pixels) {
    const lab = rgbToLab(r, g, b)
    if (lab[0] >= 12 && lab[0] <= 88) labPixels.push(lab)
  }
  // If filtering removed almost everything, fall back to unfiltered (very dark / very pale garments)
  const pts = labPixels.length >= Math.max(10, pixels.length * 0.05)
    ? labPixels
    : pixels.map(([r, g, b]) => rgbToLab(r, g, b))

  // Step 2 — K-Means++ initialisation (spreads centroids to avoid bad seeds)
  const centroids: Array<[number, number, number]> = []
  centroids.push(pts[Math.floor(Math.random() * pts.length)])
  for (let c = 1; c < Math.min(k, pts.length); c++) {
    const dists = pts.map(p => {
      let min = Infinity
      for (const ct of centroids) {
        const d = (p[0]-ct[0])**2 + (p[1]-ct[1])**2 + (p[2]-ct[2])**2
        if (d < min) min = d
      }
      return min
    })
    const total = dists.reduce((s, d) => s + d, 0)
    let rand = Math.random() * total
    let chosen = pts.length - 1
    for (let i = 0; i < pts.length; i++) { rand -= dists[i]; if (rand <= 0) { chosen = i; break } }
    centroids.push(pts[chosen])
  }

  // Step 3 — Iterate: assign → update (max 15 rounds, typically converges in 5–8)
  const kActual = centroids.length
  const assignments = new Int32Array(pts.length)
  for (let iter = 0; iter < 15; iter++) {
    let changed = false
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]; let best = 0, bestD = Infinity
      for (let c = 0; c < kActual; c++) {
        const d = (p[0]-centroids[c][0])**2 + (p[1]-centroids[c][1])**2 + (p[2]-centroids[c][2])**2
        if (d < bestD) { bestD = d; best = c }
      }
      if (assignments[i] !== best) { assignments[i] = best; changed = true }
    }
    if (!changed && iter > 0) break
    for (let c = 0; c < kActual; c++) {
      let L = 0, a = 0, b = 0, n = 0
      for (let i = 0; i < pts.length; i++) {
        if (assignments[i] === c) { L += pts[i][0]; a += pts[i][1]; b += pts[i][2]; n++ }
      }
      if (n > 0) centroids[c] = [L / n, a / n, b / n]
    }
  }

  // Step 4 — Dominant cluster = largest by pixel count
  const counts = new Int32Array(kActual)
  for (let i = 0; i < pts.length; i++) counts[assignments[i]]++
  let dominant = 0
  for (let c = 1; c < kActual; c++) if (counts[c] > counts[dominant]) dominant = c

  return labToRgb(...centroids[dominant])
}

// Score the input color against every palette, return top N ranked by closest match.
// Two-factor palette scoring:
//   1. Proximity score  — power-curve on nearest-color ΔE (threshold 50).
//      Real palette ΔE values range 1–25 for valid matches, so a threshold of 10
//      was far too tight (supporting seasons consistently scored 0%).
//   2. Coverage score   — fraction of palette colors within ΔE≤25 of the scan.
//      Rewards palettes that own the scanned colour territory, not just those that
//      happen to contain one nearby token.
//   Combined 70 / 30 weighting; top-3 results get a minimum floor of 5%.
export function findTopMatches(hex: string, n = 3): ColorMatch[] {
  const [r, g, b] = hexToRgb(hex)
  const inputLab = rgbToLab(r, g, b)
  const name = getColorName(r, g, b)

  const PROXIMITY_THRESHOLD = 50   // ΔE at which proximity score → 0
  const COVERAGE_RADIUS    = 25    // colours inside this radius count as "present"
  const PROXIMITY_POWER    = 2     // steeper curve near 0, gentler tail
  const W_PROXIMITY        = 0.70
  const W_COVERAGE         = 0.30

  const paletteScores: Array<{ palette: SeasonalPalette; score: number; distance: number }> = []

  for (const palette of seasonalPalettes) {
    let bestDist = Infinity
    let closeCount = 0

    for (const color of palette.colors) {
      const [pr, pg, pb] = hexToRgb(color)
      const d = deltaE(inputLab, rgbToLab(pr, pg, pb))
      if (d < bestDist) bestDist = d
      if (d <= COVERAGE_RADIUS) closeCount++
    }

    const proximityScore = Math.pow(Math.max(0, 1 - bestDist / PROXIMITY_THRESHOLD), PROXIMITY_POWER)
    const coverageScore  = closeCount / palette.colors.length  // 0–1

    const score = proximityScore * W_PROXIMITY + coverageScore * W_COVERAGE
    paletteScores.push({ palette, score, distance: bestDist })
  }

  paletteScores.sort((a, b) => b.score - a.score)

  return paletteScores.slice(0, n).map(({ palette, score, distance }) => ({
    hex,
    name,
    paletteName: palette.name,
    season: palette.season,
    // Floor at 5% so supporting seasons are never shown as 0%
    confidence: Math.max(5, Math.round(score * 100)),
  }))
}

export function findBestMatch(hex: string): ColorMatch {
  const [r, g, b] = hexToRgb(hex)
  const matches = findTopMatches(hex, 1)
  return matches[0] ?? {
    hex,
    name: getColorName(r, g, b),
    paletteName: 'Unknown',
    season: 'spring',
    confidence: 0,
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}

export interface SwatchInfo {
  hex: string
  name: string
  /** Delta-E (CIE76) distance vs the scanned color — lower = closer match */
  deltaE: number
  /** Human-readable proximity label */
  proximity: 'Exact match' | 'Very close' | 'Close' | 'Similar' | 'Different'
}

/**
 * Given a palette swatch hex and the scanned garment hex, return its
 * color name and perceptual distance so the UI can show an inline detail card.
 */
export function describeSwatchVsScanned(swatchHex: string, scannedHex: string): SwatchInfo {
  const [r, g, b] = hexToRgb(swatchHex)
  const name = getColorName(r, g, b)
  const de = deltaE(rgbToLab(...hexToRgb(swatchHex)), rgbToLab(...hexToRgb(scannedHex)))
  const proximity =
    de < 3  ? 'Exact match' :
    de < 8  ? 'Very close'  :
    de < 16 ? 'Close'       :
    de < 28 ? 'Similar'     : 'Different'
  return { hex: swatchHex, name, deltaE: Math.round(de), proximity }
}

export interface PaletteColorMatch {
  /** The specific palette swatch hex closest to the scanned color */
  swatchHex: string
  /** Human-readable name of that swatch */
  swatchName: string
  paletteName: string
  season: SeasonalPalette['season']
  deltaE: number
  proximity: SwatchInfo['proximity']
}

/**
 * For each seasonal palette, find the single closest swatch to the scanned
 * garment color. Returns results sorted by proximity, capped at `n` palettes.
 * Useful for showing "the best color match in each related season."
 */
export function findBestColorPerPalette(scannedHex: string, n = 6): PaletteColorMatch[] {
  const inputLab = rgbToLab(...hexToRgb(scannedHex))

  const results = seasonalPalettes.map(palette => {
    let bestHex = palette.colors[0]
    let bestDist = Infinity
    for (const color of palette.colors) {
      const d = deltaE(inputLab, rgbToLab(...hexToRgb(color)))
      if (d < bestDist) { bestDist = d; bestHex = color }
    }
    const [r, g, b] = hexToRgb(bestHex)
    const de = Math.round(bestDist)
    const proximity: SwatchInfo['proximity'] =
      de < 3  ? 'Exact match' :
      de < 8  ? 'Very close'  :
      de < 16 ? 'Close'       :
      de < 28 ? 'Similar'     : 'Different'
    return {
      swatchHex: bestHex,
      swatchName: getColorName(r, g, b),
      paletteName: palette.name,
      season: palette.season,
      deltaE: de,
      proximity,
    }
  })

  results.sort((a, b) => a.deltaE - b.deltaE)
  return results.slice(0, n)
}
