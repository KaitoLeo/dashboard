/**
 * Breadcrumb Tests
 * Test suite cho buildBreadcrumbs function
 */

class BreadcrumbTests {
  constructor() {
    this.testResults = [];
    this.breadcrumb = new HeaderBreadcrumbs();
  }

  /**
   * Chạy tất cả tests
   */
  async runAllTests() {
    console.log("🧪 Starting Breadcrumb Tests...");

    try {
      await this.testBasicBreadcrumb();
      await this.testSmartTruncate();
      await this.testMissingMeta();
      await this.testSlugToTitle();
      await this.testEdgeCases();
      await this.testAccessibility();

      this.printResults();
    } catch (error) {
      console.error("❌ Test suite failed:", error);
    }
  }

  /**
   * Test basic breadcrumb functionality
   */
  async testBasicBreadcrumb() {
    console.log("🔍 Testing basic breadcrumb...");

    // Mock URL for testing
    const originalLocation = window.location;
    delete window.location;
    window.location = { pathname: "/checkin/frequency/checkin-hom-nay.html" };

    const breadcrumbs = this.breadcrumb.buildBreadcrumbs();

    this.addResult({
      test: "Basic breadcrumb structure",
      passed: breadcrumbs.length === 4,
      expected: "4 breadcrumb items",
      actual: `${breadcrumbs.length} items`,
    });

    this.addResult({
      test: "Home page included",
      passed: breadcrumbs[0].name === "Trang chủ",
      expected: "Trang chủ",
      actual: breadcrumbs[0].name,
    });

    this.addResult({
      test: "Last item not clickable",
      passed: !breadcrumbs[breadcrumbs.length - 1].isLink,
      expected: "Last item not clickable",
      actual: breadcrumbs[breadcrumbs.length - 1].isLink
        ? "Clickable"
        : "Not clickable",
    });

    // Restore original location
    window.location = originalLocation;
  }

  /**
   * Test smart truncate functionality
   */
  async testSmartTruncate() {
    console.log("🔍 Testing smart truncate...");

    // Create a long breadcrumb array
    const longBreadcrumbs = [
      { name: "Trang chủ", path: "index.html", isLink: true, level: 0 },
      { name: "Check-in", path: "checkin", isLink: true, level: 1 },
      { name: "Tần suất", path: "checkin/frequency", isLink: true, level: 2 },
      {
        name: "Chi tiết",
        path: "checkin/frequency/detail",
        isLink: true,
        level: 3,
      },
      {
        name: "Phân tích",
        path: "checkin/frequency/analysis",
        isLink: true,
        level: 4,
      },
      {
        name: "Báo cáo",
        path: "checkin/frequency/report",
        isLink: true,
        level: 5,
      },
      {
        name: "Xuất file",
        path: "checkin/frequency/export",
        isLink: false,
        level: 6,
      },
    ];

    const truncated = this.breadcrumb.smartTruncate(longBreadcrumbs);

    this.addResult({
      test: "Smart truncate length",
      passed: truncated.length === 5,
      expected: "5 items (Home + ... + last 3)",
      actual: `${truncated.length} items`,
    });

    this.addResult({
      test: "Ellipsis included",
      passed: truncated[1].name === "...",
      expected: "Ellipsis item",
      actual: truncated[1].name,
    });

    this.addResult({
      test: "Last 3 items preserved",
      passed: truncated
        .slice(-3)
        .every(
          (item, index) => item.name === longBreadcrumbs.slice(-3)[index].name
        ),
      expected: "Last 3 items preserved",
      actual: "Last 3 items preserved",
    });
  }

