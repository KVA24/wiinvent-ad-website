import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/sections/hero'
import { PlatformCoverage } from '@/components/sections/platform-coverage'
import { Performance } from '@/components/sections/performance'
import { Advantages } from '@/components/sections/advantages'
import { Clients } from '@/components/sections/clients'
import { ContactCta } from '@/components/sections/contact-cta'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return buildMetadata({ locale, path: '/', title: t('hero_title'), description: t('hero_description') })
}

export default function HomePage() {
  return <><Hero /><PlatformCoverage /><Performance /><Advantages /><Clients /><ContactCta /></>
}
