// Local file system storage adapter

import { promises as fs } from "fs"
import { join } from "path"
import { randomBytes } from "crypto"

const uploadDir = join(process.cwd(), ".uploads")

// Ensure upload directory exists
async function ensureDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true })
  } catch (err) {
    console.error("Failed to create upload directory:", err)
  }
}

export default {
  async save(buffer: Buffer, filename: string): Promise<string> {
    await ensureDir()

    const fileId = randomBytes(8).toString("hex")
    const ext = filename.split(".").pop() || "pdf"
    const savedPath = join(uploadDir, `${fileId}.${ext}`)

    await fs.writeFile(savedPath, buffer)
    return fileId
  },

  async get(fileId: string, ext = "pdf"): Promise<Buffer> {
    const filepath = join(uploadDir, `${fileId}.${ext}`)
    return await fs.readFile(filepath)
  },

  async delete(fileId: string, ext = "pdf"): Promise<void> {
    const filepath = join(uploadDir, `${fileId}.${ext}`)
    try {
      await fs.unlink(filepath)
    } catch (err) {
      console.error("Failed to delete file:", err)
    }
  },

  async cleanup(ageHours = 24): Promise<void> {
    await ensureDir()
    const now = Date.now()
    const files = await fs.readdir(uploadDir)

    for (const file of files) {
      const filepath = join(uploadDir, file)
      const stats = await fs.stat(filepath)
      const ageInHours = (now - stats.mtime.getTime()) / (1000 * 60 * 60)

      if (ageInHours > ageHours) {
        await fs.unlink(filepath)
      }
    }
  },
}
