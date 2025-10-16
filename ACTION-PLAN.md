# ⚡ **ACTION PLAN - Bắt đầu ngay hôm nay**

**Mục tiêu**: Tích hợp mock dashboard vào hệ thống Actiwell thực (React + Laravel)

**Timeline**: 10 ngày

**Status**: 🎯 Ready to Start

---

## 🎯 **TÓM TẮT CHIẾN LƯỢC**

### **Phương án đã chọn: API ADAPTER LAYER**

✅ **Tại sao chọn?**

- Giữ nguyên 102 pages HTML đã thiết kế
- Thời gian phát triển hợp lý (10 ngày)
- Có thể toggle giữa mock và real data
- Dễ dàng migrate sang React sau này

❌ **Không chọn:**

- ~~React Migration~~ (quá lâu, 15-20 ngày)
- ~~iframe~~ (UX kém, không maintainable)

---

## 📅 **10 NGÀY - 4 PHASES**

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ PHASE 1     │ PHASE 2     │ PHASE 3     │ PHASE 4     │
│ API Layer   │ Data Layer  │ Pages       │ Deploy      │
│ Day 1-3     │ Day 4-6     │ Day 7-9     │ Day 10      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 🚀 **HÀNH ĐỘNG CỤ THỂ**

### **CHUẨN BỊ (Trước khi bắt đầu)**

#### ✅ **Backend Setup:**

```bash
# 1. Start mfit-be API
cd mfit-be
php artisan serve --port=8000

# 2. Verify API is running
curl http://localhost:8000/api/v1/cms/dashboard/statistics

# 3. Get JWT token for testing
# Login via CMS or use Postman
```

#### ✅ **Frontend Setup:**

```bash
# 1. Install dependencies (if needed)
cd actiwell-dashboard-mockui
npm install

# 2. Start web server (không thể dùng file://)
npx http-server -p 3000

# 3. Open browser
http://localhost:3000
```

---

### **DAY 1: Authentication & API Client**

#### **Files to create:**

```
actiwell-dashboard-mockui/assets/js/shared/
├── config.js              ← NEW (API config)
├── auth-manager.js        ← NEW (JWT management)
└── api-client.js          ← NEW (Fetch wrapper)
```

#### **Checklist:**

- [ ] Tạo `config.js` với API_BASE_URL
- [ ] Implement `auth-manager.js`
  - [ ] Load JWT from localStorage
  - [ ] Load JWT from URL (?token=xxx)
  - [ ] Token refresh logic
  - [ ] Redirect to login if unauthenticated
- [ ] Implement `api-client.js`
  - [ ] GET/POST/PUT/DELETE methods
  - [ ] Auto add Authorization header
  - [ ] Handle 401 (token expired)
  - [ ] Error handling
- [ ] Test với Postman/curl

#### **Test:**

```javascript
// Test in browser console
await APIClient.get("/api/v1/cms/dashboard/statistics", {
  year: 2025,
  month: 10,
});
```

---

### **DAY 2: Dashboard API Service**

#### **Files to create:**

```
actiwell-dashboard-mockui/assets/js/services/
├── dashboard-service.js   ← NEW (All 15 endpoints)
├── booking-service.js     ← NEW (Booking APIs)
└── revenue-service.js     ← NEW (Revenue APIs)
```

#### **Checklist:**

- [ ] Map 15 endpoints từ `DashboardController.php`
- [ ] Implement `DashboardService`:
  - [ ] getStatistics()
  - [ ] getGrowthChart()
  - [ ] getSalesRevenue()
  - [ ] getStaffBookings()
  - [ ] getPrediction()
  - [ ] getYearTotalRevenue()
  - [ ] getServiceRevenue()
  - [ ] ... (8 more)
- [ ] Add caching (5 minutes TTL)
- [ ] Test từng endpoint

#### **Test:**

```javascript
// Test in console
const stats = await DashboardService.getStatistics(2025, 10, []);
console.log(stats);
```

---

### **DAY 3: Data Adapters**

