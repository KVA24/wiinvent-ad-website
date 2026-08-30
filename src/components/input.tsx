import Image from 'next/image'

/* Figma I2448:7793;64:1261 — grey field with a leading glyph; the error state
   swaps to the red surface and shows helper text underneath. */
export function Input({
  name,
  label,
  placeholder,
  icon,
  required = false,
  error,
  type = 'text',
  as = 'input',
  ...field
}: {
  name: string
  label: string
  placeholder: string
  icon: string
  required?: boolean
  error?: string
  type?: string
  as?: 'input' | 'textarea'
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const Tag = as
  const describedBy = error ? `${name}-error` : undefined

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <label htmlFor={name} className="flex items-start gap-2">
        <span className="text-[16px] font-medium leading-6 text-ink">{label}</span>
        {required && <span className="text-[16px] font-medium leading-6 text-danger">*</span>}
      </label>

      <div
        className={`flex w-full gap-3 rounded border-[1.5px] p-3 transition-colors duration-[--duration-base] ${
          as === 'textarea' ? 'items-start' : 'items-center'
        } ${error ? 'border-danger bg-danger-surface' : 'border-grey-200 bg-grey-50'}`}
      >
        <Image src={icon} alt="" width={24} height={24} className="shrink-0" />
        <Tag
          id={name}
          name={name}
          type={as === 'input' ? type : undefined}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          rows={as === 'textarea' ? 3 : undefined}
          className="min-w-0 flex-1 resize-none bg-transparent text-[16px] leading-6 text-ink outline-none placeholder:text-text-grey"
          {...field}
        />
      </div>

      {error && (
        <p id={describedBy} role="alert" className="text-[14px] leading-5 text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
