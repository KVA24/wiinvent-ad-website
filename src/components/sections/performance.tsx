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

/* Figma 2445:2684 "Pride" — patterned background behind a glass panel. */
export function Performance() {
  const t = useTranslations()
  return (
    <section className="relative isolate overflow-hidden py-16">
      <Image src="/stats-bg.png" alt="" fill sizes="100vw" className="-z-10 object-cover object-bottom" />
      <Container className="flex flex-col items-center gap-8">
        <Reveal>
          <h2 className="type-h3 text-center text-accent">{t('performance_title')}</h2>
        </Reveal>
        <Reveal className="w-full">
          <div className="flex w-full flex-col items-center justify-center rounded-xl border-[3px] border-white bg-white/20 p-8 backdrop-blur-[5.95px]">
            <div className="flex w-full max-w-[854px] flex-col items-stretch justify-center gap-4 md:flex-row">
              {STATS.map(({ key, image }) => (
                <StatCard key={key} text={t(key)} image={image} />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
