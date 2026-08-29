'use client'

import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { DURATION, EASE } from '@/lib/motion'

export function Accordion({ items }: { items: { id: string; title: string; body: string }[] }) {
  const [open, setOpen] = useState<string | undefined>(items[0]?.id)

  return (
    <ul>
      {items.map((item) => {
        const isOpen = item.id === open
        return (
          <li key={item.id} className="border-b border-slate-200">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-ink"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? undefined : item.id)}
            >
              {item.title}
              <span
                className={`relative h-5 w-5 shrink-0 transition-transform duration-[--duration-base] ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-brand" />
              </span>
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
                  <p className="pb-4 text-muted">{item.body}</p>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
