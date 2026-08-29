'use client'

import { useSearchParams } from 'next/navigation'
import { m } from 'motion/react'
import { usePathname, useRouter } from '@/i18n/routing'
import { DURATION, EASE } from '@/lib/motion'
import type { AdFormat, Device } from '@/data/formats'
import { useTranslations } from 'next-intl'

const LABELS: Record<Device, 'device_mobile' | 'device_pc' | 'device_smart_tv'> = {
  mobile: 'device_mobile',
  pc: 'device_pc',
  'smart-tv': 'device_smart_tv',
}

function readDevice(value: string | null, format: AdFormat) {
  return value && format.devices.includes(value as Device) ? (value as Device) : format.devices[0]
}

export function DeviceTabs({ format }: { format: AdFormat }) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = readDevice(searchParams.get('device'), format)

  const setDevice = (device: Device) => {
    const next = new URLSearchParams(searchParams.toString())
    if (device === format.devices[0]) next.delete('device')
    else next.set('device', device)
    router.replace(`${pathname}${next.toString() ? `?${next.toString()}` : ''}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {format.devices.map((device) => {
        const isActive = device === active
        return (
          <button
            key={device}
            type="button"
            onClick={() => setDevice(device)}
            className={`relative isolate rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? 'text-brand' : 'text-ink hover:bg-surface'
            }`}
          >
            {isActive ? (
              <m.span
                layoutId="device-indicator"
                className="absolute inset-0 -z-10 rounded-full bg-brand-light"
                transition={{ duration: DURATION.base, ease: EASE.standard }}
              />
            ) : null}
            {t(LABELS[device])}
          </button>
        )
      })}
    </div>
  )
}
