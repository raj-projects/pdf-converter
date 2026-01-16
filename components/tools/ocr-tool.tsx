"use client"

import { useState } from "react"
import { Download, AlertCircle } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

interface OcrFile {
  file: File
  name: string
}

type OcrOutput = "pdf" | "txt" | "both"

export default function OcrTool() {
  const [uploadedFile, setUploadedFile] = useState<OcrFile | null>(null)
  const [outputFormat, setOutputFormat] = useState<OcrOutput>("pdf")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ pdf?: string; txt?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (files: File[]) => {
    const file = files[0]
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.")
      return
    }
    setUploadedFile({ file, name: file.name })
    setError(null)
  }

  const handleOcr = async () => {
    if (!uploadedFile) {
      setError("Please upload a PDF file.")
      return
    }

    setIsProcessing(true)
    setProgress(10)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile.file)
      formData.append("format", outputFormat)

      const response = await fetch("/api/tools/ocr", {
        method: "POST",
        body: formData,
      })

      setProgress(50)

      if (!response.ok) {
        throw new Error("Failed to process OCR")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      if (outputFormat === "both") {
        // TODO: Handle multiple file downloads
        setResult({ pdf: url })
      } else {
        setResult({
          [outputFormat]: url,
        } as { pdf?: string; txt?: string })
      }

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
        <h1 className="font-display text-4xl font-bold mb-4">OCR - Extract Text</h1>
        <p className="text-lg text-muted">
          Convert scanned PDFs to searchable, editable text documents using optical character recognition.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <UploadZone onFileUpload={handleFileUpload} accept="application/pdf" multiple={false} />

          {/* File Info */}
          {uploadedFile && (
            <div className="mt-8 p-4 rounded-lg border border-border bg-card">
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted mt-1">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {/* Output Format */}
          {uploadedFile && (
            <div className="mt-8">
              <label className="block font-semibold mb-4">Output Format</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    value="pdf"
                    checked={outputFormat === "pdf"}
                    onChange={(e) => setOutputFormat(e.target.value as OcrOutput)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Searchable PDF</p>
                    <p className="text-sm text-muted">PDF with embedded text layer</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    value="txt"
                    checked={outputFormat === "txt"}
                    onChange={(e) => setOutputFormat(e.target.value as OcrOutput)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Plain Text</p>
                    <p className="text-sm text-muted">Extracted text content</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    value="both"
                    checked={outputFormat === "both"}
                    onChange={(e) => setOutputFormat(e.target.value as OcrOutput)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Both Formats</p>
                    <p className="text-sm text-muted">PDF + Text file</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20 flex gap-3">
            <AlertCircle className="flex-shrink-0 text-accent mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-semibold mb-1">Using Tesseract.js</p>
              <p className="text-muted">
                For production use, we recommend Google Vision API or AWS Textract for better accuracy with complex
                documents.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-8">
              <ProgressBar progress={progress} label="Processing with OCR..." />
            </div>
          )}

          {/* OCR Button */}
          {!result && uploadedFile && (
            <button
              onClick={handleOcr}
              disabled={isProcessing}
              className="mt-8 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? "Processing OCR..." : "Extract Text with OCR"}
            </button>
          )}

          {/* Download Button */}
          {result && (
            <div className="mt-8 space-y-3">
              {result.pdf && (
                <a
                  href={result.pdf}
                  download="searchable.pdf"
                  className="block w-full rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent-light transition-colors text-center"
                >
                  <Download className="inline mr-2" size={20} />
                  Download Searchable PDF
                </a>
              )}
              {result.txt && (
                <a
                  href={result.txt}
                  download="extracted.txt"
                  className="block w-full rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent-light transition-colors text-center"
                >
                  <Download className="inline mr-2" size={20} />
                  Download Text File
                </a>
              )}

              <button
                onClick={() => {
                  setResult(null)
                  setUploadedFile(null)
                  setProgress(0)
                }}
                className="w-full rounded-lg border border-border px-6 py-3 font-semibold hover:bg-card transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">What is OCR?</h3>
            <p className="text-sm text-muted">
              Optical Character Recognition (OCR) converts scanned images and PDFs into searchable, editable text.
              Perfect for digitizing old documents.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Accuracy</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Works best with clear, high-contrast scans</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Supports multiple languages</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Review output for accuracy</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>High-quality scans (300+ DPI) improve accuracy</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Ensure text is straight and readable</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Avoid shadows and reflections</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
