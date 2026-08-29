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

type DialogState = { open: boolean; state: 'success' | 'error'; size: 'big' | 'small' }

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
        setDialog({ open: true, state: 'success', size: 'big' })
        return
      }

      if (response.status === 400 && data?.errors) {
        for (const [field, message] of Object.entries(data.errors as Record<string, string>)) {
          setError(field as keyof ContactInput, { type: 'server', message })
        }
      }

      setDialog({ open: true, state: 'error', size: 'small' })
    } catch {
      setDialog({ open: true, state: 'error', size: 'small' })
    }
  })

  const errorText = (message?: string) => (message ? t(message as never) : undefined)

  return (
    <>
      <form ref={formRef} className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            {...register('fullName')}
            name="fullName"
            label={t('field_full_name')}
            placeholder={t('field_full_name_placeholder')}
            required
            error={errorText(errors.fullName?.message)}
          />
          <Input
            {...register('phone')}
            name="phone"
            label={t('field_phone')}
            placeholder={t('field_phone_placeholder')}
            required
            type="tel"
            error={errorText(errors.phone?.message)}
          />
          <Input
            {...register('email')}
            name="email"
            label={t('field_email')}
            placeholder={t('field_email_placeholder')}
            required
            type="email"
            error={errorText(errors.email?.message)}
          />
          <Input
            {...register('company')}
            name="company"
            label={t('field_company')}
            placeholder={t('field_company_placeholder')}
            required
            error={errorText(errors.company?.message)}
          />
        </div>
        <Input
          {...register('website')}
          name="website"
          label={t('field_website')}
          placeholder={t('field_website_placeholder')}
          type="url"
          error={errorText(errors.website?.message)}
        />
        <Input
          {...register('message')}
          name="message"
          label={t('field_message')}
          placeholder={t('field_message_placeholder')}
          as="textarea"
          error={errorText(errors.message?.message)}
        />
        <Checkbox
          name="consent"
          label={t('field_consent')}
          checked={watch('consent')}
          onChange={(checked) => setValue('consent', checked, { shouldDirty: true })}
        />
        <Button type="submit" disabled={isSubmitting}>
          {t('form_submit')}
        </Button>
      </form>
      <NotificationDialog
        open={Boolean(dialog)}
        state={dialog?.state ?? 'success'}
        size={dialog?.size ?? 'small'}
        title={dialog?.state === 'success' ? t('success_title') : t('error_title')}
        closeLabel={t('dialog_close')}
        onClose={closeDialog}
      />
    </>
  )
}
