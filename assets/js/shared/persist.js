(function (w) {
  // Save state to localStorage
  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state to localStorage:", e);
    }
  }

  // Load state from localStorage
  function load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn("Failed to load state from localStorage:", e);
      return {};
    }
  }

  // Apply state from URL parameters
  function applyFromURL() {
    const u = new URL(location.href);
    const s = {};

    URL_KEYS.forEach((k) => {
      const v = u.searchParams.get(k);
      if (v !== null && v !== "") {
        s[k] = v;
      }
    });

    return s;
  }

  // Write state to URL parameters
  function writeURL(state) {
    try {
      const u = new URL(location.href);

      URL_KEYS.forEach((k) => {
        const v = state[k];
        if (v && v !== "" && v !== "all") {
          u.searchParams.set(k, v);
        } else {
          u.searchParams.delete(k);
        }
      });

      // Update URL without page reload
      history.replaceState({}, "", u.toString());
    } catch (e) {
      console.warn("Failed to write state to URL:", e);
    }
  }

  // Clear all persisted data
  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Clear URL parameters
      const u = new URL(location.href);
      URL_KEYS.forEach((k) => u.searchParams.delete(k));
      history.replaceState({}, "", u.toString());
    } catch (e) {
      console.warn("Failed to clear persisted data:", e);
    }
  }

  // Get URL for navigation with current state
  function getNavigationURL(targetPath, state) {
    try {
      const u = new URL(targetPath, location.origin);

      URL_KEYS.forEach((k) => {
        const v = state[k];
        if (v && v !== "" && v !== "all") {
          u.searchParams.set(k, v);
        }
      });

      return u.pathname + u.search;
    } catch (e) {
      console.warn("Failed to generate navigation URL:", e);
      return targetPath;
    }
  }

  // Check if localStorage is available
  function isStorageAvailable() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get storage usage info
  function getStorageInfo() {
    if (!isStorageAvailable()) {
      return { available: false };
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const size = data ? new Blob([data]).size : 0;
      const quota = 5 * 1024 * 1024; // 5MB estimate

      return {
        available: true,
        used: size,
        quota: quota,
        percentage: (size / quota) * 100,
      };
    } catch (e) {
      return { available: false, error: e.message };
    }
  }

  // Export state to JSON (for backup/debugging)
  function exportState(state) {
    return JSON.stringify(state, null, 2);
  }

  // Import state from JSON
  function importState(jsonString) {
    try {
      const state = JSON.parse(jsonString);
      return state;
    } catch (e) {
      console.error("Failed to import state:", e);
      return null;
    }
  }

  w.Persist = {
    save,
    load,
    applyFromURL,
    writeURL,
    clear,
    getNavigationURL,
    isStorageAvailable,
    getStorageInfo,
    exportState,
    importState,
  };
})(window);









