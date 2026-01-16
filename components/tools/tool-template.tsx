"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, AlertCircle, Loader2 } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

export interface ToolTemplateProps {
  title: string
  description: string
  onProcess: (files: File[], options: any) => Promise<Blob>
  optionsPanel?: React.ReactNode
  multiple?: boolean
}

export default function ToolTemplate({
  title,
  description,
  onProcess,
  optionsPanel,
  multiple = false,
}: ToolTemplateProps) {
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFilesSelected = (newFiles: File[]) => {
    if (!multiple && newFiles.length > 0) {
      setFiles([newFiles[0]])
    } else if (multiple) {
      setFiles(newFiles)
    }
    setError(null)
    setResult(null)
  }

  const handleProcess = async (options: any = {}) => {
    if (files.length === 0) {
      setError("Please select at least one file")
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const resultBlob = await onProcess(files, options)
      setResult(resultBlob)
      setProgress(100)
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
    a.download = `result-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        <UploadZone
          onFilesSelected={handleFilesSelected}
          files={files}
          multiple={multiple}
          acceptedTypes={{ "application/pdf": [".pdf"], "image/*": [".jpg", ".png", ".gif"] }}
        />
      </div>

      {/* Options Panel */}
      {optionsPanel && (
        <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">{optionsPanel}</div>
      )}

      {/* Process Button */}
      {files.length > 0 && !result && (
        <button
          onClick={() => handleProcess()}
          disabled={loading}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload size={20} />
              Process
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
              <p className="font-semibold">Processing complete</p>
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
              setFiles([])
              setResult(null)
              setProgress(0)
            }}
            className="w-full rounded-lg border border-border px-6 py-3 font-semibold text-foreground hover:bg-card/50 transition-all duration-200"
          >
            Process Another File
          </button>
        </div>
      )}
    </div>
  )
}
