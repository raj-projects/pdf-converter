"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import ToolCard from "@/components/tool-card"
import { TOOLS } from "@/lib/constants"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(TOOLS.map((t) => t.category)))

  const categoryDescriptions: Record<string, string> = {
    merge: "Combine and merge PDFs",
    edit: "Edit, rotate, crop and manipulate PDFs",
    compress: "Reduce file size and optimize PDFs",
    conversion: "Convert between PDF and other formats",
    extract: "Extract content from PDFs",
    security: "Protect and secure PDFs",
    organize: "Organize and manage PDF content",
    enhance: "Add watermarks and enhance PDFs",
  }

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">All Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Browse our complete collection of professional PDF utilities. All tools are free to use with no limits.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tools by name or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Category Filter with descriptions */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                <Filter size={16} />
                All Tools ({TOOLS.length})
              </button>
              {categories.map((category) => {
                const count = TOOLS.filter((t) => t.category === category).length
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm capitalize ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-card/80"
                    }`}
                    title={categoryDescriptions[category]}
                  >
                    {category} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="mb-4 text-5xl">🔍</div>
              <p className="text-muted-foreground text-lg font-medium">No tools found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
                className="mt-4 text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Clear filters and show all {TOOLS.length} tools
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
