# 🚀 **INTEGRATION PLAN - Tích hợp Mock Dashboard vào Actiwell CMS**

## 📊 **TÌNH TRẠNG HIỆN TẠI**

### ❌ **KHÔNG TƯƠNG THÍCH:**

- **Data Source**: Mock static data ≠ REST API
- **Authentication**: None ≠ JWT Bearer Token
- **Tech Stack**: Vanilla JS ≠ React + Vite
- **Data Structure**: Flat arrays ≠ API response format

### ✅ **TƯƠNG THÍCH:**

- UI/UX Libraries (Bootstrap, Chart.js, Font Awesome)
- KPI Categories (Check-in, Booking, Revenue, Member)
- Shared Data Layer Architecture (có thể chuyển đổi)

---

## 🎯 **3 PHƯƠNG ÁN TÍCH HỢP**

### **OPTION 1: Migrate to React Components (KHUYẾN NGHỊ)**

**Effort**: High | **Impact**: High | **Maintainability**: Best

#### **1.1. Architecture:**

```
actiwell-frontend-cms-app/src/
├── pages/
│   └── Dashboard/
│       ├── RevenueMetrics/         ← From 03-revenue
│       │   ├── RevenueMTD.jsx
│       │   ├── RevenueToday.jsx
│       │   └── RevenueYesterday.jsx
│       ├── CheckinMetrics/         ← From 01-checkin
│       │   ├── CheckinMTD.jsx
│       │   ├── CheckinToday.jsx
│       │   └── CheckinOverview.jsx
│       ├── BookingMetrics/         ← From 05-booking
│       │   ├── BookingMTD.jsx
│       │   └── BookingToday.jsx
│       └── MemberMetrics/          ← From 04-crm
│           ├── MemberMovement.jsx
│           └── BirthdayMembers.jsx
├── services/
│   └── dashboardService.js        ← API calls to mfit-be
├── store/
│   └── dashboard/
│       ├── dashboardSlice.js      ← Redux state for dashboard
│       └── dashboardThunks.js     ← Async actions
└── shared/
    ├── state.js                   ← From mock (adapted)
    ├── compute-kpi.js             ← From mock (adapted to API)
    └── reconcile.js               ← From mock (data validation)
```

#### **1.2. Implementation Steps:**

**Phase 1: API Service Layer (2-3 days)**

```javascript
// services/dashboardService.js
import { get } from "../helpers/api_helper";

export const getDashboardStatistics = (year, month, locationIds) => {
  return get("/api/v1/cms/dashboard/statistics", {
    params: { year, month, location_ids: locationIds },
  });
};

export const getGrowthChart = (year, month, locationIds, module) => {
  return get("/api/v1/cms/dashboard/growth-chart", {
    params: { year, month, location_ids: locationIds, module },
  });
};

export const getSalesRevenue = (year, month, locationIds, staffIds) => {
  return get("/api/v1/cms/dashboard/staffs/sales-revenue", {
    params: { year, month, location_ids: locationIds, staff_ids: staffIds },
  });
};

// ... 20+ more endpoints from DashboardController
```

**Phase 2: Redux State Management (2 days)**

```javascript
// store/dashboard/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeKey: "today",
  startDate: null,
  endDate: null,
  location: "all",
  service: "all",
  statistics: null,
  growthChart: null,
  salesRevenue: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setTimeKey: (state, action) => {
      state.timeKey = action.payload;
    },
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
  },
});
```

**Phase 3: React Components (5-7 days)**

```jsx
// pages/Dashboard/RevenueMetrics/RevenueMTD.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, CardHeader } from "reactstrap";
import { Chart } from "react-chartjs-2";
import { getDashboardStatistics } from "../../../services/dashboardService";

const RevenueMTD = () => {
  const dispatch = useDispatch();
  const { statistics, timeKey, location } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    fetchData();
  }, [timeKey, location]);

  const fetchData = async () => {
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const data = await getDashboardStatistics(year, month, [location]);
      dispatch(setStatistics(data));
    } catch (error) {
      console.error("Error fetching revenue MTD:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h5>Doanh thu MTD</h5>
      </CardHeader>
      <CardBody>
        <div className="revenue-chart">
          {/* Chart.js integration */}
          <Chart type="line" data={chartData} options={chartOptions} />
        </div>
      </CardBody>
    </Card>
  );
};

export default RevenueMTD;
```

**Phase 4: Integration & Testing (3-4 days)**

- Integrate components into existing CMS routes
- Test all API endpoints
- Add error handling & loading states
- Verify data consistency with backend

