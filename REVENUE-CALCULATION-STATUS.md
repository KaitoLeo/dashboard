# 📊 Báo Cáo Tình Trạng Công Thức Tính Toán Revenue

**Ngày kiểm tra:** 16/10/2025  
**Người thực hiện:** AI Agent  
**Phạm vi:** Toàn bộ module Revenue trong actiwell-dashboard-mockui

---

## 🎯 Tóm Tắt Tổng Quan

### ✅ **Đã có:**

- Hệ thống công thức tính toán cơ bản (comprehensive-calculations.js)
- Shared data layer (compute.js) với `computeRevenueStats()`
- 15 công thức advanced metrics đã implement
- Cấu trúc dữ liệu mock đã đầy đủ

### ❌ **Chưa có:**

- **Dữ liệu tĩnh (hardcoded) trong các trang Revenue detail**
- **Kết nối giữa công thức tính toán và UI hiển thị**
- **Real-time update cho Revenue metrics**
- **Integration giữa data layer và revenue pages**

---

## 📋 Chi Tiết Các Trang Revenue

### 1️⃣ **Revenue MTD Detail** (`03-03-01-04-revenue-mtd-detail.html`)

#### Dữ liệu hardcoded:

```html
<h3 class="mb-0" id="mtdValue">1,850,000,000</h3>
<!-- ❌ Tĩnh -->
<h3 class="mb-0" id="growthValue">+12.5%</h3>
<!-- ❌ Tĩnh -->
<h3 class="mb-0" id="dailyAvgValue">61,666,667</h3>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Tổng doanh thu MTD
const mtdValue = revenue.reduce((sum, r) => sum + r.amount, 0);

// 2. Tăng trưởng so với tháng trước
const lastMonthRevenue = getLastMonthRevenue();
const growthValue = ((mtdValue - lastMonthRevenue) / lastMonthRevenue) * 100;

// 3. Trung bình ngày
const daysPassed = getCurrentDayOfMonth();
const dailyAvgValue = mtdValue / daysPassed;

// 4. Dự báo cuối tháng
const totalDaysInMonth = getDaysInCurrentMonth();
const forecastedRevenue = (mtdValue / daysPassed) * totalDaysInMonth;
```

---

### 2️⃣ **Daily Revenue Detail** (`03-03-01-04-daily-revenue-today-detail.html`)

#### Dữ liệu hardcoded:

```html
<h3 id="todayRevenue">82,000,000</h3>
<!-- ❌ Tĩnh -->
<h3 id="changeRate">+5.1%</h3>
<!-- ❌ Tĩnh -->
<h3 id="dailyTarget">100,000,000</h3>
<!-- ❌ Tĩnh -->
<h3 id="completionRate">82.0%</h3>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Doanh thu hôm nay
const todayRevenue = revenue
  .filter((r) => r.date === today)
  .reduce((sum, r) => sum + r.amount, 0);

// 2. Thay đổi so với hôm qua
const yesterdayRevenue = getYesterdayRevenue();
const changeRate = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

// 3. Mục tiêu ngày
const monthlyTarget = 3000000000;
const totalDaysInMonth = getDaysInCurrentMonth();
const dailyTarget = monthlyTarget / totalDaysInMonth;

// 4. Tỉ lệ hoàn thành
const completionRate = (todayRevenue / dailyTarget) * 100;
```

---

### 3️⃣ **Revenue by Service** (`03-03-02-01-revenue-service-detail.html`)

#### Dữ liệu hardcoded:

```html
<!-- Membership -->
<td>750,000,000</td>
<!-- ❌ Tĩnh -->
<td>40.5%</td>
<!-- ❌ Tĩnh -->

<!-- PT Fitness -->
<td>580,000,000</td>
<!-- ❌ Tĩnh -->
<td>31.4%</td>
<!-- ❌ Tĩnh -->

<!-- Pilates -->
<td>320,000,000</td>
<!-- ❌ Tĩnh -->
<td>17.3%</td>
<!-- ❌ Tĩnh -->

<!-- Swimming Coach -->
<td>200,000,000</td>
<!-- ❌ Tĩnh -->
<td>10.8%</td>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Doanh thu theo dịch vụ
const revenueByService = {};
const services = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"];

services.forEach((service) => {
  revenueByService[service] = revenue
    .filter((r) => r.service === service)
    .reduce((sum, r) => sum + r.amount, 0);
});

// 2. Tỉ trọng
const totalRevenue = Object.values(revenueByService).reduce((a, b) => a + b, 0);
const servicePercentage = {};

services.forEach((service) => {
  servicePercentage[service] = (revenueByService[service] / totalRevenue) * 100;
});
```

