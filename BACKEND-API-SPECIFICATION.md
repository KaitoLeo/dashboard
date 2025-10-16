# 📡 Backend API Specification - Actiwell Dashboard

**Version:** 1.0  
**Last Updated:** 16/10/2025  
**Status:** Ready for Implementation

---

## 🎯 OVERVIEW

This document specifies the backend API endpoints required for Actiwell Dashboard.  
Frontend is already integrated and ready - just implement these endpoints!

---

## 🔧 GENERAL SPECIFICATIONS

### **Base URL:**

```
Development: http://localhost:8000/api
Production:  https://api.actiwell.com/api
```

### **Authentication:**

```http
Authorization: Bearer <token>
```

### **Response Format:**

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 50
  },
  "timestamp": "2025-10-16T10:30:00Z"
}
```

### **Error Format:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### **Headers:**

```http
Content-Type: application/json
Accept: application/json
X-Timezone: Asia/Bangkok
```

---

## 💰 REVENUE ENDPOINTS

### **1. GET /revenue/mtd**

**Purpose:** Get Month-To-Date revenue

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "transaction_date": "2025-10-16",
      "transaction_time": "08:30",
      "service_name": "Membership",
      "branch_name": "Tôn Thất Thuyết",
      "payment_method": "Chuyển khoản",
      "staff_name": "Nguyễn Văn A",
      "amount": 12000000,
      "target": 100000000,
      "status": "completed"
    }
  ]
}
```

### **2. GET /revenue/daily/:date**

**Purpose:** Get revenue for specific date

**Parameters:**

- `date` (path): YYYY-MM-DD format

**Response:** Same as MTD

### **3. GET /revenue/by-service**

**Purpose:** Get revenue grouped by service

**Query Params:**

- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD

**Response:**

```json
{
  "success": true,
  "data": {
    "Membership": 750000000,
    "PT Fitness": 580000000,
    "Pilates": 320000000,
    "Swimming Coach": 200000000
  }
}
```

### **4. GET /revenue/by-location**

**Purpose:** Get revenue grouped by location

**Response:**

```json
{
  "success": true,
  "data": {
    "Tôn Thất Thuyết": 450000000,
    "Huỳnh Thúc Kháng": 380000000,
    "Giảng Võ": 360000000,
    "Hào Nam": 330000000,
    "Nguyễn Tuân": 330000000
  }
}
```

### **5. GET /revenue/by-payment**

**Purpose:** Get revenue grouped by payment method

**Response:**

```json
{
  "success": true,
  "data": {
    "Tiền mặt": 450000000,
    "Chuyển khoản": 890000000,
    "Thẻ tín dụng": 510000000,
    "Ví điện tử": 0
  }
}
```

### **6. GET /revenue/by-staff**

**Purpose:** Get revenue grouped by staff

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "staff_name": "Nguyễn Văn A",
      "total_revenue": 150000000,
      "transaction_count": 18,
      "average_transaction": 8333333
    }
  ]
}
```

### **7. GET /revenue/target-progress**

**Purpose:** Get target progress metrics

**Response:**

```json
{
  "success": true,
  "data": {
    "monthly_target": 3000000000,
    "mtd_revenue": 1850000000,
    "completion_rate": 62,
    "remaining": 1150000000,
    "days_remaining": 15,
    "daily_target_needed": 76666667
  }
}
```

---

## 📅 BOOKING ENDPOINTS

### **1. GET /bookings/today**

**Purpose:** Get today's bookings

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "booking_date": "2025-10-16",
      "booking_time": "08:30",
      "customer_name": "Nguyễn Văn A",
      "phone_number": "0901234567",
      "service_name": "PT Fitness",
      "branch_name": "Tôn Thất Thuyết",
      "status": "confirmed",
      "notes": "Thành công"
    }
  ]
}
```

### **2. GET /bookings/yesterday**

**Purpose:** Get yesterday's bookings

**Response:** Same as today

### **3. GET /bookings/this-week**

