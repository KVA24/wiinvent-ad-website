import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export default function Link({
  children,
}: ComponentPropsWithoutRef<'a'> & { children?: ReactNode }) {
  return children ?? null
}
