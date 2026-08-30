import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  /* `next dev` and `next build` share .next by default, so building while the
     dev server is running clobbers the chunks it is serving and every request
     500s with MODULE_NOT_FOUND. The preview script builds into its own
     directory instead; CI, Docker and Vercel leave this unset and keep .next. */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  /* Standalone is what the Dockerfile copies out. Vercel builds with its own
     adapter and warns about it, so leave it off there. */
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig)
