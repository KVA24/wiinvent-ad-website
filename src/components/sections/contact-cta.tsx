import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

/* Figma 2444:4472 — sits inside the same white section as the client logos. */
export function ContactCta() {
  const t = useTranslations()
  return (
    <section className="bg-white pb-10 pt-8 xl:pb-[42px]">
      <Container>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <Reveal className="flex w-full min-w-0 flex-col items-start justify-center gap-4 lg:flex-1">
            <h2 className="type-h3 text-ink">{t('contact_title')}</h2>
            <p className="type-b1 text-grey-700">{t('contact_description')}</p>
            <Button href="/contact" size="sm">{t('contact_cta')}</Button>
          </Reveal>
          <Image
            src="/contact-illustration.png"
            alt=""
            width={316}
            height={287}
            className="h-auto w-full max-w-[316px] object-contain lg:shrink-0"
          />
        </div>
      </Container>
    </section>
  )
}
