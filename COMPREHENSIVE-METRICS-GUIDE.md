# Comprehensive Metrics Guide - Actiwell Dashboard

## 📊 Tổng quan

Hệ thống **Comprehensive Metrics** cung cấp **50+ công thức tính toán nâng cao** được chia thành **8 nhóm chính**, giúp phân tích toàn diện hoạt động kinh doanh của Actiwell.

## 🎯 8 Nhóm Metrics Chính

### 1. **Visitor & Conversion Statistics** (Thống kê khách tham quan)

- **Visitor Conversion Rate**: Tỷ lệ chuyển đổi khách tham quan
- **Visitor Retention Rate**: Tỷ lệ giữ chân khách tham quan
- **Source Effectiveness Rate**: Hiệu quả nguồn khách hàng
- **Source ROI**: ROI theo nguồn

### 2. **Sales & Conversion Metrics** (Thống kê bán hàng)

- **Sale Tiếp Rate**: Tỷ lệ PT tiếp
- **Inbody Measurement Rate**: Tỷ lệ đo Inbody
- **PT Conversion Rate**: Tỷ lệ chuyển đổi PT
- **Inbody Conversion Rate**: Tỷ lệ chuyển đổi Inbody
- **Average Sales Cycle**: Thời gian trung bình từ lead đến sale
- **Sales Velocity**: Tốc độ bán hàng

### 3. **Facility & Capacity Metrics** (Thống kê cơ sở vật chất)

- **Floor Space Utilization**: Tỷ lệ sử dụng không gian
- **Equipment Utilization Rate**: Tỷ lệ sử dụng thiết bị
- **Locker Utilization**: Tỷ lệ sử dụng tủ đồ
- **Peak Hour Revenue Concentration**: Tập trung doanh thu giờ cao điểm
- **Off-Peak Utilization**: Sử dụng giờ thấp điểm

### 4. **Member Analytics** (Phân tích hội viên)

- **Member Activity Score**: Điểm hoạt động hội viên
- **Member Engagement Level**: Mức độ tương tác
- **Member Acquisition Cost by Channel**: CAC theo kênh
- **Member Lifetime Value by Segment**: MLV theo phân khúc
- **Member Churn Prediction Score**: Điểm dự đoán rời bỏ

### 5. **Financial Analytics** (Phân tích tài chính)

- **Revenue per Square Foot**: Doanh thu trên mỗi mét vuông
- **Revenue Concentration Index**: Chỉ số tập trung doanh thu
- **Revenue Growth Acceleration**: Gia tốc tăng trưởng doanh thu
- **Cost per Acquisition by Source**: Chi phí thu hút theo nguồn
- **Operational Cost Ratio**: Tỷ lệ chi phí vận hành
- **Profit Margin by Service**: Biên lợi nhuận theo dịch vụ

### 6. **Performance Metrics** (Thống kê hiệu suất)

- **Staff Productivity Index**: Chỉ số năng suất nhân viên
- **Staff Revenue per Hour**: Doanh thu/giờ của nhân viên
- **Staff Utilization Efficiency**: Hiệu quả sử dụng nhân viên
- **Service Satisfaction Score**: Điểm hài lòng dịch vụ
- **Service Completion Rate**: Tỷ lệ hoàn thành dịch vụ
- **Service Quality Index**: Chỉ số chất lượng dịch vụ

### 7. **Digital Analytics** (Phân tích số)

- **Website Conversion Rate**: Tỷ lệ chuyển đổi website
- **Social Media Engagement Rate**: Tỷ lệ tương tác mạng xã hội
- **Digital Marketing ROI**: ROI marketing số
- **App Usage Frequency**: Tần suất sử dụng app
- **App Feature Utilization**: Sử dụng tính năng app
- **App Retention Rate**: Tỷ lệ giữ chân app

### 8. **Predictive Analytics** (Phân tích dự đoán)

- **Demand Forecasting**: Dự báo nhu cầu
- **Revenue Forecasting**: Dự báo doanh thu
- **Capacity Planning**: Lập kế hoạch năng lực
- **Churn Risk Score**: Điểm rủi ro rời bỏ
- **Revenue Risk Assessment**: Đánh giá rủi ro doanh thu
- **Operational Risk Index**: Chỉ số rủi ro vận hành

## 🚀 Cách sử dụng

### 1. **Truy cập Dashboard**

```html
<!-- Mở trang demo -->
http://localhost/actiwell-dashboard-mockui/pages/comprehensive-metrics-demo.html
```

### 2. **Sử dụng trong Code**

```javascript
// Khởi tạo Comprehensive Calculations
const comprehensiveCalc = new ComprehensiveCalculations();

// Tính toán metrics cho visitor
const visitorData = {
  totalVisitors: 1000,
  convertedVisitors: 152,
  returningVisitors: 685,
  sourceVisitors: 500,
  sourceConversions: 112,
  sourceRevenue: 500000000,
  sourceCost: 175000000,
};

const visitorMetrics = comprehensiveCalc.calculateVisitorMetrics(visitorData);
console.log(visitorMetrics);
```

### 3. **Tính toán tất cả metrics**

