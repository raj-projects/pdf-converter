import OcrTool from "@/components/tools/ocr-tool"

export const metadata = {
  title: "OCR - Extract Text - PDFLab",
  description: "Convert scanned PDFs to searchable text documents.",
}

export default function OcrPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background py-8">
      <OcrTool />
    </div>
  )
}