#### **1.3. Benefits:**

✅ Full integration with existing CMS
✅ Same tech stack (React)
✅ Reuse existing auth & API infrastructure
✅ Better maintainability
✅ State management with Redux
✅ Type safety with PropTypes/TypeScript

#### **1.4. Drawbacks:**

❌ High initial effort (15-20 days)
❌ Need to rewrite all 102 pages
❌ Learning curve for React patterns

---

### **OPTION 2: API Adapter Layer (TRUNG BÌNH)**

**Effort**: Medium | **Impact**: Medium | **Maintainability**: Good

#### **2.1. Architecture:**

```
actiwell-dashboard-mockui/
├── assets/js/
│   ├── shared/
│   │   ├── state.js                  ← Keep existing
│   │   ├── compute-kpi.js            ← Keep existing
│   │   ├── api-adapter.js            ← NEW: Bridge to mfit-be
│   │   └── auth-manager.js           ← NEW: JWT token management
│   └── adapters/
│       ├── dashboard-adapter.js      ← NEW: Transform API responses
│       ├── booking-adapter.js        ← NEW: Transform booking data
│       └── revenue-adapter.js        ← NEW: Transform revenue data
```

#### **2.2. Implementation:**

**Step 1: API Adapter (2-3 days)**

```javascript
// assets/js/shared/api-adapter.js
(function (w) {
  const BASE_URL = "https://api.actiwell.com"; // Production API

  class APIAdapter {
    constructor() {
      this.token = localStorage.getItem("jwt_token");
    }

    async fetchWithAuth(endpoint, options = {}) {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    }

    async getDashboardStatistics(year, month, locationIds = []) {
      const params = new URLSearchParams({
        year,
        ...(month && { month }),
        ...(locationIds.length && { "location_ids[]": locationIds }),
      });

      return this.fetchWithAuth(`/api/v1/cms/dashboard/statistics?${params}`);
    }

    async getGrowthChart(year, month, locationIds, module) {
      const params = new URLSearchParams({
        year,
        module,
        ...(month && { month }),
        "location_ids[]": locationIds,
      });

      return this.fetchWithAuth(`/api/v1/cms/dashboard/growth-chart?${params}`);
    }

    // ... more API methods
  }

  w.APIAdapter = new APIAdapter();
})(window);
```

**Step 2: Data Transformer (2 days)**

```javascript
// assets/js/adapters/dashboard-adapter.js
(function (w) {
  class DashboardAdapter {
    // Transform API response to match mock data structure
    transformStatistics(apiResponse) {
      if (!apiResponse.success) {
        throw new Error("API returned error");
      }

      const data = apiResponse.data;

      // Transform to match SampleData format
      return {
        revenue: {
          current: data.revenue.current,
          previous: data.revenue.previous,
          change: this.calculateChange(
            data.revenue.current,
            data.revenue.previous
          ),
        },
        members: {
          total: data.member.current.total,
          active: data.member.current.active,
          inactive: data.member.current.inactive,
          inClass: data.member.in_class,
        },
        packages: {
          current: data.package.current,
          previous: data.package.previous,
        },
      };
    }

    calculateChange(current, previous) {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    }
  }

  w.DashboardAdapter = new DashboardAdapter();
})(window);
```

**Step 3: Update Data Source (1 day)**

```javascript
// assets/js/shared/data-source.js - UPDATED
(function (w) {
  const USE_MOCK_DATA = false; // Toggle between mock and API

  async function loadAndNormalizeData(state) {
    if (USE_MOCK_DATA) {
      // Existing mock data logic
      return loadMockData(state);
    } else {
      // NEW: Load from API
      return await loadFromAPI(state);
    }
  }

  async function loadFromAPI(state) {
    try {
      const year = state.startDate?.getFullYear() || new Date().getFullYear();
      const month = state.startDate?.getMonth() + 1;
      const locationIds = state.location === "all" ? [] : [state.location];

      // Fetch from API
      const [statistics, growthChart, salesRevenue] = await Promise.all([
        w.APIAdapter.getDashboardStatistics(year, month, locationIds),
        w.APIAdapter.getGrowthChart(year, month, locationIds, "sale"),
        w.APIAdapter.getSalesRevenue(year, month, locationIds, []),
      ]);

      // Transform to match existing structure
      return {
        bookings: w.DashboardAdapter.transformBookings(statistics.data),
        checkins: w.DashboardAdapter.transformCheckins(statistics.data),
        revenues: w.DashboardAdapter.transformRevenues(salesRevenue.data),
        members: w.DashboardAdapter.transformMembers(statistics.data.member),
      };
    } catch (error) {
      console.error("Error loading from API:", error);
      // Fallback to mock data
      return loadMockData(state);
    }
  }

  w.DataSource = {
    loadAndNormalizeData,
    getDateRange,
  };
})(window);
```

