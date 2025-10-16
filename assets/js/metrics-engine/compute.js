/**
 * Metrics Engine - Compute Functions
 * Tất cả công thức tính KPI (pure functions, không side effect)
 */

class MetricsCompute {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Tính tổng số check-in
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeTotalCheckins(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const value = filteredData.length;

    return {
      value,
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Tổng check-in",
      description: "Tổng số lượt check-in",
      formattedValue: this.formatNumber(value),
      rawData: filteredData,
    };
  }

  /**
   * Tính số check-in muộn
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeLateCheckins(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const lateData = filteredData.filter((item) => item.timeDifference > 0);
    const value = lateData.length;

    return {
      value,
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Check-in muộn",
      description: "Số lượt check-in muộn",
      formattedValue: this.formatNumber(value),
      rawData: lateData,
    };
  }

  /**
   * Tính số check-in sớm
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeEarlyCheckins(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const earlyData = filteredData.filter((item) => item.timeDifference < 0);
    const value = earlyData.length;

    return {
      value,
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Check-in sớm",
      description: "Số lượt check-in sớm",
      formattedValue: this.formatNumber(value),
      rawData: earlyData,
    };
  }

  /**
   * Tính số check-in đúng giờ
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeOntimeCheckins(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const ontimeData = filteredData.filter((item) => item.timeDifference === 0);
    const value = ontimeData.length;

    return {
      value,
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Check-in đúng giờ",
      description: "Số lượt check-in đúng giờ",
      formattedValue: this.formatNumber(value),
      rawData: ontimeData,
    };
  }

  /**
   * Tính tỷ lệ check-in muộn
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeLateCheckinRate(data, filters = {}) {
    const total = this.computeTotalCheckins(data, filters);
    const late = this.computeLateCheckins(data, filters);

    const value = total.value > 0 ? (late.value / total.value) * 100 : 0;

    return {
      value,
      type: MetricsTypes.MetricTypes.PERCENTAGE,
      label: "Tỷ lệ check-in muộn",
      description: "Phần trăm check-in muộn",
      formattedValue: this.formatPercentage(value),
      rawData: { total: total.rawData, late: late.rawData },
    };
  }

  /**
   * Tính số check-in theo bộ phận
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeCheckinsByDepartment(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const departmentCounts = {};

    filteredData.forEach((item) => {
      const dept = item.department || "Unknown";
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    return {
      value: departmentCounts,
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Check-in theo bộ phận",
      description: "Số lượt check-in theo từng bộ phận",
      formattedValue: this.formatDepartmentCounts(departmentCounts),
      rawData: filteredData,
    };
  }

  /**
   * Tính số check-in theo cơ sở
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeCheckinsByLocation(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const locationCounts = {};

    filteredData.forEach((item) => {
      const location = item.location || "Unknown";
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return {
      value: locationCounts,
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Check-in theo cơ sở",
      description: "Số lượt check-in theo từng cơ sở",
      formattedValue: this.formatLocationCounts(locationCounts),
      rawData: filteredData,
    };
  }

  /**
   * Tính thống kê check-in sai giờ theo cơ sở và bộ phận
   * @param {Array} data - Dữ liệu check-in đã chuẩn hóa
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  computeLateCheckinStatistics(data, filters = {}) {
    const filteredData = this.applyFilters(data, filters);
    const lateData = filteredData.filter((item) => item.timeDifference > 0);

    const statistics = {};
    const locations = [...new Set(lateData.map((item) => item.location))];
    const departments = [...new Set(lateData.map((item) => item.department))];

    // Khởi tạo ma trận thống kê
    locations.forEach((location) => {
      statistics[location] = {};
      departments.forEach((dept) => {
        statistics[location][dept] = 0;
      });
    });

    // Đếm số lượng
    lateData.forEach((item) => {
      if (
        statistics[item.location] &&
        statistics[item.location][item.department] !== undefined
      ) {
        statistics[item.location][item.department]++;
      }
    });

    // Tính tổng cộng
    const totals = {
      byLocation: {},
      byDepartment: {},
      grandTotal: 0,
    };

    locations.forEach((location) => {
      totals.byLocation[location] = departments.reduce(
        (sum, dept) => sum + (statistics[location][dept] || 0),
        0
      );
    });

    departments.forEach((dept) => {
      totals.byDepartment[dept] = locations.reduce(
        (sum, location) => sum + (statistics[location][dept] || 0),
        0
      );
    });

    totals.grandTotal = Object.values(totals.byLocation).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      value: {
        statistics,
        totals,
        locations,
        departments,
      },
      type: MetricsTypes.MetricTypes.COUNT,
      label: "Thống kê check-in sai giờ",
      description: "Thống kê chi tiết check-in sai giờ theo cơ sở và bộ phận",
      formattedValue: this.formatStatistics(statistics, totals),
      rawData: lateData,
    };
  }

  /**
   * Áp dụng bộ lọc lên dữ liệu
   * @param {Array} data - Dữ liệu gốc
   * @param {Object} filters - Bộ lọc
   * @returns {Array} Dữ liệu đã lọc
   */
  applyFilters(data, filters) {
    let filteredData = [...data];

    // Lọc theo cơ sở
    if (filters.location && filters.location !== "all") {
      filteredData = filteredData.filter(
        (item) =>
          item.locationKey === filters.location ||
          item.location === filters.location
      );
    }

    // Lọc theo bộ phận
    if (filters.department && filters.department !== "all") {
      filteredData = filteredData.filter(
        (item) =>
          item.departmentKey === filters.department ||
          item.department === filters.department
      );
    }

    // Lọc theo loại sai giờ
    if (filters.lateType && filters.lateType !== "all") {
      switch (filters.lateType) {
        case "late":
          filteredData = filteredData.filter((item) => item.timeDifference > 0);
          break;
        case "early":
          filteredData = filteredData.filter((item) => item.timeDifference < 0);
          break;
        case "ontime":
          filteredData = filteredData.filter(
            (item) => item.timeDifference === 0
          );
          break;
      }
    }

    // Lọc theo khoảng thời gian
    if (filters.dateRange) {
      filteredData = this.filterByDateRange(filteredData, filters.dateRange);
    }

    // Lọc theo tìm kiếm
    if (filters.search && filters.search.query) {
      filteredData = this.filterBySearch(filteredData, filters.search);
    }

    return filteredData;
  }

