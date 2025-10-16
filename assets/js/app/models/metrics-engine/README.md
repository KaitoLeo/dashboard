# Metrics Engine - Há»‡ thá»‘ng Ä‘á»“ng bá»™ dá»¯ liá»‡u

## Tá»•ng quan

Metrics Engine lÃ  má»™t há»‡ thá»‘ng JavaScript thuáº§n Ä‘Æ°á»£c thiáº¿t káº¿ Ä‘á»ƒ Ä‘áº£m báº£o Ä‘á»“ng bá»™ dá»¯ liá»‡u hoÃ n toÃ n giá»¯a cÃ¡c trang trong dashboard. Há»‡ thá»‘ng nÃ y Ä‘áº£m báº£o ráº±ng táº¥t cáº£ sá»‘ liá»‡u, biá»ƒu Ä‘á»“ vÃ  báº£ng dá»¯ liá»‡u Ä‘á»u sá»­ dá»¥ng cÃ¹ng má»™t nguá»“n dá»¯ liá»‡u vÃ  cÃ´ng thá»©c tÃ­nh toÃ¡n.

## Cáº¥u trÃºc thÆ° má»¥c

```
assets/js/app/models/metrics-engine/
â”œâ”€â”€ types.js          # Äá»‹nh nghÄ©a cÃ¡c kiá»ƒu dá»¯ liá»‡u chuáº©n
â”œâ”€â”€ selectors.js      # Chuáº©n hÃ³a dá»¯ liá»‡u vá» DataModel chuáº©n
â”œâ”€â”€ compute.js        # CÃ¡c function tÃ­nh toÃ¡n KPI (pure functions)
â”œâ”€â”€ cache.js          # Há»‡ thá»‘ng cache Ä‘á»ƒ trÃ¡nh tÃ­nh toÃ¡n trÃ¹ng láº·p
â”œâ”€â”€ index.js          # Main entry point - quáº£n lÃ½ toÃ n bá»™ há»‡ thá»‘ng
â”œâ”€â”€ sync.js           # Äá»“ng bá»™ dá»¯ liá»‡u giá»¯a cÃ¡c trang
â”œâ”€â”€ init.js           # Khá»Ÿi táº¡o metrics engine vá»›i dá»¯ liá»‡u máº«u
â””â”€â”€ README.md         # TÃ i liá»‡u hÆ°á»›ng dáº«n
```

## CÃ¡ch sá»­ dá»¥ng

### 1. Khá»Ÿi táº¡o Metrics Engine

```javascript
// Khá»Ÿi táº¡o vá»›i dá»¯ liá»‡u máº«u
await window.MetricsEngine.initialize({
  checkins: window.lateCheckinData || [],
});
```

### 2. Láº¥y dá»¯ liá»‡u metrics

```javascript
// Láº¥y metric cá»¥ thá»ƒ
const lateCheckins = window.MetricsEngine.getMetric("lateCheckins");
console.log(lateCheckins.formattedValue); // "43"

// Láº¥y táº¥t cáº£ metrics
const allMetrics = window.MetricsEngine.getAllMetrics();
```

### 3. Cáº­p nháº­t bá»™ lá»c

```javascript
// Cáº­p nháº­t bá»™ lá»c
window.MetricsEngine.updateFilters({
  location: "ton-that-thuyet",
  department: "membership",
  lateType: "late",
});
```

### 4. Láº¯ng nghe sá»± kiá»‡n

```javascript
// Láº¯ng nghe khi metrics Ä‘Æ°á»£c cáº­p nháº­t
window.MetricsEngine.addListener("metricsUpdated", function () {
  console.log("Metrics updated!");
  // Cáº­p nháº­t UI táº¡i Ä‘Ã¢y
});

// Láº¯ng nghe khi filters Ä‘Æ°á»£c cáº­p nháº­t
window.MetricsEngine.addListener("filtersUpdated", function (data) {
  console.log("Filters updated:", data);
});
```

## CÃ¡c loáº¡i metrics cÃ³ sáºµn

- `totalCheckins` - Tá»•ng sá»‘ check-in
- `lateCheckins` - Sá»‘ check-in muá»™n
- `earlyCheckins` - Sá»‘ check-in sá»›m
- `ontimeCheckins` - Sá»‘ check-in Ä‘Ãºng giá»
- `lateCheckinRate` - Tá»· lá»‡ check-in muá»™n
- `checkinsByDepartment` - Check-in theo bá»™ pháº­n
- `checkinsByLocation` - Check-in theo cÆ¡ sá»Ÿ
- `lateCheckinStatistics` - Thá»‘ng kÃª chi tiáº¿t check-in sai giá»

## Cáº¥u trÃºc dá»¯ liá»‡u chuáº©n

### CheckinDataModel

```javascript
{
  id: "checkin_1",
  memberId: "HV001",
  memberName: "Nguyá»…n VÄƒn A",
  location: "TÃ´n Tháº¥t Thuyáº¿t",
  locationKey: "ton-that-thuyet",
  department: "Membership",
  departmentKey: "membership",
  staffInCharge: "Nguyá»…n Thá»‹ Lan",
  checkinTime: "08:15",
  requiredTime: "08:00",
  timeDifference: 15, // phÃºt (dÆ°Æ¡ng = muá»™n, Ã¢m = sá»›m, 0 = Ä‘Ãºng giá»)
  lateType: "late", // 'late', 'early', 'ontime'
  checkinType: "Thá»§ cÃ´ng",
  reason: "QuÃªn tháº» tá»«",
  status: "active",
  serviceType: "Gym",
  classType: "Lá»›p 1:1",
  instructor: "Nguyá»…n VÄƒn B",
  createdAt: "2024-01-15T08:15:00Z",
  updatedAt: "2024-01-15T08:15:00Z"
}
```

