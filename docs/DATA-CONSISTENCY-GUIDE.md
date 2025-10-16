# Hướng dẫn Quản lý Dữ liệu Tập trung

## Tổng quan

Hệ thống quản lý dữ liệu tập trung đảm bảo tính nhất quán của tất cả dữ liệu metrics trong toàn bộ ứng dụng Actiwell Reports.

## Cấu trúc Dữ liệu

### 1. File `assets/js/data-consistency.js`

Chứa tất cả dữ liệu metrics được quản lý tập trung:

```javascript
window.ConsistentData = {
  metrics: {
    today: { visitors: 10, trialGuests: 8, ... },
    yesterday: { visitors: 12, trialGuests: 6, ... },
    mtd: { visitors: 180, trialGuests: 120, ... }
  },
  locations: {
    "ton-that-thuyet": { today: { visitors: 3, ... } },
    ...
  }
}
```

### 2. Các Metrics Chính

- **visitors**: Số khách tham quan
- **trialGuests**: Số khách tập thử
- **checkinManual**: Check-in thủ công
- **membershipCheckin**: Check-in membership
- **ptFitnessCheckin**: Check-in PT Fitness
- **pilatesCheckin**: Check-in Pilates
- **swimmingCoachCheckin**: Check-in Swimming Coach
- **lateCheckin**: Check-in sai giờ
- **contractActivations**: Kích hoạt hợp đồng
- **newMembers**: Hội viên mới
- **renewals**: Gia hạn
- **cancellations**: Hủy hợp đồng

## Cách Sử dụng

### 1. Lấy Dữ liệu

```javascript
// Lấy dữ liệu hôm nay cho tất cả cơ sở
const todayData = window.ConsistentData.getData("today", "all");

// Lấy dữ liệu hôm nay cho cơ sở cụ thể
const locationData = window.ConsistentData.getData("today", "ton-that-thuyet");

// Lấy dữ liệu khách tham quan
const visitorsData = window.ConsistentData.getVisitorsData("today", "all");
```

### 2. Cập nhật Dữ liệu

```javascript
// Cập nhật dữ liệu
window.ConsistentData.updateData("today", "all", "visitors", 15);

// Lắng nghe sự thay đổi dữ liệu
document.addEventListener("dataUpdated", function (event) {
  console.log("Data updated:", event.detail);
});
```

## Tích hợp vào Trang

### 1. Thêm Script

```html
<script src="../assets/js/data-consistency.js"></script>
<script src="../assets/js/main.js"></script>
```

### 2. Cập nhật Dữ liệu trong Trang

```javascript
function updateDataFromConsistentSource() {
  if (window.ConsistentData) {
    const visitorsData = window.ConsistentData.getVisitorsData("today", "all");
    document.getElementById("totalVisitors").textContent = visitorsData.count;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateDataFromConsistentSource();
});
```

## Lợi ích

1. **Tính nhất quán**: Tất cả dữ liệu hiển thị giống nhau ở mọi nơi
2. **Dễ bảo trì**: Chỉ cần cập nhật ở một nơi
3. **Tự động đồng bộ**: Thay đổi dữ liệu tự động cập nhật tất cả trang
4. **Kiểm soát tập trung**: Quản lý dữ liệu từ một file duy nhất

## Cập nhật Dữ liệu

### Thay đổi Dữ liệu Cơ bản

Chỉnh sửa file `assets/js/data-consistency.js`:

```javascript
metrics: {
  today: {
    visitors: 10,  // Thay đổi số này
    trialGuests: 8,
    // ...
  }
}
```

### Thêm Metrics Mới

1. Thêm vào `metrics` object
2. Thêm vào `getData()` function
3. Cập nhật các trang sử dụng metrics mới

## Kiểm tra Tính nhất quán

1. Mở dashboard chính
2. Kiểm tra số liệu hiển thị
3. Click vào metric card để xem trang chi tiết
4. Xác nhận số liệu giống nhau

## Troubleshooting

### Dữ liệu không đồng bộ

1. Kiểm tra `data-consistency.js` đã được load
2. Kiểm tra `updateDataFromConsistentSource()` được gọi
3. Kiểm tra console để xem lỗi

### Trang không cập nhật

1. Đảm bảo script được load đúng thứ tự
2. Kiểm tra ID element có đúng không
3. Kiểm tra function `updateDataFromConsistentSource()`

## Tương lai

- Tích hợp với API thực
- Cập nhật real-time
- Lưu trữ dữ liệu lịch sử
- Dashboard quản lý dữ liệu
