(function (w) {
  // Service order for consistent display across all pages
  w.SERVICE_ORDER = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"];

  // Storage key for persisting state
  w.STORAGE_KEY = "actiwell:data:v1";

  // URL parameters that should be preserved across navigation
  w.URL_KEYS = ["timeKey", "from", "to", "location", "department", "service"];

  // Time key mappings
  w.TIME_KEYS = {
    today: "today",
    yesterday: "yesterday",
    week: "week",
    mtd: "mtd",
    month: "month",
    ytd: "ytd",
    year: "year",
  };

  // Location mappings
  w.LOCATIONS = {
    all: "Tất cả trung tâm",
    "ton-that-thuyet": "Tôn Thất Thuyết",
    "huynh-thuc-khang": "Huỳnh Thúc Kháng",
    "giang-vo": "Giảng Võ",
    "hao-nam": "Hào Nam",
    "nguyen-tuan": "Nguyễn Tuân",
  };

  // Department mappings
  w.DEPARTMENTS = {
    all: "Tất cả bộ phận",
    membership: "Membership",
    fitness: "PT Fitness",
    pool: "Swimming Coach",
    pilates: "Pilates",
    operation: "Operation",
  };

  // Service mappings
  w.SERVICES = {
    all: "Tất cả dịch vụ",
    membership: "Membership",
    "pt-fitness": "PT Fitness",
    pilates: "Pilates",
    "swimming-coach": "Swimming Coach",
  };
})(window);









