// assets/js/app/utils/common/service-order.js
(function (global) {
  "use strict";
  const ORDER = ["Membership", "PT Fitness", "Pilates", "Swimming Coach"];
  const RANK = new Map(ORDER.map((v, i) => [v, i]));
  function sortByServiceOrder(items, getName = (x) => x?.serviceName ?? x) {
    return [...(items || [])].sort((a, b) => {
      const ra = RANK.get(getName(a)) ?? 999;
      const rb = RANK.get(getName(b)) ?? 999;
      return ra - rb;
    });
  }
  function orderSeries(series) {
    return sortByServiceOrder(series, (s) => s?.name ?? s);
  }
  global.ServiceOrder = { ORDER, sortByServiceOrder, orderSeries };
  global.App = global.App || {};
  global.App.utils = global.App.utils || {};
  global.App.utils.serviceOrder = { ORDER, sortByServiceOrder, orderSeries };
})(window);



