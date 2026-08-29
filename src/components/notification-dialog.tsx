'use client'

import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

type Props = {
  open: boolean
  state: 'success' | 'error'
  size: 'big' | 'small'
  title: string
  closeLabel: string
  onClose: () => void
}

export function NotificationDialog({ open, state, size, title, closeLabel, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const sizeClass = size === 'big' ? 'md:max-w-[560px]' : 'md:max-w-[380px]'
  const toneClass = state === 'success' ? 'bg-brand-light text-brand' : 'bg-red-50 text-red-600'

  const focusableSelector = useMemo(
    () => 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
    [],
  )

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => closeRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusables.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [focusableSelector, onClose, open])

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            tabIndex={-1}
            className={`fixed left-1/2 top-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl md:w-[min(92vw,720px)] md:p-8 ${sizeClass}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: DURATION.base, ease: EASE.emphasized }}
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
                {state === 'success' ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2.5]">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2.5]">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="contact-dialog-title" className="text-2xl font-bold text-ink">
                  {title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label={closeLabel}
                className="text-2xl leading-none text-muted"
                onClick={onClose}
              >
                ×
              </button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
