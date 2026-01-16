import WatermarkTool from "@/components/tools/watermark-tool"

export const metadata = {
  title: "Add Watermark - PDFLab",
  description: "Add text or image watermarks to your PDFs.",
}

export default function WatermarkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background py-8">
      <WatermarkTool />
    </div>
  )
}
