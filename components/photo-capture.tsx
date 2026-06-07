"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { X, ImageIcon } from "lucide-react"
import { findBestMatch, rgbToHex, extractDominantColor } from "@/lib/color-utils"
import { preloadSegmenter } from "@/lib/segmentation"

interface PhotoCaptureProps {
  onPhotoCapture: (imageUrl: string, castVector: [number, number, number]) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Scan the full frame for bright, near-neutral pixels (white surface under any light).
// Returns normalised RGB cast [0–1]. Returns [1,1,1] if not enough white pixels found.
function sampleAmbientCast(ctx: CanvasRenderingContext2D, w: number, h: number): [number, number, number] {
  const data = ctx.getImageData(0, 0, w, h).data
  const total = w * h
  let rSum = 0, gSum = 0, bSum = 0, count = 0
  for (let i = 0; i < total; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]
    const lum = (r + g + b) / 3
    const neutrality = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
    // Bright and near-neutral — white paper, price tag, care label
    if (lum >= 195 && neutrality < 40) { rSum += r; gSum += g; bSum += b; count++ }
  }
  if (count < 80) return [1, 1, 1]
  return [rSum / count / 255, gSum / count / 255, bSum / count / 255]
}

function castConfidence(cast: [number, number, number]): number {
  return 1 - Math.max(Math.abs(cast[0] - 1), Math.abs(cast[1] - 1), Math.abs(cast[2] - 1))
}

// Von Kries correction, capped at 35% boost per channel.
function applyCorrection(r: number, g: number, b: number, cast: [number, number, number]): [number, number, number] {
  return [
    Math.min(255, Math.max(0, Math.round(r / Math.max(cast[0], 0.74)))),
    Math.min(255, Math.max(0, Math.round(g / Math.max(cast[1], 0.74)))),
    Math.min(255, Math.max(0, Math.round(b / Math.max(cast[2], 0.74)))),
  ]
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "requesting" | "streaming" | "denied" | "idle"

const CAST_KEY = "chroma_cast"

function loadCast(): [number, number, number] {
  try {
    const raw = localStorage.getItem(CAST_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length === 3) return parsed as [number, number, number]
    }
  } catch {}
  return [1, 1, 1]
}

