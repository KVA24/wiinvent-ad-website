import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import type { AdFormat, Device } from '@/data/formats'

const DEVICE_ICONS: Partial<Record<Device, string>> = {
  mobile: '/icon-device-mobile.svg',
  'smart-tv': '/icon-device-tv.svg',
}

/* Figma 2675:5547 — a running demo of one format over the TV360 interface. */
export function DemoShowcase({ format }: { format: AdFormat }) {
  const t = useTranslations()
  const typeKey = `type_${format.type.replace(/-/g, '_')}` as const

  return (
    <section className="relative isolate overflow-hidden py-10 xl:py-[42px]">
      <Image src="/demo-hero-bg.png" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <Container className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center xl:gap-[52px]">
        <div className="flex w-full max-w-[412px] flex-col items-start gap-2">
          {/* The page heading belongs to the format list below; this is a preview label. */}
          <p className="font-[family-name:var(--font-heading)] text-[40px] font-semibold leading-[48px] text-white">
            {t(`format.${format.key}.name`)}
          </p>
          <div className="flex flex-col items-start gap-1">
            <p className="type-b1 text-white">{t(typeKey)}</p>
            <p className="flex items-center gap-1.5 type-b1 text-white">
              {t('available_on')}
              {format.devices.map((device) =>
                DEVICE_ICONS[device] ? (
                  <Image key={device} src={DEVICE_ICONS[device]!} alt={t(`device_${device.replace('-', '_')}`)} width={24} height={24} />
                ) : null,
              )}
            </p>
          </div>
        </div>

        {/* Phone chassis (2675:5533) wrapping the interface screenshot */}
        <div className="relative h-[428px] w-[200px] shrink-0 drop-shadow-[2px_4px_1.5px_rgba(0,0,0,0.2)]">
          <div className="absolute left-[2px] top-[2px] h-[424px] w-[196px] rounded-[25px] border-[0.5px] border-[#3c3a3f] bg-[#2b2a2d] p-[1.5px] shadow-[0_15px_15px_rgba(15,23,42,0.18)]">
            <div className="h-full w-full rounded-[23.7px] bg-[#09090a] p-[4px]">
              <div className="relative h-full w-full overflow-hidden rounded-[20.3px]">
                <Image src="/demo-phone-screen.png" alt="" fill sizes="186px" className="object-cover" />
                <Image
                  src="/demo-dynamic-island.svg"
                  alt=""
                  width={53}
                  height={15}
                  className="absolute left-1/2 top-[5px] -translate-x-1/2"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
