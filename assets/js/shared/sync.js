(function (w) {
  let _isInitialized = false;
  let _broadcastChannel = null;

  // Initialize the data layer
  function initDataLayer() {
    if (_isInitialized) {
      console.warn("Data layer already initialized");
      return;
    }

    try {
      // 1. Apply state from URL (highest priority)
      const urlPatch = Persist.applyFromURL();

      // 2. Load saved state from localStorage
      const saved = Persist.load();

      // 3. Merge with defaults (URL overrides saved, saved overrides defaults)
      const base = { ...saved, ...urlPatch };

      // 4. Normalize timeKey
      if (base.timeKey) {
        base.timeKey = TimeUtils.normalizeTimeKey(base.timeKey);
      }

      // 5. Set initial state
      SharedState.setState(base);

      // 6. Update URL to reflect current state
      Persist.writeURL(SharedState.getState());

      // 7. Save current state
      Persist.save(SharedState.getState());

      // 8. Setup cross-tab synchronization
      setupCrossTabSync();

      // 9. Setup storage listener
      setupStorageListener();

      _isInitialized = true;
      console.log("Data layer initialized successfully");
    } catch (e) {
      console.error("Failed to initialize data layer:", e);
    }
  }

  // Setup cross-tab synchronization using BroadcastChannel
  function setupCrossTabSync() {
    try {
      _broadcastChannel = new BroadcastChannel("actiwell-sync");

      // Listen for state changes from other tabs
      _broadcastChannel.onmessage = (event) => {
        if (event && event.data) {
          try {
            SharedState.setState(event.data);
          } catch (e) {
            console.error("Failed to apply state from broadcast:", e);
          }
        }
      };

      // Broadcast state changes to other tabs
      SharedState.subscribe((newState) => {
        try {
          Persist.save(newState);
          if (_broadcastChannel) {
            _broadcastChannel.postMessage(newState);
          }
        } catch (e) {
          console.error("Failed to broadcast state change:", e);
        }
      });
    } catch (e) {
      console.warn(
        "BroadcastChannel not supported, using localStorage fallback"
      );
    }
  }

  // Setup storage listener for cross-tab sync fallback
  function setupStorageListener() {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          SharedState.setState(newState);
        } catch (e) {
          console.error("Failed to apply state from storage event:", e);
        }
      }
    });
  }

  // Cleanup function
  function cleanup() {
    if (_broadcastChannel) {
      _broadcastChannel.close();
      _broadcastChannel = null;
    }
    _isInitialized = false;
  }

  // Check if data layer is initialized
  function isInitialized() {
    return _isInitialized;
  }

  // Force re-initialization
  function reinitialize() {
    cleanup();
    initDataLayer();
  }

  // Get current state snapshot for debugging
  function getDebugInfo() {
    return {
      initialized: _isInitialized,
      broadcastChannel: !!_broadcastChannel,
      currentState: SharedState.getState(),
      storageInfo: Persist.getStorageInfo(),
      urlParams: Persist.applyFromURL(),
    };
  }

  // Manual sync function (for debugging)
  function forceSync() {
    if (!_isInitialized) {
      console.warn("Data layer not initialized");
      return;
    }

    try {
      const currentState = SharedState.getState();
      Persist.writeURL(currentState);
      Persist.save(currentState);

      if (_broadcastChannel) {
        _broadcastChannel.postMessage(currentState);
      }

      console.log("Manual sync completed");
    } catch (e) {
      console.error("Manual sync failed:", e);
    }
  }

  // Navigation helper with state preservation
  function navigateWithState(targetPath) {
    if (!_isInitialized) {
      console.warn("Data layer not initialized, using direct navigation");
      window.location.href = targetPath;
      return;
    }

    try {
      const currentState = SharedState.getState();
      const url = Persist.getNavigationURL(targetPath, currentState);

      // Use navigateTo if available (SPA routing)
      if (window.navigateTo) {
        window.navigateTo("legacy:" + url);
      } else {
        window.location.href = url;
      }
    } catch (e) {
      console.error("Navigation with state failed:", e);
      window.location.href = targetPath;
    }
  }

  // State change handler for automatic updates
  function onStateChange(callback) {
    if (!_isInitialized) {
      console.warn("Data layer not initialized");
      return () => {};
    }

    return SharedState.subscribe(callback);
  }

  // Batch state updates
  function batchUpdate(updates) {
    if (!_isInitialized) {
      console.warn("Data layer not initialized");
      return;
    }

    SharedState.batchUpdate(updates);
  }

  // Reset all data
  function resetAll() {
    if (!_isInitialized) {
      console.warn("Data layer not initialized");
      return;
    }

    try {
      Persist.clear();
      SharedState.resetState();
      console.log("All data reset");
    } catch (e) {
      console.error("Reset failed:", e);
    }
  }

  // Export data layer API
  w.DataSync = {
    initDataLayer,
    cleanup,
    isInitialized,
    reinitialize,
    getDebugInfo,
    forceSync,
    navigateWithState,
    onStateChange,
    batchUpdate,
    resetAll,
  };

  // Auto-cleanup on page unload
  window.addEventListener("beforeunload", cleanup);
})(window);









