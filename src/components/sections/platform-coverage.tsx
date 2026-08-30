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
          {/* Content Property 1=Variant2: glyph and label both turn #4e61f6 on hover. */}
          {PLATFORMS.map(({ key, icon, width, height }) => (
            <StaggerItem
              key={key}
              className="group flex flex-col items-center justify-center gap-0.5 rounded-[12px] p-3 text-icon-grey transition-colors duration-[--duration-base] hover:text-primary-500"
            >
              <span className="flex size-[60px] items-center justify-center">
                <span
                  aria-hidden
                  className="mask-icon"
                  style={{ width, height, maskImage: `url(${icon})`, WebkitMaskImage: `url(${icon})` }}
                />
              </span>
              <span className="text-center text-[16px] font-semibold leading-5 text-muted transition-colors duration-[--duration-base] group-hover:text-primary-500">
                {t(key)}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
