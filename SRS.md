# Software Requirements Specification (SRS) - Actiwell Dashboard System

## Tổng quan hệ thống

Hệ thống Actiwell Dashboard là một ứng dụng web quản lý và báo cáo cho chuỗi phòng gym và spa, cung cấp các chỉ số thống kê real-time về doanh thu, vận hành, và hiệu suất kinh doanh.

## 1. Công thức tính toán các chỉ số thống kê

### 1.1. Chỉ số Doanh thu (Revenue Metrics)

#### 1.1.1. Tỉ lệ hoàn thành mục tiêu (Completion Rate)

```javascript
completionRate = Math.round((mtdRevenue / monthlyTarget) * 100);
```

- **mtdRevenue**: Doanh thu từ đầu tháng đến hiện tại
- **monthlyTarget**: Mục tiêu doanh thu tháng
- **Kết quả**: Phần trăm hoàn thành mục tiêu (%)

#### 1.1.2. Mục tiêu còn lại (Remaining Target)

```javascript
remainingTarget = monthlyTarget - mtdRevenue;
```

- **monthlyTarget**: Mục tiêu doanh thu tháng
- **mtdRevenue**: Doanh thu từ đầu tháng đến hiện tại
- **Kết quả**: Số tiền còn lại cần đạt (VNĐ)

#### 1.1.3. Mục tiêu cần đạt/ngày (Daily Target Required)

```javascript
const today = new Date();
const lastDayOfMonth = new Date(
  today.getFullYear(),
  today.getMonth() + 1,
  0
).getDate();
const daysPassed = today.getDate();
const remainingDays = lastDayOfMonth - daysPassed + 1;
const dailyTargetNeeded = Math.round(remainingTarget / remainingDays);
```

- **remainingTarget**: Mục tiêu còn lại
- **remainingDays**: Số ngày còn lại trong tháng
- **Kết quả**: Số tiền cần đạt mỗi ngày (VNĐ/ngày)

#### 1.1.4. Trung bình doanh thu/ngày (Average Daily Revenue)

```javascript
avgDaily = Math.round(mtdRevenue / daysPassed);
```

- **mtdRevenue**: Doanh thu từ đầu tháng đến hiện tại
- **daysPassed**: Số ngày đã trôi qua trong tháng
- **Kết quả**: Doanh thu trung bình mỗi ngày (VNĐ/ngày)

#### 1.1.5. Tăng trưởng (Growth Rate)

```javascript
growthRate = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
```

- **currentPeriod**: Doanh thu kỳ hiện tại
- **previousPeriod**: Doanh thu kỳ trước
- **Kết quả**: Tỷ lệ tăng trưởng (%)

### 1.2. Chỉ số Check-in và Vận hành

#### 1.2.1. Tỉ lệ check-in đúng giờ (On-time Check-in Rate)

```javascript
onTimeRate = Math.round((onTimeCheckins / totalCheckins) * 100);
```

- **onTimeCheckins**: Số lượt check-in đúng giờ
- **totalCheckins**: Tổng số lượt check-in
- **Kết quả**: Tỷ lệ check-in đúng giờ (%)

#### 1.2.2. Tần suất check-in trung bình/khách/tuần

```javascript
avgCheckinsPerWeek = totalCheckins / (activeMembers * weeksInPeriod);
```

- **totalCheckins**: Tổng số lượt check-in trong kỳ
- **activeMembers**: Số hội viên hoạt động
- **weeksInPeriod**: Số tuần trong kỳ
- **Kết quả**: Số lượt check-in trung bình/khách/tuần

#### 1.2.3. Tần suất check-in/Active Member

```javascript
checkinsPerActiveMember = totalCheckins / activeMembers;
```

- **totalCheckins**: Tổng số lượt check-in trong kỳ
- **activeMembers**: Số hội viên hoạt động
- **Kết quả**: Số lượt check-in/khách/tháng

### 1.3. Chỉ số Tỉ lệ và Phần trăm

#### 1.3.1. Tỉ lệ hủy (Cancellation Rate)

```javascript
cancellationRate = (cancelledBookings / totalBookings) * 100;
```

- **cancelledBookings**: Số booking bị hủy
- **totalBookings**: Tổng số booking
- **Kết quả**: Tỷ lệ hủy (%)

#### 1.3.2. Tỉ lệ hoàn thành (Completion Rate)

```javascript
completionRate = (completedBookings / totalBookings) * 100;
```

- **completedBookings**: Số booking đã hoàn thành
- **totalBookings**: Tổng số booking
- **Kết quả**: Tỷ lệ hoàn thành (%)

#### 1.3.3. Tỉ lệ giữ chân (Retention Rate)

