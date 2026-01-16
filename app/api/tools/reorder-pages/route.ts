import { type NextRequest, NextResponse } from "next/server"
import { reorderPDFPages } from "@/lib/pdf/reorder"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const orderStr = formData.get("order") as string

    if (!file || !orderStr) {
      return NextResponse.json({ error: "File and order required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const newOrder = orderStr.split(",").map((n) => Number.parseInt(n.trim()) - 1)

    const result = await reorderPDFPages(buffer, newOrder)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reordered.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
