import { PDFDocument } from "pdf-lib"

export interface ProcessingOptions {
  quality?: "low" | "medium" | "high"
  format?: string
  password?: string
  permissions?: {
    printing?: boolean
    copying?: boolean
    editing?: boolean
  }
}

export async function validatePDFFile(buffer: Buffer): Promise<boolean> {
  try {
    const pdf = await PDFDocument.load(buffer)
    return pdf.getPageCount() > 0
  } catch (error) {
    return false
  }
}

export async function getPDFInfo(buffer: Buffer) {
  try {
    const pdf = await PDFDocument.load(buffer)
    const pages = pdf.getPageCount()

    const firstPage = pdf.getPage(0)
    const width = firstPage.getWidth()
    const height = firstPage.getHeight()

    return {
      pages,
      width: Math.round(width),
      height: Math.round(height),
      size: buffer.length,
    }
  } catch (error) {
    throw new Error("Failed to read PDF info")
  }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._\- ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 255)
}

export function generateUniqueId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
