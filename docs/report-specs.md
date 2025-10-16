## Tổng hợp báo cáo và chỉ số

### 1) Dashboard

- **Khai báo theo trung tâm**

  - Tôn Thất Thuyết
  - Huỳnh Thúc Kháng
  - Giảng Võ
  - Hào Nam
  - Nguyễn Tuân

- **Khai báo theo bộ phận**

  - Membership
  - Fitness
  - Pool
  - Pilates
  - Operation

- **Chỉ số hiển thị**

  - **Chỉ số doanh thu**

    - Mục tiêu doanh số (Target)
    - Doanh thu thực tế lũy kế (MTD Revenue)
    - Doanh thu ngày (Daily Revenue)
      - Revenue Today -1
      - Revenue Today
    - Tỉ lệ hoàn thành mục tiêu doanh số (% Target)
      - MTD Revenue / Target
    - Tỉ trọng (Department Ratio)
      - MTD Department Revenue / Company MTD Revenue
    - Doanh số mục tiêu còn lại
      - Target - MTD Revenue
      - (Target - MTD Revenue) / Days left
    - Dự kiến hoàn thành mục tiêu doanh số

  - **Chỉ số vận hành**

    - Lượt hội viên check-in

      - Member checkin Today -1
      - Member checkin Today
      - Member checkin MTD
      - Member checkin ontime
      - Khách hàng check-in thủ công

    - Lượt khách tham quan
    - Lượt khách tập thử
    - Lượt hợp đồng ngoài lịch trong tháng
      - Được duyệt
      - Chưa được duyệt
    - Lượt khách hàng sắp hết hạn/hết hạn (tính theo tháng tròn)
      - Tháng này
      - 3 tháng sau
    - Lượt khách hàng sinh nhật trong tháng (tròn)

  - **Chỉ số PT**
    - Số buổi tập PT
      - PT sessions Today -1
      - PT sessions Today
      - PT sessions MTD
      - PT sessions online
    - Số buổi tập fit
      - Fit shows Today -1
      - Fit shows Today
      - Fit shows MTD
      - Fit shows online

---

### 2) Auto Daily Report

- **Chỉ số doanh thu**

  - **Chỉ số tổng hợp**

    - **Chỉ số theo CLB**
      - Mục tiêu doanh số (Target)
      - Doanh thu thực tế lũy kế (MTD Revenue)
      - Doanh thu ngày (daily revenue)
      - Tỉ lệ hoàn thành mục tiêu doanh số (% Projecting)
        - `MTD Revenue / Target`
      - Tỉ trọng (department ratio)
        - `MTD Department Revenue / Company MTD Revenue`
      - Doanh số mục tiêu còn lại
        - `Target - MTD Revenue`
        - `(Target - MTD Revenue) / Days left`
    - **Chỉ số theo khối**
      - Mục tiêu doanh số (Target)
      - Doanh thu thực tế lũy kế (MTD Revenue)
      - Doanh thu ngày (daily revenue)
      - Tỉ lệ hoàn thành mục tiêu doanh số (% Projecting)
        - `MTD Revenue / Target`
      - Tỉ trọng (department ratio)
        - `MTD Department Revenue / Company MTD Revenue`
      - Doanh số mục tiêu còn lại
        - `Target - MTD Revenue`
        - `(Target - MTD Revenue) / Days left`

  - **Chỉ số chi tiết**
    - **Chỉ số theo hình thức thanh toán**
      - Đặt cọc (deposit)
      - Thanh toán đủ (pay in full)
      - Thanh toán nợ (pay balance)
    - **Chỉ số theo hình thức thu tiền**
      - Tiền mặt (cash)
      - Chuyển khoản (bank transfer)
      - MPOS
      - Cà thẻ (credit)
    - **Chỉ số theo nhân viên**
      - Lũy kế doanh số theo danh sách nhân viên

- **Chỉ số Membership**

- **Chỉ số PT**

  - **Số buổi tập PT**
    - PT sessions Today -1
    - PT sessions Today
    - PT sessions MTD
    - PT sessions online
  - **Số buổi tập fit**
    - Fit shows Today -1
    - Fit shows Today
    - Fit shows MTD
    - Fit shows online
  - **Chỉ số theo nhân viên**
    - Lũy kế số buổi tập PT theo danh sách nhân viên
    - Lũy kế số buổi tập fit theo danh sách nhân viên

- **Chỉ số vận hành**
  - Lượt hội viên check-in
    - Member checkin Today
    - Member checkin MTD
    - Danh sách khách hàng checkin ngoài giờ
    - Danh sách khách hàng checkin thủ công
  - Lượt khách tham quan
  - Lượt khách tập thử

---

### 3) Báo cáo doanh thu

- **Đầu mục báo cáo**

  - **Doanh số theo CLB**
    - Số tiền theo phiếu thu
  - **Doanh số theo dịch vụ**
  - **Doanh số theo bộ phận/nhóm**
  - **Doanh số theo nhân viên bán hàng**
    - Doanh số đặt cọc [deposit]
    - Doanh số thu đủ [pay in full]
    - Doanh số thu nợ [pay balance]
    - Ghi chú:
      - Trên cùng một báo cáo có thể hiển thị 3 mục riêng DE/PIF/PB để làm dữ liệu doanh số tính lương, trong đó:
      - DE: doanh số treo, không vào dữ liệu doanh số tính lương
      - PIF và PB: doanh số vào dữ liệu doanh số tính lương
  - **Doanh số theo chương trình bán hàng**
  - **Doanh số theo nguồn khách**

