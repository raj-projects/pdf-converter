import { type NextRequest, NextResponse } from "next/server"
import { protectPDF } from "@/lib/pdf/security"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    if (!file || !password) {
      return NextResponse.json({ error: "File and password required" }, { status: 400 })
    }

    if (password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await protectPDF(buffer, password)

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="protected.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Protection failed" }, { status: 500 })
  }
}
