(function (global) {
  const App = global.App || {};

  App.modules = App.modules || {};
  App.modules.register?.("03-06-reports", {
    name: "Reports & Audit",
    pages: [{ code: "03-06-01", patterns: ["receipt", "audit"] }],
    handlers: {},
  });
})(window);
