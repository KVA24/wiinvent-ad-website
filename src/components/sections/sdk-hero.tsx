import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

export function SdkHero() {
  const t = useTranslations()

  return (
    <section className="overflow-hidden bg-brand-dark text-white">
      <Container className="grid min-h-[620px] items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">{t('sdk_title')}</h1>
          <Reveal>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/75">{t('sdk_description')}</p>
          </Reveal>
          <Reveal>
            <Button href="/contact" className="mt-8">{t('sdk_cta')}</Button>
          </Reveal>
        </div>
        <div className="relative min-h-72 md:min-h-[420px]">
          <Image src="/sdk-hero.png" alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      </Container>
    </section>
  )
}
