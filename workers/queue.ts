// BullMQ job queue setup

import Bull from "bull"

// TODO: Connect to Redis

const pdfQueue = new Bull("pdf-jobs", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  },
})

export const jobTypes = {
  MERGE: "merge",
  SPLIT: "split",
  COMPRESS: "compress",
  CONVERT: "convert",
  WATERMARK: "watermark",
  OCR: "ocr",
}

export async function enqueueJob(type: string, data: Record<string, any>, options?: any) {
  return await pdfQueue.add(type, data, {
    ...options,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  })
}

export function getPdfQueue() {
  return pdfQueue
}

export default pdfQueue
