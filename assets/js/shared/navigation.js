(function (w) {
  // Navigation helper with state preservation
  function navigateTo(targetPath, options = {}) {
    if (!DataSync.isInitialized()) {
      console.warn("Data layer not initialized, using direct navigation");
      window.location.href = targetPath;
      return;
    }

    try {
      const currentState = SharedState.getState();
      const url = Persist.getNavigationURL(targetPath, currentState);

      // Add additional query parameters if provided
      if (options.params) {
        const urlObj = new URL(url, location.origin);
        Object.keys(options.params).forEach((key) => {
          urlObj.searchParams.set(key, options.params[key]);
        });
        const finalUrl = urlObj.pathname + urlObj.search;

        if (options.replace) {
          window.location.replace(finalUrl);
        } else {
          window.location.href = finalUrl;
        }
        return;
      }

      // Use navigateTo if available (SPA routing)
      if (window.navigateTo) {
        window.navigateTo("legacy:" + url);
      } else {
        if (options.replace) {
          window.location.replace(url);
        } else {
          window.location.href = url;
        }
      }
    } catch (e) {
      console.error("Navigation with state failed:", e);
      window.location.href = targetPath;
    }
  }

  // Navigate with specific state updates
  function navigateWithState(targetPath, stateUpdates = {}) {
    if (!DataSync.isInitialized()) {
      console.warn("Data layer not initialized, using direct navigation");
      window.location.href = targetPath;
      return;
    }

    try {
      // Update state first
      SharedState.setState(stateUpdates);

      // Then navigate
      navigateTo(targetPath);
    } catch (e) {
      console.error("Navigation with state updates failed:", e);
      window.location.href = targetPath;
    }
  }

  // Navigate back with state preservation
  function navigateBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo("../index.html");
    }
  }

  // Get current URL with state
  function getCurrentURLWithState() {
    if (!DataSync.isInitialized()) {
      return location.href;
    }

    try {
      const currentState = SharedState.getState();
      const url = new URL(location.href);

      URL_KEYS.forEach((k) => {
        const v = currentState[k];
        if (v && v !== "" && v !== "all") {
          url.searchParams.set(k, v);
        } else {
          url.searchParams.delete(k);
        }
      });

      return url.toString();
    } catch (e) {
      console.error("Failed to get current URL with state:", e);
      return location.href;
    }
  }

  // Update current URL with state (without navigation)
  function updateCurrentURLWithState() {
    if (!DataSync.isInitialized()) {
      return;
    }

    try {
      const currentState = SharedState.getState();
      Persist.writeURL(currentState);
    } catch (e) {
      console.error("Failed to update current URL with state:", e);
    }
  }

  // Get navigation URL for a target path
  function getNavigationURL(targetPath) {
    if (!DataSync.isInitialized()) {
      return targetPath;
    }

    try {
      const currentState = SharedState.getState();
      return Persist.getNavigationURL(targetPath, currentState);
    } catch (e) {
      console.error("Failed to get navigation URL:", e);
      return targetPath;
    }
  }

  // Check if current page matches a pattern
  function isCurrentPage(pattern) {
    return location.pathname.includes(pattern);
  }

  // Get current page name
  function getCurrentPageName() {
    const path = location.pathname;
    const segments = path.split("/");
    return segments[segments.length - 1].replace(".html", "");
  }

  // Navigation history helpers
  function addToHistory(state) {
    try {
      const url = getCurrentURLWithState();
      window.history.pushState(state, "", url);
    } catch (e) {
      console.error("Failed to add to history:", e);
    }
  }

  function replaceHistory(state) {
    try {
      const url = getCurrentURLWithState();
      window.history.replaceState(state, "", url);
    } catch (e) {
      console.error("Failed to replace history:", e);
    }
  }

  // Export navigation API
  w.Navigation = {
    navigateTo,
    navigateWithState,
    navigateBack,
    getCurrentURLWithState,
    updateCurrentURLWithState,
    getNavigationURL,
    isCurrentPage,
    getCurrentPageName,
    addToHistory,
    replaceHistory,
  };

  // Global navigation function for backward compatibility
  w.navigateToPage = navigateTo;
})(window);
