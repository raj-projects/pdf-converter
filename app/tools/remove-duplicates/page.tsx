"use client"

import ToolTemplate from "@/components/tools/tool-template"

export default function RemoveDuplicatesPage() {
  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    formData.append("file", files[0])

    const response = await fetch("/api/tools/remove-duplicates", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Remove duplicates failed")
    return await response.blob()
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Remove Duplicate Images"
          description="Detect and remove duplicate embedded images from your PDF to reduce file size."
          onProcess={handleProcess}
        />
      </div>
    </div>
  )
}