  /**
   * Lọc theo khoảng thời gian
   * @param {Array} data - Dữ liệu
   * @param {Object} dateRange - Khoảng thời gian
   * @returns {Array} Dữ liệu đã lọc
   */
  filterByDateRange(data, dateRange) {
    if (!dateRange.start || !dateRange.end) return data;

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    return data.filter((item) => {
      const itemDate = new Date(item.checkinTime);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  /**
   * Lọc theo tìm kiếm
   * @param {Array} data - Dữ liệu
   * @param {Object} search - Thông tin tìm kiếm
   * @returns {Array} Dữ liệu đã lọc
   */
  filterBySearch(data, search) {
    if (!search.query) return data;

    const query = search.query.toLowerCase();
    return data.filter((item) => {
      return search.fields.some((field) => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  }

  /**
   * Format số
   * @param {number} num - Số cần format
   * @returns {string} Số đã format
   */
  formatNumber(num) {
    return new Intl.NumberFormat("vi-VN").format(num);
  }

  /**
   * Format phần trăm
   * @param {number} num - Số cần format
   * @returns {string} Phần trăm đã format
   */
  formatPercentage(num) {
    return new Intl.NumberFormat("vi-VN", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num / 100);
  }

  /**
   * Format số lượng theo bộ phận
   * @param {Object} counts - Số lượng theo bộ phận
   * @returns {string} Chuỗi đã format
   */
  formatDepartmentCounts(counts) {
    return Object.entries(counts)
      .map(([dept, count]) => `${dept}: ${this.formatNumber(count)}`)
      .join(", ");
  }

  /**
   * Format số lượng theo cơ sở
   * @param {Object} counts - Số lượng theo cơ sở
   * @returns {string} Chuỗi đã format
   */
  formatLocationCounts(counts) {
    return Object.entries(counts)
      .map(([location, count]) => `${location}: ${this.formatNumber(count)}`)
      .join(", ");
  }

  /**
   * Format thống kê
   * @param {Object} statistics - Thống kê
   * @param {Object} totals - Tổng cộng
   * @returns {string} Chuỗi đã format
   */
  formatStatistics(statistics, totals) {
    return `Tổng cộng: ${this.formatNumber(totals.grandTotal)}`;
  }
}

// Tạo instance global
window.MetricsCompute = new MetricsCompute();
