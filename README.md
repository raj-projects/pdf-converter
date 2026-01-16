# PDFLab - Professional PDF Tools

A modern, fast, and secure web application for PDF processing. Built with Next.js, TypeScript, and React.

## Features

- **Merge PDF** - Combine multiple PDFs into one
- **Split PDF** - Extract specific pages or split PDFs
- **Compress PDF** - Reduce file size while maintaining quality
- **Convert** - Convert images to PDF and extract images from PDFs
- **Watermark** - Add text/image watermarks
- **OCR** - Extract text from scanned PDFs
- Plus: Sign, Protect/Unprotect, Rotate, Extract Text/Images (coming soon)

## Stack

- **Frontend**: Next.js 16+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI
- **PDF Processing**: pdf-lib, Ghostscript, qpdf
- **Image Processing**: sharp
- **OCR**: tesseract.js (with notes for Google Vision/AWS Textract)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (OAuth + email/password)
- **Job Queue**: BullMQ + Redis
- **Storage**: AWS S3 (with local fallback)
- **Payments**: Stripe
- **Container**: Docker + docker-compose

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for local dev with workers)

### Local Development

1. **Clone and install**
   \`\`\`bash
   git clone https://github.com/yourusername/pdflab.git
   cd pdflab
   npm install
   \`\`\`

2. **Setup environment**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your values
   \`\`\`

3. **Run locally**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000)

4. **Docker Compose (with Redis + Mongo + Worker)**
   \`\`\`bash
   docker-compose up -d
   npm run dev
   \`\`\`

## Environment Variables

See `.env.example` for the complete list. Key variables:

- `NEXTAUTH_SECRET` - Random secret for auth sessions
- `MONGO_URI` - MongoDB connection string
- `REDIS_URL` - Redis URL for job queue
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - For S3 storage
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - For OAuth
- `STRIPE_SECRET_KEY` - For billing

## Deployment

### Frontend (Vercel)

\`\`\`bash
vercel deploy
\`\`\`

### Worker (Docker on AWS ECS / DigitalOcean)

1. **Build Docker image**
   \`\`\`bash
   docker build -f docker/Dockerfile -t pdflab-worker:latest .
   \`\`\`

2. **Push to registry**
   \`\`\`bash
   docker tag pdflab-worker:latest your-registry/pdflab-worker:latest
   docker push your-registry/pdflab-worker:latest
   \`\`\`

3. **Deploy to ECS / App Platform**
   - Use docker-compose as reference
   - Ensure Ghostscript and qpdf are installed

## Architecture

### Frontend
- Next.js app with SSR and client components
- Real-time progress updates (polling / SSE stub)
- Responsive design, WCAG AA compliant

### Backend APIs
- `/api/tools/*` - Tool processing endpoints
- `/api/auth/*` - NextAuth routes
- `/api/jobs/*` - Job status and history

### Workers
- Separate Node.js process (BullMQ)
- Consumes jobs from Redis queue
- Executes CPU-intensive tasks (pdf-lib, Ghostscript, OCR)

### Storage
- Local file system (dev) or AWS S3 (prod)
- Storage adapter pattern for easy switching
- Presigned URLs for direct S3 downloads
- Auto-delete files after expiry (7 days)

## Project Structure

\`\`\`
pdflab/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── api/
│   │   └── tools/
│   │       ├── merge/route.ts
│   │       ├── split/route.ts
│   │       ├── compress/route.ts
│   │       ├── convert/route.ts
│   │       ├── watermark/route.ts
│   │       └── ocr/route.ts
│   └── tools/
│       ├── page.tsx            # Tools listing
│       ├── merge/page.tsx
│       ├── split/page.tsx
│       ├── compress/page.tsx
│       ├── convert/page.tsx
│       ├── watermark/page.tsx
│       └── ocr/page.tsx
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── tool-card.tsx
│   ├── upload-zone.tsx
│   ├── progress-bar.tsx
│   └── tools/
│       ├── merge-tool.tsx
│       ├── split-tool.tsx
│       ├── compress-tool.tsx
│       ├── convert-tool.tsx
│       ├── watermark-tool.tsx
│       └── ocr-tool.tsx
├── lib/
│   ├── pdf/
│   │   ├── merge.ts
│   │   ├── split.ts
│   │   ├── compress.ts
│   │   ├── convert.ts
│   │   ├── watermark.ts
│   │   └── ocr.ts
│   ├── storage/
│   │   ├── local.ts
│   │   ├── s3.ts
│   │   └── index.ts
│   ├── db/
│   │   ├── models.ts
│   │   └── connection.ts
│   ├── auth/
│   │   └── [...nextauth].ts
│   └── constants.ts
├── workers/
│   ├── worker.ts               # BullMQ worker
│   ├── queue.ts                # Job queue setup
│   └── tasks/                  # Task implementations
├── docker/
│   ├── Dockerfile              # Worker image
│   └── docker-compose.yml      # Local dev stack
├── scripts/
│   ├── dev.js
│   ├── start.js
│   └── seed.js
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
\`\`\`

## Adding New Tools

Each tool follows this pattern:

1. **Create API route** (`app/api/tools/[name]/route.ts`)
   - Validate input
   - Call lib function
   - Stream response

2. **Create lib helper** (`lib/pdf/[name].ts`)
   - Core processing logic
   - Reusable, testable

3. **Create UI component** (`components/tools/[name]-tool.tsx`)
   - Drag-drop upload
   - Options panel
   - Progress & download

4. **Add to constants** (`lib/constants.ts`)
   - Tool metadata
   - Icon, description, category

5. **Create page** (`app/tools/[name]/page.tsx`)
   - Metadata
   - Component import

## Security

- **HTTPS only** in production
- **File validation** - Check magic bytes, not just extension
- **Size limits** - Configurable per tier
- **Virus scanning** - ClamAV integration (commented in code)
- **Encryption** - AES-256 for sensitive files
- **Rate limiting** - IP + User-based throttling
- **Secure temp storage** - Files deleted after processing
- **RLS** - Row-level security on Mongo (when added)

## Performance

- **Streaming responses** - Large files streamed to client
- **Job queue** - CPU tasks offloaded to workers
- **S3 presigned URLs** - Direct download from S3, bypass server
- **Client-side validation** - Check before upload
- **Caching** - CDN cache for static assets
- **Lazy loading** - Components and routes

### Scaling

1. **Horizontal scaling** - Run multiple worker instances
2. **Redis cluster** - For queue reliability
3. **Database replication** - Mongo replica set
4. **Load balancer** - Distribute traffic
5. **Monitor & autoscale** - Prometheus + k8s or CloudWatch

## Monitoring & Logging

- **Sentry** - Error tracking (init commented in code)
- **Winston** - Structured logging
- **Prometheus** - Metrics export
- **Grafana** - Dashboards
- **CloudWatch** - AWS logs (optional)

## Testing

\`\`\`bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e
\`\`\`

## Production Hardening Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS only
- [ ] Setup rate limiting
- [ ] Configure S3 CORS and lifecycle
- [ ] Enable S3 versioning and encryption
- [ ] Setup Mongo authentication and IP whitelist
- [ ] Configure Redis password
- [ ] Enable Sentry error tracking
- [ ] Setup email notifications for errors
- [ ] Configure backup strategy
- [ ] Enable audit logging
- [ ] Setup monitoring and alerting
- [ ] Test disaster recovery
- [ ] Load test with k6 or JMeter
- [ ] Security audit by 3rd party
- [ ] GDPR compliance review

## FAQ

**Q: What's the file size limit?**
A: Free tier: 50 MB, Pro: 2 GB. Configurable in `.env`

**Q: How long are files retained?**
A: Guest uploads: 7 days, Authenticated: 30 days (configurable)

**Q: Can I use my own storage backend?**
A: Yes, the storage adapter pattern allows easy integration with Azure Blob, GCS, etc.

**Q: How do I swap tesseract.js for Google Vision?**
A: See `lib/pdf/ocr.ts` - function exported for easy replacement. Set `GOOGLE_VISION_API_KEY` in .env

**Q: What about commercial SDKs?**
A: PSPDFKit and PDFTron wrappers are stubbed in `lib/pdf/` with TODO comments.

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

- Documentation: [docs.pdflab.io](https://docs.pdflab.io)
- Email: support@pdflab.io
- Twitter: [@pdflab](https://twitter.com/pdflab)
- Issues: [GitHub Issues](https://github.com/yourusername/pdflab/issues)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- PDF processing with [pdf-lib](https://pdfkit.org/docs/getting_started/installation) and Ghostscript
- Authentication with [NextAuth.js](https://next-auth.js.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