- **Điều kiện lọc chung**

  - Thời gian
    - Từ ngày/đến ngày
    - Tháng/Quý/Năm
  - Mã nhân viên

- **Phân quyền**

---

### 4) Thống kê hợp đồng

- **Đầu mục báo cáo**

  - **Hợp đồng hội viên**
    - Hợp đồng mới
      - Hợp đồng đăng ký mới [new]
      - Hợp đồng tái ký [renew]
      - Hợp đồng nâng cấp [upgrade]
    - Hợp đồng còn hiệu lực
    - Hợp đồng hết hiệu lực
    - Hợp đồng chưa kích hoạt
    - Hợp đồng đang tạm ngưng
    - Hợp đồng theo loại hình dịch vụ
    - Hợp đồng theo chương trình bán hàng
    - Hợp đồng theo nguồn khách
    - Hợp đồng sắp hết hiệu lực
    - Hợp đồng chưa thanh toán đủ
  - **Hợp đồng huấn luyện viên**
    - Hợp đồng mới
      - Hợp đồng đăng ký mới [new]
      - Hợp đồng tái ký [renew]
      - Hợp đồng nâng cấp [upgrade]
    - Hợp đồng còn hiệu lực
      - Expire date
      - Sessions
    - Hợp đồng hết hiệu lực
      - Expire date
      - Sessions
    - Hợp đồng chưa kích hoạt
      - Active date
      - First session
    - Hợp đồng đang tạm ngưng
    - Hợp đồng theo loại hình dịch vụ
    - Hợp đồng theo chương trình bán hàng
    - Hợp đồng theo nguồn khách
    - Hợp đồng sắp hết hiệu lực
      - Expire date
      - Sessions
    - Hợp đồng chưa thanh toán đủ

- **Điều kiện lọc chung**

  - Thời gian
  - Bộ phận
  - Câu lạc bộ
  - Mã nhân viên

- **Phân quyền**

---

### 5) Thống kê chỉ số vận hành

- **Đầu mục báo cáo**
  - **Báo cáo vận hành**
    - Hội viên
      - Hội viên checkin hàng ngày
      - Hội viên checkin theo thời gian
      - Lượt sử dụng tủ
      - Lượt sử dụng khăn
      - Thẻ tạm ngưng
      - Thẻ còn hiệu lực
      - ...
    - Khách tham quan
    - Khách tập thử
  - **Báo cáo Tập PT**
    - Số buổi tập PT
    - Số buổi tập fit
    - Doanh số tập PT
      - Dùng làm dữ liệu doanh số tính lương, trong đó thể hiện theo từng Mã hợp đồng, Số buổi tập từng hợp đồng, Đơn giá buổi tập, Tổng thành tiền buổi tập

---

### 6) Báo cáo CRM

- **Định nghĩa**

  - **Loại hình hợp đồng**
    - Hợp đồng đăng ký mới [new]
    - Hợp đồng tái ký [renew]
    - Hợp đồng nâng cấp [upgrade]
  - **Nguồn khách**
    - **Nguồn chủ động [nguồn sale]**
      - Khách giới thiệu [refer] (BR)
      - Voucher sale
      - Thị trường
      - Seeding
      - Data lạnh
      - Data băng
        - Ghi chú áp dụng: Hợp đồng đăng ký mới [new] cho các mục trên
      - Renew
        - Ghi chú áp dụng: Hợp đồng tái ký [renew]
      - Upgrade
        - Ghi chú áp dụng: Hợp đồng nâng cấp [upgrade]
    - **Nguồn bị động [nguồn marketing]**
      - Facebook ads
      - Zalo ads
      - Tiktok ads
      - Website
      - Hotline
        - Ghi chú áp dụng: Hợp đồng đăng ký mới [new] cho các mục trên

- **Đầu mục báo cáo**
  - **Báo cáo sale**
    - Thống kê Hợp đồng theo nguồn khách
    - Thống kê Doanh thu theo nguồn khách
    - Thống kê theo giai đoạn chăm sóc
  - **Tỉ lệ chuyển đổi**
    - **Tỉ lệ nguồn khách**
    - **Tỉ lệ hẹn**
      - Số hỏng
        - Sai số
        - Thuê bao
      - Không hẹn
        - Nhà xa
        - Không có nhu cầu
        - Không nghe máy
        - Trùng số
        - Khảo giá
      - Chưa hẹn
        - Đã tư vấn dịch vụ - địa điểm tập luyện
        - Đã báo giá cơ bản [note]
        - Đã báo chương trình ưu đãi [note]
        - Đã add zalo [note]
      - Đã hẹn
        - Ngày giờ hẹn
    - Tỉ lệ tham quan
    - Tỉ lệ tập thử
    - Tỉ lệ chốt hợp đồng
  - **Báo cáo marketing**
    - Thống kê Hợp đồng theo nguồn khách marketing
    - Thống kê Doanh thu theo nguồn khách marketing
