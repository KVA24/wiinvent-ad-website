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
| Assets | Kéo trực tiếp từ Figma MCP vào `public/` | File `ydR7PYK7attrgoP2xcuOy3` được cấp quyền edit nên lấy được asset thật. |

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

**Open item (đã đối chiếu Figma):** design có 4 chip — "Bộ lọc" (nút xoá hết) cùng ba nhóm "Thiết bị", "Định dạng", "Loại". Code hiện dựng 2 nhóm hoạt động được (device, type) vì "Định dạng" chưa có trường dữ liệu tương ứng: bảng format trong PDF chỉ có "Loại format" và "Thiết bị hỗ trợ". Cần bên nghiệp vụ định nghĩa "Định dạng" lọc theo gì; khi có, thêm một trường vào `AdFormat` và một mệnh đề vào `filterFormats`.

## 9. Trang detail format

- Hero nền sáng: link "Quay lại" → `/formats`, thông tin format một bên, hình minh hoạ bên còn lại
- Dưới hero: bộ chọn thiết bị, chỉ hiện các thiết bị format đó hỗ trợ
- Đổi thiết bị: cập nhật `?preview=` bằng `router.replace` (shallow), đổi media, **không** reload trang.
  Design đặt cả bộ chọn thiết bị lẫn toàn bộ catalogue (kèm bộ lọc) trên cùng trang detail, nên tab dùng
  `?preview=` còn `?device=` để dành cho bộ lọc catalogue — hai thứ dùng chung một tham số sẽ đá nhau.
- `?preview=` không hợp lệ hoặc format không hỗ trợ → dùng thiết bị mặc định
- Dưới hero là toàn bộ danh sách format, đúng như design
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

Home: `nav_sdk`, `nav_demo`, `nav_contact`, `cta_demo`, `hero_title`, `hero_description`, `cta_formats`, `cta_consultation`, `platform_title`, `platform_list`, `performance_title` + 3 số liệu (VI `137M+ Ad impression/month`, `10+ Advertiser`, `5M+ UIDs reach/tháng`; EN `137M+ Ad impressions/month`, `10+ Advertisers`, `5M+ UIDs reach/month` — giữ nguyên đơn vị và cách viết), `advantage_01..06` + `accordion_01..06`, `clients_title`, `contact_title`, `contact_description`, `contact_cta`.

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

Chuyển động lấy từ prototype Figma (`get_motion_context`), giữ nguyên keyframe:

| Trang | Node | Chuyển động |
|---|---|---|
| Home | `2655:7054` | Hexagon trái trôi dọc `y [0, 114.051, 61.344, 0]`, 3.684s, linear, lặp vô hạn |
| Home | `2655:7094` | Hexagon phải trôi ngang `x [0, -250, -126.358, 0]`, 3.684s, linear, lặp vô hạn |
| SDK | `3055:11349` | Code panel `x [-27.833, 0.02, -27.98]`, 2.214s, boomerang |
| SDK | `3055:11414` | Badge SDK `x [18.983, 1.096, 17.958]`, `y [-14.986, 4.383, -13.867]`, 2.214s, boomerang |
| SDK | `3055:11368` | Sơ đồ `y [53.697, 0, 50.409]`, 2.214s, boomerang |
| Product Demo | `2675:5049` / `2675:5533` | Khối chữ trượt từ `x -51.5`, mockup từ `x 130.5`, 2s, chạy một lần |
| Format detail | `2919:5246` | Mockup trượt từ `x 130.5`, chạy một lần |
| Contact | `2448:7988` / `2448:7789` | Tiêu đề trồi từ `y 49`, ảnh thiết bị từ `y 117`, chạy một lần |
| Home | `2531:8160` Gear set | State 1→2 ping-pong 5s linear: cụm bánh răng chìm +25.5px, rocket bay lên −43.8px |
| Home (mobile) | Pride set `2995:9109` | Marquee 3 stat card trôi trái liên tục, ~648px/5s linear, lặp liền mạch |
| Contact | Heading Display `2448:7969→7971→7973` | Shimmer glow `#5ed5fe`: 1 lớp (12px) → 4 lớp (12/20/32/56) → 2 lớp (12/20), mỗi bước giữ 500ms + chuyển 1500ms ease-out, chu kỳ 6s |
| Menu mobile | `2903:8434` | Trượt vào từ **trái**, rộng 330px, mở 300ms ease-out, đóng slide-out trái ~380ms |
| Mọi hover/press | 1885 interaction ON_HOVER | 300ms EASE_OUT thống nhất — `--duration-base` đặt 300ms và mọi hover dùng token này |

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

## 16. Đối chiếu design (bổ sung sau khi có quyền Figma)

Bộ token thật nằm ở `docs/design/tokens.json` và đã vào `src/app/globals.css`.
Font: Bai Jamjuree (tiêu đề), Inter (nội dung), Manrope (dòng bản quyền), JetBrains Mono (đoạn code SDK).

Những điểm design bổ sung so với PDF:

