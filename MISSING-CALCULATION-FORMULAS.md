# 🔍 Missing Calculation Formulas - Công Thức Thiếu

## 📊 Tổng Quan

Sau khi kiểm tra toàn bộ hệ thống, tôi đã tìm thấy **nhiều UI elements đang hiển thị số liệu tĩnh** mà **chưa có công thức tính toán** phía sau. Đây là danh sách chi tiết:

## 🎯 **Các Số Liệu Tĩnh Cần Công Thức**

### 1. **DASHBOARD CHÍNH (index.html)**

#### 1.1 **Revenue Cards - Chưa có công thức**

- **`targetValue`**: `3,000,000,000` VNĐ - Mục tiêu doanh số
- **`mtdValue`**: `1,850,000,000` VNĐ - Doanh thu MTD
- **`dailyValue`**: `80,434,783` VNĐ - Doanh thu ngày
- **`completionValue`**: `62%` - Tỉ lệ hoàn thành
- **`yesterdayRevenue`**: `78,000,000` VNĐ - Doanh thu hôm qua
- **`remainingValue`**: `1,150,000,000` VNĐ - Mục tiêu còn lại
- **`dailyTargetValue`**: `164,285,714` VNĐ/ngày - Cần đạt/ngày
- **`completionDate`**: `25/12/2024` - Dự kiến hoàn thành

#### 1.2 **Live Stats - Chưa có công thức**

- **`liveMembersCount`**: `89` - Đang tập live
- **`avgBurnRate`**: `4.2` - Burn Rate Analysis

### 2. **BOOKING DETAIL PAGES**

#### 2.1 **Booking This Week Detail**

- **`totalWeeklyBooking`**: `0` - Tổng booking tuần
- **`totalCompleted`**: `0` - Đã hoàn thành
- **`averagePerDay`**: `0` - Trung bình/ngày
- **`highestDayCount`**: `0` - Ngày cao nhất
- **`modalTotalBooking`**: `0` - Modal tổng booking
- **`modalCompleted`**: `0` - Modal đã hoàn thành
- **`modalPending`**: `0` - Modal đang chờ
- **`modalCancelled`**: `0` - Modal đã hủy

#### 2.2 **PT Fitness Checkin Detail**

- **`totalCheckins`**: `0` - Tổng check-in
- **`class1v1Count`**: `0` - Lớp 1:1
- **`class1v2Count`**: `0` - Lớp 1:2
- **`classGroupCount`**: `0` - Lớp nhóm

### 3. **VISITOR STATS PAGES**

#### 3.1 **Visitor Stats Detail**

- **`yesterdayVisitors`**: `8` - Khách hôm qua
- **`todayVisitors`**: `12` - Khách hôm nay
- **`mtdVisitors`**: `25` - Khách MTD
- **`totalSaleTiep`**: `281` - Sale tiếp
- **`totalPtTiep`**: `160` - PT tiếp
- **`ptTiepRate`**: `56.94%` - Tỉ lệ PT tiếp
- **`inbodyRate`**: `24.20%` - Tỉ lệ đo Inbody

#### 3.2 **Visitors Detail (MTD)**

- **`totalVisitorsMTD`**: `18` - Tổng tham quan MTD
- **`membershipVisitors`**: `8` - Khách Membership
- **`ptFitnessVisitors`**: `5` - Khách PT Fitness
- **`pilatesVisitors`**: `3` - Khách Pilates
- **`swimmingVisitors`**: `2` - Khách Swimming

#### 3.3 **Visitor Yesterday Detail**

- **`totalVisitorsYesterday`**: `8` - Tổng hôm qua
- **`membershipVisitors`**: `3` - Membership hôm qua
- **`ptFitnessVisitors`**: `2` - PT Fitness hôm qua
- **`pilatesVisitors`**: `2` - Pilates hôm qua
- **`swimmingVisitors`**: `1` - Swimming hôm qua

## 🚀 **Công Thức Cần Bổ Sung**

### **1. Revenue Calculation Formulas**

```javascript
// Mục tiêu doanh số
const targetValue = 3000000000; // VNĐ

// Doanh thu MTD
const mtdValue = calculateMTDRevenue(currentDate, revenueData);

// Doanh thu ngày
const dailyValue = calculateDailyRevenue(today, revenueData);

// Tỉ lệ hoàn thành
const completionValue = (mtdValue / targetValue) * 100;

// Mục tiêu còn lại
const remainingValue = targetValue - mtdValue;

// Cần đạt/ngày
const daysRemaining = getDaysRemainingInMonth(currentDate);
const dailyTargetValue = remainingValue / daysRemaining;

// Dự kiến hoàn thành
const completionDate = calculateCompletionDate(
  mtdValue,
  targetValue,
  dailyValue
);
```

### **2. Live Stats Formulas**

```javascript
// Đang tập live
const liveMembersCount = getCurrentActiveMembers();

// Burn Rate Analysis
const avgBurnRate = calculateBurnRate(checkins, activeMembers, daysInMonth);
```

### **3. Booking Formulas**

```javascript
// Tổng booking tuần
const totalWeeklyBooking = calculateWeeklyBookings(weekStart, weekEnd);

// Đã hoàn thành
const totalCompleted = calculateCompletedBookings(bookings);

// Trung bình/ngày
const averagePerDay = totalWeeklyBooking / 7;

// Ngày cao nhất
const highestDayCount = Math.max(...dailyBookings);
```

### **4. Visitor Formulas**

```javascript
// Khách tham quan theo ngày
const yesterdayVisitors = calculateVisitorsByDate(yesterday);
const todayVisitors = calculateVisitorsByDate(today);
const mtdVisitors = calculateVisitorsMTD(monthStart, today);

// Phân loại theo nhu cầu
const membershipVisitors = filterVisitorsByNeed(visitors, "membership");
const ptFitnessVisitors = filterVisitorsByNeed(visitors, "pt-fitness");
const pilatesVisitors = filterVisitorsByNeed(visitors, "pilates");
const swimmingVisitors = filterVisitorsByNeed(visitors, "swimming");

// Tỉ lệ chuyển đổi
const ptTiepRate = (ptTiep / saleTiep) * 100;
const inbodyRate = (inbodyMeasurements / totalVisitors) * 100;
```

## 📋 **Kế Hoạch Triển Khai**

### **Phase 1: Revenue Calculations (Ưu tiên cao)**

1. Tạo `revenue-calculations.js`
2. Implement các công thức doanh thu
3. Tích hợp vào dashboard chính

### **Phase 2: Live Stats (Ưu tiên cao)**

1. Tạo `live-stats-calculations.js`
2. Implement real-time calculations
3. Cập nhật auto-refresh

### **Phase 3: Booking & Visitor Stats (Ưu tiên trung bình)**

1. Tạo `booking-calculations.js`
2. Tạo `visitor-calculations.js`
3. Tích hợp vào các trang detail

### **Phase 4: Integration & Testing (Ưu tiên thấp)**

1. Tích hợp tất cả công thức
2. Test toàn bộ hệ thống
3. Optimize performance

## 🎯 **Lợi Ích**

1. **Dữ liệu động**: Thay thế số liệu tĩnh bằng tính toán thực
2. **Tính chính xác**: Công thức đảm bảo tính toán đúng
3. **Real-time**: Cập nhật theo thời gian thực
4. **Consistency**: Nhất quán giữa các trang
5. **Maintainability**: Dễ bảo trì và cập nhật

---

**Kết luận**: Có **khoảng 30+ UI elements** đang hiển thị số liệu tĩnh cần được thay thế bằng công thức tính toán động.




