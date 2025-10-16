# Hướng dẫn cập nhật SRS.md

## Tổng quan

File `SRS.md` chứa tài liệu đặc tả yêu cầu phần mềm với tất cả các công thức tính toán và logic xử lý dữ liệu của hệ thống Actiwell Dashboard. Tài liệu này được cập nhật tự động thông qua script `update-srs.js`.

## Cách sử dụng

### 1. Cập nhật tự động SRS.md

```bash
# Chạy script cập nhật đầy đủ
npm run update-srs

# Hoặc chạy trực tiếp
node update-srs.js
```

### 2. Chỉ quét công thức (không cập nhật file)

```bash
# Chỉ quét và hiển thị kết quả
npm run scan-formulas

# Hoặc
node update-srs.js --scan-only
```

### 3. Kiểm tra tính hợp lệ của SRS.md

```bash
# Validate nội dung SRS.md
npm run validate-srs

# Hoặc
node update-srs.js --validate
```

## Cấu trúc SRS.md

### 1. Công thức tính toán chính

- **Chỉ số Doanh thu**: Completion Rate, Remaining Target, Daily Target, Growth Rate
- **Chỉ số Check-in**: On-time Rate, Frequency per Member, Average Duration
- **Chỉ số Tỉ lệ**: Cancellation Rate, Retention Rate, Churn Rate
- **Chỉ số Sử dụng Cơ sở**: Occupancy Rate, Department Utilization
- **Chỉ số Burn Rate**: Average Burn Rate, Member Classification

### 2. Logic xử lý dữ liệu

- **Filter System**: Location và Department filters
- **Cache System**: 5 phút timeout
- **Real-time Sync**: localStorage event listeners

### 3. Cấu trúc dữ liệu

- **Revenue Data**: MTD, Daily, Target, Growth
- **Check-in Data**: Today, Yesterday, MTD, On-time
- **PT Sessions**: Individual, Group, Online

## Quy trình cập nhật

### Khi thêm công thức mới:

1. **Viết code** trong các file JavaScript
2. **Chạy script cập nhật**:
   ```bash
   npm run update-srs
   ```
3. **Kiểm tra kết quả** trong SRS.md
4. **Commit changes**:
   ```bash
   git add SRS.md
   git commit -m "Update SRS: Add new calculation formulas"
   ```

### Khi sửa đổi công thức hiện tại:

1. **Sửa code** trong file JavaScript tương ứng
2. **Chạy script cập nhật**:
   ```bash
   npm run update-srs
   ```
3. **Kiểm tra diff** để đảm bảo thay đổi chính xác
4. **Test** các tính toán mới
5. **Commit changes**

### Khi thêm file JavaScript mới:

1. **Thêm file path** vào mảng `jsFiles` trong `update-srs.js`
2. **Chạy script cập nhật**:
   ```bash
   npm run update-srs
   ```

## Các pattern được nhận diện

Script sẽ tự động nhận diện các pattern sau:

### 1. Tính toán phần trăm

```javascript
completionRate = Math.round((mtdRevenue / monthlyTarget) * 100);
```

### 2. Phép chia

```javascript
avgDaily = Math.round(mtdRevenue / daysPassed);
```

### 3. Phép nhân

```javascript
dailyTargetNeeded = Math.round(remainingTarget / remainingDays);
```

### 4. Filter multipliers

```javascript
const departmentMultipliers = {
  membership: 1.0,
  fitness: 0.8,
};
```

### 5. Date calculations

```javascript
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
```

### 6. Array operations

```javascript
highBurnRateMembers = members.filter((member) => member.monthlyCheckins > 6);
```

## Troubleshooting

### Lỗi thường gặp:

1. **File không tồn tại**:

   ```
   ⚠️  File không tồn tại: assets/js/some-file.js
   ```

   - Kiểm tra đường dẫn file trong `jsFiles` array
   - Đảm bảo file tồn tại trong project

2. **Lỗi đọc file**:

   ```
   ❌ Lỗi đọc file: ENOENT: no such file or directory
   ```

   - Kiểm tra quyền truy cập file
   - Đảm bảo file không bị lock

3. **SRS.md không được cập nhật**:
   - Kiểm tra quyền ghi file
   - Đảm bảo file SRS.md tồn tại
   - Chạy script với quyền admin nếu cần

### Debug mode:

```bash
# Chạy với debug info
DEBUG=true node update-srs.js
```

## Best Practices

### 1. Code Documentation

- Luôn comment rõ ràng cho các công thức phức tạp
- Sử dụng tên biến có ý nghĩa
- Tránh magic numbers

### 2. Formula Naming

- Sử dụng tên biến mô tả rõ ràng
- Ví dụ: `completionRate` thay vì `rate`
- Ví dụ: `dailyTargetNeeded` thay vì `daily`

### 3. Error Handling

- Luôn có fallback values
- Validate input data
- Log errors appropriately

### 4. Performance

- Cache kết quả tính toán phức tạp
- Sử dụng debounce cho real-time updates
- Optimize DOM updates

## Liên hệ

Nếu có vấn đề với script cập nhật hoặc cần thêm tính năng mới, vui lòng tạo issue trong repository hoặc liên hệ team phát triển.

---

**Lưu ý**: Script này được thiết kế để tự động hóa việc cập nhật tài liệu. Tuy nhiên, vẫn cần review thủ công để đảm bảo tính chính xác của các công thức được cập nhật.


