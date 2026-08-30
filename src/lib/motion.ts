export const DURATION = { fast: 0.15, base: 0.3, slow: 0.4, entrance: 0.6 } as const
export const EASE = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const
export const REVEAL_DISTANCE = 24
export const STAGGER = 0.06

type Transition = {
  duration?: number
  staggerChildren?: number
  ease?: readonly number[]
}
type Variant = { opacity?: number; y?: number; transition?: Transition }
type RevealVariants = { hidden: Variant; visible: Variant & { transition: Transition & { duration: number } } }
type ContainerVariants = { hidden: Variant; visible: Variant & { transition: Transition & { staggerChildren: number } } }
export type Variants = RevealVariants | ContainerVariants

export function revealVariants(reduced: false): RevealVariants
export function revealVariants(reduced: true): RevealVariants
export function revealVariants(reduced: boolean): Variants
export function revealVariants(reduced: boolean): Variants {
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

export function staggerContainer(reduced: false): ContainerVariants
export function staggerContainer(reduced: true): ContainerVariants
export function staggerContainer(reduced: boolean): Variants
export function staggerContainer(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : STAGGER } },
  }
}
