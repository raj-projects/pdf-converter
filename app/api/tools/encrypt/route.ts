import { type NextRequest, NextResponse } from "next/server"
import { protectPDF } from "@/lib/pdf/security"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string
    const level = formData.get("level") as string

    if (!file || !password) {
      return NextResponse.json({ error: "File and password required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await protectPDF(buffer, password, password)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="encrypted.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
