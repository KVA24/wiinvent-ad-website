'use client'

import { m, useReducedMotion, type Variants } from 'motion/react'
import { revealVariants } from '@/lib/motion'

export function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'li'
}) {
  const reduced = useReducedMotion() ?? false
  const Tag = m[as]
  return (
    <Tag
      data-reveal
      className={className}
      variants={revealVariants(reduced) as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {children}
    </Tag>
  )
}
