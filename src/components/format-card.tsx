'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { m } from 'motion/react'
import type { AdFormat } from '@/data/formats'
import { Link } from '@/i18n/routing'

export function FormatCard({ format, layoutId = `format-${format.slug}` }: { format: AdFormat; layoutId?: string }) {
  const t = useTranslations()
  const typeKey = `type_${format.type.replace(/-/g, '_')}` as const

  return (
    <Link
      href={`/formats/${format.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-transform duration-[--duration-fast] hover:-translate-y-1"
    >
      <m.div layoutId={layoutId} className="bg-surface">
        <Image
          src={format.thumbnail}
          alt={t(`format.${format.key}.name`)}
          width={640}
          height={360}
          className="h-auto w-full object-cover"
        />
      </m.div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-ink">{t(`format.${format.key}.name`)}</h3>
        <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
          {t(typeKey)}
        </span>
      </div>
    </Link>
  )
}