---

### 4️⃣ **Revenue by Club** (`03-03-03-02-revenue-club-detail.html`)

#### Dữ liệu hardcoded:

```html
<!-- Tôn Thất Thuyết -->
<td>450,000,000</td>
<!-- ❌ Tĩnh -->
<td>24.3%</td>
<!-- ❌ Tĩnh -->

<!-- Huỳnh Thúc Kháng -->
<td>380,000,000</td>
<!-- ❌ Tĩnh -->
<td>20.5%</td>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Doanh thu theo cơ sở
const revenueByClub = {};
const clubs = [
  "Tôn Thất Thuyết",
  "Huỳnh Thúc Kháng",
  "Giảng Võ",
  "Hào Nam",
  "Nguyễn Tuân",
];

clubs.forEach((club) => {
  revenueByClub[club] = revenue
    .filter((r) => r.location === club)
    .reduce((sum, r) => sum + r.amount, 0);
});

// 2. Tỉ trọng
const totalRevenue = Object.values(revenueByClub).reduce((a, b) => a + b, 0);
const clubPercentage = {};

clubs.forEach((club) => {
  clubPercentage[club] = (revenueByClub[club] / totalRevenue) * 100;
});
```

---

### 5️⃣ **Revenue by Staff** (`03-03-04-01-revenue-staff-detail.html`)

#### Dữ liệu hardcoded:

```html
<!-- Staff members -->
<td>Nguyễn Văn A</td>
<td>150,000,000</td>
<!-- ❌ Tĩnh -->
<td>18</td>
<!-- ❌ Tĩnh -->
<td>8,333,333</td>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Doanh thu theo nhân viên
const revenueByStaff = {};

revenue.forEach((r) => {
  if (!revenueByStaff[r.staff]) {
    revenueByStaff[r.staff] = {
      totalRevenue: 0,
      transactions: 0,
      avgTransaction: 0,
    };
  }

  revenueByStaff[r.staff].totalRevenue += r.amount;
  revenueByStaff[r.staff].transactions += 1;
});

// 2. Trung bình giao dịch
Object.keys(revenueByStaff).forEach((staff) => {
  const data = revenueByStaff[staff];
  data.avgTransaction = data.totalRevenue / data.transactions;
});
```

---

### 6️⃣ **Revenue by Payment Method** (`03-03-05-01-revenue-payment-detail.html`)

#### Dữ liệu hardcoded:

```html
<!-- Tiền mặt -->
<td>450,000,000</td>
<!-- ❌ Tĩnh -->
<td>24.3%</td>
<!-- ❌ Tĩnh -->

<!-- Chuyển khoản -->
<td>890,000,000</td>
<!-- ❌ Tĩnh -->
<td>48.1%</td>
<!-- ❌ Tĩnh -->

<!-- Thẻ tín dụng -->
<td>510,000,000</td>
<!-- ❌ Tĩnh -->
<td>27.6%</td>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Doanh thu theo phương thức thanh toán
const revenueByPayment = {};
const paymentMethods = [
  "Tiền mặt",
  "Chuyển khoản",
  "Thẻ tín dụng",
  "Ví điện tử",
];

paymentMethods.forEach((method) => {
  revenueByPayment[method] = revenue
    .filter((r) => r.paymentMethod === method)
    .reduce((sum, r) => sum + r.amount, 0);
});

// 2. Tỉ trọng
const totalRevenue = Object.values(revenueByPayment).reduce((a, b) => a + b, 0);
const paymentPercentage = {};

paymentMethods.forEach((method) => {
  paymentPercentage[method] = (revenueByPayment[method] / totalRevenue) * 100;
});
```

---

### 7️⃣ **Revenue Target** (`03-03-06-01-revenue-target-detail.html`)

