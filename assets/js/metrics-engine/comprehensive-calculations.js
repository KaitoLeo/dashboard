/**
 * Comprehensive Calculations Engine
 * Tất cả công thức tính toán cho Actiwell Dashboard
 * Bao gồm 8 nhóm metrics chính với 50+ công thức
 */

class ComprehensiveCalculations {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 phút
  }

  // ========================================
  // 1. VISITOR & CONVERSION STATISTICS
  // ========================================

  /**
   * Visitor Conversion Rate - Tỷ lệ chuyển đổi khách tham quan
   * Formula: (Converted Visitors / Total Visitors) × 100
   */
  calculateVisitorConversionRate(totalVisitors, convertedVisitors) {
    if (!totalVisitors || totalVisitors === 0) return 0;
    return Math.round((convertedVisitors / totalVisitors) * 100 * 100) / 100;
  }

  /**
   * Visitor Retention Rate - Tỷ lệ giữ chân khách tham quan
   * Formula: (Returning Visitors / Total Visitors) × 100
   */
  calculateVisitorRetentionRate(totalVisitors, returningVisitors) {
    if (!totalVisitors || totalVisitors === 0) return 0;
    return Math.round((returningVisitors / totalVisitors) * 100 * 100) / 100;
  }

  /**
   * Source Effectiveness Rate - Hiệu quả nguồn khách hàng
   * Formula: (Conversions from Source / Total Source Visitors) × 100
   */
  calculateSourceEffectivenessRate(sourceVisitors, sourceConversions) {
    if (!sourceVisitors || sourceVisitors === 0) return 0;
    return Math.round((sourceConversions / sourceVisitors) * 100 * 100) / 100;
  }

  /**
   * Source ROI - ROI theo nguồn
   * Formula: (Revenue from Source - Cost of Source) / Cost of Source × 100
   */
  calculateSourceROI(sourceRevenue, sourceCost) {
    if (!sourceCost || sourceCost === 0) return 0;
    return (
      Math.round(((sourceRevenue - sourceCost) / sourceCost) * 100 * 100) / 100
    );
  }

  // ========================================
  // 2. SALES & CONVERSION METRICS
  // ========================================

  /**
   * Sale Tiếp Rate - Tỷ lệ PT tiếp
   * Formula: (PT Tiếp / Sale Tiếp) × 100
   */
  calculateSaleTiepRate(saleTiep, ptTiep) {
    if (!saleTiep || saleTiep === 0) return 0;
    return Math.round((ptTiep / saleTiep) * 100 * 100) / 100;
  }

  /**
   * Inbody Measurement Rate - Tỷ lệ đo Inbody
   * Formula: (Số khách đo Inbody / Sale Tiếp) × 100
   */
  calculateInbodyMeasurementRate(saleTiep, inbodyMeasurements) {
    if (!saleTiep || saleTiep === 0) return 0;
    return Math.round((inbodyMeasurements / saleTiep) * 100 * 100) / 100;
  }

  /**
   * PT Conversion Rate - Tỷ lệ chuyển đổi PT
   * Formula: (PT Tiếp / Sale Tiếp) × 100
   */
  calculatePTConversionRate(saleTiep, ptTiep) {
    if (!saleTiep || saleTiep === 0) return 0;
    return Math.round((ptTiep / saleTiep) * 100 * 100) / 100;
  }

  /**
   * Inbody Conversion Rate - Tỷ lệ chuyển đổi Inbody
   * Formula: (Số khách đo Inbody / PT Tiếp) × 100
   */
  calculateInbodyConversionRate(ptTiep, inbodyMeasurements) {
    if (!ptTiep || ptTiep === 0) return 0;
    return Math.round((inbodyMeasurements / ptTiep) * 100 * 100) / 100;
  }

  /**
   * Sales Conversion Funnel - Tỷ lệ chuyển đổi qua từng bước
   * Formula: (Next Step Conversions / Current Step) × 100
   */
  calculateSalesConversionFunnel(currentStep, nextStep) {
    if (!currentStep || currentStep === 0) return 0;
    return Math.round((nextStep / currentStep) * 100 * 100) / 100;
  }

  /**
   * Average Sales Cycle - Thời gian trung bình từ lead đến sale
   * Formula: Sum of (Sale Date - Lead Date) / Total Sales
   */
  calculateAverageSalesCycle(sales) {
    if (!sales || sales.length === 0) return 0;
    const totalDays = sales.reduce((sum, sale) => {
      const leadDate = new Date(sale.leadDate);
      const saleDate = new Date(sale.saleDate);
      const daysDiff = (saleDate - leadDate) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0);
    return Math.round((totalDays / sales.length) * 100) / 100;
  }

  /**
   * Sales Velocity - Tốc độ bán hàng
   * Formula: (Number of Sales × Average Deal Size) / Sales Cycle Length
   */
  calculateSalesVelocity(numberOfSales, averageDealSize, salesCycleLength) {
    if (!salesCycleLength || salesCycleLength === 0) return 0;
    return (
      Math.round(((numberOfSales * averageDealSize) / salesCycleLength) * 100) /
      100
    );
  }

  // ========================================
  // 3. FACILITY & CAPACITY METRICS
  // ========================================

  /**
   * Floor Space Utilization - Tỷ lệ sử dụng không gian
   * Formula: (Used Space / Total Space) × 100
   */
  calculateFloorSpaceUtilization(usedSpace, totalSpace) {
    if (!totalSpace || totalSpace === 0) return 0;
    return Math.round((usedSpace / totalSpace) * 100 * 100) / 100;
  }

  /**
   * Equipment Utilization Rate - Tỷ lệ sử dụng thiết bị
   * Formula: (Equipment Usage Time / Total Available Time) × 100
   */
  calculateEquipmentUtilizationRate(usageTime, availableTime) {
    if (!availableTime || availableTime === 0) return 0;
    return Math.round((usageTime / availableTime) * 100 * 100) / 100;
  }

  /**
   * Locker Utilization - Tỷ lệ sử dụng tủ đồ
   * Formula: (Used Lockers / Total Lockers) × 100
   */
  calculateLockerUtilization(usedLockers, totalLockers) {
    if (!totalLockers || totalLockers === 0) return 0;
    return Math.round((usedLockers / totalLockers) * 100 * 100) / 100;
  }

  /**
   * Peak Hour Revenue Concentration - Tập trung doanh thu giờ cao điểm
   * Formula: (Peak Hour Revenue / Total Revenue) × 100
   */
  calculatePeakHourRevenueConcentration(peakHourRevenue, totalRevenue) {
    if (!totalRevenue || totalRevenue === 0) return 0;
    return Math.round((peakHourRevenue / totalRevenue) * 100 * 100) / 100;
  }

  /**
   * Off-Peak Utilization - Sử dụng giờ thấp điểm
   * Formula: (Off-Peak Usage / Off-Peak Capacity) × 100
   */
  calculateOffPeakUtilization(offPeakUsage, offPeakCapacity) {
    if (!offPeakCapacity || offPeakCapacity === 0) return 0;
    return Math.round((offPeakUsage / offPeakCapacity) * 100 * 100) / 100;
  }

  // ========================================
  // 4. MEMBER ANALYTICS
  // ========================================

  /**
   * Member Activity Score - Điểm hoạt động hội viên
   * Formula: (Check-ins + Bookings + PT Sessions) / 3
   */
  calculateMemberActivityScore(checkins, bookings, ptSessions) {
    const totalActivity = checkins + bookings + ptSessions;
    return Math.round((totalActivity / 3) * 100) / 100;
  }

  /**
   * Member Engagement Level - Mức độ tương tác
   * Formula: (Total Interactions / Days Active) × 100
   */
  calculateMemberEngagementLevel(totalInteractions, daysActive) {
    if (!daysActive || daysActive === 0) return 0;
    return Math.round((totalInteractions / daysActive) * 100 * 100) / 100;
  }

  /**
   * Member Acquisition Cost by Channel - CAC theo kênh
   * Formula: Channel Marketing Spend / New Members from Channel
   */
  calculateMemberAcquisitionCostByChannel(channelSpend, newMembers) {
    if (!newMembers || newMembers === 0) return 0;
    return Math.round(channelSpend / newMembers);
  }

  /**
   * Member Lifetime Value by Segment - MLV theo phân khúc
   * Formula: Average Monthly Revenue × Average Membership Duration
   */
  calculateMemberLifetimeValueBySegment(
    avgMonthlyRevenue,
    avgMembershipDuration
  ) {
    if (!avgMonthlyRevenue || !avgMembershipDuration) return 0;
    return Math.round(avgMonthlyRevenue * avgMembershipDuration);
  }

  /**
   * Member Churn Prediction Score - Điểm dự đoán rời bỏ
   * Formula: Weighted factors (Last Activity, Payment History, Engagement)
   */
  calculateMemberChurnPredictionScore(memberData) {
    const weights = {
      lastActivity: 0.3,
      paymentHistory: 0.4,
      engagement: 0.3,
    };

    const lastActivityScore = memberData.daysSinceLastActivity > 30 ? 0.8 : 0.2;
    const paymentScore = memberData.paymentDelays > 2 ? 0.9 : 0.1;
    const engagementScore = memberData.engagementLevel < 0.3 ? 0.7 : 0.3;

    const churnScore =
      lastActivityScore * weights.lastActivity +
      paymentScore * weights.paymentHistory +
      engagementScore * weights.engagement;

    return Math.round(churnScore * 100) / 100;
  }

  // ========================================
  // 5. FINANCIAL ANALYTICS
  // ========================================

  /**
   * Revenue per Square Foot - Doanh thu trên mỗi mét vuông
   * Formula: Total Revenue / Total Square Footage
   */
  calculateRevenuePerSquareFoot(totalRevenue, totalSquareFootage) {
    if (!totalSquareFootage || totalSquareFootage === 0) return 0;
    return Math.round(totalRevenue / totalSquareFootage);
  }

  /**
   * Revenue Concentration Index - Chỉ số tập trung doanh thu
   * Formula: (Top 20% Revenue / Total Revenue) × 100
   */
  calculateRevenueConcentrationIndex(top20Revenue, totalRevenue) {
    if (!totalRevenue || totalRevenue === 0) return 0;
    return Math.round((top20Revenue / totalRevenue) * 100 * 100) / 100;
  }

  /**
   * Revenue Growth Acceleration - Gia tốc tăng trưởng doanh thu
   * Formula: (Current Growth Rate - Previous Growth Rate) / Previous Growth Rate × 100
   */
  calculateRevenueGrowthAcceleration(currentGrowthRate, previousGrowthRate) {
    if (!previousGrowthRate || previousGrowthRate === 0) return 0;
    return (
      Math.round(
        ((currentGrowthRate - previousGrowthRate) / previousGrowthRate) *
          100 *
          100
      ) / 100
    );
  }

  /**
   * Cost per Acquisition by Source - Chi phí thu hút theo nguồn
   * Formula: Source Marketing Spend / New Members from Source
   */
  calculateCostPerAcquisitionBySource(sourceSpend, newMembers) {
    if (!newMembers || newMembers === 0) return 0;
    return Math.round(sourceSpend / newMembers);
  }

  /**
   * Operational Cost Ratio - Tỷ lệ chi phí vận hành
   * Formula: (Operational Costs / Total Revenue) × 100
   */
  calculateOperationalCostRatio(operationalCosts, totalRevenue) {
    if (!totalRevenue || totalRevenue === 0) return 0;
    return Math.round((operationalCosts / totalRevenue) * 100 * 100) / 100;
  }

  /**
   * Profit Margin by Service - Biên lợi nhuận theo dịch vụ
   * Formula: (Service Revenue - Service Costs) / Service Revenue × 100
   */
  calculateProfitMarginByService(serviceRevenue, serviceCosts) {
    if (!serviceRevenue || serviceRevenue === 0) return 0;
    return (
      Math.round(
        ((serviceRevenue - serviceCosts) / serviceRevenue) * 100 * 100
      ) / 100
    );
  }

  // ========================================
  // 6. PERFORMANCE METRICS
  // ========================================

  /**
   * Staff Productivity Index - Chỉ số năng suất nhân viên
   * Formula: (Revenue Generated / Staff Hours) × 100
   */
  calculateStaffProductivityIndex(revenueGenerated, staffHours) {
    if (!staffHours || staffHours === 0) return 0;
    return Math.round((revenueGenerated / staffHours) * 100 * 100) / 100;
  }

  /**
   * Staff Revenue per Hour - Doanh thu/giờ của nhân viên
   * Formula: Total Revenue / Total Staff Hours
   */
  calculateStaffRevenuePerHour(totalRevenue, totalStaffHours) {
    if (!totalStaffHours || totalStaffHours === 0) return 0;
    return Math.round(totalRevenue / totalStaffHours);
  }

  /**
   * Staff Utilization Efficiency - Hiệu quả sử dụng nhân viên
   * Formula: (Productive Hours / Total Hours) × 100
   */
  calculateStaffUtilizationEfficiency(productiveHours, totalHours) {
    if (!totalHours || totalHours === 0) return 0;
    return Math.round((productiveHours / totalHours) * 100 * 100) / 100;
  }

  /**
   * Service Satisfaction Score - Điểm hài lòng dịch vụ
   * Formula: (Sum of Ratings / Number of Ratings) × 20
   */
  calculateServiceSatisfactionScore(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    const averageRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return Math.round(averageRating * 20);
  }

  /**
   * Service Completion Rate - Tỷ lệ hoàn thành dịch vụ
   * Formula: (Completed Services / Total Services) × 100
   */
  calculateServiceCompletionRate(completedServices, totalServices) {
    if (!totalServices || totalServices === 0) return 0;
    return Math.round((completedServices / totalServices) * 100 * 100) / 100;
  }

  /**
   * Service Quality Index - Chỉ số chất lượng dịch vụ
   * Formula: (Satisfaction Score + Completion Rate + Efficiency Score) / 3
   */
  calculateServiceQualityIndex(
    satisfactionScore,
    completionRate,
    efficiencyScore
  ) {
    return (
      Math.round(
        ((satisfactionScore + completionRate + efficiencyScore) / 3) * 100
      ) / 100
    );
  }

  // ========================================
  // 7. DIGITAL ANALYTICS
  // ========================================

  /**
   * Website Conversion Rate - Tỷ lệ chuyển đổi website
   * Formula: (Website Conversions / Website Visitors) × 100
   */
  calculateWebsiteConversionRate(websiteVisitors, websiteConversions) {
    if (!websiteVisitors || websiteVisitors === 0) return 0;
    return Math.round((websiteConversions / websiteVisitors) * 100 * 100) / 100;
  }

  /**
   * Social Media Engagement Rate - Tỷ lệ tương tác mạng xã hội
   * Formula: (Likes + Comments + Shares) / Followers × 100
   */
  calculateSocialMediaEngagementRate(likes, comments, shares, followers) {
    if (!followers || followers === 0) return 0;
    const totalEngagement = likes + comments + shares;
    return Math.round((totalEngagement / followers) * 100 * 100) / 100;
  }

  /**
   * Digital Marketing ROI - ROI marketing số
   * Formula: (Digital Revenue - Digital Cost) / Digital Cost × 100
   */
  calculateDigitalMarketingROI(digitalRevenue, digitalCost) {
    if (!digitalCost || digitalCost === 0) return 0;
    return (
      Math.round(((digitalRevenue - digitalCost) / digitalCost) * 100 * 100) /
      100
    );
  }

  /**
   * App Usage Frequency - Tần suất sử dụng app
   * Formula: Total App Sessions / Active Users
   */
  calculateAppUsageFrequency(totalSessions, activeUsers) {
    if (!activeUsers || activeUsers === 0) return 0;
    return Math.round((totalSessions / activeUsers) * 100) / 100;
  }

  /**
   * App Feature Utilization - Sử dụng tính năng app
   * Formula: (Feature Usage / Total App Sessions) × 100
   */
  calculateAppFeatureUtilization(featureUsage, totalSessions) {
    if (!totalSessions || totalSessions === 0) return 0;
    return Math.round((featureUsage / totalSessions) * 100 * 100) / 100;
  }

  /**
   * App Retention Rate - Tỷ lệ giữ chân app
   * Formula: (Returning Users / Total Users) × 100
   */
  calculateAppRetentionRate(totalUsers, returningUsers) {
    if (!totalUsers || totalUsers === 0) return 0;
    return Math.round((returningUsers / totalUsers) * 100 * 100) / 100;
  }

  // ========================================
  // 8. PREDICTIVE ANALYTICS
  // ========================================

  /**
   * Demand Forecasting - Dự báo nhu cầu
   * Formula: Historical Average × Seasonal Factor × Growth Rate
   */
  calculateDemandForecasting(historicalAverage, seasonalFactor, growthRate) {
    return Math.round(
      historicalAverage * seasonalFactor * (1 + growthRate / 100)
    );
  }

  /**
   * Revenue Forecasting - Dự báo doanh thu
   * Formula: Current Revenue × (1 + Growth Rate) ^ Time Period
   */
  calculateRevenueForecasting(currentRevenue, growthRate, timePeriod) {
    return Math.round(
      currentRevenue * Math.pow(1 + growthRate / 100, timePeriod)
    );
  }

  /**
   * Capacity Planning - Lập kế hoạch năng lực
   * Formula: Current Capacity × Utilization Rate × Growth Factor
   */
  calculateCapacityPlanning(currentCapacity, utilizationRate, growthFactor) {
    return Math.round(currentCapacity * (utilizationRate / 100) * growthFactor);
  }

  /**
   * Churn Risk Score - Điểm rủi ro rời bỏ
   * Formula: Weighted factors (Activity, Payment, Engagement, Satisfaction)
   */
  calculateChurnRiskScore(memberData) {
    const weights = {
      activity: 0.25,
      payment: 0.3,
      engagement: 0.25,
      satisfaction: 0.2,
    };

    const activityScore = memberData.daysSinceLastActivity > 14 ? 0.8 : 0.2;
    const paymentScore = memberData.paymentDelays > 1 ? 0.9 : 0.1;
    const engagementScore = memberData.engagementLevel < 0.5 ? 0.7 : 0.3;
    const satisfactionScore = memberData.satisfactionScore < 3 ? 0.8 : 0.2;

    const riskScore =
      activityScore * weights.activity +
      paymentScore * weights.payment +
      engagementScore * weights.engagement +
      satisfactionScore * weights.satisfaction;

    return Math.round(riskScore * 100) / 100;
  }

  /**
   * Revenue Risk Assessment - Đánh giá rủi ro doanh thu
   * Formula: (Revenue Volatility / Average Revenue) × 100
   */
  calculateRevenueRiskAssessment(revenueVolatility, averageRevenue) {
    if (!averageRevenue || averageRevenue === 0) return 0;
    return Math.round((revenueVolatility / averageRevenue) * 100 * 100) / 100;
  }

  /**
   * Operational Risk Index - Chỉ số rủi ro vận hành
   * Formula: (Risk Factors / Total Factors) × 100
   */
  calculateOperationalRiskIndex(riskFactors, totalFactors) {
    if (!totalFactors || totalFactors === 0) return 0;
    return Math.round((riskFactors / totalFactors) * 100 * 100) / 100;
  }

  // ========================================
  // BATCH CALCULATION METHODS
  // ========================================

  /**
   * Calculate all visitor metrics
   */
  calculateVisitorMetrics(data) {
    return {
      visitorConversionRate: this.calculateVisitorConversionRate(
        data.totalVisitors,
        data.convertedVisitors
      ),
      visitorRetentionRate: this.calculateVisitorRetentionRate(
        data.totalVisitors,
        data.returningVisitors
      ),
      sourceEffectivenessRate: this.calculateSourceEffectivenessRate(
        data.sourceVisitors,
        data.sourceConversions
      ),
      sourceROI: this.calculateSourceROI(data.sourceRevenue, data.sourceCost),
    };
  }

  /**
   * Calculate all sales metrics
   */
  calculateSalesMetrics(data) {
    return {
      saleTiepRate: this.calculateSaleTiepRate(data.saleTiep, data.ptTiep),
      inbodyMeasurementRate: this.calculateInbodyMeasurementRate(
        data.saleTiep,
        data.inbodyMeasurements
      ),
      ptConversionRate: this.calculatePTConversionRate(
        data.saleTiep,
        data.ptTiep
      ),
      inbodyConversionRate: this.calculateInbodyConversionRate(
        data.ptTiep,
        data.inbodyMeasurements
      ),
      averageSalesCycle: this.calculateAverageSalesCycle(data.sales),
      salesVelocity: this.calculateSalesVelocity(
        data.numberOfSales,
        data.averageDealSize,
        data.salesCycleLength
      ),
    };
  }

  /**
   * Calculate all facility metrics
   */
  calculateFacilityMetrics(data) {
    return {
      floorSpaceUtilization: this.calculateFloorSpaceUtilization(
        data.usedSpace,
        data.totalSpace
      ),
      equipmentUtilizationRate: this.calculateEquipmentUtilizationRate(
        data.usageTime,
        data.availableTime
      ),
      lockerUtilization: this.calculateLockerUtilization(
        data.usedLockers,
        data.totalLockers
      ),
      peakHourRevenueConcentration: this.calculatePeakHourRevenueConcentration(
        data.peakHourRevenue,
        data.totalRevenue
      ),
      offPeakUtilization: this.calculateOffPeakUtilization(
        data.offPeakUsage,
        data.offPeakCapacity
      ),
    };
  }

  /**
   * Calculate all member analytics
   */
  calculateMemberAnalytics(data) {
    return {
      memberActivityScore: this.calculateMemberActivityScore(
        data.checkins,
        data.bookings,
        data.ptSessions
      ),
      memberEngagementLevel: this.calculateMemberEngagementLevel(
        data.totalInteractions,
        data.daysActive
      ),
      memberAcquisitionCostByChannel:
        this.calculateMemberAcquisitionCostByChannel(
          data.channelSpend,
          data.newMembers
        ),
      memberLifetimeValueBySegment: this.calculateMemberLifetimeValueBySegment(
        data.avgMonthlyRevenue,
        data.avgMembershipDuration
      ),
      memberChurnPredictionScore: this.calculateMemberChurnPredictionScore(
        data.memberData
      ),
    };
  }

  /**
   * Calculate all financial analytics
   */
  calculateFinancialAnalytics(data) {
    return {
      revenuePerSquareFoot: this.calculateRevenuePerSquareFoot(
        data.totalRevenue,
        data.totalSquareFootage
      ),
      revenueConcentrationIndex: this.calculateRevenueConcentrationIndex(
        data.top20Revenue,
        data.totalRevenue
      ),
      revenueGrowthAcceleration: this.calculateRevenueGrowthAcceleration(
        data.currentGrowthRate,
        data.previousGrowthRate
      ),
      costPerAcquisitionBySource: this.calculateCostPerAcquisitionBySource(
        data.sourceSpend,
        data.newMembers
      ),
      operationalCostRatio: this.calculateOperationalCostRatio(
        data.operationalCosts,
        data.totalRevenue
      ),
      profitMarginByService: this.calculateProfitMarginByService(
        data.serviceRevenue,
        data.serviceCosts
      ),
    };
  }

  /**
   * Calculate all performance metrics
   */
  calculatePerformanceMetrics(data) {
    return {
      staffProductivityIndex: this.calculateStaffProductivityIndex(
        data.revenueGenerated,
        data.staffHours
      ),
      staffRevenuePerHour: this.calculateStaffRevenuePerHour(
        data.totalRevenue,
        data.totalStaffHours
      ),
      staffUtilizationEfficiency: this.calculateStaffUtilizationEfficiency(
        data.productiveHours,
        data.totalHours
      ),
      serviceSatisfactionScore: this.calculateServiceSatisfactionScore(
        data.ratings
      ),
      serviceCompletionRate: this.calculateServiceCompletionRate(
        data.completedServices,
        data.totalServices
      ),
      serviceQualityIndex: this.calculateServiceQualityIndex(
        data.satisfactionScore,
        data.completionRate,
        data.efficiencyScore
      ),
    };
  }

  /**
   * Calculate all digital analytics
   */
  calculateDigitalAnalytics(data) {
    return {
      websiteConversionRate: this.calculateWebsiteConversionRate(
        data.websiteVisitors,
        data.websiteConversions
      ),
      socialMediaEngagementRate: this.calculateSocialMediaEngagementRate(
        data.likes,
        data.comments,
        data.shares,
        data.followers
      ),
      digitalMarketingROI: this.calculateDigitalMarketingROI(
        data.digitalRevenue,
        data.digitalCost
      ),
      appUsageFrequency: this.calculateAppUsageFrequency(
        data.totalSessions,
        data.activeUsers
      ),
      appFeatureUtilization: this.calculateAppFeatureUtilization(
        data.featureUsage,
        data.totalSessions
      ),
      appRetentionRate: this.calculateAppRetentionRate(
        data.totalUsers,
        data.returningUsers
      ),
    };
  }

  /**
   * Calculate all predictive analytics
   */
  calculatePredictiveAnalytics(data) {
    return {
      demandForecasting: this.calculateDemandForecasting(
        data.historicalAverage,
        data.seasonalFactor,
        data.growthRate
      ),
      revenueForecasting: this.calculateRevenueForecasting(
        data.currentRevenue,
        data.growthRate,
        data.timePeriod
      ),
      capacityPlanning: this.calculateCapacityPlanning(
        data.currentCapacity,
        data.utilizationRate,
        data.growthFactor
      ),
      churnRiskScore: this.calculateChurnRiskScore(data.memberData),
      revenueRiskAssessment: this.calculateRevenueRiskAssessment(
        data.revenueVolatility,
        data.averageRevenue
      ),
      operationalRiskIndex: this.calculateOperationalRiskIndex(
        data.riskFactors,
        data.totalFactors
      ),
    };
  }

  /**
   * Calculate all comprehensive metrics
   */
  calculateAllComprehensiveMetrics(data) {
    return {
      visitor: this.calculateVisitorMetrics(data.visitor || {}),
      sales: this.calculateSalesMetrics(data.sales || {}),
      facility: this.calculateFacilityMetrics(data.facility || {}),
      member: this.calculateMemberAnalytics(data.member || {}),
      financial: this.calculateFinancialAnalytics(data.financial || {}),
      performance: this.calculatePerformanceMetrics(data.performance || {}),
      digital: this.calculateDigitalAnalytics(data.digital || {}),
      predictive: this.calculatePredictiveAnalytics(data.predictive || {}),
    };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Format currency cho VNĐ
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Format percentage
   */
  formatPercentage(value) {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Format number với dấu phẩy
   */
  formatNumber(value) {
    return new Intl.NumberFormat("vi-VN").format(value);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export cho sử dụng global
window.ComprehensiveCalculations = ComprehensiveCalculations;

// Tạo instance global
window.comprehensiveCalculations = new ComprehensiveCalculations();

console.log("Comprehensive Calculations Engine loaded successfully");




