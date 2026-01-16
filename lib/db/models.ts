// MongoDB/Mongoose models for users, jobs, and file history

// TODO: Implement full Mongoose models once MongoDB is connected

export const Models = {
  User: {
    email: String,
    password: String,
    name: String,
    tier: String, // 'free', 'pro', 'business'
    createdAt: Date,
  },

  Job: {
    userId: String,
    type: String, // 'merge', 'split', 'compress', etc.
    status: String, // 'pending', 'processing', 'completed', 'failed'
    inputFiles: [String],
    outputFile: String,
    progress: Number,
    error: String,
    createdAt: Date,
    completedAt: Date,
  },

  FileHistory: {
    userId: String,
    filename: String,
    fileSize: Number,
    tool: String,
    storageId: String,
    expiresAt: Date,
    createdAt: Date,
  },
}
