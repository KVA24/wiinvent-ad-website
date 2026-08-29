'use client'

type Props = {
  name: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ name, label, checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-3 text-sm text-ink">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
      />
      <span>{label}</span>
    </label>
  )
}
