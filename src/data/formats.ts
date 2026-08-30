export type Device = 'mobile' | 'pc' | 'smart-tv'
export type FormatType = 'banner-standard' | 'welcome' | 'instream-video'

export type AdFormat = {
  slug: string
  key: string
  type: FormatType
  devices: Device[]
  media: Partial<Record<Device, string>>
  /* Creative requirements shown on the detail page. Technical values, so they
     read the same in both locales. Only Leaderboard Banner is specified in the
     design; the rest are pending from the business analyst. */
  specs?: string[]
  tracking?: string
}

/* Per-format captures live at /formats/<slug>-<device>.png. Combinations the
   designer has not handed over yet fall back to the shared per-device capture;
   drop the new file in and add it here when one lands. */
const SHARED_MEDIA: Record<Device, string> = {
  mobile: '/formats/demo-mobile.png',
  pc: '/formats/demo-pc.png',
  'smart-tv': '/formats/demo-tv.png',
}

const AVAILABLE = new Set([
  'leaderboard-banner-mobile',
  'leaderboard-banner-pc',
  'leaderboard-banner-smart-tv',
  'in-page-banner-mobile',
  'in-page-banner-pc',
  'side-banner-pc',
  'pause-banner-mobile',
  'pause-banner-smart-tv',
  'welcome-tvc-smart-tv',
  'pre-roll-instream-mobile',
  'pre-roll-instream-smart-tv',
  'mid-roll-instream-mobile',
  'mid-roll-instream-smart-tv',
  'post-roll-instream-mobile',
  'post-roll-instream-smart-tv',
])

const media = (slug: string, devices: Device[]) =>
  Object.fromEntries(
    devices.map((device) => [
      device,
      AVAILABLE.has(`${slug}-${device}`) ? `/formats/${slug}-${device}.png` : SHARED_MEDIA[device],
    ]),
  ) as Partial<Record<Device, string>>

const format = (slug: string, key: string, type: FormatType, devices: Device[]): AdFormat => ({
  slug,
  key,
  type,
  devices,
  media: media(slug, devices),
})

const ALL: Device[] = ['mobile', 'pc', 'smart-tv']

export const FORMATS: AdFormat[] = [
  {
    ...format('leaderboard-banner', 'leaderboard_banner', 'banner-standard', ALL),
    specs: [
      'Format: JPG, PNG, GIF, HTML5',
      'Resolution - Desktop: 970x250',
      'Resolution - Mobile: 970x250',
      'Resolution - TV: 970x250',
      'Size: <10MB',
    ],
    tracking: 'Tracking Metrics: Impression/ Click/ View',
  },
  format('in-page-banner', 'in_page_banner', 'banner-standard', ALL),
  format('side-banner', 'side_banner', 'banner-standard', ['pc']),
  format('pause-banner', 'pause_banner', 'banner-standard', ALL),
  format('welcome-banner', 'welcome_banner', 'welcome', ALL),
  format('welcome-tvc', 'welcome_tvc', 'welcome', ['mobile', 'smart-tv']),
  format('pre-roll-instream', 'pre_roll_instream', 'instream-video', ALL),
  format('mid-roll-instream', 'mid_roll_instream', 'instream-video', ALL),
  format('post-roll-instream', 'post_roll_instream', 'instream-video', ALL),
]

export const getFormat = (slug: string) => FORMATS.find((format) => format.slug === slug)
