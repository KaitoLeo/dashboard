# TODO.md — Quy ước bắt buộc cho mọi prompt/PR trong `actiwell-dashboard-mockui`

> **BẮT BUỘC**: Trước khi thực hiện bất kỳ thay đổi nào, **đọc & tuân thủ** file này. Mọi PR không đạt tiêu chí dưới đây phải **bị từ chối**.

---

## 0) Mục tiêu tổng quát

- **Đồng bộ dữ liệu tuyệt đối** giữa **metric card ↔ bảng ↔ biểu đồ ↔ trang chi tiết** cho cùng 1 mốc thời gian/logic.
- **Định dạng hiển thị chuẩn** (viết hoa chữ đầu cho các mốc thời gian tiếng Việt).
- **Thứ tự dịch vụ chuẩn** được áp dụng nhất quán ở **mọi nơi**.

---

## 1) Quy tắc định dạng mốc thời gian (bắt buộc)

- Các từ chỉ thời gian sau **phải viết hoa chữ cái đầu** ở phần UI:
  `Hôm nay, Hôm qua, Tháng này, Tháng trước, Năm nay, Năm trước, Tuần này, Tuần trước`.
- Khi tạo/đổi trang dựa trên các mốc này, **mọi nơi** (tiêu đề, nhãn, thẻ filter, breadcrumb, caption biểu đồ) đều **phải dùng đúng định dạng** trên.

**Checklist thực thi**

- [ ] Normalize label trước khi render: `capitalize_vi("hôm nay") => "Hôm nay"`, áp dụng global.
- [ ] Không hardcode biến thể khác (vd. “hom nay”, “HÔM NAY”…).

---

## 2) Quy tắc **đồng bộ dữ liệu theo thời gian** (bắt buộc)

- Nếu `Hôm qua` trên **metric card** hiển thị **350** lượt check-in thì:

  - [ ] **Bảng thống kê Hôm qua** = 350
  - [ ] **Biểu đồ Hôm qua** = 350
  - [ ] **Trang chi tiết Hôm qua** (nếu có) = 350

- Nguồn dữ liệu cho một mốc thời gian **chỉ có 1 chỗ** (single source of truth).

**Checklist thực thi**

- [ ] Đọc **cùng 1 hàm/endpoint** cho tất cả thành phần liên quan cùng mốc thời gian (không tính lại riêng lẻ ở mỗi component).
- [ ] Khi sửa logic mốc thời gian (ví dụ “Hôm qua” đổi định nghĩa từ 00:00–23:59 theo timezone), **đồng bộ sửa ở toàn bộ nơi tiêu thụ** (metric, bảng, biểu đồ, trang con).
- [ ] Reload/F5 bất kỳ trang con nào vẫn ra số liệu **trùng khớp** với trang cha.

**Tiêu chí chấp nhận**

- [ ] So sánh trực quan: **không có lệch số** giữa card ↔ bảng ↔ biểu đồ cho cùng mốc thời gian.
- [ ] Log debug (nếu bật) in ra cùng `timeKey`/`queryParams` cho tất cả thành phần.

---

## 3) Quy tắc **thứ tự dịch vụ chuẩn** (bắt buộc)

**Thứ tự cố định** phải áp dụng ở **mọi nơi** (card, bảng, biểu đồ, filter, legend, drill-down):

1. `Membership`
2. `PT Fitness`
3. `Pilates`
4. `Swimming Coach`

**Checklist thực thi**

- [ ] Sắp xếp mảng dịch vụ **trước khi render** theo thứ tự trên (không theo alphabet/ID).
- [ ] Ở bố cục lưới: **trái → phải** hoặc **trên → dưới** phải đúng thứ tự.
- [ ] Ở bảng/legend: thứ tự hàng/mục cũng **giữ nguyên**.
- [ ] Nếu thiếu dữ liệu của một dịch vụ, **giữ vị trí trống**/hiển thị `N/A`, **không xô lệch** thứ tự còn lại.

---

## 4) Quy tắc **đồng bộ khi sửa logic** (bắt buộc)

