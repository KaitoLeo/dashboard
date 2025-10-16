# Hệ thống Routing & Navigation - Actiwell Dashboard

## Tổng quan

Hệ thống routing mới được thiết kế để chuẩn hóa URL phân cấp cha/con cho toàn bộ danh mục & chi tiết, với cấu trúc:

```
/{group}/{category}/{slug}.html
```

## Cấu trúc URL

### Cấp 1: Groups

- `checkin` - Check-in
- `members` - Hội viên
- `reports` - Báo cáo

### Cấp 2: Categories

- `checkin/frequency` - Tần suất check-in
- `checkin/late-checkin` - Check-in sai giờ
- `checkin/mtd` - Tháng này
- `checkin/departments` - Theo bộ phận
- `members/list` - Danh sách hội viên

### Cấp 3: Detail Pages

- `checkin/frequency/checkin-hom-nay.html` - Check-in hôm nay
- `checkin/frequency/checkin-hom-qua.html` - Check-in hôm qua
- `checkin/late-checkin/checkin-sai-gio-hom-nay.html` - Check-in sai giờ hôm nay
- `members/list/danh-sach-hoi-vien.html` - Danh sách hội viên

## Các file chính

### 1. `assets/js/router/url-mapping.js`

- Định nghĩa cấu trúc URL mapping
- Xử lý redirect từ URL cũ sang URL mới
- Quản lý navigation tree

### 2. `assets/js/components/HeaderBreadcrumbs.js`

- Component hiển thị breadcrumb trong header
- Tự động dựng breadcrumb từ route tree
- Responsive design với truncation

### 3. `assets/js/helpers/url-builder.js`

- Helper functions để tạo URL và slug
- Tạo canonical URL cho SEO
- Generate meta tags

### 4. `assets/js/navigation-init.js`

- Khởi tạo breadcrumb và navigation
- Cập nhật metric cards với navigation mới
- Setup global navigation handlers

### 5. `assets/js/tests/e2e-navigation-test.js`

- Test suite E2E cho navigation
- Kiểm tra metric card navigation
- Test breadcrumb display và URL structure

## Cách sử dụng

### 1. Thêm breadcrumb vào trang

```html
<div id="breadcrumb-container" class="mt-2"></div>
```

### 2. Khởi tạo breadcrumb

```javascript
const breadcrumb = new HeaderBreadcrumbs("breadcrumb-container");
```

### 3. Tạo navigation cho metric card

```html
<div class="card" data-navigate="checkin/frequency/checkin-hom-nay.html">
  <!-- Card content -->
</div>
```

### 4. Sử dụng URL builder

```javascript
const urlBuilder = new URLBuilder();

// Tạo URL cho trang chi tiết
const url = urlBuilder.buildDetailURL(
  "checkin",
  "frequency",
  "checkin-hom-nay",
  {
    date: "2024-01-15",
    store: "ton-that-thuyet",
  }
);
// Kết quả: /checkin/frequency/checkin-hom-nay.html?date=2024-01-15&store=ton-that-thuyet

// Tạo slug từ tiêu đề
const slug = urlBuilder.createSlug("Check-in Hôm nay");
// Kết quả: checkin-hom-nay
```

## Tính năng chính

### 1. Nested Routes

- URL có cấu trúc phân cấp rõ ràng
- Dễ dàng mở rộng thêm categories mới
- SEO-friendly URLs

### 2. Breadcrumb Navigation

- Tự động hiển thị đường dẫn hiện tại
- Các cấp trước là link, cấp cuối là text
- Responsive với truncation khi quá dài

### 3. Legacy URL Support

- Tự động redirect URL cũ sang URL mới
- 301 redirect cho SEO
- Không ảnh hưởng đến trải nghiệm người dùng

### 4. Query Parameter Preservation

- Giữ nguyên filter state khi navigate
- Deep linking hoạt động đúng
- GlobalFilterState được duy trì

### 5. SPA Navigation

- Không reload toàn trang
- Smooth navigation experience
- Browser back/forward support

## Testing

### Chạy E2E tests

```javascript
// Trong console browser
const testSuite = new E2ENavigationTest();
testSuite.runAllTests();
```

### Test cases bao gồm:

- ✅ Metric card navigation
- ✅ Breadcrumb display
- ✅ URL structure validation
- ✅ Legacy URL redirects
- ✅ Query parameter preservation
- ✅ Direct URL access

## Cấu hình

### Thêm trang mới

1. Cập nhật `URL_MAPPING` trong `url-mapping.js`
2. Thêm navigation data cho metric cards
3. Test với E2E test suite

### Customize breadcrumb

1. Sửa CSS trong `HeaderBreadcrumbs.js`
2. Thay đổi separator hoặc styling
3. Test responsive design

## Lưu ý

- Tất cả URL mới phải có extension `.html`
- Slug phải bất biến (không đổi theo tiêu đề)
- Nếu đổi slug, thêm redirect trong `redirects` object
- Test thoroughly trước khi deploy production

## Troubleshooting

### Breadcrumb không hiển thị

- Kiểm tra container ID có đúng không
- Đảm bảo script được load đúng thứ tự
- Check console có lỗi JavaScript không

### Navigation không hoạt động

- Kiểm tra `data-navigate` attribute
- Đảm bảo URL mapping đúng
- Test với E2E test suite

### Legacy URL không redirect

- Kiểm tra redirect mapping
- Đảm bảo URL cũ được thêm vào `redirects` object
- Test với browser developer tools
