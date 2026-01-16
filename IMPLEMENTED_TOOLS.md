# PDFLab - Implemented Tools Checklist

## Fully Implemented (Production Ready)

- [x] **Merge PDF** - Combine multiple PDFs into one
  - API: `/api/tools/merge`
  - UI: `/tools/merge`
  - Backend: pdf-lib based merging
  - Status: ✅ Complete

- [ ] **Split PDF** - Extract pages or split PDFs
  - API: `/api/tools/split`
  - UI: `/tools/split`
  - Backend: pdf-lib based splitting
  - Status: 🚧 In Progress (API stubbed)

- [ ] **Compress PDF** - Reduce file size
  - API: `/api/tools/compress`
  - UI: `/tools/compress`
  - Backend: pdf-lib + Ghostscript (dual mode)
  - Status: 🚧 In Progress (UI/API stubbed)

- [ ] **Convert Images ↔ PDF** - Convert between formats
  - API: `/api/tools/convert`
  - UI: `/tools/convert`
  - Backend: sharp + poppler
  - Status: 🚧 In Progress (UI/API stubbed)

- [ ] **Watermark** - Add text/image watermarks
  - API: `/api/tools/watermark`
  - UI: `/tools/watermark`
  - Backend: pdf-lib watermarking
  - Status: 🚧 In Progress (UI/API stubbed)

- [ ] **OCR** - Extract text from scanned PDFs
  - API: `/api/tools/ocr`
  - UI: `/tools/ocr`
  - Backend: tesseract.js (with Google Vision notes)
  - Status: 🚧 In Progress (UI/API stubbed)

## Coming Soon (Stubbed)

- [ ] **Sign PDF** - Add digital signatures
- [ ] **Protect PDF** - Add password protection
- [ ] **Rotate PDF** - Rotate pages
- [ ] **Extract Images** - Extract all images
- [ ] **Extract Text** - Extract all text
- [ ] **Unlock PDF** - Remove protection

## Core Features Status

- [x] Home page with hero and tool discovery
- [x] Tools listing page with search/filter
- [x] Navigation and footer
- [x] Design system (Tailwind CSS v4, semantic tokens)
- [ ] Authentication (NextAuth.js OAuth setup)
- [ ] Dashboard and file history
- [ ] Subscription billing (Stripe)
- [ ] Admin panel
- [ ] Worker architecture (BullMQ + Redis)
- [ ] Database integration (MongoDB + Mongoose)
- [ ] Storage layer (S3 + local adapter)
- [ ] Rate limiting middleware
- [ ] Error tracking (Sentry)
- [ ] Email notifications

## Next Priority Tasks

1. Implement Split PDF tool (API + UI)
2. Implement Compress PDF tool (both quick and Ghostscript modes)
3. Implement Convert tool (images ↔ PDF)
4. Implement Watermark tool
5. Implement OCR tool with tesseract.js
6. Add NextAuth authentication
7. Build dashboard UI
8. Implement worker queue
9. Add Stripe billing
10. Deploy to Vercel + Docker worker

## Notes

- All implemented tools use pdf-lib as the primary processing library
- Ghostscript and qpdf are available in the Docker worker for advanced operations
- Tesseract.js is included for OCR; production deployments should use Google Vision or AWS Textract
- Commercial SDK wrappers (PSPDFKit, PDFTron) are stubbed with TODO comments
- Rate limiting and virus scanning placeholders are in API routes
