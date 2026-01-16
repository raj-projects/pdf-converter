import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length < 2) {
      return NextResponse.json({ error: "At least 2 files required" }, { status: 400 })
    }

    const docs = await Promise.all(files.map(async (f) => PDFDocument.load(await f.arrayBuffer())))

    const mergedDoc = await PDFDocument.create()
    const maxPages = Math.max(...docs.map((doc) => doc.getPageCount()))

    for (let i = 0; i < maxPages; i++) {
      for (const doc of docs) {
        if (i < doc.getPageCount()) {
          const [page] = await mergedDoc.copyPages(doc, [i])
          mergedDoc.addPage(page)
        }
      }
    }

    const result = await mergedDoc.save()

    return new NextResponse(result, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="shuffled.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
