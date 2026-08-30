# Public Asset Manifest

Export these from Figma into `public/`:

| File | Size |
|---|---:|
| `logo.svg` | vector |
| `favicon.ico` | 32x32 |
| `og-default.png` | 1200x630 |
| `icon-ios.svg` | vector |
| `icon-android.svg` | vector |
| `icon-smart-tv.svg` | vector |
| `icon-tv-box.svg` | vector |
| `icon-web.svg` | vector |
| `hero-devices.png` | 800x600 |
| `stats-bg.png` | 1200x500 |
| `advantages.png` | 800x600 |
| `contact-illustration.png` | 800x500 |
| `contact-banner.png` | 1200x500 |
| `sdk-hero.png` | 1200x800 |
| `sdk-code.png` | 1200x600 |
| `clients/tv360.svg` | vector |
| `formats/demo-mobile.png` | 387x4096 scrolling capture, shared by every format until per-format media lands |
| `formats/demo-pc.png` | 485x804 scrolling capture for the laptop frame |
| `formats/demo-tv.png` | 485x804 scrolling capture for the TV frame |
| `pc-chassis.png` | MacBook body from Figma node `3031:7677` — drawn in CSS until this exports |
| `formats/<slug>-<device>.png` | per-format media, pending from the business analyst |

Format slugs:
`leaderboard-banner`, `in-page-banner`, `side-banner`, `pause-banner`, `welcome-banner`, `welcome-tvc`, `pre-roll-instream`, `mid-roll-instream`, `post-roll-instream`

Device variants:
`mobile`, `pc`, `smart-tv`

## Exports Figma cannot produce

`get_design_context` returns a blank transparent PNG for this layer, so it was
redrawn by hand. Replace it if the real export can ever be produced:

| File | Figma node | What it should show |
|---|---|---|
| `stats-bg.png` | `2445:2684` background | grey arc pattern behind the statistics band — currently redrawn from the Figma render; replace when the real export can be produced |

Also still needed: `icon-android.svg` (the design reuses the iOS asset, so a
separate export is required) and the per-device format media under `formats/`.
Card thumbnails are not needed: the design draws each format as a device
skeleton, which `src/components/format-preview.tsx` reproduces in markup.

Missing files should not break layout; they may render as placeholders at the right aspect ratio until exports land.
