import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'
import { StatCard } from '@/components/stat-card'

const STATS = [
  { key: 'stat_impressions', image: '/stat-1.png' },
  { key: 'stat_advertisers', image: '/stat-2.png' },
  { key: 'stat_reach', image: '/stat-3.png' },
] as const

/* Figma 2445:2684 "Pride" — patterned background behind a glass panel.
   On the phone frame (2865:15321 plus the Pride set 2995:9109) the three
   cards become an edge-to-edge marquee drifting left, so below md the row
   is doubled and scrolled by the stats-marquee keyframes; the prototype
   moves one 648px group per 5s, which at 274px cards works out to ~6.7s
   per set. Reduced motion collapses it to a static row via the global
   animation override. */
export function Performance() {
  const t = useTranslations()
  return (
    <section className="relative isolate overflow-hidden py-16">
      <Image src="/stats-bg.png" alt="" fill sizes="100vw" className="-z-10 object-cover object-bottom" />
      <Container className="flex flex-col items-center gap-8">
        <Reveal>
          <h2 className="type-h3 text-center text-accent">{t('performance_title')}</h2>
        </Reveal>

        {/* Desktop and tablet: static three-up row inside the glass panel. */}
        <Reveal className="hidden w-full md:block">
          <div className="flex w-full flex-col items-center justify-center rounded-xl border-[3px] border-white bg-white/20 p-8 backdrop-blur-[5.95px]">
            <div className="flex w-full max-w-[854px] items-stretch justify-center gap-4">
              {STATS.map(({ key, image }) => (
                <StatCard key={key} text={t(key)} image={image} />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Mobile: full-bleed marquee. Two copies of the set make the loop seamless. */}
      <div className="w-full overflow-hidden md:hidden" aria-hidden={false}>
        <div className="flex w-max animate-[stats-marquee_6.7s_linear_infinite]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1}>
              {STATS.map(({ key, image }) => (
                <li key={key} className="w-[274px] shrink-0 list-none">
                  <StatCard text={t(key)} image={image} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
