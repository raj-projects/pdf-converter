"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function AddPageNumbersPage() {
  const [format, setFormat] = useState<"page" | "page-of-pages">("page")
  const [position, setPosition] = useState("bottom-right")
  const [fontSize, setFontSize] = useState(12)

  const handleProcess = async (files: File[]) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("format", format)
    formData.append("position", position)
    formData.append("fontSize", fontSize.toString())

    const response = await fetch("/api/tools/add-page-numbers", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Adding page numbers failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Format</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={format === "page"} onChange={() => setFormat("page")} className="rounded" />
            <span className="text-sm text-foreground">Page numbers only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={format === "page-of-pages"}
              onChange={() => setFormat("page-of-pages")}
              className="rounded"
            />
            <span className="text-sm text-foreground">e.g., 1 / 10</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Position</label>
        <div className="grid grid-cols-3 gap-2">
          {["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"].map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                position === pos
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:border-primary"
              }`}
            >
              {pos.replace("-", "\n")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Font Size</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            value={fontSize}
            onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
            min="8"
            max="24"
            className="flex-1"
          />
          <span className="text-sm font-medium text-foreground min-w-[2rem] text-right">{fontSize}pt</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Add Page Numbers"
          description="Automatically add page numbers to all pages in your PDF document."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
