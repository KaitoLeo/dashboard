/**
 * Metrics Engine - Test Suite
 * Kiểm tra đồng bộ dữ liệu và tính chính xác của metrics
 */

class MetricsEngineTest {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  /**
   * Chạy tất cả tests
   */
  async runAllTests() {
    console.log("🧪 Starting Metrics Engine Tests...");

    try {
      // Test 1: Khởi tạo Metrics Engine
      await this.testInitialization();

      // Test 2: Tính toán metrics cơ bản
      await this.testBasicMetrics();

      // Test 3: Đồng bộ dữ liệu
      await this.testDataSynchronization();

      // Test 4: Cache system
      await this.testCacheSystem();

      // Test 5: Filter system
      await this.testFilterSystem();

      // Test 6: Data consistency
      await this.testDataConsistency();

      // Hiển thị kết quả
      this.displayResults();
    } catch (error) {
      console.error("❌ Test suite failed:", error);
    }
  }

  /**
   * Test khởi tạo Metrics Engine
   */
  async testInitialization() {
    console.log("🔧 Testing initialization...");

    try {
      // Kiểm tra Metrics Engine có tồn tại không
      if (typeof window.MetricsEngine === "undefined") {
        throw new Error("MetricsEngine not found");
      }

      // Kiểm tra các component có tồn tại không
      const requiredComponents = [
        "DataSelector",
        "MetricsCompute",
        "MetricsCache",
        "DataSynchronizer",
      ];

      for (const component of requiredComponents) {
        if (typeof window[component] === "undefined") {
          throw new Error(`${component} not found`);
        }
      }

      this.addTestResult(
        "Initialization",
        true,
        "All components loaded successfully"
      );
    } catch (error) {
      this.addTestResult("Initialization", false, error.message);
    }
  }

  /**
   * Test tính toán metrics cơ bản
   */
  async testBasicMetrics() {
    console.log("📊 Testing basic metrics calculation...");

    try {
      // Tạo dữ liệu test
      const testData = [
        {
          id: "test_1",
          memberId: "HV001",
          memberName: "Test User 1",
          location: "Test Location",
          department: "Test Department",
          checkinTime: "08:15",
          requiredTime: "08:00",
          timeDifference: 15,
          lateType: "late",
        },
        {
          id: "test_2",
          memberId: "HV002",
          memberName: "Test User 2",
          location: "Test Location",
          department: "Test Department",
          checkinTime: "07:45",
          requiredTime: "08:00",
          timeDifference: -15,
          lateType: "early",
        },
        {
          id: "test_3",
          memberId: "HV003",
          memberName: "Test User 3",
          location: "Test Location",
          department: "Test Department",
          checkinTime: "08:00",
          requiredTime: "08:00",
          timeDifference: 0,
          lateType: "ontime",
        },
      ];

      // Khởi tạo với dữ liệu test
      await window.MetricsEngine.initialize({ checkins: testData });

      // Test tổng check-in
      const totalCheckins = window.MetricsEngine.getMetric("totalCheckins");
      if (totalCheckins.value !== 3) {
        throw new Error(
          `Expected 3 total checkins, got ${totalCheckins.value}`
        );
      }

      // Test check-in muộn
      const lateCheckins = window.MetricsEngine.getMetric("lateCheckins");
      if (lateCheckins.value !== 1) {
        throw new Error(`Expected 1 late checkin, got ${lateCheckins.value}`);
      }

      // Test check-in sớm
      const earlyCheckins = window.MetricsEngine.getMetric("earlyCheckins");
      if (earlyCheckins.value !== 1) {
        throw new Error(`Expected 1 early checkin, got ${earlyCheckins.value}`);
      }

      // Test check-in đúng giờ
      const ontimeCheckins = window.MetricsEngine.getMetric("ontimeCheckins");
      if (ontimeCheckins.value !== 1) {
        throw new Error(
          `Expected 1 ontime checkin, got ${ontimeCheckins.value}`
        );
      }

      this.addTestResult(
        "Basic Metrics",
        true,
        "All basic metrics calculated correctly"
      );
    } catch (error) {
      this.addTestResult("Basic Metrics", false, error.message);
    }
  }

  /**
   * Test đồng bộ dữ liệu
   */
  async testDataSynchronization() {
    console.log("🔄 Testing data synchronization...");

    try {
      // Kiểm tra DataSynchronizer có hoạt động không
      const syncStatus = window.DataSynchronizer.getSyncStatus();
      if (!syncStatus.isRunning) {
        throw new Error("DataSynchronizer not running");
      }

      // Test force sync
      window.DataSynchronizer.forceSync();

      // Kiểm tra sync status sau khi force sync
      const newSyncStatus = window.DataSynchronizer.getSyncStatus();
      if (!newSyncStatus.lastSyncTime) {
        throw new Error("Sync not executed");
      }

      this.addTestResult(
        "Data Synchronization",
        true,
        "Data synchronization working correctly"
      );
    } catch (error) {
      this.addTestResult("Data Synchronization", false, error.message);
    }
  }

