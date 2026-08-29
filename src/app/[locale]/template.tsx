'use client'

import { m } from 'motion/react'
import { DURATION } from '@/lib/motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DURATION.base }}>{children}</m.div>
}
