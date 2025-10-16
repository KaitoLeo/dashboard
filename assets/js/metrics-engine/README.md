# Metrics Engine - Hệ thống đồng bộ dữ liệu

## Tổng quan

Metrics Engine là một hệ thống JavaScript thuần được thiết kế để đảm bảo đồng bộ dữ liệu hoàn toàn giữa các trang trong dashboard. Hệ thống này đảm bảo rằng tất cả số liệu, biểu đồ và bảng dữ liệu đều sử dụng cùng một nguồn dữ liệu và công thức tính toán.

## Cấu trúc thư mục

```
assets/js/metrics-engine/
├── types.js          # Định nghĩa các kiểu dữ liệu chuẩn
├── selectors.js      # Chuẩn hóa dữ liệu về DataModel chuẩn
├── compute.js        # Các function tính toán KPI (pure functions)
├── cache.js          # Hệ thống cache để tránh tính toán trùng lặp
├── index.js          # Main entry point - quản lý toàn bộ hệ thống
├── sync.js           # Đồng bộ dữ liệu giữa các trang
├── init.js           # Khởi tạo metrics engine với dữ liệu mẫu
└── README.md         # Tài liệu hướng dẫn
```

## Cách sử dụng

### 1. Khởi tạo Metrics Engine

```javascript
// Khởi tạo với dữ liệu mẫu
await window.MetricsEngine.initialize({
  checkins: window.lateCheckinData || [],
});
```

### 2. Lấy dữ liệu metrics

```javascript
// Lấy metric cụ thể
const lateCheckins = window.MetricsEngine.getMetric("lateCheckins");
console.log(lateCheckins.formattedValue); // "43"

// Lấy tất cả metrics
const allMetrics = window.MetricsEngine.getAllMetrics();
```

### 3. Cập nhật bộ lọc

```javascript
// Cập nhật bộ lọc
window.MetricsEngine.updateFilters({
  location: "ton-that-thuyet",
  department: "membership",
  lateType: "late",
});
```

### 4. Lắng nghe sự kiện

```javascript
// Lắng nghe khi metrics được cập nhật
window.MetricsEngine.addListener("metricsUpdated", function () {
  console.log("Metrics updated!");
  // Cập nhật UI tại đây
});

// Lắng nghe khi filters được cập nhật
window.MetricsEngine.addListener("filtersUpdated", function (data) {
  console.log("Filters updated:", data);
});
```

## Các loại metrics có sẵn

- `totalCheckins` - Tổng số check-in
- `lateCheckins` - Số check-in muộn
- `earlyCheckins` - Số check-in sớm
- `ontimeCheckins` - Số check-in đúng giờ
- `lateCheckinRate` - Tỷ lệ check-in muộn
- `checkinsByDepartment` - Check-in theo bộ phận
- `checkinsByLocation` - Check-in theo cơ sở
- `lateCheckinStatistics` - Thống kê chi tiết check-in sai giờ

## Cấu trúc dữ liệu chuẩn

### CheckinDataModel

```javascript
{
  id: "checkin_1",
  memberId: "HV001",
  memberName: "Nguyễn Văn A",
  location: "Tôn Thất Thuyết",
  locationKey: "ton-that-thuyet",
  department: "Membership",
  departmentKey: "membership",
  staffInCharge: "Nguyễn Thị Lan",
  checkinTime: "08:15",
  requiredTime: "08:00",
  timeDifference: 15, // phút (dương = muộn, âm = sớm, 0 = đúng giờ)
  lateType: "late", // 'late', 'early', 'ontime'
  checkinType: "Thủ công",
  reason: "Quên thẻ từ",
  status: "active",
  serviceType: "Gym",
  classType: "Lớp 1:1",
  instructor: "Nguyễn Văn B",
  createdAt: "2024-01-15T08:15:00Z",
  updatedAt: "2024-01-15T08:15:00Z"
}
```

### MetricResult

```javascript
{
  value: 43,
  type: "count",
  label: "Check-in muộn",
  description: "Số lượt check-in muộn",
  formattedValue: "43",
  rawData: [...] // Dữ liệu thô đã lọc
}
```

## Cách thêm metric mới

### 1. Thêm function tính toán trong `compute.js`

```javascript
computeNewMetric(data, filters = {}) {
  const filteredData = this.applyFilters(data, filters);
  const value = filteredData.length; // Logic tính toán

  return {
    value,
    type: MetricsTypes.MetricTypes.COUNT,
    label: 'Metric mới',
    description: 'Mô tả metric mới',
    formattedValue: this.formatNumber(value),
    rawData: filteredData
  };
}
```

### 2. Thêm vào `index.js`

```javascript
// Trong function computeAllMetrics()
case 'newMetric':
  result = this.compute.computeNewMetric(data, filters);
  break;
```

### 3. Sử dụng metric mới

```javascript
const newMetric = window.MetricsEngine.getMetric("newMetric");
console.log(newMetric.formattedValue);
```

## Cách thêm filter mới

### 1. Cập nhật `types.js`

```javascript
const FilterTypes = {
  // ... existing filters
  NEW_FILTER: "newFilter",
};
```

### 2. Cập nhật `compute.js`

```javascript
// Trong function applyFilters()
if (filters.newFilter && filters.newFilter !== "all") {
  filteredData = filteredData.filter(
    (item) => item.newField === filters.newFilter
  );
}
```

### 3. Cập nhật `index.js`

```javascript
// Trong function getCurrentFilters()
newFilter: this.globalFilterState.newFilter.selected;
```

## Đồng bộ dữ liệu

Hệ thống tự động đồng bộ dữ liệu giữa các trang thông qua `DataSynchronizer`:

- Đồng bộ mỗi 30 giây
- Loại bỏ trùng lặp dữ liệu
- Chuẩn hóa dữ liệu từ các nguồn khác nhau
- Cập nhật metrics engine khi có thay đổi

## Cache và Performance

- Tự động cache kết quả tính toán
- TTL mặc định: 5 phút
- Tự động dọn dẹp cache hết hạn
- Memoization để tránh tính toán trùng lặp

## Debugging

```javascript
// Xem trạng thái hệ thống
console.log(window.MetricsEngine.getSystemStats());

// Xem trạng thái sync
console.log(window.DataSynchronizer.getSyncStatus());

// Xem thống kê cache
console.log(window.MetricsCache.getStats());

// Force sync
window.DataSynchronizer.forceSync();
```

## Lưu ý quan trọng

1. **Luôn sử dụng Metrics Engine** để lấy dữ liệu, không tính toán trực tiếp trong component
2. **Cập nhật UI** thông qua listeners, không cập nhật trực tiếp
3. **Sử dụng cache** để tối ưu performance
4. **Đồng bộ dữ liệu** giữa các trang để đảm bảo tính nhất quán
5. **Test kỹ lưỡng** khi thêm metric hoặc filter mới

## Troubleshooting

### Lỗi thường gặp

1. **"Metrics Engine not initialized"**

   - Đảm bảo gọi `initialize()` trước khi sử dụng
   - Kiểm tra dữ liệu mẫu đã load chưa

2. **"Data not syncing"**

   - Kiểm tra `DataSynchronizer` đã start chưa
   - Xem console log để debug

3. **"Cache not working"**

   - Kiểm tra TTL của cache
   - Xóa cache và thử lại

4. **"UI not updating"**
   - Kiểm tra listeners đã đăng ký chưa
   - Đảm bảo gọi `updateUIFromMetrics()` sau khi metrics thay đổi
