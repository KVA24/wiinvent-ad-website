import Image from 'next/image'

/* Figma 78:1477 — 24px tile, filled brand blue when selected. */
export function Checkbox({
  name,
  label,
  checked,
  onChange,
}: {
  name: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-center gap-4">
      <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[3px]">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className={`absolute inset-0 rounded-[3px] border-[1.5px] transition-colors duration-[--duration-fast] ${
            checked ? 'border-primary-500 bg-primary-500' : 'border-grey-200 bg-grey-50'
          } peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/40`}
        />
        {checked && <Image src="/icon-check.svg" alt="" width={20} height={20} className="relative" />}
      </span>
      <span className="min-w-0 flex-1 text-[14px] leading-4 text-ink">{label}</span>
    </label>
  )
}
