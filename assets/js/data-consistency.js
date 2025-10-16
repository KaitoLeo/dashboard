// Centralized Data Management for Consistency
// This file ensures all data across the application is synchronized

window.ConsistentData = {
  // Core metrics that must be consistent across all pages
  metrics: {
    // Today's data
    today: {
      visitors: 18,
      trialGuests: 8,
      checkinManual: 47,
      membershipCheckin: 245,
      ptFitnessCheckin: 45,
      pilatesCheckin: 28,
      swimmingCoachCheckin: 32,
      lateCheckin: 47,
      contractActivations: 28,
      newMembers: 15,
      renewals: 8,
      cancellations: 3,
    },

    // Yesterday's data
    yesterday: {
      visitors: 12,
      trialGuests: 6,
      checkinManual: 35,
      membershipCheckin: 238,
      ptFitnessCheckin: 52,
      pilatesCheckin: 31,
      swimmingCoachCheckin: 28,
      lateCheckin: 8,
      contractActivations: 25,
      newMembers: 12,
      renewals: 6,
      cancellations: 2,
    },

    // MTD (Month to Date) data
    mtd: {
      visitors: 180,
      trialGuests: 120,
      checkinManual: 850,
      membershipCheckin: 2100,
      ptFitnessCheckin: 1250,
      pilatesCheckin: 980,
      swimmingCoachCheckin: 750,
      lateCheckin: 1247,
      contractActivations: 450,
      newMembers: 380,
      renewals: 180,
      cancellations: 45,
    },
  },

  // Location-specific data
  locations: {
    "ton-that-thuyet": {
      name: "Tôn Thất Thuyết",
      today: {
        visitors: 3,
        trialGuests: 2,
        membershipCheckin: 65,
        ptFitnessCheckin: 12,
        pilatesCheckin: 6,
        swimmingCoachCheckin: 8,
        lateCheckin: 8,
      },
    },
    "huynh-thuc-khang": {
      name: "Huỳnh Thúc Kháng",
      today: {
        visitors: 2,
        trialGuests: 1,
        membershipCheckin: 55,
        ptFitnessCheckin: 15,
        pilatesCheckin: 8,
        swimmingCoachCheckin: 12,
        lateCheckin: 12,
      },
    },
    "giang-vo": {
      name: "Giảng Võ",
      today: {
        visitors: 2,
        trialGuests: 1,
        membershipCheckin: 45,
        ptFitnessCheckin: 8,
        pilatesCheckin: 4,
        swimmingCoachCheckin: 6,
        lateCheckin: 6,
      },
    },
    "hao-nam": {
      name: "Hào Nam",
      today: {
        visitors: 2,
        trialGuests: 1,
        membershipCheckin: 50,
        ptFitnessCheckin: 10,
        pilatesCheckin: 7,
        swimmingCoachCheckin: 9,
        lateCheckin: 9,
      },
    },
    "nguyen-tuan": {
      name: "Nguyễn Tuân",
      today: {
        visitors: 1,
        trialGuests: 1,
        membershipCheckin: 30,
        ptFitnessCheckin: 6,
        pilatesCheckin: 3,
        swimmingCoachCheckin: 4,
        lateCheckin: 4,
      },
    },
  },

  // Get data for specific time period and location
  getData: function (timePeriod = "today", location = "all") {
    const baseData = this.metrics[timePeriod] || this.metrics.today;

    if (location === "all") {
      return baseData;
    }

    const locationData = this.locations[location];
    if (!locationData) {
      return baseData;
    }

    // Merge base data with location-specific data
    return {
      ...baseData,
      ...locationData[timePeriod],
    };
  },

  // Update data (for future use when implementing real-time updates)
  updateData: function (timePeriod, location, metric, value) {
    if (location === "all") {
      this.metrics[timePeriod][metric] = value;
    } else {
      this.locations[location][timePeriod][metric] = value;
    }

    // Trigger update events
    this.notifyDataChange(timePeriod, location, metric, value);
  },

  // Notify other components of data changes
  notifyDataChange: function (timePeriod, location, metric, value) {
    const event = new CustomEvent("dataUpdated", {
      detail: { timePeriod, location, metric, value },
    });
    document.dispatchEvent(event);
  },

  // Get visitors data specifically
  getVisitorsData: function (timePeriod = "today", location = "all") {
    const data = this.getData(timePeriod, location);
    return {
      count: data.visitors,
      trialGuests: data.trialGuests,
      total: data.visitors + data.trialGuests,
    };
  },

  // Get checkin data specifically
  getCheckinData: function (timePeriod = "today", location = "all") {
    const data = this.getData(timePeriod, location);
    return {
      membership: data.membershipCheckin,
      ptFitness: data.ptFitnessCheckin,
      pilates: data.pilatesCheckin,
      swimmingCoach: data.swimmingCoachCheckin,
      late: data.lateCheckin,
      manual: data.checkinManual,
      total:
        data.membershipCheckin +
        data.ptFitnessCheckin +
        data.pilatesCheckin +
        data.swimmingCoachCheckin,
    };
  },
};

// Initialize data consistency
document.addEventListener("DOMContentLoaded", function () {
  console.log("ConsistentData initialized");

  // Listen for data update events
  document.addEventListener("dataUpdated", function (event) {
    console.log("Data updated:", event.detail);
    // Here you can add logic to update UI elements
  });
});
