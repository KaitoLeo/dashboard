/**
 * Labels - Vietnamese Time Label Capitalization
 * Wrapper for time-label-vi.js with additional utilities
 */
(function (window) {
  "use strict";

  const TIME_LABEL_MAP = {
    today: "Hôm nay",
    yesterday: "Hôm qua",
    week: "Tuần này",
    thisweek: "Tuần này",
    lastweek: "Tuần trước",
    month: "Tháng này",
    thismonth: "Tháng này",
    lastmonth: "Tháng trước",
    mtd: "MTD",
    year: "Năm nay",
    thisyear: "Năm nay",
    lastyear: "Năm trước",
    "hôm nay": "Hôm nay",
    "hôm qua": "Hôm qua",
    "tuần này": "Tuần này",
    "tuần trước": "Tuần trước",
    "tháng này": "Tháng này",
    "tháng trước": "Tháng trước",
    "năm nay": "Năm nay",
    "năm trước": "Năm trước",
  };

  /**
   * Capitalize Vietnamese time labels
   * @param {string} label - Time label (today, yesterday, etc.)
   * @returns {string} Capitalized label
   */
  function capitalizeVi(label) {
    if (!label || typeof label !== "string") return label || "";

    const normalized = label.trim().toLowerCase();
    return TIME_LABEL_MAP[normalized] || label;
  }

  /**
   * Get time label from timeKey
   * @param {string} timeKey - Time key from state
   * @returns {string} Formatted Vietnamese label
   */
  function getTimeLabel(timeKey) {
    return capitalizeVi(timeKey);
  }

  /**
   * Format date range for display
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {string} Formatted date range
   */
  function formatDateRange(from, to) {
    if (!from || !to) return "";

    const formatDate = (d) => {
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    if (from.toDateString() === to.toDateString()) {
      return formatDate(from);
    }

    return `${formatDate(from)} - ${formatDate(to)}`;
  }

  /**
   * Format number as Vietnamese currency
   * @param {number} amount - Amount in VND
   * @returns {string} Formatted currency string
   */
  function formatCurrency(amount) {
    if (amount == null || isNaN(amount)) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Format number with thousand separators
   * @param {number} num - Number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number
   */
  function formatNumber(num, decimals = 0) {
    if (num == null || isNaN(num)) return "0";
    return new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  /**
   * Format percentage
   * @param {number} value - Value between 0 and 1
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage
   */
  function formatPercent(value, decimals = 1) {
    if (value == null || isNaN(value)) return "0%";
    return (value * 100).toFixed(decimals) + "%";
  }

  /**
   * Format time from minutes since midnight
   * @param {number} minutes - Minutes since midnight
   * @returns {string} Formatted time (HH:mm)
   */
  function formatTime(minutes) {
    if (minutes == null || isNaN(minutes)) return "00:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  // Expose to window
  window.Labels = {
    capitalizeVi,
    getTimeLabel,
    formatDateRange,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatTime,
  };

  // Also expose as LabelsModule for consistency
  window.LabelsModule = window.Labels;

  console.log("✅ Labels module ready");
})(window);

