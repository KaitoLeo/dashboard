# 🚀 Hướng dẫn Deploy GitLab Pages (HTML Thuần)

## Bước 1: Tạo Repository trên GitLab

1. Đăng nhập vào GitLab
2. Tạo repository mới với tên `actiwell-dashboard-mockui`
3. Clone repository về máy local:
   ```bash
   git clone https://gitlab.com/[username]/actiwell-dashboard-mockui.git
   cd actiwell-dashboard-mockui
   ```

## Bước 2: Copy Code vào Repository

1. Copy toàn bộ files từ thư mục `actiwell-dashboard-mockui` vào repository
2. Commit và push code:
   ```bash
   git add .
   git commit -m "Initial commit for GitLab Pages deployment"
   git push origin main
   ```

## Bước 3: Cấu hình GitLab Pages

1. Vào **Settings** > **Pages** trong GitLab project
2. Enable **GitLab Pages**
3. Chọn source là **"Deploy from a branch"**
4. Chọn branch **main** hoặc **master**
5. Click **Save changes**

## Bước 4: Kiểm tra Deployment

1. Vào **CI/CD** > **Pipelines** để xem trạng thái
2. Pipeline đơn giản chỉ copy files tĩnh (mất 1-2 phút)
3. Truy cập URL Pages: `https://[username].gitlab.io/actiwell-dashboard-mockui/`

## 🔧 Troubleshooting (HTML Thuần)

### Pipeline Failed
- Kiểm tra logs trong GitLab CI/CD
- Đảm bảo file `.gitlab-ci.yml` có trong root directory
- Kiểm tra syntax của file YAML

### Pages Không Load
- Đảm bảo file `index.html` có trong thư mục `public/`
- Kiểm tra đường dẫn relative trong HTML (../assets/)
- Xem logs trong GitLab Pages settings

### Assets Không Load
- Kiểm tra đường dẫn trong HTML (phải là relative paths)
- Đảm bảo thư mục `assets/` được copy vào `public/`
- Kiểm tra file permissions

## 📝 Lưu ý Quan Trọng (HTML Thuần)

1. **Branch chính:** Pipeline chỉ chạy trên branch `main` hoặc `master`
2. **File cần thiết:** Đảm bảo có file `index.html` trong root directory
3. **Assets:** Tất cả assets phải sử dụng relative paths (../assets/)
4. **HTTPS:** GitLab Pages tự động cung cấp HTTPS
5. **Custom Domain:** Có thể cấu hình custom domain trong Pages settings
6. **Không cần build:** Vì là HTML thuần nên không cần compile

## 🎯 URL Mẫu

- **Production:** `https://[username].gitlab.io/actiwell-dashboard-mockui/`
- **Staging:** `https://[username].gitlab.io/actiwell-dashboard-mockui/-/jobs/[job-id]/artifacts/public/`

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. GitLab CI/CD logs
2. GitLab Pages logs
3. Browser console errors
4. Network tab trong Developer Tools
5. Đường dẫn relative trong HTML files
