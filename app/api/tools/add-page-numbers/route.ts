import { type NextRequest, NextResponse } from "next/server"
import { addPageNumbers } from "@/lib/pdf/security"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const format = (formData.get("format") as string) || "page"
    const position = (formData.get("position") as string) || "bottom-right"
    const fontSize = Number.parseInt(formData.get("fontSize") as string) || 12

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await addPageNumbers(buffer, format as "page" | "page-of-pages", position as any, fontSize)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="numbered.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
