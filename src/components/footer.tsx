import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/button'
import { Container } from '@/components/container'

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-brand-dark text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-[2fr_1fr_1.5fr]">
        <div>
          <Link href="/" className="text-lg font-bold">WIINVENT</Link>
          <p className="mt-4 max-w-sm text-sm text-white/70">{t('hero_description')}</p>
        </div>
        <nav className="flex flex-col gap-3 text-sm" aria-label="Footer">
          <Link href="/sdk" className="hover:text-white/70">{t('nav_sdk')}</Link>
          <Link href="/formats" className="hover:text-white/70">{t('nav_demo')}</Link>
          <Link href="/contact" className="hover:text-white/70">{t('nav_contact')}</Link>
        </nav>
        <div className="text-sm">
          <p className="font-semibold">{t('company_name')}</p>
          <p className="mt-3 flex gap-2 text-white/70">
            <svg aria-hidden="true" className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {t('company_address')}
          </p>
          <Button href="/contact" variant="secondary" size="sm" className="mt-5">{t('cta_demo')}</Button>
        </div>
      </Container>
      <Container className="border-t border-white/15 py-5 text-sm text-white/60">{t('copyright')}</Container>
    </footer>
  )
}
