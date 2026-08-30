/* Figma 2995:8609 — every tile is 60x60, but each glyph keeps its own drawn
   size inside it (2497:8132, 2513:5255, 2531:6581, 2675:6789). Stretching them
   all to 60x60 distorts the Apple mark, which is taller than it is wide. */
export const PLATFORMS = [
  { key: 'platform_ios', icon: '/icon-ios.svg', width: 34, height: 41 },
  /* Placeholder mark, drawn 42x24; keep that ratio so it is not stretched. */
  { key: 'platform_android', icon: '/icon-android.svg', width: 44, height: 25 },
  { key: 'platform_smart_tv', icon: '/icon-smart-tv.svg', width: 44, height: 44 },
  { key: 'platform_tv_box', icon: '/icon-tv-box.svg', width: 46, height: 46 },
  { key: 'platform_web', icon: '/icon-web.svg', width: 46, height: 46 },
] as const