### MetricResult

```javascript
{
  value: 43,
  type: "count",
  label: "Check-in muá»™n",
  description: "Sá»‘ lÆ°á»£t check-in muá»™n",
  formattedValue: "43",
  rawData: [...] // Dá»¯ liá»‡u thÃ´ Ä‘Ã£ lá»c
}
```

## CÃ¡ch thÃªm metric má»›i

### 1. ThÃªm function tÃ­nh toÃ¡n trong `compute.js`

```javascript
computeNewMetric(data, filters = {}) {
  const filteredData = this.applyFilters(data, filters);
  const value = filteredData.length; // Logic tÃ­nh toÃ¡n

  return {
    value,
    type: MetricsTypes.MetricTypes.COUNT,
    label: 'Metric má»›i',
    description: 'MÃ´ táº£ metric má»›i',
    formattedValue: this.formatNumber(value),
    rawData: filteredData
  };
}
```

### 2. ThÃªm vÃ o `index.js`

```javascript
// Trong function computeAllMetrics()
case 'newMetric':
  result = this.compute.computeNewMetric(data, filters);
  break;
```

### 3. Sá»­ dá»¥ng metric má»›i

```javascript
const newMetric = window.MetricsEngine.getMetric("newMetric");
console.log(newMetric.formattedValue);
```

## CÃ¡ch thÃªm filter má»›i

### 1. Cáº­p nháº­t `types.js`

```javascript
const FilterTypes = {
  // ... existing filters
  NEW_FILTER: "newFilter",
};
```

### 2. Cáº­p nháº­t `compute.js`

```javascript
// Trong function applyFilters()
if (filters.newFilter && filters.newFilter !== "all") {
  filteredData = filteredData.filter(
    (item) => item.newField === filters.newFilter
  );
}
```

### 3. Cáº­p nháº­t `index.js`

```javascript
// Trong function getCurrentFilters()
newFilter: this.globalFilterState.newFilter.selected;
```

## Äá»“ng bá»™ dá»¯ liá»‡u

Há»‡ thá»‘ng tá»± Ä‘á»™ng Ä‘á»“ng bá»™ dá»¯ liá»‡u giá»¯a cÃ¡c trang thÃ´ng qua `DataSynchronizer`:

- Äá»“ng bá»™ má»—i 30 giÃ¢y
- Loáº¡i bá» trÃ¹ng láº·p dá»¯ liá»‡u
- Chuáº©n hÃ³a dá»¯ liá»‡u tá»« cÃ¡c nguá»“n khÃ¡c nhau
- Cáº­p nháº­t metrics engine khi cÃ³ thay Ä‘á»•i

## Cache vÃ  Performance

- Tá»± Ä‘á»™ng cache káº¿t quáº£ tÃ­nh toÃ¡n
- TTL máº·c Ä‘á»‹nh: 5 phÃºt
- Tá»± Ä‘á»™ng dá»n dáº¹p cache háº¿t háº¡n
- Memoization Ä‘á»ƒ trÃ¡nh tÃ­nh toÃ¡n trÃ¹ng láº·p

## Debugging

```javascript
// Xem tráº¡ng thÃ¡i há»‡ thá»‘ng
console.log(window.MetricsEngine.getSystemStats());

// Xem tráº¡ng thÃ¡i sync
console.log(window.DataSynchronizer.getSyncStatus());

// Xem thá»‘ng kÃª cache
console.log(window.MetricsCache.getStats());

// Force sync
window.DataSynchronizer.forceSync();
```

## LÆ°u Ã½ quan trá»ng

1. **LuÃ´n sá»­ dá»¥ng Metrics Engine** Ä‘á»ƒ láº¥y dá»¯ liá»‡u, khÃ´ng tÃ­nh toÃ¡n trá»±c tiáº¿p trong component
2. **Cáº­p nháº­t UI** thÃ´ng qua listeners, khÃ´ng cáº­p nháº­t trá»±c tiáº¿p
3. **Sá»­ dá»¥ng cache** Ä‘á»ƒ tá»‘i Æ°u performance
4. **Äá»“ng bá»™ dá»¯ liá»‡u** giá»¯a cÃ¡c trang Ä‘á»ƒ Ä‘áº£m báº£o tÃ­nh nháº¥t quÃ¡n
5. **Test ká»¹ lÆ°á»¡ng** khi thÃªm metric hoáº·c filter má»›i

## Troubleshooting

### Lá»—i thÆ°á»ng gáº·p

1. **"Metrics Engine not initialized"**

   - Äáº£m báº£o gá»i `initialize()` trÆ°á»›c khi sá»­ dá»¥ng
   - Kiá»ƒm tra dá»¯ liá»‡u máº«u Ä‘Ã£ load chÆ°a

2. **"Data not syncing"**

   - Kiá»ƒm tra `DataSynchronizer` Ä‘Ã£ start chÆ°a
   - Xem console log Ä‘á»ƒ debug

3. **"Cache not working"**

   - Kiá»ƒm tra TTL cá»§a cache
   - XÃ³a cache vÃ  thá»­ láº¡i

4. **"UI not updating"**
   - Kiá»ƒm tra listeners Ä‘Ã£ Ä‘Äƒng kÃ½ chÆ°a
   - Äáº£m báº£o gá»i `updateUIFromMetrics()` sau khi metrics thay Ä‘á»•i

