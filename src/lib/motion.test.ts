import { describe, expect, it } from 'vitest'
import { revealVariants, staggerContainer, DURATION, REVEAL_DISTANCE } from './motion'

describe('revealVariants', () => {
  it('moves and fades when motion is allowed', () => {
    const v = revealVariants(false)
    expect(v.hidden).toMatchObject({ opacity: 0, y: REVEAL_DISTANCE })
    expect(v.visible).toMatchObject({ opacity: 1, y: 0 })
    expect(v.visible.transition.duration).toBe(DURATION.entrance)
  })

  it('collapses to an instant no-op when reduced motion is requested', () => {
    const v = revealVariants(true)
    expect(v.hidden).toMatchObject({ opacity: 1, y: 0 })
    expect(v.visible).toMatchObject({ opacity: 1, y: 0 })
    expect(v.visible.transition.duration).toBe(0)
  })
})

describe('staggerContainer', () => {
  it('staggers children when motion is allowed', () => {
    expect(staggerContainer(false).visible.transition.staggerChildren).toBeGreaterThan(0)
  })

  it('does not stagger under reduced motion', () => {
    expect(staggerContainer(true).visible.transition.staggerChildren).toBe(0)
  })
})
