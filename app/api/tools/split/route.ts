import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
import { createWriteStream } from "fs"
import { join } from "path"
import { promises as fs } from "fs"
import archiver from "archiver"

export async function POST(request: NextRequest) {
  const tempDir = join(process.cwd(), ".tmp")
  await fs.mkdir(tempDir, { recursive: true })

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const mode = formData.get("mode") as "extract" | "ranges"
    const input = formData.get("input") as string

    if (!file || !mode || !input) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buffer)
    const totalPages = pdf.getPageCount()

    // Parse input
    const pageNumbers: number[] = []
    const parts = input.split(",").map((p) => p.trim())

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((p) => Number.parseInt(p.trim()))
        for (let i = start; i <= end; i++) pageNumbers.push(i - 1) // Convert to 0-indexed
      } else {
        pageNumbers.push(Number.parseInt(part) - 1)
      }
    }

    // Filter out duplicates and invalid pages
    const validPages = [...new Set(pageNumbers)].filter((p) => p >= 0 && p < totalPages)

    let resultBuffer: Buffer

    if (mode === "extract") {
      // Extract pages into single PDF
      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(pdf, validPages)
      pages.forEach((page) => newPdf.addPage(page))
      resultBuffer = await newPdf.save()
    } else {
      // Split by ranges - create multiple PDFs in a zip
      const tempZipDir = join(tempDir, `zip-${Date.now()}`)
      await fs.mkdir(tempZipDir, { recursive: true })

      let pdfIndex = 1
      let currentPages: number[] = []

      for (const pageNum of validPages) {
        currentPages.push(pageNum)

        // Check if this is the last page or if we should start a new range
        const isLastPage = pageNum === validPages[validPages.length - 1]
        const isNewRange = pageNum < (validPages[validPages.length - 1] ?? -1) && !currentPages.includes(pageNum + 1)

        if (isNewRange || isLastPage) {
          const newPdf = await PDFDocument.create()
          const pages = await newPdf.copyPages(pdf, currentPages)
          pages.forEach((page) => newPdf.addPage(page))

          const pdfBuffer = await newPdf.save()
          const pdfPath = join(tempZipDir, `split_${pdfIndex}.pdf`)
          await fs.writeFile(pdfPath, pdfBuffer)

          pdfIndex++
          currentPages = []
        }
      }

      // Create zip file
      const zipPath = join(tempDir, `split-${Date.now()}.zip`)
      const output = createWriteStream(zipPath)
      const archive = archiver("zip", { zlib: { level: 9 } })

      await new Promise((resolve, reject) => {
        archive.on("error", reject)
        output.on("close", resolve)
        archive.pipe(output)
        archive.directory(tempZipDir, false)
        archive.finalize()
      })

      resultBuffer = await fs.readFile(zipPath)

      // Cleanup
      await fs.rm(tempZipDir, { recursive: true })
      await fs.unlink(zipPath)
    }

    return new NextResponse(resultBuffer, {
      headers: {
        "Content-Type": mode === "extract" ? "application/pdf" : "application/zip",
        "Content-Disposition":
          mode === "extract" ? 'attachment; filename="extracted.pdf"' : 'attachment; filename="split.zip"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Split error:", error)
    return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 })
  }
}
