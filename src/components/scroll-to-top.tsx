'use client'

import { useEffect, useState } from 'react'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'

export function ScrollToTop() {
  const t = useTranslations()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <m.button
      type="button"
      aria-label={t('scroll_to_top')}
      className="fixed bottom-6 right-6 z-20 h-12 w-12 rounded-full bg-brand text-xl text-white shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.25 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </m.button>
  )
}
