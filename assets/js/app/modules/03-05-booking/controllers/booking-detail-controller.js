(function (global) {
  const App = global.App || {};

  App.modules = App.modules || {};
  App.modules.register?.("03-05-booking", {
    name: "Booking Management",
    pages: [{ code: "03-05-01", patterns: ["booking-"] }],
    handlers: {},
  });
})(window);
