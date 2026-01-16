import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const mainFile = formData.get("mainFile") as File
    const insertFile = formData.get("insertFile") as File
    const position = Number.parseInt(formData.get("position") as string) || 1

    if (!mainFile || !insertFile) {
      return NextResponse.json({ error: "Both files required" }, { status: 400 })
    }

    const mainBuffer = Buffer.from(await mainFile.arrayBuffer())
    const insertBuffer = Buffer.from(await insertFile.arrayBuffer())

    const mainDoc = await PDFDocument.load(mainBuffer)
    const insertDoc = await PDFDocument.load(insertBuffer)

    const insertPages = await mainDoc.copyPages(insertDoc, insertDoc.getPageIndices())

    insertPages.forEach((page, i) => {
      mainDoc.insertPage(position + i, page)
    })

    const result = await mainDoc.save()

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inserted.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
