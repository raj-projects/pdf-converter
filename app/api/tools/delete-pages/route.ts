import { type NextRequest, NextResponse } from "next/server"
import { deletePagesFromPDF } from "@/lib/pdf/pages"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const pagesStr = formData.get("pages") as string

    if (!file || !pagesStr) {
      return NextResponse.json({ error: "File and pages required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pagesToDelete = pagesStr.split(",").map((p) => Number.parseInt(p.trim()) - 1)

    const result = await deletePagesFromPDF(buffer, pagesToDelete)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="deleted-pages.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
