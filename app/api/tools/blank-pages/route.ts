import { type NextRequest, NextResponse } from "next/server"
import { addBlankPagesToPDF } from "@/lib/pdf/pages"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const position = Number.parseInt(formData.get("position") as string) || 1
    const count = Number.parseInt(formData.get("count") as string) || 1

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await addBlankPagesToPDF(buffer, position - 1, count)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="with-blank-pages.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
