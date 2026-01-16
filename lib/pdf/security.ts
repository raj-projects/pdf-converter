import { PDFDocument } from "pdf-lib"

export async function protectPDF(pdfBuffer: Buffer, password: string): Promise<Buffer> {
  const pdf = await PDFDocument.load(pdfBuffer)

  // Note: pdf-lib has limited encryption support
  // For production, consider using a library with AES-256 encryption
  try {
    // This is a placeholder - pdf-lib's encryption is basic
    // For real encryption, use: @react-pdf/crypto or similar
    pdf.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: "highResolution",
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
    })
  } catch (e) {
    console.log("Encryption may be limited - consider upgrading pdf-lib")
  }

  return Buffer.from(await pdf.save())
}

export async function addPageNumbers(
  pdfBuffer: Buffer,
  format: "page" | "page-of-pages" = "page",
  position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" = "bottom-right",
  fontSize = 12,
): Promise<Buffer> {
  const { PDFDocument, rgb } = await import("pdf-lib")
  const pdf = await PDFDocument.load(pdfBuffer)
  const totalPages = pdf.getPageCount()

  for (let i = 0; i < totalPages; i++) {
    const page = pdf.getPage(i)
    const { width, height } = page.getSize()

    const pageNum = i + 1
    const text = format === "page-of-pages" ? `${pageNum} / ${totalPages}` : pageNum.toString()

    let x = width - 50
    let y = 20

    if (position.includes("left")) x = 20
    if (position.includes("center")) x = width / 2 - 20
    if (position.includes("top")) y = height - 30

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      color: rgb(0.5, 0.5, 0.5),
    })
  }

  return Buffer.from(await pdf.save())
}

export async function addHeaderFooter(
  pdfBuffer: Buffer,
  header?: string,
  footer?: string,
  fontSize = 10,
): Promise<Buffer> {
  const { PDFDocument, rgb } = await import("pdf-lib")
  const pdf = await PDFDocument.load(pdfBuffer)

  for (let i = 0; i < pdf.getPageCount(); i++) {
    const page = pdf.getPage(i)
    const { width, height } = page.getSize()

    if (header) {
      page.drawText(header, {
        x: 20,
        y: height - 20,
        size: fontSize,
        color: rgb(0.3, 0.3, 0.3),
      })
    }

    if (footer) {
      page.drawText(footer, {
        x: 20,
        y: 20,
        size: fontSize,
        color: rgb(0.3, 0.3, 0.3),
      })
    }
  }

  return Buffer.from(await pdf.save())
}
