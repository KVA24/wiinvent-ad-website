export type Device = 'mobile' | 'pc' | 'smart-tv'
export type FormatType = 'banner-standard' | 'welcome' | 'instream-video'

export type AdFormat = {
  slug: string
  key: string
  type: FormatType
  devices: Device[]
  media: Partial<Record<Device, string>>
}

const media = (slug: string, devices: Device[]) =>
  Object.fromEntries(devices.map((device) => [device, `/formats/${slug}-${device}.png`])) as Partial<
    Record<Device, string>
  >

const format = (slug: string, key: string, type: FormatType, devices: Device[]): AdFormat => ({
  slug,
  key,
  type,
  devices,
  media: media(slug, devices),
})

const ALL: Device[] = ['mobile', 'pc', 'smart-tv']

export const FORMATS: AdFormat[] = [
  format('leaderboard-banner', 'leaderboard_banner', 'banner-standard', ALL),
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
