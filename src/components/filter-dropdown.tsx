'use client'

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
      <button
        type="button"
        aria-expanded={open}
        className={`inline-flex h-12 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition-[border-color,background-color,color,transform] duration-[--duration-fast] hover:-translate-y-px ${
          active ? 'border-brand bg-brand-light text-brand' : 'border-slate-200 bg-white text-ink hover:border-brand/40'
        }`}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        {active ? <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{selected.length}</span> : null}
        <span aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: EASE.standard }}
            className="absolute right-0 top-full z-20 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg"
          >
            <ul className="space-y-2">
              {options.map((option) => {
                const checked = selectedSet.has(option.value)
                return (
                  <li key={option.value}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                        checked ? 'border-brand bg-brand-light text-brand' : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(option.value)}
                        className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
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
