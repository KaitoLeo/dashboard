// Dynamic Revenue Calculation System
// This script automatically calculates revenue metrics based on settings

window.App = window.App || {};
window.App.models = window.App.models || {};

class DynamicRevenueCalculator {
  constructor() {
    this.settings = null;
    this.metrics = {};
  }

  // Load settings from localStorage
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem("actiwellSettings");
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      } else {
        // Default settings if none found
        this.settings = {
          global: {
            monthlyTarget: 3000000000, // 3 tá»· VNÄ
            yearlyTarget: 30000000000,
            growthTarget: 15,
            retentionTarget: 85,
          },
        };
      }
      console.log("Settings loaded:", this.settings);
      return true;
    } catch (error) {
      console.error("Error loading settings:", error);
      return false;
    }
  }

  // Calculate all revenue metrics
  calculateMetrics() {
    if (!this.settings) {
      console.error("Settings not loaded");
      return;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysPassed = today.getDate();
    const remainingDays = lastDayOfMonth - daysPassed + 1;

    // Get values from settings
    const monthlyTarget = this.settings.global.monthlyTarget;
    const mtdRevenue = 1850000000; // Fixed MTD revenue for now
    const todayRevenue = 85000000; // Fixed today's revenue

    // Calculate estimated completion date
    const estimatedCompletionDate = new Date(today);
    estimatedCompletionDate.setDate(today.getDate() + remainingDays);

    // Calculate metrics
    this.metrics = {
      monthlyTarget: monthlyTarget,
      mtdRevenue: mtdRevenue,
      dailyRevenue: todayRevenue, // Use actual today's revenue instead of average
      completionRate: Math.round((mtdRevenue / monthlyTarget) * 100),
      remainingTarget: monthlyTarget - mtdRevenue,
      dailyTargetNeeded: Math.round(
        (monthlyTarget - mtdRevenue) / remainingDays
      ),
      daysPassed: daysPassed,
      remainingDays: remainingDays,
      estimatedCompletionDate:
        estimatedCompletionDate.toLocaleDateString("vi-VN"),
    };

    console.log("Metrics calculated:", this.metrics);
    return this.metrics;
  }

  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Update DOM element
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }

  // Update all revenue metrics on the page
  updateRevenueMetrics() {
    if (!this.loadSettings()) {
      return;
    }

    this.calculateMetrics();

    // Update common elements
    this.updateElement(
      "targetValue",
      this.formatNumber(this.metrics.monthlyTarget)
    );
    this.updateElement("mtdValue", this.formatNumber(this.metrics.mtdRevenue));
    this.updateElement(
      "dailyValue",
      this.formatNumber(this.metrics.dailyRevenue)
    );
    this.updateElement("completionValue", this.metrics.completionRate + "%");
    this.updateElement(
      "remainingValue",
      this.formatNumber(this.metrics.remainingTarget)
    );
    this.updateElement(
      "dailyTargetValue",
      this.formatNumber(this.metrics.dailyTargetNeeded)
    );

    // Update additional elements that might exist
    this.updateElement(
      "monthlyTarget",
      this.formatNumber(this.metrics.monthlyTarget)
    );
    this.updateElement(
      "mtdRevenue",
      this.formatNumber(this.metrics.mtdRevenue)
    );
    this.updateElement(
      "dailyRevenue",
      this.formatNumber(this.metrics.dailyRevenue)
    );
    this.updateElement("completionRate", this.metrics.completionRate + "%");
    this.updateElement(
      "remainingTarget",
      this.formatNumber(this.metrics.remainingTarget)
    );
    this.updateElement(
      "dailyTarget",
      this.formatNumber(this.metrics.dailyTargetNeeded)
    );

    // Update completion date
    this.updateElement("completionDate", this.metrics.estimatedCompletionDate);

    // Update progress bars
    this.updateProgressBars();

    console.log("Revenue metrics updated successfully");
  }

  // Update progress bars
  updateProgressBars() {
    const progressBars = document.querySelectorAll(".progress-bar");
    progressBars.forEach((bar) => {
      if (bar.textContent.includes("%")) {
        bar.style.width = this.metrics.completionRate + "%";
        bar.textContent = this.metrics.completionRate + "%";
      }
    });
  }

  // Get current metrics (for external use)
  getMetrics() {
    return this.metrics;
  }

  // Refresh metrics (useful for settings changes)
  refresh() {
    this.updateRevenueMetrics();
  }
}

// Create global instance
window.revenueCalculator = new DynamicRevenueCalculator();
window.App.models.dynamicRevenue = window.revenueCalculator;

// Auto-update when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dynamic Revenue Calculator initialized");
  window.revenueCalculator.updateRevenueMetrics();
});

// Also run immediately if DOM is already ready
if (document.readyState === "loading") {
  console.log("DOM still loading, waiting for DOMContentLoaded...");
} else {
  console.log("DOM already ready, running immediately...");
  window.revenueCalculator.updateRevenueMetrics();
}

// Listen for storage changes (when settings are updated)
window.addEventListener("storage", function (e) {
  if (e.key === "actiwellSettings") {
    console.log("Settings updated, refreshing metrics...");
    window.revenueCalculator.refresh();
  }
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = DynamicRevenueCalculator;
}
