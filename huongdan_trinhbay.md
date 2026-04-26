### Giới thiệu ngắn (nói bằng miệng)

Chào mọi người, chúng mình là nhóm phát triển một website mẫu cho cửa hàng Mixue. Đây là trang chủ tĩnh được làm bằng **HTML / CSS / JavaScript thuần**, mục tiêu là trình bày giao diện đẹp, responsive và demo tính năng cơ bản: xem sản phẩm, thêm vào giỏ, đặt hàng và phần feedback tự chạy.

### Mục tiêu thuyết trình
- Giới thiệu ý tưởng: giao diện theo phong cách Mixue (đỏ + trắng), đơn giản, dễ nhìn.  
- Trình diễn các phần chính: banner + logo, menu, sản phẩm, lý do chọn Mixue, feedback (carousel), footer.  
- Giải thích sơ qua code từng phần để giám khảo hiểu cách triển khai.

### Cấu trúc file (mở bằng VSCode hoặc Notepad)
- `index.html` — HTML chính của trang.  
- `style.css` — Toàn bộ CSS (layout, màu, responsive).  
- `script.js` — JavaScript nhỏ xử lý carousel và các nút.  
- Thư mục `hinhanh/` chứa ảnh: logo, banner, sản phẩm, ảnh khách hàng.

### Cách mở demo
1. Mở file `index.html` bằng trình duyệt (double-click hoặc kéo thả vào Chrome).  
2. Dùng responsive mode (F12 → Toggle device toolbar) để kiểm tra hiển thị mobile/tablet.

### Gợi ý kịch bản thuyết trình (văn nói, ngắn gọn)
1. "Mở đầu: Xin chào, chúng tôi là nhóm X. Dự án này mô phỏng trang chủ Mixue — mục tiêu giao diện rõ ràng, thân thiện với học sinh/sinh viên."  
2. "Mô tả nhanh cấu trúc: có 3 file chính `index.html`, `style.css`, `script.js`."  
3. "Giới thiệu từng khu vực, demo tương tác: click `Thêm vào giỏ`, click `Đặt ngay`, show carousel feedback tự chạy."  
4. "Nêu điểm kỹ thuật: dùng Flexbox / Grid cho layout, `object-fit: contain` cho ảnh sản phẩm, CSS media queries cho responsive, JS rất nhẹ (không dùng thư viện)."  
5. "Kết: hướng phát triển tiếp (lưu giỏ hàng vào localStorage, thêm form liên hệ, backend, thanh toán)."  

### Giải thích code — từng phần (nói tay, điểm chính)

- Header / Banner / Logo (`index.html`):  
  - HTML: phần banner nằm trong thẻ `header` với class `phanheader` và `bannerlon`. Logo là ảnh `logomixue` đặt absolute để ở góc trên trái.  
  - CSS: `phanheader` có chiều cao cố định (desktop) để banner không quá lớn; ảnh banner `.anhbanner` dùng `object-fit: cover` để phủ khung, logo `.logomixue` dùng `position:absolute` để cố định góc.  

- Thanh điều hướng (navbar):  
  - HTML: danh sách `ul` với class `menuchinh`.  
  - CSS: nền đỏ `#e74c3c`, chữ trắng, hover có hiệu ứng scale nhẹ. Dùng `display:flex` để căn giữa menu.  

- Sản phẩm (card) — vùng `sanphambanchay`:  
  - HTML: mỗi sản phẩm là `div` class `itemsanpham` chứa ảnh `.anhsanpham`, tiêu đề `.tensanpham`, giá `.giatien`, nhãn `.phanloai` và các nút `.btnthemgio` / `.btndatngay`.  
  - CSS: layout dạng grid `.gridsanpham` (CSS Grid). Card bo góc, đổ bóng, hover nâng lên bằng transform. Ảnh sản phẩm dùng `.anhsanpham { object-fit: contain; max-height: 260px }` để **không bị cắt** và giữ tỉ lệ.  

- Khu vực "Vì sao chọn Mixue" (`visaochonmixue`):  
  - HTML: bốn `boxlydo` gọn, mỗi box có icon emoji và mô tả.  
  - CSS: grid 4 cột trên desktop, chuyển 1 cột trên mobile bằng media queries.  

- Feedback (carousel) — `phandanhgia`:  
  - JS: hàm `initCarousel()` sao chép các card feedback để tạo hiệu ứng lặp vô hạn, CSS dùng animation `scrollleft` để chạy ngang.  
  - HTML: các `itemfeedback` chứa `avatarkhach`, `tennguoidanhgia`, `ratingsao`, `contentfeedback`.  

- Footer (`phanduoitrang`): thông tin thương hiệu, hotline, email, địa chỉ. Màu nền đỏ sẫm, chữ trắng.  

### Điểm kỹ thuật nổi bật (nhỏ gọn)
- Không dùng framework, toàn bộ bằng code thuần.  
- Layout: kết hợp Grid (sản phẩm, lý do) và Flexbox (navbar, nút).  
- Responsive: media queries `@media (max-width: 768px)` và `@media (max-width: 480px)`.  
- JavaScript: event listeners cho nút, smooth scroll, clone nodes để kéo dài carousel.  

### Ví dụ code nhỏ (để trình chiếu, đọc nhanh)
```javascript
function themVaoGio(tenSanPham) {
  alert(`Đã thêm "${tenSanPham}" vào giỏ hàng!`);
}

function datNgay(tenSanPham) {
  if (confirm(`Bạn có muốn đặt "${tenSanPham}" không?`)) {
    alert('Cảm ơn, Giỏ hàng của bạn đã được ghi nhận.');
  }
}
```

### Lưu ý khi thuyết trình (cách nói)
- Nói ngắn, mỗi phần 20-30s. Dùng tay chỉ vào màn hình khi demo.  
- Khi nói về code, chỉ nêu ý chính (tại sao chọn Grid/Flexbox, tại sao clone feedback). Đừng đọc toàn bộ code.  
- Kết thúc bằng slide "Phát triển tiếp theo" (3-4 ý): backend, lưu giỏ hàng, thanh toán, quản lý sản phẩm.

### Gợi ý slide order cho nhóm
1. Tiêu đề + thành viên nhóm (10s)  
2. Ý tưởng + mục tiêu (20s)  
3. Demo giao diện (40s) — show banner, navbar, sản phẩm, click tương tác  
4. Kỹ thuật (30s) — HTML/CSS/JS, điểm nổi bật  
5. Demo carousel + test responsive (30s)  
6. Kết luận + hướng phát triển (20s)

Chúc nhóm bảo vệ tốt — nếu muốn, mình có thể export file này thành PDF hoặc tạo slide trình bày từ nội dung (Google Slides/PowerPoint) giúp.  


