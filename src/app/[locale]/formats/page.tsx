import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { FORMATS, type Device, type FormatType } from '@/data/formats'
import type { Locale } from '@/i18n/routing'
import { DemoShowcase } from '@/components/sections/demo-showcase'
import { FormatGrid } from '@/components/format-grid'
import { buildMetadata, itemListJsonLd, SITE_URL } from '@/lib/seo'

const DEVICES = ['mobile', 'pc', 'smart-tv'] as const
const TYPES = ['banner-standard', 'welcome', 'instream-video'] as const

const isDevice = (value: string): value is Device => DEVICES.includes(value as Device)
const isFormatType = (value: string): value is FormatType => TYPES.includes(value as FormatType)

function values<T extends string>(raw: string | undefined, guard: (value: string) => value is T) {
  return raw?.split(',').map((value) => value.trim()).filter(guard) ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return buildMetadata({ locale, path: '/formats', title: t('formats_title'), description: t('hero_description') })
}

export default async function FormatsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ device?: string; type?: string; q?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale })
  const list = itemListJsonLd(
    FORMATS.map((format) => ({
      name: t(`format.${format.key}.name`),
      url: `${SITE_URL}/${locale}/formats/${format.slug}`,
    })),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list) }} />
      <DemoShowcase format={FORMATS[0]} />
      <FormatGrid
        formats={FORMATS}
        query={{
          devices: values(sp.device, isDevice),
          types: values(sp.type, isFormatType),
          search: sp.q ?? '',
        }}
      />
    </>
  )
}
