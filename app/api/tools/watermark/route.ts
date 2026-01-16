import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, degrees } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as "text" | "image"
    const opacity = Number.parseFloat(formData.get("opacity") as string) || 0.3
    const position = formData.get("position") as "center" | "diagonal" | "top" | "bottom"
    const rotationInput = Number.parseInt(formData.get("rotation") as string) || 0

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // <CHANGE> Convert rotation input to valid pdf-lib degrees (0-360)
    // Normalize rotation to 0-360 range and use only valid values for pdf-lib
    const normalizedRotation = ((rotationInput % 360) + 360) % 360
    const rotation = degrees(normalizedRotation)

    const buffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buffer)
    const pages = pdf.getPages()

    for (const page of pages) {
      const { width, height } = page.getSize()

      if (type === "text") {
        const text = (formData.get("text") as string) || "Watermark"

        const x = width / 2
        let y = height / 2

        switch (position) {
          case "top":
            y = height * 0.9
            break
          case "bottom":
            y = height * 0.1
            break
          case "diagonal":
            // Keep center position for diagonal
            break
        }

        page.drawText(text, {
          x: x - text.length * 2,
          y,
          size: 60,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: rotation,
        })
      } else {
        page.drawText("Image Watermark (Coming Soon)", {
          x: width / 2 - 80,
          y: height / 2,
          size: 40,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
        })
      }
    }

    const pdfBytes = await pdf.save()
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="watermarked.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Watermark error:", error)
    return NextResponse.json({ error: "Failed to add watermark" }, { status: 500 })
  }
}
