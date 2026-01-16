import { PDFDocument } from "pdf-lib"

export async function extractText(pdfBuffer: Buffer): Promise<string> {
  // Note: pdf-lib doesn't have native text extraction
  // For production, use pdfjs-dist or pdf-parse
  // This is a placeholder that returns a message

  const pdf = await PDFDocument.load(pdfBuffer)
  const pageCount = pdf.getPageCount()

  // TODO: Integrate pdfjs-dist for proper text extraction
  // const pdfjsLib = require('pdfjs-dist/legacy/build/pdf')
  // const text = await pdfjsLib.getDocument({data: pdfBuffer}).promise

  return `PDF has ${pageCount} pages.\n\nTo extract text, integrate pdfjs-dist or pdf-parse library.`
}

export async function extractMetadata(pdfBuffer: Buffer) {
  const pdf = await PDFDocument.load(pdfBuffer)

  return {
    pages: pdf.getPageCount(),
    title: pdf.getTitle() || "N/A",
    author: pdf.getAuthor() || "N/A",
    subject: pdf.getSubject() || "N/A",
    creator: pdf.getCreator() || "N/A",
    producer: pdf.getProducer() || "N/A",
    creationDate: pdf.getCreationDate()?.toISOString() || "N/A",
    modificationDate: pdf.getModificationDate()?.toISOString() || "N/A",
  }
}

export async function removeMetadata(pdfBuffer: Buffer): Promise<Buffer> {
  const pdf = await PDFDocument.load(pdfBuffer)

  // Clear metadata
  pdf.setTitle("")
  pdf.setAuthor("")
  pdf.setSubject("")
  pdf.setKeywords([])
  pdf.setProducer("")
  pdf.setCreator("")

  return Buffer.from(await pdf.save())
}
