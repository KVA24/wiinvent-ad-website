'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MobileDrawer } from '@/components/mobile-drawer'

export function Header() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const routeKey = useMemo(
    () => JSON.stringify(params),
    [params],
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [locale, pathname, routeKey])

  const links = [
    ['nav_sdk', '/sdk'],
    ['nav_demo', '/formats'],
    ['nav_contact', '/contact'],
  ] as const

  const navigation = links.map(([key, href]) => (
    <Link key={href} href={href} className="text-sm text-ink transition-colors hover:text-brand">
      {t(key)}
    </Link>
  ))

  return (
    <>
      <header className={`sticky top-0 z-30 w-full bg-white transition-[height,box-shadow] duration-[--duration-base] ${scrolled ? 'h-16 shadow-sm backdrop-blur' : 'h-20'}`}>
        <Container className="flex h-full items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-brand">WIINVENT</Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {navigation}
            <LanguageSwitcher />
            <Button href="/contact" size="sm">{t('cta_demo')}</Button>
          </nav>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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
          <span className="text-lg font-bold text-brand">WIINVENT</span>
          <button type="button" aria-label={t('menu_close')} onClick={() => setOpen(false)} className="text-2xl text-ink">X</button>
        </div>
        <nav className="mt-10 flex flex-col gap-6" aria-label="Mobile">
          {navigation}
          <LanguageSwitcher />
          <Button href="/contact" onClick={() => setOpen(false)}>{t('cta_demo')}</Button>
        </nav>
      </MobileDrawer>
    </>
  )
}
