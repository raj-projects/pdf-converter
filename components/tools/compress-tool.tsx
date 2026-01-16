"use client"

import { useState } from "react"
import { Download, X } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

interface CompressFile {
  file: File
  name: string
  originalSize: number
}

type CompressMode = "quick" | "high-quality"

export default function CompressTool() {
  const [uploadedFile, setUploadedFile] = useState<CompressFile | null>(null)
  const [compressMode, setCompressMode] = useState<CompressMode>("quick")
  const [quality, setQuality] = useState(80)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (files: File[]) => {
    const file = files[0]
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.")
      return
    }

    setUploadedFile({
      file,
      name: file.name,
      originalSize: file.size,
    })
    setError(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const handleCompress = async () => {
    if (!uploadedFile) {
      setError("Please upload a PDF file.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile.file)
      formData.append("mode", compressMode)
      formData.append("quality", quality.toString())

      const response = await fetch("/api/tools/compress", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to compress PDF")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url, size: blob.size })
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const compressionRatio = result ? ((1 - result.size / uploadedFile!.originalSize) * 100).toFixed(1) : 0

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Compress PDF
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Reduce file size while maintaining quality. Choose between quick compression or high-quality mode.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <UploadZone onFileUpload={handleFileUpload} accept="application/pdf" multiple={false} />

          {/* File Info */}
          {uploadedFile && (
            <div className="mt-8 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200">
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Original size: {formatFileSize(uploadedFile.originalSize)}
              </p>
            </div>
          )}

          {/* Compression Mode Selection */}
          {uploadedFile && (
            <div className="mt-8">
              <label className="block font-semibold mb-4">Compression Mode</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <input
                    type="radio"
                    value="quick"
                    checked={compressMode === "quick"}
                    onChange={(e) => setCompressMode(e.target.value as CompressMode)}
                    className="w-4 h-4 mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Quick Compression</p>
                    <p className="text-sm text-muted-foreground">Fast compression with good results (recommended)</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <input
                    type="radio"
                    value="high-quality"
                    checked={compressMode === "high-quality"}
                    onChange={(e) => setCompressMode(e.target.value as CompressMode)}
                    className="w-4 h-4 mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">High-Quality Compression</p>
                    <p className="text-sm text-muted-foreground">Uses advanced algorithms (slower but smaller files)</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Quality Slider */}
          {uploadedFile && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <label className="block font-semibold">Quality Level</label>
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Smaller files</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex gap-2">
              <X size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-8">
              <ProgressBar progress={progress} label="Compressing PDF..." />
            </div>
          )}

          {/* Compress Button */}
          {!result && uploadedFile && (
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="mt-8 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? "Compressing..." : "Compress PDF"}
            </button>
          )}

          {/* Download Button */}
          {result && uploadedFile && (
            <div className="mt-8">
              <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Original</p>
                    <p className="font-semibold">{formatFileSize(uploadedFile.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Compressed</p>
                    <p className="font-semibold">{formatFileSize(result.size)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Reduction</p>
                    <p className="font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      {compressionRatio}% smaller
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={result.url}
                  download="compressed.pdf"
                  className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Compressed
                </a>
                <button
                  onClick={() => {
                    setResult(null)
                    setUploadedFile(null)
                    setProgress(0)
                    setQuality(80)
                  }}
                  className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-card transition-all duration-200"
                >
                  Compress More
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-4">Compression Modes</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">Quick</p>
                <p>Fast processing, good compression, ideal for most documents.</p>
              </div>
              <hr className="border-border/50" />
              <div>
                <p className="font-semibold text-foreground mb-1">High-Quality</p>
                <p>Advanced compression, better size reduction, slightly slower.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-4">Quality Guide</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">80-100%</span>
                <span>Best quality, larger files</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">50-79%</span>
                <span>Good balance, recommended</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">20-49%</span>
                <span>Maximum compression</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
