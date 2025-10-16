(function (global) {
  if (global.AppSPAStore) {
    return;
  }

  const state = {
    route: null,
    params: {},
    context: {},
  };

  const subscribers = new Set();

  function notify() {
    const snapshot = getState();
    subscribers.forEach((subscriber) => {
      try {
        subscriber(snapshot);
      } catch (error) {
        console.error("[AppSPAStore] subscriber failed", error);
      }
    });
  }

  function getState() {
    return {
      route: state.route,
      params: { ...state.params },
      context: { ...state.context },
    };
  }

  function setState(partialState = {}) {
    Object.assign(state, partialState);
    notify();
  }

  function setRoute(route, params = {}) {
    state.route = route;
    state.params = { ...params };
    notify();
  }

  function setContext(key, value) {
    if (!key) {
      return;
    }
    state.context[key] = value;
    notify();
  }

  function clearContext(key) {
    if (key) {
      delete state.context[key];
    } else {
      state.context = {};
    }
    notify();
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  }

  global.AppSPAStore = {
    getState,
    setState,
    setRoute,
    setContext,
    clearContext,
    subscribe,
  };
})(window);