#### **Files to create:**

```
actiwell-dashboard-mockui/assets/js/adapters/
├── dashboard-adapter.js   ← NEW (Transform API → Mock format)
├── booking-adapter.js     ← NEW
├── revenue-adapter.js     ← NEW
└── member-adapter.js      ← NEW
```

#### **Checklist:**

- [ ] Implement `DashboardAdapter.transformStatistics()`
- [ ] Map API fields → SampleData structure
- [ ] Handle null/undefined values
- [ ] Add calculation helpers
- [ ] Implement service ordering
- [ ] Test transformations

#### **Test:**

```javascript
// Test transformation
const apiResponse = await DashboardService.getStatistics(2025, 10, []);
const transformed = DashboardAdapter.transformStatistics(apiResponse);
console.log(transformed);
```

---

### **DAY 4: Update Data Source**

#### **Files to modify:**

```
actiwell-dashboard-mockui/assets/js/shared/
├── data-source.js         ← UPDATE (Add API loading)
├── state.js               ← UPDATE (Add loading states)
└── init-shared.js         ← UPDATE (Init API services)
```

#### **Checklist:**

- [ ] Update `data-source.js`:
  - [ ] Add `loadFromAPI()` function
  - [ ] Toggle between mock/API via config
  - [ ] Fallback to mock if API fails
  - [ ] Add error handling
- [ ] Update `state.js`:
  - [ ] Add `loading` property
  - [ ] Add `error` property
  - [ ] Add `dataSource` property
- [ ] Update `init-shared.js`:
  - [ ] Load auth, api, services before data
- [ ] Test data loading

#### **Test:**

```javascript
// Set to use API
AppConfig.USE_MOCK_DATA = false;

// Load data
const data = await DataSource.loadAndNormalizeData(SharedState.getState());
console.log(data);
```

---

### **DAY 5-6: Update KPI Calculations**

#### **Files to modify:**

```
actiwell-dashboard-mockui/assets/js/shared/
└── compute-kpi.js         ← UPDATE (Handle API data)
```

#### **Checklist:**

- [ ] Update all KPI functions to handle API structure
- [ ] Add null checks
- [ ] Test với API data thực
- [ ] Verify calculations với backend
- [ ] Run consistency checks

#### **Test:**

```javascript
// Test KPI calculations
const state = SharedState.getState();
const computed = Compute.computeAll(state);
console.log(computed);

// Run consistency check
Reconcile.assertConsistency(computed);
```

---

### **DAY 7-8: Integrate Key Pages**

#### **Top 5 pages to update:**

1. ✅ `index.html` - Main dashboard
2. ✅ `pages/03-03-01-04-daily-revenue-today-detail.html`
3. ✅ `pages/03-05-01-03-booking-yesterday-detail.html`
4. ✅ `pages/03-01-01-01-checkin-today-detail.html`
5. ✅ `pages/04-02-01-member-movement.html`

#### **Checklist per page:**

- [ ] Add script includes:
  ```html
  <script src="../assets/js/shared/config.js"></script>
  <script src="../assets/js/shared/auth-manager.js"></script>
  <script src="../assets/js/shared/api-client.js"></script>
  <script src="../assets/js/services/dashboard-service.js"></script>
  <script src="../assets/js/adapters/dashboard-adapter.js"></script>
  ```
- [ ] Update initialization to use API
- [ ] Remove hardcoded data
- [ ] Add loading spinner
- [ ] Add error message display
- [ ] Test thoroughly

#### **Test:**

```bash
# Open each page and verify:
1. Data loads from API
2. Charts render correctly
3. Filters work
4. No console errors
5. Loading states visible
```

---

### **DAY 9: Testing & Bug Fixes**

#### **Checklist:**

- [ ] **Functional Testing:**
  - [ ] All 5 pages load API data
  - [ ] Authentication works
  - [ ] Token refresh works
  - [ ] Filters update correctly
  - [ ] Charts render
  - [ ] Navigation works
