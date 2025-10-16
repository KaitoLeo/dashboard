/**
 * Metrics Engine - Main Entry Point
 * Quản lý toàn bộ hệ thống metrics và đảm bảo đồng bộ dữ liệu
 */

class MetricsEngine {
  constructor() {
    this.globalFilterState = { ...MetricsTypes.GlobalFilterState };
    this.metricsState = new Map();
    this.dataSelector = window.DataSelector;
    this.compute = window.MetricsCompute;
    this.cache = window.MetricsCache;
    this.listeners = new Map();
    this.isInitialized = false;
  }

  /**
   * Khởi tạo metrics engine
   * @param {Object} initialData - Dữ liệu ban đầu
   */
  async initialize(initialData = {}) {
    try {
      // Thêm dữ liệu vào selector
      if (initialData.checkins) {
        this.dataSelector.addRawData(
          MetricsTypes.RawDataTypes.CHECKIN,
          initialData.checkins
        );
      }

      // Khởi tạo global filter state từ URL
      this.loadFiltersFromURL();

      // Tính toán metrics ban đầu
      await this.computeAllMetrics();

      this.isInitialized = true;
      this.notifyListeners("initialized");

      console.log("Metrics Engine initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Metrics Engine:", error);
      throw error;
    }
  }

  /**
   * Tính toán tất cả metrics
   */
  async computeAllMetrics() {
    const checkinData = this.dataSelector.getNormalizedData(
      MetricsTypes.RawDataTypes.CHECKIN
    );
    const filters = this.getCurrentFilters();

    // Danh sách các metrics cần tính
    const metricsToCompute = [
      "totalCheckins",
      "lateCheckins",
      "earlyCheckins",
      "ontimeCheckins",
      "lateCheckinRate",
      "checkinsByDepartment",
      "checkinsByLocation",
      "lateCheckinStatistics",
    ];

    // Tính toán từng metric
    for (const metricType of metricsToCompute) {
      try {
        const result = await this.computeMetric(
          metricType,
          checkinData,
          filters
        );
        this.metricsState.set(metricType, result);
      } catch (error) {
        console.error(`Failed to compute metric ${metricType}:`, error);
        // Đặt giá trị mặc định
        this.metricsState.set(metricType, {
          value: 0,
          type: MetricsTypes.MetricTypes.COUNT,
          label: metricType,
          description: "",
          formattedValue: "0",
          rawData: [],
        });
      }
    }

    this.notifyListeners("metricsUpdated");
  }

  /**
   * Tính toán một metric cụ thể
   * @param {string} metricType - Loại metric
   * @param {Array} data - Dữ liệu
   * @param {Object} filters - Bộ lọc
   * @returns {Object} Kết quả metric
   */
  async computeMetric(metricType, data, filters) {
    // Kiểm tra cache trước
    const cachedResult = this.cache.get(metricType, filters, data);
    if (cachedResult) {
      return cachedResult;
    }

    // Tính toán metric
    let result;
    switch (metricType) {
      case "totalCheckins":
        result = this.compute.computeTotalCheckins(data, filters);
        break;
      case "lateCheckins":
        result = this.compute.computeLateCheckins(data, filters);
        break;
      case "earlyCheckins":
        result = this.compute.computeEarlyCheckins(data, filters);
        break;
      case "ontimeCheckins":
        result = this.compute.computeOntimeCheckins(data, filters);
        break;
      case "lateCheckinRate":
        result = this.compute.computeLateCheckinRate(data, filters);
        break;
      case "checkinsByDepartment":
        result = this.compute.computeCheckinsByDepartment(data, filters);
        break;
      case "checkinsByLocation":
        result = this.compute.computeCheckinsByLocation(data, filters);
        break;
      case "lateCheckinStatistics":
        result = this.compute.computeLateCheckinStatistics(data, filters);
        break;
      default:
        throw new Error(`Unknown metric type: ${metricType}`);
    }

    // Lưu vào cache
    this.cache.set(metricType, filters, data, result);

    return result;
  }

  /**
   * Cập nhật global filter state
   * @param {Object} newFilters - Bộ lọc mới
   */
  updateFilters(newFilters) {
    const oldFilters = { ...this.globalFilterState };
    this.globalFilterState = { ...this.globalFilterState, ...newFilters };

    // Cập nhật URL
    this.updateURLFromFilters();

    // Tính lại metrics
    this.computeAllMetrics();

    this.notifyListeners("filtersUpdated", {
      oldFilters,
      newFilters: this.globalFilterState,
    });
  }

