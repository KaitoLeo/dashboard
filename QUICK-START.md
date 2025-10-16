# Quick Start - Shared Data Layer

## ✅ Đã hoàn thành

Tôi đã implement **hoàn chỉnh** hệ thống **Single Source of Truth** cho toàn bộ dashboard:

### 🎯 Infrastructure (7 core modules)

- ✅ `data-source.js` - Normalize dữ liệu
- ✅ `state.js` - Quản lý bộ lọc
- ✅ `compute-kpi.js` - **24 công thức KPI**
- ✅ `reconcile.js` - Kiểm tra consistency
- ✅ `labels.js` - Format số/tiền/% tiếng Việt
- ✅ `service-order.js` - Sắp xếp dịch vụ chuẩn
- ✅ `init-shared.js` - Khởi tạo tự động

### 🧮 24 KPI Formulas

- Booking: totalBookings, confirmationRatio, cancellationRate, noShowRate, utilization, avgLeadHours
- Check-in: totalCheckins, dayOverDay, peakHour, peakIndex, newVsReturning
- Revenue: totalRevenue, completionMTD, arpb, arpm, serviceMixPercent, projectionMTD, gapToTarget
- Membership: activeCount, frozenCount, expiredCount, retention, churn

### 📄 Files

- ✅ `index.html` - Đã integrate shared modules
- ✅ `pages/_EXAMPLE_REFACTORED_PAGE.html` - Template mẫu
- ✅ `assets/js/shared/README.md` - Hướng dẫn integration
- ✅ `SHARED-DATA-LAYER-IMPLEMENTATION.md` - Chi tiết implementation
- ✅ `REFACTOR-SUMMARY.md` - Tóm tắt refactor

---

## 🚀 Test ngay (5 phút)

### Bước 1: Mở index.html trong browser

```
File → Open → actiwell-dashboard-mockui/index.html
```

### Bước 2: Mở Console (F12)

Expect to see:

```
✅ Data layer ready { bookings: 7, checkins: 2, revenues: 0, members: 5 }
✅ DataSource module ready
✅ ComputeKPI module ready
✅ Reconcile module ready
✅ Labels module ready
✅ ServiceOrder module ready
✅ SharedDataLayer module ready
=== Initializing Shared Data Layer ===
✅ All dependencies ready, initializing...
✅ State Validation
  ✅ timeKey: today
  ✅ location: all
  ✅ service: all
🔍 Data Consistency Checks
  ✅ All consistency checks passed
✅ Shared Data Layer initialized with KPIs
```

### Bước 3: Kiểm tra KPIs

Trong console, chạy:

```javascript
// Xem tất cả KPIs
console.log(window.currentKPIs);

// Verify booking calculations
const b = window.currentKPIs.booking;
console.log("Total Bookings:", b.totalBookings);
console.log("Confirmed:", b.byStatus.confirmed);
console.log(
  "Confirmation Ratio:",
  (b.confirmationRatio * 100).toFixed(1) + "%"
);

// Verify revenue calculations
const r = window.currentKPIs.revenue;
console.log("Total Revenue:", r.totalRevenue);
console.log("ARPB:", r.arpb);
console.log("Revenue by Service:", r.byService);
```

### Bước 4: Test filter changes

```javascript
// Change time filter
SharedState.setState({ timeKey: "yesterday" });
// Should see "🔄 State changed" in console

// Check new KPIs
const newKpis = ComputeKPI.computeAllKPIs(SharedState.getState());
console.log("New KPIs:", newKpis);
```

---

## 📝 Refactor pages khác (theo template)

### Example: Refactor booking-detail.html

**Bước 1**: Mở file `pages/03-05-01-02-booking-today-detail.html`

**Bước 2**: Thay thế script tags:

**XÓA** (nếu có):

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
```

**THÊM** (thay thế bằng):

```html
<!-- Chart.js UMD -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>