  /**
   * Test cache system
   */
  async testCacheSystem() {
    console.log("💾 Testing cache system...");

    try {
      // Lấy cache stats
      const cacheStats = window.MetricsCache.getStats();
      if (cacheStats.totalEntries === 0) {
        throw new Error("Cache is empty");
      }

      // Test cache cleanup
      const cleanedCount = window.MetricsCache.cleanup();
      console.log(`Cleaned ${cleanedCount} expired cache entries`);

      this.addTestResult(
        "Cache System",
        true,
        "Cache system working correctly"
      );
    } catch (error) {
      this.addTestResult("Cache System", false, error.message);
    }
  }

  /**
   * Test filter system
   */
  async testFilterSystem() {
    console.log("🔍 Testing filter system...");

    try {
      // Test cập nhật filter
      const originalFilters = window.MetricsEngine.getCurrentFilters();

      // Cập nhật filter mới
      window.MetricsEngine.updateFilters({
        location: "test-location",
        department: "test-department",
      });

      // Kiểm tra filter đã được cập nhật
      const newFilters = window.MetricsEngine.getCurrentFilters();
      if (newFilters.location !== "test-location") {
        throw new Error("Location filter not updated");
      }

      if (newFilters.department !== "test-department") {
        throw new Error("Department filter not updated");
      }

      // Khôi phục filter gốc
      window.MetricsEngine.updateFilters(originalFilters);

      this.addTestResult(
        "Filter System",
        true,
        "Filter system working correctly"
      );
    } catch (error) {
      this.addTestResult("Filter System", false, error.message);
    }
  }

  /**
   * Test tính nhất quán dữ liệu
   */
  async testDataConsistency() {
    console.log("✅ Testing data consistency...");

    try {
      // Lấy metrics từ engine
      const totalCheckins = window.MetricsEngine.getMetric("totalCheckins");
      const lateCheckins = window.MetricsEngine.getMetric("lateCheckins");
      const earlyCheckins = window.MetricsEngine.getMetric("earlyCheckins");
      const ontimeCheckins = window.MetricsEngine.getMetric("ontimeCheckins");

      // Kiểm tra tính nhất quán
      const calculatedTotal =
        lateCheckins.value + earlyCheckins.value + ontimeCheckins.value;
      if (totalCheckins.value !== calculatedTotal) {
        throw new Error(
          `Data inconsistency: total=${totalCheckins.value}, calculated=${calculatedTotal}`
        );
      }

      // Kiểm tra tỷ lệ check-in muộn
      const lateRate = window.MetricsEngine.getMetric("lateCheckinRate");
      const expectedRate =
        totalCheckins.value > 0
          ? (lateCheckins.value / totalCheckins.value) * 100
          : 0;
      if (Math.abs(lateRate.value - expectedRate) > 0.01) {
        throw new Error(
          `Rate calculation error: expected=${expectedRate}, got=${lateRate.value}`
        );
      }

      this.addTestResult("Data Consistency", true, "Data consistency verified");
    } catch (error) {
      this.addTestResult("Data Consistency", false, error.message);
    }
  }

  /**
   * Thêm kết quả test
   */
  addTestResult(testName, passed, message) {
    const result = {
      testName,
      passed,
      message,
      timestamp: new Date().toISOString(),
    };

    this.testResults.push(result);

    if (passed) {
      this.passedTests++;
      console.log(`✅ ${testName}: ${message}`);
    } else {
      this.failedTests++;
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  /**
   * Hiển thị kết quả test
   */
  displayResults() {
    console.log("\n📋 Test Results Summary:");
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`📊 Total: ${this.testResults.length}`);

    if (this.failedTests > 0) {
      console.log("\n❌ Failed Tests:");
      this.testResults
        .filter((result) => !result.passed)
        .forEach((result) => {
          console.log(`  - ${result.testName}: ${result.message}`);
        });
    }

    // Hiển thị system stats
    console.log("\n🔧 System Stats:");
    console.log(JSON.stringify(window.MetricsEngine.getSystemStats(), null, 2));

    console.log("\n🔄 Sync Stats:");
    console.log(
      JSON.stringify(window.DataSynchronizer.getSyncStatus(), null, 2)
    );

    console.log("\n💾 Cache Stats:");
    console.log(JSON.stringify(window.MetricsCache.getStats(), null, 2));
  }
}

// Tạo instance global
window.MetricsEngineTest = new MetricsEngineTest();

// Tự động chạy tests khi trang load (chỉ trong development)
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  document.addEventListener("DOMContentLoaded", function () {
    // Chờ metrics engine khởi tạo xong
    setTimeout(() => {
      window.MetricsEngineTest.runAllTests();
    }, 2000);
  });
}
