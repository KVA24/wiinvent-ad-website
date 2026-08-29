import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'

/* Figma 3043:8408 — same dark hero treatment as the home page, one CTA. */
export function SdkHero() {
  const t = useTranslations()
  return (
    <section className="relative isolate overflow-hidden py-10 xl:py-[42px]">
      <Image src="/sdk-hero-bg.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <Image
        src="/sdk-hero-pattern.png"
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
                {t('sdk_title')}
              </h1>
              <p className="type-h5 text-light-grey">{t('sdk_description')}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/contact" variant="secondary">{t('sdk_cta')}</Button>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <Image
              src="/sdk-object.png"
              alt=""
              width={271}
              height={281}
              priority
              className="h-auto w-full max-w-[271px] object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
