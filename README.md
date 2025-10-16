# Actiwell Dashboard MockUI

Đây là mockup HTML thuần tĩnh của giao diện Actiwell Dashboard được tạo dựa trên dự án gốc `actiwell-frontend-cms-app`. Dự án này được thiết lập để tự động deploy lên GitLab Pages.

## 🚀 GitLab Pages Deployment (HTML Thuần)

### Tự động Deploy
Dự án đã được cấu hình để tự động deploy lên GitLab Pages khi push code lên branch `main` hoặc `master`.

**URL truy cập:** `https://[username].gitlab.io/actiwell-dashboard-mockui/`

### Cấu hình CI/CD (Đơn giản)
- File `.gitlab-ci.yml` đã được tối ưu cho HTML thuần
- Không cần build process phức tạp, chỉ copy files tĩnh
- Pipeline đơn giản với 1 stage duy nhất
- Artifacts được tạo trong thư mục `public/` cho GitLab Pages

### Deploy thủ công
```bash
# Chuẩn bị files tĩnh
npm run build

# Kiểm tra files
npm run test

# Deploy lên GitLab Pages
npm run deploy
```

## 📁 Cấu trúc dự án

```
actiwell-dashboard-mockui/
├── index.html              # Trang chủ mockup
├── test-charts.html        # Trang test charts
├── assets/
│   ├── css/
│   │   └── style.css       # File CSS chính
│   ├── js/
│   │   ├── main.js         # JavaScript chính
│   │   ├── charts.js       # Charts functionality
│   │   ├── realtime-clock.js # Real-time clock
│   │   └── script.js       # Additional scripts
│   └── images/             # Thư mục chứa hình ảnh
├── pages/                  # Các trang con
│   ├── reports/            # Thư mục báo cáo
│   └── *.html              # Các trang HTML khác
├── data/
│   └── sample-data.js      # Dữ liệu mẫu
├── .gitlab-ci.yml          # GitLab CI/CD configuration
├── package.json            # Node.js dependencies
├── .gitignore              # Git ignore rules
├── README.md               # File mô tả dự án
├── business-specs.md       # Business specifications
├── report-specs.md         # Report specifications
└── todo.md                 # File theo dõi công việc
```

## Tính năng đã implement

### 1. Layout chính

- ✅ Header với logo và menu người dùng
- ✅ Sidebar với menu điều hướng
- ✅ Main content area
- ✅ Responsive design cho mobile/tablet

### 2. Sidebar Menu

- ✅ Menu đa cấp với animation
- ✅ Icon và text cho từng menu item
- ✅ Active state highlighting
- ✅ Collapsible submenu
- ✅ Responsive sidebar (ẩn trên mobile)

### 3. Dashboard

- ✅ Dashboard cards với thống kê
- ✅ Chart placeholder areas
- ✅ Recent activities table
- ✅ Service statistics

### 4. Styling

- ✅ Color scheme giống Actiwell gốc
- ✅ Typography (IBM Plex Sans)
- ✅ Component styling (cards, buttons, tables)
- ✅ Hover effects và transitions
- ✅ Box shadows và border radius

### 5. JavaScript Functionality

- ✅ Sidebar toggle
- ✅ Dropdown menus
- ✅ Mobile responsive handling
- ✅ Preloader animation
- ✅ Table interactions

## 🛠️ Cách sử dụng (HTML Thuần)

### Local Development
1. Clone repository về máy local
2. Mở file `index.html` trong trình duyệt
3. Hoặc chạy development server:
   ```bash
   npm run dev
   ```
4. Truy cập `http://localhost:8000`

### GitLab Pages Setup (Đơn giản)
1. **Tạo repository trên GitLab:**
   - Tạo repository mới trên GitLab
   - Clone repository về máy local
   - Copy toàn bộ code vào repository

2. **Cấu hình GitLab Pages:**
   - Vào Settings > Pages trong GitLab project
   - Enable GitLab Pages
   - Chọn source là "Deploy from a branch"
   - Chọn branch `main` hoặc `master`

3. **Push code để trigger deployment:**
   ```bash
   git add .
   git commit -m "Initial commit for GitLab Pages"
   git push origin main
   ```

4. **Kiểm tra deployment:**
   - Vào CI/CD > Pipelines để xem trạng thái
   - Pipeline đơn giản chỉ copy files tĩnh
   - Sau khi thành công, truy cập URL Pages

### Đặc điểm HTML Thuần
- ✅ **Không cần build process** phức tạp
- ✅ **Pipeline đơn giản** chỉ copy files
- ✅ **Deploy nhanh** vì không cần compile
- ✅ **Dễ debug** vì là files tĩnh
- ✅ **Tương thích tốt** với GitLab Pages

### Troubleshooting
- **Pipeline failed:** Kiểm tra logs trong GitLab CI/CD
- **Pages không load:** Đảm bảo file `index.html` có trong thư mục `public/`
- **Assets không load:** Kiểm tra đường dẫn relative trong HTML (../assets/)
- **404 errors:** Kiểm tra file .htaccess đã được tạo

## Màu sắc chính

- **Primary**: #556ee6 (Blue)
- **Success**: #34c38f (Green)
- **Info**: #50a5f1 (Light Blue)
- **Warning**: #f1b44c (Orange)
- **Danger**: #f46a6a (Red)
- **Actiwell Navy**: #1a365d
- **Actiwell Cream**: #f7fafc

## Font chính

- **IBM Plex Sans** - Font chính của giao diện
- **Font Awesome** - Icons
- **Boxicons** - Additional icons

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: > 991px

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Ghi chú

Đây là mockup tĩnh, không có kết nối backend. Tất cả dữ liệu hiển thị là dữ liệu mẫu.

## Cập nhật

Mockup này được tạo dựa trên phiên bản Actiwell CMS tại thời điểm phân tích (tháng 12/2024).

