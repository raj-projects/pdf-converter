"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState("")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("bookmarks", bookmarks)

    const response = await fetch("/api/tools/bookmark", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Add bookmarks failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Bookmarks (JSON format)</label>
        <textarea
          value={bookmarks}
          onChange={(e) => setBookmarks(e.target.value)}
          placeholder='[{"title": "Chapter 1", "page": 1}, {"title": "Chapter 2", "page": 5}]'
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-32 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Enter bookmarks as JSON array with title and page number</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Add Bookmarks"
          description="Add navigational bookmarks to your PDF document for easier navigation."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
