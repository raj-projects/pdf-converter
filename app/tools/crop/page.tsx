"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function CropPage() {
  const [marginTop, setMarginTop] = useState(50)
  const [marginBottom, setMarginBottom] = useState(50)
  const [marginLeft, setMarginLeft] = useState(50)
  const [marginRight, setMarginRight] = useState(50)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("top", marginTop.toString())
    formData.append("bottom", marginBottom.toString())
    formData.append("left", marginLeft.toString())
    formData.append("right", marginRight.toString())

    const response = await fetch("/api/tools/crop", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Crop failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Top Margin (points)</label>
        <input
          type="range"
          min="0"
          max="200"
          value={marginTop}
          onChange={(e) => setMarginTop(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{marginTop}pt</span>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Bottom Margin (points)</label>
        <input
          type="range"
          min="0"
          max="200"
          value={marginBottom}
          onChange={(e) => setMarginBottom(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{marginBottom}pt</span>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Left Margin (points)</label>
        <input
          type="range"
          min="0"
          max="200"
          value={marginLeft}
          onChange={(e) => setMarginLeft(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{marginLeft}pt</span>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Right Margin (points)</label>
        <input
          type="range"
          min="0"
          max="200"
          value={marginRight}
          onChange={(e) => setMarginRight(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{marginRight}pt</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Crop PDF"
          description="Remove margins from PDF pages by specifying crop values for each side."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
