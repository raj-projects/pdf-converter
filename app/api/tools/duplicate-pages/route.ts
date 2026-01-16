import { type NextRequest, NextResponse } from "next/server"
import { duplicatePagesInPDF } from "@/lib/pdf/reorder"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const pagesStr = formData.get("pages") as string
    const times = Number.parseInt(formData.get("times") as string) || 2

    if (!file || !pagesStr) {
      return NextResponse.json({ error: "File and pages required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pagesToDup = pagesStr.split(",").map((p) => Number.parseInt(p.trim()) - 1)

    const result = await duplicatePagesInPDF(buffer, pagesToDup, times)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="duplicated.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
