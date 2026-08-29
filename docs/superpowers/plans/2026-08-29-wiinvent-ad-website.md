# Wiinvent Ad Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (VI/EN), fully SEO-optimized Next.js marketing site for Wiinvent's digital advertising platform, with 5 page types and motion throughout.

**Architecture:** Next.js 15 App Router, everything statically generated at build time except one contact API route. Content lives in the repo as `next-intl` JSON dictionaries plus one typed data file describing the 9 ad formats. Locale is a URL prefix (`/vi`, `/en`). Animation uses `motion` loaded lazily, driven by a shared token file so CSS and JS agree.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, next-intl, motion (framer-motion), react-hook-form, zod, vitest, Docker (node:22-alpine, `output: 'standalone'`).

**Spec:** `docs/superpowers/specs/2026-08-29-wiinvent-ad-website-design.md`

**Design source:** Figma file key `eK9ZSi25mM9lcukNHZ816m`, page `172:8075`. Node ids are given per task. The Figma MCP server is currently rate-limited on the Starter plan — if `get_design_context` fails, build from the structure described in the task and leave visual polish for a follow-up pass. Do not block on it.

## Global Constraints

- Node 22. Next.js 15 App Router. TypeScript strict mode on.
- Locales are exactly `vi` and `en`. Both are URL-prefixed. `/` redirects to `/vi`. Default locale for content fallback is `vi`.
- All pages are statically generated. The only dynamic route is `POST /api/contact`.
- No CMS, no authentication, no analytics/tracking, no email-marketing integration. Do not add them.
- All user-visible copy comes from `messages/vi.json` / `messages/en.json`. Never hardcode Vietnamese or English strings in components.
- Statistics render exactly as written: VI `137M+ Ad impression/month`, `10+ Advertiser`, `5M+ UIDs reach/tháng`; EN `137M+ Ad impressions/month`, `10+ Advertisers`, `5M+ UIDs reach/month`. Do not reformat units.
- Animation may only target `transform` and `opacity`. The single exception is the accordion, which animates height.
- The hero heading and hero image must not fade in — they are LCP elements.
- `prefers-reduced-motion: reduce` disables all motion; content appears immediately.
- Every element that starts hidden for a reveal animation must be forced visible by a `<noscript>` stylesheet.
- Images always go through `next/image` with explicit `width`/`height`.
- Company address, used in the footer and in JSON-LD: `96 Hoàng Ngân, Yên Hoà, Cầu Giấy - Hà Nội`.
- The 9 format slugs are fixed: `leaderboard-banner`, `in-page-banner`, `side-banner`, `pause-banner`, `welcome-banner`, `welcome-tvc`, `pre-roll-instream`, `mid-roll-instream`, `post-roll-instream`.
- Commit after every task. Conventional Commits format.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/i18n/routing.ts` | Locale list, prefix strategy, typed `Link`/`redirect`/`useRouter` |
| `src/i18n/request.ts` | Per-request message loading for `next-intl` |
| `src/middleware.ts` | Locale negotiation and redirect |
| `src/app/[locale]/layout.tsx` | Html shell, providers, Header, Footer, ScrollToTop, Organization JSON-LD |
| `src/app/[locale]/template.tsx` | Page-transition fade |
| `src/app/[locale]/page.tsx` | Home |
| `src/app/[locale]/sdk/page.tsx` | SDK |
| `src/app/[locale]/formats/page.tsx` | Product Demo list |
| `src/app/[locale]/formats/[slug]/page.tsx` | Format detail |
| `src/app/[locale]/contact/page.tsx` | Contact |
| `src/app/api/contact/route.ts` | Form submission endpoint |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Crawl directives |
| `src/lib/seo.ts` | Metadata + alternates builder, JSON-LD helpers |
| `src/lib/motion.ts` | Motion tokens and variant factories (pure, testable) |
| `src/lib/filter-formats.ts` | Pure filtering logic |
| `src/lib/contact-schema.ts` | Zod schema shared by client and server |
| `src/data/formats.ts` | The 9 ad formats |
| `src/components/*` | Presentational components, one per file |
| `messages/vi.json`, `messages/en.json` | All copy |

---

### Task 1: Project scaffold, i18n routing, Docker

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `Dockerfile`, `.dockerignore`, `.gitignore`
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Create: `messages/vi.json`, `messages/en.json`
- Test: `src/i18n/routing.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `routing` (next-intl routing config, `locales: ['vi','en']`), and from `src/i18n/routing.ts` the typed navigation exports `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. Every later task imports `Link` from here, never from `next/link`.

- [ ] **Step 1: Scaffold the app**

```bash
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack
npm i next-intl motion react-hook-form zod@^3 @hookform/resolvers
```

Pin zod to v3: the schema in Task 12 uses `z.string().email()`, which v4 moved to a top-level `z.email()`. If you upgrade later, update that one line.

```bash
# (no further install steps)
npm i -D vitest
```

- [ ] **Step 2: Write the failing test**

```ts
// src/i18n/routing.test.ts
import { describe, expect, it } from 'vitest'
import { routing } from './routing'

describe('routing', () => {
  it('supports exactly vi and en', () => {
    expect(routing.locales).toEqual(['vi', 'en'])
  })

  it('defaults to vi', () => {
    expect(routing.defaultLocale).toBe('vi')
  })

  it('always prefixes the locale so /vi and /en both exist', () => {
    expect(routing.localePrefix).toBe('always')
  })
})
```

- [ ] **Step 3: Add the vitest config and run the test to verify it fails**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

Add to `package.json` scripts: `"test": "vitest run"`.
Run: `npx vitest run src/i18n/routing.test.ts`
Expected: FAIL — cannot resolve `./routing`.

- [ ] **Step 4: Implement routing, request config and middleware**

```ts
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(vi|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

```ts
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { formats: ['image/avif', 'image/webp'] },
}

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig)
```

- [ ] **Step 5: Create the minimal locale layout and home page**

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

```tsx
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations()
  return <h1>{t('hero_title')}</h1>
}
```

Seed both message files with one key so the page renders:

```json
{ "hero_title": "Giải pháp quảng cáo trên nền tảng số" }
```

The `en.json` value is `"Advanced digital advertising solutions"`.

Delete the default `src/app/page.tsx` created by the scaffold — `src/app/[locale]/page.tsx` replaces it.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run`
Expected: PASS, 3 tests.

- [ ] **Step 7: Verify the app boots**

Run: `npm run dev`, open `http://localhost:3000`
Expected: redirects to `/vi` and shows the Vietnamese heading. `/en` shows the English one.

- [ ] **Step 8: Add the Dockerfile**

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

`.dockerignore`:

```
node_modules
.next
.git
docs
*.pdf
```

- [ ] **Step 9: Verify the Docker build**

Run: `docker build -t wiinvent-ad .` then `docker run --rm -p 3000:3000 wiinvent-ad`
Expected: build succeeds, `http://localhost:3000` redirects to `/vi`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with next-intl routing and Docker build"
```

---

### Task 2: Design tokens and motion tokens

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/motion.ts`
- Test: `src/lib/motion.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `DURATION: { fast: 0.15, base: 0.25, slow: 0.4, entrance: 0.6 }` (seconds)
  - `EASE: { standard: [0.22, 1, 0.36, 1], emphasized: [0.16, 1, 0.3, 1] }`
  - `REVEAL_DISTANCE = 24`, `STAGGER = 0.06`
  - `revealVariants(reduced: boolean): Variants` — returns `{ hidden, visible }`; when `reduced` is true both states are `{ opacity: 1, y: 0 }` and transition duration is `0`.
  - `staggerContainer(reduced: boolean): Variants`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/motion.test.ts
import { describe, expect, it } from 'vitest'
import { revealVariants, staggerContainer, DURATION, REVEAL_DISTANCE } from './motion'

describe('revealVariants', () => {
  it('moves and fades when motion is allowed', () => {
    const v = revealVariants(false)
    expect(v.hidden).toMatchObject({ opacity: 0, y: REVEAL_DISTANCE })
    expect(v.visible).toMatchObject({ opacity: 1, y: 0 })
    expect(v.visible.transition.duration).toBe(DURATION.entrance)
  })

  it('collapses to an instant no-op when reduced motion is requested', () => {
    const v = revealVariants(true)
    expect(v.hidden).toMatchObject({ opacity: 1, y: 0 })
    expect(v.visible).toMatchObject({ opacity: 1, y: 0 })
    expect(v.visible.transition.duration).toBe(0)
  })
})

describe('staggerContainer', () => {
  it('staggers children when motion is allowed', () => {
    expect(staggerContainer(false).visible.transition.staggerChildren).toBeGreaterThan(0)
  })

  it('does not stagger under reduced motion', () => {
    expect(staggerContainer(true).visible.transition.staggerChildren).toBe(0)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/motion.test.ts`
Expected: FAIL — cannot resolve `./motion`.

- [ ] **Step 3: Implement the motion tokens**

```ts
// src/lib/motion.ts
export const DURATION = { fast: 0.15, base: 0.25, slow: 0.4, entrance: 0.6 } as const
export const EASE = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const
export const REVEAL_DISTANCE = 24
export const STAGGER = 0.06

type Variant = { opacity: number; y: number; transition?: Record<string, unknown> }
export type Variants = { hidden: Variant; visible: Variant & { transition: { duration: number } } }

export function revealVariants(reduced: boolean) {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0, transition: { duration: 0 } },
    }
  }
  return {
    hidden: { opacity: 0, y: REVEAL_DISTANCE },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.entrance, ease: EASE.standard },
    },
  }
}

export function staggerContainer(reduced: boolean) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : STAGGER } },
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/motion.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Declare the design tokens in CSS**

Replace `src/app/globals.css` with the Tailwind v4 theme block. Colors are the Figma palette; pull exact values with `get_design_context` on node `2406:2828` when quota allows, otherwise use these placeholders and refine later.

```css
@import "tailwindcss";

@theme {
  --color-brand: #0B3B8C;
  --color-brand-dark: #06225A;
  --color-brand-light: #E8F0FC;
  --color-ink: #101828;
  --color-muted: #667085;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F7F9FC;
  --color-danger: #D92D20;

  --font-sans: var(--font-inter), system-ui, sans-serif;

  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --duration-entrance: 600ms;
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/lib/motion.ts src/lib/motion.test.ts
git commit -m "feat: add design tokens and motion variant factories"
```

---

### Task 3: Translation dictionaries

**Files:**
- Modify: `messages/vi.json`, `messages/en.json`

**Interfaces:**
- Consumes: nothing.
- Produces: the full key space used by every later task. Keys are flat except `format`, which is nested per slug key.

- [ ] **Step 1: Write `messages/vi.json`**

Copy values verbatim from the spec's content tables (spec §12, sourced from the handoff PDF). Structure:

```json
{
  "nav_sdk": "SDK",
  "nav_demo": "Demo",
  "nav_contact": "Liên hệ",
  "cta_demo": "Đăng ký Demo",
  "hero_title": "Giải pháp quảng cáo trên nền tảng số",
  "hero_description": "Quản trị và phân phối quảng cáo tập trung, tối ưu hiệu quả trên mọi điểm chạm.",
  "cta_formats": "Xem định dạng",
  "cta_consultation": "Liên hệ tư vấn",
  "platform_title": "Phủ sóng toàn bộ nền tảng",
  "platform_ios": "iOS",
  "platform_android": "Android",
  "platform_smart_tv": "Smart TV",
  "platform_tv_box": "TV Box",
  "platform_web": "Web",
  "performance_title": "Hiệu quả thực tế",
  "stat_impressions": "137M+ Ad impressions/month",
  "stat_advertisers": "10+ Advertiser",
  "stat_reach": "5M+ UIDs reach/tháng",
  "advantage_01": "NÂNG CAO HIỆU QUẢ",
  "accordion_01": "Phân phối quảng cáo nhanh chóng, ổn định với khả năng xử lý lưu lượng lớn theo thời gian thực.",
  "advantage_02": "MỞ RỘNG LINH HOẠT",
  "accordion_02": "Tự động thích ứng với lưu lượng, sẵn sàng đáp ứng mọi quy mô và thời điểm cao tải.",
  "advantage_03": "ĐA NỀN TẢNG",
  "accordion_03": "Quản trị và phân phối quảng cáo đồng bộ trên mọi môi trường số.",
  "advantage_04": "TÍCH HỢP MỞ",
  "accordion_04": "Kết nối linh hoạt với hệ sinh thái công nghệ và các chuẩn quảng cáo phổ biến.",
  "advantage_05": "QUẢN TRỊ & BẢO MẬT",
  "accordion_05": "Kiểm soát tập trung, phân quyền linh hoạt và bảo vệ an toàn dữ liệu.",
  "advantage_06": "GIÁM SÁT THỜI GIAN THỰC",
  "accordion_06": "Theo dõi hiệu năng và vận hành hệ thống với dữ liệu cập nhật tức thời.",
  "clients_title": "Khách hàng",
  "contact_title": "Liên hệ",
  "contact_description": "Bạn có nhu cầu quảng cáo, hợp tác hoặc muốn tìm hiểu thêm về nền tảng? Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
  "contact_cta": "Tư vấn",
  "sdk_title": "SDK được xây dựng riêng, dành riêng cho nền tảng của bạn",
  "sdk_description": "Chúng tôi xây dựng bộ SDK riêng cho từng khách hàng để kết nối nền tảng của bạn với Ad Server. SDK được tuỳ chỉnh hoàn toàn theo nhu cầu, hỗ trợ phân phối quảng cáo, theo dõi và đo lường hiệu quả trên tất cả sản phẩm của bạn.",
  "sdk_cta": "Tư vấn",
  "formats_title": "ĐỊNH DẠNG QUẢNG CÁO",
  "search_label": "Tìm kiếm",
  "filter_label": "Bộ lọc",
  "filter_device": "Thiết bị",
  "filter_type": "Loại",
  "empty_formats": "Không có định dạng phù hợp",
  "back_link": "Quay lại",
  "available_on": "Available on:",
  "device_mobile": "Mobile",
  "device_pc": "PC",
  "device_smart_tv": "Smart TV",
  "type_banner_standard": "Banner Standard",
  "type_welcome": "Welcome",
  "type_instream_video": "Instream Video",
  "contact_hero_title": "LIÊN HỆ & HỖ TRỢ",
  "company_name": "Công ty TNHH Một thành viên Công nghệ và Thương mại Wiinvent",
  "company_address": "96 Hoàng Ngân, Yên Hoà, Cầu Giấy - Hà Nội",
  "copyright": "© Wiinvent 2026",
  "form_title": "Liên hệ ngay",
  "field_full_name": "Họ và tên",
  "field_full_name_placeholder": "Nhập họ và tên của bạn",
  "field_phone": "Số điện thoại",
  "field_phone_placeholder": "Nhập số điện thoại của bạn",
  "field_email": "Email công ty",
  "field_email_placeholder": "Nhập email công ty của bạn",
  "field_company": "Tên doanh nghiệp",
  "field_company_placeholder": "Nhập tên doanh nghiệp của bạn",
  "field_website": "Website doanh nghiệp",
  "field_website_placeholder": "Nhập website của bạn",
  "field_message": "Nội dung yêu cầu",
  "field_message_placeholder": "Nhập nội dung muốn yêu cầu",
  "field_consent": "Tôi đồng ý nhận thông tin về sản phẩm, dịch vụ và các cơ hội hợp tác từ Wiinvent",
  "form_submit": "Gửi",
  "error_full_name": "Vui lòng nhập họ và tên hợp lệ",
  "error_phone": "Vui lòng nhập số điện thoại hợp lệ",
  "error_email": "Vui lòng nhập email hợp lệ",
  "error_company": "Vui lòng nhập tên doanh nghiệp",
  "error_website": "Vui lòng nhập website hợp lệ",
  "success_title": "Cảm ơn Quý khách",
  "error_title": "Gửi yêu cầu không thành công",
  "dialog_close": "Đóng",
  "menu_open": "Mở menu",
  "menu_close": "Đóng menu",
  "scroll_to_top": "Lên đầu trang",
  "format": {
    "leaderboard_banner": { "name": "Leaderboard Banner" },
    "in_page_banner": { "name": "In-Page Banner" },
    "side_banner": { "name": "Side Banner" },
    "pause_banner": { "name": "Pause Banner" },
    "welcome_banner": { "name": "Welcome Banner" },
    "welcome_tvc": { "name": "Welcome TVC" },
    "pre_roll_instream": { "name": "Pre roll Instream" },
    "mid_roll_instream": { "name": "Mid roll Instream" },
    "post_roll_instream": { "name": "Post Roll Instream" }
  }
}
```

- [ ] **Step 2: Write `messages/en.json`**

Same keys, English column from the PDF. Notable values:
`hero_title` = `"Advanced digital advertising solutions"`;
`hero_description` = `"Centralized advertising management and distribution, optimized for every digital touchpoint."`;
`cta_formats` = `"View Ad Formats"`; `cta_consultation` = `"Get Started"`; `cta_demo` = `"Register for a Demo"`;
`nav_contact` = `"Contact"`; `nav_sdk` = `"SDK"`; `nav_demo` = `"Demo"`;
`platform_title` = `"Platform Coverage"`; `performance_title` = `"Actual Performance"`;
`stat_impressions` = `"137M+ Ad impressions/month"`, `stat_advertisers` = `"10+ Advertisers"`, `stat_reach` = `"5M+ UIDs reach/month"`;
`advantage_01..06` = `"HIGH PERFORMANCE"`, `"FLEXIBLE EXPANSION"`, `"MULTI-PLATFORM"`, `"OPEN INTEGRATION"`, `"MANAGEMENT & SECURITY"`, `"REAL-TIME MONITORING"`;
`accordion_01..06` = the English accordion sentences from the PDF table;
`clients_title` = `"Partner"`; `contact_title` = `"Contact"`; `contact_cta` = `"Contact"`;
`sdk_title` = `"Custom-Built SDK, Dedicated to Your Platform"`;
`contact_hero_title` = `"CONTACT & SUPPORT"`;
`company_name` = `"Wiinvent Technology and Trading One Member Company Limited"`;
`form_title` = `"Contact Us"`; `success_title` = `"Thank You"`;
field labels/placeholders = `"Full name"` / `"Enter your Full name"`, `"Phone number"` / `"Enter your phone number"`, `"Business email"` / `"Enter your business email"`, `"Company name"` / `"Enter your company name"`, `"Company website"` / `"Enter your website URL"`, `"How can we help"` / `"Tell us about your needs or what you'd like to discuss"`;
`field_consent` = `"I agree to receive information about our products, services, and partnership opportunities from Wiinvent."`;
`format.*.name` values stay identical to the Vietnamese file (format names are not translated).

Error messages have no approved English copy in the handoff. Use direct translations — `"Please enter a valid full name"`, `"Please enter a valid phone number"`, `"Please enter a valid email"`, `"Please enter your company name"`, `"Please enter a valid website"` — and note them for review in spec §19.

- [ ] **Step 3: Verify key parity**

Run:

```bash
node -e "const a=require('./messages/vi.json'),b=require('./messages/en.json');const f=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'?f(v,p+k+'.'):[p+k]);const A=f(a).sort(),B=f(b).sort();const miss=A.filter(k=>!B.includes(k)).concat(B.filter(k=>!A.includes(k)));console.log(miss.length?'MISMATCH '+miss.join(', '):'OK '+A.length+' keys')"
```

Expected: `OK <n> keys`.

- [ ] **Step 4: Commit**

```bash
git add messages
git commit -m "feat: add Vietnamese and English content dictionaries"
```

---

### Task 4: Motion primitives and providers

**Files:**
- Create: `src/components/motion-provider.tsx`, `src/components/reveal.tsx`, `src/components/stagger.tsx`, `src/components/count-up.tsx`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `revealVariants`, `staggerContainer`, `DURATION`, `EASE` from `@/lib/motion`.
- Produces:
  - `<MotionProvider>` — client component wrapping children in `LazyMotion features={domAnimation} strict` and `MotionConfig reducedMotion="user"`.
  - `<Reveal as?: 'div'|'section'|'li' className?: string>` — reveals children on scroll, once.
  - `<Stagger className?: string>` and `<StaggerItem className?: string>` — parent/child pair for list entrances.
  - `<CountUp value: number, suffix: string, prefix?: string>` — animates 0→`value` when in view.
  - Every one of these renders a `data-reveal` attribute on its outermost element.

- [ ] **Step 1: Implement the provider**

```tsx
// src/components/motion-provider.tsx
'use client'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
```

- [ ] **Step 2: Implement Reveal and Stagger**

```tsx
// src/components/reveal.tsx
'use client'
import { m, useReducedMotion } from 'motion/react'
import { revealVariants } from '@/lib/motion'

export function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'li'
}) {
  const reduced = useReducedMotion() ?? false
  const Tag = m[as]
  return (
    <Tag
      data-reveal
      className={className}
      variants={revealVariants(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {children}
    </Tag>
  )
}
```

```tsx
// src/components/stagger.tsx
'use client'
import { m, useReducedMotion } from 'motion/react'
import { revealVariants, staggerContainer } from '@/lib/motion'

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false
  return (
    <m.div
      data-reveal
      className={className}
      variants={staggerContainer(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false
  return (
    <m.div data-reveal className={className} variants={revealVariants(reduced)}>
      {children}
    </m.div>
  )
}
```

- [ ] **Step 3: Implement CountUp**

`CountUp` must render the final value in the server-rendered HTML so crawlers and no-JS users see the real number; it only animates after it enters the viewport.

```tsx
// src/components/count-up.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { DURATION } from '@/lib/motion'

export function CountUp({ value, prefix = '', suffix }: { value: number; prefix?: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion() ?? false
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!inView || reduced) return
    const ms = DURATION.entrance * 1000 * 2
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1)
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setDisplay(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value])

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
```

- [ ] **Step 4: Add the no-JS safety net**

Append to `src/app/globals.css`:

```css
@layer utilities {
  .noscript-reveal [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

Add inside `<head>` in `src/app/[locale]/layout.tsx`:

```tsx
<noscript>
  <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
</noscript>
```

Wrap `{children}` in the layout with `<MotionProvider>`.

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build succeeds.

Then run `npm run dev`, open `/vi` with JavaScript disabled in DevTools.
Expected: all content visible, nothing stuck at `opacity: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app
git commit -m "feat: add motion provider and reveal, stagger, count-up primitives"
```

---

### Task 5: SEO helpers, sitemap, robots

**Files:**
- Create: `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/lib/seo.test.ts`

**Interfaces:**
- Consumes: `routing`, `getPathname` from `@/i18n/routing`.
- Produces:
  - `SITE_URL` — `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ad.wiinvent.tv'`
  - `buildMetadata({ locale, path, title, description, image? }): Metadata` — sets `title`, `description`, `alternates.canonical`, `alternates.languages` (`vi`, `en`, `x-default` → the `vi` URL), `openGraph`, `twitter`.
  - `organizationJsonLd(locale, name)`, `breadcrumbJsonLd(items)`, `itemListJsonLd(items)` — each returns a plain object to be serialized into a `<script type="application/ld+json">`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/seo.test.ts
import { describe, expect, it } from 'vitest'
import { buildMetadata, SITE_URL } from './seo'

describe('buildMetadata', () => {
  const meta = buildMetadata({
    locale: 'vi',
    path: '/formats',
    title: 'Định dạng',
    description: 'Danh sách định dạng',
  })

  it('sets a canonical without query parameters', () => {
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/vi/formats`)
  })

  it('declares both locales plus x-default', () => {
    expect(meta.alternates?.languages).toEqual({
      vi: `${SITE_URL}/vi/formats`,
      en: `${SITE_URL}/en/formats`,
      'x-default': `${SITE_URL}/vi/formats`,
    })
  })

  it('mirrors the title into open graph', () => {
    expect(meta.openGraph?.title).toBe('Định dạng')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: FAIL — cannot resolve `./seo`.

- [ ] **Step 3: Implement `src/lib/seo.ts`**

```ts
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ad.wiinvent.tv'

const url = (locale: Locale, path: string) => `${SITE_URL}/${locale}${path === '/' ? '' : path}`

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = '/og-default.png',
}: {
  locale: Locale
  path: string
  title: string
  description: string
  image?: string
}): Metadata {
  const canonical = url(locale, path)
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        vi: url('vi', path),
        en: url('en', path),
        'x-default': url('vi', path),
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [image],
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export function organizationJsonLd(locale: Locale, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: url(locale, '/'),
    logo: `${SITE_URL}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '96 Hoàng Ngân, Yên Hoà, Cầu Giấy',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function itemListJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Add robots and a static-route sitemap**

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/seo'

const STATIC_PATHS = ['/', '/sdk', '/formats', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
  )
}
```

Task 10 extends this with the format pages.

- [ ] **Step 6: Emit Organization JSON-LD from the layout**

In `src/app/[locale]/layout.tsx`, inside `<body>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationJsonLd(locale, t('company_name'))),
  }}
/>
```

Read `t` via `getTranslations()` from `next-intl/server`, which makes the layout async — it already is.

- [ ] **Step 7: Verify**

Run: `npm run build && npm run start`, then `curl -s localhost:3000/sitemap.xml | head -20` and `curl -s localhost:3000/robots.txt`
Expected: 8 URLs in the sitemap, robots points at the sitemap.

- [ ] **Step 8: Commit**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts src/app
git commit -m "feat: add SEO metadata builder, sitemap, robots and Organization JSON-LD"
```

---

### Task 6: Header, Footer, ScrollToTop

**Files:**
- Create: `src/components/header.tsx`, `src/components/mobile-drawer.tsx`, `src/components/language-switcher.tsx`, `src/components/footer.tsx`, `src/components/scroll-to-top.tsx`, `src/components/button.tsx`, `src/components/container.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Figma: header `2865:15309`, drawer `2903:8434`, footer `2821:7978`

**Interfaces:**
- Consumes: `Link`, `usePathname`, `useRouter` from `@/i18n/routing`; `useTranslations` from `next-intl`.
- Produces:
  - `<Button href? onClick? variant: 'primary'|'secondary'|'ghost' size?: 'sm'|'md'>` — renders `Link` when `href` is set, otherwise `button`. Hover and press are CSS transitions using `--duration-fast`.
  - `<Container>` — `mx-auto w-full max-w-[1200px] px-6`.
  - `<Header>`, `<Footer>`, `<ScrollToTop>`.

- [ ] **Step 1: Implement Container and Button**

```tsx
// src/components/container.tsx
export function Container({ children, className = '' }: {
  children: React.ReactNode; className?: string
}) {
  return <div className={`mx-auto w-full max-w-[1200px] px-6 ${className}`}>{children}</div>
}
```

```tsx
// src/components/button.tsx
import { Link } from '@/i18n/routing'

const BASE =
  'inline-flex items-center justify-center rounded-full font-semibold ' +
  'transition-[transform,background-color,color] duration-[--duration-fast] ' +
  'ease-[--ease-standard] hover:-translate-y-px active:translate-y-0 ' +
  'disabled:pointer-events-none disabled:opacity-60'

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-brand bg-white text-brand hover:bg-brand-light',
  ghost: 'text-brand hover:bg-brand-light',
} as const

const SIZES = { sm: 'h-10 px-4 text-sm', md: 'h-12 px-6 text-base' } as const

type Props = {
  children: React.ReactNode
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  className?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  children, variant = 'primary', size = 'md', className = '', href, ...rest
}: Props) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}
```

- [ ] **Step 2: Implement LanguageSwitcher**

```tsx
'use client'
import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const switchTo = (next: 'vi' | 'en') =>
    router.replace({ pathname, params: params as never }, { locale: next })

  return (
    <div className="flex items-center gap-1 text-sm">
      {(['vi', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={l === locale ? 'font-semibold text-brand' : 'text-muted'}
        >
          {l === 'vi' ? 'Tiếng Việt' : 'English'}
        </button>
      ))}
    </div>
  )
}
```

Switching locale must preserve the current path including dynamic segments — that is what passing `params` does.

- [ ] **Step 3: Implement Header**

Client component. Sticky, white, full-width. Left: logo linking to `/`. Right on `md` and up: `nav_sdk` → `/sdk`, `nav_demo` → `/formats`, `nav_contact` → `/contact`, `LanguageSwitcher`, then a primary `Button` with `cta_demo` → `/contact`. Below `md`: logo plus a hamburger button labelled `menu_open`.

Scroll behaviour, CSS only:

```tsx
const [scrolled, setScrolled] = useState(false)
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 8)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])
```

Apply `className={scrolled ? 'h-16 shadow-sm backdrop-blur' : 'h-20'}` with `transition-[height,box-shadow] duration-[--duration-base]`.

- [ ] **Step 4: Implement MobileDrawer**

```tsx
'use client'
import { AnimatePresence, m } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

export function MobileDrawer({ open, onClose, children }: {
  open: boolean; onClose: () => void; children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base }}
            onClick={onClose}
          />
          <m.div
            className="fixed right-0 top-0 z-50 h-dvh w-[280px] bg-white p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

Close the drawer on route change and on `Escape`. Lock body scroll while open.

- [ ] **Step 5: Implement Footer and ScrollToTop**

Footer: `bg-brand-dark text-white`, logo plus a short description, a link group (`nav_sdk`, `nav_demo`, `nav_contact`), `company_name`, `company_address` with a location icon, `copyright`, and a `cta_demo` button.

ScrollToTop: fixed bottom-right, appears once `window.scrollY > 400`, fades and lifts in, `aria-label={t('scroll_to_top')}`, click calls `window.scrollTo({ top: 0, behavior: 'smooth' })`.

- [ ] **Step 6: Wire into the layout and add a page transition**

```tsx
// src/app/[locale]/template.tsx
'use client'
import { m } from 'motion/react'
import { DURATION } from '@/lib/motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DURATION.base }}>
      {children}
    </m.div>
  )
}
```

- [ ] **Step 7: Verify**

Run: `npm run dev`
Expected: header links navigate; the language switcher keeps you on the same page; the drawer opens and closes on mobile width; the scroll-to-top button appears after scrolling and disappears at the top.

- [ ] **Step 8: Commit**

```bash
git add src/components src/app
git commit -m "feat: add header, mobile drawer, footer, scroll-to-top and page transition"
```

---

### Task 7: Home page

**Files:**
- Create: `src/components/sections/hero.tsx`, `platform-coverage.tsx`, `performance.tsx`, `advantages.tsx`, `clients.tsx`, `contact-cta.tsx`
- Create: `src/components/accordion.tsx`, `src/components/stat-card.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Figma: desktop `2406:2828`, tablet `2849:3551`, mobile `2747:3187`

**Interfaces:**
- Consumes: `Reveal`, `Stagger`, `StaggerItem`, `CountUp`, `Button`, `Container`.
- Produces: `<Accordion items: { id: string; title: string; body: string }[]>` — single-open, first item open by default, reused nowhere else but kept standalone for testability.

- [ ] **Step 1: Hero**

Two columns on desktop (text left, device illustration right), stacked on mobile with text first. Content: `hero_title` as the single `h1`, `hero_description`, a primary `Button` `cta_formats` → `/formats`, a secondary `Button` `cta_consultation` → `/contact`. Image `/hero-devices.png` with `priority` set.

The `h1` and the image must render without any entrance animation — they are the LCP candidates. Animate only the two buttons, with a 0.1s delay.

- [ ] **Step 2: PlatformCoverage**

Centred `platform_title`, then five icons in a row on desktop, wrapping on mobile: `platform_ios`, `platform_android`, `platform_smart_tv`, `platform_tv_box`, `platform_web`, each with `/icon-<name>.svg`. Wrap in `<Stagger>` with one `<StaggerItem>` per icon.

- [ ] **Step 3: Performance**

Light background with `/stats-bg.png`. `performance_title`, then three `StatCard`s in a row on desktop, stacked on mobile.

`StatCard` splits the translated string into its numeric prefix and its remainder so `CountUp` can animate the number while the unit text stays verbatim:

```tsx
export function StatCard({ text }: { text: string }) {
  const match = text.match(/^(\d+)(\D.*)$/)
  if (!match) return <p>{text}</p>
  const [, digits, rest] = match
  return (
    <p className="text-4xl font-bold">
      <CountUp value={Number(digits)} suffix={rest} />
    </p>
  )
}
```

For `137M+ Ad impressions/month` this animates `137` and leaves `M+ Ad impressions/month` alone. No click behaviour, no filtering on this section.

- [ ] **Step 4: Advantages accordion**

Six items built from `advantage_01..06` and `accordion_01..06`, with an illustration beside them on desktop and stacked on mobile.

```tsx
'use client'
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { DURATION, EASE } from '@/lib/motion'

export function Accordion({ items }: { items: { id: string; title: string; body: string }[] }) {
  const [open, setOpen] = useState(items[0]?.id)
  return (
    <ul>
      {items.map((item) => {
        const isOpen = item.id === open
        return (
          <li key={item.id} className="border-b">
            <button
              className="flex w-full items-center justify-between py-4 text-left font-semibold"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? undefined : item.id)}
            >
              {item.title}
              <span
                className="transition-transform duration-[--duration-base]"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                aria-hidden
              >
                ⌄
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE.standard }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-muted">{item.body}</p>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
```

Replace the `⌄` glyph with the chevron icon exported from Figma once assets land.

- [ ] **Step 5: Clients and ContactCta**

Clients: centred `clients_title`, then a row of partner logos read from `public/clients/`. Start with `tv360.svg`. Logos are not clickable. Build the list as an array so more logos need no code change.

ContactCta: `contact_title`, `contact_description`, a primary `Button` `contact_cta` → `/contact` on the left, illustration on the right; stacked on mobile.

- [ ] **Step 6: Assemble the page and its metadata**

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return buildMetadata({
    locale,
    path: '/',
    title: t('hero_title'),
    description: t('hero_description'),
  })
}
```

- [ ] **Step 7: Verify**

Run: `npm run build && npm run start`, open `/vi` and `/en`.
Expected: every section renders in the right order, all copy comes from the dictionaries, the statistics animate once on scroll and read exactly as specified, and only one `h1` exists on the page (`document.querySelectorAll('h1').length === 1`).

- [ ] **Step 8: Commit**

```bash
git add src/components src/app
git commit -m "feat: build home page sections with scroll reveals and stat count-up"
```

---

### Task 8: SDK page

**Files:**
- Create: `src/app/[locale]/sdk/page.tsx`, `src/components/sections/sdk-hero.tsx`, `src/components/sections/sdk-illustration.tsx`
- Figma: desktop `3043:7980`, tablet `3043:9730`, mobile `3055:10260`

**Interfaces:**
- Consumes: `Reveal`, `Stagger`, `Button`, `Container`, `buildMetadata`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: SdkHero**

Dark background. Title `sdk_title` as the `h1`, `sdk_description`, a primary `Button` `sdk_cta` → `/contact` on one side; `/sdk-hero.png` on the other. Stacked on mobile. The `h1` and hero image do not animate.

- [ ] **Step 2: SdkIllustration**

Light background. `/sdk-code.png` centred, and below it the five platform icons reusing the same array as `PlatformCoverage` — extract that array into `src/data/platforms.ts` so both sections share it rather than duplicating the list.

```ts
// src/data/platforms.ts
export const PLATFORMS = [
  { key: 'platform_ios', icon: '/icon-ios.svg' },
  { key: 'platform_android', icon: '/icon-android.svg' },
  { key: 'platform_smart_tv', icon: '/icon-smart-tv.svg' },
  { key: 'platform_tv_box', icon: '/icon-tv-box.svg' },
  { key: 'platform_web', icon: '/icon-web.svg' },
] as const
```

Update `PlatformCoverage` from Task 7 to import it.

- [ ] **Step 3: Page and metadata**

`buildMetadata({ locale, path: '/sdk', title: t('sdk_title'), description: t('sdk_description') })`.

- [ ] **Step 4: Verify**

Run: `npm run dev`, open `/vi/sdk` and `/en/sdk`.
Expected: both sections render, the footer matches the other pages, `/sdk` appears in the sitemap.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: build SDK page and share the platform list between sections"
```

---

### Task 9: Format data and filtering logic

**Files:**
- Create: `src/data/formats.ts`, `src/lib/filter-formats.ts`
- Test: `src/lib/filter-formats.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Device = 'mobile' | 'pc' | 'smart-tv'`
  - `type FormatType = 'banner-standard' | 'welcome' | 'instream-video'`
  - `type AdFormat = { slug: string; key: string; type: FormatType; devices: Device[]; thumbnail: string; media: Partial<Record<Device, string>> }`
  - `FORMATS: AdFormat[]` — 9 entries in the PDF's order
  - `getFormat(slug: string): AdFormat | undefined`
  - `filterFormats(formats: AdFormat[], q: { devices: Device[]; types: FormatType[]; search: string }, nameOf: (f: AdFormat) => string): AdFormat[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/filter-formats.test.ts
import { describe, expect, it } from 'vitest'
import { FORMATS } from '@/data/formats'
import { filterFormats } from './filter-formats'

const nameOf = (f: { slug: string }) =>
  f.slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')

const q = (over: Partial<Parameters<typeof filterFormats>[1]> = {}) => ({
  devices: [], types: [], search: '', ...over,
})

describe('filterFormats', () => {
  it('returns everything when nothing is selected', () => {
    expect(filterFormats(FORMATS, q(), nameOf)).toHaveLength(9)
  })

  it('treats values inside one group as OR', () => {
    const result = filterFormats(FORMATS, q({ devices: ['mobile', 'pc'] }), nameOf)
    expect(result).toHaveLength(9)
  })

  it('excludes formats that support none of the selected devices', () => {
    const result = filterFormats(FORMATS, q({ devices: ['smart-tv'] }), nameOf)
    expect(result.map((f) => f.slug)).not.toContain('side-banner')
  })

  it('treats separate groups as AND', () => {
    const result = filterFormats(
      FORMATS,
      q({ devices: ['mobile'], types: ['banner-standard'] }),
      nameOf,
    )
    expect(result.map((f) => f.slug)).toEqual([
      'leaderboard-banner', 'in-page-banner', 'pause-banner',
    ])
  })

  it('combines search with filters using AND', () => {
    const result = filterFormats(
      FORMATS,
      q({ types: ['instream-video'], search: 'pre' }),
      nameOf,
    )
    expect(result.map((f) => f.slug)).toEqual(['pre-roll-instream'])
  })

  it('ignores case and Vietnamese diacritics in search', () => {
    expect(filterFormats(FORMATS, q({ search: 'BANNER' }), nameOf).length).toBeGreaterThan(0)
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterFormats(FORMATS, q({ devices: ['pc'], search: 'welcome tvc' }), nameOf)).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/filter-formats.test.ts`
Expected: FAIL — cannot resolve `@/data/formats`.

- [ ] **Step 3: Implement the data file**

```ts
// src/data/formats.ts
export type Device = 'mobile' | 'pc' | 'smart-tv'
export type FormatType = 'banner-standard' | 'welcome' | 'instream-video'

export type AdFormat = {
  slug: string
  key: string
  type: FormatType
  devices: Device[]
  thumbnail: string
  media: Partial<Record<Device, string>>
}

const media = (slug: string, devices: Device[]) =>
  Object.fromEntries(devices.map((d) => [d, `/formats/${slug}-${d}.png`]))

const format = (slug: string, key: string, type: FormatType, devices: Device[]): AdFormat => ({
  slug,
  key,
  type,
  devices,
  thumbnail: `/formats/${slug}-thumb.png`,
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

export const getFormat = (slug: string) => FORMATS.find((f) => f.slug === slug)
```

- [ ] **Step 4: Implement the filter**

```ts
// src/lib/filter-formats.ts
import type { AdFormat, Device, FormatType } from '@/data/formats'

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function filterFormats(
  formats: AdFormat[],
  query: { devices: Device[]; types: FormatType[]; search: string },
  nameOf: (format: AdFormat) => string,
): AdFormat[] {
  const search = normalize(query.search)
  return formats.filter((f) => {
    // Empty group means unrestricted. Values inside a group are OR.
    const byDevice =
      query.devices.length === 0 || query.devices.some((d) => f.devices.includes(d))
    const byType = query.types.length === 0 || query.types.includes(f.type)
    // Groups and the search term combine with AND.
    const bySearch = search === '' || normalize(nameOf(f)).includes(search)
    return byDevice && byType && bySearch
  })
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add src/data/formats.ts src/lib/filter-formats.ts src/lib/filter-formats.test.ts
git commit -m "feat: add ad format catalogue and filtering rules"
```

---

### Task 10: Product Demo page

**Files:**
- Create: `src/app/[locale]/formats/page.tsx`, `src/components/format-grid.tsx`, `src/components/format-card.tsx`, `src/components/filter-dropdown.tsx`, `src/components/search-input.tsx`
- Modify: `src/app/sitemap.ts`
- Figma: desktop `2633:2693`, dropdown open `2675:7812`, dropdown option `2675:6882`, search field states `2633:5715`, card `3139:10264`

**Interfaces:**
- Consumes: `FORMATS`, `filterFormats`, `Reveal`, `Container`, `Link`.
- Produces: `<FormatCard format layoutId>` — the `layoutId` is `format-<slug>` and is reused by the detail page for the shared-element transition.

- [ ] **Step 1: Read filter state from the URL**

The page is a server component. It reads `searchParams` and passes the parsed query into a client `FormatGrid`:

```tsx
export default async function FormatsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ device?: string; type?: string; q?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const devices = (sp.device?.split(',').filter(Boolean) ?? []) as Device[]
  const types = (sp.type?.split(',').filter(Boolean) ?? []) as FormatType[]
  ...
}
```

Multiple values within a group are comma-separated, e.g. `?device=mobile,pc`.

- [ ] **Step 2: Implement SearchInput and FilterDropdown**

`SearchInput` — controlled, debounced 250ms, writes `?q=` via `router.replace(..., { scroll: false })`. Visual states from Figma: Default, Hover, Typing, Focus. Placeholder is `search_label`.

`FilterDropdown` — a labelled button that toggles a panel of checkboxes; multiple selections allowed; writes the comma-joined value into its search param. Two instances: `filter_device` (values `mobile`, `pc`, `smart-tv` labelled with `device_*`) and `filter_type` (values labelled with `type_*`). Panel entrance:

```tsx
<AnimatePresence>
  {open && (
    <m.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: DURATION.fast, ease: EASE.standard }}
    >
      ...
    </m.div>
  )}
</AnimatePresence>
```

Close on outside click and on `Escape`. Selected options carry a visible selected state.

- [ ] **Step 3: Implement FormatGrid with layout animation**

```tsx
'use client'
import { AnimatePresence, m } from 'motion/react'

<m.ul layout className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
  <AnimatePresence mode="popLayout">
    {visible.map((f) => (
      <m.li
        key={f.slug}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: DURATION.base, ease: EASE.standard }}
      >
        <FormatCard format={f} />
      </m.li>
    ))}
  </AnimatePresence>
</m.ul>
```

When `visible` is empty, render `empty_formats` instead of the grid.

- [ ] **Step 4: Implement FormatCard**

Thumbnail, format name (`format.<key>.name`), and type label (`type_*`). The whole card is a `Link` to `/formats/<slug>`. Hover lifts the card via CSS. The thumbnail image carries `layoutId={`format-${format.slug}`}`.

- [ ] **Step 5: Add the demo content area above the filters**

The page's top area shows the demo advertising content described in the PDF, then the `formats_title` heading, then the filter row, then the grid.

- [ ] **Step 6: Metadata and ItemList JSON-LD**

`buildMetadata({ locale, path: '/formats', title: t('formats_title'), description: t('hero_description') })`, plus `itemListJsonLd` built from the 9 formats with their localized names and canonical URLs.

- [ ] **Step 7: Extend the sitemap**

```ts
import { FORMATS } from '@/data/formats'

...routing.locales.flatMap((locale) =>
  FORMATS.map((f) => ({
    url: `${SITE_URL}/${locale}/formats/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })),
),
```

- [ ] **Step 8: Verify**

Run: `npm run build && npm run start`, open `/vi/formats`.
Expected: 9 cards. Selecting Device = Smart TV drops Side Banner. Adding Type = Banner Standard narrows further. Typing `welcome` narrows to two. Combining PC with the search `welcome tvc` shows the empty state. Reloading the page keeps the filters, since they live in the URL. `curl -s localhost:3000/sitemap.xml | grep -c formats/` returns 18.

- [ ] **Step 9: Commit**

```bash
git add src
git commit -m "feat: build product demo page with URL-driven filters and layout animation"
```

---

### Task 11: Format detail page

**Files:**
- Create: `src/app/[locale]/formats/[slug]/page.tsx`, `src/components/device-tabs.tsx`, `src/components/format-media.tsx`
- Figma: Mobile `2675:13396`, PC `2769:6612`, Smart TV `2769:6278`, device button `2769:6121`

**Interfaces:**
- Consumes: `FORMATS`, `getFormat`, `buildMetadata`, `breadcrumbJsonLd`, `Link`.
- Produces: nothing consumed later.

- [ ] **Step 1: Static params for all 9 slugs**

```tsx
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    FORMATS.map((f) => ({ locale, slug: f.slug })),
  )
}
```

An unknown slug calls `notFound()`.

- [ ] **Step 2: Implement DeviceTabs**

Client component. Renders only the devices the format supports. The active device comes from `?device=`; if the parameter is missing or names a device this format does not support, it falls back to `format.devices[0]`. Selecting a device calls `router.replace` with `{ scroll: false }` so the page does not jump or reload.

The active indicator slides between tabs:

```tsx
{isActive && (
  <m.span
    layoutId="device-indicator"
    className="absolute inset-0 -z-10 rounded-full bg-brand-light"
    transition={{ duration: DURATION.base, ease: EASE.standard }}
  />
)}
```

- [ ] **Step 3: Implement FormatMedia**

Crossfades when the device changes:

```tsx
<AnimatePresence mode="wait">
  <m.div
    key={device}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: DURATION.base }}
  >
    <Image src={format.media[device]!} alt={name} width={800} height={600} />
  </m.div>
</AnimatePresence>
```

Each format and device pair uses its own media file. Never composite several formats into one image.

- [ ] **Step 4: Compose the page**

Light hero containing: a `back_link` link to `/formats`; the format name as the `h1`; the type label; `available_on` followed by `DeviceTabs`; and `FormatMedia` on the other side. Stacked on mobile.

The hero image carries `layoutId={`format-${slug}`}` so navigating from the card animates the shared element.

- [ ] **Step 5: Metadata**

```tsx
buildMetadata({
  locale,
  path: `/formats/${slug}`,
  title: t(`format.${format.key}.name`),
  description: t('hero_description'),
})
```

The canonical never includes `?device=`, so `buildMetadata` needs no change. Also emit `breadcrumbJsonLd` for Home → Demo → the format.

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: 18 format detail pages prerendered.

Then open `/vi/formats/side-banner`: only the PC tab appears. Open `/vi/formats/welcome-tvc?device=pc`: falls back to Mobile rather than erroring. Switching tabs updates the URL without a page reload. `view-source` on any detail page shows the canonical without a query string.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: build format detail page with device tabs and shared element transition"
```

---

### Task 12: Contact form schema and API route

**Files:**
- Create: `src/lib/contact-schema.ts`, `src/app/api/contact/route.ts`
- Test: `src/lib/contact-schema.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `contactSchema` — zod object; error messages are i18n **keys**, not sentences, so the client can translate them and the server can stay locale-agnostic.
  - `type ContactInput = z.infer<typeof contactSchema>`
  - `POST /api/contact` → `200 { ok: true }` on success, `400 { ok: false, errors: Record<string,string> }` on validation failure, `429 { ok: false, error: 'rate_limited' }` when throttled.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/contact-schema.test.ts
import { describe, expect, it } from 'vitest'
import { contactSchema } from './contact-schema'

const valid = {
  fullName: 'Nguyễn Văn A',
  phone: '0912345678',
  email: 'a@company.vn',
  company: 'Wiinvent',
  website: '',
  message: '',
  consent: false,
}

describe('contactSchema', () => {
  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it.each(['0912345678', '091234567890', '+84912345678'])('accepts phone %s', (phone) => {
    expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(true)
  })

  it.each(['091234', '0912345678901234', '84912345678', 'abcdefghij'])(
    'rejects phone %s',
    (phone) => {
      expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(false)
    },
  )

  it('rejects a missing full name', () => {
    expect(contactSchema.safeParse({ ...valid, fullName: 'A' }).success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
  })

  it('accepts an empty website but rejects a malformed one', () => {
    expect(contactSchema.safeParse({ ...valid, website: '' }).success).toBe(true)
    expect(contactSchema.safeParse({ ...valid, website: 'ht!tp:/x' }).success).toBe(false)
  })

  it('reports errors as translation keys', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'nope' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('error_email')
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/contact-schema.test.ts`
Expected: FAIL — cannot resolve `./contact-schema`.

- [ ] **Step 3: Implement the schema**

```ts
// src/lib/contact-schema.ts
import { z } from 'zod'

// 0 followed by 9-11 digits (10-12 chars), or +84 followed by 8-9 digits (11-12 chars).
const PHONE = /^(0\d{9,11}|\+84\d{8,9})$/

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'error_full_name'),
  phone: z.string().trim().regex(PHONE, 'error_phone'),
  email: z.string().trim().min(5, 'error_email').email('error_email'),
  company: z.string().trim().min(2, 'error_company'),
  website: z.union([z.literal(''), z.string().trim().url('error_website')]),
  message: z.string().trim().max(2000).optional().default(''),
  consent: z.boolean().default(false),
})

export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/contact-schema.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement the route handler**

The backend destination is not decided yet (spec §2). This handler validates and acknowledges; when a real destination exists, only the marked block changes.

```ts
// src/app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact-schema'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

// ponytail: in-memory rate limit, per-instance only. Move to Redis if the
// site ever runs more than one container.
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0])] = issue.message
    }
    return NextResponse.json({ ok: false, errors }, { status: 400 })
  }

  // --- replace this block when the real destination is chosen ---
  console.info('[contact]', JSON.stringify(parsed.data))
  // --- end ---

  return NextResponse.json({ ok: true })
}
```

Validation runs again here even though the client already validated — client-side checks are a convenience, never a trust boundary.

- [ ] **Step 6: Verify the endpoint**

Run: `npm run dev`, then

```bash
curl -s -X POST localhost:3000/api/contact -H 'content-type: application/json' \
  -d '{"fullName":"A B","phone":"0912345678","email":"a@b.vn","company":"X","website":"","message":"","consent":false}'
curl -s -X POST localhost:3000/api/contact -H 'content-type: application/json' \
  -d '{"fullName":"A","phone":"1","email":"x","company":"","website":"","message":"","consent":false}'
```

Expected: first returns `{"ok":true}`; second returns HTTP 400 with error keys per field. A seventh rapid request returns 429.

- [ ] **Step 7: Commit**

```bash
git add src/lib/contact-schema.ts src/lib/contact-schema.test.ts src/app/api
git commit -m "feat: add contact form schema and validating API route"
```

---

### Task 13: Contact page

**Files:**
- Create: `src/app/[locale]/contact/page.tsx`, `src/components/contact-form.tsx`, `src/components/input.tsx`, `src/components/checkbox.tsx`, `src/components/notification-dialog.tsx`
- Figma: page `2448:7642`, form `2985:8000`, input `3139:10581`, success `2675:5991`, error `2985:8079`, dialog variants `2448:4145`

**Interfaces:**
- Consumes: `contactSchema`, `Button`, `Container`, `Reveal`.
- Produces: nothing consumed later.

- [ ] **Step 1: Implement Input and Checkbox**

`Input` props: `name`, `label`, `placeholder`, `required`, `error?`, `type`, `as?: 'input' | 'textarea'`. A required field renders `*` after the label. When `error` is set, the border turns `--color-danger` and the translated message appears below the field with `role="alert"`. Wire `aria-invalid` and `aria-describedby`.

`Checkbox` props: `name`, `label`, `checked`, `onChange`.

- [ ] **Step 2: Implement NotificationDialog**

Four variants from Figma: `size` of `big` or `small`, `state` of `success` or `error`. Centred on a dimmed backdrop.

```tsx
<AnimatePresence>
  {open && (
    <>
      <m.div className="fixed inset-0 z-40 bg-black/50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: DURATION.base }} onClick={onClose} />
      <m.div role="dialog" aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: DURATION.base, ease: EASE.emphasized }}>
        ...
      </m.div>
    </>
  )}
</AnimatePresence>
```

Closes on backdrop click, on `Escape`, and via a close button labelled `dialog_close`. Move focus into the dialog on open and return it to the submit button on close. `size` is `big` at `md` and above, `small` below.

- [ ] **Step 3: Implement ContactForm**

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/contact-schema'
```

- `resolver: zodResolver(contactSchema)`, `mode: 'onBlur'`
- Field order matches the PDF: full name, phone, email, company, website, message, consent
- Errors come back as translation keys, so render them with `t(errors.field.message)`
- Submit posts JSON to `/api/contact`; the button is disabled while submitting
- HTTP 200 opens the success dialog with `success_title` and resets the form
- Any other response opens the error dialog with `error_title`; the entered values are preserved
- If the response is 400 with per-field errors, also mark those fields using `setError`

- [ ] **Step 4: Compose the page**

Full-width banner hero (`/contact-banner.png`) with `contact_hero_title` centred on it. Below: `company_name` centred, then the form on a light blue panel on the left with the device illustration on the right; on mobile the form comes first and the illustration follows. `form_title` labels the form.

- [ ] **Step 5: Metadata**

`buildMetadata({ locale, path: '/contact', title: t('contact_hero_title'), description: t('contact_description') })`.

- [ ] **Step 6: Verify**

Run: `npm run dev`, open `/vi/contact`.
Expected: submitting an empty form shows one error per required field, in Vietnamese, with red borders. Entering `091234` shows the phone error. A valid submission opens the "Cảm ơn Quý khách" dialog and clears the form. Escape closes the dialog. `/en/contact` shows English labels and errors. Tab order runs top to bottom and the dialog traps focus.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: build contact page with validated form and result dialogs"
```

---

### Task 14: Responsive pass, asset manifest, final verification

**Files:**
- Create: `public/README.md`
- Modify: any component needing breakpoint corrections

**Interfaces:**
- Consumes: everything built so far.
- Produces: the finished site.

- [ ] **Step 1: Write the asset manifest**

`public/README.md` lists every file the designer must export, exactly as spec §16 specifies, with the pixel dimensions each component requests. Any missing file must leave the layout intact — verify by temporarily renaming one image and confirming the page still renders at the right size.

- [ ] **Step 2: Check every page at the three design widths**

At 1440, 768 and 375 confirm: the header is horizontal on desktop and collapsed on mobile; the hero splits into two columns on desktop and stacks with text first on mobile; the format grid is four columns, then three, then one; images keep their aspect ratio and are never distorted or cropped over content; the footer sits at the bottom with the dark blue background; the scroll-to-top button sits at the bottom right.

- [ ] **Step 3: Run the full check**

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

Expected: no errors. The build output lists 4 static pages plus 9 format pages per locale.

- [ ] **Step 4: Verify SEO output on the built site**

```bash
npm run start
curl -s localhost:3000/vi | grep -o '<link rel="alternate"[^>]*>'
curl -s localhost:3000/vi/formats/side-banner | grep -o '"@type":"[A-Za-z]*"'
curl -s localhost:3000/sitemap.xml | grep -c '<url>'
```

Expected: three alternate links per page (vi, en, x-default); `Organization` and `BreadcrumbList` present on the detail page; 26 URLs in the sitemap (4 static plus 9 formats, times 2 locales).

- [ ] **Step 5: Verify reduced motion and no-JS**

In DevTools enable "Emulate prefers-reduced-motion: reduce" and reload: content appears immediately with no movement. Disable JavaScript and reload every page: all content is visible and readable.

- [ ] **Step 6: Verify the Docker image**

```bash
docker build -t wiinvent-ad . && docker run --rm -p 3000:3000 wiinvent-ad
```

Expected: every page renders from the container, images included.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: responsive pass, asset manifest and final verification"
```

---

## Open items carried from the spec

These are tracked in spec §19 and are not blockers for this plan:

- `format_description` and per-format demo media are pending from the business analyst. Until they arrive, detail pages show the name, type, device tabs and placeholder media.
- English error copy for the form is a direct translation pending approval.
- Partner logos beyond TV360 are pending; the clients section reads from an array, so adding them is data-only.
- The real contact backend replaces one marked block in `src/app/api/contact/route.ts`.
- The number of filter groups on the Product Demo page should be confirmed against Figma. This plan implements two groups; adding a third means one more field on `AdFormat` and one more clause in `filterFormats`.
