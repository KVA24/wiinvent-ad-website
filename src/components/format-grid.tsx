'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, m } from 'motion/react'
import { FormatCard } from './format-card'
import { Container } from '@/components/container'
import { FilterDropdown } from '@/components/filter-dropdown'
import { SearchInput } from '@/components/search-input'
import { filterFormats } from '@/lib/filter-formats'
import { DURATION, EASE } from '@/lib/motion'
import { usePathname, useRouter } from '@/i18n/routing'
import type { AdFormat, Device, FormatType } from '@/data/formats'

/* Figma 2865:11865 — a sticky glass filter panel above the card grid. */
export function FormatGrid({
  formats,
  query,
  headingAs: Heading = 'h1',
}: {
  formats: AdFormat[]
  query: { devices: Device[]; types: FormatType[]; search: string }
  /* The detail page already owns the page heading, so it renders this as h2. */
  headingAs?: 'h1' | 'h2'
}) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()

  const visible = useMemo(
    () => filterFormats(formats, query, (format) => t(`format.${format.key}.name`)),
    [formats, query, t],
  )

  const activeGroups = (query.devices.length ? 1 : 0) + (query.types.length ? 1 : 0)

  const deviceOptions = [
    { value: 'mobile', label: t('device_mobile') },
    { value: 'pc', label: t('device_pc') },
    { value: 'smart-tv', label: t('device_smart_tv') },
  ]
  const typeOptions: { value: FormatType; label: string }[] = [
    { value: 'banner-standard', label: t('type_banner_standard') },
    { value: 'welcome', label: t('type_welcome') },
    { value: 'instream-video', label: t('type_instream_video') },
  ]

  return (
    <section className="bg-white pb-[60px] pt-8">
      <Container className="flex flex-col items-center gap-8">
        <div
          className="sticky top-24 z-20 flex w-full flex-col items-center justify-center gap-6 rounded-xl border-2 border-blue-200 px-6 pb-6 pt-4 backdrop-blur-[5.95px]"
          style={{
            backgroundImage:
              'linear-gradient(4.75deg, rgba(200, 236, 255, 0.5) 20.78%, rgba(255, 255, 255, 0.5) 56.07%)',
          }}
        >
          <div className="flex w-full items-center justify-between">
            <Heading className="font-[family-name:var(--font-heading)] text-[28px] font-semibold leading-[34px] text-accent">
              {t('formats_title')}
            </Heading>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={activeGroups === 0}
                onClick={() => router.replace(pathname, { scroll: false })}
                className="relative inline-flex h-10 items-center justify-center rounded-lg bg-[#0095ff] p-3 transition-transform duration-[--duration-base] ease-[--ease-standard] enabled:hover:-translate-y-px disabled:cursor-default"
              >
                <Image src="/icon-filter.svg" alt="" width={24} height={24} />
                <span className="px-2 text-[14px] font-semibold leading-4 text-white">{t('filter_label')}</span>
                {activeGroups > 0 && (
                  <span className="absolute -right-[7px] -top-[7px] flex size-6 items-center justify-center rounded-full border border-[#0095ff] bg-white text-[14px] font-semibold leading-4 text-info">
                    {activeGroups}
                  </span>
                )}
              </button>
              <FilterDropdown label={t('filter_device')} param="device" options={deviceOptions} selected={query.devices} />
              <FilterDropdown label={t('filter_type')} param="type" options={typeOptions} selected={query.types} />
            </div>
            <SearchInput value={query.search} placeholder={t('search_label')} />
          </div>
        </div>

        {visible.length ? (
          <m.ul layout className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-8">
            <AnimatePresence mode="popLayout">
              {visible.map((format) => (
                <m.li
                  key={format.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: DURATION.base, ease: EASE.standard }}
                  className="w-[215px]"
                >
                  <FormatCard format={format} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        ) : (
          <div className="w-full rounded-xl border-2 border-dashed border-blue-200 px-6 py-16 text-center text-muted">
            {t('empty_formats')}
          </div>
        )}
      </Container>
    </section>
  )
}
