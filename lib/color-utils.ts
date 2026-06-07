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

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255, gg = g / 255, bb = b / 255
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
  else if (max === gg) h = ((bb - rr) / d + 2) / 6
  else h = ((rr - gg) / d + 4) / 6
  return [h * 360, s, l]
}

function getColorName(r: number, g: number, b: number): string {
  const [h, s, l] = rgbToHsl(r, g, b)

  // Near-whites — very high lightness reads as white/cream regardless of hue tint
  if (l > 0.98) return 'White'
  if (l > 0.94) {
    if (h >= 20 && h <= 70) return 'Cream'
    return 'Off-White'
  }

  // Neutrals — low saturation
  if (s < 0.08) {
    if (l > 0.88) return 'Off-White'
    if (l > 0.78) return 'Silver'
    if (l > 0.62) return 'Light Grey'
    if (l > 0.42) return 'Grey'
    if (l > 0.22) return 'Charcoal'
    if (l > 0.08) return 'Dark Charcoal'
    return 'Black'
  }

  // Warm neutrals / browns (low-medium saturation, warm hue)
  if (s < 0.25 && h >= 15 && h <= 60) {
    if (l > 0.82) return 'Cream'
    if (l > 0.72) return 'Ivory'
    if (l > 0.60) return 'Sand'
    if (l > 0.45) return 'Tan'
    if (l > 0.30) return 'Camel'
    if (l > 0.18) return 'Dark Brown'
    return 'Espresso'
  }

  // Browns (medium saturation)
  if (s >= 0.25 && s < 0.55 && h >= 15 && h <= 40) {
    if (l > 0.70) return 'Peach'
    if (l > 0.55) return 'Apricot'
    if (l > 0.40) return 'Caramel'
    if (l > 0.28) return 'Chocolate'
    return 'Dark Brown'
  }

  // Reds (0–15 and 345–360)
  if (h < 15 || h >= 345) {
    if (l > 0.75) return 'Blush'
    if (l > 0.60) return 'Rose'
    if (s < 0.45) return l > 0.40 ? 'Dusty Rose' : 'Mauve'
    if (l > 0.45) return 'Coral Red'
    if (l > 0.30) return 'Red'
    if (l > 0.18) return 'Burgundy'
    return 'Maroon'
  }

  // Red-Orange (15–30)
  if (h < 30) {
    if (l > 0.72) return 'Salmon'
    if (l > 0.55) return 'Coral'
    if (l > 0.38) return 'Rust'
    if (l > 0.22) return 'Burnt Orange'
    return 'Dark Rust'
  }

  // Orange (30–40) — pure orange territory
  if (h < 40) {
    if (l > 0.78) return 'Peach'
    if (l > 0.62) return 'Light Peach'
    if (s < 0.4) return l > 0.50 ? 'Warm Beige' : 'Taupe'
    if (l > 0.48) return 'Orange'
    if (l > 0.33) return 'Terracotta'
    return 'Sienna'
  }

  // Amber / Golden (40–65) — warm gold territory, not orange
  if (h < 65) {
    // Low-saturation tones here are khaki/olive
    if (s < 0.30) {
      if (l > 0.65) return 'Khaki'
      if (l > 0.45) return 'Dark Khaki'
      return 'Olive'
    }
    if (l > 0.75) return 'Butter Yellow'
    if (l > 0.50) return 'Amber'
    if (l > 0.35) return 'Mustard'
    return 'Dark Mustard'
  }

  // Yellow (65–78)
  if (h < 78) {
    // Low-saturation yellows are khaki/olive, not true yellows
    if (s < 0.35) {
      if (l > 0.65) return 'Khaki'
      if (l > 0.45) return 'Dark Khaki'
      return 'Olive'
    }
    // High-saturation at h > 72 is perceptually yellow-green, not golden yellow
    if (s > 0.55 && h > 72) return l > 0.55 ? 'Chartreuse' : l > 0.38 ? 'Yellow-Green' : 'Olive Green'
    if (l > 0.75) return 'Pale Yellow'
    if (l > 0.55) return 'Yellow'
    if (l > 0.40) return 'Golden Yellow'
    return 'Ochre'
  }

  // Yellow-Green (78–110)
  if (h < 110) {
    if (s < 0.25) return l > 0.55 ? 'Khaki' : l > 0.38 ? 'Olive Green' : 'Dark Olive'
    // Vivid bright greens — high saturation prevents olive naming
    if (s > 0.55) {
      if (l > 0.60) return 'Lime'
      if (l > 0.45) return 'Chartreuse'
      if (l > 0.30) return 'Vivid Green'
      return 'Dark Green'
    }
    if (l > 0.75) return 'Lime'
    if (l > 0.55) return 'Chartreuse'
    if (l > 0.38) return 'Olive Green'
    return 'Dark Olive'
  }

  // Green (110–160)
  if (h < 160) {
    if (l > 0.80) return 'Mint'
    if (l > 0.65) return 'Light Green'
    if (s < 0.30) return l > 0.45 ? 'Sage' : 'Moss'
    if (l > 0.45) return 'Green'
    if (l > 0.28) return 'Forest Green'
    return 'Dark Green'
  }

  // Teal / Cyan (160–200)
  if (h < 200) {
    if (l > 0.70) return 'Pale Teal'
    if (l > 0.50) return 'Teal'
    if (l > 0.32) return 'Dark Teal'
    return 'Deep Teal'
  }

  // Blue (200–250)
  if (h < 250) {
    if (l > 0.80) return 'Baby Blue'
    if (l > 0.65) return 'Sky Blue'
    if (s < 0.30) return l > 0.50 ? 'Steel Blue' : 'Slate Blue'
    if (l > 0.50) return 'Cornflower Blue'
    if (l > 0.35) return 'Blue'
    if (l > 0.22) return 'Navy'
    return 'Midnight Blue'
  }

  // Blue-Purple / Violet (250–275)
  if (h < 275) {
    // Vivid high-saturation in this range is violet/purple, not periwinkle
    if (s > 0.60) return l > 0.60 ? 'Lavender' : l > 0.40 ? 'Violet' : l > 0.25 ? 'Indigo' : 'Deep Indigo'
    if (l > 0.70) return 'Lavender'
    if (l > 0.50) return 'Periwinkle'
    if (l > 0.32) return 'Indigo'
    return 'Deep Indigo'
  }

  // Purple (275–315)
  if (h < 315) {
    if (l > 0.75) return 'Lilac'
    if (l > 0.60) return 'Lavender'
    if (s < 0.30) return l > 0.45 ? 'Dusty Purple' : 'Muted Violet'
    if (l > 0.45) return 'Purple'
    if (l > 0.28) return 'Plum'
    return 'Deep Plum'
  }

  // Fuchsia / Magenta / Hot Pink (315–345)
  if (s > 0.70) {
    // Vivid high-saturation: fuchsia/magenta territory
    if (l > 0.62) return 'Fuchsia Pink'
    if (l > 0.40) return 'Fuchsia'
    if (l > 0.25) return 'Magenta'
    return 'Deep Magenta'
  }
  if (l > 0.78) return 'Blush Pink'
  if (l > 0.62) return 'Pink'
  if (s < 0.35) return l > 0.50 ? 'Dusty Mauve' : 'Mauve'
  if (l > 0.48) return 'Hot Pink'
  if (l > 0.32) return 'Raspberry'
  return 'Deep Raspberry'
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
// For each palette we take the single nearest color (min Delta-E) as that palette's score —
// this correctly handles colors that appear across multiple palettes with slight variations.
export function findTopMatches(hex: string, n = 3): ColorMatch[] {
  const [r, g, b] = hexToRgb(hex)
  const inputLab = rgbToLab(r, g, b)
  const name = getColorName(r, g, b)

  const paletteScores: Array<{ palette: SeasonalPalette; distance: number }> = []

  for (const palette of seasonalPalettes) {
    let best = Infinity
    for (const color of palette.colors) {
      const [pr, pg, pb] = hexToRgb(color)
      const d = deltaE(inputLab, rgbToLab(pr, pg, pb))
      if (d < best) best = d
    }
    paletteScores.push({ palette, distance: best })
  }

  paletteScores.sort((a, b) => a.distance - b.distance)

  return paletteScores.slice(0, n).map(({ palette, distance }) => ({
    hex,
    name,
    paletteName: palette.name,
    season: palette.season,
    // DeltaE ~1.8 scaling: 0→100%, 10→82%, 20→64%, 30→46%
    confidence: Math.max(0, Math.round(100 - distance * 1.8)),
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
