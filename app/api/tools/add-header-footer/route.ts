import { type NextRequest, NextResponse } from "next/server"
import { addHeaderFooterToPDF } from "@/lib/pdf/security"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const header = (formData.get("header") as string) || ""
    const footer = (formData.get("footer") as string) || ""
    const fontSize = Number.parseInt(formData.get("fontSize") as string) || 10

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await addHeaderFooterToPDF(buffer, header, footer, fontSize)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="with-header-footer.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