```javascript
// Dữ liệu đầy đủ cho tất cả metrics
const allData = {
  visitor: {
    /* visitor data */
  },
  sales: {
    /* sales data */
  },
  facility: {
    /* facility data */
  },
  member: {
    /* member data */
  },
  financial: {
    /* financial data */
  },
  performance: {
    /* performance data */
  },
  digital: {
    /* digital data */
  },
  predictive: {
    /* predictive data */
  },
};

// Tính toán tất cả
const allMetrics = comprehensiveCalc.calculateAllComprehensiveMetrics(allData);
```

## 📈 Công thức chi tiết

### **Visitor Conversion Rate**

```
Formula: (Converted Visitors / Total Visitors) × 100
Example: (152 / 1000) × 100 = 15.2%
```

### **Sale Tiếp Rate**

```
Formula: (PT Tiếp / Sale Tiếp) × 100
Example: (221 / 281) × 100 = 78.6%
```

### **Member Activity Score**

```
Formula: (Check-ins + Bookings + PT Sessions) / 3
Example: (2500 + 800 + 300) / 3 = 1200 điểm
```

### **Revenue per Square Foot**

```
Formula: Total Revenue / Total Square Footage
Example: 500,000,000 / 1000 = 500,000 VNĐ/m²
```

## 🔧 Tích hợp vào Dashboard

### 1. **Thêm script vào HTML**

```html
<!-- Load Comprehensive Calculations Engine -->
<script src="assets/js/metrics-engine/comprehensive-calculations.js"></script>
```

### 2. **Gọi tính toán trong dashboard**

```javascript
// Trong dashboard chính
if (window.comprehensiveCalculations) {
  calculateComprehensiveMetricsForDashboard();
}
```

### 3. **Cập nhật UI elements**

```javascript
// Cập nhật metric cards
updateComprehensiveMetricElement(
  "visitorConversionRate",
  metrics.visitor.visitorConversionRate,
  "%"
);
updateComprehensiveMetricElement(
  "saleTiepRate",
  metrics.sales.saleTiepRate,
  "%"
);
```

## 📊 Dữ liệu mẫu

### **Visitor Data**

```javascript
const visitorData = {
  totalVisitors: 1000,
  convertedVisitors: 152,
  returningVisitors: 685,
  sourceVisitors: 500,
  sourceConversions: 112,
  sourceRevenue: 500000000,
  sourceCost: 175000000,
};
```

### **Sales Data**

```javascript
const salesData = {
  saleTiep: 281,
  ptTiep: 221,
  inbodyMeasurements: 127,
  sales: [
    { leadDate: "2024-01-01", saleDate: "2024-01-15" },
    { leadDate: "2024-01-05", saleDate: "2024-01-18" },
  ],
  numberOfSales: 50,
  averageDealSize: 5000000,
  salesCycleLength: 12,
};
```

## 🎨 Formatting Utilities

### **Currency Formatting**

```javascript
// Format VNĐ
const formatted = comprehensiveCalc.formatCurrency(1500000);
// Output: "1.500.000 ₫"
```

### **Percentage Formatting**

```javascript
// Format percentage
const formatted = comprehensiveCalc.formatPercentage(15.2);
// Output: "15.2%"
```

### **Number Formatting**

```javascript
// Format number with commas
const formatted = comprehensiveCalc.formatNumber(1234567);
// Output: "1.234.567"
```

## 🔄 Auto-update System

### **Cache Management**

```javascript
// Clear cache
comprehensiveCalc.clearCache();

// Cache timeout: 5 minutes
// Automatic cache invalidation
```

### **Real-time Updates**

```javascript
// Metrics tự động cập nhật khi dữ liệu thay đổi
// Không cần refresh trang
```

## 📱 Responsive Design

- **Desktop**: Hiển thị đầy đủ tất cả metrics
- **Tablet**: Hiển thị 2-3 metrics per row
- **Mobile**: Hiển thị 1 metric per row

## 🎯 Best Practices

### 1. **Data Validation**

```javascript
// Luôn kiểm tra dữ liệu đầu vào
if (!totalVisitors || totalVisitors === 0) return 0;
```

### 2. **Error Handling**

```javascript
try {
  const metrics = comprehensiveCalc.calculateAllComprehensiveMetrics(data);
} catch (error) {
  console.error("Error calculating metrics:", error);
}
```

### 3. **Performance Optimization**

```javascript
// Sử dụng cache cho tính toán phức tạp
// Batch calculations thay vì tính từng metric
```

## 🚀 Lợi ích

### **Quản lý toàn diện**

- 8 nhóm metrics chính
- 50+ công thức tính toán
- 100% coverage các khía cạnh kinh doanh

### **Dự báo chính xác**

- Predictive analytics
- Risk assessment
- Forecasting capabilities

### **Tối ưu hiệu suất**

- Real-time calculations
- Cache optimization
- Batch processing

### **Phân tích sâu**

- Member segmentation
- Revenue analysis
- Performance tracking

### **Ra quyết định thông minh**

- Data-driven insights
- Trend analysis
- Strategic planning

## 📞 Hỗ trợ

- **Documentation**: Xem file này để hiểu chi tiết
- **Demo Page**: `/pages/comprehensive-metrics-demo.html`
- **Source Code**: `/assets/js/metrics-engine/comprehensive-calculations.js`
- **Integration**: Đã tích hợp vào dashboard chính

---

**Tác giả**: AI Assistant  
**Phiên bản**: 1.0  
**Ngày cập nhật**: 2024-01-15  
**Trạng thái**: Production Ready ✅