**Purpose:** Get this week's bookings

**Response:** Same format, multiple days

### **4. GET /bookings/mtd**

**Purpose:** Get MTD bookings

**Response:** Same format

### **5. GET /bookings/range**

**Purpose:** Get bookings for date range

**Query Params:**

- `start`: YYYY-MM-DD
- `end`: YYYY-MM-DD

**Response:** Same format

### **6. POST /bookings**

**Purpose:** Create new booking

**Request Body:**

```json
{
  "booking_date": "2025-10-17",
  "booking_time": "10:00",
  "customer_name": "Trần Thị B",
  "phone_number": "0901234568",
  "service_name": "Pilates",
  "branch_name": "Giảng Võ",
  "notes": ""
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "booking_date": "2025-10-17",
    "status": "pending",
    ...
  }
}
```

### **7. PUT /bookings/:id**

**Purpose:** Update booking

**Response:** Updated booking object

### **8. POST /bookings/:id/cancel**

**Purpose:** Cancel booking

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "cancelled"
  }
}
```

---

## ✅ CHECKIN ENDPOINTS

### **1. GET /checkins/today**

**Purpose:** Get today's check-ins

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "checkin_date": "2025-10-16",
      "checkin_time": "06:30",
      "member_name": "Nguyễn Văn A",
      "membership_id": "MEM001",
      "service_name": "PT Fitness",
      "branch_name": "Tôn Thất Thuyết",
      "class_type": "1v1"
    }
  ]
}
```

### **2. GET /checkins/yesterday**

**Response:** Same as today

### **3. GET /checkins/mtd**

**Response:** Same format

### **4. GET /checkins/service/:service**

**Purpose:** Get check-ins for specific service

**Parameters:**

- `service` (path): Service name (url-encoded)

**Response:** Same format

### **5. POST /checkins**

**Purpose:** Record check-in

**Request Body:**

```json
{
  "member_id": "MEM001",
  "service_name": "PT Fitness",
  "branch_name": "Tôn Thất Thuyết",
  "class_type": "1v1"
}
```

---

## 👥 VISITOR ENDPOINTS

### **1. GET /visitors/today**

**Purpose:** Get today's visitors

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "visit_date": "2025-10-16",
      "visit_time": "09:00",
      "visitor_name": "Lê Văn C",
      "phone_number": "0901234569",
      "department": "Membership",
      "source_channel": "Walk-in",
      "staff_name": "Nguyễn Văn A",
      "is_converted": false,
      "has_inbody": false
    }
  ]
}
```

### **2. GET /visitors/yesterday**

**Response:** Same as today

### **3. GET /visitors/mtd**

**Response:** Same format

### **4. GET /visitors/stats**

**Purpose:** Get visitor statistics

**Response:**

```json
{
  "success": true,
  "data": {
    "total_visitors": 281,
    "by_department": {
      "Membership": 150,
      "PT Fitness": 80,
      "Pilates": 30,
      "Swimming Coach": 21
    },
    "by_source": {
      "Walk-in": 120,
      "Hotline": 80,
      "Marketing Web": 50,
      "Marketing Facebook": 20,
      "Refer": 11
    }
  }
}
```

### **5. GET /visitors/conversion**

**Purpose:** Get conversion metrics

**Response:**

```json
{
  "success": true,
  "data": {
    "total_visitors": 281,
    "total_sale_tiep": 160,
    "total_pt_tiep": 91,
    "total_inbody": 68,
    "pt_tiep_rate": 56.88,
    "inbody_rate": 24.2,
    "conversion_rate": 42.35
  }
}
```

### **6. POST /visitors**

**Purpose:** Record visitor

**Request Body:**

```json
{
  "visitor_name": "Phạm Thị D",
  "phone_number": "0901234570",
  "department": "PT Fitness",
  "source_channel": "Hotline",
  "staff_name": "Trần Thị B"
}
```

---

## 🔌 WEBSOCKET SPECIFICATION

### **Connection:**

```javascript
ws://localhost:8000/ws
wss://api.actiwell.com/ws  // Production
```

### **Authentication:**

```json
// Send after connection
{
  "type": "auth",
  "token": "Bearer <token>"
}
```

### **Subscribe to Updates:**

```json
{
  "type": "subscribe",
  "channels": ["revenue", "booking", "checkin", "visitor"]
}
```

### **Receive Updates:**

```json
{
  "type": "revenue",
  "period": "mtd",
  "data": {
    "items": [...],
    "timestamp": "2025-10-16T10:30:00Z"
  }
}
```

---

## ✅ VALIDATION RULES

### **Services (MUST match exactly):**

- "Membership"
- "PT Fitness"
- "Pilates"
- "Swimming Coach"

### **Locations (MUST match exactly):**

- "Tôn Thất Thuyết"
- "Huỳnh Thúc Kháng"
- "Giảng Võ"
- "Hào Nam"
- "Nguyễn Tuân"

### **Booking Status:**

- "confirmed" → Frontend: "completed"
- "pending" → Frontend: "pending"
- "cancelled" → Frontend: "cancelled"
- "no-show" → Frontend: "no-show"

### **Payment Methods:**

- "Tiền mặt"
- "Chuyển khoản"
- "Thẻ tín dụng"
- "Ví điện tử"

### **Dates:**

- Format: ISO 8601 (YYYY-MM-DD)
- Timezone: Asia/Bangkok

### **Currency:**

- All amounts in VNĐ (integer)
- No decimals

---

## 🧪 TESTING ENDPOINTS

Use these curl commands to test:

```bash
# Test Revenue MTD
curl -X GET "http://localhost:8000/api/revenue/mtd" \
  -H "Authorization: Bearer <token>"

