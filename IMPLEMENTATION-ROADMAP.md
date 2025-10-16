# 🚀 **IMPLEMENTATION ROADMAP - Tích hợp Dashboard vào Actiwell**

**Mục tiêu tối thượng**: Tích hợp mock dashboard vào `actiwell-frontend-cms-app` (React) sử dụng `mfit-be` (Laravel) làm backend

**Status**: 📋 Planning Phase
**Last Updated**: 2025-10-15

---

## 📊 **HIỆN TRẠNG**

### ✅ **ĐÃ HOÀN THÀNH:**

- Mock UI với 102 HTML pages
- Shared data layer (state, compute-kpi, reconcile)
- Navigation wrapper & page initializer
- Data consistency checking
- Chart.js integration
- Bootstrap UI components

### ❌ **CHƯA CÓ:**

- Kết nối với API thực từ `mfit-be`
- React components
- JWT authentication
- Redux state management
- Real-time data updates

---

## 🎯 **PHƯƠNG ÁN ĐƯỢC CHỌN: OPTION 2 - API ADAPTER**

**Lý do chọn:**

1. ✅ Thời gian phát triển hợp lý (7-10 ngày)
2. ✅ Có thể toggle giữa mock và real data
3. ✅ Giữ nguyên 102 pages đã thiết kế
4. ✅ Gradual migration sang React sau này
5. ✅ Reuse existing shared data layer

**Timeline**: 10 ngày làm việc
**Team**: 1 Full-stack developer + 1 QA

---

## 📅 **CHI TIẾT IMPLEMENTATION (10 NGÀY)**

### **PHASE 1: API Service Layer (3 ngày)**

#### **Day 1: Setup & Authentication**

**File cần tạo:**

```
actiwell-dashboard-mockui/
├── assets/js/
│   ├── shared/
│   │   ├── auth-manager.js          ← NEW
│   │   ├── api-client.js            ← NEW
│   │   └── config.js                ← NEW
```

**Tasks:**

- [ ] Tạo `config.js` với API base URL
- [ ] Implement `auth-manager.js` với JWT token management
- [ ] Implement `api-client.js` với fetch wrapper + auth headers
- [ ] Add token refresh logic
- [ ] Add error handling (401, 403, 500)

**Code Example - auth-manager.js:**

