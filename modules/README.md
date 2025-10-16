# Actiwell Dashboard - Module Structure

## Tổng quan

Hệ thống được tổ chức thành 6 module lớn, mỗi module có cấu trúc theo **locations** và **timeline** để dễ quản lý và mở rộng.

## 6 Module Chính

### 📊 Module 1: Check-in Management (01-checkin)

**Mục đích:** Quản lý check-in theo thời gian và chi nhánh

- **Locations:** Tất cả chi nhánh, Chi nhánh cụ thể
- **Timeline:** Hôm nay, Hôm qua, Tháng này, Phân tích tần suất
- **Số files:** 32 files

### 📋 Module 2: Contract Management (02-contract)

**Mục đích:** Quản lý hợp đồng và báo cáo

- **Timeline:** Reports, Member, Trainer, Activation, Burn Rate, Completion
- **Số files:** 8 files

### 💰 Module 3: Revenue Management (03-revenue)

**Mục đích:** Quản lý doanh thu theo địa điểm và thời gian

- **Locations:** Service, Club, Staff, Payment, Target, Operation, Facility, Fitness, Membership
- **Timeline:** Daily, MTD, Reports, Analytics
- **Số files:** 33 files

### 👥 Module 4: CRM (04-crm)

**Mục đích:** Quản lý khách hàng và mối quan hệ

- **Timeline:** Reports, Detail, Customers, CSR, Movement, Birthday
- **Số files:** 6 files

### 📅 Module 5: Booking Management (05-booking)

**Mục đích:** Quản lý đặt chỗ

- **Timeline:** Management
- **Số files:** 1 file

### 📄 Module 6: Reports & Audit (06-reports)

**Mục đích:** Báo cáo và kiểm toán

- **Timeline:** Receipt, Audit
- **Số files:** 2 files

## Cấu trúc thư mục

```
modules/
├── 01-checkin/
│   ├── locations/
│   │   ├── all-branches/
│   │   └── specific-branch/
│   └── timeline/
│       ├── today/
│       ├── yesterday/
│       ├── mtd/
│       └── frequency/
├── 02-contract/
│   └── timeline/
│       ├── reports/
│       ├── member/
│       ├── trainer/
│       ├── activation/
│       ├── burn-rate/
│       └── completion/
├── 03-revenue/
│   ├── locations/
│   │   ├── service/
│   │   ├── club/
│   │   ├── staff/
│   │   ├── payment/
│   │   ├── target/
│   │   ├── operation/
│   │   ├── facility/
│   │   ├── fitness/
│   │   └── membership/
│   └── timeline/
│       ├── daily/
│       ├── mtd/
│       ├── reports/
│       └── analytics/
├── 04-crm/
│   └── timeline/
│       ├── reports/
│       ├── detail/
│       ├── customers/
│       ├── csr/
│       ├── movement/
│       └── birthday/
├── 05-booking/
│   └── timeline/
│       └── management/
└── 06-reports/
    └── timeline/
        ├── receipt/
        └── audit/
```

## Lợi ích của cấu trúc mới

1. **Tổ chức rõ ràng:** Mỗi module có mục đích cụ thể
2. **Dễ mở rộng:** Thêm location/timeline mới dễ dàng
3. **Maintainable:** Cấu trúc logic, dễ bảo trì
4. **Scalable:** Có thể thêm module mới
5. **User-friendly:** Navigation theo logic nghiệp vụ

## Cách sử dụng

1. **Truy cập module:** `/modules/{module-id}/`
2. **Theo location:** `/modules/{module-id}/locations/{location}/`
3. **Theo timeline:** `/modules/{module-id}/timeline/{timeline}/`
4. **Kết hợp:** `/modules/{module-id}/locations/{location}/timeline/{timeline}/`

## Migration từ cấu trúc cũ

- Tất cả file cũ vẫn tồn tại trong thư mục `pages/`
- File mới được copy vào cấu trúc module
- Có thể dần dần chuyển đổi sang cấu trúc mới
- Không mất dữ liệu, đảm bảo backward compatibility


