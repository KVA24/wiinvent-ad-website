'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { usePathname, useRouter } from '@/i18n/routing'
import { DURATION, EASE } from '@/lib/motion'

type Option = { value: string; label: string }

function updateQuery(pathname: string, current: string, key: string, values: string[]) {
  const next = new URLSearchParams(current)
  if (values.length) next.set(key, values.join(','))
  else next.delete(key)
  return `${pathname}${next.toString() ? `?${next.toString()}` : ''}`
}

export function FilterDropdown({
  label,
  param,
  options,
  selected,
}: {
  label: string
  param: 'device' | 'type'
  options: Option[]
  selected: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const active = selected.length > 0

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const selectedSet = useMemo(() => new Set(selected), [selected])

  const toggle = (value: string) => {
    const next = new Set(selectedSet)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    router.replace(updateQuery(pathname, window.location.search, param, [...next]), { scroll: false })
  }

  return (
    <div ref={root} className="relative">
      {/* Figma 2865:11882 — chip with an outside count badge. */}
      <button
        type="button"
        aria-expanded={open}
        className="relative inline-flex h-10 items-center justify-center rounded-lg border-[1.5px] border-[#0095ff] bg-[#e6f4ff] p-3 transition-transform duration-[--duration-base] ease-[--ease-standard] hover:-translate-y-px"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="px-2 text-[14px] font-semibold leading-4 text-info">{label}</span>
        <Image
          src="/icon-nav-arrow.svg"
          alt=""
          width={24}
          height={24}
          className={`transition-transform duration-[--duration-base] ${open ? 'rotate-180' : ''}`}
        />
        {active && (
          <span className="absolute -right-[8.5px] -top-[8.5px] flex size-6 items-center justify-center rounded-full border border-[#0095ff] bg-white text-[14px] font-semibold leading-4 text-info">
            {selected.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: EASE.standard }}
            className="absolute left-0 top-full z-20 mt-3 w-72 rounded-lg border border-[#c8ecff] bg-white p-4 shadow-ds1"
          >
            <ul className="space-y-2">
              {options.map((option) => {
                const checked = selectedSet.has(option.value)
                return (
                  <li key={option.value}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                        checked ? 'border-[#0095ff] bg-[#e6f4ff] text-info' : 'border-transparent hover:bg-primary-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(option.value)}
                        className="size-4 rounded border-[#d2d5db] accent-[#0095ff]"
                      />
                      <span>{option.label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
