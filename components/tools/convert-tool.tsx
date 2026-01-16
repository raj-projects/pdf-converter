"use client"

import { useState } from "react"
import { Download, ImagePlus, FileText } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

type ConvertMode = "images-to-pdf" | "pdf-to-images"

interface UploadedFile {
  file: File
  name: string
}

export default function ConvertTool() {
  const [mode, setMode] = useState<ConvertMode>("images-to-pdf")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (files: File[]) => {
    if (mode === "images-to-pdf") {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"))
      if (imageFiles.length !== files.length) {
        setError("Only image files are supported for this mode.")
      }
      setUploadedFiles((prev) => [...prev, ...imageFiles.map((f) => ({ file: f, name: f.name }))])
    } else {
      const pdfFiles = files.filter((f) => f.type === "application/pdf")
      if (pdfFiles.length !== files.length) {
        setError("Only PDF files are supported for this mode.")
      }
      setUploadedFiles(pdfFiles.map((f) => ({ file: f, name: f.name })))
    }
    setError(null)
  }

  const removeFile = (name: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.name !== name))
  }

  const handleConvert = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one file.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("mode", mode)
      uploadedFiles.forEach((f, index) => {
        formData.append(`file${index}`, f.file)
      })

      const response = await fetch("/api/tools/convert", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to convert files")
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold mb-4">Convert Files</h1>
        <p className="text-lg text-muted">Convert images to PDF or extract images from PDF files.</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          {/* Conversion Mode */}
          <div className="mb-8">
            <label className="block font-semibold mb-4">Conversion Mode</label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value="images-to-pdf"
                  checked={mode === "images-to-pdf"}
                  onChange={(e) => {
                    setMode(e.target.value as ConvertMode)
                    setUploadedFiles([])
                  }}
                  className="w-4 h-4 mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium flex items-center gap-2">
                    <ImagePlus size={18} />
                    Images to PDF
                  </p>
                  <p className="text-sm text-muted">Convert JPG, PNG, WebP to PDF</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value="pdf-to-images"
                  checked={mode === "pdf-to-images"}
                  onChange={(e) => {
                    setMode(e.target.value as ConvertMode)
                    setUploadedFiles([])
                  }}
                  className="w-4 h-4 mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium flex items-center gap-2">
                    <FileText size={18} />
                    PDF to Images
                  </p>
                  <p className="text-sm text-muted">Extract pages as JPG or PNG</p>
                </div>
              </label>
            </div>
          </div>

          {/* Upload Zone */}
          <UploadZone
            onFileUpload={handleFileUpload}
            accept={mode === "images-to-pdf" ? "image/*" : "application/pdf"}
            multiple={true}
          />

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3">Uploaded Files ({uploadedFiles.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uploadedFiles.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{f.name}</p>
                      <p className="text-xs text-muted">{formatFileSize(f.file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(f.name)}
                      className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                      aria-label="Remove file"
                    >
                      ✕
                    </button>
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
              <ProgressBar progress={progress} label="Converting..." />
            </div>
          )}

          {/* Convert Button */}
          {!result && (
            <button
              onClick={handleConvert}
              disabled={uploadedFiles.length === 0 || isProcessing}
              className="mt-8 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? "Converting..." : "Convert Files"}
            </button>
          )}

          {/* Download Button */}
          {result && (
            <div className="mt-8 flex gap-4">
              <a
                href={result}
                download={`converted-${Date.now()}.${mode === "images-to-pdf" ? "pdf" : "zip"}`}
                className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent-light transition-colors flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download {mode === "images-to-pdf" ? "PDF" : "Images"}
              </a>
              <button
                onClick={() => {
                  setResult(null)
                  setUploadedFiles([])
                  setProgress(0)
                }}
                className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-card transition-colors"
              >
                Convert More
              </button>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Supported Formats</h3>
            <div className="space-y-4 text-sm text-muted">
              <div>
                <p className="font-semibold text-foreground mb-2">Images to PDF:</p>
                <p className="font-mono text-xs">JPG, PNG, WebP, GIF, BMP</p>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-semibold text-foreground mb-2">PDF to Images:</p>
                <p className="font-mono text-xs">JPG or PNG per page</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Upload multiple images to merge into one PDF</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>PDF to Images outputs each page as a separate image</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Results are downloaded as ZIP when extracting multiple images</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
