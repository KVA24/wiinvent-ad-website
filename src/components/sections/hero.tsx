import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'

export function Hero() {
  const t = useTranslations()
  return (
    <section className="overflow-hidden bg-white">
      <Container className="grid min-h-[620px] items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">{t('hero_description')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/formats" className="motion-safe:animate-[hero-in_600ms_var(--ease-standard)_100ms_both]">{t('cta_formats')}</Button>
            <Button href="/contact" variant="secondary" className="motion-safe:animate-[hero-in_600ms_var(--ease-standard)_200ms_both]">{t('cta_consultation')}</Button>
          </div>
        </div>
        <div className="relative min-h-72 md:min-h-[420px]">
          <Image src="/hero-devices.png" alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      </Container>
    </section>
  )
}