  /**
   * Test missing meta fallback
   */
  async testMissingMeta() {
    console.log("🔍 Testing missing meta fallback...");

    // Test slug to title conversion
    const testCases = [
      { slug: "checkin-hom-nay", expected: "Checkin Hom Nay" },
      { slug: "pt-fitness-detail", expected: "Pt Fitness Detail" },
      { slug: "late-checkin-mtd", expected: "Late Checkin Mtd" },
    ];

    testCases.forEach((testCase) => {
      const result = this.breadcrumb.slugToTitle(testCase.slug);
      this.addResult({
        test: `Slug to title: ${testCase.slug}`,
        passed: result === testCase.expected,
        expected: testCase.expected,
        actual: result,
      });
    });
  }

  /**
   * Test slug to title conversion
   */
  async testSlugToTitle() {
    console.log("🔍 Testing slug to title conversion...");

    const testCases = [
      { input: "checkin-hom-nay", expected: "Checkin Hom Nay" },
      { input: "pt-fitness-detail", expected: "Pt Fitness Detail" },
      { input: "late-checkin-mtd", expected: "Late Checkin Mtd" },
      { input: "membership-list", expected: "Membership List" },
      { input: "swimming-coach-analysis", expected: "Swimming Coach Analysis" },
    ];

    testCases.forEach((testCase) => {
      const result = this.breadcrumb.slugToTitle(testCase.input);
      this.addResult({
        test: `Slug conversion: ${testCase.input}`,
        passed: result === testCase.expected,
        expected: testCase.expected,
        actual: result,
      });
    });
  }

  /**
   * Test edge cases
   */
  async testEdgeCases() {
    console.log("🔍 Testing edge cases...");

    // Test empty path
    const originalLocation = window.location;
    delete window.location;
    window.location = { pathname: "/" };

    const emptyBreadcrumbs = this.breadcrumb.buildBreadcrumbs();
    this.addResult({
      test: "Empty path breadcrumb",
      passed: emptyBreadcrumbs.length === 1,
      expected: "1 item (Home only)",
      actual: `${emptyBreadcrumbs.length} items`,
    });

    // Test single level
    window.location = { pathname: "/checkin" };
    const singleLevelBreadcrumbs = this.breadcrumb.buildBreadcrumbs();
    this.addResult({
      test: "Single level breadcrumb",
      passed: singleLevelBreadcrumbs.length === 2,
      expected: "2 items (Home + Check-in)",
      actual: `${singleLevelBreadcrumbs.length} items`,
    });

    // Test unknown path
    window.location = { pathname: "/unknown/path/page.html" };
    const unknownBreadcrumbs = this.breadcrumb.buildBreadcrumbs();
    this.addResult({
      test: "Unknown path fallback",
      passed: unknownBreadcrumbs.length > 1,
      expected: "Multiple items with fallback names",
      actual: `${unknownBreadcrumbs.length} items`,
    });

    // Restore original location
    window.location = originalLocation;
  }

  /**
   * Test accessibility features
   */
  async testAccessibility() {
    console.log("🔍 Testing accessibility features...");

    // Test ARIA attributes
    const container = document.getElementById("breadcrumb-container");
    if (container) {
      const nav = container.querySelector("nav[aria-label='Breadcrumb']");
      this.addResult({
        test: "ARIA label present",
        passed: !!nav,
        expected: "nav with aria-label",
        actual: nav ? "Present" : "Missing",
      });

      const currentPage = container.querySelector("[aria-current='page']");
      this.addResult({
        test: "ARIA current page",
        passed: !!currentPage,
        expected: "Element with aria-current='page'",
        actual: currentPage ? "Present" : "Missing",
      });
    } else {
      this.addResult({
        test: "Breadcrumb container",
        passed: false,
        error: "Container not found",
      });
    }
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
    console.log("\n📊 Breadcrumb Test Results:");
    console.log("============================");

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
        "🎉 All tests passed! Breadcrumb system is working correctly."
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
      const testSuite = new BreadcrumbTests();
      testSuite.runAllTests();
    }, 2000); // Wait for page to fully load
  });
}

// Export for manual testing
window.BreadcrumbTests = BreadcrumbTests;
