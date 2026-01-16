"use client"

import { useState } from "react"
import { Download, Trash2, Calendar } from "lucide-react"
import Link from "next/link"

interface FileRecord {
  id: string
  name: string
  tool: string
  size: number
  createdAt: Date
  expiresAt: Date
}

export default function DashboardPage() {
  // TODO: Fetch from API
  const [files] = useState<FileRecord[]>([
    {
      id: "1",
      name: "merged-document.pdf",
      tool: "Merge PDF",
      size: 2453123,
      createdAt: new Date("2024-11-30"),
      expiresAt: new Date("2024-12-07"),
    },
  ])

  const [stats] = useState({
    totalFiles: 12,
    totalProcessed: 156,
    storageUsed: 450, // MB
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted">Manage your files and account</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-muted text-sm mb-1">Total Files</p>
            <p className="font-display text-3xl font-bold">{stats.totalFiles}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-muted text-sm mb-1">PDFs Processed</p>
            <p className="font-display text-3xl font-bold">{stats.totalProcessed}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-muted text-sm mb-1">Storage Used</p>
            <p className="font-display text-3xl font-bold">{stats.storageUsed} MB</p>
          </div>
        </div>

        {/* Files Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold text-lg mb-6">Recent Files</h2>

          {files.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Filename</th>
                    <th className="text-left py-3 px-4 font-semibold">Tool</th>
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-left py-3 px-4 font-semibold">Expires</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id} className="border-b border-border hover:bg-border/50 transition-colors">
                      <td className="py-4 px-4">{file.name}</td>
                      <td className="py-4 px-4">{file.tool}</td>
                      <td className="py-4 px-4">{formatFileSize(file.size)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-muted">
                          <Calendar size={16} />
                          {formatDate(file.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted">{formatDate(file.expiresAt)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded hover:bg-border transition-colors">
                            <Download size={18} />
                          </button>
                          <button className="p-2 rounded hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted mb-4">No files yet. Start by using a tool!</p>
              <Link
                href="/tools"
                className="inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
              >
                Browse Tools
              </Link>
            </div>
          )}
        </div>

        {/* Settings Link */}
        <div className="mt-8 flex justify-center">
          <Link href="/settings" className="text-primary hover:text-primary-dark font-semibold">
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
