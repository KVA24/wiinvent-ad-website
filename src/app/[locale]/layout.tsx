import { Bai_Jamjuree, Inter, JetBrains_Mono, Manrope } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { organizationJsonLd } from '@/lib/seo'
import { MotionProvider } from '@/components/motion-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import '../globals.css'

const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-bai-jamjuree',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/* Only vi and en exist. Without this, any stray path the middleware skips
   (service-worker probes like /sw.js, dotted files) is rendered as a locale:
   the page and its metadata run with locale "sw.js" before the layout's
   notFound() fires — a slow 404 in production and a 500 in dev. */
export const dynamicParams = false

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale })

  return (
    <html
      lang={locale}
      className={`${baiJamjuree.variable} ${inter.variable} ${manrope.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(locale, t('company_name'))),
          }}
        />
        <MotionProvider>
          <NextIntlClientProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
