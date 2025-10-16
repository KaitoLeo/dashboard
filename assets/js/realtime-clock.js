// Static clock for Vietnam timezone (UTC+7)
// This file provides static time display without real-time updates

let isInitialized = false;
let clockInterval = null;

// Start static clock (no real-time updates)
function startRealTimeClock() {
  if (isInitialized) return;
  isInitialized = true;

  console.log("Starting static Vietnam clock...");

  // Update once only
  updateClock();
}

// Stop real-time clock
function stopRealTimeClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
  isInitialized = false;
}

// Update clock display
function updateClock() {
  try {
    const now = new Date();

    // Get Vietnam time using proper timezone
    const vietnamTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );

    // Format time (HH:MM:SS)
    const timeString = vietnamTime.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Format date (DD/MM/YYYY)
    const dateString = vietnamTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Update DOM elements
    const timeElement = document.getElementById("currentTime");
    const dateElement = document.getElementById("currentDate");

    if (timeElement) {
      timeElement.textContent = timeString;
    }

    if (dateElement) {
      dateElement.textContent = dateString;
    }

    // Debug log (only once for static clock)
    if (!isInitialized) {
      console.log("Vietnam Time:", timeString, dateString);
    }
  } catch (error) {
    console.error("Error updating clock:", error);
  }
}

// Get Vietnam time
function getVietnamTime() {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
}

// Format Vietnam time
function formatVietnamTime(date, options = {}) {
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    ...options,
  });
}

// Force update clock (useful for debugging)
function forceUpdateClock() {
  updateClock();
}

// Initialize static clock when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, checking for clock elements...");

  // Only start if clock elements exist
  if (
    document.getElementById("currentTime") ||
    document.getElementById("currentDate")
  ) {
    console.log("Clock elements found, starting static clock...");
    startRealTimeClock();
  } else {
    console.log("No clock elements found");
  }
});

// Also start immediately if DOM is already loaded
if (document.readyState === "loading") {
  // DOM is still loading, wait for DOMContentLoaded
  console.log("DOM still loading, waiting for DOMContentLoaded...");
} else {
  // DOM is already loaded, start immediately
  console.log("DOM already loaded, checking for clock elements...");

  if (
    document.getElementById("currentTime") ||
    document.getElementById("currentDate")
  ) {
    console.log("Clock elements found, starting static clock immediately...");
    startRealTimeClock();
  } else {
    console.log("No clock elements found");
  }
}

// Export functions for global use
window.startRealTimeClock = startRealTimeClock;
window.stopRealTimeClock = stopRealTimeClock;
window.forceUpdateClock = forceUpdateClock;
window.getVietnamTime = getVietnamTime;
window.formatVietnamTime = formatVietnamTime;
