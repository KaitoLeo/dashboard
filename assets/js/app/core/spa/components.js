(function (global) {
  if (global.AppSPAComponents) {
    return;
  }

  const registry = new Map();

  function register(name, definition) {
    if (!name || typeof name !== "string") {
      console.warn("[AppSPAComponents] missing component name");
      return;
    }
    if (!definition || typeof definition.render !== "function") {
      console.warn("[AppSPAComponents] missing render implementation for", name);
      return;
    }
    registry.set(name, definition);
  }

  function unregister(name) {
    registry.delete(name);
  }

  function get(name) {
    return registry.get(name);
  }

  function has(name) {
    return registry.has(name);
  }

  function render(name, props) {
    const definition = registry.get(name);
    if (!definition) {
      console.warn("[AppSPAComponents] component not found", name);
      return "";
    }
    try {
      return definition.render(props || {});
    } catch (error) {
      console.error("[AppSPAComponents] render failed", name, error);
      return "";
    }
  }

  function mount(name, target, props) {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!element) {
      console.warn("[AppSPAComponents] mount target not found", target);
      return null;
    }
    const markup = render(name, props);
    if (definitionHasBeforeMount(name)) {
      callHook(name, "beforeMount", { element, props });
    }
    element.innerHTML = markup;
    if (definitionHasAfterMount(name)) {
      callHook(name, "afterMount", { element, props });
    }
    return element;
  }

  function definitionHasBeforeMount(name) {
    const definition = registry.get(name);
    return definition && typeof definition.beforeMount === "function";
  }

  function definitionHasAfterMount(name) {
    const definition = registry.get(name);
    return definition && typeof definition.afterMount === "function";
  }

  function callHook(name, hook, payload) {
    const definition = registry.get(name);
    if (!definition) {
      return;
    }
    try {
      definition[hook](payload);
    } catch (error) {
      console.error(`[AppSPAComponents] ${hook} hook failed`, name, error);
    }
  }

  global.AppSPAComponents = {
    register,
    unregister,
    get,
    has,
    render,
    mount,
  };
})(window);
