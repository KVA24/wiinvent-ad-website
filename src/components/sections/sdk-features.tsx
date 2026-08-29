import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

/* Figma 3055:10204 — four cards on a 40% white glass panel over the cover art. */
const FEATURES = [
  { id: '01', icon: '/icon-settings.svg', size: 43 },
  { id: '02', icon: '/icon-combo-chart.svg', size: 39 },
  { id: '03', icon: '/icon-news.svg', size: 39 },
  { id: '04', icon: '/icon-shield.svg', size: 37 },
] as const

export function SdkFeatures() {
  const t = useTranslations()
  return (
    <section className="relative isolate overflow-hidden py-[60px]">
      <Image src="/sdk-cover.png" alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-start justify-center gap-6 rounded-2xl border-[3px] border-white bg-white/40 p-8">
            {FEATURES.map(({ id, icon, size }) => (
              <div key={id} className="flex w-[266px] flex-col items-start gap-4">
                <div className="flex size-[52px] items-center justify-center rounded-xl border-[0.33px] border-white/50 bg-gradient-to-b from-[rgba(48,176,255,0.1)] to-[rgba(30,45,166,0.7)]">
                  <Image src={icon} alt="" width={size} height={size} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[18px] font-semibold leading-6 text-accent">{t(`sdk_feature_${id}_title`)}</p>
                  <p className="text-[14px] leading-4 text-ink">{t(`sdk_feature_${id}_body`)}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
