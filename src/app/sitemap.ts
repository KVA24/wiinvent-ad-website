import type { MetadataRoute } from 'next'
import { FORMATS } from '@/data/formats'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/seo'

const STATIC_PATHS = ['/', '/sdk', '/formats', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...FORMATS.map((format) => ({
      url: `${SITE_URL}/${locale}/formats/${format.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ])
}
