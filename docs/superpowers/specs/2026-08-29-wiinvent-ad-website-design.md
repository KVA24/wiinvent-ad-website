# Website Wiinvent Ad — Thiết kế kỹ thuật

Ngày: 2026-08-29
Nguồn: `Website_Code_Handoff_Spec.pdf`, Figma `eK9ZSi25mM9lcukNHZ816m` (page `172:8075` — 🔵 UI_Phase 1)

## 1. Mục tiêu & phạm vi

Website giới thiệu giải pháp quảng cáo trên nền tảng số của Wiinvent: các định dạng quảng cáo, phạm vi nền tảng hỗ trợ, SDK, và kênh liên hệ/đăng ký demo.

Trong phạm vi:
- 5 trang: Home, SDK, Product Demo (danh sách format), Format detail, Contact
- Song ngữ Việt/Anh
- SEO đầy đủ (metadata, hreflang, sitemap, robots, JSON-LD, OG)
- Responsive: desktop 1440, tablet 768, mobile 375
- Form liên hệ có validation + popup kết quả

Ngoài phạm vi (PDF §3.3 nêu rõ): đăng nhập, CMS quản trị nội dung, tracking, email marketing.

## 2. Quyết định kiến trúc

| Quyết định | Chọn | Lý do |
|---|---|---|
| Nguồn nội dung | JSON i18n + file data TypeScript trong repo | Không có CMS (yêu cầu). Nội dung đã cố định dạng bảng key→VI/EN. |
| Rendering | SSG toàn bộ, trừ `/api/contact` | Nội dung tĩnh, tốc độ + SEO tối đa. |
| URL đa ngôn ngữ | Prefix cả hai: `/vi/...`, `/en/...`; `/` → redirect `/vi` | hreflang sạch, Google index đủ 2 bản. |
| Trang detail format | `/formats/[slug]`, thiết bị là state (`?device=`) | 3 biến thể thiết bị chỉ khác media → tách URL sẽ thành duplicate content. |
| Backend form | Route handler stub (`/api/contact`) | Backend thật chưa quyết. Interface để ngỏ. |
| Deploy | Docker image, `output: 'standalone'` | Hệ thống deploy chốt sau. Loại trừ static export. |
| Assets | Bên thiết kế export từ Figma vào `public/` | Figma MCP đang bị rate-limit (Starter plan). |

Đã cân nhắc và loại: MDX per-page (thêm tầng cho nội dung ít thay đổi), headless CMS (yêu cầu loại trừ), static export (mất route handler cho form).

## 3. Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4, design token từ Figma khai báo dạng CSS variables
- `next-intl` — routing prefix, dictionary, language switcher
- `react-hook-form` + `zod` — form Contact
- `next/image` + `sharp` (bundle trong Docker image)
- `motion` (framer-motion v11+) — animation, nạp qua `LazyMotion` + `domAnimation` (~18KB gzip)
- `vitest` — kiểm thử logic lọc + schema
- Không dùng: state management library, UI component library

## 4. Cấu trúc thư mục

```
src/
  app/
    [locale]/
      layout.tsx              # Header, Footer, JSON-LD Organization, ScrollToTop
      page.tsx                # Home
      sdk/page.tsx
      formats/page.tsx        # Product Demo
      formats/[slug]/page.tsx # Format detail
      contact/page.tsx
    api/contact/route.ts
    sitemap.ts
    robots.ts
  components/
  data/formats.ts
  lib/filter-formats.ts
  lib/contact-schema.ts
  lib/seo.ts
  i18n/routing.ts
messages/vi.json
messages/en.json
public/
```

## 5. Routes

| Route | Frame Figma | Render | Ghi chú |
|---|---|---|---|
| `/[locale]` | `2406:2828` desk / `2849:3551` tablet / `2747:3187` mobile | SSG | |
| `/[locale]/sdk` | `3043:7980` / `3043:9730` / `3055:10260` | SSG | |
| `/[locale]/formats` | `2633:2693` / `2856:8694` / `2811:6782`; dropdown `2675:7812` | SSG | Lọc client-side |
| `/[locale]/formats/[slug]` | `2675:13396` (Mobile) / `2769:6612` (PC) / `2769:6278` (TV) | SSG × 9 × 2 | |
| `/[locale]/contact` | `2448:7642`; success `2675:5991`; error `2985:8079` | SSG | |
| `/api/contact` | — | Dynamic | POST |

