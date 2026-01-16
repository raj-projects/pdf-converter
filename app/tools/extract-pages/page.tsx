"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function ExtractPagesPage() {
  const [pageRange, setPageRange] = useState("")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("pages", pageRange)

    const response = await fetch("/api/tools/extract-pages", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Extract pages failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Pages to Extract</label>
        <input
          type="text"
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
          placeholder="e.g., 1-3,5,7-10"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">Enter page numbers or ranges separated by commas</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Extract Pages"
          description="Extract specific pages from your PDF into a new document."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
