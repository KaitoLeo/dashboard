/**
 * Service Order - Standardized Service Ordering
 * Ensures consistent service order across all UI components
 */
(function (window) {
  "use strict";

  // Fixed order: Membership → PT Fitness → Pilates → Swimming Coach
  const SERVICE_ORDER = [
    "Membership",
    "PT Fitness",
    "Pilates",
    "Swimming Coach",
  ];

  // Create rank map for fast lookup
  const SERVICE_RANK = new Map();
  SERVICE_ORDER.forEach((service, index) => {
    SERVICE_RANK.set(service, index);
  });

  /**
   * Sort items by service order
   * @param {Array} items - Array of items to sort
   * @param {Function} getName - Function to extract service name from item
   * @returns {Array} Sorted array
   */
  function sortByServiceOrder(
    items,
    getName = (item) => item?.serviceName || item
  ) {
    if (!items || !Array.isArray(items)) return [];

    return [...items].sort((a, b) => {
      const nameA = getName(a);
      const nameB = getName(b);

      const rankA = SERVICE_RANK.get(nameA) ?? 999;
      const rankB = SERVICE_RANK.get(nameB) ?? 999;

      return rankA - rankB;
    });
  }

  /**
   * Sort chart series by service order
   * Assumes series have a `name` property
   */
  function sortSeries(series) {
    return sortByServiceOrder(series, (s) => s?.name);
  }

  /**
   * Get service rank (lower is higher priority)
   * @param {string} serviceName - Service name
   * @returns {number} Rank (0-based)
   */
  function getServiceRank(serviceName) {
    return SERVICE_RANK.get(serviceName) ?? 999;
  }

  /**
   * Sort object keys by service order
   * @param {Object} obj - Object with service names as keys
   * @returns {Object} New object with sorted keys
   */
  function sortObjectKeys(obj) {
    if (!obj || typeof obj !== "object") return obj;

    const sortedKeys = Object.keys(obj).sort((a, b) => {
      const rankA = SERVICE_RANK.get(a) ?? 999;
      const rankB = SERVICE_RANK.get(b) ?? 999;
      return rankA - rankB;
    });

    const sorted = {};
    sortedKeys.forEach((key) => {
      sorted[key] = obj[key];
    });

    return sorted;
  }

  /**
   * Get service color by name
   * Returns consistent colors for each service
   */
  function getServiceColor(serviceName) {
    const colorMap = {
      Membership: "#556ee6", // Blue
      "PT Fitness": "#34c38f", // Green
      Pilates: "#f1b44c", // Yellow
      "Swimming Coach": "#50a5f1", // Light Blue
    };

    return colorMap[serviceName] || "#95a5a6"; // Default gray
  }

  /**
   * Get all service names in order
   */
  function getAllServices() {
    return [...SERVICE_ORDER];
  }

  /**
   * Check if service name is valid
   */
  function isValidService(serviceName) {
    return SERVICE_RANK.has(serviceName);
  }

  // Expose to window
  window.ServiceOrder = {
    ORDER: SERVICE_ORDER,
    sortByServiceOrder,
    sortSeries,
    getServiceRank,
    sortObjectKeys,
    getServiceColor,
    getAllServices,
    isValidService,
  };

  // Also expose as ServiceOrderModule for consistency
  window.ServiceOrderModule = window.ServiceOrder;

  console.log("✅ ServiceOrder module ready");
})(window);

