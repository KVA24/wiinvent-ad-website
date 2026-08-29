import { CountUp } from '@/components/count-up'

export function StatCard({ text }: { text: string }) {
  const match = text.match(/^(\d+)(\D.*)$/)
  if (!match) return <p>{text}</p>
  const [, digits, rest] = match
  return (
    <p className="text-4xl font-bold text-brand">
      <CountUp value={Number(digits)} suffix={rest} />
    </p>
  )
}
