"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function UnlockPage() {
  const [password, setPassword] = useState("")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("password", password)

    const response = await fetch("/api/tools/unlock", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Unlock failed - check password")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Current Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter PDF password"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Unlock PDF"
          description="Remove password protection from your PDF files."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
