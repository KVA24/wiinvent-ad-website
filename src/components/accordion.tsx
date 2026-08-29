'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

/* Figma 2443:4368 — the open row sits on solid white with its body text,
   closed rows on 80% white. Chevron is a separate asset per state. */
export function Accordion({ items }: { items: { id: string; title: string; body: string }[] }) {
  const [open, setOpen] = useState<string | undefined>(items[0]?.id)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = item.id === open
        return (
          <li
            key={item.id}
            className={`rounded-lg p-3 ${isOpen ? 'bg-white' : 'bg-white/80'}`}
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? undefined : item.id)}
            >
              <span
                className={`min-w-0 flex-1 text-[16px] font-semibold leading-5 ${isOpen ? 'text-links' : 'text-accent'}`}
              >
                {item.title}
              </span>
              <Image
                src={isOpen ? '/icon-chevron-open.svg' : '/icon-chevron.svg'}
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE.standard }}
                  className="overflow-hidden"
                >
                  <p className="pt-[7px] text-[14px] leading-4 text-muted">{item.body}</p>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
