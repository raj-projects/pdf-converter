import { type NextRequest, NextResponse } from "next/server"
import { extractPagesFromPDF } from "@/lib/pdf/pages"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const pagesStr = formData.get("pages") as string

    if (!file || !pagesStr) {
      return NextResponse.json({ error: "File and pages required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse page ranges like "1-3,5,7-10"
    const pageIndices: number[] = []
    const parts = pagesStr.split(",")
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => Number.parseInt(n.trim()) - 1)
        for (let i = start; i <= end; i++) pageIndices.push(i)
      } else {
        pageIndices.push(Number.parseInt(part.trim()) - 1)
      }
    }

    const result = await extractPagesFromPDF(buffer, pageIndices)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="extracted-pages.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
