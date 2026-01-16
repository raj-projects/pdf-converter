"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function DuplicatePagesPage() {
  const [pagesToDuplicate, setPagesToDuplicate] = useState("")
  const [times, setTimes] = useState(2)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("pages", pagesToDuplicate)
    formData.append("times", times.toString())

    const response = await fetch("/api/tools/duplicate-pages", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Duplicate failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Pages to Duplicate</label>
        <input
          type="text"
          value={pagesToDuplicate}
          onChange={(e) => setPagesToDuplicate(e.target.value)}
          placeholder="e.g., 1,3,5"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Duplicate Times</label>
        <input
          type="number"
          min="1"
          max="10"
          value={times}
          onChange={(e) => setTimes(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Duplicate Pages"
          description="Duplicate specific pages within your PDF document."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
