"use client"

import { useState } from "react"
import { PhotoCapture } from "@/components/photo-capture"
import { PhotoAnalyzer } from "@/components/photo-analyzer"

export default function Home() {
  const [captured, setCaptured] = useState<{ imageUrl: string; castVector: [number, number, number] } | null>(null)

  if (captured) {
    return (
      <main className="h-screen flex flex-col bg-background">
        <PhotoAnalyzer
          imageUrl={captured.imageUrl}
          castVector={captured.castVector}
          onReset={() => setCaptured(null)}
        />
      </main>
    )
  }

  return (
    <main className="h-screen flex flex-col bg-background">
      <PhotoCapture onPhotoCapture={(imageUrl, castVector) => setCaptured({ imageUrl, castVector })} />
    </main>
  )
}