```javascript
retentionRate =
  ((openingBalance + newMembers - cancellations) / openingBalance) * 100;
```

- **openingBalance**: Số hội viên đầu kỳ
- **newMembers**: Số hội viên mới
- **cancellations**: Số hội viên hủy
- **Kết quả**: Tỷ lệ giữ chân (%)

#### 1.3.4. Tỉ lệ gia hạn (Renewal Rate)

```javascript
renewalRate = (renewals / expiringMembers) * 100;
```

- **renewals**: Số hội viên gia hạn
- **expiringMembers**: Số hội viên hết hạn
- **Kết quả**: Tỷ lệ gia hạn (%)

#### 1.3.5. Tỉ lệ rời bỏ (Churn Rate)

```javascript
churnRate = (cancellations / openingBalance) * 100;
```

- **cancellations**: Số hội viên rời bỏ
- **openingBalance**: Số hội viên đầu kỳ
- **Kết quả**: Tỷ lệ rời bỏ (%)

### 1.4. Chỉ số Sử dụng Cơ sở (Facility Utilization)

#### 1.4.1. Tỉ lệ lấp đầy tổng thể (Overall Occupancy Rate)

```javascript
overallOccupancyRate = (totalCheckins / totalCapacity) * 100;
```

- **totalCheckins**: Tổng số lượt check-in
- **totalCapacity**: Tổng dung lượng cơ sở
- **Kết quả**: Tỷ lệ lấp đầy tổng thể (%)

#### 1.4.2. Tỉ lệ lấp đầy theo bộ phận

```javascript
departmentOccupancyRate = (departmentCheckins / departmentCapacity) * 100;
```

- **departmentCheckins**: Số lượt check-in của bộ phận
- **departmentCapacity**: Dung lượng của bộ phận
- **Kết quả**: Tỷ lệ lấp đầy bộ phận (%)

### 1.5. Chỉ số Burn Rate

#### 1.5.1. Burn Rate trung bình

```javascript
avgBurnRate = totalCheckins / activeMembers;
```

- **totalCheckins**: Tổng số lượt check-in
- **activeMembers**: Số hội viên hoạt động
- **Kết quả**: Số lượt check-in/khách/tháng

#### 1.5.2. Phân loại Burn Rate

```javascript
// High Burn Rate: > 6 lượt/tháng
highBurnRateMembers = members.filter((member) => member.monthlyCheckins > 6);

// Low Burn Rate: < 2 lượt/tháng
lowBurnRateMembers = members.filter((member) => member.monthlyCheckins < 2);

// Silent Members: 0 lượt/tháng
silentMembers = members.filter((member) => member.monthlyCheckins === 0);
```

### 1.6. Chỉ số Tỉ trọng (Weight/Percentage Distribution)

#### 1.6.1. Tỉ trọng doanh thu theo bộ phận

```javascript
departmentWeight = (departmentRevenue / totalRevenue) * 100;
```

- **departmentRevenue**: Doanh thu của bộ phận
- **totalRevenue**: Tổng doanh thu
- **Kết quả**: Tỷ trọng doanh thu bộ phận (%)

#### 1.6.2. Tỉ trọng doanh thu theo cơ sở

```javascript
locationWeight = (locationRevenue / totalRevenue) * 100;
```

- **locationRevenue**: Doanh thu của cơ sở
- **totalRevenue**: Tổng doanh thu
- **Kết quả**: Tỷ trọng doanh thu cơ sở (%)

## 2. Logic xử lý dữ liệu

### 2.1. Hệ thống Filter và Lọc dữ liệu

#### 2.1.1. Filter theo cơ sở (Location Filter)

```javascript
const locationMultipliers = {
  "ton-that-thuyet": 1.0, // 100% dữ liệu
  "huynh-thuc-khang": 0.85, // 85% dữ liệu
  "giang-vo": 0.75, // 75% dữ liệu
  "hao-nam": 0.65, // 65% dữ liệu
  "nguyen-tuan": 0.55, // 55% dữ liệu
};
```

#### 2.1.2. Filter theo bộ phận (Department Filter)

```javascript
const departmentMultipliers = {
  membership: 1.0, // 100% dữ liệu
  fitness: 0.8, // 80% dữ liệu
  pool: 0.6, // 60% dữ liệu (Swimming Coach)
  pilates: 0.4, // 40% dữ liệu
  operation: 0.9, // 90% dữ liệu
};
```

### 2.2. Hệ thống Cache và Đồng bộ dữ liệu

#### 2.2.1. Cache timeout

```javascript
const cacheTimeout = 5 * 60 * 1000; // 5 phút
```

#### 2.2.2. Đồng bộ dữ liệu real-time

