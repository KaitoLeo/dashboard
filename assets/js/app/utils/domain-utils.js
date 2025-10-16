// Shared domain helpers for module controllers
(function (global) {
  global.App = global.App || {};
  global.App.utils = global.App.utils || {};

  const locations = {
    all: "Tất cả trung tâm",
    "ton-that-thuyet": "Tôn Thất Thuyết",
    "huynh-thuc-khang": "Huỳnh Thúc Kháng",
    "giang-vo": "Giảng Võ",
    "hao-nam": "Hào Nam",
    "nguyen-tuan": "Nguyễn Tuấn",
  };

  const departments = {
    all: "Tất cả bộ phận",
    membership: "Membership",
    fitness: "Fitness",
    pool: "Swimming Coach",
    pilates: "Pilates",
    operation: "Operation",
  };

  function getLocationName(locationId) {
    return locations[locationId] || locations.all;
  }

  function getDepartmentName(departmentId) {
    return departments[departmentId] || departments.all;
  }

  function formatNumber(value) {
    if (typeof value !== "number") {
      return value;
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  }

  function formatPercentage(value, fractionDigits = 1) {
    if (typeof value !== "number") {
      return value;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "percent",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value / 100);
  }

  global.App.utils.domain = {
    getLocationName,
    getDepartmentName,
    formatNumber,
    formatPercentage,
  };
})(window);