  /**
   * Lấy bộ lọc hiện tại
   * @returns {Object} Bộ lọc hiện tại
   */
  getCurrentFilters() {
    return {
      location: this.globalFilterState.location.selected,
      department: this.globalFilterState.department.selected,
      lateType: this.globalFilterState.status.selected,
      dateRange: this.globalFilterState.dateRange,
      search: this.globalFilterState.search,
    };
  }

  /**
   * Lấy metric theo loại
   * @param {string} metricType - Loại metric
   * @returns {Object} Kết quả metric
   */
  getMetric(metricType) {
    return (
      this.metricsState.get(metricType) || {
        value: 0,
        type: MetricsTypes.MetricTypes.COUNT,
        label: metricType,
        description: "",
        formattedValue: "0",
        rawData: [],
      }
    );
  }

  /**
   * Lấy tất cả metrics
   * @returns {Map} Tất cả metrics
   */
  getAllMetrics() {
    return this.metricsState;
  }

  /**
   * Lấy dữ liệu đã lọc
   * @param {string} dataType - Loại dữ liệu
   * @returns {Array} Dữ liệu đã lọc
   */
  getFilteredData(dataType) {
    const data = this.dataSelector.getNormalizedData(dataType);
    const filters = this.getCurrentFilters();
    return this.compute.applyFilters(data, filters);
  }

  /**
   * Load filters từ URL
   */
  loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("location")) {
      this.globalFilterState.location.selected = urlParams.get("location");
    }

    if (urlParams.get("department")) {
      this.globalFilterState.department.selected = urlParams.get("department");
    }

    if (urlParams.get("lateType")) {
      this.globalFilterState.status.selected = urlParams.get("lateType");
    }

    if (urlParams.get("startDate") && urlParams.get("endDate")) {
      this.globalFilterState.dateRange = {
        start: urlParams.get("startDate"),
        end: urlParams.get("endDate"),
        type: "custom",
      };
    }

    if (urlParams.get("search")) {
      this.globalFilterState.search.query = urlParams.get("search");
    }
  }

  /**
   * Cập nhật URL từ filters
   */
  updateURLFromFilters() {
    const url = new URL(window.location);
    const params = url.searchParams;

    // Xóa tất cả params cũ
    params.delete("location");
    params.delete("department");
    params.delete("lateType");
    params.delete("startDate");
    params.delete("endDate");
    params.delete("search");

    // Thêm params mới
    if (this.globalFilterState.location.selected !== "all") {
      params.set("location", this.globalFilterState.location.selected);
    }

    if (this.globalFilterState.department.selected !== "all") {
      params.set("department", this.globalFilterState.department.selected);
    }

    if (this.globalFilterState.status.selected !== "all") {
      params.set("lateType", this.globalFilterState.status.selected);
    }

    if (
      this.globalFilterState.dateRange.start &&
      this.globalFilterState.dateRange.end
    ) {
      params.set("startDate", this.globalFilterState.dateRange.start);
      params.set("endDate", this.globalFilterState.dateRange.end);
    }

    if (this.globalFilterState.search.query) {
      params.set("search", this.globalFilterState.search.query);
    }

    // Cập nhật URL
    window.history.replaceState({}, "", url.toString());
  }

  /**
   * Thêm listener
   * @param {string} event - Tên event
   * @param {Function} callback - Callback function
   */
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Xóa listener
   * @param {string} event - Tên event
   * @param {Function} callback - Callback function
   */
  removeListener(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Thông báo cho listeners
   * @param {string} event - Tên event
   * @param {Object} data - Dữ liệu
   */
  notifyListeners(event, data = {}) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in listener for event ${event}:`, error);
      }
    });
  }

  /**
   * Làm sạch tất cả
   */
  cleanup() {
    this.metricsState.clear();
    this.cache.clear();
    this.dataSelector.clear();
    this.listeners.clear();
    this.isInitialized = false;
  }

  /**
   * Lấy thống kê hệ thống
   * @returns {Object} Thống kê hệ thống
   */
  getSystemStats() {
    return {
      isInitialized: this.isInitialized,
      metricsCount: this.metricsState.size,
      cacheStats: this.cache.getStats(),
      listenersCount: Array.from(this.listeners.values()).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
    };
  }
}

// Tạo instance global
window.MetricsEngine = new MetricsEngine();

// Export cho sử dụng
window.MetricsEngineInstance = window.MetricsEngine;
