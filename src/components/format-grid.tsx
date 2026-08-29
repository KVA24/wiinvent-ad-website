'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, m } from 'motion/react'
import { FormatCard } from './format-card'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'
import { Stagger, StaggerItem } from '@/components/stagger'
import { filterFormats } from '@/lib/filter-formats'
import { DURATION, EASE } from '@/lib/motion'
import type { AdFormat, Device, FormatType } from '@/data/formats'
import { FilterDropdown } from '@/components/filter-dropdown'
import { SearchInput } from '@/components/search-input'

export function FormatGrid({
  formats,
  query,
}: {
  formats: AdFormat[]
  query: { devices: Device[]; types: FormatType[]; search: string }
}) {
  const t = useTranslations()
  const visible = useMemo(
    () => filterFormats(formats, query, (format) => t(`format.${format.key}.name`)),
    [formats, query, t],
  )

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
    <section className="bg-surface-alt py-20">
      <Container className="space-y-12">
        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">{t('nav_demo')}</p>
            <p className="max-w-2xl text-lg leading-8 text-muted">{t('hero_description')}</p>
          </div>
          <Stagger className="grid gap-3 sm:grid-cols-3">
            {typeOptions.map((item) => (
              <StaggerItem
                key={item.value}
                className="rounded-lg border border-slate-200 bg-white px-4 py-5 text-sm font-semibold text-ink"
              >
                {item.label}
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">{t('formats_title')}</h1>
          <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={query.search} placeholder={t('search_label')} />
            <div className="flex flex-wrap gap-3">
              <FilterDropdown
                label={t('filter_device')}
                param="device"
                options={deviceOptions}
                selected={query.devices}
              />
              <FilterDropdown
                label={t('filter_type')}
                param="type"
                options={typeOptions}
                selected={query.types}
              />
            </div>
          </Reveal>

          {visible.length ? (
            <m.ul layout className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
              {visible.map((format) => (
                <m.li
                  key={format.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: DURATION.base, ease: EASE.standard }}
                >
                  <FormatCard format={format} />
                </m.li>
              ))}
              </AnimatePresence>
            </m.ul>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-muted">
              {t('empty_formats')}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
