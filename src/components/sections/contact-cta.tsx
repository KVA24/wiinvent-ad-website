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
        <div className="flex flex-wrap items-center gap-8">
          <Reveal className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4">
            <h2 className="type-h3 text-ink">{t('contact_title')}</h2>
            <p className="type-b1 text-grey-700">{t('contact_description')}</p>
            <Button href="/contact" size="sm">{t('contact_cta')}</Button>
          </Reveal>
          <Image
            src="/contact-illustration.png"
            alt=""
            width={316}
            height={287}
            className="h-auto w-full max-w-[316px] shrink-0 object-contain"
          />
        </div>
      </Container>
    </section>
  )
}
