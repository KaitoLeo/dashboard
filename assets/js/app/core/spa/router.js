(function (global) {
  if (global.AppSPARouter) {
    return;
  }

  const routes = new Map();

  function normalize(path) {
    if (!path) {
      return "/";
    }
    const trimmed = path.trim();
    if (!trimmed) {
      return "/";
    }
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  function register(path, handler) {
    const normalized = normalize(path);
    if (typeof handler !== "function") {
      console.warn("[AppSPARouter] invalid handler for", normalized);
      return;
    }
    routes.set(normalized, handler);
  }

  function unregister(path) {
    routes.delete(normalize(path));
  }

  function resolve(path) {
    const normalized = normalize(path);
    if (routes.has(normalized)) {
      return {
        handler: routes.get(normalized),
        params: {},
      };
    }

    for (const [route, handler] of routes.entries()) {
      const match = matchDynamicRoute(route, normalized);
      if (match) {
        return { handler, params: match };
      }
    }

    return null;
  }

  function matchDynamicRoute(pattern, path) {
    const patternSegments = pattern.split("/").filter(Boolean);
    const pathSegments = path.split("/").filter(Boolean);
    if (patternSegments.length !== pathSegments.length) {
      return null;
    }
    const params = {};
    for (let i = 0; i < patternSegments.length; i += 1) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];
      if (patternSegment.startsWith(":")) {
        params[patternSegment.substring(1)] = decodeURIComponent(pathSegment);
      } else if (patternSegment !== pathSegment) {
        return null;
      }
    }
    return params;
  }

  function navigate(targetPath, options = {}) {
    const resolution = resolve(targetPath);
    if (!resolution) {
      console.warn("[AppSPARouter] route not found", targetPath);
      dispatchRouteChange(targetPath, options.params || {}, false);
      return;
    }
    const params = options.params || resolution.params || {};
    try {
      resolution.handler({
        path: normalize(targetPath),
        params,
        meta: options.meta || {},
      });
      dispatchRouteChange(targetPath, params, true);
    } catch (error) {
      console.error("[AppSPARouter] handler failed", targetPath, error);
      dispatchRouteChange(targetPath, params, false, error);
    }
  }

  function dispatchRouteChange(path, params, success, error) {
    if (global.AppSPAStore && typeof global.AppSPAStore.setRoute === "function") {
      global.AppSPAStore.setRoute(path, params);
    }
    const event = new CustomEvent("spa:navigate", {
      detail: { path: normalize(path), params, success, error },
    });
    global.dispatchEvent(event);
  }

  function listRoutes() {
    return Array.from(routes.keys());
  }

  global.AppSPARouter = {
    register,
    unregister,
    navigate,
    resolve,
    listRoutes,
  };
})(window);
