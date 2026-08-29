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
| `formats/<slug>-thumb.png` | 640x360 |
| `formats/<slug>-<device>.png` | 800x600 |

Format slugs:
`leaderboard-banner`, `in-page-banner`, `side-banner`, `pause-banner`, `welcome-banner`, `welcome-tvc`, `pre-roll-instream`, `mid-roll-instream`, `post-roll-instream`

Device variants:
`mobile`, `pc`, `smart-tv`

## Exports Figma cannot produce

`get_design_context` returns a blank transparent PNG for these two layers, so
they must be exported by hand from Figma and dropped in over the placeholders:

| File | Figma node | What it should show |
|---|---|---|
| `stat-3.png` | `I2531:7876;2531:6623` | photo strip on the third statistics card |
| `stats-bg.png` | `2445:2684` background | grey arc pattern behind the statistics band |

Also still needed: `icon-android.svg` (the design reuses the iOS asset, so a
separate export is required) and the nine format thumbnails plus their
per-device media under `formats/`.

Missing files should not break layout; they may render as placeholders at the right aspect ratio until exports land.
