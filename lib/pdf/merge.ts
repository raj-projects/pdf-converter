import { PDFDocument } from "pdf-lib"

export async function appendPDF(targetBuffer: Buffer, sourceBuffer: Buffer): Promise<Buffer> {
  const target = await PDFDocument.load(targetBuffer)
  const source = await PDFDocument.load(sourceBuffer)

  const copiedPages = await target.copyPages(
    source,
    Array.from({ length: source.getPageCount() }, (_, i) => i),
  )
  copiedPages.forEach((page) => target.addPage(page))

  return Buffer.from(await target.save())
}

export async function insertPages(targetBuffer: Buffer, sourceBuffer: Buffer, position: number): Promise<Buffer> {
  const target = await PDFDocument.load(targetBuffer)
  const source = await PDFDocument.load(sourceBuffer)

  const copiedPages = await target.copyPages(
    source,
    Array.from({ length: source.getPageCount() }, (_, i) => i),
  )
  for (let i = 0; i < copiedPages.length; i++) {
    target.insertPage(position + i, copiedPages[i])
  }

  return Buffer.from(await target.save())
}

export async function shuffleMerge(pdfBuffers: Buffer[]): Promise<Buffer> {
  if (pdfBuffers.length === 0) throw new Error("No PDFs provided")

  const newPDF = await PDFDocument.create()
  const pdfs = await Promise.all(pdfBuffers.map((buf) => PDFDocument.load(buf)))

  // Get max page count
  const maxPages = Math.max(...pdfs.map((p) => p.getPageCount()))

  // Interleave pages from each PDF
  for (let i = 0; i < maxPages; i++) {
    for (const pdf of pdfs) {
      if (i < pdf.getPageCount()) {
        const [copiedPage] = await newPDF.embedPage(pdf.getPage(i))
        newPDF.addPage(copiedPage)
      }
    }
  }

  return Buffer.from(await newPDF.save())
}
