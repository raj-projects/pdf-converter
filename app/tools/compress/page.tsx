import CompressTool from "@/components/tools/compress-tool"

export const metadata = {
  title: "Compress PDF - PDFLab",
  description: "Reduce PDF file size while maintaining quality.",
}

export default function CompressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background py-8">
      <CompressTool />
    </div>
  )
}
