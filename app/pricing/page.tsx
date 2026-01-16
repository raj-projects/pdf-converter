"use client"

import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for occasional use",
    features: [
      "Up to 50 MB file size",
      "Basic tools (merge, split, compress)",
      "7-day file retention",
      "Limited to 10 files/day",
      "Community support",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For regular users",
    features: [
      "Up to 2 GB file size",
      "All tools included",
      "30-day file retention",
      "Unlimited files/day",
      "Email support",
      "No watermarks",
      "Batch processing",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    featured: true,
  },
  {
    name: "Business",
    price: "$29.99",
    period: "/month",
    description: "For teams and businesses",
    features: [
      "Unlimited file size",
      "All tools + custom scripts",
      "90-day file retention",
      "Unlimited everything",
      "Priority support",
      "API access",
      "Team collaboration",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@pdflab.io",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core PDF tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 transition-all ${
                plan.featured
                  ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-4 ring-offset-background"
                  : "border-border bg-card"
              }`}
            >
              {/* Badge */}
              {plan.featured && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted text-sm mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted text-sm">{plan.period}</span>}
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full rounded-lg px-6 py-3 font-semibold text-center mb-8 transition-colors ${
                  plan.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                    : "border border-border text-foreground hover:bg-border"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="flex-shrink-0 text-accent mt-0.5" size={20} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted text-sm">
                We offer a 30-day money-back guarantee for all plans. No questions asked.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted text-sm">
                We accept all major credit cards, PayPal, and bank transfers for business plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted text-sm">
                Pro and Business plans include a 14-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
