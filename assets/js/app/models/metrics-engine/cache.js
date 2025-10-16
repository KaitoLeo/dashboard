/**
 * Metrics Engine - Cache System
 * Memoize kết quả theo dataset + filter + timerange
 */

class MetricsCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 300000; // 5 phút
  }

  /**
   * Tạo cache key từ parameters
   * @param {string} metricType - Loại metric
   * @param {Object} filters - Bộ lọc
   * @param {string} dataHash - Hash của dữ liệu
   * @returns {string} Cache key
   */
  generateCacheKey(metricType, filters, dataHash) {
    const filterStr = JSON.stringify(filters);
    return `${metricType}_${dataHash}_${btoa(filterStr)}`;
  }

  /**
   * Tạo hash cho dữ liệu
   * @param {Array} data - Dữ liệu
   * @returns {string} Hash của dữ liệu
   */
  generateDataHash(data) {
    if (!data || data.length === 0) return "empty";

    // Tạo hash đơn giản từ length và một số field quan trọng
    const sample = data.slice(0, 10); // Lấy 10 phần tử đầu
    const hashData = {
      length: data.length,
      sample: sample.map((item) => ({
        id: item.id,
        timeDifference: item.timeDifference,
        department: item.department,
        location: item.location,
      })),
    };

    return btoa(JSON.stringify(hashData)).substring(0, 16);
  }

  /**
   * Lấy dữ liệu từ cache
   * @param {string} metricType - Loại metric
   * @param {Object} filters - Bộ lọc
   * @param {Array} data - Dữ liệu
   * @returns {Object|null} Kết quả từ cache hoặc null
   */
  get(metricType, filters, data) {
    const dataHash = this.generateDataHash(data);
    const key = this.generateCacheKey(metricType, filters, dataHash);

    const entry = this.cache.get(key);
    if (!entry) return null;

    // Kiểm tra TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Lưu dữ liệu vào cache
   * @param {string} metricType - Loại metric
   * @param {Object} filters - Bộ lọc
   * @param {Array} data - Dữ liệu
   * @param {Object} result - Kết quả tính toán
   * @param {number} ttl - Thời gian sống (ms)
   */
  set(metricType, filters, data, result, ttl = this.defaultTTL) {
    const dataHash = this.generateDataHash(data);
    const key = this.generateCacheKey(metricType, filters, dataHash);

    const entry = {
      data: result,
      timestamp: Date.now(),
      ttl: ttl,
      dependencies: this.extractDependencies(filters),
    };

    this.cache.set(key, entry);
  }

  /**
   * Trích xuất dependencies từ filters
   * @param {Object} filters - Bộ lọc
   * @returns {Array} Danh sách dependencies
   */
  extractDependencies(filters) {
    const deps = [];

    if (filters.location) deps.push(`location:${filters.location}`);
    if (filters.department) deps.push(`department:${filters.department}`);
    if (filters.lateType) deps.push(`lateType:${filters.lateType}`);
    if (filters.dateRange)
      deps.push(
        `dateRange:${filters.dateRange.start}-${filters.dateRange.end}`
      );
    if (filters.search) deps.push(`search:${filters.search.query}`);

    return deps;
  }

  /**
   * Xóa cache theo dependencies
   * @param {Array} dependencies - Danh sách dependencies
   */
  invalidateByDependencies(dependencies) {
    const keysToDelete = [];

    for (const [key, entry] of this.cache.entries()) {
      if (dependencies.some((dep) => entry.dependencies.includes(dep))) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Xóa tất cả cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Lấy thống kê cache
   * @returns {Object} Thống kê cache
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Ước tính memory usage
   * @returns {string} Memory usage đã format
   */
  estimateMemoryUsage() {
    let totalSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2; // Unicode characters
      totalSize += JSON.stringify(entry).length * 2;
    }

    if (totalSize < 1024) return `${totalSize} B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Dọn dẹp cache (xóa các entry đã hết hạn)
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));

    return keysToDelete.length;
  }
}

// Tạo instance global
window.MetricsCache = new MetricsCache();