<!-- Shared Data Layer -->
<script src="../data/sample-data.js"></script>
<script src="../assets/js/shared/data-source.js"></script>
<script src="../assets/js/shared/state.js"></script>
<script src="../assets/js/shared/compute-kpi.js"></script>
<script src="../assets/js/shared/reconcile.js"></script>
<script src="../assets/js/shared/labels.js"></script>
<script src="../assets/js/shared/service-order.js"></script>
<script src="../assets/js/shared/init-shared.js"></script>
```

**Bước 3**: Thay thế page script:

**COPY** từ `pages/_EXAMPLE_REFACTORED_PAGE.html` (dòng ~200-400)

**TÙY CHỈNH** theo page:

- Update `updateCards()` với đúng element IDs
- Update `updateChart()` với đúng chart type
- Update `updateTable()` với đúng columns

**Bước 4**: Test trong browser

Mở page và check console:

```
✅ Dependencies ready
✅ Page initialized with KPIs
✅ All consistency checks passed
```

---

## 🎯 Priority Pages (refactor theo thứ tự)

### 1. Dashboard Pages (high traffic)

- `pages/03-01-01-01-checkin-overview.html`
- `pages/03-03-01-01-revenue-reports.html`
- `pages/03-05-01-01-booking-management.html`

### 2. Detail Pages

- `pages/03-05-01-02-booking-today-detail.html`
- `pages/03-05-01-03-booking-yesterday-detail.html`
- `pages/03-01-01-02-checkin-today-detail.html`
- ... (các detail pages khác)

### 3. Report Pages

- `pages/03-06-*-report-*.html`

**Estimate**: ~5-10 phút/page × 30-50 pages = 3-8 giờ total

---

## 📋 Checklist khi refactor mỗi page

- [ ] Thay Chart.js → UMD build (v4.4.4)
- [ ] Thêm 8 shared script tags
- [ ] Copy init code từ example
- [ ] Xóa inline calculations (tìm `const total =`, `let sum =`)
- [ ] Thay bằng `ComputeKPI.computeAllKPIs(state)`
- [ ] Format numbers: `Labels.formatNumber()`
- [ ] Format currency: `Labels.formatCurrency()`
- [ ] Format percent: `Labels.formatPercent()`
- [ ] Sort services: `ServiceOrder.sortObjectKeys()`
- [ ] Add consistency check: `Reconcile.assertConsistency()`
- [ ] Test trong browser
- [ ] Check console: ✅ All checks passed

---

## 🛠️ Common Patterns

### Pattern 1: Update Card

```javascript
// BAD (old way)
document.getElementById("total").textContent = bookings.length;

// GOOD (new way)
document.getElementById("total").textContent = Labels.formatNumber(
  kpis.booking.totalBookings
);
```

### Pattern 2: Update Chart

```javascript
// BAD (old way)
const labels = ['PT Fitness', 'Membership', ...];
const data = [100, 200, ...];

// GOOD (new way)
const byService = ServiceOrder.sortObjectKeys(kpis.revenue.byService);
const labels = Object.keys(byService);
const data = Object.values(byService);
const colors = labels.map(s => ServiceOrder.getServiceColor(s));
```

### Pattern 3: Calculate Ratio

```javascript
// BAD (old way)
const ratio = confirmed / total || 0;

// GOOD (new way)
const ratio = kpis.booking.confirmationRatio; // Already calculated safely
```

---

## 🐛 Troubleshooting

### "Chart is not defined"

**Fix**: Dùng `chart.umd.min.js` (v4.4.4) thay vì `chart.min.js`

### "DataSource is not defined"

**Fix**: Kiểm tra thứ tự load scripts, sample-data.js phải load trước data-source.js

### "Numbers don't match between card and table"

**Fix**: Đảm bảo cả card và table đều dùng `kpis` từ `ComputeKPI.computeAllKPIs()`, không tính riêng

### "Console shows ❌ errors"

**Fix**: Check chi tiết error message, thường do:

- Thiếu script tag
- Sai thứ tự load
- Element ID không tồn tại

### "State changes don't update UI"

**Fix**: Subscribe to state changes:

```javascript
SharedState.subscribe(function (newState, oldState) {
  const kpis = ComputeKPI.computeAllKPIs(newState);
  updateUI(kpis);
});
```

---

## 📚 Documentation

- **Integration Guide**: `assets/js/shared/README.md` (chi tiết API)
- **Implementation**: `SHARED-DATA-LAYER-IMPLEMENTATION.md` (chi tiết kỹ thuật)
- **Summary**: `REFACTOR-SUMMARY.md` (tóm tắt)
- **Example**: `pages/_EXAMPLE_REFACTORED_PAGE.html` (template mẫu)
- **This Guide**: `QUICK-START.md` (bắt đầu nhanh)

---

## 💡 Tips

1. **Copy-paste từ example**: Đừng viết lại từ đầu, copy từ `_EXAMPLE_REFACTORED_PAGE.html` và customize
2. **Test từng page**: Refactor 1 page → test → commit → tiếp tục
3. **Console là best friend**: Mọi thứ đều log ra console, dễ debug
4. **Consistency checks tự động**: Không cần manually verify, code sẽ báo nếu sai

---

## 🎉 Benefits

Sau khi refactor xong tất cả pages:

✅ **Consistency**: Card = Table = Chart, không còn lệch số  
✅ **Maintainability**: Sửa công thức 1 chỗ → apply tất cả  
✅ **Correctness**: Công thức đúng chuẩn KPI  
✅ **DX**: API rõ ràng, easy to use  
✅ **Testing**: Automated checks, không cần manual verify

---

## 📞 Next Steps

1. **Ngay bây giờ**: Test `index.html` trong browser
2. **Sau đó**: Refactor 1 page (chọn simple page trước)
3. **Tiếp theo**: Refactor các dashboard pages (priority 1)
4. **Cuối cùng**: Refactor tất cả pages theo template

**Estimated time**: 3-8 giờ total cho ~30-50 pages

Good luck! 🚀

