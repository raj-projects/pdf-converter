"use client"

import { useState } from "react"
import { X, Download, ChevronDown, ChevronUp } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

interface UploadedFile {
  id: string
  file: File
  name: string
}

export default function MergeTool() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (newFiles: File[]) => {
    const validFiles = newFiles.filter((f) => f.type === "application/pdf")
    if (validFiles.length !== newFiles.length) {
      setError("Only PDF files are supported.")
    }

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
    }))

    setFiles([...files, ...uploadedFiles])
    setError(null)
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const moveFile = (id: string, direction: "up" | "down") => {
    const index = files.findIndex((f) => f.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === files.length - 1)) {
      return
    }

    const newFiles = [...files]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]]
    setFiles(newFiles)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((f, index) => {
        formData.append(`file${index}`, f.file)
      })

      const response = await fetch("/api/tools/merge", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to merge PDFs")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult(url)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Merge PDFs
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Combine multiple PDF files into one single document. Upload PDFs, arrange them, and merge.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <UploadZone onFileUpload={handleFileUpload} accept="application/pdf" multiple />

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="font-semibold text-lg">Uploaded Files ({files.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveFile(file.id, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Move up"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        onClick={() => moveFile(file.id, "down")}
                        disabled={index === files.length - 1}
                        className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Move down"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                        aria-label="Remove file"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-8">
              <ProgressBar progress={progress} label="Merging PDFs..." />
            </div>
          )}

          {/* Merge Button */}
          {!result && (
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="mt-8 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? "Merging..." : "Merge PDFs"}
            </button>
          )}

          {/* Download Button */}
          {result && (
            <div className="mt-8 flex gap-4">
              <a
                href={result}
                download="merged.pdf"
                className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Merged PDF
              </a>
              <button
                onClick={() => {
                  setResult(null)
                  setFiles([])
                  setProgress(0)
                }}
                className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-card transition-all duration-200"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-4">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Upload 2 or more PDF files</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Arrange using arrow buttons</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Download instantly</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-4">Security</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All files are processed securely and deleted after 24 hours. Your data is never stored permanently.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
