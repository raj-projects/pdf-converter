"use client"

import { useState } from "react"
import { Download, X } from "lucide-react"
import UploadZone from "@/components/upload-zone"
import ProgressBar from "@/components/progress-bar"

type WatermarkType = "text" | "image"

interface WatermarkFile {
  file: File
  name: string
}

export default function WatermarkTool() {
  const [pdfFile, setPdfFile] = useState<WatermarkFile | null>(null)
  const [watermarkType, setWatermarkType] = useState<WatermarkType>("text")
  const [watermarkImage, setWatermarkImage] = useState<WatermarkFile | null>(null)
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [opacity, setOpacity] = useState(0.3)
  const [position, setPosition] = useState<"center" | "diagonal" | "top" | "bottom">("center")
  const [rotation, setRotation] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePdfUpload = (files: File[]) => {
    const file = files[0]
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.")
      return
    }
    setPdfFile({ file, name: file.name })
    setError(null)
  }

  const handleImageUpload = (files: File[]) => {
    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.")
      return
    }
    setWatermarkImage({ file, name: file.name })
    setError(null)
  }

  const handleAddWatermark = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file.")
      return
    }

    if (watermarkType === "image" && !watermarkImage) {
      setError("Please upload a watermark image.")
      return
    }

    if (watermarkType === "text" && !watermarkText.trim()) {
      setError("Please enter watermark text.")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", pdfFile.file)
      formData.append("type", watermarkType)
      formData.append("opacity", opacity.toString())
      formData.append("position", position)
      formData.append("rotation", rotation.toString())

      if (watermarkType === "text") {
        formData.append("text", watermarkText)
      } else if (watermarkImage) {
        formData.append("image", watermarkImage.file)
      }

      const response = await fetch("/api/tools/watermark", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to add watermark")
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
          Add Watermark
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Add text or image watermarks with custom opacity, position, and rotation.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          {/* PDF Upload */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Step 1: Upload PDF</h3>
            <UploadZone onFileUpload={handlePdfUpload} accept="application/pdf" multiple={false} />

            {pdfFile && (
              <div className="mt-4 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200">
                <p className="font-medium text-sm">{pdfFile.name}</p>
              </div>
            )}
          </div>

          {/* Watermark Type */}
          {pdfFile && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Step 2: Choose Type</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <input
                    type="radio"
                    value="text"
                    checked={watermarkType === "text"}
                    onChange={(e) => setWatermarkType(e.target.value as WatermarkType)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Text Watermark</p>
                    <p className="text-sm text-muted-foreground">Add custom text</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <input
                    type="radio"
                    value="image"
                    checked={watermarkType === "image"}
                    onChange={(e) => setWatermarkType(e.target.value as WatermarkType)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Image Watermark</p>
                    <p className="text-sm text-muted-foreground">Upload image file</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Watermark Upload/Input */}
          {pdfFile && watermarkType === "text" && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Step 3: Watermark Text</h3>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {pdfFile && watermarkType === "image" && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Step 3: Upload Watermark Image</h3>
              <UploadZone onFileUpload={handleImageUpload} accept="image/*" multiple={false} />

              {watermarkImage && (
                <div className="mt-4 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200">
                  <p className="font-medium text-sm">{watermarkImage.name}</p>
                </div>
              )}
            </div>
          )}

          {/* Watermark Settings */}
          {pdfFile && (
            <div className="mb-8 space-y-6">
              <h3 className="font-semibold text-lg">Step 4: Settings</h3>

              {/* Opacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold">Opacity</label>
                  <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block font-semibold mb-3">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["center", "diagonal", "top", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all duration-200 ${
                        position === pos
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-card border border-border hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rotation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold">Rotation</label>
                  <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="15"
                  value={rotation}
                  onChange={(e) => setRotation(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                />
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
              <ProgressBar progress={progress} label="Adding watermark..." />
            </div>
          )}

          {/* Add Watermark Button */}
          {!result && pdfFile && (
            <button
              onClick={handleAddWatermark}
              disabled={isProcessing}
              className="mt-8 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? "Adding Watermark..." : "Add Watermark"}
            </button>
          )}

          {/* Download Button */}
          {result && (
            <div className="mt-8 flex gap-4">
              <a
                href={result}
                download="watermarked.pdf"
                className="flex-1 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </a>
              <button
                onClick={() => {
                  setResult(null)
                  setPdfFile(null)
                  setWatermarkImage(null)
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
            <h3 className="font-semibold mb-4">Pro Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Low opacity for subtle watermarks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>Diagonal position works best</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span>High opacity for security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
