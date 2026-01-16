"use client"

import { useState } from "react"
import ToolTemplate from "@/components/tools/tool-template"

export default function ProtectPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleProcess = async (files: File[]) => {
    if (!password) throw new Error("Please enter a password")

    const formData = new FormData()
    formData.append("file", files[0])
    formData.append("password", password)

    const response = await fetch("/api/tools/protect", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Protection failed")
    return await response.blob()
  }

  const optionsPanel = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">PDF Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter protection password"
            className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Password must be at least 4 characters</p>
      </div>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
        <p className="text-sm font-semibold text-foreground">Protection includes:</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ Prevents copying text</li>
          <li>✓ Disables printing</li>
          <li>✓ Disables editing</li>
          <li>✓ Requires password to open</li>
        </ul>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Protect PDF"
          description="Add password protection and encryption to your PDF documents."
          onProcess={handleProcess}
          optionsPanel={optionsPanel}
        />
      </div>
    </div>
  )
}
