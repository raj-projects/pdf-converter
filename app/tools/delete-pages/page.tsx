"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function DeletePagesPage() {
  const [pagesToDelete, setPageToDelete] = useState("")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("pages", pagesToDelete)

    const response = await fetch("/api/tools/delete-pages", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Delete pages failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Pages to Delete</label>
        <input
          type="text"
          value={pagesToDelete}
          onChange={(e) => setPageToDelete(e.target.value)}
          placeholder="e.g., 1,3,5-7"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter page numbers separated by commas. Use ranges like 5-7.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Delete Pages"
          description="Remove unwanted pages from your PDF document."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
