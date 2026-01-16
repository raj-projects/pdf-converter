"use client"

import { useState } from "react"
import { Upload, Download, AlertCircle, Loader2 } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

export default function AppendPDFPage() {
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [result, setResult] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleProcess = async () => {
    if (!targetFile || !sourceFile) {
      setError("Please select both target and source PDFs")
      return
    }

    setLoading(true)
    setError(null)
    setProgress(50)

    try {
      const formData = new FormData()
      formData.append("target", targetFile)
      formData.append("source", sourceFile)

      const response = await fetch("/api/tools/append-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Append failed")
      setProgress(100)
      setResult(await response.blob())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const url = URL.createObjectURL(result)
    const a = document.createElement("a")
    a.href = url
    a.download = `appended-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-background via-background to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Append PDF</h2>
          <p className="text-muted-foreground">Add pages from one PDF to the end of another.</p>
        </div>

        {/* Target PDF */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Target PDF (base document)</h3>
          <UploadZone
            onFilesSelected={(files) => {
              if (files.length > 0) setTargetFile(files[0])
            }}
            files={targetFile ? [targetFile] : []}
            acceptedTypes={{ "application/pdf": [".pdf"] }}
          />
          {targetFile && <p className="text-sm text-muted-foreground">✓ {targetFile.name}</p>}
        </div>

        {/* Source PDF */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Source PDF (to append)</h3>
          <UploadZone
            onFilesSelected={(files) => {
              if (files.length > 0) setSourceFile(files[0])
            }}
            files={sourceFile ? [sourceFile] : []}
            acceptedTypes={{ "application/pdf": [".pdf"] }}
          />
          {sourceFile && <p className="text-sm text-muted-foreground">✓ {sourceFile.name}</p>}
        </div>

        {/* Process Button */}
        {targetFile && sourceFile && !result && (
          <button
            onClick={handleProcess}
            disabled={loading}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload size={20} />
                Append PDFs
              </>
            )}
          </button>
        )}

        {/* Progress */}
        {loading && <ProgressBar progress={progress} />}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="p-6 rounded-lg border border-primary/30 bg-primary/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Download size={24} />
              <div>
                <p className="font-semibold">PDFs appended successfully</p>
                <p className="text-sm text-muted-foreground">Your file is ready to download</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
              Download Result
            </button>
            <button
              onClick={() => {
                setTargetFile(null)
                setSourceFile(null)
                setResult(null)
              }}
              className="w-full rounded-lg border border-border px-6 py-3 font-semibold text-foreground hover:bg-card/50 transition-all duration-200"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
