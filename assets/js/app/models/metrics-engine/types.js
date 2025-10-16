/**
 * Metrics Engine - Data Types
 * Định nghĩa các kiểu dữ liệu chuẩn cho hệ thống metrics
 */

// Kiểu dữ liệu thô từ API hoặc mock data
const RawDataTypes = {
  CHECKIN: "checkin",
  MEMBER: "member",
  REVENUE: "revenue",
  BOOKING: "booking",
};

// Kiểu metric
const MetricTypes = {
  COUNT: "count",
  PERCENTAGE: "percentage",
  SUM: "sum",
  AVERAGE: "average",
  RATIO: "ratio",
};

// Kiểu filter
const FilterTypes = {
  DATE_RANGE: "dateRange",
  LOCATION: "location",
  DEPARTMENT: "department",
  STATUS: "status",
  SEARCH: "search",
  PAGINATION: "pagination",
};

// Cấu trúc dữ liệu chuẩn cho check-in
const CheckinDataModel = {
  id: null,
  memberId: null,
  memberName: null,
  location: null,
  locationKey: null,
  department: null,
  departmentKey: null,
  staffInCharge: null,
  checkinTime: null,
  requiredTime: null,
  timeDifference: null, // phút (dương = muộn, âm = sớm, 0 = đúng giờ)
  lateType: null, // 'late', 'early', 'ontime'
  checkinType: null, // 'Thủ công', 'Tự động'
  reason: null,
  status: null,
  serviceType: null, // cho các dịch vụ cụ thể
  classType: null, // cho Pilates, PT Fitness
  instructor: null,
  createdAt: null,
  updatedAt: null,
};

// Cấu trúc filter toàn cục
const GlobalFilterState = {
  dateRange: {
    start: null,
    end: null,
    type: "today", // 'today', 'yesterday', 'week', 'month', 'custom'
  },
  location: {
    selected: "all",
    options: [],
  },
  department: {
    selected: "all",
    options: [],
  },
  status: {
    selected: "all",
    options: [],
  },
  search: {
    query: "",
    fields: ["memberName", "memberId"],
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  sort: {
    field: "checkinTime",
    direction: "desc", // 'asc', 'desc'
  },
};

// Cấu trúc metric result
const MetricResult = {
  value: null,
  type: null,
  label: null,
  description: null,
  trend: null, // 'up', 'down', 'stable'
  previousValue: null,
  change: null, // số thay đổi
  changePercentage: null,
  formattedValue: null,
  rawData: null,
};

// Cấu trúc cache entry
const CacheEntry = {
  key: null,
  data: null,
  timestamp: null,
  ttl: 300000, // 5 phút
  dependencies: [], // các filter dependencies
};

// Export cho sử dụng
window.MetricsTypes = {
  RawDataTypes,
  MetricTypes,
  FilterTypes,
  CheckinDataModel,
  GlobalFilterState,
  MetricResult,
  CacheEntry,
};
