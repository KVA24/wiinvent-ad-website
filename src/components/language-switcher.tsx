'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const switchTo = (next: 'vi' | 'en') =>
    router.replace({ pathname, params: params as never } as never, { locale: next })

  return (
    <div className="flex items-center gap-1 text-sm">
      {(['vi', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={l === locale ? 'font-semibold text-brand' : 'text-muted'}
        >
          {l === 'vi' ? 'Tiếng Việt' : 'English'}
        </button>
      ))}
    </div>
  )
}