| Hạng mục | Nội dung |
|---|---|
| Hero mọi trang | Nền ảnh tối phủ lớp đen 40%, không phải nền trắng |
| Section "Ưu điểm" | Có tiêu đề riêng, PDF không nhắc |
| Trang SDK | Thêm sơ đồ tích hợp (code editor + Ad Server + thẻ nền tảng) và 4 thẻ năng lực trên panel kính |
| Card format | Vẽ bằng vector, không dùng ảnh thumbnail |
| Trang detail | Thẻ kính chứa thông số creative (Format / Resolution / Size / Tracking Metrics) |
| Popup kết quả | Có phần thân và lời kết đầy đủ, PDF chỉ ghi tiêu đề |
| Padding trang | 72px (1440), 36px (768), 24px (375) |

Chỗ design và PDF mâu thuẫn, code theo PDF vì PDF là hợp đồng nội dung:

| Điểm | Design | PDF | Code theo |
|---|---|---|---|
| Số liệu bản VI | `UIDs reach/month` | `UIDs reach/tháng` | PDF |
| Stat card trên mobile | Marquee ngang tự trôi | Xếp dọc / thu hẹp | **Design** — export prototype (Pride set `2995:9109` + interactions 5000ms LINEAR hai chiều) chứng minh tràn mép là marquee chủ ý, không phải lỗi dàn trang |
| Icon nền tảng trên mobile | Hàng ngang tràn mép | Xếp lại nhiều dòng | PDF |
| Nhãn trường nội dung | `Nhu cầu của bạn`, bắt buộc | `Nội dung yêu cầu`, không bắt buộc | PDF |

## 17. Assets

Đã kéo từ Figma qua MCP vào `public/`. Danh sách còn thiếu nằm ở `public/README.md`.

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

## 18. Kiểm thử

Một file `vitest`, chỉ phủ logic không hiển nhiên:
- `filter-formats`: OR trong nhóm, AND giữa nhóm, tìm kiếm kết hợp filter, nhóm rỗng không giới hạn, không khớp trả mảng rỗng
- `contact-schema`: số điện thoại hợp lệ/không hợp lệ, field bắt buộc thiếu, website rỗng vẫn pass
- Motion: khi reduced-motion bật, variant trả về duration 0

Không snapshot UI.

## 19. Docker

Multi-stage: `deps` → `builder` → `runner` trên `node:22-alpine`, chạy `output: 'standalone'`, non-root user, expose 3000. `sharp` cài ở stage runner để `next/image` hoạt động.

## 20. Trạng thái đối chiếu design

Đã dựng lại theo Figma và kiểm ở 4 breakpoint: Home, SDK, Product Demo,
Format detail, Contact, cùng popup kết quả. Kiểm tự động 9 trang (VI + EN)
× 375/768/1024/1440: không trang nào tràn ngang, mỗi trang đúng một `h1`
chiếm đủ chiều rộng. `lint`, `tsc --noEmit`, 30 test và `next build`
(33 trang tĩnh) đều sạch.

Motion lấy từ prototype (§14). Sau khi hết hạn mức Figma MCP, phần còn thiếu
được trích từ bản export REST đầy đủ tại `docs/figma_export/` (26.706 node,
3.444 interaction): gear/rocket, marquee stat card mobile, shimmer tiêu đề
Contact, hướng + kích thước menu mobile, và chuẩn hover 300ms EASE_OUT.
Copy đối chiếu bằng `text_content.csv` (61 chuỗi desktop khớp; các lệch còn
lại đều là typo của design — `Wiivent`, `PNJ` — hoặc conflict PDF đã ghi ở
§16). Màu đối chiếu bằng `effects.csv`: mọi màu UI nằm trong token, phần
ngoài token là vector minh hoạ.

## 21. Việc còn thiếu

**Chờ asset từ Figma** (hết hạn mức MCP 20 call/tháng của tài khoản; giới hạn
tính theo tài khoản nên tạo file copy mới không mở thêm quota):

| File | Node | Hiện trạng |
|---|---|---|
| `stats-bg.png` | nền `2445:2684` | Figma export ra PNG trắng; đã vẽ lại hoa văn vòng cung theo bản render, thay được khi có export thật |
| `icon-android.svg` | tile Android trong `2995:8609` | Figma trả trùng asset iOS; đang dùng mark Android khác, đã giữ đúng tỉ lệ vẽ 42×24 nên không bị méo |

`stat-3.png` đã có ảnh thật (commit `2f63512`).

**Chờ bên nghiệp vụ:**

- `specs` của 8 format còn lại — design chỉ ghi thông số cho Leaderboard Banner
- Media demo từng format × thiết bị (`public/formats/<slug>-<device>.png`)
- Bản EN của message lỗi form (đang là bản dịch trực tiếp, chưa duyệt)
- Logo đối tác ngoài TV360
- Định nghĩa dữ liệu cho nhóm lọc thứ ba "Định dạng" (§8)
- Endpoint backend thật cho form liên hệ

Hai lưới hexagon trong section Ưu điểm dùng chung một ảnh export: đối chiếu
vector của `2655:7066` và `2655:7106` cho thấy Figma vẽ cùng lưới, chỉ khác
tỉ lệ (716×660 so với 635×546), nên bản bên phải là cùng ảnh phóng theo đúng
tỉ lệ đó — không phải xấp xỉ.
