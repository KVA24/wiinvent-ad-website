'use client'

import Image from 'next/image'
import { AnimatePresence, m } from 'motion/react'
import type { AdFormat, Device } from '@/data/formats'
import { DURATION } from '@/lib/motion'

/* Figma 2919:5246 — the creative plays inside a phone chassis. Wider devices
   reuse the same frame proportions until their mockups are handed over. */
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
  const src = format.media[device]

  return (
    <m.div
      layoutId={layoutId}
      /* Prototype 2919:5246 — slides in from the right on load. */
      initial={{ x: 130.5 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative h-[428px] w-[200px] shrink-0 drop-shadow-[2px_4px_1.5px_rgba(0,0,0,0.2)]"
    >
      <div className="absolute left-[2px] top-[2px] h-[424px] w-[196px] rounded-[25px] border-[0.5px] border-[#3c3a3f] bg-[#2b2a2d] p-[1.5px] shadow-[0_15px_15px_rgba(15,23,42,0.18)]">
        <div className="h-full w-full rounded-[23.7px] bg-[#09090a] p-[4px]">
          <div className="relative h-full w-full overflow-hidden rounded-[20.3px] bg-[#111]">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={device}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.base }}
                className="absolute inset-0"
              >
                {src && <Image src={src} alt={name} fill sizes="186px" className="object-cover object-top" />}
              </m.div>
            </AnimatePresence>
            <Image
              src="/demo-dynamic-island.svg"
              alt=""
              width={53}
              height={15}
              className="absolute left-1/2 top-[5px] -translate-x-1/2"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </m.div>
  )
}
