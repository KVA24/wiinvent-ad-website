import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'

/* Figma 2903:5464 — dark hero: full-bleed photo under a 40% black scrim,
   decorative tech pattern bleeding off the right edge. */
export function Hero() {
  const t = useTranslations()
  return (
    <section className="relative isolate overflow-hidden py-10 xl:py-[42px]">
      <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <Image
        src="/hero-pattern.png"
        alt=""
        width={723}
        height={522}
        aria-hidden
        className="pointer-events-none absolute -right-44 top-0 -z-10 hidden w-[723px] max-w-none xl:block"
      />
      <Container>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="type-h1 text-[32px] leading-[40px] text-info md:text-[48px] md:leading-[58px]">
                {t('hero_title')}
              </h1>
              <p className="type-h5 text-light-grey">{t('hero_description')}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/formats" className="motion-safe:animate-[hero-in_600ms_var(--ease-standard)_100ms_both]">
                {t('cta_formats')}
              </Button>
              <Button href="/contact" variant="secondary" className="motion-safe:animate-[hero-in_600ms_var(--ease-standard)_200ms_both]">
                {t('cta_consultation')}
              </Button>
            </div>
          </div>
          <Image
            src="/hero-devices.png"
            alt=""
            width={620}
            height={428}
            priority
            className="h-auto w-full max-w-[620px] shrink-0 object-contain"
          />
        </div>
      </Container>
    </section>
  )
}
