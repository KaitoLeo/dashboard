# Shared Data Layer - Integration Guide

## Overview

This folder contains the **Single Source of Truth (SSOT)** for data and calculations across the entire dashboard.

All pages should use these shared modules to ensure:

- **Consistency**: Same calculations produce same results
- **Maintainability**: Update formulas in one place
- **Correctness**: Automated consistency checks

## Module Files

### Core Modules

1. **`state.js`** - Global filter state management

   - Manages: `timeKey`, `startDate`, `endDate`, `location`, `service`
   - Event-driven: Subscribe to state changes
   - Usage: `SharedState.getState()`, `SharedState.setState({...})`

2. **`data-source.js`** - Data normalization & filtering

   - Loads: `sample-data.js`
   - Normalizes: bookings, checkins, revenues, members
   - Filters by state: `DataSource.filterByState(data, state)`

3. **`compute-kpi.js`** - All KPI formulas

   - Booking: totalBookings, confirmationRatio, cancellationRate, noShowRate, utilization, avgLeadHours
   - Check-in: totalCheckins, dayOverDay, peakHour, peakIndex, newVsReturning
   - Revenue: totalRevenue, completionMTD, arpb, arpm, serviceMixPercent, projectionMTD
   - Membership: activeCount, frozenCount, expiredCount, retention, churn
   - Usage: `ComputeKPI.computeAllKPIs(state)`

4. **`reconcile.js`** - Consistency validation

   - Checks: card ↔ table ↔ chart consistency
   - Usage: `Reconcile.assertConsistency(modules)`

5. **`labels.js`** - Vietnamese formatting

   - Time labels: capitalizeVi("hôm nay") → "Hôm nay"
   - Numbers: formatNumber(1234567) → "1.234.567"
   - Currency: formatCurrency(100000) → "100.000₫"
   - Percentage: formatPercent(0.75) → "75.0%"

6. **`service-order.js`** - Service ordering

   - Fixed order: Membership → PT Fitness → Pilates → Swimming Coach
   - Usage: `ServiceOrder.sortByServiceOrder(items)`

7. **`init-shared.js`** - Initialization & unified API
   - Loads all modules in correct order
   - Provides: `SharedDataLayer.init(options)`

## Integration Steps

### Step 1: Include Scripts in HTML

Add these script tags **before** your page's main script:

```html
<!-- Chart.js UMD for file:// protocol -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>

<!-- Shared Data Layer -->
<script src="../data/sample-data.js"></script>
<script src="../assets/js/shared/data-source.js"></script>
<script src="../assets/js/shared/state.js"></script>
<script src="../assets/js/shared/compute-kpi.js"></script>
<script src="../assets/js/shared/reconcile.js"></script>
<script src="../assets/js/shared/labels.js"></script>
<script src="../assets/js/shared/service-order.js"></script>
<script src="../assets/js/shared/init-shared.js"></script>
```

### Step 2: Initialize on Page Load

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // Wait for all dependencies
  SharedDataLayer.waitForDependencies(function () {
    // Get URL parameters or use defaults
    const urlParams = new URLSearchParams(window.location.search);
    const initialState = {
      timeKey: urlParams.get("time") || "today",
      location: urlParams.get("location") || "all",
      service: urlParams.get("service") || "all",
    };

    // Set state
    SharedState.setState(initialState);

    // Initialize with auto-update
    const kpis = SharedDataLayer.init({
      runChecks: true,
      onUpdate: function (newKpis, newState) {
        console.log("KPIs updated:", newKpis);
        updateUI(newKpis);
      },
    });

    // Initial UI update
    updateUI(kpis);
  });
});
```

### Step 3: Update UI Function

```javascript
function updateUI(kpis) {
  if (!kpis) return;

  // Booking metrics
  document.getElementById("totalBookings").textContent = Labels.formatNumber(
    kpis.booking.totalBookings
  );

  document.getElementById("confirmedBookings").textContent =
    Labels.formatNumber(kpis.booking.byStatus.confirmed);

  document.getElementById("confirmationRate").textContent =
    Labels.formatPercent(kpis.booking.confirmationRatio);

  // Revenue metrics
  document.getElementById("totalRevenue").textContent = Labels.formatCurrency(
    kpis.revenue.totalRevenue
  );

  document.getElementById("mtdCompletion").textContent = Labels.formatPercent(
    kpis.revenue.completionMTD
  );

  document.getElementById("arpb").textContent = Labels.formatCurrency(
    kpis.revenue.arpb
  );

  // Check-in metrics
  document.getElementById("totalCheckins").textContent = Labels.formatNumber(
    kpis.checkin.totalCheckins
  );

  document.getElementById("peakHour").textContent = kpis.checkin.peakHour
    ? Labels.formatTime(kpis.checkin.peakHour * 60)
    : "N/A";

  // Update charts
  updateCharts(kpis);
}
```

### Step 4: Update Charts with Sorted Data

```javascript
function updateCharts(kpis) {
  // Revenue by service (sorted)
  const revenueByService = kpis.revenue.byService;
  const sortedServices = ServiceOrder.sortObjectKeys(revenueByService);

  const labels = Object.keys(sortedServices);
  const data = Object.values(sortedServices);
  const colors = labels.map((s) => ServiceOrder.getServiceColor(s));

  if (window.revenueChart) {
    window.revenueChart.data.labels = labels;
    window.revenueChart.data.datasets[0].data = data;
    window.revenueChart.data.datasets[0].backgroundColor = colors;
    window.revenueChart.update();
  }
}
```

### Step 5: Add Consistency Checks

At the end of your update function:

```javascript
function updateUI(kpis) {
  // ... update UI elements ...

  // Run consistency checks
  const modules = {
    booking: {
      dashboard: {
        totalBookings: kpis.booking.totalBookings,
        confirmed: kpis.booking.byStatus.confirmed,
        pending: kpis.booking.byStatus.pending,
        cancelled: kpis.booking.byStatus.cancelled,
      },
    },
    revenue: {
      dashboard: {
        totalRevenue: kpis.revenue.totalRevenue,
      },
      breakdown: {
        totalRevenue: kpis.revenue.totalRevenue,
        byService: kpis.revenue.byService,
      },
    },
  };

  Reconcile.assertConsistency(modules);
}
```

## Common Patterns

### Get Filtered Data

```javascript
const state = SharedState.getState();
const bookings = DataSource.filterByState(DataSource.bookings, state);
```

### Subscribe to State Changes

```javascript
SharedState.subscribe(function (newState, oldState) {
  console.log("State changed from", oldState.timeKey, "to", newState.timeKey);
  const kpis = ComputeKPI.computeAllKPIs(newState);
  updateUI(kpis);
});
```

### Manual KPI Calculation

```javascript
const bookings = DataSource.filterByState(DataSource.bookings, state);

