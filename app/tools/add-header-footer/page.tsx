"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function AddHeaderFooterPage() {
  const [headerText, setHeaderText] = useState("")
  const [footerText, setFooterText] = useState("")
  const [fontSize, setFontSize] = useState(10)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("header", headerText)
    formData.append("footer", footerText)
    formData.append("fontSize", fontSize.toString())

    const response = await fetch("/api/tools/add-header-footer", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Add header/footer failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Header Text</label>
        <input
          type="text"
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          placeholder="Leave empty for no header"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Footer Text</label>
        <input
          type="text"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          placeholder="Leave empty for no footer"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Font Size</label>
        <input
          type="range"
          min="8"
          max="20"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-primary font-semibold">{fontSize}pt</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Add Header & Footer"
          description="Add custom headers and footers to all pages of your PDF."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
