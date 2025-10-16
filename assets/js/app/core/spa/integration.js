(function (global) {
  if (global.AppSPA) {
    return;
  }

  const linkSelector = "[data-spa-link]";
  let initialized = false;

  function ensureDependencies() {
    const missing = [];
    if (!global.AppSPARouter) {
      missing.push("AppSPARouter");
    }
    if (!global.AppSPAStore) {
      missing.push("AppSPAStore");
    }
    if (!global.AppSPAComponents) {
      missing.push("AppSPAComponents");
    }
    if (missing.length) {
      console.warn(
        "[AppSPA] missing dependencies:",
        missing.join(", ")
      );
      return false;
    }
    return true;
  }

  function init() {
    if (initialized) {
      return;
    }
    if (!ensureDependencies()) {
      return;
    }
    attachLinkHandler();
    attachHashBootstrap();
    initialized = true;
  }

  function attachLinkHandler() {
    document.addEventListener("click", function (event) {
      const target = event.target.closest(linkSelector);
      if (!target) {
        return;
      }
      const route = target.getAttribute("data-spa-link");
      if (!route) {
        return;
      }
      event.preventDefault();
      const params = collectParams(target);
      global.AppSPARouter.navigate(route, { params, meta: { source: "link" } });
    });
  }

  function attachHashBootstrap() {
    const handler = () => {
      const hash = global.location.hash || "#/";
      const [pathPart, queryPart] = hash.replace(/^#/, "").split("?");
      const params = queryPart
        ? Object.fromEntries(new URLSearchParams(queryPart))
        : {};
      if (global.AppSPARouter) {
        global.AppSPARouter.navigate(pathPart || "/", { params });
      }
    };
    global.addEventListener("hashchange", handler);
    document.addEventListener("DOMContentLoaded", handler, { once: true });
  }

  function collectParams(element) {
    const dataAttributes = Array.from(element.attributes).filter((attr) =>
      attr.name.startsWith("data-spa-param-")
    );
    return dataAttributes.reduce((accumulator, attribute) => {
      const key = attribute.name.replace("data-spa-param-", "");
      accumulator[key] = attribute.value;
      return accumulator;
    }, {});
  }

  function registerRoute(path, handler) {
    if (!global.AppSPARouter) {
      return;
    }
    global.AppSPARouter.register(path, handler);
  }

  function mountComponent(name, target, props) {
    if (!global.AppSPAComponents) {
      return null;
    }
    return global.AppSPAComponents.mount(name, target, props);
  }

  function setContext(key, value) {
    if (!global.AppSPAStore) {
      return;
    }
    global.AppSPAStore.setContext(key, value);
  }

  function subscribe(listener) {
    if (!global.AppSPAStore) {
      return () => {};
    }
    return global.AppSPAStore.subscribe(listener);
  }

  document.addEventListener("DOMContentLoaded", init);

  global.AppSPA = {
    init,
    registerRoute,
    mountComponent,
    setContext,
    subscribe,
  };
})(window);
