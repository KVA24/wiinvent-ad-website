'use client'

import { forwardRef, type ForwardedRef } from 'react'

type BaseProps = {
  name: string
  label: string
  placeholder: string
  required?: boolean
  error?: string
  as?: 'input' | 'textarea'
  type?: string
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, BaseProps>(
  function Input({ name, label, placeholder, required, error, as = 'input', type = 'text' }, ref) {
    const id = name
    const errorId = error ? `${id}-error` : undefined
    const fieldClass =
      'w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-[--duration-fast] placeholder:text-muted focus:shadow-[0_0_0_3px_rgba(24,75,170,0.12)]'
    const borderClass = error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-brand/40 focus:border-brand'

    return (
      <label htmlFor={id} className="block space-y-2">
        <span className="text-sm font-semibold text-ink">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </span>
        {as === 'textarea' ? (
          <textarea
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            id={id}
            name={name}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            rows={5}
            className={`${fieldClass} ${borderClass} min-h-32 resize-y`}
          />
        ) : (
          <input
            ref={ref as ForwardedRef<HTMLInputElement>}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className={`${fieldClass} ${borderClass}`}
          />
        )}
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </label>
    )
  },
)
