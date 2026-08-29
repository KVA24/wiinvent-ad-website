import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  /* Standalone is what the Dockerfile copies out. Vercel builds with its own
     adapter and warns about it, so leave it off there. */
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig)
