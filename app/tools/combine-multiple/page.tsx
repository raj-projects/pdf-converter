"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function CombineMultiplePage() {
  const [customOrder, setCustomOrder] = useState("")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))
    if (customOrder) formData.append("order", customOrder)

    const response = await fetch("/api/tools/combine-multiple", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Combine failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Custom Order <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={customOrder}
          onChange={(e) => setCustomOrder(e.target.value)}
          placeholder="e.g., 1,3,2 or leave blank for upload order"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">Specify the order as comma-separated numbers (1-indexed)</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Combine Multiple Files"
          description="Merge multiple PDF files with custom ordering and page selection."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
          multiple={true}
        />
      </div>
    </div>
  )
}
