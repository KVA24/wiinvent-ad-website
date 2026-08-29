'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { DURATION } from '@/lib/motion'

export function CountUp({ value, prefix = '', suffix }: { value: number; prefix?: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion() ?? false
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!inView || reduced) return
    const ms = DURATION.entrance * 1000 * 2
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1)
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setDisplay(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value])

  return (
    <span ref={ref} data-reveal>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
