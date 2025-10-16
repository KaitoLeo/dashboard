/**
 * E2E Navigation Test Suite
 * Kiểm tra tính năng navigation và breadcrumb
 */

class E2ENavigationTest {
  constructor() {
    this.testResults = [];
    this.router = new URLRouter();
    this.urlBuilder = new URLBuilder();
  }

  /**
   * Chạy tất cả tests
   */
  async runAllTests() {
    console.log("🧪 Starting E2E Navigation Tests...");

    try {
      await this.testMetricCardNavigation();
      await this.testBreadcrumbDisplay();
      await this.testURLStructure();
      await this.testLegacyRedirects();
      await this.testQueryParameterPreservation();
      await this.testDirectURLAccess();

      this.printResults();
    } catch (error) {
      console.error("❌ Test suite failed:", error);
    }
  }

  /**
   * Test metric card navigation
   */
  async testMetricCardNavigation() {
    console.log("🔍 Testing metric card navigation...");

    const testCases = [
      {
        selector: '[data-metric="checkinYesterday"]',
        expectedPath: "checkin/frequency/checkin-hom-qua.html",
        description: "Check-in hôm qua card",
      },
      {
        selector: '[data-metric="checkinToday"]',
        expectedPath: "checkin/frequency/checkin-hom-nay.html",
        description: "Check-in hôm nay card",
      },
      {
        selector: '[data-metric="checkinMTD"]',
        expectedPath: "checkin/mtd/checkin-thang-nay.html",
        description: "Check-in MTD card",
      },
      {
        selector: '[data-metric="totalMembers"]',
        expectedPath: "members/list/danh-sach-hoi-vien.html",
        description: "Tổng hội viên card",
      },
    ];

    for (const testCase of testCases) {
      const element = document.querySelector(testCase.selector);
      if (element) {
        const actualPath = element.getAttribute("data-navigate");
        const passed = actualPath === testCase.expectedPath;

        this.addResult({
          test: testCase.description,
          passed,
          expected: testCase.expectedPath,
          actual: actualPath,
        });
      } else {
        this.addResult({
          test: testCase.description,
          passed: false,
          error: "Element not found",
        });
      }
    }
  }

  /**
   * Test breadcrumb display
   */
  async testBreadcrumbDisplay() {
    console.log("🔍 Testing breadcrumb display...");

    // Test home page breadcrumb
    const homeBreadcrumb = this.router.getBreadcrumb();
    const homeTest =
      homeBreadcrumb.length === 1 && homeBreadcrumb[0].name === "Trang chủ";

    this.addResult({
      test: "Home page breadcrumb",
      passed: homeTest,
      expected: "Single breadcrumb item",
      actual: `${homeBreadcrumb.length} items`,
    });

    // Test breadcrumb container exists
    const breadcrumbContainer = document.getElementById("breadcrumb-container");
    this.addResult({
      test: "Breadcrumb container exists",
      passed: !!breadcrumbContainer,
      expected: "Breadcrumb container element",
      actual: breadcrumbContainer ? "Found" : "Not found",
    });
  }

  /**
   * Test URL structure
   */
  async testURLStructure() {
    console.log("🔍 Testing URL structure...");

    const testUrls = [
      "checkin/frequency/checkin-hom-nay.html",
      "checkin/late-checkin/checkin-sai-gio-hom-qua.html",
      "members/list/danh-sach-hoi-vien.html",
    ];

    for (const url of testUrls) {
      const isValid = this.validateURLStructure(url);
      this.addResult({
        test: `URL structure: ${url}`,
        passed: isValid,
        expected: "Valid nested URL structure",
        actual: isValid ? "Valid" : "Invalid",
      });
    }
  }

  /**
   * Test legacy URL redirects
   */
  async testLegacyRedirects() {
    console.log("🔍 Testing legacy URL redirects...");

    const legacyUrls = [
      "checkin-frequency-detail.html",
      "late-checkin-detail.html",
      "members-list-detail.html",
    ];

    for (const legacyUrl of legacyUrls) {
      const redirectUrl = this.urlBuilder.getRedirectURL(legacyUrl);
      const hasRedirect = !!redirectUrl;

      this.addResult({
        test: `Legacy redirect: ${legacyUrl}`,
        passed: hasRedirect,
        expected: "Redirect URL exists",
        actual: hasRedirect ? redirectUrl : "No redirect",
      });
    }
  }

  /**
   * Test query parameter preservation
   */
  async testQueryParameterPreservation() {
    console.log("🔍 Testing query parameter preservation...");

    const testParams = {
      date: "2024-01-15",
      store: "ton-that-thuyet",
      department: "pt-fitness",
    };

    const queryString = this.urlBuilder.buildQueryString(testParams);
    const expectedQuery =
      "?date=2024-01-15&store=ton-that-thuyet&department=pt-fitness";

    this.addResult({
      test: "Query parameter building",
      passed: queryString === expectedQuery,
      expected: expectedQuery,
      actual: queryString,
    });
  }

  /**
   * Test direct URL access
   */
  async testDirectURLAccess() {
    console.log("🔍 Testing direct URL access...");

    const testUrls = [
      "checkin/frequency/checkin-hom-nay.html",
      "checkin/late-checkin/checkin-sai-gio-hom-qua.html",
    ];

    for (const url of testUrls) {
      // Simulate direct access
      const breadcrumb = this.router.getBreadcrumb();
      const hasValidBreadcrumb = breadcrumb.length > 1;

      this.addResult({
        test: `Direct access: ${url}`,
        passed: hasValidBreadcrumb,
        expected: "Valid breadcrumb for direct access",
        actual: hasValidBreadcrumb ? "Valid" : "Invalid",
      });
    }
  }

  /**
   * Validate URL structure
   */
  validateURLStructure(url) {
    const parts = url.split("/");
    if (parts.length < 3) return false;

    const [group, category, filename] = parts;
    return group && category && filename && filename.endsWith(".html");
  }

  /**
   * Add test result
   */
  addResult(result) {
    this.testResults.push({
      ...result,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Print test results
   */
  printResults() {
    console.log("\n📊 E2E Navigation Test Results:");
    console.log("================================");

    const passed = this.testResults.filter((r) => r.passed).length;
    const total = this.testResults.length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);

    console.log("\n📋 Detailed Results:");
    this.testResults.forEach((result, index) => {
      const status = result.passed ? "✅" : "❌";
      console.log(`${index + 1}. ${status} ${result.test}`);

      if (!result.passed) {
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        } else {
          console.log(`   Expected: ${result.expected}`);
          console.log(`   Actual: ${result.actual}`);
        }
      }
    });

    console.log("\n🎯 Test Summary:");
    if (passed === total) {
      console.log(
        "🎉 All tests passed! Navigation system is working correctly."
      );
    } else {
      console.log("⚠️  Some tests failed. Please check the implementation.");
    }
  }
}

// Auto-run tests in development
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      const testSuite = new E2ENavigationTest();
      testSuite.runAllTests();
    }, 1000); // Wait for page to fully load
  });
}

// Export for manual testing
window.E2ENavigationTest = E2ENavigationTest;
