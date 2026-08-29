/* Figma sections are full-bleed: 72px inset on the 1440 frame, 36px on the
   768 frame (which is what lets three format cards sit in a row there) and
   24px on the 375 frame. */
export function Container({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`w-full px-6 md:px-9 xl:px-[72px] ${className}`}>{children}</div>
}
