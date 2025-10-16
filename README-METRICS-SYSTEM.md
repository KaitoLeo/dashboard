# Actiwell Metrics System - Hệ thống tính toán metrics toàn diện

## Tổng quan

Hệ thống Metrics System của Actiwell cung cấp một bộ công cụ tính toán toàn diện với 50+ công thức tính toán, được chia thành 8 nhóm chính. Hệ thống hỗ trợ cập nhật real-time, giám sát hiệu suất và tối ưu hóa tự động.

## Cấu trúc hệ thống

### 1. Core Components

#### 1.1 Comprehensive Calculations Engine

- **File**: `assets/js/metrics-engine/comprehensive-calculations.js`
- **Chức năng**: Tính toán tất cả metrics với 50+ công thức
- **Tính năng**: Cache system, batch calculation, error handling

#### 1.2 Real-time Updater

- **File**: `assets/js/metrics-engine/real-time-updater.js`
- **Chức năng**: Cập nhật metrics theo thời gian thực
- **Tính năng**: Auto-update, manual refresh, interval control

#### 1.3 Performance Monitor

- **File**: `assets/js/metrics-engine/performance-monitor.js`
- **Chức năng**: Giám sát hiệu suất và tối ưu hóa
- **Tính năng**: Memory monitoring, calculation time tracking, optimization suggestions

### 2. 8 Nhóm Metrics

#### 2.1 Visitor & Conversion Statistics

- Visitor Conversion Rate
- Visitor Retention Rate
- Source Effectiveness Rate
- Source ROI

#### 2.2 Sales & Conversion Metrics

- Sale Tiếp Rate
- Inbody Measurement Rate
- PT Conversion Rate
- Inbody Conversion Rate
- Average Sales Cycle
- Sales Velocity

#### 2.3 Facility & Capacity Metrics

- Floor Space Utilization
- Equipment Utilization Rate
- Locker Utilization
- Peak Hour Revenue Concentration
- Off-Peak Utilization

#### 2.4 Member Analytics

- Member Activity Score
- Member Engagement Level
- Member Acquisition Cost by Channel
- Member Lifetime Value by Segment
- Member Churn Prediction Score

#### 2.5 Financial Analytics

- Revenue per Square Foot
- Revenue Concentration Index
- Revenue Growth Acceleration
- Cost per Acquisition by Source
- Operational Cost Ratio
- Profit Margin by Service

#### 2.6 Performance Metrics

- Staff Productivity Index
- Staff Revenue per Hour
- Staff Utilization Efficiency
- Service Satisfaction Score
- Service Completion Rate
- Service Quality Index

#### 2.7 Digital Analytics

- Website Conversion Rate
- Social Media Engagement Rate
- Digital Marketing ROI
- App Usage Frequency
- App Feature Utilization
- App Retention Rate

#### 2.8 Predictive Analytics

- Demand Forecasting
- Revenue Forecasting
- Capacity Planning
- Churn Risk Score
- Revenue Risk Assessment
- Operational Risk Index

## Cách sử dụng

### 1. Khởi tạo hệ thống

```javascript
// Tự động khởi tạo khi load trang
document.addEventListener("DOMContentLoaded", function () {
  // Hệ thống sẽ tự động load và khởi tạo
});
```

### 2. Tính toán metrics

```javascript
// Tính toán tất cả metrics
const data = {
  visitor: {
    /* visitor data */
  },
  sales: {
    /* sales data */
  },
  // ... other data
};

const metrics =
  window.comprehensiveCalculations.calculateAllComprehensiveMetrics(data);
```

### 3. Cập nhật real-time

```javascript
// Bắt đầu cập nhật real-time
window.realTimeUpdater.start();

// Dừng cập nhật
window.realTimeUpdater.stop();

// Thay đổi interval
window.realTimeUpdater.setUpdateInterval(60000); // 1 phút
```

### 4. Giám sát hiệu suất

```javascript
// Lấy báo cáo hiệu suất
const report = window.performanceMonitor.getPerformanceReport();

// Tối ưu hóa hiệu suất
window.performanceMonitor.optimizePerformance();
```

## Demo Pages

### 1. Comprehensive Metrics Demo

- **URL**: `pages/comprehensive-metrics-demo.html`
- **Chức năng**: Hiển thị tất cả 50+ metrics với công thức
- **Tính năng**: Interactive display, formula explanation

### 2. Real-time Dashboard

- **URL**: `pages/real-time-dashboard.html`
- **Chức năng**: Dashboard cập nhật real-time
- **Tính năng**: Live updates, control panel, status monitoring

### 3. Performance Monitor Demo

- **URL**: `pages/performance-monitor-demo.html`
- **Chức năng**: Giám sát hiệu suất hệ thống
- **Tính năng**: Performance metrics, optimization suggestions

