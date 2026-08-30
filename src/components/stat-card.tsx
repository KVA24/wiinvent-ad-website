import Image from 'next/image'
import { CountUp } from '@/components/count-up'

/* Figma 2531:6663 — image strip on top, translucent white body beneath.
   The dictionary stores one string ("137M+ Ad impression/month"); the first
   word is the figure, the remainder is its label, exactly as designed. */
export function StatCard({ text, image }: { text: string; image: string }) {
  const space = text.indexOf(' ')
  const figure = space === -1 ? text : text.slice(0, space)
  const label = space === -1 ? '' : text.slice(space + 1)
  const digits = figure.match(/^(\d+)(.*)$/)

  return (
    <div className="stat-gradient-border group flex h-full w-full flex-col items-center overflow-hidden rounded-xl border-2 border-blue-200 bg-white shadow-card transition-colors duration-[--duration-base] md:flex-1 md:shrink-0 md:basis-0 md:self-stretch">
      <Image src={image} alt="" width={278} height={114} className="h-[114px] w-full object-cover" />
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-0.5 bg-white/70 px-2 pb-6 pt-4 text-center transition-colors duration-[--duration-base] group-hover:[background:linear-gradient(180deg,rgba(176,222,255,0.3),#fff)]">
        <p className="type-h4 text-accent">
          {digits
            ? <CountUp value={Number(digits[1])} suffix={digits[2]} />
            : figure}
        </p>
        <p className="type-s1 text-muted">{label}</p>
      </div>
    </div>
  )
}
