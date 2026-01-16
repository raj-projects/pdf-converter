"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Zap } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl support-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-xl font-bold transition-colors duration-200"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap size={18} className="text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PDFLab</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/tools"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Tools
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-card"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 shadow-md"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-card rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-border bg-card/50 md:hidden animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1 px-4 py-6">
              <Link
                href="/tools"
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors duration-200"
              >
                Tools
              </Link>
              <Link
                href="/pricing"
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors duration-200"
              >
                About
              </Link>
              <div className="flex flex-col gap-2 border-t border-border mt-4 pt-4">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-center text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 rounded-lg transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