**Step 4: Add Authentication (1 day)**

```javascript
// assets/js/shared/auth-manager.js
(function (w) {
  class AuthManager {
    constructor() {
      this.token = this.loadToken();
    }

    loadToken() {
      // Check URL params for token (SSO)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        this.saveToken(urlToken);
        return urlToken;
      }

      // Check localStorage
      return localStorage.getItem("jwt_token");
    }

    saveToken(token) {
      localStorage.setItem("jwt_token", token);
      this.token = token;
    }

    isAuthenticated() {
      return !!this.token;
    }

    redirectToLogin() {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.href);
    }
  }

  w.AuthManager = new AuthManager();

  // Auto-redirect if not authenticated
  if (!w.AuthManager.isAuthenticated()) {
    w.AuthManager.redirectToLogin();
  }
})(window);
```

#### **2.3. Benefits:**

✅ Keep existing UI/UX intact (102 pages)
✅ Gradual migration (can toggle mock/API)
✅ Less refactoring effort
✅ Reuse existing shared data layer logic

#### **2.4. Drawbacks:**

❌ Two separate systems to maintain
❌ No integration with CMS auth flow
❌ Duplicate UI components (mock vs React)
❌ Need to serve via web server (not file://)

---

### **OPTION 3: Embedded iframe (NHANH NHẤT)**

**Effort**: Low | **Impact**: Low | **Maintainability**: Poor

#### **3.1. Quick Integration:**

```jsx
// In actiwell-frontend-cms-app
import React from "react";

const DashboardEmbed = () => {
  const token = localStorage.getItem("jwt_token");

  return (
    <div className="dashboard-embed">
      <iframe
        src={`http://localhost:8080/dashboard?token=${token}`}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </div>
  );
};
```

#### **3.2. Benefits:**

✅ Very fast implementation (1 day)
✅ Zero refactoring
✅ Can pass token via URL

#### **3.3. Drawbacks:**

❌ Poor UX (iframe limitations)
❌ No state sharing with parent
❌ SEO issues
❌ Mobile responsiveness problems
❌ Not recommended for production

---

## 📋 **KHUYẾN NGHỊ**

### **🥇 OPTION 1: Migrate to React (BEST)**

**Timeline**: 15-20 days
**Cost**: High upfront, Low ongoing
**Best for**: Long-term production use

### **🥈 OPTION 2: API Adapter (GOOD)**

**Timeline**: 7-10 days
**Cost**: Medium upfront, Medium ongoing
**Best for**: Quick deployment + gradual migration

### **🥉 OPTION 3: iframe (NOT RECOMMENDED)**

**Timeline**: 1 day
**Cost**: Low upfront, High ongoing issues
**Best for**: Prototype/demo only

---

## 🚀 **NEXT STEPS**

1. ✅ **Review this plan** with technical team
2. ✅ **Choose integration option** based on:
   - Timeline requirements
   - Team React expertise
   - Budget constraints
   - Long-term maintainability goals
3. ✅ **Set up development environment**:
   - Backend API running locally
   - Frontend CMS running locally
   - Test JWT authentication flow
4. ✅ **Start with pilot** (1-2 pages):
   - Revenue MTD Detail
   - Check-in Overview
5. ✅ **Iterate and expand** to other pages

---

## 📊 **SUCCESS CRITERIA**

- [ ] All 102 dashboard pages accessible via CMS
- [ ] Real-time data from `mfit-be` API
- [ ] JWT authentication working
- [ ] Filters synchronized across pages
- [ ] Charts rendering correctly
- [ ] Mobile responsive
- [ ] Performance: P95 < 500ms page load
- [ ] Zero console errors
- [ ] Data consistency checks passing

---

## 👥 **TEAM REQUIREMENTS**

### **Option 1 (React Migration):**

- 2 React developers (senior)
- 1 Backend developer (API support)
- 1 QA engineer

### **Option 2 (API Adapter):**

- 1 Full-stack developer (JS + PHP)
- 1 QA engineer

### **Option 3 (iframe):**

- 1 Junior developer
- (Not recommended for production)

---

**Last Updated**: 2025-10-15
**Status**: Draft - Awaiting Decision

