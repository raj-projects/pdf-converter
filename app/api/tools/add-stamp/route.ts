import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const text = (formData.get("text") as string) || "APPROVED"
    const color = (formData.get("color") as string) || "#22c55e"
    const position = (formData.get("position") as string) || "top-right"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfDoc = await PDFDocument.load(buffer)
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Parse hex color
    const r = Number.parseInt(color.slice(1, 3), 16) / 255
    const g = Number.parseInt(color.slice(3, 5), 16) / 255
    const b = Number.parseInt(color.slice(5, 7), 16) / 255

    const pages = pdfDoc.getPages()
    pages.forEach((page) => {
      const { width, height } = page.getSize()
      let x = 50,
        y = height - 50

      if (position === "top-right") {
        x = width - 200
        y = height - 50
      }
      if (position === "center") {
        x = width / 2 - 100
        y = height / 2
      }
      if (position === "bottom-right") {
        x = width - 200
        y = 50
      }
      if (position === "bottom-left") {
        x = 50
        y = 50
      }

      page.drawText(text, { x, y, size: 36, font, color: rgb(r, g, b), opacity: 0.5 })
    })

    const result = await pdfDoc.save()

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="stamped.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
