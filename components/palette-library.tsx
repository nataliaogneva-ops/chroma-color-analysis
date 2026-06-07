"use client"

import { useState } from "react"
import { X, ChevronRight } from "lucide-react"
import { seasonalPalettes, type SeasonalPalette, getSubseasonDescription } from "@/lib/seasonal-palettes"

interface PaletteLibraryProps {
  onClose: () => void
}

const seasons = ['spring', 'summer', 'autumn', 'winter'] as const

export function PaletteLibrary({ onClose }: PaletteLibraryProps) {
  const [selectedPalette, setSelectedPalette] = useState<SeasonalPalette | null>(null)

  if (selectedPalette) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={() => setSelectedPalette(null)}
            className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
          <h1 className="font-serif text-lg tracking-wide">{selectedPalette.name}</h1>
          <button
            onClick={onClose}
            className="p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-border">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {selectedPalette.season}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getSubseasonDescription(selectedPalette.name)}
          </p>
        </div>

        {/* Color grid - 60 colors */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            {selectedPalette.colors.length} Colors
          </p>
          <div className="grid grid-cols-6 gap-1">
            {selectedPalette.colors.map((color, index) => (
              <div key={index} className="aspect-square relative group">
                <div 
                  className="w-full h-full border border-border/50"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/80">
                  <span className="text-[8px] font-mono text-background">
                    {color}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="w-10" />
        <h1 className="font-serif text-lg tracking-wide">Library</h1>
        <button
          onClick={onClose}
          className="p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Season groups */}
      <div className="flex-1 overflow-y-auto">
        {seasons.map((season) => {
          const palettes = seasonalPalettes.filter(p => p.season === season)
          return (
            <div key={season} className="border-b border-border">
              <div className="p-4 bg-secondary">
                <h2 className="text-xs tracking-[0.25em] uppercase font-medium">
                  {season}
                </h2>
              </div>
              <div className="divide-y divide-border">
                {palettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => setSelectedPalette(palette)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Preview swatches */}
                      <div className="flex">
                        {palette.previewColors.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 -ml-1 first:ml-0 border border-background"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="font-serif text-sm">{palette.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
