# Hướng dẫn Sử dụng & Chỉnh sửa Link Affiliate - Casio Study Desk PWA

## 1. Cấu trúc thư mục PWA chuẩn
- `index.html`: Toàn bộ giao diện, bộ giải toán Offline, chế độ Bảng tính (Spreadsheet), công cụ chụp Snapshot nhiều bước (PNG/PDF/Clipboard), chế độ PiP và cấu hình Affiliate.
- `manifest.json`: File cấu hình cài đặt ứng dụng PWA lên màn hình chính (Add to Home Screen) cho iOS, Android, Windows, macOS.
- `sw.js`: Service Worker lưu đệm toàn bộ ứng dụng để học sinh mở dùng **100% Offline** ở trường khi không có Wi-Fi/4G.

## 2. Cách gắn / sửa Link Affiliate (Chỉ mất 30 giây)
Mở file `index.html` bằng bất kỳ trình soạn thảo nào (Notepad, VS Code...), tìm ngay phần đầu thẻ `<script>` có đánh dấu:

```javascript
const AFFILIATE_CONFIG = {
  enabled: true,
  bannerText: "Đang luyện bấm máy? Tham khảo máy tính Casio chính hãng bảo hành 7 năm Bitex:",
  products: [
    {
      id: "fx-580vnx",
      modelMatch: "580", // Tự động nổi bật khi đang dùng máy 580
      name: "Máy tính Casio fx-580VN X Chính Hãng Bitex",
      badge: "Bán chạy số 1 THPT",
      priceHint: "Khoảng 650.000đ - 720.000đ",
      desc: "Màn hình tiếng Việt, 521 tính năng, tốc độ xử lý nhanh gấp 4 lần, được mang vào phòng thi.",
      shopeeUrl: "https://shopee.vn/", // <-- DÁN LINK AFFILIATE SHOPEE CỦA BẠN VÀO ĐÂY
      tiktokUrl: "https://www.tiktok.com/" // <-- DÁN LINK AFFILIATE TIKTOK SHOP CỦA BẠN VÀO ĐÂY
    },
    ...
  ]
};
```
- Bạn chỉ cần thay đường dẫn trong `shopeeUrl` và `tiktokUrl`, hoặc copy thêm 1 khối `{ ... }` nếu muốn thêm sản phẩm mới.
- Nếu muốn để trống link nào (ví dụ chỉ có link Shopee, không có TikTok), chỉ cần để `tiktokUrl: ""` là nút đó sẽ tự ẩn.

## 3. Cách đưa lên mạng miễn phí để học sinh cài PWA Offline
- **Cách 1 (GitHub Pages):** Tạo 1 repository trên GitHub, tải 3 file `index.html`, `manifest.json`, `sw.js` lên và bật GitHub Pages.
- **Cách 2 (Vercel / Netlify / Cloudflare Pages):** Kéo thả thư mục này vào trang quản lý của Vercel hoặc Cloudflare Pages là có ngay tên miền `https://...` chuẩn PWA trong 10 giây.
