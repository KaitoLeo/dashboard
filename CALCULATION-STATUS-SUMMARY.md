# 📊 Tóm Tắt Tình Trạng Công Thức Tính Toán

**Ngày:** 16/10/2025  
**Trạng thái:** 🔴 **CHƯA ĐẦY ĐỦ**

---

## 🎯 TÓM TẮT NHANH

### ✅ ĐÃ CÓ:

- ✅ **Công thức core:** `compute.js` - `computeRevenueStats()`, `computeBookingStats()`, etc.
- ✅ **Công thức advanced:** `comprehensive-calculations.js` - 50+ formulas
- ✅ **Data structure:** Cấu trúc dữ liệu mock đầy đủ
- ✅ **1/14 revenue pages** có integration (daily-revenue-yesterday-detail.html)

### ❌ CHƯA CÓ:

- ❌ **13/14 revenue pages** vẫn dùng dữ liệu **HARDCODED (tĩnh)**
- ❌ **Kết nối** giữa công thức và UI
- ❌ **Real-time sync** cho revenue metrics
- ❌ **Booking pages** chưa có công thức động

---

## 📋 CHI TIẾT TỪNG PHẦN

### 1️⃣ **REVENUE** (Module 03-03-xx)

#### Trang có dữ liệu tĩnh:

```
❌ 03-03-01-04-revenue-mtd-detail.html         → mtdValue: 1,850,000,000 (hardcoded)
❌ 03-03-01-04-daily-revenue-today-detail.html → todayRevenue: 82,000,000 (hardcoded)
❌ 03-03-02-01-revenue-service-detail.html     → service revenue (hardcoded)
❌ 03-03-03-02-revenue-club-detail.html        → club revenue (hardcoded)
❌ 03-03-04-01-revenue-staff-detail.html       → staff revenue (hardcoded)
❌ 03-03-05-01-revenue-payment-detail.html     → payment revenue (hardcoded)
❌ 03-03-06-01-revenue-target-detail.html      → target metrics (hardcoded)
... và 7 trang khác
```

#### Công thức cần apply:

```javascript
// MTD Revenue
const mtdValue = revenue.reduce((sum, r) => sum + r.amount, 0);

// Growth Rate
const growthValue = ((current - previous) / previous) * 100;

// Average per Day
const dailyAvg = mtdValue / daysPassed;

// By Service/Club/Staff
const byCategory = groupBy(revenue, "category");
```

---

### 2️⃣ **BOOKING** (Module 03-05-xx)

#### Trang có dữ liệu tĩnh:

```
✅ 03-05-01-04-booking-this-week-detail.html   → Đã có logic động (weekly data)
✅ 03-05-01-05-booking-mtd-detail.html         → Đã có year/month filter
❌ 03-05-01-02-booking-today-detail.html       → booking data (cần verify)
❌ 03-05-01-03-booking-yesterday-detail.html   → booking data (cần verify)
```

#### Công thức cần apply:

```javascript
// Total Bookings
const totalBookings = bookings.length;

// By Status
const completed = bookings.filter((b) => b.status === "completed").length;
const pending = bookings.filter((b) => b.status === "pending").length;
const cancelled = bookings.filter((b) => b.status === "cancelled").length;

// Average per Day
const avgPerDay = totalBookings / daysInPeriod;
```

---

### 3️⃣ **CHECKIN** (Module 03-01-xx)

#### Trang có dữ liệu tĩnh:

```
❌ 03-01-01-03-checkin-yesterday-detail.html   → checkin counts (hardcoded)
❌ 03-01-04-01-pt-fitness-checkin-detail.html  → PT checkin data (hardcoded)
... và các trang khác
```

#### Công thức cần apply:

```javascript
// Total Checkins
const totalCheckins = checkins.length;

// By Service
const byService = groupBy(checkins, "service");

// Peak Hours
const peakHours = getPeakHours(checkins);
```

---

### 4️⃣ **VISITOR** (Module 03-01-08-xx)

#### Trang có dữ liệu tĩnh:

```
❌ 03-01-08-03-visitors-detail.html            → visitor stats (hardcoded)
❌ 03-01-08-05-visitor-stats-detail.html       → PT tiep, Inbody rates (hardcoded)
❌ 03-01-08-07-visitor-today-detail.html       → today visitors (hardcoded)
```

#### Công thức cần apply:

```javascript
// Visitors by Period
const todayVisitors = visitors.filter((v) => v.date === today).length;
const mtdVisitors = visitors.filter((v) => isCurrentMonth(v.date)).length;

// By Department
const byDepartment = groupBy(visitors, "department");

// Conversion Rates
const ptTiepRate = (ptTiep / saleTiep) * 100;
const inbodyRate = (inbodyMeasurements / totalVisitors) * 100;
```

---

