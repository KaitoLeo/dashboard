/**
 * Real-time Metrics Updater
 * Cập nhật metrics theo thời gian thực với WebSocket hoặc polling
 */

class RealTimeUpdater {
  constructor() {
    this.updateInterval = 30000; // 30 giây
    this.isRunning = false;
    this.intervalId = null;
    this.lastUpdateTime = null;
    this.updateCallbacks = [];
  }

  /**
   * Bắt đầu cập nhật real-time
   */
  start() {
    if (this.isRunning) {
      console.log("Real-time updater is already running");
      return;
    }

    this.isRunning = true;
    this.lastUpdateTime = new Date();

    // Cập nhật ngay lập tức
    this.updateMetrics();

    // Thiết lập interval
    this.intervalId = setInterval(() => {
      this.updateMetrics();
    }, this.updateInterval);

    console.log("Real-time metrics updater started");
  }

  /**
   * Dừng cập nhật real-time
   */
  stop() {
    if (!this.isRunning) {
      console.log("Real-time updater is not running");
      return;
    }

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log("Real-time metrics updater stopped");
  }

  /**
   * Cập nhật tất cả metrics
   */
  async updateMetrics() {
    try {
      console.log("Updating metrics...");

      // Lấy dữ liệu mới từ API hoặc nguồn dữ liệu
      const freshData = await this.fetchLatestData();

      // Cập nhật comprehensive metrics
      if (window.comprehensiveCalculations) {
        const updatedMetrics =
          window.comprehensiveCalculations.calculateAllComprehensiveMetrics(
            freshData
          );
        window.ComprehensiveMetrics = updatedMetrics;

        // Cập nhật UI
        this.updateAllUI(updatedMetrics);
      }

      // Cập nhật advanced metrics
      if (window.advancedCalculations) {
        const advancedData = this.prepareAdvancedData(freshData);
        const advancedMetrics =
          window.advancedCalculations.calculateAllMetrics(advancedData);
        window.AdvancedMetrics = advancedMetrics;

        // Cập nhật advanced UI
        this.updateAdvancedUI(advancedMetrics);
      }

      // Gọi callbacks
      this.updateCallbacks.forEach((callback) => {
        try {
          callback(updatedMetrics);
        } catch (error) {
          console.error("Error in update callback:", error);
        }
      });

      this.lastUpdateTime = new Date();
      console.log("Metrics updated successfully");
    } catch (error) {
      console.error("Error updating metrics:", error);
    }
  }

