"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { X, ImageIcon, RefreshCw } from "lucide-react"
import { findBestMatch, rgbToHex, extractDominantColor } from "@/lib/color-utils"
import { preloadSegmenter } from "@/lib/segmentation"

interface PhotoCaptureProps {
  onPhotoCapture: (imageUrl: string, castVector: [number, number, number]) => void
}

// ─── Ambient light helpers ────────────────────────────────────────────────────

// Find bright near-neutral pixels (a white surface under any lighting).
// Returns the average RGB normalised to 0–1.
function sampleAmbientCast(ctx: CanvasRenderingContext2D, w: number, h: number): [number, number, number] {
  const data = ctx.getImageData(0, 0, w, h).data
  const pixelCount = w * h
  let rSum = 0, gSum = 0, bSum = 0, count = 0
  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]
    if ((r + g + b) / 3 >= 200) { rSum += r; gSum += g; bSum += b; count++ }
  }
  if (count < 50) return [1, 1, 1]
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

// Sample only the target circle region, returns isWhite + cast.
function sampleTargetCircle(
  ctx: CanvasRenderingContext2D,
  vw: number, vh: number, radiusPx: number
): { isWhite: boolean; cast: [number, number, number] } {
  const cx = Math.floor(vw / 2), cy = Math.floor(vh / 2)
  const x0 = Math.max(0, cx - radiusPx), y0 = Math.max(0, cy - radiusPx)
  const w = Math.min(vw - x0, radiusPx * 2 + 1), h = Math.min(vh - y0, radiusPx * 2 + 1)
  const data = ctx.getImageData(x0, y0, w, h).data
  const count = w * h
  let rSum = 0, gSum = 0, bSum = 0
  for (let i = 0; i < count; i++) { rSum += data[i * 4]; gSum += data[i * 4 + 1]; bSum += data[i * 4 + 2] }
  const r = rSum / count, g = gSum / count, b = bSum / count
  const lum = (r + g + b) / 3
  const neutrality = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
  // Relaxed threshold so warm-white tags and slightly off-white walls are accepted.
  const isWhite = lum > 185 && neutrality < 45
  return { isWhite, cast: [r / 255, g / 255, b / 255] }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode =
  | "requesting"
  | "calibrating"       // auto-sampling ambient on camera open
  | "mixedLightModal"   // confidence < 80%: blurred camera + interruption modal
  | "whiteRefTarget"    // user chose to calibrate: target circle
  | "whiteRefSuccess"   // locked: green circle + haptic
  | "streaming"
  | "denied"
  | "idle"

const TARGET_RADIUS_CSS = 80
const LOCK_FRAMES_NEEDED = 45   // ~0.75s at 60fps

// ─── Component ───────────────────────────────────────────────────────────────

export function PhotoCapture({ onPhotoCapture }: PhotoCaptureProps) {
  const [mode, setMode] = useState<Mode>("requesting")
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [liveColor, setLiveColor] = useState<{ hex: string; name: string; season: string } | null>(null)
  const [fillProgress, setFillProgress] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number | null>(null)
  const CAST_KEY = "chroma_cast"
  const savedCast = (): [number, number, number] => {
    try {
      const raw = localStorage.getItem(CAST_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length === 3) return parsed as [number, number, number]
      }
    } catch {}
    return [1, 1, 1]
  }
  const saveCast = (cast: [number, number, number]) => {
    try { localStorage.setItem(CAST_KEY, JSON.stringify(cast)) } catch {}
  }

  const castRef = useRef<[number, number, number]>(savedCast())
  const goodFramesRef = useRef(0)
  const pendingCastRef = useRef<[number, number, number]>([1, 1, 1])
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelAnim = () => {
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null }
  }

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(msg)
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const stopCamera = useCallback(() => {
    cancelAnim()
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    if (videoRef.current) videoRef.current.srcObject = null
    setIsVideoReady(false)
    setLiveColor(null)
    setFillProgress(0)
    setToast(null)
    goodFramesRef.current = 0
    setMode("idle")
  }, [])

  // ─── Auto-calibration ─────────────────────────────────────────────────────

  const runAutoCalibration = useCallback(async () => {
    setMode("calibrating")
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) { setMode("streaming"); return }
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) { setMode("streaming"); return }
    let rA = 0, gA = 0, bA = 0
    const FRAMES = 5
    for (let i = 0; i < FRAMES; i++) {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      const [r, g, b] = sampleAmbientCast(ctx, canvas.width, canvas.height)
      rA += r; gA += g; bA += b
      if (i < FRAMES - 1) await new Promise(res => setTimeout(res, 200))
    }
    const cast: [number, number, number] = [rA / FRAMES, gA / FRAMES, bA / FRAMES]
    if (castConfidence(cast) >= 0.80) {
      castRef.current = cast; saveCast(cast)
      setMode("streaming")
    } else {
      setMode("mixedLightModal")
    }
  }, [])

  // ─── Live color sampling (streaming mode) ─────────────────────────────────

  const sampleCenterColor = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !isVideoReady || video.readyState < 2) return
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    // Sample a 28px radius circle, apply cast correction, then run K-Means in CIELAB
    // to extract the dominant fabric color — isolating the true hue from texture micro-shadows.
    const radius = 28
    const cx = Math.floor(canvas.width / 2), cy = Math.floor(canvas.height / 2)
    const x0 = Math.max(0, cx - radius), y0 = Math.max(0, cy - radius)
    const w = Math.min(canvas.width - x0, radius * 2 + 1), h = Math.min(canvas.height - y0, radius * 2 + 1)
    const data = ctx.getImageData(x0, y0, w, h).data
    const count = w * h

    // Subsample every 4th pixel for live-preview performance (~600 pts → <1ms K-Means)
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

  // ─── White-surface auto-detection loop (whiteRefTarget mode) ─────────────

  const runWhiteDetection = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(runWhiteDetection)
      return
    }
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const scaleX = video.videoWidth / (videoRef.current?.clientWidth ?? video.videoWidth)
    const radiusPx = Math.round(TARGET_RADIUS_CSS * scaleX)
    const { isWhite, cast } = sampleTargetCircle(ctx, canvas.width, canvas.height, radiusPx)

    if (isWhite) {
      goodFramesRef.current++
      pendingCastRef.current = [
        (pendingCastRef.current[0] * (goodFramesRef.current - 1) + cast[0]) / goodFramesRef.current,
        (pendingCastRef.current[1] * (goodFramesRef.current - 1) + cast[1]) / goodFramesRef.current,
        (pendingCastRef.current[2] * (goodFramesRef.current - 1) + cast[2]) / goodFramesRef.current,
      ]
    } else {
      goodFramesRef.current = Math.max(0, goodFramesRef.current - 2)
    }

    setFillProgress(Math.min(100, Math.round((goodFramesRef.current / LOCK_FRAMES_NEEDED) * 100)))

    if (goodFramesRef.current >= LOCK_FRAMES_NEEDED) {
      castRef.current = pendingCastRef.current; saveCast(pendingCastRef.current)
      cancelAnim()
      setMode("whiteRefSuccess")
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(200)
      showToast("Lighting calibrated")
      setTimeout(() => setMode("streaming"), 1600)
      return
    }
    animationRef.current = requestAnimationFrame(runWhiteDetection)
  }, [showToast])

  // ─── Force-lock whatever is in the circle right now ───────────────────────

  const forceWhiteLock = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) return
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const scaleX = video.videoWidth / (videoRef.current?.clientWidth ?? video.videoWidth)
    const radiusPx = Math.round(TARGET_RADIUS_CSS * scaleX)
    const { cast } = sampleTargetCircle(ctx, canvas.width, canvas.height, radiusPx)
    const frames = goodFramesRef.current
    const forcedCast: [number, number, number] = frames > 0
      ? [
          (pendingCastRef.current[0] * frames + cast[0]) / (frames + 1),
          (pendingCastRef.current[1] * frames + cast[1]) / (frames + 1),
          (pendingCastRef.current[2] * frames + cast[2]) / (frames + 1),
        ]
      : cast
    castRef.current = forcedCast; saveCast(forcedCast)
    cancelAnim()
    setMode("whiteRefSuccess")
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(200)
    showToast("Lighting calibrated")
    setTimeout(() => setMode("streaming"), 1600)
  }, [showToast])

  // ─── Camera start ─────────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    setMode("requesting")
    setIsVideoReady(false)
    // Restore saved cast — castRef is already initialised from localStorage on mount,
    // but re-read here in case the user recalibrated in a previous session this run.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      })
      streamRef.current = stream
      setMode("calibrating")
    } catch {
      setMode("denied")
    }
  }, [])

  const handleManualRecalibrate = useCallback(() => {
    cancelAnim()
    goodFramesRef.current = 0
    pendingCastRef.current = [1, 1, 1]
    setFillProgress(0)
    setMode("whiteRefTarget")
  }, [])

  // Attach stream to video
  useEffect(() => {
    const cameraActive = ["calibrating", "mixedLightModal", "whiteRefTarget", "whiteRefSuccess", "streaming"].includes(mode)
    if (cameraActive && streamRef.current && videoRef.current && !isVideoReady) {
      const video = videoRef.current
      video.srcObject = streamRef.current
      video.play().then(() => setIsVideoReady(true)).catch(() => stopCamera())
    }
  }, [mode, isVideoReady, stopCamera])

  // Preload segmentation model as soon as camera is live — so it's warm by capture time
  useEffect(() => {
    if (isVideoReady) preloadSegmenter()
  }, [isVideoReady])

  // Kick off auto-calibration once video ready
  useEffect(() => {
    if (isVideoReady && mode === "calibrating") runAutoCalibration()
  }, [isVideoReady]) // eslint-disable-line react-hooks/exhaustive-deps

  // Start the right loop when mode changes
  useEffect(() => {
    cancelAnim()
    if (isVideoReady && mode === "streaming") {
      sampleCenterColor()
    } else if (isVideoReady && mode === "whiteRefTarget") {
      goodFramesRef.current = 0
      pendingCastRef.current = [1, 1, 1]
      setFillProgress(0)
      runWhiteDetection()
    }
    return cancelAnim
  }, [mode, isVideoReady]) // eslint-disable-line react-hooks/exhaustive-deps

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
    const imageUrl = canvas.toDataURL("image/jpeg", 0.92)
    stopCamera()
    onPhotoCapture(imageUrl, castRef.current)
  }, [onPhotoCapture, stopCamera, isVideoReady])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onPhotoCapture(ev.target?.result as string, [1, 1, 1])
    reader.readAsDataURL(file)
  }, [onPhotoCapture])

  // ─── SVG ring dims ────────────────────────────────────────────────────────

  const R = TARGET_RADIUS_CSS
  const circumference = 2 * Math.PI * R
  const strokeDash = (fillProgress / 100) * circumference
  const cameraActive = ["calibrating", "mixedLightModal", "whiteRefTarget", "whiteRefSuccess", "streaming"].includes(mode)

  // ─── Early returns ────────────────────────────────────────────────────────

  if (mode === "requesting") {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary p-8">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-foreground/20 border-t-foreground animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Requesting camera…</p>
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
          <button onClick={() => setMode("idle")} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
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

  // ─── Camera view ──────────────────────────────────────────────────────────

  return (
    <div className="relative flex-1 bg-black overflow-hidden">

      {cameraActive && (
        <video ref={videoRef} autoPlay playsInline muted
          className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500"
          style={{ filter: mode === "mixedLightModal" ? "blur(8px)" : "none" }} />
      )}
      <canvas ref={canvasRef} className="hidden" />

      {/* Toast */}
      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/70 backdrop-blur-sm"
          style={{ top: 'calc(env(safe-area-inset-top) + 4rem)' }}>
          <p className="text-[13px] tracking-[0.2em] uppercase text-white whitespace-nowrap">{toast}</p>
        </div>
      )}

      {/* Top chrome (streaming only) */}
      {mode === "streaming" && (
        <>
          <button onClick={stopCamera}
            className="absolute right-4 p-2 bg-background/90 text-foreground z-20"
            style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="absolute left-4 p-2 bg-background/90 text-foreground z-20"
            style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }} aria-label="Choose photo">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </>
      )}

      {/* Calibrating spinner */}
      {mode === "calibrating" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 gap-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin" />
          <p className="text-xs tracking-[0.2em] uppercase text-white/80">Reading environment…</p>
        </div>
      )}

      {/* Mixed light modal */}
      {mode === "mixedLightModal" && (
        <div className="absolute inset-0 z-30 flex flex-col items-end justify-end">
          <div className="w-full bg-background/95 backdrop-blur-sm border-t border-border px-5 pt-6"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
            <p className="font-serif text-base mb-1">Mixed lighting detected</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Calibrate the camera to ensure accurate color matching.
            </p>
            <button onClick={() => { cancelAnim(); setMode("whiteRefTarget") }}
              className="w-full flex flex-col items-start gap-1 p-4 bg-foreground text-background mb-3 text-left active:opacity-80 transition-opacity">
              <span className="text-xs tracking-[0.2em] uppercase font-medium">Calibrate Camera</span>
              <span className="text-xs opacity-60 leading-relaxed">Point at a white surface to correct for lighting</span>
            </button>
            <button onClick={() => { setMode("streaming") }}
              className="w-full py-3 text-center text-xs tracking-[0.15em] uppercase text-muted-foreground border border-border active:opacity-60 transition-opacity">
              Try Scanning Anyway
            </button>
          </div>
        </div>
      )}

      {/* White reference target */}
      {mode === "whiteRefTarget" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <p className="text-xs tracking-[0.15em] uppercase text-white mb-6 text-center px-8 pointer-events-none"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Point the circle at a white<br />price tag, receipt, or wall
          </p>
          <div className="relative flex items-center justify-center pointer-events-none mb-8">
            <svg width={(R + 12) * 2} height={(R + 12) * 2} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={R + 12} cy={R + 12} r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
              <circle cx={R + 12} cy={R + 12} r={R} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ transition: 'stroke-dasharray 0.1s linear' }} />
            </svg>
            <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
          </div>
          <button onClick={forceWhiteLock}
            className="px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs tracking-[0.2em] uppercase active:bg-white/25 transition-colors">
            This is White ✓
          </button>
        </div>
      )}

      {/* White reference success */}
      {mode === "whiteRefSuccess" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center mb-4">
            <svg width={(R + 12) * 2} height={(R + 12) * 2} className="absolute">
              <circle cx={R + 12} cy={R + 12} r={R} fill="none" stroke="#4ade80" strokeWidth={3} />
            </svg>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <p className="text-xs tracking-[0.2em] uppercase text-white" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Lighting calibrated
          </p>
        </div>
      )}

      {/* Streaming: reticle + color chip + buttons */}
      {mode === "streaming" && (
        <>
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

          <div className="absolute bottom-0 left-0 right-0 px-6 pt-6 flex flex-col items-center gap-3"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
            <button onClick={capturePhoto} disabled={!isVideoReady}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-background text-foreground text-xs tracking-[0.2em] uppercase disabled:opacity-50 transition-opacity">
              Capture
            </button>
            <button onClick={handleManualRecalibrate}
              className="flex items-center gap-1.5 text-[13px] tracking-[0.15em] uppercase text-white/60 hover:text-white/90 transition-colors py-1">
              <RefreshCw className="w-3 h-3" />
              Fix lighting
            </button>
          </div>
        </>
      )}
    </div>
  )
}
