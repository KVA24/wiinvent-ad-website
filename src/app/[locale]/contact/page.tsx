import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'
import { Container } from '@/components/container'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'

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
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="relative mx-auto w-full max-w-[1600px]">
          <Image
            src="/contact-banner.png"
            alt=""
            width={1600}
            height={420}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{t('contact_hero_title')}</h1>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 text-center">
        <Container>
          <p className="text-2xl font-bold text-ink">{t('company_name')}</p>
        </Container>
      </section>

      <section className="bg-[#EAF4FF] py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <Reveal className="order-1 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-ink">{t('form_title')}</h2>
            <ContactForm />
          </Reveal>
          <Reveal className="order-2 flex items-center justify-center">
            <Image
              src="/contact-illustration.png"
              alt=""
              width={720}
              height={640}
              className="h-auto w-full max-w-[640px]"
            />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
