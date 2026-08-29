'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

/* Figma 2448:4145 — gradient header over a pale body, sized Big or Small. */
const HEADER_GRADIENT = 'linear-gradient(73deg, #0d419a 0.76%, #3296ee 99.29%)'
const BODY_GRADIENT = 'linear-gradient(0.16deg, #d7edff 0.41%, #f8f8f8 104.69%)'

export function NotificationDialog({
  open,
  state,
  title,
  body,
  closing,
  closeLabel,
  onClose,
}: {
  open: boolean
  state: 'success' | 'error'
  title: string
  body: string
  closing: string
  closeLabel: string
  onClose: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* The design ships Big and Small variants; they map onto the breakpoint
     rather than onto the result, so the card scales with the page. */
  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base }}
            onClick={onClose}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: DURATION.base, ease: EASE.emphasized }}
            className="fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-32px)] max-w-[327px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl shadow-[0_0_0_3px_#aeb6fb] outline-none md:max-w-[777px]" 
          >
            <div
              className="flex w-full items-center justify-center gap-2 px-6 py-4"
              style={{ backgroundImage: HEADER_GRADIENT }}
            >
              <p
                className="flex-1 text-center font-[family-name:var(--font-heading)] text-[18px] font-semibold leading-7 text-white md:text-[28px] md:leading-[34px]" 
              >
                {title}
              </p>
            </div>

            <div
              className="flex w-full flex-col items-center justify-center gap-3 p-6"
              style={{ backgroundImage: BODY_GRADIENT }}
            >
              <Image
                src={state === 'success' ? '/icon-check-circle.svg' : '/icon-delete-circle.svg'}
                alt=""
                width={52}
                height={52}
              />
              <p
                className="whitespace-pre-line text-center text-[14px] leading-5 text-muted md:text-[16px] md:font-medium md:leading-6" 
              >
                {body}
              </p>
              <p
                className="whitespace-pre-line text-center font-[family-name:var(--font-heading)] text-[16px] font-semibold leading-6 text-[#3057b6] md:text-[18px] md:leading-7" 
              >
                {closing}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-1 rounded-md px-4 py-2 text-[14px] font-semibold leading-4 text-links transition-colors hover:bg-primary-500/5"
              >
                {closeLabel}
              </button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
