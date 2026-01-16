"use client"

import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About PDFLab</h1>
          <p className="text-lg text-muted">We believe PDF tools should be simple, fast, and accessible to everyone.</p>
        </div>

        {/* Mission */}
        <section className="mb-12 space-y-6">
          <h2 className="font-display text-2xl font-bold">Our Mission</h2>
          <p className="text-muted leading-relaxed">
            PDFLab was created to solve a simple problem: processing PDFs shouldn't require complicated software,
            expensive licenses, or technical expertise. We built a web-based platform that makes PDF manipulation as
            simple as uploading a file and clicking a button.
          </p>
        </section>

        {/* Features */}
        <section className="mb-12 space-y-6">
          <h2 className="font-display text-2xl font-bold">Why Choose PDFLab?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted text-sm">Optimized infrastructure processes files in seconds, not minutes.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted text-sm">
                Bank-level encryption. Your files are never stored permanently and deleted automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">No Installation</h3>
              <p className="text-muted text-sm">Works in any browser. No software to download or install.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Affordable</h3>
              <p className="text-muted text-sm">Free tier available. Pro plan at $9.99/month with unlimited files.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-12 border-t border-border">
          <h2 className="font-display text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted mb-6">Have questions? We'd love to hear from you.</p>
          <Link
            href="mailto:support@pdflab.io"
            className="inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  )
}
