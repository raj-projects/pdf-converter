import { type NextRequest, NextResponse } from "next/server"
import { cropPDF } from "@/lib/pdf/crop"
import { PDFDocument } from "pdf-lib" // Import PDFDocument

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const top = Number.parseInt(formData.get("top") as string) || 0
    const right = Number.parseInt(formData.get("right") as string) || 0
    const bottom = Number.parseInt(formData.get("bottom") as string) || 0
    const left = Number.parseInt(formData.get("left") as string) || 0
    const pages = (formData.get("pages") as string)?.split(",").map(Number) || []

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfDoc = await PDFDocument.load(buffer) // Declare PDFDocument
    const pageCount = pdfDoc.getPageCount()
    const pageIndices = pages.length > 0 ? pages : Array.from({ length: pageCount }, (_, i) => i)

    const result = await cropPDF(buffer, pageIndices, { top, right, bottom, left })

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cropped.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
