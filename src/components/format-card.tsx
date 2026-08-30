'use client'

import { useTranslations } from 'next-intl'
import { m } from 'motion/react'
import type { AdFormat } from '@/data/formats'
import { FormatPreview } from '@/components/format-preview'
import { Link } from '@/i18n/routing'

/* Figma 2865:11867 "Card SKU" */
export function FormatCard({ format, layoutId = `format-${format.slug}` }: { format: AdFormat; layoutId?: string }) {
  const t = useTranslations()
  const typeKey = `type_${format.type.replace(/-/g, '_')}` as const

  return (
    <Link
      href={`/formats/${format.slug}`}
      className="group flex w-full flex-col items-center gap-3 transition-transform duration-[--duration-base] ease-[--ease-standard] hover:-translate-y-1"
    >
      <m.div layoutId={layoutId} className="w-full">
        <FormatPreview format={format} />
      </m.div>
      <div className="flex w-full flex-col gap-1.5 text-center">
        <p className="text-[18px] font-semibold leading-6 text-accent">{t(`format.${format.key}.name`)}</p>
        <p className="text-[14px] font-semibold leading-4 text-muted">{t(typeKey)}</p>
      </div>
    </Link>
  )
}
