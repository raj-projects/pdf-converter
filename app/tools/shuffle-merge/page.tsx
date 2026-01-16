"use client"

import ToolTemplate from "@/components/tools/tool-template"

export default function ShuffleMergePage() {
  const handleProcess = async (files: File[], options: any) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    const response = await fetch("/api/tools/shuffle-merge", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Shuffle merge failed")
    return await response.blob()
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ToolTemplate
          title="Shuffle & Merge"
          description="Merge PDFs by interleaving pages. For example: page 1 from file 1, page 1 from file 2, page 2 from file 1, etc."
          onProcess={handleProcess}
          multiple={true}
        />
      </div>
    </div>
  )
}
