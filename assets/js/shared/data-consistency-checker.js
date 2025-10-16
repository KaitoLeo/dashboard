// assets/js/shared/data-consistency-checker.js
(function (w) {
  "use strict";

  let isInitialized = false;

  function initializeDataConsistencyChecker() {
    if (isInitialized) {
      console.log("Data Consistency Checker already initialized");
      return;
    }

    console.log("🔍 Initializing Data Consistency Checker...");

    // Monitor DOM changes for metric cards
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          checkMetricCardConsistency();
        }
      });
    });

    // Start observing when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
        checkMetricCardConsistency();
      });
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      checkMetricCardConsistency();
    }

    isInitialized = true;
    console.log("✅ Data Consistency Checker initialized");
  }

  function checkMetricCardConsistency() {
    try {
      const totalCard = findTotalMetricCard();
      const serviceCards = findServiceMetricCards();

      if (!totalCard || serviceCards.length === 0) {
        return; // Cards not found yet
      }

      const totalValue = extractNumberFromCard(totalCard);
      const serviceValues = serviceCards.map(extractNumberFromCard);
      const serviceSum = serviceValues.reduce((sum, val) => sum + val, 0);

      console.log("🔍 Data Consistency Check:", {
        totalCard: totalValue,
        serviceCards: serviceValues,
        serviceSum: serviceSum,
        isConsistent: totalValue === serviceSum,
      });

      if (totalValue !== serviceSum) {
        console.error("❌ DATA CONSISTENCY ERROR DETECTED:", {
          page: window.location.pathname,
          totalValue: totalValue,
          serviceSum: serviceSum,
          difference: totalValue - serviceSum,
          serviceBreakdown: serviceValues,
        });

        // Highlight inconsistent cards
        highlightInconsistentCards(
          totalCard,
          serviceCards,
          totalValue,
          serviceSum
        );

        // Show warning to user
        showConsistencyWarning(totalValue, serviceSum, serviceValues);
      } else {
        console.log("✅ Data consistency check passed");
        clearHighlights();
      }
    } catch (error) {
      console.error("Error in data consistency check:", error);
    }
  }

  function findTotalMetricCard() {
    // Look for cards with "Tổng" in the title
    const totalKeywords = ["Tổng", "Total", "tổng", "total"];

    for (const keyword of totalKeywords) {
      const cards = document.querySelectorAll(".card-body");
      for (const card of cards) {
        const titleElement = card.querySelector("h6");
        if (titleElement && titleElement.textContent.includes(keyword)) {
          return card;
        }
      }
    }

    return null;
  }

  function findServiceMetricCards() {
    const serviceKeywords = [
      "PT Fitness",
      "Membership",
      "Pilates",
      "Swimming Coach",
      "Gym",
      "Yoga",
      "Aerobic",
    ];

    const serviceCards = [];
    const cards = document.querySelectorAll(".card-body");

    for (const card of cards) {
      const titleElement = card.querySelector("h6");
      if (titleElement) {
        const title = titleElement.textContent.trim();
        if (serviceKeywords.some((keyword) => title.includes(keyword))) {
          serviceCards.push(card);
        }
      }
    }

    return serviceCards;
  }

  function extractNumberFromCard(card) {
    const valueElement = card.querySelector("h3, h4, h2");
    if (valueElement) {
      const text = valueElement.textContent.trim();
      const number = parseInt(text.replace(/[^\d]/g, ""));
      return isNaN(number) ? 0 : number;
    }
    return 0;
  }

  function highlightInconsistentCards(
    totalCard,
    serviceCards,
    totalValue,
    serviceSum
  ) {
    // Clear previous highlights
    clearHighlights();

    // Highlight total card
    if (totalCard) {
      totalCard.style.border = "3px solid #dc3545";
      totalCard.style.backgroundColor = "#f8d7da";
      totalCard.style.boxShadow = "0 0 10px rgba(220, 53, 69, 0.5)";
    }

    // Highlight service cards
    serviceCards.forEach((card) => {
      card.style.border = "2px solid #ffc107";
      card.style.backgroundColor = "#fff3cd";
    });
  }

  function clearHighlights() {
    const cards = document.querySelectorAll(".card-body");
    cards.forEach((card) => {
      card.style.border = "";
      card.style.backgroundColor = "";
      card.style.boxShadow = "";
    });
  }

  function showConsistencyWarning(totalValue, serviceSum, serviceValues) {
    // Remove existing warning
    const existingWarning = document.getElementById("data-consistency-warning");
    if (existingWarning) {
      existingWarning.remove();
    }

    // Create warning banner
    const warning = document.createElement("div");
    warning.id = "data-consistency-warning";
    warning.className =
      "alert alert-danger alert-dismissible fade show position-fixed";
    warning.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

    warning.innerHTML = `
      <h6><i class="fas fa-exclamation-triangle me-2"></i>Data Consistency Error</h6>
      <p class="mb-2"><strong>Total:</strong> ${totalValue}</p>
      <p class="mb-2"><strong>Sum of Services:</strong> ${serviceSum}</p>
      <p class="mb-2"><strong>Difference:</strong> ${
        totalValue - serviceSum
      }</p>
      <p class="mb-2"><strong>Services:</strong> ${serviceValues.join(
        " + "
      )} = ${serviceSum}</p>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(warning);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (warning && warning.parentNode) {
        warning.remove();
      }
    }, 10000);
  }

  // Manual check function for testing
  function manualConsistencyCheck() {
    console.log("🔍 Running manual consistency check...");
    checkMetricCardConsistency();
  }

  // Public API
  w.DataConsistencyChecker = {
    init: initializeDataConsistencyChecker,
    check: manualConsistencyCheck,
    status: () => ({ initialized: isInitialized }),
  };

  // Auto-initialize
  initializeDataConsistencyChecker();
})(window);

