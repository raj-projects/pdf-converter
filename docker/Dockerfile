# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install Ghostscript and qpdf
RUN apk add --no-cache ghostscript qpdf

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy app files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV GS_BIN_PATH=/usr/bin/gs
ENV QPDF_BIN_PATH=/usr/bin/qpdf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start worker
CMD ["node", "workers/worker.ts"]
