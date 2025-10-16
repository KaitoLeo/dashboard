/**
 * Metrics Engine - Data Selectors
 * Chuẩn hóa dữ liệu về DataModel chuẩn
 */

class DataSelector {
  constructor() {
    this.rawData = new Map();
    this.normalizedData = new Map();
  }

  /**
   * Thêm dữ liệu thô vào selector
   * @param {string} type - Loại dữ liệu (CHECKIN, MEMBER, etc.)
   * @param {Array} data - Mảng dữ liệu thô
   */
  addRawData(type, data) {
    this.rawData.set(type, data);
    this.normalizeData(type, data);
  }

  /**
   * Chuẩn hóa dữ liệu check-in
   * @param {Array} rawCheckins - Dữ liệu check-in thô
   * @returns {Array} Dữ liệu đã chuẩn hóa
   */
  normalizeCheckinData(rawCheckins) {
    return rawCheckins.map((item, index) => {
      // Đảm bảo có đầy đủ các trường bắt buộc
      const normalized = {
        id: item.id || `checkin_${index + 1}`,
        memberId: item.memberId || item.member_id || "",
        memberName: item.memberName || item.member_name || item.name || "",
        location: item.location || "",
        locationKey:
          item.locationKey ||
          item.location_key ||
          this.generateKey(item.location),
        department: item.department || "",
        departmentKey:
          item.departmentKey ||
          item.department_key ||
          this.generateKey(item.department),
        staffInCharge: item.staffInCharge || item.staff_in_charge || "",
        checkinTime: item.checkinTime || item.checkin_time || "",
        requiredTime: item.requiredTime || item.required_time || "08:00",
        timeDifference: this.calculateTimeDifference(
          item.checkinTime || item.checkin_time,
          item.requiredTime || item.required_time
        ),
        lateType: this.determineLateType(item.timeDifference),
        checkinType: item.checkinType || item.checkin_type || "Thủ công",
        reason: item.reason || item.note || "",
        status: item.status || "active",
        serviceType: item.serviceType || item.service_type || "",
        classType: item.classType || item.class_type || "",
        instructor: item.instructor || "",
        createdAt:
          item.createdAt || item.created_at || new Date().toISOString(),
        updatedAt:
          item.updatedAt || item.updated_at || new Date().toISOString(),
      };

      return normalized;
    });
  }

  /**
   * Chuẩn hóa dữ liệu theo loại
   * @param {string} type - Loại dữ liệu
   * @param {Array} data - Dữ liệu thô
   */
  normalizeData(type, data) {
    switch (type) {
      case MetricsTypes.RawDataTypes.CHECKIN:
        this.normalizedData.set(type, this.normalizeCheckinData(data));
        break;
      default:
        this.normalizedData.set(type, data);
    }
  }

  /**
   * Tính toán thời gian chênh lệch
   * @param {string} checkinTime - Thời gian check-in (HH:MM)
   * @param {string} requiredTime - Thời gian yêu cầu (HH:MM)
   * @returns {number} Số phút chênh lệch
   */
  calculateTimeDifference(checkinTime, requiredTime) {
    if (!checkinTime || !requiredTime) return 0;

    const checkin = this.parseTime(checkinTime);
    const required = this.parseTime(requiredTime);

    if (!checkin || !required) return 0;

    return checkin - required;
  }

  /**
   * Parse thời gian từ string HH:MM
   * @param {string} timeStr - Chuỗi thời gian
   * @returns {number} Số phút từ 00:00
   */
  parseTime(timeStr) {
    if (!timeStr) return null;

    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    return hours * 60 + minutes;
  }

  /**
   * Xác định loại check-in
   * @param {number} timeDifference - Thời gian chênh lệch
   * @returns {string} 'late', 'early', 'ontime'
   */
  determineLateType(timeDifference) {
    if (timeDifference > 0) return "late";
    if (timeDifference < 0) return "early";
    return "ontime";
  }

  /**
   * Tạo key từ string
   * @param {string} str - Chuỗi gốc
   * @returns {string} Key đã chuẩn hóa
   */
  generateKey(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }

  /**
   * Lấy dữ liệu đã chuẩn hóa
   * @param {string} type - Loại dữ liệu
   * @returns {Array} Dữ liệu đã chuẩn hóa
   */
  getNormalizedData(type) {
    return this.normalizedData.get(type) || [];
  }

  /**
   * Lấy tất cả dữ liệu đã chuẩn hóa
   * @returns {Map} Map chứa tất cả dữ liệu
   */
  getAllNormalizedData() {
    return this.normalizedData;
  }

  /**
   * Làm sạch dữ liệu
   */
  clear() {
    this.rawData.clear();
    this.normalizedData.clear();
  }
}

// Tạo instance global
window.DataSelector = new DataSelector();
