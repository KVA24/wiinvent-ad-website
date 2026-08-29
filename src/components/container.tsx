/* Figma sections are full-bleed with a 72px horizontal inset on desktop
   (Home_Desk 2406:2828) and 24px on the 375px mobile frame. */
export function Container({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`w-full px-6 md:px-10 xl:px-[72px] ${className}`}>{children}</div>
}
