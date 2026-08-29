'use client'

import { m, useReducedMotion, type Variants } from 'motion/react'
import { revealVariants, staggerContainer } from '@/lib/motion'

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false
  return (
    <m.div
      data-reveal
      className={className}
      variants={staggerContainer(reduced) as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false
  return (
    <m.div data-reveal className={className} variants={revealVariants(reduced) as Variants}>
      {children}
    </m.div>
  )
}
