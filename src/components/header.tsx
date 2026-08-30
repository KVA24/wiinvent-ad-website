'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MobileDrawer } from '@/components/mobile-drawer'
import { Link, usePathname } from '@/i18n/routing'

const LINKS = [
  ['nav_sdk', '/sdk'],
  ['nav_demo', '/formats'],
  ['nav_contact', '/contact'],
] as const

/* Figma 3043:5488 — white bar, 72px inset, 24px vertical padding. */
export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const navigation = LINKS.map(([key, href]) => (
    <Link key={href} href={href} className="type-s2 px-2 text-ink transition-colors duration-[--duration-base] hover:text-info">
      {t(key)}
    </Link>
  ))

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full bg-white py-6 transition-shadow duration-[--duration-base] ${
          scrolled ? 'shadow-ds1 backdrop-blur' : ''
        }`}
      >
        <Container className="flex items-center justify-between">
          <Link href="/" aria-label="Wiinvent">
            <Image src="/logo.svg" alt="Wiinvent" width={125} height={40} priority />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {navigation}
            <Button href="/contact" variant="nav" size="nav">{t('cta_demo')}</Button>
            <LanguageSwitcher />
          </nav>

          <button
            type="button"
            className="flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={t('menu_open')}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span className="h-px w-5 bg-ink" />
            <span className="h-px w-5 bg-ink" />
            <span className="h-px w-5 bg-ink" />
          </button>
        </Container>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between">
          <Image src="/logo.svg" alt="Wiinvent" width={125} height={40} />
          <button
            type="button"
            aria-label={t('menu_close')}
            onClick={() => setOpen(false)}
            className="text-2xl text-ink"
          >
            ×
          </button>
        </div>
        <nav className="mt-10 flex flex-col items-start gap-6" aria-label="Mobile">
          {navigation}
          <Button href="/contact" variant="nav" size="nav" onClick={() => setOpen(false)}>
            {t('cta_demo')}
          </Button>
          <LanguageSwitcher className="-ml-3" />
        </nav>
      </MobileDrawer>
    </>
  )
}
