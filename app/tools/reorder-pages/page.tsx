"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function ReorderPagesPage() {
  const [newOrder, setNewOrder] = useState("")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("order", newOrder)

    const response = await fetch("/api/tools/reorder-pages", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Reorder failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">New Page Order</label>
        <input
          type="text"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
          placeholder="e.g., 3,1,2,4"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">Specify the desired order as comma-separated page numbers</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Reorder Pages"
          description="Reorganize PDF pages in any custom order you want."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
