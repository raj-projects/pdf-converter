import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const quality = Number.parseInt(formData.get("quality") as string) || 80

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfDoc = await PDFDocument.load(buffer)

    // Note: Full image compression requires additional processing
    // This is a placeholder that re-saves the PDF
    const result = await pdfDoc.save()

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed-images.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
