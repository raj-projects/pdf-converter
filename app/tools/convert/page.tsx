import ConvertTool from "@/components/tools/convert-tool"

export const metadata = {
  title: "Convert PDF - PDFLab",
  description: "Convert images to PDF or extract images from PDFs.",
}

export default function ConvertPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background py-8">
      <ConvertTool />
    </div>
  )
}