`generateStaticParams` sinh 9 slug × 2 locale = 18 trang detail.

## 6. Điều hướng

Header (nền trắng, logo trái, menu + CTA phải):
- Logo → Home
- SDK → `/sdk`
- Demo → `/formats`
- Liên hệ → `/contact`
- CTA "Đăng ký Demo" → `/contact`
- Language switcher VI/EN — giữ nguyên đường dẫn hiện tại khi đổi
- Mobile: thu gọn thành logo + hamburger, mở drawer (Figma `2903:8434` Menu Expand)

Footer (nền xanh đậm, dùng chung mọi trang): logo + mô tả, nhóm link SDK/Demo/Liên hệ, địa chỉ, copyright, nút "Đăng ký Demo".
Nút scroll-to-top cố định góc dưới phải mọi trang.

## 7. Data model

`src/data/formats.ts` — single source of truth cho `/formats`, `/formats/[slug]`, và sitemap.

```ts
export type Device = 'mobile' | 'pc' | 'smart-tv'
export type FormatType = 'banner-standard' | 'welcome' | 'instream-video'

export type AdFormat = {
  slug: string       // dùng trong URL
  key: string        // khớp key trong bảng PDF, dùng tra i18n
  type: FormatType
  devices: Device[]  // phần tử đầu = tab thiết bị mặc định
  thumbnail: string
  media: Partial<Record<Device, string>>
}
```

| # | slug | key | type | devices |
|---|---|---|---|---|
| 1 | `leaderboard-banner` | `leaderboard_banner` | banner-standard | mobile, pc, smart-tv |
| 2 | `in-page-banner` | `in_page_banner` | banner-standard | mobile, pc, smart-tv |
| 3 | `side-banner` | `side_banner` | banner-standard | pc |
| 4 | `pause-banner` | `pause_banner` | banner-standard | mobile, pc, smart-tv |
| 5 | `welcome-banner` | `welcome_banner` | welcome | mobile, pc, smart-tv |
| 6 | `welcome-tvc` | `welcome_tvc` | welcome | mobile, smart-tv |
| 7 | `pre-roll-instream` | `pre_roll_instream` | instream-video | mobile, pc, smart-tv |
| 8 | `mid-roll-instream` | `mid_roll_instream` | instream-video | mobile, pc, smart-tv |
| 9 | `post-roll-instream` | `post_roll_instream` | instream-video | mobile, pc, smart-tv |

Tên hiển thị và mô tả format nằm trong i18n (`format.<key>.name`, `format.<key>.description`), không hardcode trong data.

## 8. Lọc & tìm kiếm (trang `/formats`)

`src/lib/filter-formats.ts` — hàm thuần, không phụ thuộc React.

Quy tắc (PDF §4.3):
- Nhiều giá trị trong cùng một nhóm filter: **OR**
- Giữa các nhóm filter khác nhau: **AND**
- Từ khoá tìm kiếm kết hợp với filter: **AND**; so khớp tên format, bỏ dấu, không phân biệt hoa thường
- Nhóm không chọn giá trị nào: không giới hạn kết quả
- Không có format phù hợp: hiển thị empty state

State lưu trong `searchParams` (`?device=`, `?type=`, `?q=`) — link chia sẻ được, back/forward hoạt động đúng.

**Open item:** Figma hiển thị 4 chip filter; PDF liệt kê nhãn "Thiết bị, Định dạng, Loại". Spec này định nghĩa 2 nhóm (device, type). Đối chiếu lại Figma khi implement; nếu có nhóm thứ ba, bổ sung trường vào `AdFormat` và một nhóm vào hàm lọc — cấu trúc hàm không đổi.

## 9. Trang detail format

- Hero nền sáng: link "Quay lại" → `/formats`, thông tin format một bên, hình minh hoạ bên còn lại
- Dưới hero: bộ chọn thiết bị, chỉ hiện các thiết bị format đó hỗ trợ
- Đổi thiết bị: cập nhật `?device=` bằng `router.replace` (shallow), đổi media, **không** reload trang
- `?device=` không hợp lệ hoặc format không hỗ trợ → dùng thiết bị mặc định
- `canonical` luôn trỏ URL không query, tránh duplicate content
- Mỗi format × thiết bị có media riêng — không gộp nhiều format vào một ảnh

## 10. Form Liên hệ

`src/lib/contact-schema.ts` — schema zod dùng chung client và server.

