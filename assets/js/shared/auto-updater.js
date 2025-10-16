(function (w) {
  "use strict";

  // Auto Updater for converting static pages to dynamic
  const AutoUpdater = {
    // Common patterns to replace
    patterns: {
      // Replace static data arrays
      staticDataArray: /const\s+\w+Data\s*=\s*\[[\s\S]*?\];/g,

      // Replace hardcoded numbers in metric cards
      hardcodedNumbers: /<h[1-6][^>]*id="[^"]*"[^>]*>\d+<\/h[1-6]>/g,

      // Replace static table data
      staticTableData: /<tbody[^>]*>[\s\S]*?<\/tbody>/g,

      // Replace static chart data
      staticChartData: /data:\s*\[[\d\s,]*\]/g,
    },

    // Page configurations for different types
    pageConfigs: {
      checkin: {
        dataType: "checkin",
        dataCount: 100,
        metricCards: [
          { id: "totalCheckins", type: "count", format: "number" },
          {
            id: "totalClubs",
            type: "custom",
            calculate: (data) =>
              new Set(data.map((item) => item.location)).size,
          },
          {
            id: "avgTime",
            type: "custom",
            calculate: (data) => {
              const times = data.map((item) => {
                const [hour, minute] = item.checkinTime.split(":").map(Number);
                return hour * 60 + minute;
              });
              const avgMinutes =
                times.reduce((sum, time) => sum + time, 0) / times.length;
              const avgHour = Math.floor(avgMinutes / 60);
              const avgMinute = Math.floor(avgMinutes % 60);
              return `${String(avgHour).padStart(2, "0")}:${String(
                avgMinute
              ).padStart(2, "0")}`;
            },
          },
        ],
      },
      revenue: {
        dataType: "revenue",
        dataCount: 50,
        metricCards: [
          {
            id: "totalRevenue",
            type: "sum",
            field: "amount",
            format: "currency",
          },
          { id: "totalTransactions", type: "count", format: "number" },
          {
            id: "avgTransaction",
            type: "custom",
            calculate: (data) => {
              const total = data.reduce((sum, item) => sum + item.amount, 0);
              return (total / data.length).toLocaleString("vi-VN") + " VNĐ";
            },
          },
        ],
      },
      booking: {
        dataType: "booking",
        dataCount: 30,
        metricCards: [
          { id: "totalBookings", type: "count", format: "number" },
          {
            id: "completedBookings",
            type: "filter",
            filter: { field: "status", value: "Hoàn thành" },
            format: "number",
          },
          {
            id: "cancelledBookings",
            type: "filter",
            filter: { field: "status", value: "Đã hủy" },
            format: "number",
          },
        ],
      },
      trial: {
        dataType: "trial",
        dataCount: 20,
        metricCards: [
          { id: "totalTrials", type: "count", format: "number" },
          {
            id: "convertedTrials",
            type: "filter",
            filter: { field: "result", value: "Đã đăng ký" },
            format: "number",
          },
          {
            id: "conversionRate",
            type: "custom",
            calculate: (data) => {
              const converted = data.filter(
                (item) => item.result === "Đã đăng ký"
              ).length;
              return ((converted / data.length) * 100).toFixed(1) + "%";
            },
          },
        ],
      },
      // Advanced Metrics
      advanced: {
        dataType: "advanced",
        dataCount: 15,
        metricCards: [
          {
            id: "classUtilization",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.classUtilization + "%";
              }
              return "78.0%";
            },
            format: "percentage",
          },
          {
            id: "dynamicChurnRate",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.dynamicChurnRate + "%";
              }
              return "5.6%";
            },
            format: "percentage",
          },
          {
            id: "noShowRate",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.noShowRate + "%";
              }
              return "5.0%";
            },
            format: "percentage",
          },
          {
            id: "revenuePerMember",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.advancedCalculations.formatCurrency(
                  window.AdvancedMetrics.revenuePerMember
                );
              }
              return "1,480,000 VNĐ";
            },
            format: "currency",
          },
          {
            id: "peakHourUtilization",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.peakHourUtilization + "%";
              }
              return "75.0%";
            },
            format: "percentage",
          },
          {
            id: "memberLifetimeValue",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.advancedCalculations.formatCurrency(
                  window.AdvancedMetrics.memberLifetimeValue
                );
              }
              return "18,000,000 VNĐ";
            },
            format: "currency",
          },
          {
            id: "revenueGrowthRate",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.revenueGrowthRate + "%";
              }
              return "12.1%";
            },
            format: "percentage",
          },
          {
            id: "staffUtilization",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.staffUtilization + "%";
              }
              return "80.0%";
            },
            format: "percentage",
          },
          {
            id: "avgBookingLeadTime",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.avgBookingLeadTime + " giờ";
              }
              return "24.5 giờ";
            },
            format: "number",
          },
          {
            id: "engagementScore",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.engagementScore + " điểm";
              }
              return "2,012 điểm";
            },
            format: "number",
          },
          {
            id: "forecastedMonthlyRevenue",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.advancedCalculations.formatCurrency(
                  window.AdvancedMetrics.forecastedMonthlyRevenue
                );
              }
              return "3,700,000,000 VNĐ";
            },
            format: "currency",
          },
          {
            id: "customerAcquisitionCost",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.advancedCalculations.formatCurrency(
                  window.AdvancedMetrics.customerAcquisitionCost
                );
              }
              return "833,333 VNĐ";
            },
            format: "currency",
          },
          {
            id: "retentionRate",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.retentionRate + "%";
              }
              return "100.0%";
            },
            format: "percentage",
          },
          {
            id: "revenuePerSquareMeter",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return (
                  window.advancedCalculations.formatCurrency(
                    window.AdvancedMetrics.revenuePerSquareMeter
                  ) + "/m²"
                );
              }
              return "3,700,000 VNĐ/m²";
            },
            format: "currency",
          },
          {
            id: "peakHourRevenueEfficiency",
            type: "custom",
            calculate: () => {
              if (window.AdvancedMetrics) {
                return window.AdvancedMetrics.peakHourRevenueEfficiency + "%";
              }
              return "104.2%";
            },
            format: "percentage",
          },
        ],
      },
    },

    // Update a single page
    updatePage: function (pagePath, pageType = "checkin") {
      const config = this.pageConfigs[pageType] || this.pageConfigs["checkin"];

      // This would be implemented to actually update the file
      // For now, we'll return the configuration
      return {
        pagePath: pagePath,
        config: config,
        status: "ready_for_update",
      };
    },

    // Generate dynamic script for a page
    generateDynamicScript: function (pageType, config) {
      return `
      // Dynamic data generation
      let pageData = [];
      let filteredData = [];
      let currentPage = 1;
      const itemsPerPage = 10;

      // Initialize page with dynamic data
      function initializePage() {
        // Generate dynamic data
        pageData = DataGenerator.generate${this.capitalizeFirst(
          pageType
        )}Data(${config.dataCount}, {
          // Add specific options based on page type
        });
        
        filteredData = [...pageData];
        
        // Update metric cards
        updateMetricCards();
        
        // Load table data
        loadTableData();
        
        // Update charts
        updateCharts();
      }

      // Update metric cards dynamically
      function updateMetricCards() {
        const config = ${JSON.stringify(config.metricCards)};
        DynamicUpdater.updateMetricCards(pageData, config);
      }

      // Load table data
      function loadTableData() {
        // Implementation depends on specific page structure
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        pageData.forEach((item, index) => {
          const row = document.createElement('tr');
          // Add row content based on page type
          tbody.appendChild(row);
        });
        
        updatePagination();
      }

      // Update charts
      function updateCharts() {
        // Implementation depends on specific charts
      }

      // Update pagination
      function updatePagination() {
        DynamicUpdater.updatePagination(filteredData, currentPage, itemsPerPage, 'pagination');
      }

      // Initialize page when DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        initializePage();
      });
      `;
    },

    // Helper function to capitalize first letter
    capitalizeFirst: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // Get page type from filename
    getPageType: function (filename) {
      if (filename.includes("checkin")) return "checkin";
      if (filename.includes("revenue")) return "revenue";
      if (filename.includes("booking")) return "booking";
      if (filename.includes("trial")) return "trial";
      if (filename.includes("contract")) return "contract";
      if (filename.includes("crm")) return "crm";
      return "checkin"; // default
    },

    // Update all pages in a directory
    updateAllPages: function (pages) {
      const results = [];

      pages.forEach((page) => {
        const pageType = this.getPageType(page.filename);
        const result = this.updatePage(page.path, pageType);
        results.push(result);
      });

      return results;
    },
  };

  // Export to window
  w.AutoUpdater = AutoUpdater;
})(window);
