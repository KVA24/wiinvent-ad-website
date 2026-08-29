'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/routing'

function updateQuery(pathname: string, current: string, value: string) {
  const next = new URLSearchParams(current)
  if (value) next.set('q', value)
  else next.delete('q')
  return `${pathname}${next.toString() ? `?${next.toString()}` : ''}`
}

export function SearchInput({ value, placeholder }: { value: string; placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [draft, setDraft] = useState(value)

  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draft === value) return
      router.replace(updateQuery(pathname, window.location.search, draft), { scroll: false })
    }, 250)
    return () => window.clearTimeout(id)
  }, [draft, pathname, router, value])

  return (
    <label className="relative block w-full max-w-md">
      <span className="sr-only">{placeholder}</span>
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted" aria-hidden="true">
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-[1.75]">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M12.5 12.5L17 17" />
        </svg>
      </span>
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-[--duration-fast] placeholder:text-muted hover:border-brand/40 focus:border-brand focus:shadow-[0_0_0_3px_rgba(24,75,170,0.12)]"
      />
    </label>
  )
}
