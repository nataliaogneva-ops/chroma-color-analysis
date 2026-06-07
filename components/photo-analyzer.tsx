"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronDown, Copy, Check, Share2, ScanLine } from "lucide-react"
import { findTopMatches, rgbToHex, extractDominantColor, describeSwatchVsScanned, findBestColorPerPalette, type ColorMatch, type SwatchInfo, type PaletteColorMatch } from "@/lib/color-utils"
import { getSubseasonDescription, getPaletteByName } from "@/lib/seasonal-palettes"
import { getSegmentationMask, filterPixelsByMask } from "@/lib/segmentation"

interface SamplePoint {
  id: number
  // position in container space (0–1)
  x: number
  y: number
  matches: ColorMatch[]    // top 3, sorted by confidence
  scannedHex: string       // raw extracted garment color (before palette matching)
}

// Von Kries chromatic adaptation — correct sampled pixel for ambient light cast
function applyCorrection(r: number, g: number, b: number, cast: [number, number, number]): [number, number, number] {
  return [
    Math.min(255, Math.max(0, Math.round(r / cast[0]))),
    Math.min(255, Math.max(0, Math.round(g / cast[1]))),
    Math.min(255, Math.max(0, Math.round(b / cast[2]))),
  ]
}

interface PhotoAnalyzerProps {
  imageUrl: string
  castVector: [number, number, number]
  onReset: () => void
}

