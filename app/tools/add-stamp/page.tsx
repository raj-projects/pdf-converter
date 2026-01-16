"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function AddStampPage() {
  const [stampText, setStampText] = useState("APPROVED")
  const [color, setColor] = useState("#22c55e")
  const [position, setPosition] = useState("top-right")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("text", stampText)
    formData.append("color", color)
    formData.append("position", position)

    const response = await fetch("/api/tools/add-stamp", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Add stamp failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Stamp Text</label>
        <select
          value={stampText}
          onChange={(e) => setStampText(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="APPROVED">APPROVED</option>
          <option value="DRAFT">DRAFT</option>
          <option value="CONFIDENTIAL">CONFIDENTIAL</option>
          <option value="COPY">COPY</option>
          <option value="FINAL">FINAL</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded-lg border border-border"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Position</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="top-right">Top Right</option>
          <option value="top-left">Top Left</option>
          <option value="center">Center</option>
          <option value="bottom-right">Bottom Right</option>
          <option value="bottom-left">Bottom Left</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Add Stamp"
          description="Apply stamps like 'Approved', 'Draft', 'Confidential' to your PDFs."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
