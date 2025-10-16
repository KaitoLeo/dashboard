# 🚀 QUICK START - Backend Integration

**Mục đích:** Hướng dẫn nhanh để connect Actiwell Dashboard với backend thật

---

## 📋 TÓM TẮT 5 PHÚT

### **Hiện tại:**

- ✅ 22 pages đã có dynamic calculations
- ✅ Đang dùng mock data (test)
- ✅ API layer sẵn sàng

### **Để chuyển sang backend:**

1. Implement backend API endpoints (xem `BACKEND-API-SPECIFICATION.md`)
2. Update `config.js` với backend URL
3. Set `useMockData = false`
4. Done! ✅

---

## 🎯 BƯỚC 1: UPDATE CONFIG (2 phút)

Mở file `config.js` và sửa:

```javascript
// FROM (hiện tại - mock mode):
window.API_BASE_URL = "http://localhost:8000/api";
window.FEATURES.useMockData = true;
window.FEATURES.useWebSocket = false;

// TO (production mode):
window.API_BASE_URL = "https://api.actiwell.com/api"; // ← URL backend của bạn
window.FEATURES.useMockData = false; // ← Tắt mock data
window.FEATURES.useWebSocket = true; // ← Bật WebSocket nếu có
```

**Chỉ cần 3 dòng! Hệ thống tự động chuyển sang backend.** ✅

---

## 🔧 BƯỚC 2: BACKEND IMPLEMENTATION (1-2 ngày)

### **Must-Have Endpoints (Ưu tiên cao):**

```bash
# Revenue (quan trọng nhất)
GET /api/revenue/mtd                     # MTD revenue data
GET /api/revenue/by-service              # Revenue by service
GET /api/revenue/by-location             # Revenue by location

# Booking (quan trọng thứ 2)
GET /api/bookings/today                  # Today bookings
GET /api/bookings/yesterday              # Yesterday bookings
GET /api/bookings/mtd                    # MTD bookings

# Checkin
GET /api/checkins/today                  # Today check-ins

# Visitor
GET /api/visitors/today                  # Today visitors
GET /api/visitors/conversion             # Conversion metrics
```

**Chỉ cần 9 endpoints cơ bản để hệ thống chạy!**

### **Data Format (Backend trả về):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "transaction_date": "2025-10-16",
      "transaction_time": "08:30",
      "service_name": "PT Fitness",
      "branch_name": "Tôn Thất Thuyết",
      "amount": 8000000,
      "status": "completed"
    }
  ]
}
```

**Quan trọng:**

- Service names: "Membership", "PT Fitness", "Pilates", "Swimming Coach"
- Branch names: "Tôn Thất Thuyết", "Huỳnh Thúc Kháng", "Giảng Võ", "Hào Nam", "Nguyễn Tuân"

---

## 🧪 BƯỚC 3: TEST (10 phút)

### **Test 1: Verify Config**

```javascript
// Mở browser console (F12) trên bất kỳ page nào
console.log(window.API_BASE_URL); // Should show your backend URL
console.log(window.FEATURES.useMockData); // Should be false
```

### **Test 2: Test API Call**

```javascript
// Test get MTD revenue
window.revenueAPI
  .getMTD()
  .then((data) => console.log("✅ Backend connected:", data))
  .catch((err) => console.error("❌ Backend error:", err));
```

### **Test 3: Open Revenue MTD Page**

```
File: pages/03-03-01-04-revenue-mtd-detail.html
```

**Nên thấy trong console:**

```
🚀 Initializing Revenue MTD Detail...
🌐 GET /revenue/mtd
✅ GET /revenue/mtd - Success
✅ Revenue MTD metrics updated successfully!
   💰 MTD Revenue: 1,850,000,000 VNĐ
   📈 Growth Rate: +12.5%
