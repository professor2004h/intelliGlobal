# Multi-stage Docker build for Next.js Event Website v2
FROM node:20-alpine AS base

# Force rebuild timestamp
RUN echo "Build timestamp: $(date)" > /build-info.txt

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY nextjs-frontend/package.json nextjs-frontend/package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY nextjs-frontend/ ./

# Set build environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Sanity environment variables (required at build time)
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=99kpz7t0
ENV NEXT_PUBLIC_SANITY_DATASET=production
ENV NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# PayPal environment variables (required at build time for client-side) - Test Credentials
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=AU0SNxErLtvJ4QOpiAmqkhSCt4pTo11oFWDIklLoyPeAygFhKizEDY_CymzfZk0DyaH7fcsGH5uYmu03

# Build the application
RUN npm run build

# Verify standalone build was created
RUN ls -la .next/ && ls -la .next/standalone/

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Sanity environment variables
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=99kpz7t0
ENV NEXT_PUBLIC_SANITY_DATASET=production
ENV NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
ENV SANITY_API_TOKEN=sk9AT29IvzRfmgY689QmLwq0DjIvPznQlIyXqLgsS3x1heb7HMZnYQvVzdvsOKaW96yBW6At143GLei8Ss9eXEe2DdxrS4Gop6KAP3tbTbGYXC8m2mq3D9UHRloFdDQbvEmF2ZKqkE9wd3NbD1q5an7vIqLzCpY80BkM0LfAYZBVLZg86cES

# PayPal environment variables - Test Credentials
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=AU0SNxErLtvJ4QOpiAmqkhSCt4pTo11oFWDIklLoyPeAygFhKizEDY_CymzfZk0DyaH7fcsGH5uYmu03
ENV PAYPAL_CLIENT_SECRET=EEkou7VpyhjgY8JY_MaMLGN15buiU_DhtIaBGIuBF5YkMQabQg2xBRXewfE6jv8H-1Dqd72hFrdilGXy

# SMTP Configuration
ENV SMTP_HOST=smtp.titan.email
ENV SMTP_USER=contactus@intelliglobalconferences.com
ENV SMTP_PASS=October@2025
ENV SMTP_PORT=587
ENV SMTP_SECURE=false
ENV EMAIL_FROM=contactus@intelliglobalconferences.com
ENV EMAIL_FROM_NAME="Intelli Global Conferences"

# Create user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Create .next directory with proper permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy and setup startup script
COPY --chown=nextjs:nodejs start.sh ./
RUN chmod +x start.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["./start.sh"]
