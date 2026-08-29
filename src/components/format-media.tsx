'use client'

import Image from 'next/image'
import { AnimatePresence, m } from 'motion/react'
import type { AdFormat, Device } from '@/data/formats'
import { DURATION } from '@/lib/motion'

export function FormatMedia({
  format,
  device,
  layoutId,
  name,
}: {
  format: AdFormat
  device: Device
  layoutId: string
  name: string
}) {
  const src = format.media[device] ?? format.media[format.devices[0]]!

  return (
    <m.div layoutId={layoutId} className="overflow-hidden rounded-lg bg-white">
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={device}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base }}
        >
          <Image src={src} alt={name} width={800} height={600} className="h-auto w-full" />
        </m.div>
      </AnimatePresence>
    </m.div>
  )
}
