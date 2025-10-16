/**
 * Revenue Data Synchronization System
 * Tự động đồng bộ dữ liệu doanh thu giữa dashboard và các trang chi tiết
 */

class RevenueDataSync {
  constructor() {
    this.storageKey = "actiwellRevenueData";
    this.defaultData = {
      today: 75000000, // 75 triệu VNĐ
      yesterday: 68500000, // 68.5 triệu VNĐ
      mtd: 1850000000, // 1.85 tỷ VNĐ
      monthlyTarget: 3000000000, // 3 tỷ VNĐ
      lastUpdated: new Date().toISOString(),
    };
    this.init();
  }

  init() {
    // Load existing data or use default
    this.loadData();

    // Listen for storage changes across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === this.storageKey) {
        this.loadData();
        this.updateAllPages();
      }
    });

    // Update data on page load
    this.updateAllPages();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.data = { ...this.defaultData };
        this.saveData();
      }
    } catch (error) {
      console.error("Error loading revenue data:", error);
      this.data = { ...this.defaultData };
    }
  }

  saveData() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      console.log("Revenue data saved:", this.data);
    } catch (error) {
      console.error("Error saving revenue data:", error);
    }
  }

  updateRevenueData(newData) {
    this.data = { ...this.data, ...newData };
    this.saveData();
    this.updateAllPages();
  }

  getRevenueData() {
    return { ...this.data };
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateAllPages() {
    // Update dashboard elements
    this.updateElement("dailyRevenue", this.formatNumber(this.data.today));
    this.updateElement(
      "yesterdayRevenue",
      this.formatNumber(this.data.yesterday)
    );
    this.updateElement("mtdRevenue", this.formatNumber(this.data.mtd));
    this.updateElement(
      "monthlyTarget",
      this.formatNumber(this.data.monthlyTarget)
    );

    // Update detail page elements
    this.updateElement("todayRevenue", this.formatNumber(this.data.today));
    this.updateElement(
      "yesterdayRevenueDetail",
      this.formatNumber(this.data.yesterday)
    );
    this.updateElement("mtdRevenueDetail", this.formatNumber(this.data.mtd));

    // Calculate and update derived metrics
    this.updateDerivedMetrics();
  }

  updateDerivedMetrics() {
    const completionRate = Math.round(
      (this.data.mtd / this.data.monthlyTarget) * 100
    );
    const remainingTarget = this.data.monthlyTarget - this.data.mtd;

    // Calculate remaining days in month
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const daysPassed = today.getDate();
    const remainingDays = lastDayOfMonth - daysPassed + 1;
    const dailyTargetNeeded = Math.round(remainingTarget / remainingDays);

    // Update completion metrics
    this.updateElement("completionRate", completionRate + "%");
    this.updateElement("remainingTarget", this.formatNumber(remainingTarget));
    this.updateElement(
      "dailyTargetNeeded",
      this.formatNumber(dailyTargetNeeded)
    );

    // Update progress bars
    this.updateProgressBars(completionRate);
  }

  updateProgressBars(rate) {
    const progressBars = document.querySelectorAll(".progress-bar");
    progressBars.forEach((bar) => {
      if (bar.textContent.includes("%")) {
        bar.style.width = rate + "%";
        bar.textContent = rate + "%";
      }
    });
  }

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  // Method to update data from settings
  updateFromSettings(settings) {
    if (settings && settings.global) {
      this.updateRevenueData({
        monthlyTarget: settings.global.monthlyTarget || 3000000000,
        mtd: settings.global.mtdRevenue || 1850000000,
      });
    }
  }

  // Method to get current data for external use
  getCurrentData() {
    return this.getRevenueData();
  }
}

// Initialize global revenue sync system
window.revenueSync = new RevenueDataSync();

// Auto-update when page loads
document.addEventListener("DOMContentLoaded", function () {
  if (window.revenueSync) {
    window.revenueSync.updateAllPages();
  }
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = RevenueDataSync;
}
