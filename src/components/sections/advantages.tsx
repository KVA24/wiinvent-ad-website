import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Accordion } from '@/components/accordion'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

export function Advantages() {
  const t = useTranslations()
  const items = Array.from({ length: 6 }, (_, index) => {
    const id = String(index + 1).padStart(2, '0')
    return { id, title: t(`advantage_${id}`), body: t(`accordion_${id}`) }
  })
  return (
    <section className="bg-white py-20">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <Reveal className="relative min-h-72 md:order-2 md:min-h-[420px]">
          <Image src="/advantages.png" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </Reveal>
        <Reveal className="md:order-1">
          <Accordion items={items} />
        </Reveal>
      </Container>
    </section>
  )
}
