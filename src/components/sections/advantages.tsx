import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { DriftLoop } from '@/components/figma-motion'
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
    <section className="relative isolate overflow-hidden bg-white py-10 xl:py-[42px]">
      {/* Prototype 2655:7054 and 2655:7094 — hexagon lattices drifting on a
          3.684s linear loop. Both patterns are the same lattice: Figma draws
          the right-hand one at 716x660 against the left's 635x546, so the same
          export is reused scaled by that ratio (1.128 x 1.209). */}
      <DriftLoop
        className="pointer-events-none absolute -left-40 top-0 -z-10 hidden xl:block"
        keyframes={{ y: [0, 114.051, 61.344, 0.005] }}
        times={[0, 0.6843, 0.9999, 1]}
        duration={3.684}
      >
        <Image src="/hexagon-left.png" alt="" width={346} height={546} aria-hidden />
      </DriftLoop>
      <DriftLoop
        className="pointer-events-none absolute -right-32 top-11 -z-10 hidden xl:block"
        keyframes={{ x: [0, -250, -126.358, 0.003] }}
        times={[0, 0.6405, 0.9999, 1]}
        duration={3.684}
      >
        <Image src="/hexagon-left.png" alt="" width={390} height={660} aria-hidden />
      </DriftLoop>
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
            {/* Both pieces are placed by the percentage insets Figma reports on
                node 2531:8241, so they overlap exactly as drawn. */}
            <div className="relative aspect-square w-full max-w-[389px]">
              <div className="absolute inset-[7.18%_27.13%_18.98%_-1.24%]">
                <Image src="/advantages-gear.png" alt="" fill sizes="389px" className="object-contain" />
              </div>
              <div className="absolute inset-[23.47%_-0.73%_-2.88%_38.32%]">
                <Image src="/advantages-rocket.png" alt="" fill sizes="389px" className="object-contain" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
