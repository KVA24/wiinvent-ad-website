'use client'

import { useEffect } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

export function MobileDrawer({ open, onClose, children }: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base }}
            onClick={onClose}
          />
          <m.div
            className="fixed right-0 top-0 z-50 h-dvh w-[280px] bg-white p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
