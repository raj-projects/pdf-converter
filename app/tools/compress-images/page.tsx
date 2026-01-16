"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function CompressImagesPage() {
  const [quality, setQuality] = useState(80)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("quality", quality.toString())

    const response = await fetch("/api/tools/compress-images", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Image compression failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Image Quality</label>
        <input
          type="range"
          min="20"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{quality}%</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Compress Images in PDF"
          description="Compress embedded images while maintaining quality to reduce file size."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
