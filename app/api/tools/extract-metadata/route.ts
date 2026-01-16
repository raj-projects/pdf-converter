import { type NextRequest, NextResponse } from "next/server"
import { extractMetadata } from "@/lib/pdf/extract"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const metadata = await extractMetadata(buffer)

    return NextResponse.json(metadata)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Extraction failed" }, { status: 500 })
  }
}
