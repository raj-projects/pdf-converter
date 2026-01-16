import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

// TODO: Add rate limiting middleware
// TODO: Add virus scanning (ClamAV)
// TODO: Add request logging and error tracking (Sentry)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Collect all PDF files
    const pdfFiles: Buffer[] = []

    // Get all form data entries and sort by numeric key
    const entries = Array.from(formData.entries())
      .filter(([key]) => key.match(/^file\d+$/))
      .sort(([keyA], [keyB]) => {
        const numA = Number.parseInt(keyA.replace("file", ""))
        const numB = Number.parseInt(keyB.replace("file", ""))
        return numA - numB
      })

    for (const [, file] of entries) {
      if (file instanceof File) {
        const buffer = await file.arrayBuffer()
        pdfFiles.push(Buffer.from(buffer))
      }
    }

    if (pdfFiles.length < 2) {
      return NextResponse.json({ error: "At least 2 PDF files are required" }, { status: 400 })
    }

    // Merge PDFs
    const mergedPdf = await PDFDocument.create()

    for (const pdfBuffer of pdfFiles) {
      const pdf = await PDFDocument.load(pdfBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedBuffer = await mergedPdf.save()

    // Return as downloadable file
    return new NextResponse(mergedBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Merge error:", error)
    return NextResponse.json({ error: "Failed to merge PDFs" }, { status: 500 })
  }
}
