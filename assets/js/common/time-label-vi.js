// assets/js/common/time-label-vi.js
(function (global) {
  "use strict";
  const MAP = {
    "hôm nay": "Hôm nay",
    "hôm qua": "Hôm qua",
    "tháng này": "Tháng này",
    "tháng trước": "Tháng trước",
    "năm nay": "Năm nay",
    "năm trước": "Năm trước",
    "tuần này": "Tuần này",
    "tuần trước": "Tuần trước",
  };
  function capitalizeTimeLabelVi(s) {
    if (!s || typeof s !== "string") return s;
    const lower = s.normalize("NFC").toLowerCase();
    return MAP[lower] || s.charAt(0).toUpperCase() + s.slice(1);
  }
  global.TimeLabelVi = { capitalize: capitalizeTimeLabelVi };
})(window);