## 📊 THỐNG KÊ TỔNG QUAN

### Pages:

| Module      | Total Pages | With Dynamic Data | With Static Data | Progress  |
| ----------- | ----------- | ----------------- | ---------------- | --------- |
| **Revenue** | 14          | 1                 | 13               | 7% ❌     |
| **Booking** | 8           | 2                 | 6                | 25% ⚠️    |
| **Checkin** | 12          | 0                 | 12               | 0% ❌     |
| **Visitor** | 8           | 0                 | 8                | 0% ❌     |
| **TOTAL**   | **42**      | **3**             | **39**           | **7%** ❌ |

### Metrics:

| Metric Type         | Total Metrics | With Formula | Without Formula | Progress   |
| ------------------- | ------------- | ------------ | --------------- | ---------- |
| **Revenue Metrics** | 30            | 8            | 22              | 27% ⚠️     |
| **Booking Metrics** | 15            | 5            | 10              | 33% ⚠️     |
| **Checkin Metrics** | 18            | 0            | 18              | 0% ❌      |
| **Visitor Metrics** | 12            | 0            | 12              | 0% ❌      |
| **TOTAL**           | **75**        | **13**       | **62**          | **17%** ❌ |

---

## 🚨 VẤN ĐỀ NGHIÊM TRỌNG

### 1. **Dữ liệu không nhất quán**

- Dashboard chính hiển thị một số
- Trang detail hiển thị số khác
- Không có single source of truth

### 2. **Không thể real-time**

- Tất cả số liệu là tĩnh
- Không update khi dữ liệu thay đổi
- User phải refresh page thủ công

### 3. **Khó bảo trì**

- Thay đổi data phải sửa nhiều chỗ
- Dễ sai sót và mất đồng bộ
- Không có automated testing

### 4. **Không chính xác**

- Dữ liệu mẫu không realistic
- Tính toán thủ công dễ sai
- Không có validation

---

## 🚀 KẾ HOẠCH KHẮC PHỤC (9 NGÀY)

### Week 1: Revenue (5 ngày)

**Day 1-2:** Core Revenue Pages

- ✅ revenue-calculations.js module
- ✅ MTD, Daily, Target pages integration

**Day 3-4:** Distribution Pages

- ✅ By Service, Club, Payment pages
- ✅ Real-time charts & tables

**Day 5:** Staff & Reports

- ✅ Staff revenue page
- ✅ Revenue reports integration

### Week 2: Booking, Checkin, Visitor (4 ngày)

**Day 6-7:** Booking & Checkin

- ✅ Booking pages dynamic data
- ✅ Checkin pages integration

**Day 8-9:** Visitor & Testing

- ✅ Visitor pages integration
- ✅ E2E testing & optimization

---

## 🎯 MỤC TIÊU

### Short-term (Tuần 1):

- ✅ **Revenue pages:** 100% dynamic (14/14)
- ✅ **Core metrics:** Working formulas
- ✅ **Real-time sync:** Basic implementation

### Mid-term (Tuần 2):

- ✅ **All pages:** 100% dynamic (42/42)
- ✅ **All metrics:** Working formulas (75/75)
- ✅ **Full integration:** With data layer

### Long-term (Tuần 3+):

- ✅ **Automated testing:** Full coverage
- ✅ **Performance:** Optimized
- ✅ **Documentation:** Complete

---

## 💡 KHUYẾN NGHỊ

### Ưu tiên cao (Làm ngay):

1. ✅ **Revenue MTD page** - Quan trọng nhất
2. ✅ **Revenue Target page** - Tracking mục tiêu
3. ✅ **Daily Revenue pages** - Theo dõi hàng ngày

### Ưu tiên trung bình (Tuần sau):

4. ✅ **Booking pages** - Đặt lịch
5. ✅ **Checkin pages** - Điểm danh
6. ✅ **Visitor pages** - Khách tham quan

### Ưu tiên thấp (Có thể delay):

7. ⚠️ **Advanced analytics** - Phân tích nâng cao
8. ⚠️ **Custom reports** - Báo cáo tùy chỉnh

---

## 📞 LIÊN HỆ HỖ TRỢ

Nếu cần hỗ trợ triển khai:

1. **Đọc chi tiết:** `REVENUE-CALCULATION-STATUS.md`
2. **Xem công thức:** `MISSING-CALCULATION-FORMULAS.md`
3. **Kiểm tra code:** `assets/js/shared/compute.js`
4. **Advanced metrics:** `ADVANCED-METRICS-GUIDE.md`

---

**Kết luận:** Hệ thống **đã có đầy đủ công thức** nhưng **chưa áp dụng vào UI**. Cần **9 ngày** để hoàn thành integration.

**Next steps:** Bắt đầu với Revenue MTD page → Core pages → Distribution pages → All pages.
