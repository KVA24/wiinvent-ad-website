import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'

/* Figma 2443:4402 "Section 5". Logo tiles are 189x58 at radius-lg with Ds 1.
   Add more entries here as partner logos are handed over. */
const CLIENTS = [{ src: '/clients/tv360.png', name: 'clients_tv360' }] as const

export function Clients() {
  const t = useTranslations()
  return (
    <section className="bg-white pt-10 xl:pt-[42px]">
      <Container className="flex flex-col items-center gap-8">
        <h2 className="type-h3 text-center text-accent">{t('clients_title')}</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CLIENTS.map(({ src, name }) => (
            <Image
              key={src}
              src={src}
              alt={t(name)}
              width={189}
              height={58}
              className="h-[58px] w-[189px] rounded-lg object-cover shadow-ds1"
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
