/**
 * Performance Monitor
 * Giám sát hiệu suất của hệ thống metrics và tối ưu hóa
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      calculationTime: [],
      memoryUsage: [],
      errorCount: 0,
      successCount: 0,
      lastUpdate: null,
    };
    this.thresholds = {
      maxCalculationTime: 1000, // 1 giây
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      maxErrorRate: 0.05, // 5%
    };
    this.optimizations = {
      cacheEnabled: true,
      batchProcessing: true,
      lazyLoading: true,
    };
  }

  /**
   * Bắt đầu giám sát hiệu suất
   */
  startMonitoring() {
    console.log("Performance monitoring started");

    // Giám sát memory usage
    this.monitorMemoryUsage();

    // Giám sát calculation performance
    this.monitorCalculationPerformance();

    // Giám sát error rates
    this.monitorErrorRates();
  }

  /**
   * Giám sát memory usage
   */
  monitorMemoryUsage() {
    if (performance.memory) {
      const memoryInfo = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };

      this.metrics.memoryUsage.push(memoryInfo);

      // Giữ lại chỉ 100 records gần nhất
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage.shift();
      }

      // Kiểm tra threshold
      if (memoryInfo.used > this.thresholds.maxMemoryUsage) {
        this.handleMemoryWarning(memoryInfo);
      }
    }
  }

  /**
   * Giám sát calculation performance
   */
  monitorCalculationPerformance() {
    const startTime = performance.now();

    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.metrics.calculationTime.push({
          duration,
          timestamp: Date.now(),
        });

        // Giữ lại chỉ 100 records gần nhất
        if (this.metrics.calculationTime.length > 100) {
          this.metrics.calculationTime.shift();
        }

        // Kiểm tra threshold
        if (duration > this.thresholds.maxCalculationTime) {
          this.handlePerformanceWarning(duration);
        }

        return duration;
      },
    };
  }

  /**
   * Giám sát error rates
   */
  monitorErrorRates() {
    const totalRequests = this.metrics.successCount + this.metrics.errorCount;
    if (totalRequests > 0) {
      const errorRate = this.metrics.errorCount / totalRequests;

      if (errorRate > this.thresholds.maxErrorRate) {
        this.handleErrorRateWarning(errorRate);
      }
    }
  }

  /**
   * Ghi nhận thành công
   */
  recordSuccess() {
    this.metrics.successCount++;
    this.metrics.lastUpdate = Date.now();
  }

  /**
   * Ghi nhận lỗi
   */
  recordError(error) {
    this.metrics.errorCount++;
    this.metrics.lastUpdate = Date.now();

    console.error("Performance Monitor - Error recorded:", error);

    // Gửi error report nếu cần
    this.reportError(error);
  }

  /**
   * Xử lý memory warning
   */
  handleMemoryWarning(memoryInfo) {
    console.warn("Memory usage exceeded threshold:", {
      used: this.formatBytes(memoryInfo.used),
      limit: this.formatBytes(this.thresholds.maxMemoryUsage),
      percentage:
        ((memoryInfo.used / this.thresholds.maxMemoryUsage) * 100).toFixed(2) +
        "%",
    });

    // Thực hiện garbage collection nếu có thể
    if (window.gc) {
      window.gc();
    }

    // Clear cache nếu cần
    if (window.comprehensiveCalculations) {
      window.comprehensiveCalculations.clearCache();
    }
  }

  /**
   * Xử lý performance warning
   */
  handlePerformanceWarning(duration) {
    console.warn("Calculation time exceeded threshold:", {
      duration: duration.toFixed(2) + "ms",
      threshold: this.thresholds.maxCalculationTime + "ms",
    });

    // Đề xuất tối ưu hóa
    this.suggestOptimizations();
  }

  /**
   * Xử lý error rate warning
   */
  handleErrorRateWarning(errorRate) {
    console.warn("Error rate exceeded threshold:", {
      errorRate: (errorRate * 100).toFixed(2) + "%",
      threshold: this.thresholds.maxErrorRate * 100 + "%",
    });
  }

  /**
   * Đề xuất tối ưu hóa
   */
  suggestOptimizations() {
    const suggestions = [];

    // Kiểm tra cache
    if (!this.optimizations.cacheEnabled) {
      suggestions.push("Enable caching for better performance");
    }

    // Kiểm tra batch processing
    if (!this.optimizations.batchProcessing) {
      suggestions.push("Enable batch processing for multiple calculations");
    }

    // Kiểm tra lazy loading
    if (!this.optimizations.lazyLoading) {
      suggestions.push("Enable lazy loading for non-critical metrics");
    }

    if (suggestions.length > 0) {
      console.log("Performance optimization suggestions:", suggestions);
    }
  }

  /**
   * Báo cáo lỗi
   */
  reportError(error) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error.message || error,
      stack: error.stack,
      metrics: this.getCurrentMetrics(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Trong thực tế, gửi error report đến server
    console.log("Error report:", errorReport);
  }

  /**
   * Lấy metrics hiện tại
   */
  getCurrentMetrics() {
    const avgCalculationTime = this.getAverageCalculationTime();
    const avgMemoryUsage = this.getAverageMemoryUsage();
    const errorRate = this.getErrorRate();

    return {
      avgCalculationTime: avgCalculationTime.toFixed(2) + "ms",
      avgMemoryUsage: this.formatBytes(avgMemoryUsage),
      errorRate: (errorRate * 100).toFixed(2) + "%",
      totalCalculations: this.metrics.successCount + this.metrics.errorCount,
      lastUpdate: this.metrics.lastUpdate
        ? new Date(this.metrics.lastUpdate).toISOString()
        : null,
    };
  }

  /**
   * Lấy thời gian tính toán trung bình
   */
  getAverageCalculationTime() {
    if (this.metrics.calculationTime.length === 0) return 0;

    const total = this.metrics.calculationTime.reduce(
      (sum, record) => sum + record.duration,
      0
    );
    return total / this.metrics.calculationTime.length;
  }

  /**
   * Lấy memory usage trung bình
   */
  getAverageMemoryUsage() {
    if (this.metrics.memoryUsage.length === 0) return 0;

    const total = this.metrics.memoryUsage.reduce(
      (sum, record) => sum + record.used,
      0
    );
    return total / this.metrics.memoryUsage.length;
  }

  /**
   * Lấy error rate
   */
  getErrorRate() {
    const total = this.metrics.successCount + this.metrics.errorCount;
    return total > 0 ? this.metrics.errorCount / total : 0;
  }

  /**
   * Format bytes
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Tối ưu hóa performance
   */
  optimizePerformance() {
    console.log("Starting performance optimization...");

    // Clear old metrics data
    this.clearOldMetrics();

    // Enable optimizations
    this.optimizations.cacheEnabled = true;
    this.optimizations.batchProcessing = true;
    this.optimizations.lazyLoading = true;

    // Clear caches
    if (window.comprehensiveCalculations) {
      window.comprehensiveCalculations.clearCache();
    }

    console.log("Performance optimization completed");
  }

  /**
   * Xóa metrics cũ
   */
  clearOldMetrics() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Xóa calculation time records cũ hơn 1 giờ
    this.metrics.calculationTime = this.metrics.calculationTime.filter(
      (record) => record.timestamp > oneHourAgo
    );

    // Xóa memory usage records cũ hơn 1 giờ
    this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
      (record) => record.timestamp > oneHourAgo
    );
  }

  /**
   * Lấy performance report
   */
  getPerformanceReport() {
    return {
      summary: this.getCurrentMetrics(),
      calculationTime: {
        average: this.getAverageCalculationTime(),
        max: Math.max(...this.metrics.calculationTime.map((r) => r.duration)),
        min: Math.min(...this.metrics.calculationTime.map((r) => r.duration)),
        count: this.metrics.calculationTime.length,
      },
      memoryUsage: {
        average: this.getAverageMemoryUsage(),
        max: Math.max(...this.metrics.memoryUsage.map((r) => r.used)),
        min: Math.min(...this.metrics.memoryUsage.map((r) => r.used)),
        count: this.metrics.memoryUsage.length,
      },
      errors: {
        count: this.metrics.errorCount,
        rate: this.getErrorRate(),
      },
      optimizations: this.optimizations,
      recommendations: this.getRecommendations(),
    };
  }

  /**
   * Lấy recommendations
   */
  getRecommendations() {
    const recommendations = [];
    const avgCalculationTime = this.getAverageCalculationTime();
    const errorRate = this.getErrorRate();

    if (avgCalculationTime > 500) {
      recommendations.push("Consider enabling more aggressive caching");
    }

    if (errorRate > 0.01) {
      recommendations.push("Review error handling and data validation");
    }

    if (this.metrics.memoryUsage.length > 0) {
      const avgMemory = this.getAverageMemoryUsage();
      if (avgMemory > 10 * 1024 * 1024) {
        // 10MB
        recommendations.push(
          "Consider implementing memory optimization strategies"
        );
      }
    }

    return recommendations;
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      calculationTime: [],
      memoryUsage: [],
      errorCount: 0,
      successCount: 0,
      lastUpdate: null,
    };

    console.log("Performance metrics reset");
  }
}

// Export cho sử dụng global
window.PerformanceMonitor = PerformanceMonitor;

// Tạo instance global
window.performanceMonitor = new PerformanceMonitor();

// Bắt đầu monitoring
window.performanceMonitor.startMonitoring();

console.log("Performance Monitor loaded successfully");