function saveCast(cast: [number, number, number]) {
  try { localStorage.setItem(CAST_KEY, JSON.stringify(cast)) } catch {}
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PhotoCapture({ onPhotoCapture }: PhotoCaptureProps) {
  const [mode, setMode] = useState<Mode>("requesting")
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [liveColor, setLiveColor] = useState<{ hex: string; name: string; season: string } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number | null>(null)
  // Cast vector — loaded from localStorage, updated automatically on each capture
  // if a white reference is detected in the frame.
  const castRef = useRef<[number, number, number]>(loadCast())

  const cancelAnim = () => {
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null }
  }

  const stopCamera = useCallback(() => {
    cancelAnim()
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    if (videoRef.current) videoRef.current.srcObject = null
    setIsVideoReady(false)
    setLiveColor(null)
    setMode("idle")
  }, [])

  // ─── Live colour sampling ──────────────────────────────────────────────────

  const sampleCenterColor = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !isVideoReady || video.readyState < 2) return
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    // 28px radius circle, every 4th pixel for performance (~600 pts)
    const radius = 28
    const cx = Math.floor(canvas.width / 2), cy = Math.floor(canvas.height / 2)
    const x0 = Math.max(0, cx - radius), y0 = Math.max(0, cy - radius)
    const w = Math.min(canvas.width - x0, radius * 2 + 1), h = Math.min(canvas.height - y0, radius * 2 + 1)
    const data = ctx.getImageData(x0, y0, w, h).data
    const count = w * h

    const rawPixels: Array<[number, number, number]> = []
    for (let i = 0; i < count; i += 4) {
      const [pr, pg, pb] = applyCorrection(data[i*4], data[i*4+1], data[i*4+2], castRef.current)
      rawPixels.push([pr, pg, pb])
    }
    const [cr, cg, cb] = extractDominantColor(rawPixels)
    const hex = rgbToHex(cr, cg, cb)
    const match = findBestMatch(hex)
    setLiveColor({ hex, name: match.name, season: match.paletteName })
    animationRef.current = requestAnimationFrame(sampleCenterColor)
  }, [isVideoReady])

  // ─── Camera start ─────────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    setMode("requesting")
    setIsVideoReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      })
      streamRef.current = stream
      setMode("streaming")
    } catch {
      setMode("denied")
    }
  }, [])

  // Attach stream to video element
  useEffect(() => {
    if (mode === "streaming" && streamRef.current && videoRef.current && !isVideoReady) {
      const video = videoRef.current
      video.srcObject = streamRef.current
      video.play().then(() => setIsVideoReady(true)).catch(() => stopCamera())
    }
  }, [mode, isVideoReady, stopCamera])

  // Start live sampling loop once video is ready
  useEffect(() => {
    cancelAnim()
    if (isVideoReady && mode === "streaming") sampleCenterColor()
    return cancelAnim
  }, [mode, isVideoReady]) // eslint-disable-line react-hooks/exhaustive-deps

  // Preload MediaPipe segmentation model while user is in the viewfinder
  useEffect(() => {
    if (isVideoReady) preloadSegmenter()
  }, [isVideoReady])

  // Start camera on mount
  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      cancelAnim()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Capture ──────────────────────────────────────────────────────────────

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !isVideoReady) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)

    // Try to read white reference from the captured frame.
    // If a high-confidence white region is found anywhere in the frame,
    // use it as the cast — this corrects for the current AWB state at the
    // exact moment of capture. Otherwise fall back to the stored cast.
    const ctxRead = canvas.getContext("2d", { willReadFrequently: true }) ?? ctx
    const freshCast = sampleAmbientCast(ctxRead, canvas.width, canvas.height)
    if (castConfidence(freshCast) >= 0.82) {
      castRef.current = freshCast
      saveCast(freshCast)
    }

    const imageUrl = canvas.toDataURL("image/jpeg", 0.92)
    stopCamera()
    onPhotoCapture(imageUrl, castRef.current)
  }, [onPhotoCapture, stopCamera, isVideoReady])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onPhotoCapture(ev.target?.result as string, castRef.current)
    reader.readAsDataURL(file)
  }, [onPhotoCapture])

  // ─── Render ───────────────────────────────────────────────────────────────

  if (mode === "requesting") {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary p-8">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-foreground/20 border-t-foreground animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Opening camera…</p>
        </div>
      </div>
    )
  }

  if (mode === "denied") {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary p-8">
        <div className="text-center max-w-xs">
          <p className="font-serif text-lg mb-2">Camera Unavailable</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Allow camera access in your browser settings, or choose a photo instead.
          </p>
          <button onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-6 bg-foreground text-background text-xs tracking-[0.2em] uppercase mb-3">
            Choose Photo
          </button>
          <button onClick={startCamera} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
            Try again
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>
    )
  }

  if (mode === "idle") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-8 gap-5">
        <button onClick={startCamera}
          className="w-full max-w-xs py-4 bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors">
          Open Camera
        </button>
        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          Choose a photo
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }

  // ─── Streaming view ───────────────────────────────────────────────────────

  return (
    <div className="relative flex-1 bg-black overflow-hidden">

      <video ref={videoRef} autoPlay playsInline muted
        className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top controls */}
      <button onClick={stopCamera}
        className="absolute right-4 p-2 bg-white/95 backdrop-blur-sm text-black z-20 shadow-sm"
        style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }} aria-label="Close">
        <X className="w-5 h-5" />
      </button>
      <button onClick={() => fileInputRef.current?.click()}
        className="absolute left-4 p-2 bg-white/95 backdrop-blur-sm text-black z-20 shadow-sm"
        style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }} aria-label="Choose photo">
        <ImageIcon className="w-5 h-5" />
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      {/* Reticle + live colour chip */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full transition-colors duration-100"
            style={{
              boxShadow: `0 0 0 2px ${liveColor?.hex ?? 'rgba(255,255,255,0.9)'}, 0 0 0 3.5px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.3)`,
            }} />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
        </div>
        {liveColor && (
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 'calc(50% + 52px)' }}>
            <div className="bg-background border border-border shadow-xl p-3 min-w-[96px]">
              <div className="w-full h-10 border border-border/50 mb-2.5" style={{ backgroundColor: liveColor.hex }} />
              <p className="text-[13px] font-medium text-center text-foreground leading-tight">{liveColor.name}</p>
              <p className="text-[12px] text-center text-muted-foreground mt-0.5">{liveColor.season}</p>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-3 bg-white/50" />
          </div>
        )}
      </div>

      {/* Bottom controls — gradient scrim ensures readability over any video content */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 pt-16"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
        <button onClick={capturePhoto} disabled={!isVideoReady}
          className="w-full flex items-center justify-center py-4 bg-white text-black text-xs tracking-[0.2em] uppercase disabled:opacity-50 transition-opacity">
          Capture
        </button>
        <p className="text-[12px] tracking-[0.12em] uppercase text-white/85 text-center">
          Hold white label in frame for accurate colour
        </p>
      </div>

    </div>
  )
}
