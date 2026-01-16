import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

// TODO: Implement Ghostscript integration for high-quality compression
// import { spawn } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const mode = formData.get("mode") as "quick" | "high-quality"
    const quality = Number.parseInt(formData.get("quality") as string) || 80

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buffer)

    if (mode === "quick") {
      // Quick compression using pdf-lib
      const compressedPdf = await PDFDocument.create()
      const pages = await compressedPdf.copyPages(pdf, pdf.getPageIndices())

      pages.forEach((page) => {
        // Reduce page content
        compressedPdf.addPage(page)
      })

      const compressedBuffer = await compressedPdf.save()
      return new NextResponse(compressedBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="compressed.pdf"',
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })
    } else {
      // High-quality compression using Ghostscript
      // TODO: Implement Ghostscript subprocess call
      // For now, fall back to quick compression
      const compressedPdf = await PDFDocument.create()
      const pages = await compressedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => compressedPdf.addPage(page))

      const compressedBuffer = await compressedPdf.save()
      return new NextResponse(compressedBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="compressed.pdf"',
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })
    }
  } catch (error) {
    console.error("Compress error:", error)
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 })
  }
}
