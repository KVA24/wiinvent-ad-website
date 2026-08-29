'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { DURATION, EASE } from '@/lib/motion'
import type { AdFormat, Device } from '@/data/formats'

const LABELS: Record<Device, 'device_mobile' | 'device_pc' | 'device_smart_tv'> = {
  mobile: 'device_mobile',
  pc: 'device_pc',
  'smart-tv': 'device_smart_tv',
}

function readDevice(value: string | null, format: AdFormat) {
  return value && format.devices.includes(value as Device) ? (value as Device) : format.devices[0]
}

/* Figma 2769:6164 — segmented control, 125px per option. */
export function DeviceTabs({ format }: { format: AdFormat }) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  /* `?device=` belongs to the catalogue filter that also lives on this page,
     so the preview tabs carry their own parameter. */
  const active = readDevice(searchParams.get('preview'), format)

  const setDevice = (device: Device) => {
    const next = new URLSearchParams(searchParams.toString())
    if (device === format.devices[0]) next.delete('preview')
    else next.set('preview', device)
    router.replace(`${pathname}${next.toString() ? `?${next.toString()}` : ''}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-[12px] border border-[#d2d5db] p-1.5">
      {format.devices.map((device) => {
        const isActive = device === active
        return (
          <button
            key={device}
            type="button"
            onClick={() => setDevice(device)}
            aria-pressed={isActive}
            className="relative isolate flex min-w-[125px] items-center justify-center overflow-hidden rounded-lg px-5 py-3.5"
          >
            {isActive && (
              <m.span
                layoutId="device-indicator"
                className="absolute inset-0 -z-10 rounded-lg bg-primary-500"
                transition={{ duration: DURATION.base, ease: EASE.standard }}
              />
            )}
            <Image
              src={isActive ? '/icon-tab-device.svg' : '/icon-tab-device-muted.svg'}
              alt=""
              width={16}
              height={16}
            />
            <span
              className={`whitespace-nowrap px-2 text-[16px] font-semibold leading-5 ${isActive ? 'text-white' : 'text-muted'}`}
            >
              {t(LABELS[device])}
            </span>
          </button>
        )
      })}
    </div>
  )
}
