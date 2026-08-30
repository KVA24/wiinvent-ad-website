'use client'

import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/* Keyframes below are transcribed from the Figma prototype via
   get_motion_context; the node id is noted at each call site. */

type Keyframes = { x?: number[]; y?: number[] }

/** Continuous linear drift, restarting from the top. Home hexagon patterns. */
export function DriftLoop({
  children,
  className,
  keyframes,
  times,
  duration,
}: {
  children: ReactNode
  className?: string
  keyframes: Keyframes
  times: number[]
  duration: number
}) {
  const reduced = useReducedMotion() ?? false
  if (reduced) return <div className={className}>{children}</div>

  return (
    <m.div
      className={className}
      animate={keyframes}
      transition={Object.fromEntries(
        Object.keys(keyframes).map((axis) => [
          axis,
          { duration, times, ease: 'linear', repeat: Infinity },
        ]),
      )}
    >
      {children}
    </m.div>
  )
}

/** Drift that plays forwards then backwards for ever. SDK diagram pieces. */
export function FloatLoop({
  children,
  className,
  keyframes,
  times,
  duration,
  ease = 'easeOut',
}: {
  children: ReactNode
  className?: string
  keyframes: Keyframes
  times: number[]
  duration: number
  ease?: 'easeOut' | 'linear'
}) {
  const reduced = useReducedMotion() ?? false
  if (reduced) return <div className={className}>{children}</div>

  return (
    <m.div
      className={className}
      initial={Object.fromEntries(Object.entries(keyframes).map(([axis, values]) => [axis, values[0]]))}
      animate={keyframes}
      transition={Object.fromEntries(
        Object.keys(keyframes).map((axis) => [
          axis,
          { duration, times, ease, repeat: Infinity, repeatType: 'reverse' as const },
        ]),
      )}
    >
      {children}
    </m.div>
  )
}

/** One-shot entrance from an offset. Demo, detail and contact heroes. */
export function SlideIn({
  children,
  className,
  from,
  duration = 2,
}: {
  children: ReactNode
  className?: string
  from: Keyframes
  duration?: number
}) {
  const reduced = useReducedMotion() ?? false
  if (reduced) return <div className={className}>{children}</div>

  return (
    <m.div
      className={className}
      initial={{ x: from.x?.[0] ?? 0, y: from.y?.[0] ?? 0 }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: duration * 0.3, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}
