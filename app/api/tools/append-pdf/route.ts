import { type NextRequest, NextResponse } from "next/server"
import { appendPDF } from "@/lib/pdf/merge"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const targetFile = formData.get("target") as File
    const sourceFile = formData.get("source") as File

    if (!targetFile || !sourceFile) {
      return NextResponse.json({ error: "Both target and source files required" }, { status: 400 })
    }

    const targetBuffer = Buffer.from(await targetFile.arrayBuffer())
    const sourceBuffer = Buffer.from(await sourceFile.arrayBuffer())

    const result = await appendPDF(targetBuffer, sourceBuffer)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="appended.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Append failed" }, { status: 500 })
  }
}