```javascript
// Lắng nghe thay đổi localStorage
window.addEventListener("storage", (e) => {
  if (e.key === "actiwellRevenueData") {
    updateAllPages();
  }
});
```

### 2.3. Tính toán dữ liệu động

#### 2.3.1. Cập nhật metrics theo thời gian thực

```javascript
function updateDerivedMetrics() {
  const completionRate = Math.round((mtdRevenue / monthlyTarget) * 100);
  const remainingTarget = monthlyTarget - mtdRevenue;

  // Tính số ngày còn lại
  const today = new Date();
  const lastDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const daysPassed = today.getDate();
  const remainingDays = lastDayOfMonth - daysPassed + 1;
  const dailyTargetNeeded = Math.round(remainingTarget / remainingDays);
}
```

## 3. Cấu trúc dữ liệu

### 3.1. Dữ liệu Doanh thu

```javascript
revenue: {
  mtd: 1850000000,           // Doanh thu MTD (VNĐ)
  today: 75000000,           // Doanh thu hôm nay (VNĐ)
  yesterday: 68500000,       // Doanh thu hôm qua (VNĐ)
  target: 3000000000,        // Mục tiêu tháng (VNĐ)
  remaining: 1150000000,     // Còn lại (VNĐ)
  growth: 12.5,              // Tăng trưởng (%)
  avgDaily: 61666667,        // Trung bình/ngày (VNĐ)
  completionRate: 62         // Tỷ lệ hoàn thành (%)
}
```

### 3.2. Dữ liệu Check-in

```javascript
checkin: {
  today: 245,                // Check-in hôm nay
  yesterday: 238,            // Check-in hôm qua
  mtd: 5880,                 // Check-in MTD
  onTime: 198,               // Check-in đúng giờ
  lateCheckin: 47,           // Check-in muộn
  manual: 47,                // Check-in thủ công
  peakHour: "18:00-19:00",   // Giờ cao điểm
  avgDuration: 85            // Thời gian trung bình (phút)
}
```

### 3.3. Dữ liệu PT Sessions

```javascript
pt: {
  today: 45,                 // PT hôm nay
  yesterday: 42,             // PT hôm qua
  mtd: 1250,                 // PT MTD
  online: 8,                 // PT online
  group: 12,                 // Lớp nhóm
  individual: 33,            // Lớp 1:1
  avgRevenue: 50000          // Doanh thu trung bình (VNĐ)
}
```

## 4. API Integration

### 4.1. AWS Lambda Functions

- **Dashboard Summary**: `/dashboard/summary/{locationId}`
- **Revenue Data**: `/dashboard/revenue/{locationId}`
- **Booking Data**: `/dashboard/bookings/{locationId}`
- **Operational Data**: `/dashboard/operational/{locationId}`
- **Target Data**: `/dashboard/targets/{locationId}`

### 4.2. Database Analytics (SQL Equivalent)

```sql
-- Tỉ lệ hoàn thành mục tiêu
SELECT
  location_id,
  (SUM(mtd_revenue) / SUM(target_amount)) * 100 as completion_rate
FROM sales_targets
GROUP BY location_id;

-- Check-in theo tháng
SELECT
  location_id,
  DATE_TRUNC('month', created_at) as year_month,
  COUNT(*) as checkin_count
FROM checkins
WHERE status IN (1,2,3)
GROUP BY location_id, year_month;

-- Tỉ lệ hủy booking
SELECT
  location_id,
  (SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) / COUNT(*)) * 100 as cancellation_rate
FROM bookings
GROUP BY location_id;
```

## 5. Cập nhật và Bảo trì

### 5.1. Quy trình cập nhật công thức

1. **Phân tích yêu cầu mới**: Xác định công thức cần thay đổi
2. **Cập nhật code**: Sửa đổi logic tính toán trong các file JS
3. **Test và validate**: Kiểm tra kết quả tính toán
4. **Cập nhật documentation**: Ghi chép thay đổi vào SRS.md
5. **Deploy**: Triển khai lên production

### 5.2. Monitoring và Debug

- **Console logging**: Ghi log chi tiết quá trình tính toán
- **Error handling**: Xử lý lỗi khi tính toán
- **Data validation**: Kiểm tra tính hợp lệ của dữ liệu đầu vào
- **Performance monitoring**: Theo dõi hiệu suất tính toán

### 5.3. Version Control

- **Git tracking**: Theo dõi thay đổi code
- **Change log**: Ghi chép lịch sử thay đổi
- **Rollback capability**: Khả năng quay lại phiên bản trước

---

**Lưu ý**: Tài liệu này sẽ được cập nhật thường xuyên khi có thay đổi về logic tính toán hoặc yêu cầu mới. Mọi thay đổi cần được ghi chép rõ ràng với lý do và tác động.


