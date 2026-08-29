'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import { Input } from '@/components/input'
import { NotificationDialog } from '@/components/notification-dialog'
import { contactSchema, type ContactInput } from '@/lib/contact-schema'

type DialogState = { open: boolean; state: 'success' | 'error' }

export function ContactForm() {
  const t = useTranslations()
  const formRef = useRef<HTMLFormElement>(null)
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema) as never,
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      company: '',
      website: '',
      message: '',
      consent: false,
    },
  })

  const closeDialog = () => {
    setDialog(null)
    requestAnimationFrame(() => {
      ;(formRef.current?.querySelector('[type="submit"]') as HTMLButtonElement | null)?.focus()
    })
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json().catch(() => null)

      if (response.ok && data?.ok) {
        reset()
        setDialog({ open: true, state: 'success' })
        return
      }

      if (response.status === 400 && data?.errors) {
        for (const [field, message] of Object.entries(data.errors as Record<string, string>)) {
          setError(field as keyof ContactInput, { type: 'server', message })
        }
      }

      setDialog({ open: true, state: 'error' })
    } catch {
      setDialog({ open: true, state: 'error' })
    }
  })

  const errorText = (message?: string) => (message ? t(message as never) : undefined)

  return (
    <>
      <form ref={formRef} className="flex w-full flex-col gap-8" onSubmit={onSubmit}>
        {/* Figma 2448:7792 — one column, 20px between fields. */}
        <div className="flex w-full flex-col items-start gap-5">
          <Input
            {...register('fullName')}
            name="fullName"
            icon="/icon-field-name.svg"
            label={t('field_full_name')}
            placeholder={t('field_full_name_placeholder')}
            required
            error={errorText(errors.fullName?.message)}
          />
          <Input
            {...register('phone')}
            name="phone"
            icon="/icon-field-phone.svg"
            label={t('field_phone')}
            placeholder={t('field_phone_placeholder')}
            required
            type="tel"
            error={errorText(errors.phone?.message)}
          />
          <Input
            {...register('email')}
            name="email"
            icon="/icon-field-email.svg"
            label={t('field_email')}
            placeholder={t('field_email_placeholder')}
            required
            type="email"
            error={errorText(errors.email?.message)}
          />
          <Input
            {...register('company')}
            name="company"
            icon="/icon-field-company.svg"
            label={t('field_company')}
            placeholder={t('field_company_placeholder')}
            required
            error={errorText(errors.company?.message)}
          />
          <Input
            {...register('website')}
            name="website"
            icon="/icon-field-website.svg"
            label={t('field_website')}
            placeholder={t('field_website_placeholder')}
            type="url"
            error={errorText(errors.website?.message)}
          />
          <Input
            {...register('message')}
            name="message"
            icon="/icon-field-name.svg"
            label={t('field_message')}
            placeholder={t('field_message_placeholder')}
            as="textarea"
            error={errorText(errors.message?.message)}
          />
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-[22px]">
          <Checkbox
            name="consent"
            label={t('field_consent')}
            checked={watch('consent')}
            onChange={(checked) => setValue('consent', checked, { shouldDirty: true })}
          />
          <Button type="submit" size="sm" disabled={isSubmitting} className="rounded-md">
            {t('form_submit')}
          </Button>
        </div>
      </form>
      <NotificationDialog
        open={Boolean(dialog)}
        state={dialog?.state ?? 'success'}
        title={dialog?.state === 'success' ? t('success_title') : t('error_title')}
        body={dialog?.state === 'success' ? t('success_body') : t('error_body')}
        closing={dialog?.state === 'success' ? t('success_closing') : t('error_closing')}
        closeLabel={t('dialog_close')}
        onClose={closeDialog}
      />
    </>
  )
}
