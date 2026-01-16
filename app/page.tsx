"use client"

import Link from "next/link"
import { ArrowRight, FileText, Zap, Lock, Rocket } from "lucide-react"
import ToolCard from "@/components/tool-card"
import { TOOLS } from "@/lib/constants"

export default function Home() {
  const featuredTools = TOOLS.slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Fast • Secure • Simple</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-balance leading-tight mb-6">
              Professional PDF Tools
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                Made Simple
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-10 leading-relaxed">
              Merge, split, compress, convert, and process PDFs with ease. No installation, no subscriptions—just
              powerful tools that work instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/tools"
                className="rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                Start Using Tools
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="rounded-lg border-2 border-primary/30 px-8 py-4 font-semibold text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border/50">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <p className="text-muted-foreground text-sm">Files Processed Daily</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">50+</div>
                <p className="text-muted-foreground text-sm">Countries Served</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-muted-foreground text-sm">Uptime Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section id="features" className="py-20 md:py-28 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Why Choose PDFLab?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for speed, security, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl border border-border hover:border-primary/50 bg-card/50 hover:bg-card transition-all duration-300">
              <div className="mb-4 p-3 w-fit rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Process files instantly with our optimized algorithms. No waiting, no delays.
              </p>
            </div>

            <div className="group p-8 rounded-xl border border-border hover:border-primary/50 bg-card/50 hover:bg-card transition-all duration-300">
              <div className="mb-4 p-3 w-fit rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Bank-Level Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your files are encrypted and never stored permanently on our servers.
              </p>
            </div>

            <div className="group p-8 rounded-xl border border-border hover:border-primary/50 bg-card/50 hover:bg-card transition-all duration-300">
              <div className="mb-4 p-3 w-fit rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Unlimited Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Process as many files as you need, whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section id="tools" className="py-20 md:py-28 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Featured Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with our most popular PDF utilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-primary font-semibold hover:text-primary/80 transition-colors group"
            >
              View All Tools
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to transform your PDFs?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who trust PDFLab. No credit card required. Start for free.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/20 group"
          >
            <Rocket size={20} />
            Get Started Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
