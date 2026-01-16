"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function OptimizePdfPage() {
  const [quality, setQuality] = useState(75)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("quality", quality.toString())

    const response = await fetch("/api/tools/optimize-pdf", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Optimization failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Optimization Quality</label>
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Smaller Size</span>
          <span className="text-primary font-semibold">{quality}%</span>
          <span className="text-muted-foreground">Better Quality</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Optimize PDF"
          description="Optimize PDFs for web viewing with better compression and faster loading."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