## Tích hợp vào Dashboard chính

### 1. Load Scripts

```html
<!-- Comprehensive Calculations Engine -->
<script src="assets/js/metrics-engine/comprehensive-calculations.js"></script>

<!-- Real-time Updater -->
<script src="assets/js/metrics-engine/real-time-updater.js"></script>

<!-- Performance Monitor -->
<script src="assets/js/metrics-engine/performance-monitor.js"></script>
```

### 2. Khởi tạo trong Dashboard

```javascript
// Calculate Comprehensive Metrics
if (window.comprehensiveCalculations) {
  calculateComprehensiveMetricsForDashboard();
}

// Start Real-time Updates
if (window.realTimeUpdater) {
  window.realTimeUpdater.start();
}
```

## API Reference

### ComprehensiveCalculations Class

#### Methods

- `calculateAllComprehensiveMetrics(data)` - Tính toán tất cả metrics
- `calculateVisitorMetrics(data)` - Tính toán visitor metrics
- `calculateSalesMetrics(data)` - Tính toán sales metrics
- `calculateFacilityMetrics(data)` - Tính toán facility metrics
- `calculateMemberAnalytics(data)` - Tính toán member analytics
- `calculateFinancialAnalytics(data)` - Tính toán financial analytics
- `calculatePerformanceMetrics(data)` - Tính toán performance metrics
- `calculateDigitalAnalytics(data)` - Tính toán digital analytics
- `calculatePredictiveAnalytics(data)` - Tính toán predictive analytics

#### Utility Methods

- `formatCurrency(amount)` - Format tiền tệ VNĐ
- `formatPercentage(value)` - Format phần trăm
- `formatNumber(value)` - Format số
- `clearCache()` - Xóa cache

### RealTimeUpdater Class

#### Methods

- `start()` - Bắt đầu cập nhật real-time
- `stop()` - Dừng cập nhật real-time
- `setUpdateInterval(intervalMs)` - Thay đổi interval
- `onUpdate(callback)` - Thêm callback khi cập nhật
- `getStatus()` - Lấy trạng thái

### PerformanceMonitor Class

#### Methods

- `getPerformanceReport()` - Lấy báo cáo hiệu suất
- `optimizePerformance()` - Tối ưu hóa hiệu suất
- `resetMetrics()` - Reset metrics
- `recordSuccess()` - Ghi nhận thành công
- `recordError(error)` - Ghi nhận lỗi

## Cấu hình

### 1. Update Intervals

```javascript
// Thay đổi interval cập nhật
window.realTimeUpdater.setUpdateInterval(30000); // 30 giây
```

### 2. Performance Thresholds

```javascript
// Cấu hình thresholds
window.performanceMonitor.thresholds = {
  maxCalculationTime: 1000, // 1 giây
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  maxErrorRate: 0.05, // 5%
};
```

### 3. Cache Settings

```javascript
// Cấu hình cache
window.comprehensiveCalculations.cacheTimeout = 5 * 60 * 1000; // 5 phút
```

## Troubleshooting

### 1. Lỗi tính toán

- Kiểm tra dữ liệu đầu vào
- Xem console log để debug
- Sử dụng performance monitor để kiểm tra

### 2. Hiệu suất chậm

- Kiểm tra performance report
- Chạy optimization
- Điều chỉnh cache settings

### 3. Real-time không hoạt động

- Kiểm tra trạng thái updater
- Xem console log
- Thử manual refresh

## Best Practices

### 1. Data Management

- Sử dụng cache để tối ưu hiệu suất
- Validate dữ liệu trước khi tính toán
- Xử lý lỗi gracefully

### 2. Performance

- Monitor hiệu suất thường xuyên
- Sử dụng batch processing
- Tối ưu hóa memory usage

### 3. User Experience

- Hiển thị loading states
- Cung cấp error messages
- Sử dụng real-time updates

## Roadmap

### Phase 1 (Completed)

- ✅ Comprehensive calculations engine
- ✅ Real-time updater
- ✅ Performance monitor
- ✅ Demo pages
- ✅ Main dashboard integration

### Phase 2 (Planned)

- 🔄 WebSocket integration
- 🔄 Advanced caching strategies
- 🔄 Machine learning predictions
- 🔄 Mobile optimization

### Phase 3 (Future)

- 📋 Multi-tenant support
- 📋 Advanced analytics
- 📋 Custom formula builder
- 📋 API endpoints

## Support

Để được hỗ trợ, vui lòng:

1. Kiểm tra console log để xem lỗi
2. Sử dụng performance monitor để debug
3. Tham khảo demo pages để hiểu cách sử dụng
4. Liên hệ team development để được hỗ trợ

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Author**: Actiwell Development Team




