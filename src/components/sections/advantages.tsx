import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Accordion } from '@/components/accordion'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

/* Figma 2443:4340 "Section 4" — accordion panel on a blue gradient beside
   the gear-and-rocket artwork. */
export function Advantages() {
  const t = useTranslations()
  const items = Array.from({ length: 6 }, (_, index) => {
    const id = String(index + 1).padStart(2, '0')
    return { id, title: t(`advantage_${id}`), body: t(`accordion_${id}`) }
  })

  return (
    <section className="bg-white py-10 xl:py-[42px]">
      <Container className="flex flex-col items-center gap-8">
        <h2 className="type-h3 text-center text-accent">{t('advantages_title')}</h2>
        <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:gap-[42px]">
          <Reveal className="w-full flex-1">
            <div
              className="rounded-xl border-2 border-[rgba(138,206,255,0.3)] p-8 backdrop-blur-[5.95px]"
              style={{
                backgroundImage:
                  'linear-gradient(28.45deg, rgba(116, 206, 255, 0.2) 20.78%, rgba(44, 139, 255, 0.2) 56.07%)',
              }}
            >
              <Accordion items={items} />
            </div>
          </Reveal>
          <Reveal className="flex w-full flex-1 items-center justify-center p-6">
            <div className="relative aspect-square w-full max-w-[389px]">
              <Image
                src="/advantages-gear.png"
                alt=""
                fill
                sizes="389px"
                className="object-contain"
                style={{ inset: '7.18% 27.13% 18.98% -1.24%' }}
              />
              <Image
                src="/advantages-rocket.png"
                alt=""
                fill
                sizes="389px"
                className="object-contain"
                style={{ inset: '23.47% -0.73% -2.88% 38.32%' }}
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
