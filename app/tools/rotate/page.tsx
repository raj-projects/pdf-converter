"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function RotatePage() {
  const [rotation, setRotation] = useState(90)
  const [selectAllPages, setSelectAllPages] = useState(true)

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("rotation", rotation.toString())
    formData.append("pages", selectAllPages ? "" : "0")

    const response = await fetch("/api/tools/rotate", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Rotation failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Rotation Angle</label>
        <div className="flex gap-2 flex-wrap">
          {[0, 90, 180, 270].map((angle) => (
            <button
              key={angle}
              onClick={() => setRotation(angle)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                rotation === angle
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:border-primary"
              }`}
            >
              {angle}°
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectAllPages}
            onChange={(e) => setSelectAllPages(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-foreground">Apply to all pages</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Rotate PDF"
          description="Rotate pages in your PDF document. Choose rotation angle and apply to all pages or specific ones."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
