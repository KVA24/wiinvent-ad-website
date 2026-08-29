import { describe, expect, it } from 'vitest'
import { buildMetadata, SITE_URL } from './seo'

describe('buildMetadata', () => {
  const meta = buildMetadata({
    locale: 'vi',
    path: '/formats',
    title: 'Định dạng',
    description: 'Danh sách định dạng',
  })

  it('sets a canonical without query parameters', () => {
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/vi/formats`)
  })

  it('declares both locales plus x-default', () => {
    expect(meta.alternates?.languages).toEqual({
      vi: `${SITE_URL}/vi/formats`,
      en: `${SITE_URL}/en/formats`,
      'x-default': `${SITE_URL}/vi/formats`,
    })
  })

  it('mirrors the title into open graph', () => {
    expect(meta.openGraph?.title).toBe('Định dạng')
  })
})
