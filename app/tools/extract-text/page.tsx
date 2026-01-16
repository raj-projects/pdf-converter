"use client"

import ToolTemplate from "@/components/tools/tool-template"

export default function ExtractTextPage() {
  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])

    const response = await fetch("/api/tools/extract-text", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Extract text failed")
    return await response.blob()
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Extract Text"
          description="Extract all text content from your PDF document. Returns a text file."
          onProcess={handleProcess}
        />
      </div>
    </div>
  )
}
