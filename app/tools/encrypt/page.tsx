"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function EncryptPage() {
  const [password, setPassword] = useState("")
  const [encryptionLevel, setEncryptionLevel] = useState("256")

  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("password", password)
    formData.append("level", encryptionLevel)

    const response = await fetch("/api/tools/encrypt", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Encryption failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter encryption password"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Encryption Level</label>
        <select
          value={encryptionLevel}
          onChange={(e) => setEncryptionLevel(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="128">128-bit (Standard)</option>
          <option value="256">256-bit (Strong)</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Encrypt PDF"
          description="Add strong encryption to your PDF files for maximum security."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
