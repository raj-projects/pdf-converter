// AWS S3 storage adapter

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomBytes } from "crypto"

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const bucket = process.env.S3_BUCKET || "pdflab-uploads"

export default {
  async save(buffer: Buffer, filename: string): Promise<string> {
    const fileId = randomBytes(8).toString("hex")
    const ext = filename.split(".").pop() || "pdf"
    const key = `uploads/${fileId}.${ext}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: filename.includes(".pdf") ? "application/pdf" : "application/octet-stream",
        Expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }),
    )

    return fileId
  },

  async get(fileId: string, ext = "pdf"): Promise<Buffer> {
    const key = `uploads/${fileId}.${ext}`
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )

    const chunks: Buffer[] = []
    if (response.Body) {
      for await (const chunk of response.Body as any) {
        chunks.push(chunk)
      }
    }
    return Buffer.concat(chunks)
  },

  async delete(fileId: string, ext = "pdf"): Promise<void> {
    const key = `uploads/${fileId}.${ext}`
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
  },

  async getSignedUrl(fileId: string, ext = "pdf", expiresIn = 3600): Promise<string> {
    const key = `uploads/${fileId}.${ext}`
    return await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucket, Key: key }), {
      expiresIn,
    })
  },

  async cleanup(ageHours = 24): Promise<void> {
    // S3 lifecycle rules handle cleanup automatically
    console.log("S3 lifecycle policies handle cleanup")
  },
}
