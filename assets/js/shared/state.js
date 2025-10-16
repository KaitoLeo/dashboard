(function (w) {
  // Private state object
  let _state = {
    timeKey: "today",
    from: "",
    to: "",
    startDate: null, // Date object for computed start
    endDate: null, // Date object for computed end
    location: "all",
    department: "all",
    service: "all",
    // Additional state properties
    search: "",
    page: 1,
    pageSize: 10,
    sortBy: "",
    sortOrder: "asc",
  };

  // Subscribers for state changes
  const _subs = new Set();

  // Get current state (deep copy to prevent mutations)
  function getState() {
    return JSON.parse(JSON.stringify(_state));
  }

  // Set state with partial update
  function setState(patch) {
    const oldState = getState();
    _state = { ..._state, ...(patch || {}) };

    // Notify all subscribers
    _subs.forEach((fn) => {
      try {
        fn(getState(), oldState);
      } catch (e) {
        console.error("Error in state subscriber:", e);
      }
    });
  }

  // Subscribe to state changes
  function subscribe(fn) {
    _subs.add(fn);
    return () => _subs.delete(fn);
  }

  // Reset state to default
  function resetState() {
    setState({
      timeKey: "today",
      from: "",
      to: "",
      startDate: null,
      endDate: null,
      location: "all",
      department: "all",
      service: "all",
      search: "",
      page: 1,
      pageSize: 10,
      sortBy: "",
      sortOrder: "asc",
    });
  }

  // Get specific state property
  function getStateProperty(key) {
    return _state[key];
  }

  // Set specific state property
  function setStateProperty(key, value) {
    setState({ [key]: value });
  }

  // Check if state has changed
  function hasStateChanged(oldState, newState) {
    return JSON.stringify(oldState) !== JSON.stringify(newState);
  }

  // Get state diff (what changed)
  function getStateDiff(oldState, newState) {
    const diff = {};
    Object.keys(newState).forEach((key) => {
      if (oldState[key] !== newState[key]) {
        diff[key] = { old: oldState[key], new: newState[key] };
      }
    });
    return diff;
  }

  // Batch state updates
  function batchUpdate(updates) {
    setState(updates);
  }

  // Get state snapshot for debugging
  function getStateSnapshot() {
    return {
      state: getState(),
      subscribers: _subs.size,
      timestamp: new Date().toISOString(),
    };
  }

  w.SharedState = {
    getState,
    setState,
    subscribe,
    resetState,
    getStateProperty,
    setStateProperty,
    hasStateChanged,
    getStateDiff,
    batchUpdate,
    getStateSnapshot,
  };
})(window);
