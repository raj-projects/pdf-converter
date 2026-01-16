"use client"

import { useDropzone } from "react-dropzone"
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from "react"

interface UploadZoneProps {
  onFileUpload: (files: File[]) => void
  accept?: string | Record<string, string[]>
  multiple?: boolean
  maxSize?: number
}

export default function UploadZone({
  onFileUpload,
  accept = "*",
  multiple = true,
  maxSize = 100 * 1024 * 1024,
}: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null)
  const [uploadedCount, setUploadedCount] = useState(0)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        setError(`${rejectedFiles.length} file(s) were rejected. Please check file type and size.`)
      }

      if (acceptedFiles.length > 0) {
        setUploadedCount((prev) => prev + acceptedFiles.length)
        onFileUpload(acceptedFiles)
      }
    },
    accept: typeof accept === "string" ? undefined : accept,
    multiple,
    maxSize,
    disabled: false,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 scale-[1.02] shadow-lg shadow-primary/20"
            : "border-border hover:border-primary/50 bg-gradient-to-br from-card/50 to-background hover:bg-card hover:shadow-md"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center">
          <div
            className={`mb-4 p-4 rounded-full transition-all duration-300 ${
              isDragActive ? "bg-gradient-to-br from-primary/30 to-accent/30 scale-110" : "bg-gradient-to-br from-primary/15 to-accent/15"
            }`}
          >
            <Upload size={32} className={`transition-colors ${isDragActive ? "text-primary" : "text-primary/70"}`} />
          </div>

          <h3 className="font-semibold text-lg mb-2 text-foreground">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </h3>

          <p className="text-muted-foreground text-sm mb-3">
            Drag and drop files or click to select from your computer
          </p>

          <p className="text-xs text-muted-foreground font-medium">
            Max file size: {(maxSize / 1024 / 1024).toFixed(0)} MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3 items-start animate-in fade-in">
          <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {uploadedCount > 0 && !error && (
        <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex gap-3 items-start animate-in fade-in">
          <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-600 dark:text-green-400">{uploadedCount} file(s) uploaded successfully</p>
        </div>
      )}
    </div>
  )
}