  /**
   * Lấy dữ liệu mới nhất (mock implementation)
   */
  async fetchLatestData() {
    // Trong thực tế, đây sẽ là API call
    // Hiện tại sử dụng dữ liệu mock với một số thay đổi ngẫu nhiên

    const baseData = {
      visitor: {
        totalVisitors: 1000 + Math.floor(Math.random() * 100),
        convertedVisitors: 152 + Math.floor(Math.random() * 20),
        returningVisitors: 685 + Math.floor(Math.random() * 50),
        sourceVisitors: 500 + Math.floor(Math.random() * 30),
        sourceConversions: 112 + Math.floor(Math.random() * 15),
        sourceRevenue: 500000000 + Math.floor(Math.random() * 50000000),
        sourceCost: 175000000 + Math.floor(Math.random() * 10000000),
      },
      sales: {
        saleTiep: 281 + Math.floor(Math.random() * 20),
        ptTiep: 221 + Math.floor(Math.random() * 15),
        inbodyMeasurements: 127 + Math.floor(Math.random() * 10),
        sales: [
          { leadDate: "2024-01-01", saleDate: "2024-01-15" },
          { leadDate: "2024-01-05", saleDate: "2024-01-18" },
          { leadDate: "2024-01-10", saleDate: "2024-01-22" },
        ],
        numberOfSales: 50 + Math.floor(Math.random() * 10),
        averageDealSize: 5000000 + Math.floor(Math.random() * 500000),
        salesCycleLength: 12 + Math.floor(Math.random() * 3),
      },
      facility: {
        usedSpace: 750 + Math.floor(Math.random() * 50),
        totalSpace: 1000,
        usageTime: 600 + Math.floor(Math.random() * 50),
        availableTime: 800,
        usedLockers: 150 + Math.floor(Math.random() * 20),
        totalLockers: 220,
        peakHourRevenue: 225000000 + Math.floor(Math.random() * 25000000),
        totalRevenue: 500000000 + Math.floor(Math.random() * 50000000),
        offPeakUsage: 200 + Math.floor(Math.random() * 30),
        offPeakCapacity: 565,
      },
      member: {
        checkins: 2500 + Math.floor(Math.random() * 200),
        bookings: 800 + Math.floor(Math.random() * 100),
        ptSessions: 300 + Math.floor(Math.random() * 50),
        totalInteractions: 3600 + Math.floor(Math.random() * 300),
        daysActive: 30,
        channelSpend: 50000000 + Math.floor(Math.random() * 5000000),
        newMembers: 60 + Math.floor(Math.random() * 10),
        avgMonthlyRevenue: 1500000 + Math.floor(Math.random() * 100000),
        avgMembershipDuration: 12 + Math.floor(Math.random() * 2),
        memberData: {
          daysSinceLastActivity: Math.floor(Math.random() * 10),
          paymentDelays: Math.floor(Math.random() * 3),
          engagementLevel: 0.5 + Math.random() * 0.5,
        },
      },
      financial: {
        totalRevenue: 500000000 + Math.floor(Math.random() * 50000000),
        totalSquareFootage: 1000,
        top20Revenue: 325000000 + Math.floor(Math.random() * 25000000),
        currentGrowthRate: 15 + Math.floor(Math.random() * 5),
        previousGrowthRate: 12 + Math.floor(Math.random() * 3),
        sourceSpend: 75000000 + Math.floor(Math.random() * 10000000),
        newMembers: 60 + Math.floor(Math.random() * 10),
        operationalCosts: 178500000 + Math.floor(Math.random() * 10000000),
        serviceRevenue: 300000000 + Math.floor(Math.random() * 30000000),
        serviceCosts: 173100000 + Math.floor(Math.random() * 10000000),
      },
      performance: {
        revenueGenerated: 500000000 + Math.floor(Math.random() * 50000000),
        staffHours: 2000 + Math.floor(Math.random() * 100),
        totalRevenue: 500000000 + Math.floor(Math.random() * 50000000),
        totalStaffHours: 2000 + Math.floor(Math.random() * 100),
        productiveHours: 1770 + Math.floor(Math.random() * 100),
        totalHours: 2000 + Math.floor(Math.random() * 100),
        ratings: [4, 5, 4, 5, 4, 3, 5, 4, 4, 5],
        completedServices: 923 + Math.floor(Math.random() * 50),
        totalServices: 1000 + Math.floor(Math.random() * 50),
        satisfactionScore: 4.2 + (Math.random() - 0.5) * 0.5,
        completionRate: 92.3 + (Math.random() - 0.5) * 5,
        efficiencyScore: 88.5 + (Math.random() - 0.5) * 5,
      },
      digital: {
        websiteVisitors: 10000 + Math.floor(Math.random() * 1000),
        websiteConversions: 320 + Math.floor(Math.random() * 50),
        likes: 1500 + Math.floor(Math.random() * 200),
        comments: 300 + Math.floor(Math.random() * 50),
        shares: 200 + Math.floor(Math.random() * 30),
        followers: 5000 + Math.floor(Math.random() * 500),
        digitalRevenue: 200000000 + Math.floor(Math.random() * 20000000),
        digitalCost: 52000000 + Math.floor(Math.random() * 5000000),
        totalSessions: 14000 + Math.floor(Math.random() * 1000),
        activeUsers: 5000 + Math.floor(Math.random() * 500),
        featureUsage: 9420 + Math.floor(Math.random() * 500),
        totalSessions: 14000 + Math.floor(Math.random() * 1000),
        totalUsers: 5000 + Math.floor(Math.random() * 500),
        returningUsers: 3945 + Math.floor(Math.random() * 300),
      },
      predictive: {
        historicalAverage: 1000 + Math.floor(Math.random() * 100),
        seasonalFactor: 1.1 + (Math.random() - 0.5) * 0.2,
        growthRate: 15 + Math.floor(Math.random() * 5),
        currentRevenue: 500000000 + Math.floor(Math.random() * 50000000),
        growthRate: 15 + Math.floor(Math.random() * 5),
        timePeriod: 1,
        currentCapacity: 1500 + Math.floor(Math.random() * 100),
        utilizationRate: 80 + Math.floor(Math.random() * 10),
        growthFactor: 1.2 + (Math.random() - 0.5) * 0.2,
        memberData: {
          daysSinceLastActivity: Math.floor(Math.random() * 14),
          paymentDelays: Math.floor(Math.random() * 2),
          engagementLevel: 0.3 + Math.random() * 0.7,
          satisfactionScore: 3 + Math.random() * 2,
        },
        revenueVolatility: 62500000 + Math.floor(Math.random() * 10000000),
        averageRevenue: 500000000 + Math.floor(Math.random() * 50000000),
        riskFactors: 8 + Math.floor(Math.random() * 3),
        totalFactors: 92 + Math.floor(Math.random() * 10),
      },
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return baseData;
  }

  /**
   * Chuẩn bị dữ liệu cho advanced calculations
   */
  prepareAdvancedData(data) {
    return {
      bookings: 156 + Math.floor(Math.random() * 20),
      capacity: 200,
      memberMovement: {
        openingBalance: 1250 + Math.floor(Math.random() * 50),
        closingBalance: 1310 + Math.floor(Math.random() * 50),
        newJoiners: 60 + Math.floor(Math.random() * 10),
        cancellations: 40 + Math.floor(Math.random() * 10),
        expired: 30 + Math.floor(Math.random() * 10),
        freezes: 10 + Math.floor(Math.random() * 5),
      },
      bookingStats: {
        totalBookings: 756 + Math.floor(Math.random() * 50),
        noShowBookings: 38 + Math.floor(Math.random() * 10),
      },
      revenue: data.financial.totalRevenue,
      activeMembers: data.member.newMembers + 1200,
      peakHourStats: {
        peakHourBookings: 45 + Math.floor(Math.random() * 10),
        peakHourCapacity: 60,
      },
      memberStats: {
        avgMonthlyRevenue: data.member.avgMonthlyRevenue,
        avgMembershipDuration: data.member.avgMembershipDuration,
      },
      revenueComparison: {
        currentRevenue: data.financial.totalRevenue,
        previousRevenue:
          data.financial.totalRevenue - Math.floor(Math.random() * 50000000),
      },
      staffStats: {
        scheduledHours: 320 + Math.floor(Math.random() * 20),
        availableHours: 400,
      },
      engagementStats: {
        checkins: data.member.checkins,
        bookings: data.member.bookings,
        ptSessions: data.member.ptSessions,
      },
      mtdRevenue: data.financial.totalRevenue,
      daysPassed: new Date().getDate(),
      marketingStats: {
        marketingSpend: data.member.channelSpend,
        newMembers: data.member.newMembers,
      },
      retentionStats: {
        membersAtStart: 1250,
        membersAtEnd: 1310 + Math.floor(Math.random() * 50),
        newMembers: data.member.newMembers,
      },
      facilityArea: 500,
      peakHourRevenueStats: {
        peakHourRevenue: data.facility.peakHourRevenue,
        peakHours: 4,
        totalHours: 12,
      },
    };
  }

  /**
   * Cập nhật tất cả UI elements
   */
  updateAllUI(metrics) {
    // Visitor metrics
    this.updateElement(
      "visitorConversionRate",
      metrics.visitor.visitorConversionRate,
      "%"
    );
    this.updateElement(
      "visitorRetentionRate",
      metrics.visitor.visitorRetentionRate,
      "%"
    );
    this.updateElement(
      "sourceEffectivenessRate",
      metrics.visitor.sourceEffectivenessRate,
      "%"
    );
    this.updateElement("sourceROI", metrics.visitor.sourceROI, "%");

    // Sales metrics
    this.updateElement("saleTiepRate", metrics.sales.saleTiepRate, "%");
    this.updateElement(
      "inbodyMeasurementRate",
      metrics.sales.inbodyMeasurementRate,
      "%"
    );
    this.updateElement("ptConversionRate", metrics.sales.ptConversionRate, "%");
    this.updateElement(
      "inbodyConversionRate",
      metrics.sales.inbodyConversionRate,
      "%"
    );
    this.updateElement(
      "averageSalesCycle",
      metrics.sales.averageSalesCycle,
      "ngày"
    );
    this.updateElement(
      "salesVelocity",
      metrics.sales.salesVelocity,
      "VNĐ/ngày"
    );

    // Facility metrics
    this.updateElement(
      "floorSpaceUtilization",
      metrics.facility.floorSpaceUtilization,
      "%"
    );
    this.updateElement(
      "equipmentUtilizationRate",
      metrics.facility.equipmentUtilizationRate,
      "%"
    );
    this.updateElement(
      "lockerUtilization",
      metrics.facility.lockerUtilization,
      "%"
    );
    this.updateElement(
      "peakHourRevenueConcentration",
      metrics.facility.peakHourRevenueConcentration,
      "%"
    );
    this.updateElement(
      "offPeakUtilization",
      metrics.facility.offPeakUtilization,
      "%"
    );

    // Member analytics
    this.updateElement(
      "memberActivityScore",
      metrics.member.memberActivityScore,
      "điểm"
    );
    this.updateElement(
      "memberEngagementLevel",
      metrics.member.memberEngagementLevel,
      "%"
    );
    this.updateElement(
      "memberAcquisitionCostByChannel",
      metrics.member.memberAcquisitionCostByChannel,
      "VNĐ"
    );
    this.updateElement(
      "memberLifetimeValueBySegment",
      metrics.member.memberLifetimeValueBySegment,
      "VNĐ"
    );
    this.updateElement(
      "memberChurnPredictionScore",
      metrics.member.memberChurnPredictionScore,
      ""
    );

    // Financial analytics
    this.updateElement(
      "revenuePerSquareFoot",
      metrics.financial.revenuePerSquareFoot,
      "VNĐ/m²"
    );
    this.updateElement(
      "revenueConcentrationIndex",
      metrics.financial.revenueConcentrationIndex,
      "%"
    );
    this.updateElement(
      "revenueGrowthAcceleration",
      metrics.financial.revenueGrowthAcceleration,
      "%"
    );
    this.updateElement(
      "costPerAcquisitionBySource",
      metrics.financial.costPerAcquisitionBySource,
      "VNĐ"
    );
    this.updateElement(
      "operationalCostRatio",
      metrics.financial.operationalCostRatio,
      "%"
    );
    this.updateElement(
      "profitMarginByService",
      metrics.financial.profitMarginByService,
      "%"
    );

    // Performance metrics
    this.updateElement(
      "staffProductivityIndex",
      metrics.performance.staffProductivityIndex,
      ""
    );
    this.updateElement(
      "staffRevenuePerHour",
      metrics.performance.staffRevenuePerHour,
      "VNĐ/giờ"
    );
    this.updateElement(
      "staffUtilizationEfficiency",
      metrics.performance.staffUtilizationEfficiency,
      "%"
    );
    this.updateElement(
      "serviceSatisfactionScore",
      metrics.performance.serviceSatisfactionScore,
      "/5.0"
    );
    this.updateElement(
      "serviceCompletionRate",
      metrics.performance.serviceCompletionRate,
      "%"
    );
    this.updateElement(
      "serviceQualityIndex",
      metrics.performance.serviceQualityIndex,
      ""
    );

    // Digital analytics
    this.updateElement(
      "websiteConversionRate",
      metrics.digital.websiteConversionRate,
      "%"
    );
    this.updateElement(
      "socialMediaEngagementRate",
      metrics.digital.socialMediaEngagementRate,
      "%"
    );
    this.updateElement(
      "digitalMarketingROI",
      metrics.digital.digitalMarketingROI,
      "%"
    );
    this.updateElement(
      "appUsageFrequency",
      metrics.digital.appUsageFrequency,
      "lần/ngày"
    );
    this.updateElement(
      "appFeatureUtilization",
      metrics.digital.appFeatureUtilization,
      "%"
    );
    this.updateElement(
      "appRetentionRate",
      metrics.digital.appRetentionRate,
      "%"
    );

    // Predictive analytics
    this.updateElement(
      "demandForecasting",
      metrics.predictive.demandForecasting,
      "lượt"
    );
    this.updateElement(
      "revenueForecasting",
      metrics.predictive.revenueForecasting,
      "VNĐ"
    );
    this.updateElement(
      "capacityPlanning",
      metrics.predictive.capacityPlanning,
      "chỗ"
    );
    this.updateElement("churnRiskScore", metrics.predictive.churnRiskScore, "");
    this.updateElement(
      "revenueRiskAssessment",
      metrics.predictive.revenueRiskAssessment,
      "%"
    );
    this.updateElement(
      "operationalRiskIndex",
      metrics.predictive.operationalRiskIndex,
      "%"
    );
  }

  /**
   * Cập nhật advanced UI elements
   */
  updateAdvancedUI(metrics) {
    this.updateElement("classUtilization", metrics.classUtilization, "%");
    this.updateElement("dynamicChurnRate", metrics.dynamicChurnRate, "%");
    this.updateElement("noShowRate", metrics.noShowRate, "%");
    this.updateElement("revenuePerMember", metrics.revenuePerMember, "VNĐ");
    this.updateElement("peakHourUtilization", metrics.peakHourUtilization, "%");
    this.updateElement(
      "memberLifetimeValue",
      metrics.memberLifetimeValue,
      "VNĐ"
    );
    this.updateElement("revenueGrowthRate", metrics.revenueGrowthRate, "%");
    this.updateElement("staffUtilization", metrics.staffUtilization, "%");
    this.updateElement("avgBookingLeadTime", metrics.avgBookingLeadTime, "giờ");
    this.updateElement("engagementScore", metrics.engagementScore, "điểm");
    this.updateElement(
      "forecastedMonthlyRevenue",
      metrics.forecastedMonthlyRevenue,
      "VNĐ"
    );
    this.updateElement(
      "customerAcquisitionCost",
      metrics.customerAcquisitionCost,
      "VNĐ"
    );
    this.updateElement("retentionRate", metrics.retentionRate, "%");
    this.updateElement(
      "revenuePerSquareMeter",
      metrics.revenuePerSquareMeter,
      "VNĐ/m²"
    );
    this.updateElement(
      "peakHourRevenueEfficiency",
      metrics.peakHourRevenueEfficiency,
      "%"
    );
  }

  /**
   * Cập nhật một element cụ thể
   */
  updateElement(elementId, value, unit) {
    const element = document.getElementById(elementId);
    if (element && value !== undefined) {
      if (
        unit === "VNĐ" ||
        unit === "VNĐ/giờ" ||
        unit === "VNĐ/ngày" ||
        unit === "VNĐ/m²"
      ) {
        element.textContent =
          window.comprehensiveCalculations.formatCurrency(value) +
          (unit.includes("/") ? "/" + unit.split("/")[1] : "");
      } else if (unit === "%") {
        element.textContent =
          window.comprehensiveCalculations.formatPercentage(value);
      } else if (unit === "/5.0") {
        element.textContent = (value / 20).toFixed(1) + unit;
      } else {
        element.textContent =
          window.comprehensiveCalculations.formatNumber(value) +
          (unit ? " " + unit : "");
      }

      // Thêm hiệu ứng cập nhật
      element.style.transition = "all 0.3s ease";
      element.style.backgroundColor = "#e8f5e8";
      setTimeout(() => {
        element.style.backgroundColor = "";
      }, 1000);
    }
  }

  /**
   * Thêm callback để xử lý khi metrics được cập nhật
   */
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  /**
   * Xóa callback
   */
  removeCallback(callback) {
    const index = this.updateCallbacks.indexOf(callback);
    if (index > -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  /**
   * Thay đổi interval cập nhật
   */
  setUpdateInterval(intervalMs) {
    this.updateInterval = intervalMs;

    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Lấy thông tin trạng thái
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      updateInterval: this.updateInterval,
      lastUpdateTime: this.lastUpdateTime,
      callbackCount: this.updateCallbacks.length,
    };
  }
}

// Export cho sử dụng global
window.RealTimeUpdater = RealTimeUpdater;

// Tạo instance global
window.realTimeUpdater = new RealTimeUpdater();

console.log("Real-time Metrics Updater loaded successfully");




