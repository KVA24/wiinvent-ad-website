import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { FORMATS, getFormat, type Device } from '@/data/formats'
import { routing, type Locale } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { buildMetadata, breadcrumbJsonLd, SITE_URL } from '@/lib/seo'
import { DeviceTabs } from '@/components/device-tabs'
import { FormatMedia } from '@/components/format-media'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => FORMATS.map((format) => ({ locale, slug: format.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale })
  const format = getFormat(slug)
  if (!format) notFound()
  return buildMetadata({
    locale,
    path: `/formats/${slug}`,
    title: t(`format.${format.key}.name`),
    description: t('hero_description'),
  })
}

export default async function FormatDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams: Promise<{ device?: string }>
}) {
  const { locale, slug } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale })
  const format = getFormat(slug)
  if (!format) notFound()

  const name = t(`format.${format.key}.name`)
  const device =
    sp.device && format.devices.includes(sp.device as Device) ? (sp.device as Device) : format.devices[0]
  const typeKey = `type_${format.type.replace(/-/g, '_')}` as const
  const breadcrumbs = breadcrumbJsonLd([
    { name: t('hero_title'), url: `${SITE_URL}/${locale}` },
    { name: t('nav_demo'), url: `${SITE_URL}/${locale}/formats` },
    { name, url: `${SITE_URL}/${locale}/formats/${slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <Link href="/formats" className="text-sm font-semibold text-brand">
              {t('back_link')}
            </Link>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-ink md:text-5xl">{name}</h1>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                {t(typeKey)}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink">{t('available_on')}</p>
              <DeviceTabs format={format} />
            </div>
          </div>
          <FormatMedia format={format} device={device} layoutId={`format-${slug}`} name={name} />
        </div>
      </section>
    </>
  )
}