```javascript
// assets/js/shared/auth-manager.js
(function (w) {
  "use strict";

  class AuthManager {
    constructor() {
      this.token = this.loadToken();
      this.refreshToken = this.loadRefreshToken();
    }

    loadToken() {
      // 1. Check URL params (for SSO)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        this.saveToken(urlToken);
        return urlToken;
      }

      // 2. Check localStorage
      return localStorage.getItem("jwt_token");
    }

    loadRefreshToken() {
      return localStorage.getItem("refresh_token");
    }

    saveToken(token, refreshToken = null) {
      localStorage.setItem("jwt_token", token);
      this.token = token;

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
        this.refreshToken = refreshToken;
      }
    }

    clearToken() {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("refresh_token");
      this.token = null;
      this.refreshToken = null;
    }

    isAuthenticated() {
      return !!this.token;
    }

    getToken() {
      return this.token;
    }

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.redirectToLogin();
        return;
      }

      try {
        const response = await fetch(
          `${w.AppConfig.API_BASE_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.refreshToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          this.saveToken(data.token, data.refresh_token);
          return data.token;
        } else {
          this.redirectToLogin();
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        this.redirectToLogin();
      }
    }

    redirectToLogin() {
      const redirect = encodeURIComponent(window.location.href);
      window.location.href = `/login?redirect=${redirect}`;
    }
  }

  w.AuthManager = new AuthManager();

  // Auto-redirect if not authenticated (except on login page)
  if (
    !window.location.pathname.includes("/login") &&
    !w.AuthManager.isAuthenticated()
  ) {
    w.AuthManager.redirectToLogin();
  }
})(window);
```

**Code Example - api-client.js:**

```javascript
// assets/js/shared/api-client.js
(function (w) {
  "use strict";

  class APIClient {
    constructor() {
      this.baseURL = w.AppConfig.API_BASE_URL;
      this.defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    }

    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const token = w.AuthManager.getToken();

      const config = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      try {
        const response = await fetch(url, config);

        // Handle 401 - Token expired
        if (response.status === 401) {
          const newToken = await w.AuthManager.refreshAccessToken();
          if (newToken) {
            // Retry with new token
            config.headers["Authorization"] = `Bearer ${newToken}`;
            return await fetch(url, config);
          }
        }

        // Handle other errors
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `API Error: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`API Request failed: ${endpoint}`, error);
        throw error;
      }
    }

    async get(endpoint, params = {}) {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      return this.request(url, { method: "GET" });
    }

    async post(endpoint, data = {}) {
      return this.request(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    }

    async put(endpoint, data = {}) {
      return this.request(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }

    async delete(endpoint) {
      return this.request(endpoint, { method: "DELETE" });
    }
  }

  w.APIClient = new APIClient();
})(window);
```

**Code Example - config.js:**

```javascript
// assets/js/shared/config.js
(function (w) {
  "use strict";

  w.AppConfig = {
    // API Configuration
    API_BASE_URL:
      window.location.hostname === "localhost"
        ? "http://localhost:8000" // Development
        : "https://api.actiwell.com", // Production

    // Feature Flags
    USE_MOCK_DATA: false, // Toggle between mock and real API
    ENABLE_DEBUG: true,
    ENABLE_DATA_CONSISTENCY_CHECK: true,

    // Cache Configuration
    CACHE_ENABLED: true,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutes

    // Refresh Intervals
    AUTO_REFRESH_INTERVAL: 60 * 1000, // 1 minute
  };
})(window);
```

---

#### **Day 2: Dashboard API Service**

**File cần tạo:**

```
actiwell-dashboard-mockui/
├── assets/js/
│   ├── services/
│   │   ├── dashboard-service.js     ← NEW
│   │   ├── booking-service.js       ← NEW
│   │   └── revenue-service.js       ← NEW
```

**Tasks:**

- [ ] Map tất cả 15 endpoints từ `DashboardController`
- [ ] Implement `dashboard-service.js`
- [ ] Add request parameter builders
- [ ] Add response caching
- [ ] Test các endpoints với Postman/curl

**Code Example - dashboard-service.js:**

```javascript
// assets/js/services/dashboard-service.js
(function (w) {
  "use strict";

  class DashboardService {
    constructor() {
      this.cache = new Map();
      this.cacheEnabled = w.AppConfig.CACHE_ENABLED;
      this.cacheTTL = w.AppConfig.CACHE_TTL;
    }

    // Helper: Build cache key
    getCacheKey(endpoint, params) {
      return `${endpoint}_${JSON.stringify(params)}`;
    }

    // Helper: Get cached data
    getCache(key) {
      if (!this.cacheEnabled) return null;

      const cached = this.cache.get(key);
      if (!cached) return null;

      if (Date.now() - cached.timestamp > this.cacheTTL) {
        this.cache.delete(key);
        return null;
      }

      return cached.data;
    }

    // Helper: Set cache
    setCache(key, data) {
      if (!this.cacheEnabled) return;

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
    }

    /**
     * GET /api/v1/cms/dashboard/statistics
     * Lấy thống kê tổng quan dashboard
     */
    async getStatistics(year, month = null, locationIds = []) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const cacheKey = this.getCacheKey(
        "/api/v1/cms/dashboard/statistics",
        params
      );
      const cached = this.getCache(cacheKey);
      if (cached) {
        console.log("📦 Using cached statistics");
        return cached;
      }

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/statistics",
        params
      );
      this.setCache(cacheKey, response);
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/growth-chart
     * Lấy biểu đồ tăng trưởng
     */
    async getGrowthChart(
      year,
      month = null,
      locationIds = [],
      module = "sale"
    ) {
      const params = {
        year,
        module, // sale, member, package, booking, checkin
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/growth-chart",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/staffs/sales-revenue
     * Lấy doanh thu theo nhân viên
     */
    async getSalesRevenue(year, month = null, locationIds = [], staffIds = []) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
        ...(staffIds.length && { "staff_ids[]": staffIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/staffs/sales-revenue",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/staffs/bookings
     * Lấy booking theo nhân viên
     */
    async getStaffBookings(
      year,
      month = null,
      locationIds = [],
      staffIds = []
    ) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
        ...(staffIds.length && { "staff_ids[]": staffIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/staffs/bookings",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/prediction
     * Lấy dự đoán doanh thu
     */
    async getPrediction(year, month = null, locationIds = []) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/prediction",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/year-total-revenue
     * Lấy tổng doanh thu theo năm
     */
    async getYearTotalRevenue(year, locationIds = []) {
      const params = {
        year,
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/year-total-revenue",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/service-revenue
     * Lấy doanh thu theo dịch vụ
     */
    async getServiceRevenue(year, month = null, locationIds = []) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/service-revenue",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/customer-market-segments
     * Lấy phân khúc thị trường khách hàng
     */
    async getCustomerMarketSegments(year, month = null, locationIds = []) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/customer-market-segments",
        params
      );
      return response;
    }

    /**
     * GET /api/v1/cms/dashboard/customer-stages
     * Lấy giai đoạn khách hàng
     */
    async getCustomerStages(year, month = null, locationIds = []) {
      const params = {
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      };

      const response = await w.APIClient.get(
        "/api/v1/cms/dashboard/customer-stages",
        params
      );
      return response;
    }

    /**
     * Clear all cache
     */
    clearCache() {
      this.cache.clear();
      console.log("🗑️ Cache cleared");
    }
  }

  w.DashboardService = new DashboardService();
})(window);
```

---

#### **Day 3: Data Adapters/Transformers**

**File cần tạo:**

```
actiwell-dashboard-mockui/
├── assets/js/
│   ├── adapters/
│   │   ├── dashboard-adapter.js     ← NEW
│   │   ├── booking-adapter.js       ← NEW
│   │   ├── revenue-adapter.js       ← NEW
│   │   └── member-adapter.js        ← NEW
```

**Tasks:**

- [ ] Tạo adapters để transform API response → mock data structure
- [ ] Map API fields sang SampleData format
- [ ] Handle missing data/null values
- [ ] Add data validation
- [ ] Test transformations

**Code Example - dashboard-adapter.js:**

```javascript
// assets/js/adapters/dashboard-adapter.js
(function (w) {
  "use strict";

  class DashboardAdapter {
    /**
     * Transform API statistics response to match SampleData format
     *
     * API Response structure:
     * {
     *   "success": true,
     *   "data": {
     *     "revenue": { "current": 1234567, "previous": 1000000, ... },
     *     "member": { "current": {...}, "previous": {...}, ... },
     *     "package": { "current": {...}, "previous": {...}, ... },
     *     ...
     *   }
     * }
     */
    transformStatistics(apiResponse) {
      if (!apiResponse || !apiResponse.success) {
        console.error("Invalid API response:", apiResponse);
        return null;
      }

      const data = apiResponse.data;

      return {
        // Revenue data
        revenue: {
          current: data.revenue?.current || 0,
          previous: data.revenue?.previous || 0,
          change: this.calculateChange(
            data.revenue?.current || 0,
            data.revenue?.previous || 0
          ),
          changePercent: this.calculateChangePercent(
            data.revenue?.current || 0,
            data.revenue?.previous || 0
          ),
          target: data.revenue?.target || 0,
          completionRate: this.calculateCompletionRate(
            data.revenue?.current || 0,
            data.revenue?.target || 0
          ),
        },

        // Member data
        members: {
          total: data.member?.current?.total || 0,
          active: data.member?.current?.active || 0,
          inactive: data.member?.current?.inactive || 0,
          inClass: data.member?.in_class || 0,
          new: data.member?.current?.new || 0,
          previous: {
            total: data.member?.previous?.total || 0,
            active: data.member?.previous?.active || 0,
          },
          change: this.calculateChange(
            data.member?.current?.total || 0,
            data.member?.previous?.total || 0
          ),
        },

        // Package data
        packages: {
          current: data.package?.current || 0,
          previous: data.package?.previous || 0,
          change: this.calculateChange(
            data.package?.current || 0,
            data.package?.previous || 0
          ),
          expired: data.package?.expired || 0,
          expiringSoon: data.package?.expiring_soon || 0,
        },

        // Booking data
        bookings: {
          total: data.booking?.total || 0,
          completed: data.booking?.completed || 0,
          pending: data.booking?.pending || 0,
          cancelled: data.booking?.cancelled || 0,
          completionRate: this.calculateCompletionRate(
            data.booking?.completed || 0,
            data.booking?.total || 0
          ),
        },

        // Check-in data
        checkins: {
          total: data.checkin?.total || 0,
          today: data.checkin?.today || 0,
          yesterday: data.checkin?.yesterday || 0,
          mtd: data.checkin?.mtd || 0,
          change: this.calculateChange(
            data.checkin?.today || 0,
            data.checkin?.yesterday || 0
          ),
        },

        // Timestamp
        timestamp: new Date().toISOString(),
        source: "API",
      };
    }

    /**
     * Transform growth chart API response
     */
    transformGrowthChart(apiResponse) {
      if (!apiResponse || !apiResponse.success) {
        return null;
      }

      const data = apiResponse.data;

      // Transform to Chart.js format
      return {
        labels: data.map((item) => item.label),
        datasets: [
          {
            label: data[0]?.module || "Growth",
            data: data.map((item) => item.value),
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      };
    }

    /**
     * Transform service revenue API response
     */
    transformServiceRevenue(apiResponse) {
      if (!apiResponse || !apiResponse.success) {
        return null;
      }

      const data = apiResponse.data;

      // Group by service and sum revenue
      const serviceMap = {};
      data.forEach((item) => {
        const service = item.service_name || "Other";
        if (!serviceMap[service]) {
          serviceMap[service] = 0;
        }
        serviceMap[service] += item.revenue || 0;
      });

      // Sort by order: Membership, PT Fitness, Pilates, Swimming Coach, Other
      const serviceOrder = [
        "Membership",
        "PT Fitness",
        "Pilates",
        "Swimming Coach",
      ];
      const sortedServices = Object.keys(serviceMap).sort((a, b) => {
        const indexA = serviceOrder.indexOf(a);
        const indexB = serviceOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      return {
        labels: sortedServices,
        values: sortedServices.map((service) => serviceMap[service]),
        total: Object.values(serviceMap).reduce((sum, val) => sum + val, 0),
      };
    }

    // Helper methods
    calculateChange(current, previous) {
      return current - previous;
    }

    calculateChangePercent(current, previous) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    }

    calculateCompletionRate(completed, total) {
      if (total === 0) return 0;
      return (completed / total) * 100;
    }

    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    }

    formatNumber(value) {
      return new Intl.NumberFormat("vi-VN").format(value);
    }
  }

  w.DashboardAdapter = new DashboardAdapter();
})(window);
```

---

### **PHASE 2: Data Layer Integration (3 ngày)**

#### **Day 4: Update Data Source**

**File cần sửa:**

```
actiwell-dashboard-mockui/assets/js/shared/
├── data-source.js        ← UPDATE: Add API loading
├── state.js              ← UPDATE: Add loading states
└── init-shared.js        ← UPDATE: Initialize API services
```

**Tasks:**

- [ ] Update `data-source.js` với API loading logic
- [ ] Add toggle between mock/API data
- [ ] Implement error handling & fallback
- [ ] Add loading states
- [ ] Test data loading from API

**Code Example - data-source.js (UPDATED):**

```javascript
// assets/js/shared/data-source.js - UPDATED
(function (w) {
  "use strict";

  let _data = {
    bookings: [],
    checkins: [],
    revenues: [],
    members: [],
    rawStatistics: null,
    lastLoaded: null,
    source: "none", // "mock" or "api"
  };

  /**
   * Main loading function - routes to mock or API
   */
  async function loadAndNormalizeData(state) {
    const useMock = w.AppConfig?.USE_MOCK_DATA ?? true;

    console.log(`📊 Loading data from ${useMock ? "MOCK" : "API"}...`);

    try {
      if (useMock) {
        return await loadMockData(state);
      } else {
        return await loadFromAPI(state);
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);

      // Fallback to mock data if API fails
      if (!useMock) {
        console.warn("⚠️ API failed, falling back to mock data");
        return await loadMockData(state);
      }

      throw error;
    }
  }

  /**
   * Load from API (NEW)
   */
  async function loadFromAPI(state) {
    try {
      // Extract date parameters from state
      const year = state.startDate?.getFullYear() || new Date().getFullYear();
      const month =
        state.timeKey === "mtd" || state.timeKey === "today"
          ? new Date().getMonth() + 1
          : null;

      // Extract location filter
      const locationIds = state.location === "all" ? [] : [state.location];

      console.log("📡 Fetching from API:", { year, month, locationIds });

      // Fetch all required data in parallel
      const [statistics, growthChart, serviceRevenue] = await Promise.all([
        w.DashboardService.getStatistics(year, month, locationIds),
        w.DashboardService.getGrowthChart(year, month, locationIds, "sale"),
        w.DashboardService.getServiceRevenue(year, month, locationIds),
      ]);

      console.log("✅ API data received:", {
        statistics,
        growthChart,
        serviceRevenue,
      });

      // Transform API responses to match mock data structure
      const transformedData =
        w.DashboardAdapter.transformStatistics(statistics);
      const transformedGrowth =
        w.DashboardAdapter.transformGrowthChart(growthChart);
      const transformedService =
        w.DashboardAdapter.transformServiceRevenue(serviceRevenue);

      // Update internal data store
      _data.rawStatistics = statistics;
      _data.bookings = transformedData.bookings;
      _data.checkins = transformedData.checkins;
      _data.revenues = transformedService;
      _data.members = transformedData.members;
      _data.lastLoaded = new Date();
      _data.source = "api";

      console.log("✅ Data normalized:", _data);

      return {
        bookings: _data.bookings,
        checkins: _data.checkins,
        revenues: _data.revenues,
        members: _data.members,
        statistics: transformedData,
        source: "api",
      };
    } catch (error) {
      console.error("❌ Error loading from API:", error);
      throw error;
    }
  }

  /**
   * Load mock data (EXISTING - keep as is)
   */
  async function loadMockData(state) {
    // ... existing mock data logic ...
    return {
      bookings: [],
      checkins: [],
      revenues: [],
      members: [],
      source: "mock",
    };
  }

  /**
   * Get cached data
   */
  function getCachedData() {
    return { ..._data };
  }

  /**
   * Clear cache
   */
  function clearCache() {
    _data.lastLoaded = null;
    console.log("🗑️ Data cache cleared");
  }

  // Public API
  w.DataSource = {
    loadAndNormalizeData,
    getCachedData,
    clearCache,
    getDateRange, // ... existing methods
  };
})(window);
```

---

#### **Day 5-6: Update Compute & KPI Logic**

**File cần sửa:**

```
actiwell-dashboard-mockui/assets/js/shared/
└── compute-kpi.js        ← UPDATE: Handle API data structure
```

**Tasks:**

- [ ] Update KPI calculations to work with API data
- [ ] Add null/undefined checks
- [ ] Test all KPI formulas with real API data
- [ ] Verify calculations match backend

---

### **PHASE 3: Page Integration (3 ngày)**

#### **Day 7-8: Update Key Pages**

**Ưu tiên top 5 pages:**

1. `index.html` - Main dashboard
2. `pages/03-03-01-04-daily-revenue-today-detail.html`
3. `pages/03-05-01-03-booking-yesterday-detail.html`
4. `pages/03-01-01-01-checkin-today-detail.html`
5. `pages/04-02-01-member-movement.html`

**Tasks per page:**

- [ ] Add script includes (auth, api, services, adapters)
- [ ] Update initialization to use API data
- [ ] Update chart rendering with API data
- [ ] Remove hardcoded mock values
- [ ] Add loading states & error handling
- [ ] Test data consistency

**Code Example - Update index.html:**

```html
<!-- In <head> section, ADD BEFORE existing scripts -->

<!-- Configuration -->
<script src="assets/js/shared/config.js"></script>

<!-- Authentication -->
<script src="assets/js/shared/auth-manager.js"></script>

<!-- API Layer -->
<script src="assets/js/shared/api-client.js"></script>
<script src="assets/js/services/dashboard-service.js"></script>

<!-- Data Adapters -->
<script src="assets/js/adapters/dashboard-adapter.js"></script>

<!-- THEN existing shared data layer scripts -->
<script src="data/sample-data.js"></script>
<script src="assets/js/shared/data-source.js"></script>
<!-- ... rest of existing scripts ... -->
```

---

#### **Day 9: Testing & Bug Fixes**

**Tasks:**

- [ ] Test all 5 key pages with real API
- [ ] Verify data consistency
- [ ] Test filters & state synchronization
- [ ] Fix any API mapping issues
- [ ] Test error scenarios (401, 500, network errors)
- [ ] Verify loading states

---

### **PHASE 4: Deployment & Documentation (1 ngày)**

#### **Day 10: Final Testing & Docs**

**Tasks:**

- [ ] Full regression testing
- [ ] Performance testing
- [ ] Update README with API setup instructions
- [ ] Document API endpoints mapping
- [ ] Create troubleshooting guide
- [ ] Handover to QA

---

## 📋 **SUCCESS METRICS**

### **Functional:**

- [ ] All 5 key pages load data from API
- [ ] JWT authentication working
- [ ] Filters update API calls correctly
- [ ] Data matches backend calculations
- [ ] Charts render correctly
- [ ] No console errors

### **Performance:**

- [ ] P95 page load < 500ms
- [ ] API response time < 200ms
- [ ] Smooth transitions between pages
- [ ] No memory leaks

### **Quality:**

- [ ] Data consistency checks pass
- [ ] Error handling works
- [ ] Loading states visible
- [ ] Responsive on mobile

---

## 🚀 **NEXT STEPS AFTER DAY 10**

### **Phase 5: Expand to All Pages (Week 3-4)**

- Migrate remaining 97 pages
- Batch update with automation script
- Progressive testing

### **Phase 6: React Migration Planning (Week 5+)**

- Create React component prototypes
- Plan gradual migration
- Set up hybrid rendering

---

## 📊 **RISK MANAGEMENT**

### **High Risks:**

1. **API không match với mock structure**
   - _Mitigation:_ Create comprehensive adapters early
2. **Performance issues with 100+ pages**
   - _Mitigation:_ Implement caching & lazy loading
3. **Authentication flow breaks**
   - _Mitigation:_ Test auth thoroughly in Day 1

### **Medium Risks:**

1. **Data calculation mismatches**
   - _Mitigation:_ Use reconcile.js for validation
2. **Browser compatibility**
   - _Mitigation:_ Test on Chrome, Firefox, Safari

---

## 🛠️ **TOOLS & ENVIRONMENT**

### **Development:**

- Node.js (for testing scripts)
- Web server (http-server or nginx)
- Chrome DevTools
- Postman (API testing)

### **Backend API:**

- `mfit-be` running on `localhost:8000`
- Database seeded with test data
- JWT token generation working

### **Testing:**

- Manual testing on key pages
- Automated consistency checks
- Performance profiling

---

**Status**: 📋 Ready to start
**Next Action**: Review and approve this roadmap, then begin Day 1 tasks

---

**Questions for Product Owner:**

1. Can we deploy to staging after 10 days with 5 pages working?
2. Is React migration required immediately or can it wait?
3. Do we have API access and test credentials?
4. Who will QA the implementation?

