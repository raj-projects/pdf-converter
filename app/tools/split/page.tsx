import SplitTool from "@/components/tools/split-tool"

export const metadata = {
  title: "Split PDF - PDFLab",
  description: "Extract specific pages or split PDFs into separate files.",
}

export default function SplitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background py-8">
      <SplitTool />
    </div>
  )
}
