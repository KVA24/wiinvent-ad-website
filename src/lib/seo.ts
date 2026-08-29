import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ad.wiinvent.tv'

const url = (locale: Locale, path: string) => {
  const cleanPath = path.split('?')[0]
  return `${SITE_URL}/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = '/og-default.png',
}: {
  locale: Locale
  path: string
  title: string
  description: string
  image?: string
}): Metadata {
  const canonical = url(locale, path)
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        vi: url('vi', path),
        en: url('en', path),
        'x-default': url('vi', path),
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [image],
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export function organizationJsonLd(locale: Locale, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: url(locale, '/'),
    logo: `${SITE_URL}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '96 Hoàng Ngân, Yên Hoà, Cầu Giấy',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function itemListJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
