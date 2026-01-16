import MergeTool from "@/components/tools/merge-tool"

export const metadata = {
  title: "Merge PDF - PDFLab",
  description: "Combine multiple PDF files into one single document.",
}

export default function MergePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background py-8">
      <MergeTool />
    </div>
  )
}
