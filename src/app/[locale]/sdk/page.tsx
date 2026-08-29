import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'
import { SdkHero } from '@/components/sections/sdk-hero'
import { SdkIllustration } from '@/components/sections/sdk-illustration'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return buildMetadata({ locale, path: '/sdk', title: t('sdk_title'), description: t('sdk_description') })
}

export default function SdkPage() {
  return <><SdkHero /><SdkIllustration /></>
}
