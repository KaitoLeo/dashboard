// assets/js/app/utils/common/time-label-vi.js
(function (global) {
  "use strict";
  const MAP = {
    "hÃ´m nay": "HÃ´m nay",
    "hÃ´m qua": "HÃ´m qua",
    "thÃ¡ng nÃ y": "ThÃ¡ng nÃ y",
    "thÃ¡ng trÆ°á»›c": "ThÃ¡ng trÆ°á»›c",
    "nÄƒm nay": "NÄƒm nay",
    "nÄƒm trÆ°á»›c": "NÄƒm trÆ°á»›c",
    "tuáº§n nÃ y": "Tuáº§n nÃ y",
    "tuáº§n trÆ°á»›c": "Tuáº§n trÆ°á»›c",
  };
  function capitalizeTimeLabelVi(s) {
    if (!s || typeof s !== "string") return s;
    const lower = s.normalize("NFC").toLowerCase();
    return MAP[lower] || s.charAt(0).toUpperCase() + s.slice(1);
  }
  global.TimeLabelVi = { capitalize: capitalizeTimeLabelVi };
  global.App = global.App || {};
  global.App.utils = global.App.utils || {};
  global.App.utils.timeLabelVi = { capitalize: capitalizeTimeLabelVi };
})(window);



