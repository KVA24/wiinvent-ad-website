'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { DURATION, EASE } from '@/lib/motion'
import { AnimatePresence, m } from 'motion/react'

const LOCALES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
] as const

/* Figma 3139:11783 — a 36px avatar carrying the locale initial, then the
   "Ngôn ngữ" label. Opens a menu with the two locales. */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const switchTo = (next: 'vi' | 'en') => {
    setOpen(false)
    /* Pathnames are not localized, so usePathname already returns the resolved
       path (dynamic segments included) and can be replayed under a new locale. */
    router.replace(pathname, { locale: next })
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 px-3 py-2"
      >
        <span className="flex size-9 items-center justify-center rounded-md bg-primary-600 type-s2 text-white">
          {locale.charAt(0).toUpperCase()}
        </span>
        <span className="text-[14px] font-semibold leading-4 text-ink">{t('language_label')}</span>
      </button>
      <AnimatePresence>
        {open && (
          <m.ul
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: EASE.standard }}
            className="absolute right-0 top-full z-40 mt-2 w-40 overflow-hidden rounded-lg bg-white py-1 shadow-ds1"
          >
            {LOCALES.map(({ code, label }) => (
              <li key={code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={code === locale}
                  onClick={() => switchTo(code)}
                  className={`flex w-full px-4 py-2 text-left text-[14px] leading-5 transition-colors hover:bg-primary-500/5 ${
                    code === locale ? 'font-semibold text-links' : 'text-ink'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