```

**Nếu backend chưa ready:**

```
🌐 GET /revenue/mtd
❌ GET /revenue/mtd - Error: ...
⚠️ Falling back to mock data for /revenue/mtd
💰 Using mock data...
```

---

## 🔄 BƯỚC 4: ENABLE REAL-TIME (Optional)

### **If you have WebSocket server:**

In `config.js`:

```javascript
window.WS_URL = "wss://api.actiwell.com/ws";
window.FEATURES.useWebSocket = true;
```

### **If no WebSocket, use polling:**

```javascript
window.FEATURES.useWebSocket = false;
window.FEATURES.usePolling = true;
window.FEATURES.pollingInterval = 30000; // 30 seconds
```

Pages sẽ tự động refresh data mỗi 30 giây!

---

## 🎁 BONUS: INSTANT TEST MODE

Để test nhanh không cần backend:

### **In browser console:**

```javascript
// Test với mock data ngay lập tức
window.apiClient.setUseMockData(true);

// Refresh page
location.reload();

// → Tất cả pages chạy với mock data!
```

### **Switch back to backend:**

```javascript
window.apiClient.setUseMockData(false);
location.reload();
```

---

## 📊 EXPECTED RESULTS

### **When using Mock Data:**

- ✅ Pages load instantly
- ✅ All metrics calculated
- ✅ Charts show data
- ✅ No network calls
- ✅ Console shows "Using mock data"

### **When using Real Backend:**

- ✅ Pages load with backend data
- ✅ Metrics calculated from real data
- ✅ Charts update from backend
- ✅ Network calls visible in DevTools
- ✅ Console shows "GET /api/..."

### **When Backend Unavailable:**

- ✅ Auto-fallback to mock data
- ✅ Warning in console
- ✅ Page still works
- ✅ No user disruption

---

## 🚨 TROUBLESHOOTING

### **Issue: "Modules not loaded"**

**Solution:** Check script order in HTML head:

```html
<script src="../config.js"></script>
<!-- First! -->
<script src="../assets/js/revenue/revenue-calculations.js"></script>
<script src="../assets/js/revenue/revenue-mock-data.js"></script>
```

### **Issue: "CORS error"**

**Solution:** Backend phải enable CORS:

```javascript
// Backend (Node.js/Express example)
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);
```

### **Issue: "API timeout"**

**Solution:** Increase timeout in config:

```javascript
window.apiClient.timeout = 30000; // 30 seconds
```

### **Issue: "Wrong data format"**

**Solution:** DataAdapter sẽ tự động transform. Nếu vẫn lỗi, check:

```javascript
// Backend response structure
{
  "success": true,
  "data": [...]  // ← MUST be array!
}
```

---

## ✅ CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Config đã update backend URL
- [ ] `useMockData = false` đã set
- [ ] Backend API đã implement
- [ ] CORS đã enable
- [ ] Test ít nhất 3 pages trong browser
- [ ] Console không có error màu đỏ
- [ ] Metrics hiển thị đúng
- [ ] Charts render correct
- [ ] Authentication works (if applicable)

---

## 🎯 NEXT STEPS

### **Ngay bây giờ:**

1. ✅ Read `BACKEND-API-SPECIFICATION.md`
2. ✅ Implement backend endpoints
3. ✅ Update `config.js`
4. ✅ Test!

### **Sau đó:**

5. ✅ Setup WebSocket (optional)
6. ✅ Add authentication
7. ✅ Performance tuning
8. ✅ Production deploy

---

## 💡 TIP: HYBRID MODE

Trong lúc develop backend, dùng hybrid mode:

```javascript
// In api-client.js or per-endpoint
async getMTD() {
  try {
    return await this.client.get('/revenue/mtd');  // Try backend
  } catch (error) {
    return { data: window.currentMonthRevenue };   // Fallback to mock
  }
}
```

Vậy bạn có thể develop backend từng endpoint mà frontend vẫn hoạt động!

---

**TÓM LẠI: Chỉ cần 3 dòng code trong `config.js` để chuyển sang backend! 🚀**
