# Bàn giao design token — điền rồi báo mình

Nguồn: Figma `eK9ZSi25mM9lcukNHZ816m`, page `172:8075`.

## Cách lấy nhanh nhất

1. Trong Figma, Menu → Plugins → tìm **"Design Tokens"** (Lukas Oppermann) hoặc **"variables2css"**, chạy Export → lưu JSON vào `docs/design/tokens.json`.
2. Nếu file không dùng Variables/Styles, plugin sẽ ra rỗng. Khi đó điền tay các bảng dưới — chọn layer trong Figma, đọc panel Design bên phải.

Chỉ cần **1** trong 2 cách. Có `tokens.json` thì bỏ qua toàn bộ bảng dưới.

---

## 1. Màu

Chọn từng vùng, copy mã hex ở panel Fill.

| Vai trò | Lấy ở đâu | Hex |
|---|---|---|
| Brand chính (nút CTA) | Nút "Đăng ký Demo" ở header | |
| Brand đậm (footer) | Nền footer | |
| Brand nhạt (chip/nền phụ) | Chip "Banner Standard" trên card format | |
| Chữ chính | Tiêu đề H1 hero | |
| Chữ phụ | Đoạn mô tả dưới H1 | |
| Nền trang | Nền trắng section hero | |
| Nền section xen kẽ | Nền section "Hiệu quả thực tế" | |
| Viền | Viền card format | |
| Lỗi | Viền đỏ field lỗi ở form Contact | |
| Nền form Contact | Panel xanh nhạt chứa form | |

## 2. Typography

Chọn từng text layer, đọc panel Text: font, weight, size, line-height, letter-spacing.

| Cấp | Layer mẫu | Font | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| H1 | "Giải pháp quảng cáo trên nền tảng số" | | | | | |
| H2 | "Phủ sóng toàn bộ nền tảng" | | | | | |
| H3 | Tên format trên card | | | | | |
| Body | Mô tả dưới H1 | | | | | |
| Body nhỏ | Nhãn field form | | | | | |
| Số liệu | "137M+" | | | | | |
| Nút | Chữ trong nút CTA | | | | | |
| Chip | Chữ trong chip loại format | | | | | |

Font family dùng ở đâu ra: Google Fonts hay file riêng? Nếu file riêng, gửi kèm `.woff2`.

## 3. Kích thước & khoảng cách

Chọn frame `Home_Desk` (2406:2828) rồi các frame con.

| Giá trị | Cách đo | Kết quả |
|---|---|---|
| Chiều rộng content tối đa | Bề rộng khối text hero (không tính padding trang) | |
| Padding ngang trang, desktop | Khoảng cách mép trái frame → mép trái logo | |
| Padding ngang trang, mobile | Trên frame `Home_Mb` (2747:3187) | |
| Padding dọc mỗi section, desktop | Khoảng trắng trên/dưới section "Ưu điểm" | |
| Padding dọc mỗi section, mobile | Trên frame mobile | |
| Chiều cao header | Frame `2865:15309` | |
| Gap giữa card format | Khoảng cách 2 card cạnh nhau, desktop | |
| Số cột lưới format, desktop | Đếm trên `Desk_SKU` (2633:2693) | |
| Số cột lưới format, tablet | Trên `Tb_SKU` (2856:8694) | |
| Border-radius nút | | |
| Border-radius card | | |
| Border-radius input | | |

## 4. Trạng thái component

Mỗi ô điền hex (và border nếu có).

| Component | Default | Hover | Focus/Selected | Disabled/Error |
|---|---|---|---|---|
| Nút primary | | | | |
| Nút secondary | | | | |
| Input (`2633:5715`) | | | | |
| Dropdown option (`2675:6881`) | | | | |
| Chip filter | | | | |
| Card format | | | | |
| Tab thiết bị (`2769:6121`) | | | | |

## 5. Shadow

| Nơi dùng | Giá trị CSS |
|---|---|
| Card format | |
| Header khi scroll | |
| Popup thông báo | |

## 6. Prototype / motion

Nếu file có prototype (Shift+Space để xem): mỗi transition ghi lại animation type, duration (ms), easing curve. Không có thì ghi "không có" — mình giữ bộ token motion hiện tại.

---

## Assets còn thiếu

Export vào `public/` theo `public/README.md`. Ưu tiên theo thứ tự:

1. `formats/<slug>-thumb.png` — 9 file, 640x360. Thiếu cái này thì trang Demo trống ảnh.
2. `formats/<slug>-<device>.png` — ~24 file, 800x600. Trang detail.
3. `logo.svg` — header và footer đang dùng chữ "WIINVENT" thay tạm.
4. `og-default.png` 1200x630, `favicon.ico` 32x32.
