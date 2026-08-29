import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'
import { Container } from '@/components/container'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'
import { SlideIn } from '@/components/figma-motion'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return buildMetadata({
    locale,
    path: '/contact',
    title: t('contact_hero_title'),
    description: t('contact_description'),
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <>
      {/* Figma 2448:7963 — 428px banner, title glowing at the bottom edge. */}
      <section className="relative isolate flex h-[428px] w-full flex-col items-center justify-end overflow-hidden">
        <Image src="/contact-banner.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-[rgba(0,3,30,0.95)]" />
        {/* Prototype 2448:7988 — the title rises into place on load. */}
        <SlideIn from={{ y: [49] }} className="w-full">
          <h1
            className="type-h1 mx-auto max-w-[629px] px-6 pb-[42px] text-center text-white"
            style={{ textShadow: '0 0 12px #5ed5fe' }}
          >
            {t('contact_hero_title')}
          </h1>
        </SlideIn>
      </section>

      {/* Figma 2448:7644 */}
      <section className="bg-white py-10 xl:py-[42px]">
        <Container className="flex flex-col items-center gap-8">
          <p className="type-h3 max-w-[780px] text-center text-primary-800">{t('company_name')}</p>

          <div className="flex w-full flex-wrap items-center justify-center gap-6">
            <Reveal className="flex min-w-[320px] flex-1 flex-col items-end gap-8 rounded-2xl bg-primary-50 p-8">
              <h2 className="type-h3 w-full text-center text-primary-400">{t('form_title')}</h2>
              <ContactForm />
            </Reveal>
            {/* Prototype 2448:7789 — the device shot rises further than the title. */}
            <SlideIn className="flex min-w-[320px] flex-1 items-center justify-center px-8 py-4" from={{ y: [117] }}>
              <Image
                src="/contact-devices.png"
                alt=""
                width={1224}
                height={856}
                className="h-auto w-full object-contain"
              />
            </SlideIn>
          </div>
        </Container>
      </section>
    </>
  )
}
