import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import { Stagger, StaggerItem } from '@/components/stagger'
import { PLATFORMS } from '@/data/platforms'

/* Figma 2418:27 */
export function PlatformCoverage() {
  const t = useTranslations()
  return (
    <section className="bg-white py-10 xl:py-[42px]">
      <Container className="flex flex-col items-center gap-8">
        <h2 className="type-h3 text-center text-accent">{t('platform_title')}</h2>
        <Stagger className="flex flex-wrap items-center justify-center gap-6">
          {PLATFORMS.map(({ key, icon }) => (
            <StaggerItem key={key} className="flex flex-col items-center justify-center gap-0.5 rounded-[12px] p-3">
              <Image src={icon} alt="" width={60} height={60} className="size-[60px]" />
              <span className="text-center text-[16px] font-semibold leading-5 text-muted">{t(key)}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