# Test Bookings Today
curl -X GET "http://localhost:8000/api/bookings/today" \
  -H "Authorization: Bearer <token>"

# Create Booking
curl -X POST "http://localhost:8000/api/bookings" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_date": "2025-10-17",
    "booking_time": "10:00",
    "customer_name": "Test User",
    "phone_number": "0901234567",
    "service_name": "PT Fitness",
    "branch_name": "Tôn Thất Thuyết"
  }'
```

---

## 📝 IMPLEMENTATION CHECKLIST

### **Phase 1: Core Endpoints (Priority)**

- [ ] GET /revenue/mtd
- [ ] GET /bookings/today
- [ ] GET /bookings/yesterday
- [ ] GET /checkins/today
- [ ] GET /visitors/today

### **Phase 2: Distribution Endpoints**

- [ ] GET /revenue/by-service
- [ ] GET /revenue/by-location
- [ ] GET /revenue/by-payment
- [ ] GET /revenue/by-staff

### **Phase 3: Operations**

- [ ] POST /bookings (create)
- [ ] PUT /bookings/:id (update)
- [ ] POST /bookings/:id/cancel
- [ ] POST /checkins (record)
- [ ] POST /visitors (record)

### **Phase 4: Real-time (Optional)**

- [ ] WebSocket server
- [ ] Subscribe/Publish system
- [ ] Real-time notifications

---

## 🔄 DATA TRANSFORMATION

Frontend `DataAdapter` will handle transformation automatically.  
Just return data in specified format and adapter will convert!

### **Example:**

**Backend sends:**

```json
{
  "service_name": "pt-fitness",
  "branch_name": "ton-that-thuyet"
}
```

**Adapter transforms to:**

```json
{
  "service": "PT Fitness",
  "location": "Tôn Thất Thuyết"
}
```

---

## ✅ SUCCESS CRITERIA

Backend is ready when:

1. ✅ All Phase 1 endpoints return 200 OK
2. ✅ Data format matches specification
3. ✅ Service/Location names match exactly
4. ✅ Authentication works
5. ✅ CORS configured for frontend domain
6. ✅ Response time < 500ms (P95)

---

**Ready to implement? Frontend is waiting! 🚀**