| Field | Kiểu | Bắt buộc | Rule | Message lỗi (VI) |
|---|---|---|---|---|
| `fullName` | text | Có | ≥ 2 ký tự | Vui lòng nhập họ và tên hợp lệ |
| `phone` | text | Có | `^0\d{9,11}$` hoặc `^\+84\d{8,9}$`, dài 10–12 | Vui lòng nhập số điện thoại hợp lệ |
| `email` | email | Có | định dạng email, ≥ 5 ký tự | Vui lòng nhập email hợp lệ |
| `company` | text | Có | ≥ 2 ký tự | Vui lòng nhập tên doanh nghiệp |
| `website` | url | Không | URL hợp lệ nếu có nhập | Vui lòng nhập website hợp lệ |
| `message` | textarea | Không | — | — |
| `consent` | checkbox | Không | chỉ ghi nhận checked/unchecked | — |

Hành vi:
- Field bắt buộc đánh dấu `*`
- Lỗi: viền đỏ + message ngay dưới field
- Nút "Gửi" cuối form, disabled trong lúc submit
- Submit thành công → dialog "Cảm ơn Quý khách"
- Submit lỗi → dialog lỗi
- Dialog có 4 biến thể trong Figma: Size Big/Small × State Success/Error (`2448:4145`)

`POST /api/contact`:
- Validate lại toàn bộ payload bằng chính schema zod ở server — không tin dữ liệu client
- Rate limit theo IP (in-memory, cửa sổ trượt) để chặn spam
- Hiện tại: log payload, trả `200 {ok:true}`. Lỗi validate trả `400` kèm field lỗi.
- Khi có backend thật: chỉ thay phần thân handler, hợp đồng với client không đổi

## 11. i18n

`messages/vi.json` và `messages/en.json`, key đúng theo bảng trong PDF.

Home: `nav_sdk`, `nav_demo`, `nav_contact`, `cta_demo`, `hero_title`, `hero_description`, `cta_formats`, `cta_consultation`, `platform_title`, `platform_list`, `performance_title` + 3 số liệu (`137M+ Ad impressions/month`, `10+ Advertisers`, `5M+ UIDs reach/month` — giữ nguyên đơn vị và cách viết), `advantage_01..06` + `accordion_01..06`, `clients_title`, `contact_title`, `contact_description`, `contact_cta`.

SDK: `sdk_title`, `sdk_description`, `sdk_cta`, `platform_list`.

Format detail: `back_link`, `available_on`, `device_mobile`, `device_pc`, `device_smart_tv`, `format.<key>.name`, `format.<key>.type`, `format.<key>.description`.

Contact: `contact_hero_title`, `company_name`, `form_title`, nhãn + placeholder từng field, `success_title`, `error_title`.

`nav_sdk` / `nav_demo` bản EN để trống trong PDF → dùng "SDK" / "Demo".

## 12. Component

`Header` (drawer mobile + language switcher) · `Footer` · `Button` · `Accordion` (6 ưu điểm, mở một item, click item khác thì item cũ đóng) · `StatCard` · `PlatformIcons` · `FormatCard` · `FilterDropdown` (Default/Hover/Choose) · `SearchInput` (Default/Hover/Typing/Focus) · `DeviceTabs` · `Input` · `Checkbox` · `NotificationDialog` · `ScrollToTop`.

Trạng thái selected/active bắt buộc có (PDF §3.3) cho: nút CTA, card format, mục filter, tab thiết bị, item Ưu điểm.

## 13. Responsive

| Breakpoint | Layout |
|---|---|
| ≥1440 | Header ngang; Hero chia vùng chữ/media; lưới format 4 cột |
| 768–1439 | Nội dung thu hẹp; lưới format 3 cột |
| <768 | Header thu gọn + hamburger; section xếp dọc; format 1 cột; hình và form co giãn theo chiều rộng |

Media giữ đúng tỷ lệ, không méo, không che khuất nội dung.

## 14. Motion

Bộ token motion khai báo một lần, dùng chung cho cả CSS và `motion`:

