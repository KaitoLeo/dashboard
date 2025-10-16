# Breadcrumb System - Hướng dẫn sử dụng

## Tổng quan

Hệ thống breadcrumb tự động hiển thị đường dẫn hiện tại trong header với cấu trúc: **Trang chủ → Cấp 1 → Cấp 2 → ... → Trang hiện tại**

## Cách đăng ký meta cho route/category

### 1. Thêm route meta trong URL_MAPPING

```javascript
// Trong assets/js/router/url-mapping.js
const URL_MAPPING = {
  groups: {
    checkin: {
      name: "Check-in", // ← Tên hiển thị trong breadcrumb
      path: "checkin",
      icon: "fas fa-clock",
    },
  },

  categories: {
    checkin: {
      frequency: {
        name: "Tần suất", // ← Tên hiển thị trong breadcrumb
        path: "frequency",
        parent: "checkin",
      },
    },
  },

  details: {
    checkin: {
      frequency: {
        today: {
          name: "Check-in Hôm nay", // ← Tên hiển thị trong breadcrumb
          slug: "checkin-hom-nay",
          path: "checkin/frequency/checkin-hom-nay.html",
          parent: "checkin/frequency",
        },
      },
    },
  },
};
```

### 2. Fallback tự động

Nếu không có meta, hệ thống sẽ tự động chuyển slug thành tên hiển thị:

- `checkin-hom-nay` → `Checkin Hom Nay`
- `pt-fitness-detail` → `Pt Fitness Detail`
- `late-checkin-mtd` → `Late Checkin Mtd`

### 3. Smart Truncate

Breadcrumb dài (>6 cấp) sẽ được rút gọn thành:
**Trang chủ → ... → Cấp n-2 → Cấp n-1 → Cấp n**

## Tích hợp vào trang

### 1. Tự động (Khuyến nghị)

Breadcrumb sẽ tự động xuất hiện trong header của tất cả trang:

```html
<!-- Không cần làm gì, breadcrumb tự động hiển thị -->
<header class="bg-primary text-white py-3">
  <div class="container-fluid">
    <h2>Tiêu đề trang</h2>
    <!-- Breadcrumb sẽ xuất hiện ở đây -->
  </div>
</header>
```

### 2. Thủ công

```html
<!-- Thêm container breadcrumb -->
<div id="breadcrumb-container" class="mt-2"></div>

<script>
  // Khởi tạo breadcrumb
  const breadcrumb = new HeaderBreadcrumbs("breadcrumb-container");
</script>
```

## Tính năng

### ✅ Đã có

- **Tự động dựng breadcrumb** từ URL hiện tại
- **Smart truncate** cho breadcrumb dài
- **Responsive design** với CSS media queries
- **Accessibility** (ARIA labels, keyboard navigation)
- **JSON-LD schema** cho SEO
- **Query parameter preservation** khi navigate
- **Fallback** từ slug khi thiếu meta

### 🎯 Cấu trúc breadcrumb

```
Trang chủ → Check-in → Tần suất → Check-in Hôm nay
    ↑         ↑         ↑            ↑
  Link      Link     Link        Text (không link)
```

### 📱 Responsive

- **Desktop**: Hiển thị đầy đủ
- **Tablet**: Rút gọn một phần
- **Mobile**: Smart truncate với ellipsis

### ♿ Accessibility

- `aria-label="Breadcrumb"` cho nav
- `aria-current="page"` cho trang hiện tại
- Keyboard navigation (Tab, Enter, Space)
- Focus-visible outline

## Testing

### Chạy tests

```javascript
// Trong console browser
const testSuite = new BreadcrumbTests();
testSuite.runAllTests();
```

### Test cases

- ✅ Basic breadcrumb structure
- ✅ Smart truncate functionality
- ✅ Missing meta fallback
- ✅ Slug to title conversion
- ✅ Edge cases (empty path, unknown path)
- ✅ Accessibility features

## Troubleshooting

### Breadcrumb không hiển thị

1. Kiểm tra container `#breadcrumb-container` có tồn tại
2. Kiểm tra console có lỗi JavaScript
3. Đảm bảo script được load đúng thứ tự

### Tên hiển thị không đúng

1. Kiểm tra URL_MAPPING có đúng không
2. Nếu thiếu meta, hệ thống sẽ dùng fallback từ slug
3. Có thể customize `slugToTitle()` function

### Responsive không hoạt động

1. Kiểm tra CSS media queries
2. Test trên các kích thước màn hình khác nhau
3. Kiểm tra `smartTruncate()` function

## Lưu ý

- **Dấu phân cách**: Mũi tên `→` (không dùng `/`)
- **Cấp cuối**: Luôn là text, không có link
- **Query params**: Được giữ nguyên khi navigate
- **SEO**: JSON-LD schema tự động generate
- **Performance**: Không reload trang khi navigate
