/**
 * On-device garment segmentation using MediaPipe Tasks Vision.
 *
 * Uses the selfie segmenter model (~1MB) to produce a per-pixel foreground
 * confidence mask. Pixels with confidence > MASK_THRESHOLD are considered
 * part of the subject (person / garment). Background pixels (store walls,
 * mirrors, racks) are excluded before K-Means clustering so they cannot
 * pollute the extracted fabric color.
 *
 * The WASM runtime (~8MB) and model are fetched from jsDelivr CDN on first
 * use and cached by the browser — subsequent sessions are fully offline.
 * If the model fails to load for any reason, all functions fall back
 * gracefully to returning the original unmasked pixels.
 */

import {
  ImageSegmenter,
  FilesetResolver,
  type ImageSegmenterResult,
} from "@mediapipe/tasks-vision"

const MASK_THRESHOLD = 0.5

// Singleton — loaded once, reused for every subsequent image
let segmenter: ImageSegmenter | null = null
let loading = false
let loadFailed = false

async function getSegmenter(): Promise<ImageSegmenter | null> {
  if (segmenter) return segmenter
  if (loadFailed) return null
  if (loading) {
    // Wait for in-progress load
    await new Promise<void>(res => {
      const id = setInterval(() => {
        if (!loading) { clearInterval(id); res() }
      }, 100)
    })
    return segmenter
  }

  loading = true
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    )
    segmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
        delegate: "GPU",
      },
      outputCategoryMask: false,
      outputConfidenceMasks: true,
      runningMode: "IMAGE",
    })
  } catch (e) {
    console.warn("[CHRŌMA] Segmentation model failed to load — falling back to unmasked sampling.", e)
    loadFailed = true
  } finally {
    loading = false
  }
  return segmenter
}

/**
 * Warm up the segmenter in the background so it's ready when the user
 * captures a photo. Call this as soon as the camera starts streaming.
 */
export function preloadSegmenter(): void {
  getSegmenter().catch(() => {})
}

/**
 * Run segmentation on a canvas and return a Float32Array foreground mask
 * (one value per pixel, 0=background → 1=foreground), or null if
 * segmentation is unavailable.
 *
 * @param canvas  The canvas containing the full captured image.
 */
export async function getSegmentationMask(
  canvas: HTMLCanvasElement
): Promise<Float32Array | null> {
  const seg = await getSegmenter()
  if (!seg) return null

  try {
    let result: ImageSegmenterResult | null = null
    seg.segment(canvas, (r) => { result = r })
    if (!result) return null

    const masks = (result as ImageSegmenterResult).confidenceMasks
    if (!masks || masks.length === 0) return null

    // confidenceMasks[0] = foreground probability per pixel
    return masks[0].getAsFloat32Array()
  } catch (e) {
    console.warn("[CHRŌMA] Segmentation inference failed:", e)
    return null
  }
}

/**
 * Given raw canvas pixel data (ImageData) and a segmentation mask,
 * return only the pixels whose foreground confidence exceeds the threshold.
 * Falls back to all pixels if mask is null.
 *
 * @param data      ImageData.data (Uint8ClampedArray, RGBA)
 * @param mask      Float32Array from getSegmentationMask, or null
 * @param x0        x-offset of the sampled region within the full canvas
 * @param y0        y-offset of the sampled region within the full canvas
 * @param w         width of the sampled region
 * @param h         height of the sampled region
 * @param fullWidth width of the full canvas (for mask indexing)
 */
export function filterPixelsByMask(
  data: Uint8ClampedArray,
  mask: Float32Array | null,
  x0: number,
  y0: number,
  w: number,
  h: number,
  fullWidth: number
): Array<[number, number, number]> {
  const pixels: Array<[number, number, number]> = []
  const count = w * h

  for (let i = 0; i < count; i++) {
    const localX = i % w
    const localY = Math.floor(i / w)
    const canvasIdx = (y0 + localY) * fullWidth + (x0 + localX)

    // If mask is available, skip background pixels
    if (mask && mask[canvasIdx] < MASK_THRESHOLD) continue

    pixels.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]])
  }

  // If mask filtered out everything (e.g. pin placed on background),
  // fall back to all pixels so we always return something
  if (pixels.length < 10) {
    for (let i = 0; i < count; i++) {
      pixels.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]])
    }
  }

  return pixels
}
