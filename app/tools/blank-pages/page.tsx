"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function BlankPagesPage() {
  const [position, setPosition] = useState(1)
  const [count, setCount] = useState(1)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("position", position.toString())
    formData.append("count", count.toString())

    const response = await fetch("/api/tools/blank-pages", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Add blank pages failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Insert Position</label>
        <input
          type="number"
          min="1"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Number of Blank Pages</label>
        <input
          type="number"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Add Blank Pages"
          description="Insert blank pages at specific positions in your PDF."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
