import { Link } from '@/i18n/routing'

const BASE =
  'inline-flex items-center justify-center rounded-full font-semibold ' +
  'transition-[transform,background-color,color] duration-[--duration-fast] ' +
  'ease-[--ease-standard] hover:-translate-y-px active:translate-y-0 ' +
  'disabled:pointer-events-none disabled:opacity-60'

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-brand bg-white text-brand hover:bg-brand-light',
  ghost: 'text-brand hover:bg-brand-light',
} as const

const SIZES = { sm: 'h-10 px-4 text-sm', md: 'h-12 px-6 text-base' } as const

type Props = {
  children: React.ReactNode
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  className?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  children, variant = 'primary', size = 'md', className = '', href, onClick, ...rest
}: Props) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (href) {
    const disabled = Boolean(rest.disabled)
    return (
      <Link
        href={href}
        className={cls}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={onClick || disabled ? (event) => {
          if (disabled) event.preventDefault()
          onClick?.()
        } : undefined}
      >
        {children}
      </Link>
    )
  }
  return <button className={cls} onClick={onClick} {...rest}>{children}</button>
}
