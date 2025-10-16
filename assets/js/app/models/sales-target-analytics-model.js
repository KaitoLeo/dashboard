/**
 * Sales Target Analytics
 * TÃ­ch há»£p vá»›i API backend Ä‘á»ƒ tÃ­nh má»¥c tiÃªu cÃ²n láº¡i vÃ  cáº§n Ä‘áº¡t/ngÃ y theo cÆ¡ sá»Ÿ
 */

window.App = window.App || {};
window.App.models = window.App.models || {};

class SalesTargetAnalytics {
  constructor() {
    this.apiBaseUrl = "http://localhost:8000/api"; // Backend Laravel default port
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 phÃºt
  }

  /**
   * Láº¥y má»¥c tiÃªu cÃ²n láº¡i theo cÆ¡ sá»Ÿ
   * TÆ°Æ¡ng Ä‘Æ°Æ¡ng SQL: Má»¥c tiÃªu cÃ²n láº¡i theo cÆ¡ sá»Ÿ
   */
  async getRemainingTargetsByLocation() {
    const cacheKey = "remaining_targets";

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/sales-targets/remaining`
      );
      const result = await response.json();

      if (result.success) {
        this.cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
        });
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching remaining targets:", error);
      return this.getMockRemainingTargets();
    }
  }

  /**
   * Láº¥y cáº§n Ä‘áº¡t/ngÃ y theo cÆ¡ sá»Ÿ
   * TÆ°Æ¡ng Ä‘Æ°Æ¡ng SQL: Cáº§n Ä‘áº¡t/ngÃ y theo tá»«ng cÆ¡ sá»Ÿ
   */
  async getDailyTargetsByLocation() {
    const cacheKey = "daily_targets";

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/sales-targets/daily`);
      const result = await response.json();

      if (result.success) {
        this.cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
        });
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching daily targets:", error);
      return this.getMockDailyTargets();
    }
  }

  /**
   * Láº¥y tá»•ng há»£p má»¥c tiÃªu (remaining + daily)
   */
  async getTargetsSummary() {
    const cacheKey = "targets_summary";

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/sales-targets/summary`);
      const result = await response.json();

      if (result.success) {
        this.cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
        });
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching targets summary:", error);
      return this.getMockTargetsSummary();
    }
  }

  /**
   * Láº¥y tá»‰ lá»‡ hoÃ n thÃ nh theo cÆ¡ sá»Ÿ
   */
  async getCompletionRatesByLocation() {
    const cacheKey = "completion_rates";

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/sales-targets/completion-rates`
      );
      const result = await response.json();

      if (result.success) {
        this.cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
        });
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching completion rates:", error);
      return this.getMockCompletionRates();
    }
  }

  /**
   * Mock data cho remaining targets (fallback khi API khÃ´ng kháº£ dá»¥ng)
   */
  getMockRemainingTargets() {
    return [
      {
        location_id: 1,
        location_name: "TÃ´n Tháº¥t Thuyáº¿t",
        target_amount: 600000000,
        mtd_revenue: 450000000,
        remaining_target: 150000000,
      },
      {
        location_id: 2,
        location_name: "Huá»³nh ThÃºc Khang",
        target_amount: 500000000,
        mtd_revenue: 380000000,
        remaining_target: 120000000,
      },
      {
        location_id: 3,
        location_name: "CÆ¡ sá»Ÿ 3",
        target_amount: 450000000,
        mtd_revenue: 320000000,
        remaining_target: 130000000,
      },
      {
        location_id: 4,
        location_name: "CÆ¡ sá»Ÿ 4",
        target_amount: 400000000,
        mtd_revenue: 280000000,
        remaining_target: 120000000,
      },
      {
        location_id: 5,
        location_name: "CÆ¡ sá»Ÿ 5",
        target_amount: 350000000,
        mtd_revenue: 250000000,
        remaining_target: 100000000,
      },
    ];
  }

  /**
   * Mock data cho daily targets (fallback khi API khÃ´ng kháº£ dá»¥ng)
   */
  getMockDailyTargets() {
    return [
      {
        location_id: 1,
        location_name: "TÃ´n Tháº¥t Thuyáº¿t",
        target_amount: 600000000,
        mtd_revenue: 450000000,
        daily_target_required: 5000000,
      },
      {
        location_id: 2,
        location_name: "Huá»³nh ThÃºc Khang",
        target_amount: 500000000,
        mtd_revenue: 380000000,
        daily_target_required: 4000000,
      },
      {
        location_id: 3,
        location_name: "CÆ¡ sá»Ÿ 3",
        target_amount: 450000000,
        mtd_revenue: 320000000,
        daily_target_required: 4333333,
      },
      {
        location_id: 4,
        location_name: "CÆ¡ sá»Ÿ 4",
        target_amount: 400000000,
        mtd_revenue: 280000000,
        daily_target_required: 4000000,
      },
      {
        location_id: 5,
        location_name: "CÆ¡ sá»Ÿ 5",
        target_amount: 350000000,
        mtd_revenue: 250000000,
        daily_target_required: 3333333,
      },
    ];
  }

  /**
   * Mock data cho targets summary (fallback khi API khÃ´ng kháº£ dá»¥ng)
   */
  getMockTargetsSummary() {
    const remaining = this.getMockRemainingTargets();
    const daily = this.getMockDailyTargets();

    return remaining.map((item, index) => ({
      ...item,
      daily_target_required: daily[index]?.daily_target_required || 0,
    }));
  }

  /**
   * Mock data cho completion rates (fallback khi API khÃ´ng kháº£ dá»¥ng)
   */
  getMockCompletionRates() {
    return [
      {
        location_id: 1,
        location_name: "TÃ´n Tháº¥t Thuyáº¿t",
        target_amount: 600000000,
        mtd_revenue: 450000000,
        remaining_target: 150000000,
        completion_rate: 75.0,
      },
      {
        location_id: 2,
        location_name: "Huá»³nh ThÃºc Khang",
        target_amount: 500000000,
        mtd_revenue: 380000000,
        remaining_target: 120000000,
        completion_rate: 76.0,
      },
      {
        location_id: 3,
        location_name: "CÆ¡ sá»Ÿ 3",
        target_amount: 450000000,
        mtd_revenue: 320000000,
        remaining_target: 130000000,
        completion_rate: 71.1,
      },
      {
        location_id: 4,
        location_name: "CÆ¡ sá»Ÿ 4",
        target_amount: 400000000,
        mtd_revenue: 280000000,
        remaining_target: 120000000,
        completion_rate: 70.0,
      },
      {
        location_id: 5,
        location_name: "CÆ¡ sá»Ÿ 5",
        target_amount: 350000000,
        mtd_revenue: 250000000,
        remaining_target: 100000000,
        completion_rate: 71.4,
      },
    ];
  }

  /**
   * Format sá»‘ tiá»n VNÄ
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
   * Format sá»‘ tiá»n Ä‘Æ¡n giáº£n (chá»‰ sá»‘)
   */
  formatNumber(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export for use in other files
window.SalesTargetAnalytics = SalesTargetAnalytics;
window.App.models.salesTargetAnalytics = SalesTargetAnalytics;
