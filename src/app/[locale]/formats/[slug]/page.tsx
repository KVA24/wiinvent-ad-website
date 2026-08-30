import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { FORMATS, getFormat, type Device, type FormatType } from '@/data/formats'
import { Link, routing, type Locale } from '@/i18n/routing'
import { buildMetadata, breadcrumbJsonLd, SITE_URL } from '@/lib/seo'
import { Container } from '@/components/container'
import { DeviceTabs } from '@/components/device-tabs'
import { FormatGrid } from '@/components/format-grid'
import { FormatMedia } from '@/components/format-media'

const DEVICES = ['mobile', 'pc', 'smart-tv'] as const
const TYPES = ['banner-standard', 'welcome', 'instream-video'] as const

const isDevice = (value: string): value is Device => DEVICES.includes(value as Device)
const isFormatType = (value: string): value is FormatType => TYPES.includes(value as FormatType)

function values<T extends string>(raw: string | undefined, guard: (value: string) => value is T) {
  return raw?.split(',').map((value) => value.trim()).filter(guard) ?? []
}

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
  const name = t(`format.${format.key}.name`)
  const typeLabel = t(`type_${format.type.replace(/-/g, '_')}` as 'type_banner_standard')
  const devices = format.devices
    .map((device) => t(`device_${device.replace('-', '_')}` as 'device_mobile'))
    .join(', ')
  /* Composed from the format's own facts so all nine pages describe
     themselves instead of repeating the home page. */
  const description = `${name} — ${typeLabel}. ${t('available_on')} ${devices}. ${t('hero_description')}`
  return buildMetadata({
    locale,
    path: `/formats/${slug}`,
    title: name,
    description,
  })
}

export default async function FormatDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams: Promise<{ preview?: string; device?: string; type?: string; q?: string }>
}) {
  const { locale, slug } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale })
  const format = getFormat(slug)
  if (!format) notFound()

  const name = t(`format.${format.key}.name`)
  const device =
    sp.preview && isDevice(sp.preview) && format.devices.includes(sp.preview) ? sp.preview : format.devices[0]
  const breadcrumbs = breadcrumbJsonLd([
    { name: t('hero_title'), url: `${SITE_URL}/${locale}` },
    { name: t('nav_demo'), url: `${SITE_URL}/${locale}/formats` },
    { name, url: `${SITE_URL}/${locale}/formats/${slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Figma 2675:13398 — spec card on glass beside the live device preview. */}
      <section className="relative isolate overflow-hidden py-10 xl:py-[42px]">
        <Image src="/detail-hero-bg.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-white" />
        <Container className="flex flex-col items-center gap-8 lg:flex-row">
          <div className="flex w-full min-w-0 items-center lg:flex-1">
            <div
              className="flex h-full max-w-[303px] flex-col items-start justify-center gap-6 rounded-2xl border-[3px] border-white/50 pb-[42px] pl-6 pr-[42px] pt-8 backdrop-blur-[5.95px]"
              style={{
                backgroundImage:
                  'linear-gradient(-75.44deg, rgba(227, 227, 227, 0.5) 15.96%, rgba(255, 255, 255, 0.5) 39.54%)',
              }}
            >
              <Link href="/formats" className="flex h-10 items-center justify-center py-3">
                <Image src="/icon-arrow-left.svg" alt="" width={24} height={24} />
                <span className="px-2 text-[14px] font-semibold leading-4 text-links">{t('back_link')}</span>
              </Link>

              <div className="flex w-full flex-col items-start gap-3">
                <h1 className="type-h5 text-accent">{name}</h1>

                {format.specs && (
                  <div className="flex w-full flex-col items-start gap-2 type-b3 text-black">
                    {format.specs.map((spec) => (
                      <p key={spec}>{spec}</p>
                    ))}
                  </div>
                )}
                {format.tracking && (
                  <>
                    <span className="h-px w-[237px] bg-[#d2d5db]" aria-hidden />
                    <p className="type-b3 text-black">{format.tracking}</p>
                  </>
                )}
              </div>

              <Link
                href="/contact"
                className="flex h-8 items-center justify-center rounded border-[1.5px] border-primary-500 px-3 py-2"
              >
                <span className="px-2 text-[12px] font-semibold leading-4 text-links">{t('contact_cta')}</span>
                <Image src="/icon-arrow-right-blue.svg" alt="" width={24} height={24} />
              </Link>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col items-center justify-center gap-4 lg:flex-1">
            <FormatMedia format={format} device={device} layoutId={`format-${slug}`} name={name} />
            <p className="sr-only">{t('available_on')}</p>
            <DeviceTabs format={format} />
          </div>
        </Container>
      </section>

      <FormatGrid
        formats={FORMATS}
        headingAs="h2"
        query={{
          devices: values(sp.device, isDevice),
          types: values(sp.type, isFormatType),
          search: sp.q ?? '',
        }}
      />
    </>
  )
}