const total = ComputeKPI.totalBookings(bookings);
const confirmed = ComputeKPI.bookingsByStatus(bookings).confirmed;
const ratio = ComputeKPI.confirmationRatio(bookings);
```

## Required Formulas by Module

### Booking Module

- ✅ `totalBookings` = confirmed + pending + cancelled
- ✅ `confirmationRatio` = confirmed / (confirmed + pending + cancelled)
- ✅ `cancellationRate` = cancelled / total
- ✅ `noShowRate` = noShow / (noShow + attended)
- ✅ `utilization` = attended / capacity
- ✅ `avgLeadHours` = AVG(startTime - bookingTime)

### Check-in Module

- ✅ `totalCheckins`
- ✅ `dayOverDay` = (today - yesterday) / yesterday
- ✅ `peakHour` = hour with max count
- ✅ `peakIndex` = MAX(count) / MEDIAN(count)
- ✅ `newVsReturning`

### Revenue Module

- ✅ `totalRevenue`
- ✅ `completionMTD` = revenueMTD / targetMonth
- ✅ `remainingToTarget` = targetMonth - revenueMTD
- ✅ `arpb` = revenue / confirmedBookings
- ✅ `arpm` = revenue / activeMembers
- ✅ `serviceMixPercent` = revenueByService[s] / total
- ✅ `projectionMTD` = (revenueMTD / elapsed) \* totalDays
- ✅ `gapToTarget` = targetMonth - projection

### Membership Module

- ✅ `activeCount`, `frozenCount`, `expiredCount`
- ✅ `retention` = retained / lastPeriodActive
- ✅ `churn` = lost / lastPeriodActive

## Display Rules

### Time Labels (Must be Capitalized)

- ❌ "hôm nay" → ✅ "Hôm nay"
- ❌ "tuần này" → ✅ "Tuần này"
- ❌ "tháng này" → ✅ "Tháng này"

Use: `Labels.capitalizeVi(timeKey)`

### Service Order (Fixed)

1. Membership
2. PT Fitness
3. Pilates
4. Swimming Coach

Use: `ServiceOrder.sortByServiceOrder(items)`

### Number Formatting

- Numbers: `Labels.formatNumber(1234567)` → "1.234.567"
- Currency: `Labels.formatCurrency(100000)` → "100.000₫"
- Percent: `Labels.formatPercent(0.753)` → "75.3%"

## Troubleshooting

### "Chart is not defined"

- Use UMD build: `chart.umd.min.js` instead of `chart.min.js`

### "DataSource is not defined"

- Ensure scripts are loaded in correct order
- Check browser console for loading errors

### Numbers don't match

- Run `Reconcile.assertConsistency(modules)` to find discrepancies
- Ensure all calculations use same data source

### State changes don't update UI

- Subscribe to state: `SharedState.subscribe(callback)`
- Check that callback is registered before state changes

## Example Pages

See these pages for complete examples:

- `index.html` - Dashboard with all modules
- (More examples to be added)

## Support

For issues or questions, check console logs:

- ✅ "Data layer ready" - DataSource loaded
- ✅ "ComputeKPI module ready" - Calculations available
- ✅ "All consistency checks passed" - Data is correct

