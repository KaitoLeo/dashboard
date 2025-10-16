(function (global) {
  if (global.AppSPAHashRouter) {
    return;
  }

  function navigate(hash) {
    if (!hash) {
      return;
    }
    const normalized = hash.startsWith("#") ? hash : `#${hash}`;
    global.location.hash = normalized;
  }

  function start() {
    if (!global.AppSPA || typeof global.AppSPA.init !== "function") {
      document.addEventListener(
        "DOMContentLoaded",
        () => global.AppSPA && global.AppSPA.init()
      );
      return;
    }
    global.AppSPA.init();
  }

  global.AppSPAHashRouter = {
    navigate,
    start,
  };

  document.addEventListener("DOMContentLoaded", start);
})(window);
