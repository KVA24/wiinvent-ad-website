import { describe, expect, it, vi } from 'vitest'

vi.mock('next-intl/routing', () => ({
  defineRouting: (config: unknown) => config,
}))

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    Link: () => null,
    redirect: () => {},
    usePathname: () => '/',
    useRouter: () => ({}),
    getPathname: () => '/',
  }),
}))

import { routing } from './routing'

describe('routing', () => {
  it('supports exactly vi and en', () => {
    expect(routing.locales).toEqual(['vi', 'en'])
  })

  it('defaults to vi', () => {
    expect(routing.defaultLocale).toBe('vi')
  })

  it('always prefixes the locale so /vi and /en both exist', () => {
    expect(routing.localePrefix).toBe('always')
  })
})
