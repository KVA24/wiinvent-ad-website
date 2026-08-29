export const DURATION = { fast: 0.15, base: 0.25, slow: 0.4, entrance: 0.6 } as const
export const EASE = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const
export const REVEAL_DISTANCE = 24
export const STAGGER = 0.06

type Variant = { opacity: number; y: number; transition?: Record<string, unknown> }
export type Variants = { hidden: Variant; visible: Variant & { transition: { duration: number } } }

export function revealVariants(reduced: boolean) {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0, transition: { duration: 0 } },
    }
  }
  return {
    hidden: { opacity: 0, y: REVEAL_DISTANCE },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.entrance, ease: EASE.standard },
    },
  }
}

export function staggerContainer(reduced: boolean) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : STAGGER } },
  }
}