#### Dữ liệu hardcoded:

```html
<h3 id="targetValue">3,000,000,000</h3>
<!-- ❌ Tĩnh -->
<h3 id="mtdValue">1,850,000,000</h3>
<!-- ❌ Tĩnh -->
<h3 id="completionValue">62%</h3>
<!-- ❌ Tĩnh -->
<h3 id="remainingValue">1,150,000,000</h3>
<!-- ❌ Tĩnh -->
<h3 id="dailyTargetValue">164,285,714</h3>
<!-- ❌ Tĩnh -->
<h3 id="completionDate">25/12/2024</h3>
<!-- ❌ Tĩnh -->
```

#### Công thức cần implement:

```javascript
// 1. Mục tiêu tháng (config)
const targetValue = 3000000000; // VNĐ

// 2. Doanh thu MTD
const mtdValue = revenue
  .filter((r) => isCurrentMonth(r.date))
  .reduce((sum, r) => sum + r.amount, 0);

// 3. Tỉ lệ hoàn thành
const completionValue = (mtdValue / targetValue) * 100;

// 4. Mục tiêu còn lại
const remainingValue = targetValue - mtdValue;

// 5. Cần đạt/ngày
const daysRemaining = getDaysRemainingInMonth();
const dailyTargetValue = remainingValue / daysRemaining;

// 6. Dự kiến hoàn thành
const daysPassed = getCurrentDayOfMonth();
const avgDailyRevenue = mtdValue / daysPassed;
const daysToTarget = Math.ceil(remainingValue / avgDailyRevenue);
const completionDate = addDays(new Date(), daysToTarget);
```

---

## 🔧 Công Thức Đã Có Sẵn

### ✅ **Trong `compute.js`:**

```javascript
function computeRevenueStats(revenue) {
  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalTarget = revenue.reduce((sum, r) => sum + r.target, 0);
  const totalTransactions = revenue.reduce((sum, r) => sum + r.transactions, 0);

  const byService = {};
  const byLocation = {};
  const byDay = {};

  revenue.forEach((r) => {
    // By service
    if (!byService[r.service])
      byService[r.service] = { amount: 0, target: 0, transactions: 0 };
    byService[r.service].amount += r.amount;
    byService[r.service].target += r.target;
    byService[r.service].transactions += r.transactions;

    // By location
    if (!byLocation[r.location])
      byLocation[r.location] = { amount: 0, target: 0, transactions: 0 };
    byLocation[r.location].amount += r.amount;
    byLocation[r.location].target += r.target;
    byLocation[r.location].transactions += r.transactions;

    // By day
    if (!byDay[r.date])
      byDay[r.date] = { amount: 0, target: 0, transactions: 0 };
    byDay[r.date].amount += r.amount;
    byDay[r.date].target += r.target;
    byDay[r.date].transactions += r.transactions;
  });

  return {
    totalRevenue,
    totalTarget,
    totalTransactions,
    achievementRate:
      totalTarget > 0 ? ((totalRevenue / totalTarget) * 100).toFixed(1) : 0,
    averageTransaction:
      totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(0) : 0,
    byService,
    byLocation,
    byDay,
  };
}
```

### ✅ **Trong `comprehensive-calculations.js`:**

```javascript
// Revenue Forecasting
calculateRevenueForecasting(currentRevenue, growthRate, timePeriod) {
  return Math.round(currentRevenue * Math.pow(1 + growthRate / 100, timePeriod));
}

// Revenue Growth Rate
calculateRevenueGrowthRate(currentRevenue, previousRevenue) {
  if (previousRevenue === 0) return 0;
  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}

// Revenue per Member
calculateRevenuePerMember(totalRevenue, activeMembers) {
  if (activeMembers === 0) return 0;
  return Math.round(totalRevenue / activeMembers);
}

// Revenue per Square Foot
calculateRevenuePerSquareFoot(revenue, facilityArea) {
  if (facilityArea === 0) return 0;
  return Math.round(revenue / facilityArea);
}
```

---

## 📊 Thống Kê Tổng Quan

### Pages Revenue:

