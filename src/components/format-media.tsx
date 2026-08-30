'use client'

import Image from 'next/image'
import { AnimatePresence, m } from 'motion/react'
import type { AdFormat, Device } from '@/data/formats'
import { DURATION } from '@/lib/motion'

/* Figma 2919:5246 (phone) and 3031:7675 (PC) — the creative plays inside a
   device chassis whose screen is a scroll container: the interface capture
   pans inside the viewport like a simulator, scrollbar hidden. The phone
   carries the dynamic island and glass glint; the PC is a 602x331 MacBook
   with a 485x264 screen at (58.5, 33.5). Figma cannot export the MacBook
   body bitmap (3031:7677), so the chassis is drawn in CSS until that asset
   is handed over. Smart TV renders the design's 565x375 display
   (2948:10535): #535353 frame around a black inlay, 545x307 screen with an
   8px radius scrolling vertically, camera dot, gradient base bar and stand. */
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

  if (device === 'smart-tv') {
    return (
      <m.div
        layoutId={layoutId}
        initial={{ x: 130.5 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[565px] shrink-0 drop-shadow-[2px_4px_1.5px_rgba(0,0,0,0.2)]"
      >
        <div className="relative aspect-[565/376]">
          {/* Display frame with its black inlay and screen opening. */}
          <div className="absolute inset-x-0 top-0 h-[86.3%] rounded-[6px] bg-[#535353] p-[2px]">
            <div className="relative h-full w-full rounded-[5px] bg-black p-[8px]">
              <span className="absolute left-1/2 top-[2px] size-[4px] -translate-x-1/2 rounded-full bg-[#3c3a38]" />
              <div className="relative h-full w-full overflow-hidden rounded-[8px] bg-[#3c3a38]">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={device}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.base }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {src && (
                      <Image src={src} alt={name} width={545} height={652} sizes="545px" className="h-auto min-h-full w-full object-cover" />
                    )}
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Base bar and stand. */}
          <div className="absolute inset-x-0 top-[86.3%] h-[4%] bg-gradient-to-b from-[#e2e3e5] via-[#c9cacd] to-[#9fa1a5]" />
          <div className="absolute left-1/2 top-[90.3%] h-[6.6%] w-[5.1%] -translate-x-1/2 bg-gradient-to-b from-[#c9cacd] to-[#9fa1a5]" />
          <div className="absolute left-1/2 bottom-0 h-[3.1%] w-[37.3%] -translate-x-1/2 rounded-[3px] bg-gradient-to-b from-[#d5d6d8] to-[#a8aaad]" />
        </div>
      </m.div>
    )
  }

  if (device === 'pc') {
    return (
      <m.div
        layoutId={layoutId}
        initial={{ x: 130.5 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[602px] shrink-0 drop-shadow-[2px_4px_1.5px_rgba(0,0,0,0.2)]"
      >
        <div className="relative aspect-[602/331]">
          {/* Lid: dark bezel around the screen opening. */}
          <div className="absolute inset-x-[6.5%] top-0 h-[94%] rounded-t-[3.5%_6.5%] rounded-b-[2%] border border-[#3c3a3f] bg-[#26262a] p-[1.2%] shadow-[0_15px_15px_rgba(15,23,42,0.18)]">
            <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-[#111]">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={device}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.base }}
                  className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {src && (
                    <Image src={src} alt={name} width={485} height={804} sizes="485px" className="h-auto min-h-full w-full object-cover" />
                  )}
                </m.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
            </div>
          </div>
          {/* Base: silver deck with the thumb notch. */}
          <div className="absolute inset-x-0 bottom-0 h-[6%] rounded-b-[10px] rounded-t-[2px] bg-gradient-to-b from-[#e2e3e5] via-[#c9cacd] to-[#9fa1a5]">
            <div className="absolute left-1/2 top-0 h-[45%] w-[14%] -translate-x-1/2 rounded-b-[8px] bg-[#b4b6ba]" />
          </div>
        </div>
      </m.div>
    )
  }

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
                className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {src && (
                  <Image
                    src={src}
                    alt={name}
                    width={387}
                    height={4096}
                    sizes="186px"
                    className="h-auto min-h-full w-full object-cover"
                  />
                )}
              </m.div>
            </AnimatePresence>
            <Image
              src="/demo-dynamic-island.svg"
              alt=""
              width={53}
              height={15}
              className="pointer-events-none absolute left-1/2 top-[5px] -translate-x-1/2"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </m.div>
  )
}
