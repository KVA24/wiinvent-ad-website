import { describe, expect, it } from 'vitest'
import { FORMATS } from '@/data/formats'
import { filterFormats } from './filter-formats'

const nameOf = (f: { slug: string }) =>
  f.slug
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')

const q = (over: Partial<Parameters<typeof filterFormats>[1]> = {}) => ({
  devices: [],
  types: [],
  search: '',
  ...over,
})

describe('filterFormats', () => {
  it('returns everything when nothing is selected', () => {
    expect(filterFormats(FORMATS, q(), nameOf)).toHaveLength(9)
  })

  it('treats values inside one group as OR', () => {
    const result = filterFormats(FORMATS, q({ devices: ['mobile', 'pc'] }), nameOf)
    expect(result).toHaveLength(9)
  })

  it('excludes formats that support none of the selected devices', () => {
    const result = filterFormats(FORMATS, q({ devices: ['smart-tv'] }), nameOf)
    expect(result.map((format) => format.slug)).not.toContain('side-banner')
  })

  it('treats separate groups as AND', () => {
    const result = filterFormats(
      FORMATS,
      q({ devices: ['mobile'], types: ['banner-standard'] }),
      nameOf,
    )
    expect(result.map((format) => format.slug)).toEqual([
      'leaderboard-banner',
      'in-page-banner',
      'pause-banner',
    ])
  })

  it('combines search with filters using AND', () => {
    const result = filterFormats(FORMATS, q({ types: ['instream-video'], search: 'pre' }), nameOf)
    expect(result.map((format) => format.slug)).toEqual(['pre-roll-instream'])
  })

  it('ignores case and Vietnamese diacritics in search', () => {
    expect(filterFormats(FORMATS, q({ search: 'BANNER' }), nameOf).length).toBeGreaterThan(0)
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterFormats(FORMATS, q({ devices: ['pc'], search: 'welcome tvc' }), nameOf)).toEqual(
      [],
    )
  })
})
