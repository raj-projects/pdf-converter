import { type NextRequest, NextResponse } from "next/server"
import { mergePDFs } from "@/lib/pdf/merge"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const orderStr = formData.get("order") as string | null

    if (files.length < 2) {
      return NextResponse.json({ error: "At least 2 files required" }, { status: 400 })
    }

    const buffers = await Promise.all(files.map(async (f) => Buffer.from(await f.arrayBuffer())))

    let orderedBuffers = buffers
    if (orderStr) {
      const order = orderStr.split(",").map((n) => Number.parseInt(n.trim()) - 1)
      orderedBuffers = order.map((i) => buffers[i])
    }

    const result = await mergePDFs(orderedBuffers)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="combined.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
