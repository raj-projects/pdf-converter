"use client"

import { useState } from "react"
import { AlertCircle, Copy } from "lucide-react"
import UploadZone from "@/components/upload-zone"

interface Metadata {
  pages: number
  title: string
  author: string
  subject: string
  creator: string
  producer: string
  creationDate: string
  modificationDate: string
}

export default function ExtractMetadataPage() {
  const [files, setFiles] = useState<File[]>([])
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExtract = async () => {
    if (files.length === 0) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", files[0])

      const response = await fetch("/api/tools/extract-metadata", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Extraction failed")
      const data = await response.json()
      setMetadata(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract metadata")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Extract Metadata</h2>
          <p className="text-muted-foreground">View detailed information and metadata from your PDF files.</p>
          <UploadZone
            onFilesSelected={(newFiles) => {
              setFiles(newFiles)
              setMetadata(null)
              setError(null)
            }}
            files={files}
            acceptedTypes={{ "application/pdf": [".pdf"] }}
          />
        </div>

        {files.length > 0 && !metadata && (
          <button
            onClick={handleExtract}
            disabled={loading}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? "Extracting..." : "Extract Metadata"}
          </button>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {metadata && (
          <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-semibold text-foreground">PDF Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50"
                >
                  <div>
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-sm font-medium text-foreground truncate">{String(value)}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(String(value))}
                    className="p-2 hover:bg-card/50 rounded transition-colors"
                    title="Copy"
                  >
                    <Copy size={16} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setFiles([])
                setMetadata(null)
              }}
              className="w-full rounded-lg border border-border px-6 py-3 font-semibold text-foreground hover:bg-card/50 transition-all duration-200"
            >
              Extract Another File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
