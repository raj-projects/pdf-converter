"use client"

import Link from "next/link"
import { ArrowRight } from 'lucide-react'
import type { Tool } from "@/lib/constants"

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon

  return (
    <Link href={tool.href}>
      <div className="h-full relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background hover:from-card hover:to-card transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-primary/15 hover:border-primary/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/8 group-hover:to-accent/8 transition-all duration-300" />

        <div className="relative p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 shadow-lg shadow-primary/20">
              <Icon size={24} className="text-primary" />
            </div>
            <ArrowRight
              size={20}
              className="text-muted-foreground group-hover:text-primary transition-all duration-300 translate-x-0 group-hover:translate-x-1"
            />
          </div>

          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
            {tool.name}
          </h3>
          <p className="text-muted-foreground text-sm flex-grow leading-relaxed">{tool.description}</p>

          <div className="mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-medium text-primary">Click to open →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
