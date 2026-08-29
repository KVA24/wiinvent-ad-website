import { z } from 'zod'

const PHONE = /^(0\d{9,11}|\+84\d{8,9})$/

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'error_full_name'),
  phone: z.string().trim().regex(PHONE, 'error_phone'),
  email: z.string().trim().min(5, 'error_email').email('error_email'),
  company: z.string().trim().min(2, 'error_company'),
  website: z.preprocess(
    (value) => value ?? '',
    z.union([z.literal(''), z.string().trim().url('error_website')]),
  ),
  message: z.string().trim().max(2000).optional().default(''),
  consent: z.boolean().default(false),
})

export type ContactInput = z.infer<typeof contactSchema>
