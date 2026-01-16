"use client"

import { useState } from "react"
import { Download, X } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"
import { PDFDocument } from "pdf-lib"

interface SplitFile {
  file: File
  name: string
  pages: number
}

type SplitMode = "extract" | "ranges"

export default function SplitTool() {
  const [uploadedFile, setUploadedFile] = useState<SplitFile | null>(null)
  const [splitMode, setSplitMode] = useState<SplitMode>("extract")
  const [pageRanges, setPageRanges] = useState("")
  const [extractPages, setExtractPages] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (files: File[]) => {
    const file = files[0]
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.")
      return
    }

    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer())
      const pageCount = pdf.getPageCount()

      setUploadedFile({
        file,
        name: file.name,
        pages: pageCount,
      })
      setError(null)
    } catch (err) {
      setError("Failed to read PDF file. Please ensure it's a valid PDF.")
    }
  }

  const validatePageInput = (input: string, totalPages: number): boolean => {
    if (!input.trim()) return false
    const parts = input.split(",").map((p) => p.trim())
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((p) => Number.parseInt(p.trim()))
        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) return false
      } else {
        const page = Number.parseInt(part)
        if (isNaN(page) || page < 1 || page > totalPages) return false
      }
    }
    return true
  }

  const handleSplit = async () => {
    if (!uploadedFile) {
      setError("Please upload a PDF file.")
      return
    }

    const input = splitMode === "extract" ? extractPages : pageRanges
    if (!validatePageInput(input, uploadedFile.pages)) {
      setError(`Invalid page numbers. Valid range: 1-${uploadedFile.pages}`)
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile.file)
      formData.append("mode", splitMode)
      formData.append("input", input)

      const response = await fetch("/api/tools/split", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to split PDF")
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
          Split PDF
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Extract specific pages or split PDFs into individual files. Specify page numbers or ranges.
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
              <p className="text-sm text-muted-foreground mt-1">{uploadedFile.pages} pages</p>
            </div>
          )}

          {/* Split Mode Selection */}
          {uploadedFile && (
            <div className="mt-8">
              <label className="block font-semibold mb-4">Split Mode</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <input
                    type="radio"
                    value="extract"
                    checked={splitMode === "extract"}
                    onChange={(e) => setSplitMode(e.target.value as SplitMode)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Extract Pages</p>
                    <p className="text-sm text-muted-foreground">Extract specific pages into a new PDF</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <input
                    type="radio"
                    value="ranges"
                    checked={splitMode === "ranges"}
                    onChange={(e) => setSplitMode(e.target.value as SplitMode)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Split by Ranges</p>
                    <p className="text-sm text-muted-foreground">Create multiple PDFs from ranges</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Input Section */}
          {uploadedFile && (
            <div className="mt-8">
              <label className="block font-semibold mb-2">
                {splitMode === "extract" ? "Pages to Extract" : "Page Ranges"}
              </label>
              <textarea
                value={splitMode === "extract" ? extractPages : pageRanges}
                onChange={(e) =>
                  splitMode === "extract" ? setExtractPages(e.target.value) : setPageRanges(e.target.value)
                }
                placeholder={
                  splitMode === "extract"
                    ? "e.g., 1,2,5 or 1,3-5,7"
                    : "e.g., 1-3 (creates one PDF) or 1-3,4-6,7-10 (creates three PDFs)"
                }
                className="w-full p-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-24"
              />
              <p className="text-xs text-muted-foreground mt-2">Pages range: 1 to {uploadedFile.pages}</p>
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
              <ProgressBar progress={progress} label="Splitting PDF..." />
            </div>
          )}

          {/* Split Button */}
          {!result && uploadedFile && (
            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="mt-8 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? "Splitting..." : "Split PDF"}
            </button>
          )}

          {/* Download Button */}
          {result && (
            <div className="mt-8 flex gap-4">
              <a
                href={result}
                download={`split-${Date.now()}.zip`}
                className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Result
              </a>
              <button
                onClick={() => {
                  setResult(null)
                  setUploadedFile(null)
                  setExtractPages("")
                  setPageRanges("")
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
            <h3 className="font-semibold mb-4">Format Examples</h3>
            <div className="space-y-3 text-sm text-muted-foreground font-mono text-xs">
              <div>
                <p className="font-semibold text-foreground mb-1">Extract Pages:</p>
                <p className="bg-background/50 px-2 py-1 rounded">1,2,5</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Extract Range:</p>
                <p className="bg-background/50 px-2 py-1 rounded">1-3,5</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Split by Ranges:</p>
                <p className="bg-background/50 px-2 py-1 rounded">1-3,4-6,7-10</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Use commas to separate pages</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Use hyphens for ranges (e.g., 1-5)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Mix individual and ranges</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