- **Tổng số trang:** 14 pages
- **Trang có dữ liệu tĩnh:** 14/14 (100%)
- **Trang đã tích hợp compute layer:** 1/14 (7%) - chỉ `daily-revenue-yesterday-detail.html`

### Metrics cần tính toán:

- **Revenue Metrics:** ~30 metrics
- **Target Metrics:** ~10 metrics
- **Growth Metrics:** ~8 metrics
- **Distribution Metrics:** ~15 metrics

### Công thức đã có:

- **Core calculations:** ✅ Đã có (compute.js)
- **Advanced calculations:** ✅ Đã có (comprehensive-calculations.js)
- **Integration:** ❌ Chưa có (chỉ 1/14 pages)

---

## 🚀 Kế Hoạch Khắc Phục

### Phase 1: Core Revenue Pages (Ưu tiên cao) - 3 ngày

1. ✅ `03-03-01-04-revenue-mtd-detail.html` - Revenue MTD
2. ✅ `03-03-01-04-daily-revenue-today-detail.html` - Daily Revenue
3. ✅ `03-03-06-01-revenue-target-detail.html` - Revenue Target

### Phase 2: Distribution Pages (Ưu tiên trung bình) - 2 ngày

4. ✅ `03-03-02-01-revenue-service-detail.html` - By Service
5. ✅ `03-03-03-02-revenue-club-detail.html` - By Club
6. ✅ `03-03-05-01-revenue-payment-detail.html` - By Payment

### Phase 3: Staff & Reports (Ưu tiên thấp) - 2 ngày

7. ✅ `03-03-04-01-revenue-staff-detail.html` - By Staff
8. ✅ `03-03-01-01-revenue-reports.html` - Revenue Reports

### Phase 4: Integration & Testing - 2 ngày

9. ✅ Tích hợp toàn bộ với data layer
10. ✅ Testing và optimization
11. ✅ Real-time sync setup

---

## 📝 Công Việc Cần Làm

### 1. Tạo Revenue Calculation Module

```javascript
// File: assets/js/revenue/revenue-calculations.js

class RevenueCalculations {
  // MTD Revenue
  calculateMTDRevenue(revenue, currentDate) {}

  // Daily Revenue
  calculateDailyRevenue(revenue, date) {}

  // Revenue Growth
  calculateRevenueGrowth(current, previous) {}

  // Revenue by Service
  calculateRevenueByService(revenue) {}

  // Revenue by Location
  calculateRevenueByLocation(revenue) {}

  // Revenue Target Progress
  calculateTargetProgress(actual, target) {}

  // Forecast Revenue
  forecastRevenue(mtd, daysPassed, totalDays) {}
}
```

### 2. Cập Nhật Các Trang Revenue

- Thay thế hardcoded values bằng dynamic calculations
- Tích hợp với SharedState và Compute layer
- Thêm real-time sync với DataSync

### 3. Tạo Mock Data Generator

```javascript
// File: assets/js/revenue/revenue-mock-data.js

function generateRevenueData(dateRange, services, locations) {
  // Generate realistic revenue data
  return revenueData;
}
```

---

## ✅ Kết Luận

### Tình trạng hiện tại:

- ✅ **Công thức tính toán:** Đã có đầy đủ
- ✅ **Data layer:** Đã có cấu trúc
- ❌ **Integration:** Chưa kết nối với UI
- ❌ **Real-time:** Chưa có sync

### Công việc cần làm:

1. **Tạo revenue-calculations.js module** - Tập trung các công thức revenue
2. **Cập nhật 14 revenue pages** - Tích hợp dynamic calculations
3. **Tạo revenue mock data generator** - Dữ liệu test realistic
4. **Integration với data layer** - Kết nối SharedState, Compute, DataSync
5. **Testing & Optimization** - Đảm bảo performance và accuracy

### Ước tính thời gian:

- **Phase 1 (Core):** 3 ngày
- **Phase 2 (Distribution):** 2 ngày
- **Phase 3 (Staff & Reports):** 2 ngày
- **Phase 4 (Integration & Testing):** 2 ngày
- **Tổng:** ~9 ngày làm việc

---

**Trạng thái:** 🔴 **CẦN TRIỂN KHAI KHẨN CẤP**  
**Priority:** ⭐⭐⭐⭐⭐ **CRITICAL**
