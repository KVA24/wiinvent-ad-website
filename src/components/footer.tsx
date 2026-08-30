import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Link } from '@/i18n/routing'

const LINKS = [
  ['nav_sdk', '/sdk'],
  ['nav_demo', '/formats'],
  ['nav_contact', '/contact'],
] as const

/* Figma I2531:9256 "Footer Desk" */
export function Footer() {
  const t = useTranslations()
  return (
    <footer className="overflow-hidden bg-primary-900 pb-[60px] pt-[52px] text-white">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-4">
          <Link href="/">
            <Image src="/logo-white.svg" alt="Wiinvent" width={125} height={40} />
          </Link>
          <p className="type-b1">{t('company_name')}</p>
        </div>

        <div className="h-px w-full bg-white/20" />

        <div className="flex flex-col gap-8 md:flex-row md:gap-[34px]">
          <nav className="flex flex-1 flex-col items-start justify-center gap-6" aria-label="Footer">
            {LINKS.map(([key, href]) => (
              <Link key={href} href={href} className="type-s1 px-2 transition-colors duration-[--duration-base] hover:text-info">
                {t(key)}
              </Link>
            ))}
            <Button href="/contact" variant="nav" size="nav">{t('cta_demo')}</Button>
          </nav>
          <div className="flex flex-1 flex-col items-start gap-6">
            <p className="type-s1">{t('contact_title')}</p>
            <p className="flex items-center gap-3 type-b3">
              <Image src="/icon-home.svg" alt="" width={24} height={24} className="shrink-0" />
              {t('company_address')}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-white/20" />

        <div className="flex items-start gap-6">
          <p className="min-w-0 flex-1 font-[family-name:var(--font-alt)] text-[16px] font-semibold leading-6">
            {t('copyright')}
          </p>
          <ScrollToTop />
        </div>
      </Container>
    </footer>
  )
}
