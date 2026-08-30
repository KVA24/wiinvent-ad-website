import { Link } from '@/i18n/routing'

const BASE =
  'inline-flex items-center justify-center overflow-hidden ' +
  'transition-[transform,background-color,color,border-color] duration-[--duration-base] ' +
  'ease-[--ease-standard] hover:-translate-y-px active:translate-y-0 ' +
  'disabled:pointer-events-none disabled:opacity-60'

/* Hover colours per the Button component set: Filled darkens to the accent,
   Outline fades everything to #aeb6fb, the nav pill lightens one step. */
const VARIANTS = {
  primary: 'bg-primary-500 text-white hover:bg-accent',
  secondary: 'border-[1.5px] border-primary-500 text-links hover:border-[#aeb6fb] hover:text-[#aeb6fb]',
  nav: 'bg-primary-600 text-white hover:bg-primary-500',
} as const

/* Padding, radius and type per Figma: hero buttons are 24/16 at radius-lg,
   the inline "Tư vấn" button is 16/12 at radius 12, nav buttons are 12/6 at radius-md. */
const SIZES = {
  lg: 'px-6 py-4 rounded-lg type-btn-xl gap-0',
  sm: 'h-10 px-4 py-3 rounded-[12px] type-btn-md gap-0',
  nav: 'px-3 py-1.5 rounded-md type-s2 gap-1',
} as const

/* Masked so the glyph follows the text colour through hover. */
const ICONS = {
  primary: '/icon-arrow-right.svg',
  secondary: '/icon-arrow-right.svg',
  nav: '/icon-arrow-corner.svg',
} as const

type Props = {
  children: React.ReactNode
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  className?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  /** Trailing arrow, as drawn in Figma. Set false for buttons that have none. */
  icon?: boolean
}

export function Button({
  children, variant = 'primary', size = 'lg', className = '', href, onClick, icon = true, ...rest
}: Props) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  const iconSize = size === 'nav' ? 16 : 24
  const glyph = icon
    ? (
      <span
        aria-hidden
        className="mask-icon"
        style={{ width: iconSize, height: iconSize, maskImage: `url(${ICONS[variant]})`, WebkitMaskImage: `url(${ICONS[variant]})` }}
      />
    )
    : null
  /* Nav buttons lead with the corner arrow; the rest trail with a right arrow. */
  const body = size === 'nav'
    ? <>{glyph}<span>{children}</span></>
    : <><span className="px-2">{children}</span>{glyph}</>

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
        {body}
      </Link>
    )
  }
  return <button className={cls} onClick={onClick} {...rest}>{body}</button>
}
