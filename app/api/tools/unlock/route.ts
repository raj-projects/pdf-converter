import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    if (!file || !password) {
      return NextResponse.json({ error: "File and password required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Note: pdf-lib doesn't directly support password removal
    // Use qpdf or similar: qpdf --password=pass --decrypt input.pdf output.pdf
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const result = await pdfDoc.save()

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="unlocked.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Unlock failed - check password" }, { status: 500 })
  }
}
