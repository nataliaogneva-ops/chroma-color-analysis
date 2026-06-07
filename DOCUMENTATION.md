# CHRŌMA — Complete Documentation

> Seasonal color analysis tool. Point your camera at any garment color and discover which of the 12 seasonal palettes it belongs to — with ranked confidence scores across all palettes.

**Live app:** https://clothing-color-analysis.vercel.app

---

## Table of Contents

1. [What the App Does](#what-the-app-does)
2. [Architecture Overview](#architecture-overview)
3. [File Structure](#file-structure)
4. [Color Science](#color-science)
5. [Seasonal Palette System](#seasonal-palette-system)
6. [Component Reference](#component-reference)
7. [Algorithm Deep Dive](#algorithm-deep-dive)
8. [PWA & Deployment](#pwa--deployment)
9. [Design System](#design-system)
10. [Known Limitations & Future Work](#known-limitations--future-work)

---

## What the App Does

CHRŌMA is a mobile-first Progressive Web App that identifies the seasonal color palette of a clothing item or fabric swatch.

**User flow:**

1. App opens directly into a live camera viewfinder
2. A circular color picker (Figma-style) samples the color at the center of the frame in real time
3. A loupe card above the picker shows the current color name and best-matching season as the user moves the camera
4. User taps **CAPTURE** to freeze the frame and enter the analysis view
5. Alternatively, user taps the gallery icon (top-left) to upload a photo from their library
6. In the analysis view, the user can drag a sample pin anywhere on the photo (within the image bounds only)
7. Up to 3 sample points can be placed on the same photo to compare multiple colors
8. Each sample produces a **ranked list of the top 3 seasonal palette matches** with confidence scores (not a single forced answer)
9. The primary match drives the season description and color strip shown below
10. User taps **← Back** to return to the camera and analyze another color

---

## Architecture Overview

```
Next.js 16 (App Router) — React 19 — Tailwind CSS v4
│
├── app/
│   ├── page.tsx          — Root: switches between camera and analysis views
│   ├── layout.tsx        — Fonts, PWA metadata, viewport config
│   ├── globals.css       — Design tokens (oklch), Tailwind config
│   └── icon.tsx          — Generates 512×512 app icon via ImageResponse
│
├── components/
│   ├── photo-capture.tsx — Camera viewfinder + live color sampling
│   └── photo-analyzer.tsx — Photo tap-to-sample + ranked results panel
│
└── lib/
    ├── color-utils.ts    — Delta-E color math, palette scoring, color naming
    └── seasonal-palettes.ts — 12 palette definitions + descriptions
```

State is managed entirely with React `useState` and `useRef` — no external state library. There is no backend; all color matching runs in the browser using the Canvas API and pure TypeScript math.

---

## File Structure

```
clothing-color-analysis/
├── app/
│   ├── globals.css           Design tokens and Tailwind base styles
│   ├── icon.tsx              Next.js ImageResponse icon (512×512, used by PWA manifest)
│   ├── layout.tsx            Root layout: fonts, PWA meta, viewport
│   └── page.tsx              Entry point, switches between Capture and Analyzer views
│
├── components/
│   ├── photo-capture.tsx     Camera + file upload entry point
│   ├── photo-analyzer.tsx    Analysis view with sample pins and results
│   └── ui/                   shadcn/ui component library (unused in core flow)
│
├── lib/
│   ├── color-utils.ts        Core color math: hex↔RGB↔LAB, Delta-E, findTopMatches
│   ├── seasonal-palettes.ts  12 SeasonalPalette objects + helper functions
│   └── utils.ts              Tailwind cn() helper
│
├── public/
│   ├── manifest.json         PWA web manifest
│   ├── apple-icon.png        180×180 Apple touch icon
│   └── icon.svg              Scalable app icon (SVG)
│
├── next.config.mjs
├── tailwind.config (inline in globals.css via @import 'tailwindcss')
└── tsconfig.json
```

---

## Color Science

### Why Delta-E (CIE76)?

Human vision does not perceive color distances linearly in RGB space. Two colors that are numerically equidistant in RGB can look very different or very similar depending on their hue and lightness.

CHRŌMA converts all colors to **CIELAB color space** before comparison, which was specifically designed so that equal numerical distances correspond to roughly equal perceived differences. The distance formula used is **CIE76 Delta-E (ΔE\*):**

```
ΔE* = √((L₁−L₂)² + (a₁−a₂)² + (b₁−b₂)²)
```

Where:
- **L** = lightness (0 = black, 100 = white)
- **a** = green–red axis
- **b** = blue–yellow axis

**Reference values:**
| ΔE* | Perception |
|---|---|
| < 1.0 | Imperceptible |
| 1–2 | Barely perceptible |
| 2–10 | Noticeable difference |
| 11–50 | Similar hue family |
| > 50 | Different colors entirely |

### Color Space Conversion Pipeline

```
Captured pixel (R, G, B)
        ↓
  Linearize sRGB
  (undo gamma: x > 0.04045 ? ((x+0.055)/1.055)^2.4 : x/12.92)
        ↓
  Convert to CIE XYZ (D65 illuminant)
        ↓
  Normalize by white point (Xn=0.95047, Yn=1.0, Zn=1.08883)
        ↓
  Apply cube-root compression
        ↓
  CIE L*a*b* values
```

### Pixel Sampling

Both the live camera and the static analyzer sample a **17×17 pixel region** (radius 8) centered on the target point. The RGB values are averaged across all pixels in this region before conversion to LAB. This makes the result robust to camera noise and fine texture patterns.

### Color Naming

Colors are named via a heuristic function that maps HSL values to human-readable names. The function covers:
- **Neutrals** (White → Off-White → Silver → Light Grey → Grey → Charcoal → Black) by lightness
- **Warm neutrals / browns** (Cream → Ivory → Sand → Tan → Camel → Dark Brown → Espresso)
- **Reds, pinks, mauves, roses** across hue 0–15 and 345–360
- **Oranges, corals, terracotta** (hue 15–50)
- **Yellows, ambers, mustards** (hue 50–80)
- **Greens: lime, chartreuse, olive, sage, forest** (hue 80–160)
- **Teals and cyans** (hue 160–200)
- **Blues: sky, cornflower, steel, navy, midnight** (hue 200–250)
- **Purples, indigos, periwinkles** (hue 250–275)
- **Purples, plums, lilacs** (hue 275–320)
- **Magentas, raspberries, hot pinks** (hue 320–345)

---

## Seasonal Palette System

The app uses the **12-season color analysis system** — an extension of the classic 4-season method that subdivides each season into three sub-types.

### The Four Seasons and Their Properties

| Season | Undertone | Saturation | Value |
|---|---|---|---|
| **Spring** | Warm (yellow-based) | Clear to saturated | Light to medium |
| **Summer** | Cool (blue-pink) | Soft / muted | Light to medium |
| **Autumn** | Warm (golden-orange) | Muted to rich | Medium to deep |
| **Winter** | Cool (blue-based) | Clear to vivid | Medium to deep |

### The 12 Sub-Seasons

#### Spring (warm, yellow-based undertones)

| Sub-season | Character | Signature Colors |
|---|---|---|
| **Light Spring** | Warm, light, delicate | Ivory, warm peach, soft coral, butter yellow, baby blue |
| **True Spring** | Warm, clear, energetic | Coral orange, golden yellow, warm lime, turquoise |
| **Bright Spring** | Vivid, warm, high-contrast | Electric teal, vivid coral, hot pink, bright yellow-green |

#### Summer (cool, blue-pink undertones)

| Sub-season | Character | Signature Colors |
|---|---|---|
| **Light Summer** | Cool, light, watercolor | Powder blue, lavender, blush, pale periwinkle |
| **True Summer** | Cool, muted, romantic | Dusty rose, slate blue, soft plum, muted raspberry |
| **Soft Summer** | Extremely muted, foggy | Greyed lavender, dusty mauve, muted sage, warm cocoa |

#### Autumn (warm, golden-orange undertones)

| Sub-season | Character | Signature Colors |
|---|---|---|
| **Soft Autumn** | Warm, very muted, dusty | Camel, dusty terracotta, warm olive, golden stone |
| **True Autumn** | Rich, earthy, saturated | Burnt orange, forest green, mustard, rust, chocolate |
| **Deep Autumn** | Dark, intense, warm | Mahogany, deep burgundy, copper, dark forest, aubergine |

#### Winter (cool, blue undertones)

| Sub-season | Character | Signature Colors |
|---|---|---|
| **Bright Winter** | Most vivid of all types | Electric blue, fuchsia, true red, bright emerald |
| **True Winter** | Cool, clear, bold | Black, icy white, cobalt, crimson, emerald |
| **Deep Winter** | Cool, deep, dramatic | Midnight navy, dark burgundy, deep plum, charcoal |

### Palette Data Structure

Each palette is defined as a `SeasonalPalette` object:

```typescript
type SeasonalPalette = {
  name: string                              // e.g. "True Autumn"
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  previewColors: string[]                   // 5–6 hex values for UI strips
  colors: string[]                          // 40–55 hex values for matching
}
```

Each palette contains **40–55 colors** covering its full range: neutrals/bases, signature hues, dark/light variants, and accent tones. Total palette database: ~600 colors across 12 palettes.

---

## Component Reference

### `app/page.tsx`

Root component. Holds a single piece of state: `capturedImage: string | null`.

- `capturedImage === null` → renders `<PhotoCapture>`
- `capturedImage !== null` → renders `<PhotoAnalyzer>` with the data URL

```tsx
const [capturedImage, setCapturedImage] = useState<string | null>(null)
```

### `components/photo-capture.tsx`

Handles camera access, live color sampling, and file upload.

**State:**
| State | Type | Description |
|---|---|---|
| `mode` | `"requesting" \| "streaming" \| "denied" \| "idle"` | Camera lifecycle. Starts as `"requesting"` on mount. |
| `isVideoReady` | boolean | True once the video element has loaded a frame |
| `liveColor` | `{ hex, name, season } \| null` | Current color under the picker |

**Key behaviors:**

- **Auto-start**: calls `startCamera()` on mount via `useEffect` — no home screen
- **Live sampling**: `sampleCenterColor()` runs via `requestAnimationFrame`, averaging a 25×25 region at the center of the video frame every frame
- **Picker ring**: the circular ring's `boxShadow` color updates to `liveColor.hex` in real time, giving live visual feedback of the sampled color
- **File upload**: `<input type="file" accept="image/*">` hidden input, triggered by the gallery icon button. On mobile this opens the native photo picker
- **Denied state**: if camera permission is denied, shows "Camera Unavailable" with a "Choose Photo" fallback CTA

**Refs:**
- `videoRef` — live `<video>` element
- `canvasRef` — hidden canvas used for pixel reading
- `streamRef` — `MediaStream` for cleanup
- `animationRef` — `requestAnimationFrame` handle for cleanup
- `fileInputRef` — hidden file input

### `components/photo-analyzer.tsx`

Analysis view. Displays the captured image with interactive sample pins and a scrollable results panel.

**State:**
| State | Type | Description |
|---|---|---|
| `samples` | `SamplePoint[]` | Up to 3 sample pins. Each has `{ id, x, y, matches }` |
| `selectedId` | number | Which pin is currently active |
| `imageLoaded` | boolean | True once the canvas has the image drawn |
| `hexCopied` | boolean | Controls the copy-to-clipboard confirmation icon |

**`SamplePoint` shape:**
```typescript
interface SamplePoint {
  id: number
  x: number        // 0–1, in container space (not image space)
  y: number        // 0–1, in container space
  matches: ColorMatch[]  // top 3 palette matches, sorted by confidence
}
```

**Key behaviors:**

- **Image loading**: drawn to an offscreen `<canvas>` via `new window.Image()`. The canvas context uses `willReadFrequently: true` for optimized repeated `getImageData` calls.
- **Letterbox-aware sampling**: `toImageCoords(cx, cy)` converts container-space coordinates to image-space, accounting for `object-contain` letterboxing. Returns `null` for points in the black bars — preventing sampling outside the actual image.
- **Tap handling**: `handleImageTap` calls `toImageCoords` first and returns early if null. The active pin moves to the tapped location.
- **New sample placement**: `addSample` / `getImageBounds` computes where the image actually is within the container and places new pins inside it, not in letterbox areas.
- **Layout**: header is outside the scroll container (always visible). Image + results are in a single `overflow-y-auto` div — they scroll together. No nested scroll containers.
- **Multiple samples**: tabs appear when more than 1 pin is placed (up to 3). Each tab shows the pin's sampled color as a swatch.

### `lib/color-utils.ts`

All color math. No external dependencies.

```typescript
// Main API
findTopMatches(hex: string, n?: number): ColorMatch[]
findBestMatch(hex: string): ColorMatch   // thin wrapper over findTopMatches(hex, 1)
rgbToHex(r, g, b): string

// Internal
hexToRgb(hex): [r, g, b]
rgbToLab(r, g, b): [L, a, b]
deltaE(lab1, lab2): number
rgbToHsl(r, g, b): [h, s, l]
getColorName(r, g, b): string
```

### `lib/seasonal-palettes.ts`

Palette data + lookup helpers.

```typescript
getPaletteByName(name: string): SeasonalPalette | undefined
getPalettesBySeason(season): SeasonalPalette[]
getSeasonDescription(season): string        // one-line season overview
getSubseasonDescription(name): string       // poetic sub-season description
```

---

## Algorithm Deep Dive

### `findTopMatches` — Multi-Palette Scoring

The core matching algorithm scores the input color against all 12 palettes and returns the top N ranked matches.

```typescript
function findTopMatches(hex: string, n = 3): ColorMatch[] {
  // 1. Convert input hex to LAB
  const inputLab = rgbToLab(...hexToRgb(hex))

  // 2. For each of the 12 palettes, find the closest color (min ΔE*)
  const paletteScores = seasonalPalettes.map(palette => {
    const best = Math.min(...palette.colors.map(c => deltaE(inputLab, rgbToLab(...hexToRgb(c)))))
    return { palette, distance: best }
  })

  // 3. Sort ascending by distance
  paletteScores.sort((a, b) => a.distance - b.distance)

  // 4. Convert distances to confidence scores and return top N
  return paletteScores.slice(0, n).map(({ palette, distance }) => ({
    hex,
    name: getColorName(...hexToRgb(hex)),
    paletteName: palette.name,
    season: palette.season,
    confidence: Math.max(0, Math.round(100 - distance * 1.8))
  }))
}
```

**Why "best color in palette" rather than "average across palette"?**

Many colors exist in several palettes with slight variations. A dusty rose will appear in both True Summer (muted, cool) and Soft Autumn (muted, warm) — different hex values but perceptually close. Using the nearest color per palette correctly captures this overlap, rather than averaging the whole palette which would be dominated by its extreme colors.

**Confidence score formula:**

`confidence = max(0, round(100 - ΔE* × 1.8))`

This calibration was chosen so:
- ΔE* = 0 → 100% (exact match)
- ΔE* = 10 → 82% (very close)
- ΔE* = 20 → 64% (same family)
- ΔE* = 30 → 46% (related)
- ΔE* > 55 → 0% (no meaningful match)

**Why scores across palettes are close (e.g. 89% / 86% / 84%):**

This is by design and reflects reality. Colors like dusty sand or muted rose genuinely exist across Soft Summer, Soft Autumn, and True Summer. Tight confidence scores signal ambiguity — the user should consider all three suggestions, not just the first one. A large spread (95% / 60% / 45%) would indicate a distinctive palette color.

---

## PWA & Deployment

### Progressive Web App Setup

The app is a fully installable PWA on both iOS (Safari) and Android (Chrome).

**Files involved:**
- `public/manifest.json` — Web App Manifest
- `public/apple-icon.png` — 180×180 Apple touch icon for iOS home screen
- `app/icon.tsx` — Next.js `ImageResponse` generating a 512×512 PNG icon for Android/Chrome
- `app/layout.tsx` — Metadata API wires up manifest link, `apple-mobile-web-app-capable`, and `viewport-fit: cover`

**Manifest settings:**
```json
{
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

`display: standalone` removes browser chrome (address bar, navigation) when launched from the home screen, making it feel native.

**Safe area handling:**

Because `viewport-fit: cover` is set, the app extends behind the iPhone notch/Dynamic Island and the Android status bar. Padding is applied using CSS environment variables:

- Header top: `calc(env(safe-area-inset-top) + 0.75rem)`
- Camera buttons top: `calc(env(safe-area-inset-top) + 1rem)`
- Capture button bottom: `calc(env(safe-area-inset-bottom) + 1.5rem)`
- Results bottom: `calc(env(safe-area-inset-bottom) + 2rem)`

On devices without a notch, `env(safe-area-inset-top)` resolves to `0px` so these become normal padding values.

### Installing on iPhone

1. Open **Safari** → go to `clothing-color-analysis.vercel.app`
2. Tap the **Share** button (bottom center)
3. Tap **Add to Home Screen**
4. Tap **Add**

### Installing on Android

1. Open **Chrome** → go to `clothing-color-analysis.vercel.app`
2. Chrome will show an install banner automatically, OR tap **⋮ → Add to Home screen**
3. Tap **Add**

### Deploying Updates

```bash
cd clothing-color-analysis
npx vercel --prod
```

The production URL `clothing-color-analysis.vercel.app` always points to the latest `--prod` deployment. Preview deployments (without `--prod`) get unique URLs for testing.

---

## Design System

### Typography

Two Google Fonts:
- **Playfair Display** (`--font-playfair`) — used for serif headings, the CHRŌMA wordmark
- **Cormorant Garamond** (`--font-cormorant`, weights 300/400/500/600) — used as the default body/sans font

Both are loaded via `next/font/google` for performance (self-hosted, no layout shift).

### Color Tokens

All colors defined as `oklch` values in CSS custom properties. Monochromatic palette — no hue in the UI, allowing analyzed garment colors to be the only color on screen.

```css
--background: oklch(1 0 0)         /* pure white */
--foreground: oklch(0.1 0 0)       /* near-black */
--muted-foreground: oklch(0.45 0 0) /* medium grey */
--border: oklch(0.88 0 0)          /* light grey */
--primary: oklch(0 0 0)            /* black */
--radius: 0                         /* zero border radius — editorial aesthetic */
```

### Border Radius

`--radius: 0` — every element has sharp edges throughout the interface. This is an intentional editorial/fashion choice that makes the UI feel like a high-end magazine layout. The only exceptions are the circular sample pins and camera picker ring (explicitly `rounded-full`).

### Spacing

8pt grid via Tailwind's default spacing scale. Key values used:
- `p-3` (12px) — compact elements
- `p-4` / `px-5` (16–20px) — section padding
- `py-4` (16px) — row height in result panel
- `gap-3` / `gap-4` (12–16px) — between elements

### Dark Mode

Dark mode tokens are defined in `globals.css` under `.dark {}`. Not currently activated (no toggle) but the system is in place for future use.

---

## Known Limitations & Future Work

### Current Limitations

**Color accuracy:**
- The algorithm uses CIE76 Delta-E, which is a good approximation but not perceptually perfect for all hue ranges. CIE94 or CIEDE2000 would be more accurate, particularly for saturated blues and reds.
- Camera white balance varies significantly between devices and lighting conditions. A color that looks dusty rose under warm indoor light may register differently than in natural daylight. Results will vary.
- The sampled hex is compared against named palette swatches. If a color falls exactly between two swatches, both will score similarly (which is correctly surfaced as a tight confidence split).

**Live camera:**
- The live color picker samples the center pixel region at full frame rate. On slower devices this may drain battery faster than a still photo analysis.
- Camera permission in PWA on iOS is requested fresh each session (no persistent permission storage in Safari for PWAs installed to home screen as of iOS 17).

### Potential Improvements

| Feature | Description |
|---|---|
| **Draping simulation** | Overlay the sampled color against a neutral face/skin reference to show how it interacts with the user's complexion |
| **Season profile** | Let the user input their determined season and get a "does this garment work for me?" yes/no answer |
| **History** | Save past analyses locally using `localStorage` or IndexedDB |
| **Color library** | Browse all 12 palettes with their full color strips |
| **Offline support** | Add a service worker for full offline functionality (currently requires network for font loading) |
| **CIEDE2000** | Upgrade from CIE76 to CIEDE2000 for more accurate perceptual matching, especially for problematic hue ranges |
| **Undertone detection** | Analyze multiple skin-adjacent colors to infer warm/cool/neutral undertone, then weight palette scoring accordingly |
| **Share result** | Generate a shareable card image with the color swatch, name, season, and confidence scores |
