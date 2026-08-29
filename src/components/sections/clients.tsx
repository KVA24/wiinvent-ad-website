import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'

const clients = ['tv360.svg']

export function Clients() {
  const t = useTranslations()
  return (
    <section className="bg-surface-alt py-20">
      <Container>
        <h2 className="text-center text-3xl font-bold text-ink">{t('clients_title')}</h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-12">
          {clients.map((client) => <Image key={client} src={`/clients/${client}`} alt="" width={160} height={64} className="h-16 w-auto" />)}
        </div>
      </Container>
    </section>
  )
}
