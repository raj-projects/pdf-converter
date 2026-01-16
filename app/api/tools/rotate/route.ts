import { type NextRequest, NextResponse } from "next/server"
import { rotatePDF } from "@/lib/pdf/rotate"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const rotation = Number.parseInt(formData.get("rotation") as string) || 0
    const pages = (formData.get("pages") as string)?.split(",").map(Number) || []

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pageIndices = pages.length > 0 ? pages : [0]

    const result = await rotatePDF(buffer, pageIndices, rotation)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rotated.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
