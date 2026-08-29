'use client'

import { useTranslations } from 'next-intl'

/* Figma I2531:9256;2531:10059 — a 40px tile in the footer's bottom row. */
export function ScrollToTop() {
  const t = useTranslations()
  return (
    <button
      type="button"
      aria-label={t('scroll_to_top')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-300 text-white transition-transform duration-[--duration-fast] ease-[--ease-standard] hover:-translate-y-px"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 10l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
