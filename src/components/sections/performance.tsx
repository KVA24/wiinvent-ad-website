import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'
import { StatCard } from '@/components/stat-card'

export function Performance() {
  const t = useTranslations()
  return (
    <section className="relative overflow-hidden bg-brand-light py-20">
      <Image src="/stats-bg.png" alt="" fill sizes="100vw" className="object-cover opacity-40" />
      <Container className="relative">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-ink">{t('performance_title')}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[t('stat_impressions'), t('stat_advertisers'), t('stat_reach')].map((text) => (
            <Reveal key={text} className="bg-white p-8 text-center shadow-sm"><StatCard text={text} /></Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
