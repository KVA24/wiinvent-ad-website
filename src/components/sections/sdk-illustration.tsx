import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import { Stagger, StaggerItem } from '@/components/stagger'
import { PLATFORMS } from '@/data/platforms'

export function SdkIllustration() {
  const t = useTranslations()

  return (
    <section className="bg-surface-alt py-16 md:py-24">
      <Container>
        <Image src="/sdk-code.png" alt="" width={960} height={480} className="mx-auto h-auto w-full max-w-4xl" />
        <Stagger className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-8 md:justify-between">
          {PLATFORMS.map(({ key, icon }) => (
            <StaggerItem key={key} className="flex w-24 flex-col items-center gap-3 text-center text-sm font-semibold text-ink">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-4 shadow-sm">
                <Image src={icon} alt="" width={40} height={40} />
              </div>
              <span>{t(key)}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