export function PhotoAnalyzer({ imageUrl, castVector, onReset }: PhotoAnalyzerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sample, setSample] = useState<SamplePoint | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hexCopied, setHexCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  // One selectedSwatch + which accordion index owns it (null = none)
  const [selectedSwatch, setSelectedSwatch] = useState<SwatchInfo | null>(null)
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState<number | null>(null)
  // Open state per season match accordion (indices 0–2)
  const [accordionsOpen, setAccordionsOpen] = useState<boolean[]>([false, false, false])

  const toggleAccordion = useCallback((idx: number) => {
    setAccordionsOpen(prev => prev.map((v, i) => i === idx ? !v : v))
    setSelectedSwatch(null)
    setSelectedSwatchIdx(null)
  }, [])
  const [shareSupported] = useState(() => typeof navigator !== "undefined" && !!navigator.share)
  const imageDataRef = useRef<{ width: number; height: number; ctx: CanvasRenderingContext2D } | null>(null)
  // Segmentation mask — populated async after image loads; null = not ready yet (fall back to unmasked)
  const maskRef = useRef<Float32Array | null>(null)
  // rAF-throttle state for live drag sampling
  const rafRef = useRef<number | null>(null)
  const pendingCoordsRef = useRef<{ x: number; y: number } | null>(null)

  // Convert container coords (0–1) → image coords (0–1), accounting for object-contain letterboxing.
  // Returns null when the point falls in the letterbox (outside the actual image).
  const toImageCoords = useCallback((cx: number, cy: number): [number, number] | null => {
    if (!imageDataRef.current || !containerRef.current) return null
    const { width: iw, height: ih } = imageDataRef.current
    const rect = containerRef.current.getBoundingClientRect()
    const ca = rect.width / rect.height
    const ia = iw / ih
    let left = 0, top = 0, w = 1, h = 1
    if (ia > ca) { h = ca / ia; top = (1 - h) / 2 }
    else { w = ia / ca; left = (1 - w) / 2 }
    const ix = (cx - left) / w
    const iy = (cy - top) / h
    if (ix < 0 || ix > 1 || iy < 0 || iy > 1) return null
    return [ix, iy]
  }, [])

  const sampleAt = useCallback((cx: number, cy: number): { matches: ColorMatch[], scannedHex: string } => {
    const fallbackHex = "#888888"
    const fallback: ColorMatch = { hex: fallbackHex, name: "Unknown", paletteName: "Unknown", season: "spring", confidence: 0 }
    if (!imageDataRef.current) return { matches: [fallback], scannedHex: fallbackHex }
    const coords = toImageCoords(cx, cy)
    if (!coords) return { matches: [fallback], scannedHex: fallbackHex }
    const [ix, iy] = coords
    const { width, height, ctx } = imageDataRef.current
    const px = Math.floor(ix * width)
    const py = Math.floor(iy * height)
    // 28px radius matches the live reticle; gives K-Means enough pixels to cluster meaningfully
    const radius = 28
    const x0 = Math.max(0, px - radius), y0 = Math.max(0, py - radius)
    const w = Math.min(width - x0, radius * 2 + 1), h = Math.min(height - y0, radius * 2 + 1)
    const imageData = ctx.getImageData(x0, y0, w, h)

    // Filter pixels through segmentation mask (excludes background), then cast-correct
    const masked = filterPixelsByMask(imageData.data, maskRef.current, x0, y0, w, h, width)
    const corrected = masked.map(([r, g, b]) => applyCorrection(r, g, b, castVector))
    const [cr, cg, cb] = extractDominantColor(corrected)
    const scannedHex = rgbToHex(cr, cg, cb)
    return { matches: findTopMatches(scannedHex, 3), scannedHex }
  }, [toImageCoords, castVector])

  // Load image onto canvas, then auto-place sample at center
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      imageDataRef.current = { width: img.width, height: img.height, ctx }
      setImageLoaded(true)
      setTimeout(() => {
        const { matches, scannedHex } = sampleAt(0.5, 0.5)
        setSample({ id: 0, x: 0.5, y: 0.5, matches, scannedHex })
      }, 80)

      // Run segmentation in background — updates maskRef when ready.
      // Any subsequent tap re-samples automatically picking up the mask.
      getSegmentationMask(canvas).then(mask => {
        if (mask) {
          maskRef.current = mask
          // Re-sample with the mask now available
          setSample(prev => {
            if (!prev) return prev
            const { matches, scannedHex } = sampleAt(prev.x, prev.y)
            return { ...prev, matches, scannedHex }
          })
        }
      })
    }
    img.src = imageUrl
  }, [imageUrl, sampleAt])

  // Helper — get clamped container-relative coords from a pointer event
  const getCoordsFromEvent = useCallback((e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return null
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    if (!toImageCoords(x, y)) return null
    return {
      x: Math.max(0.02, Math.min(0.98, x)),
      y: Math.max(0.02, Math.min(0.98, y)),
    }
  }, [toImageCoords])

  // Flush pending coordinates → update pin + sample in one rAF tick
  const flushRaf = useCallback(() => {
    rafRef.current = null
    const coords = pendingCoordsRef.current
    if (!coords) return
    pendingCoordsRef.current = null
    const { matches, scannedHex } = sampleAt(coords.x, coords.y)
    setSample(prev => prev ? { ...prev, x: coords.x, y: coords.y, matches, scannedHex } : null)
  }, [sampleAt])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!imageLoaded) return
    const coords = getCoordsFromEvent(e)
    if (!coords) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setSelectedSwatch(null)
    setSelectedSwatchIdx(null)
    setAccordionsOpen([false, false, false])
    // Immediate sample on first touch so there's instant feedback
    const { matches, scannedHex } = sampleAt(coords.x, coords.y)
    setSample(prev => prev ? { ...prev, x: coords.x, y: coords.y, matches, scannedHex } : null)
  }, [imageLoaded, getCoordsFromEvent, sampleAt])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const coords = getCoordsFromEvent(e)
    if (!coords) return
    // Move pin immediately (CSS position update is cheap)
    pendingCoordsRef.current = coords
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(flushRaf)
    }
    // Also update pin position instantly via setSample without waiting for rAF
    setSample(prev => prev ? { ...prev, x: coords.x, y: coords.y } : null)
  }, [isDragging, getCoordsFromEvent, flushRaf])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    // Cancel any pending rAF and do a final accurate sample on release
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const coords = getCoordsFromEvent(e) ?? pendingCoordsRef.current
    pendingCoordsRef.current = null
    if (!coords) return
    const { matches, scannedHex } = sampleAt(coords.x, coords.y)
    setSample(prev => prev ? { ...prev, x: coords.x, y: coords.y, matches, scannedHex } : null)
  }, [isDragging, getCoordsFromEvent, sampleAt])

  const copyHex = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setHexCopied(true)
      setTimeout(() => setHexCopied(false), 1500)
    })
  }, [])

  const topMatch = sample?.matches[0]
  const crossPaletteMatches: PaletteColorMatch[] = sample ? findBestColorPerPalette(sample.scannedHex, 6) : []

  const shareResult = useCallback(async () => {
    if (!topMatch) return
    const description = getSubseasonDescription(topMatch.paletteName)
    const text = `${topMatch.name} · ${topMatch.paletteName}\n${topMatch.hex.toUpperCase()}\n\n${description}`
    try {
      await navigator.share({ title: "CHRŌMA Color Analysis", text })
    } catch {
      // user cancelled or share unavailable — silently ignore
    }
  }, [topMatch])

  return (
    // min-h-0 is required for flex children to shrink and allow inner overflow-y-auto to work
    <div className="flex-1 flex flex-col bg-background min-h-0">

      {/* Header — sits outside the scroll container so it never scrolls away */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 pb-3 border-b border-border bg-background z-20"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[13px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 -ml-1" />
          Back
        </button>
        <h1 className="font-serif text-lg tracking-wide">CHRŌMA</h1>
        <div className="w-16" />
      </div>

      {/* Single scroll container — image + results scroll together */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* Image area — touch-none prevents scroll interference so taps register cleanly */}
        <div
          ref={containerRef}
          className="relative bg-black overflow-hidden touch-none flex-shrink-0"
          style={{ height: '45vh' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <canvas ref={canvasRef} className="hidden" />
          <div className="relative w-full h-full">
            <Image src={imageUrl} alt="Analyzed photo" fill className="object-contain pointer-events-none" />

            {/* Sample pin — grows slightly while dragging for tactile feedback */}
            {imageLoaded && sample && (
              <div
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${isDragging ? 'scale-125' : 'scale-110'}`}
                style={{ left: `${sample.x * 100}%`, top: `${sample.y * 100}%`, zIndex: 40 }}
              >
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.7)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.8)]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-px h-full bg-white/50" />
                  <div className="absolute h-px w-full bg-white/50" />
                </div>
              </div>
            )}
          </div>

          {imageLoaded && !isDragging && (
            <p className="absolute bottom-2 left-0 right-0 text-center text-[13px] tracking-[0.15em] uppercase text-white/90 pointer-events-none" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              Drag to sample
            </p>
          )}
        </div>

        {/* Result panel — no overflow-y-auto here; the parent scroll container handles it */}
        {sample && topMatch && (
          <div>
            {/* Color identity */}
            <div className="border-b border-border">
              <div className="flex gap-4 px-5 pt-5 pb-4">
                <div className="w-[110px] h-[110px] flex-shrink-0 border border-border/40" style={{ backgroundColor: topMatch.hex }} />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <p className="font-serif text-2xl leading-tight">{topMatch.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{topMatch.paletteName}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => copyHex(topMatch.hex)}
                      className="flex items-center gap-1.5 text-[13px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {hexCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {topMatch.hex.toUpperCase()}
                    </button>
                    {shareSupported && (
                      <button
                        onClick={shareResult}
                        className="flex items-center gap-1.5 text-[13px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ranked palette matches */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Seasonal matches</p>
              <div className="flex flex-col gap-3">
                {sample.matches.map((match, i) => (
                  <div key={match.paletteName} className="flex items-center gap-3">
                    <span className="text-[12px] text-muted-foreground w-3 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className={`text-[13px] ${i === 0 ? 'text-foreground font-medium' : 'text-foreground/70'}`}>
                          {match.paletteName}
                        </span>
                        <span className="text-[13px] font-mono text-muted-foreground ml-2 flex-shrink-0">
                          {match.confidence}%
                        </span>
                      </div>
                      <div className="h-[3px] bg-border">
                        <div
                          className="h-[3px] bg-foreground transition-all"
                          style={{ width: `${match.confidence}%`, opacity: i === 0 ? 1 : 0.35 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordions — one per seasonal match (top 3) */}
            {sample.matches.map((match, idx) => {
              const palette = getPaletteByName(match.paletteName)
              if (!palette) return null
              const isOpen = accordionsOpen[idx]
              return (
                <div key={match.paletteName} className="border-b border-border">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 focus:outline-none"
                  >
                    <span className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground">
                      About {match.paletteName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-foreground leading-relaxed mb-5">
                        {getSubseasonDescription(match.paletteName)}
                      </p>

                      <p className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                        More {match.paletteName} colors
                      </p>

                      <div className="flex gap-1.5 overflow-x-auto py-[3px] -my-[3px] px-[3px] -mx-[3px]">
                        {palette.colors.map((c, i) => {
                          const isSelected = selectedSwatchIdx === idx && selectedSwatch?.hex.toUpperCase() === c.toUpperCase()
                          const de = sample ? describeSwatchVsScanned(c, sample.scannedHex).deltaE : 999
                          const harmonyTier = de <= 6 ? 'strong' : de <= 14 ? 'soft' : 'none'
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSwatch(null); setSelectedSwatchIdx(null)
                                } else {
                                  setSelectedSwatch(describeSwatchVsScanned(c, sample?.scannedHex ?? match.hex))
                                  setSelectedSwatchIdx(idx)
                                }
                              }}
                              className={`w-11 h-11 flex-shrink-0 focus:outline-none transition-shadow duration-150 ${
                                isSelected
                                  ? 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.95),0_0_0_2px_rgba(0,0,0,0.9)] border-0'
                                  : harmonyTier === 'strong'
                                    ? 'border border-border/30 shadow-[0_0_0_2px_rgba(255,255,255,0.55)]'
                                    : harmonyTier === 'soft'
                                      ? 'border border-border/30 shadow-[0_0_0_1.5px_rgba(255,255,255,0.22)]'
                                      : 'border border-border/30'
                              }`}
                              style={{ backgroundColor: c }}
                              aria-label={c}
                            />
                          )
                        })}
                      </div>

                      {selectedSwatchIdx === idx && selectedSwatch && (
                        <div className="mt-3 flex items-center gap-3 p-3 border border-border bg-secondary/40">
                          <div
                            className="w-10 h-10 flex-shrink-0 border border-border/40"
                            style={{ backgroundColor: selectedSwatch.hex }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base leading-tight">{selectedSwatch.name}</p>
                            <p className="text-[12px] font-mono text-muted-foreground mt-0.5">{selectedSwatch.hex.toUpperCase()}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-[12px] font-medium ${
                              selectedSwatch.proximity === 'Exact match' ? 'text-emerald-500' :
                              selectedSwatch.proximity === 'Very close'  ? 'text-emerald-400' :
                              selectedSwatch.proximity === 'Close'       ? 'text-amber-400'   :
                              selectedSwatch.proximity === 'Similar'     ? 'text-orange-400'  :
                              'text-muted-foreground'
                            }`}>{selectedSwatch.proximity}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Best color match per related palette — 2×3 grid */}
            {crossPaletteMatches.length > 0 && (
              <div className="px-5 pt-5 pb-5 border-b border-border">
                <p className="text-[13px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Closest match per season
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {crossPaletteMatches.slice(0, 6).map((m) => (
                    <div key={m.paletteName} className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 flex-shrink-0 border border-border/30"
                        style={{ backgroundColor: m.swatchHex }}
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] text-foreground leading-tight truncate">{m.swatchName}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{m.paletteName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scan again */}
            <div className="px-5 pt-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
              <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 py-4 border border-border text-[13px] tracking-[0.2em] uppercase text-foreground hover:bg-secondary transition-colors"
              >
                <ScanLine className="w-4 h-4" />
                Scan another garment
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