| Token | Giá trị |
|---|---|
| `duration.fast` | 150ms |
| `duration.base` | 250ms |
| `duration.slow` | 400ms |
| `duration.entrance` | 600ms |
| `ease.standard` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `ease.emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `distance.reveal` | 24px |
| `stagger` | 60ms |

Pattern áp dụng:

| Vị trí | Motion |
|---|---|
| Mọi section | Reveal khi vào viewport: opacity 0→1, y 24→0, `once: true` |
| Icon nền tảng, stat card, lưới format | Stagger 60ms từng item |
| Hero | Entrance có stagger khi mount; media parallax nhẹ theo scroll (`useScroll`) |
| Số liệu 137M+ / 10+ / 5M+ | Count-up khi vào viewport, giữ nguyên đơn vị và hậu tố |
| Lưới format khi lọc | `layout` + `AnimatePresence popLayout` |
| Card format → trang detail | Shared element qua `layoutId` trên thumbnail |
| Accordion Ưu điểm | Height auto + chevron xoay 180° |
| Tab thiết bị (trang detail) | Media crossfade + indicator trượt bằng `layoutId` |
| Header | Co lại + blur khi scroll — CSS thuần, không dùng lib |
| Drawer mobile | Slide-in từ phải + backdrop fade |
| Dialog success/error | Scale 0.96→1 + backdrop fade, có exit animation |
| Chuyển trang | Fade nhẹ qua `template.tsx` |
| Hover/press button, card | CSS transition thuần |

Ràng buộc bắt buộc:
- `MotionConfig reducedMotion="user"` ở layout. Khi `prefers-reduced-motion: reduce`, mọi transform/opacity animation bị tắt, nội dung hiện ngay.
- Chỉ animate `transform` và `opacity` (không animate `width`/`height`/`top`/`left`), ngoại lệ duy nhất là accordion.
- Phần tử LCP của hero (tiêu đề và ảnh chính) không fade-in — tránh làm xấu LCP.
- `<noscript>` override `opacity: 1` cho mọi phần tử reveal: JS lỗi vẫn đọc được nội dung, không ảnh hưởng crawler.
- Motion wrapper là client component nhỏ; page vẫn là server component.

## 15. SEO

- `generateMetadata` mỗi trang: title, description, OG, Twitter card theo locale
- `alternates.canonical` + `alternates.languages` (`vi`, `en`, `x-default`) trên mọi trang
- `app/sitemap.ts` sinh từ danh sách route tĩnh + 9 format × 2 locale
- `app/robots.ts` cho phép index, trỏ sitemap
- JSON-LD: `Organization` ở layout (tên công ty, địa chỉ 96 Hoàng Ngân, Yên Hoà, Cầu Giấy, Hà Nội); `ItemList` ở `/formats`; `BreadcrumbList` + `Product` ở trang detail
- Mọi ảnh qua `next/image` với width/height cố định → CLS = 0
- Heading một `h1` mỗi trang, phân cấp h2/h3 đúng thứ tự
- `lang` attribute trên `<html>` theo locale

## 16. Assets

Bên thiết kế export từ Figma vào `public/`:

```
logo.svg
icon-ios.svg  icon-android.svg  icon-smart-tv.svg  icon-tv-box.svg  icon-web.svg
hero-devices.png
stats-bg.png
advantages.png
contact-illustration.png
contact-banner.png
sdk-hero.png
sdk-code.png
clients/tv360.svg
formats/<slug>-thumb.png                 (9 file)
formats/<slug>-<device>.png|mp4          (~25 file, theo ma trận §7)
```

Thiếu file → build vẫn chạy, hiển thị placeholder đúng tỷ lệ.

## 17. Kiểm thử

Một file `vitest`, chỉ phủ logic không hiển nhiên:
- `filter-formats`: OR trong nhóm, AND giữa nhóm, tìm kiếm kết hợp filter, nhóm rỗng không giới hạn, không khớp trả mảng rỗng
- `contact-schema`: số điện thoại hợp lệ/không hợp lệ, field bắt buộc thiếu, website rỗng vẫn pass
- Motion: khi reduced-motion bật, variant trả về duration 0

Không snapshot UI.

## 18. Docker

Multi-stage: `deps` → `builder` → `runner` trên `node:22-alpine`, chạy `output: 'standalone'`, non-root user, expose 3000. `sharp` cài ở stage runner để `next/image` hoạt động.

## 19. Việc còn thiếu (chờ bên nghiệp vụ)

- `format_description` và `format_media` từng format — PDF ghi "BA gửi sau"
- Bản EN của các message lỗi form
- Logo đối tác ngoài TV360 (design định hướng hiển thị nhiều logo)
- Endpoint backend thật cho form liên hệ
- Xác nhận số nhóm filter trên trang Product Demo (§8)
- Đối chiếu bộ token motion (§14) với prototype trong Figma — hiện chưa pull được do Figma MCP hết quota gói Starter