- [ ] **Error Scenarios:**
  - [ ] 401 Unauthorized → refresh token
  - [ ] 500 Server Error → show error
  - [ ] Network offline → fallback to mock
  - [ ] Invalid data → show placeholder
- [ ] **Performance:**

  - [ ] Page load < 500ms
  - [ ] API calls < 200ms
  - [ ] No memory leaks
  - [ ] Smooth transitions

- [ ] **Data Consistency:**
  ```bash
  # Run consistency checks
  node verify-all-booking-values.js
  node check-duplicate-fix.js
  node analyze-mock-data.js
  ```

---

### **DAY 10: Documentation & Handover**

#### **Checklist:**

- [ ] Update README.md
- [ ] Document API setup
- [ ] Create troubleshooting guide
- [ ] Record demo video
- [ ] Handover to QA
- [ ] Deploy to staging

#### **Documentation to create:**

```
actiwell-dashboard-mockui/
├── API-SETUP.md           ← How to connect to API
├── TROUBLESHOOTING.md     ← Common issues
└── TESTING-GUIDE.md       ← How to test
```

---

## 📊 **DEFINITION OF DONE**

### **After Day 10, we should have:**

✅ **Functional:**

- [ ] 5 key pages load real data from `mfit-be` API
- [ ] JWT authentication working
- [ ] Filters trigger correct API calls
- [ ] Data matches backend calculations
- [ ] Charts render with API data
- [ ] Error handling works

✅ **Quality:**

- [ ] No console errors
- [ ] Data consistency checks pass
- [ ] Loading states visible
- [ ] Responsive on mobile
- [ ] Performance meets targets

✅ **Documentation:**

- [ ] API setup guide
- [ ] Troubleshooting guide
- [ ] Testing guide
- [ ] Code commented

---

## 🎯 **CRITICAL SUCCESS FACTORS**

### **1. Backend API must be ready:**

```bash
# Verify these endpoints work:
GET /api/v1/cms/dashboard/statistics
GET /api/v1/cms/dashboard/growth-chart
GET /api/v1/cms/dashboard/service-revenue
```

### **2. JWT Token must be available:**

```javascript
// Either via:
1. Login flow → localStorage
2. URL parameter → ?token=xxx
3. Test token for development
```

### **3. CORS must be configured:**

```php
// In mfit-be config/cors.php
'allowed_origins' => ['http://localhost:3000'],
```

---

## 🚨 **BLOCKERS & RISKS**

### **High Priority:**

1. ⚠️ **API structure không match với mock**
   - **Solution:** Day 3 - Tạo comprehensive adapters
2. ⚠️ **Authentication breaks**

   - **Solution:** Day 1 - Test thoroughly

3. ⚠️ **Performance issues**
   - **Solution:** Day 2 - Implement caching

### **Medium Priority:**

1. ⚠️ **Data calculations khác nhau**
   - **Solution:** Day 5-6 - Verify với backend
2. ⚠️ **CORS issues**
   - **Solution:** Configure backend CORS

---

## 📞 **SUPPORT & ESCALATION**

### **Need help with:**

1. Backend API endpoints → Backend team
2. Authentication flow → Security team
3. Performance issues → DevOps team
4. Data calculations → Business team

---

## ✅ **START NOW - FIRST 3 STEPS**

### **Step 1: Verify Backend (5 mins)**

```bash
cd mfit-be
php artisan serve --port=8000

# Test in browser or Postman:
http://localhost:8000/api/v1/cms/dashboard/statistics?year=2025
```

### **Step 2: Start Frontend (5 mins)**

```bash
cd actiwell-dashboard-mockui
npx http-server -p 3000

# Open: http://localhost:3000
```

### **Step 3: Create First File (30 mins)**

```bash
# Create config.js
touch assets/js/shared/config.js

# Copy code from IMPLEMENTATION-ROADMAP.md
# Test in browser console
```

---

**Ready to start? Let's go! 🚀**

**Next file to create**: `assets/js/shared/config.js` (Day 1)

