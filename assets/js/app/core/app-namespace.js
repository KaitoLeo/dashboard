(function (global) {
  const existing = global.App || {};

  const App = {
    models: existing.models || {},
    views: existing.views || {},
    controllers: existing.controllers || {},
    services: existing.services || {},
    utils: existing.utils || {},
    tests: existing.tests || {},
    core: existing.core || {},
    state: existing.state || {},
    modules: existing.modules || {},
    version: existing.version || "1.0.0",
  };

  App.core = App.core || {};
  App.core.register = function (category, name, implementation) {
    if (!category || !name) {
      console.warn("[App.core.register] missing category or name");
      return;
    }
    if (!App[category]) {
      App[category] = {};
    }
    App[category][name] = implementation;
  };

  App.core.resolve = function (category, name) {
    if (!category || !name) {
      return undefined;
    }
    return App[category] ? App[category][name] : undefined;
  };

  App.core.expose = function () {
    return {
      models: Object.keys(App.models),
      views: Object.keys(App.views),
      controllers: Object.keys(App.controllers),
      services: Object.keys(App.services),
      utils: Object.keys(App.utils),
      modules: Object.keys(App.modules),
    };
  };

  App.modules = App.modules || {};
  App.modules.register = function registerModule(moduleId, definition) {
    if (!moduleId) {
      console.warn("[App.modules.register] missing moduleId");
      return;
    }
    App.modules[moduleId] = Object.assign(
      { id: moduleId, handlers: {}, pages: [] },
      definition || {}
    );
  };

  global.App = App;
})(window);
