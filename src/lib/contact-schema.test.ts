import { describe, expect, it } from 'vitest'
import { contactSchema } from './contact-schema'

const valid = {
  fullName: 'Nguyễn Văn A',
  phone: '0912345678',
  email: 'a@company.vn',
  company: 'Wiinvent',
  website: '',
  message: '',
  consent: false,
}

describe('contactSchema', () => {
  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it.each(['0912345678', '091234567890', '+84912345678'])('accepts phone %s', (phone) => {
    expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(true)
  })

  it.each(['091234', '0912345678901234', '84912345678', 'abcdefghij'])(
    'rejects phone %s',
    (phone) => {
      expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(false)
    },
  )

  it('rejects a missing full name', () => {
    expect(contactSchema.safeParse({ ...valid, fullName: 'A' }).success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
  })

  it('accepts an empty website but rejects a malformed one', () => {
    expect(contactSchema.safeParse({ ...valid, website: '' }).success).toBe(true)
    expect(contactSchema.safeParse({ ...valid, website: undefined }).success).toBe(true)
    expect(contactSchema.safeParse({ ...valid, website: 'ht!tp:/x' }).success).toBe(false)
  })

  it('reports errors as translation keys', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'nope' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('error_email')
    }
  })
})
