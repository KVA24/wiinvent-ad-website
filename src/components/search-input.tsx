'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/routing'

function updateQuery(pathname: string, current: string, value: string) {
  const next = new URLSearchParams(current)
  if (value) next.set('q', value)
  else next.delete('q')
  return `${pathname}${next.toString() ? `?${next.toString()}` : ''}`
}

/* Figma 2633:5705 — thin blue outline, 10px label, trailing magnifier. */
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
    <label className="flex w-full max-w-[350px] items-center justify-between gap-2 rounded-[10px] border border-[#0095ff] bg-white px-2 py-1 transition-shadow duration-[--duration-fast] focus-within:shadow-[0_0_0_3px_rgba(0,149,255,0.15)]">
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-[family-name:var(--font-heading)] text-[10px] font-semibold leading-[14px] text-accent outline-none placeholder:text-accent"
      />
      <Image src="/icon-search.svg" alt="" width={24} height={24} className="shrink-0" />
    </label>
  )
}
