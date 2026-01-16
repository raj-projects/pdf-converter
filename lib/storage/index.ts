// Storage adapter pattern - easily switch between local and S3

import localAdapter from "./local"
import s3Adapter from "./s3"

const storageType = process.env.STORAGE_TYPE || "local"

export const storage = storageType === "s3" ? s3Adapter : localAdapter

export { default as localAdapter } from "./local"
export { default as s3Adapter } from "./s3"
