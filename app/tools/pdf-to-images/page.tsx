"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function PdfToImagesPage() {
  const [format, setFormat] = useState("png")
  const [dpi, setDpi] = useState(150)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("format", format)
    formData.append("dpi", dpi.toString())

    const response = await fetch("/api/tools/pdf-to-images", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Conversion failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Output Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">DPI (Resolution)</label>
        <input
          type="range"
          min="72"
          max="300"
          step="1"
          value={dpi}
          onChange={(e) => setDpi(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{dpi} DPI</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="PDF to Images"
          description="Convert PDF pages to individual image files. Returns a ZIP with all images."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
