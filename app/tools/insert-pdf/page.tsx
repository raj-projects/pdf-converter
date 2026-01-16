"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function InsertPdfPage() {
  const [insertPosition, setInsertPosition] = useState(1)

  const handleProcess = async (files: File[], options: any) => {
    if (files.length < 2) throw new Error("Please upload at least 2 PDF files")

    const formData = new FormData()
    formData.append("mainFile", files[0])
    formData.append("insertFile", files[1])
    formData.append("position", insertPosition.toString())

    const response = await fetch("/api/tools/insert-pdf", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Insert failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Insert Position (Page Number)</label>
        <input
          type="number"
          min="1"
          value={insertPosition}
          onChange={(e) => setInsertPosition(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">The second file will be inserted after this page number</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Insert PDF Pages"
          description="Insert pages from one PDF into another at a specific position. Upload main file first, then the file to insert."
          onProcess={handleProcess}
          multiple={true}
        />
      </div>
    </div>
  )
}
