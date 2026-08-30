import Image from 'next/image'
import type { AdFormat } from '@/data/formats'

/* Figma 2675:6468 — the cards draw each format as a device skeleton rather
   than shipping a screenshot, so there is nothing to export for them. */

const FRAME =
  'flex w-[122px] flex-1 flex-col items-center rounded-lg border-2 border-[#e5e7ea] bg-[#f3f4f6] ' +
  'drop-shadow-[2px_4px_1.5px_rgba(0,0,0,0.2)]'

function Bar({ height, color = '#d2d5db' }: { height: number; color?: string }) {
  return <div className="w-full shrink-0 rounded-[3px]" style={{ height, background: color }} />
}

function Play({ size = 44 }: { size?: number }) {
  return <Image src="/icon-play.svg" alt="" width={size} height={Math.round(size * 0.854)} />
}

function SkipBadge() {
  return (
    <span className="absolute bottom-[2px] right-[2px] flex items-center rounded-[4px] border-[0.45px] border-blue-200 bg-white px-1 py-px">
      <span className="text-[6px] font-medium leading-[10px] text-blue-200">Skip</span>
      <Image src="/icon-skip.svg" alt="" width={8} height={8} />
    </span>
  )
}

function InstreamPreview() {
  return (
    <div className={`${FRAME} justify-center gap-1.5 px-2 py-[18px]`}>
      <div className="relative flex h-14 w-[109px] shrink-0 items-center justify-center rounded-[3px] bg-[rgba(139,206,255,0.5)]">
        <Play size={45} />
        <SkipBadge />
      </div>
      <div className="flex w-[109px] flex-col gap-[3px]">
        <Bar height={26} />
        <Bar height={26} />
        <Bar height={26} />
      </div>
    </div>
  )
}

function WelcomePreview({ withPlay }: { withPlay: boolean }) {
  return (
    <div className={`${FRAME} justify-center gap-3 px-1.5 py-2`}>
      <div className="relative flex w-full flex-1 flex-col justify-center gap-1 rounded-lg bg-[#bfe1fb] px-1.5 py-2">
        {[0, 1, 2, 3].map((index) => (
          <Bar key={index} height={12} color="rgba(255,255,255,0.6)" />
        ))}
        {withPlay && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Play size={44} />
          </span>
        )}
        <Image src="/icon-cancel.svg" alt="" width={24} height={24} className="absolute right-[9px] top-[10px]" />
      </div>
    </div>
  )
}

export function FormatPreview({ format }: { format: AdFormat }) {
  const body = (() => {
    switch (format.slug) {
      case 'leaderboard-banner':
        return (
          <div className={`${FRAME} justify-center gap-[3px] p-3`}>
            <Bar height={26} />
            <Bar height={26} />
            <Bar height={13} color="#8aceff" />
            <Bar height={26} />
            <Bar height={26} />
          </div>
        )
      case 'in-page-banner':
        return (
          <div className={`${FRAME} justify-center gap-1.5 p-3`}>
            <div className="flex h-[57px] w-full shrink-0 items-center justify-center rounded-[3px] bg-[#d2d5db]">
              <Play />
            </div>
            <Bar height={20} />
            <Bar height={20} />
          </div>
        )
      case 'side-banner':
        return (
          <div className={`${FRAME} flex-row items-stretch justify-center gap-1 px-1.5 py-3`}>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex h-[57px] items-center justify-center rounded-[3px] bg-[#d2d5db]">
                <Play size={38} />
              </div>
              <Bar height={20} />
            </div>
            <div className="flex w-[17px] flex-col gap-1">
              <Bar height={44} color="#8aceff" />
              <Bar height={33} />
            </div>
          </div>
        )
      case 'pause-banner':
        return (
          <div className={`${FRAME} gap-1.5 rounded-md px-2 py-[18px]`}>
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-1 rounded-[3px] bg-[#d2d5db] px-2 py-3">
              <Play />
              <Bar height={13} color="#8aceff" />
            </div>
            <div className="flex w-full flex-1 flex-col gap-1">
              <Bar height={16} />
              <Bar height={16} />
              <Bar height={16} />
            </div>
          </div>
        )
      case 'welcome-banner':
        return <WelcomePreview withPlay={false} />
      case 'welcome-tvc':
        return <WelcomePreview withPlay />
      default:
        return <InstreamPreview />
    }
  })()

  return (
    // Style=Hover swaps the grey wash for the aeb6fb -> 212967 gradient.
    <div className="flex h-[212px] w-full flex-col items-center justify-between rounded-[12px] bg-gradient-to-b from-[#efefef] to-[#ddd] px-8 py-6 transition-[--tw-gradient-from,--tw-gradient-to] duration-[--duration-base] group-hover:from-[#aeb6fb] group-hover:to-[#212967]">
      {body}
    </div>
  )
}