- Khi tôi yêu cầu “sửa ở đâu” (ví dụ logic “Hôm nay” hoặc cách tính của `PT Fitness`), thì:

  - [ ] **Chỉ sửa đúng logic đó** tại **nguồn chung** (hàm tính/endpoint duy nhất).
  - [ ] **Đồng bộ** toàn bộ nơi tiêu thụ logic đó (card/bảng/biểu đồ/trang con).
  - [ ] **Không** tự ý đổi hay “dọn dẹp” những phần **không liên quan**.

**Tiêu chí chấp nhận**

- [ ] PR mô tả **điểm logic thay đổi** + danh sách **các nơi bị ảnh hưởng** đã đồng bộ.
- [ ] Kiểm thử: đối chiếu số trước/sau ở tất cả màn hình liên quan.

---

## 5) Hướng dẫn kỹ thuật ngắn gọn (khuyến nghị)

- **Hàm chuẩn hóa nhãn thời gian**

  - [ ] Cài 1 helper duy nhất (ví dụ `formatTimeLabelVi(key)`), áp dụng toàn app.

- **Hàm sắp xếp dịch vụ**

  - [ ] Dùng comparator cố định:

    ```
    ORDER = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"]
    sortByOrder(items, key="serviceName", ORDER)
    ```

  - [ ] Gọi trước khi render **bất kỳ** danh sách/series nào.

- **Nguồn dữ liệu dùng chung**

  - [ ] Dùng 1 service/hook/hàm tính **duy nhất** cho mỗi `timeRange` (Hôm nay/Hôm qua/Tháng này/…), **không** tách hàm theo component.
  - [ ] Tất cả component lấy từ **cùng nguồn** + **cùng tham số**.

---

## 6) Quy trình PR & kiểm thử (bắt buộc)

**Trước khi mở PR**

- [ ] Đã chạy kiểm tra:

  - [ ] Label thời gian đúng chuẩn viết hoa.
  - [ ] Card ↔ Bảng ↔ Biểu đồ **khớp số** cho từng mốc: `Hôm nay / Hôm qua / Tháng này / Năm nay`.
  - [ ] Thứ tự dịch vụ đúng **ở mọi nơi** (card/bảng/legend/filter/drill-down).
  - [ ] Reload vào trực tiếp trang con theo mốc thời gian vẫn **đúng số**.

**Trong PR description**

- [ ] Liệt kê **logic nào được thay đổi**, **ở đâu là nguồn**, và **những nơi đã đồng bộ**.
- [ ] Đính kèm ảnh chụp 4 vị trí (card/bảng/biểu đồ/trang con) cho **cùng mốc thời gian**, thể hiện số **trùng khớp**.
- [ ] Nếu có dịch vụ thiếu dữ liệu, xác nhận **thứ tự vẫn giữ nguyên**.

**Sau khi merge**

- [ ] Smoke test nhanh các mốc `Hôm nay/Hôm qua/Tháng này/Năm nay` trên Dashboard và 1–2 trang con ngẫu nhiên.

---

## 7) Không được làm (DO NOT)

- [ ] Không viết hoa tùy hứng (phải dùng helper chuẩn).
- [ ] Không sắp xếp dịch vụ theo alphabet/ID hoặc “tự thấy hợp lý”.
- [ ] Không copy/paste logic tính vào từng component (dẫn tới lệch số).
- [ ] Không “dọn layout” hay “refactor” ngoài phạm vi khi đang sửa **1 logic cụ thể**.

---

## 8) Mẫu commit message (tham khảo)

- `feat(metrics): đồng bộ logic “Hôm qua” cho check-in (card/bảng/biểu đồ/trang chi tiết)`
- `fix(ui): chuẩn hóa nhãn thời gian viết hoa chữ đầu (Hôm nay/Hôm qua/Tháng này/Năm nay)`
- `chore(render): áp dụng thứ tự dịch vụ chuẩn Membership → PT Fitness → Pilates → Swimming Coach ở tất cả grid & legend`

---

## 9) Định nghĩa “Đã xong” (Definition of Done)

- [ ] Toàn bộ **nhãn thời gian** đúng định dạng chuẩn.
- [ ] **Mọi nơi** cùng mốc thời gian hiển thị **cùng một số**.
- [ ] **Mọi nơi** hiển thị **đúng thứ tự dịch vụ chuẩn**.
- [ ] PR mô tả rõ **nguồn logic** và **phạm vi đồng bộ**, có ảnh đối chiếu.
- [ ] Không có thay đổi ngoài phạm vi yêu cầu.
