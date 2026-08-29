import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

export function ContactCta() {
  const t = useTranslations()
  return (
    <section className="bg-brand py-20 text-white">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl font-bold">{t('contact_title')}</h2>
          <p className="mt-4 max-w-xl leading-7 text-white/80">{t('contact_description')}</p>
          <Button href="/contact" variant="secondary" className="mt-7">{t('contact_cta')}</Button>
        </Reveal>
        <Reveal className="relative min-h-56">
          <Image src="/contact-illustration.png" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </Reveal>
      </Container>
    </section>
  )
}
