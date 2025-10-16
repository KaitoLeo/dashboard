# Data Consistency Maintenance Guide

**Version:** 1.0  
**Last Updated:** 2025-01-23  
**Owner:** Development Team

---

## 🎯 Purpose

This guide provides step-by-step instructions for maintaining data consistency in the Actiwell Dashboard project. Follow these procedures to ensure data integrity across all pages and components.

---

## 📋 Table of Contents

1. [Daily Checks](#daily-checks)
2. [Before Committing Code](#before-committing-code)
3. [After Adding New Pages](#after-adding-new-pages)
4. [Monthly Audits](#monthly-audits)
5. [Troubleshooting](#troubleshooting)
6. [Emergency Procedures](#emergency-procedures)

---

## 1. Daily Checks

### 1.1 Automated Monitoring

The system automatically monitors data consistency in real-time via `data-consistency-checker.js`.

**What it checks:**

- Total metrics match sum of service metrics
- Time labels are properly capitalized
- Service order follows standard

**How to view:**

1. Open browser console (F12)
2. Look for console messages:
   - `✅ Data consistency check passed` - All good!
   - `❌ DATA CONSISTENCY ERROR DETECTED` - Action needed!

### 1.2 Visual Inspection

**Check these indicators:**

- No red borders around metric cards
- No yellow warning banners
- All numbers appear reasonable

**If you see issues:**

```javascript
// Run manual check in console
DataConsistencyChecker.check();
```

---

## 2. Before Committing Code

### 2.1 Run Validation Script

```bash
# Run comprehensive validation
node validate-all-consistency.js

# Expected output:
# 🎉 All validations passed!
# ✅ Data consistency is maintained across the project.
```

### 2.2 Run Specific Tests

```bash
# Test booking data
node verify-data-consistency.js

# Test main vs detail pages
node check-booking-consistency.js

# Check and auto-fix issues (dry run first!)
node fix-data-consistency.js check pages/your-file.html
```

### 2.3 Pre-commit Checklist

- [ ] All validation scripts pass
- [ ] No console errors in browser
- [ ] Time labels capitalized correctly
- [ ] Service order matches standard
- [ ] Numbers consistent across pages

### 2.4 Git Pre-commit Hook (Recommended)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "🔍 Running data consistency checks..."

# Run validation
node validate-all-consistency.js
if [ $? -ne 0 ]; then
  echo "❌ Data consistency check failed!"
  echo "Fix errors before committing."
  exit 1
fi

echo "✅ All checks passed!"
exit 0
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

---

## 3. After Adding New Pages

### 3.1 Required Imports

Every new HTML page MUST include these scripts:

```html
<!-- In <head> section -->
<script src="../assets/js/data-consistency.js"></script>
<script src="../assets/js/common/time-label-vi.js"></script>
<script src="../assets/js/common/service-order.js"></script>
<script src="../assets/js/shared/data-consistency-checker.js"></script>
```

### 3.2 Use Centralized Data

**❌ DON'T do this:**

```javascript
// Hardcoded values
const todayVisitors = 25;
const yesterdayVisitors = 18;
```

**✅ DO this:**

```javascript
// Use ConsistentData
const todayData = window.ConsistentData.getData("today", "all");
const todayVisitors = todayData.visitors;
```

### 3.3 Apply Time Label Capitalization

**❌ DON'T do this:**

```html
<h6>hôm nay</h6>
<h6>Hôm Qua</h6>
<h6>THÁNG NÀY</h6>
```

**✅ DO this:**

```javascript
// Use TimeLabelVi utility
const label = window.TimeLabelVi.capitalize("hôm nay"); // Returns "Hôm nay"
```

Or in HTML:

```html
<h6>Hôm nay</h6>
<!-- Correct capitalization -->
<h6>Hôm qua</h6>
<h6>Tháng này</h6>
```

### 3.4 Apply Service Order

**❌ DON'T do this:**

```javascript
// Random order
const services = ["Swimming Coach", "PT Fitness", "Membership", "Pilates"];
```

**✅ DO this:**

```javascript
// Use ServiceOrder utility
const services = window.ServiceOrder.ORDER;
// Returns: ["Membership", "PT Fitness", "Pilates", "Swimming Coach"]

// Or sort existing array
const sorted = window.ServiceOrder.sortByServiceOrder(yourArray);
```

### 3.5 Validation Steps

After adding a new page:

1. **Test in browser:**

   - Open the page
   - Check browser console for errors
   - Verify no red/yellow highlights

2. **Run validation:**

   ```bash
   node fix-data-consistency.js check pages/your-new-page.html
   ```

3. **Test integration:**
   - Navigate from main dashboard to your page
   - Verify numbers match parent page
   - Test filters and time period changes

---

## 4. Monthly Audits

### 4.1 Full System Audit

```bash
# Run comprehensive audit (takes 2-5 minutes)
node validate-all-consistency.js

# Generate detailed report
node generate-consistency-report.js  # If available
```

### 4.2 Review Checklist

- [ ] All pages pass validation
- [ ] No duplicate utility files
- [ ] Documentation up to date
- [ ] New pages added to audit scope
- [ ] Performance acceptable (<100ms for checks)

### 4.3 Update Documentation

Update these files if needed:

- `TODO.md` - if rules change
- `DATA-CONSISTENCY-GUIDE.md` - if usage patterns change
- `CONSISTENCY-MAINTENANCE-GUIDE.md` - this file!

---

## 5. Troubleshooting

### 5.1 Common Issues

#### Issue: "Total ≠ Sum of Services"

**Symptoms:**

- Red border around total card
- Warning banner showing difference

**Diagnosis:**

```javascript
// In browser console
const checker = window.DataConsistencyChecker;
checker.check();
```

**Fix:**

1. Check `data-consistency.js` for correct values
2. Verify page uses `ConsistentData.getData()`
3. Run: `node fix-data-consistency.js` to auto-fix

#### Issue: "Time label not capitalized"

**Symptoms:**

- `hôm nay` instead of `Hôm nay`
- `HÔM QUA` instead of `Hôm qua`

**Fix:**

```javascript
// Replace hardcoded labels with
const label = window.TimeLabelVi.capitalize(rawLabel);
```

Or update HTML directly:

```html
<!-- Before -->
<h6>hôm nay</h6>

<!-- After -->
<h6>Hôm nay</h6>
```

#### Issue: "Services in wrong order"

**Symptoms:**

- Chart legend shows: PT Fitness, Membership, Swimming Coach, Pilates
- Should be: Membership, PT Fitness, Pilates, Swimming Coach

**Fix:**

```javascript
// Sort before rendering
const orderedServices = window.ServiceOrder.sortByServiceOrder(services);

// For chart series
const orderedSeries = window.ServiceOrder.orderSeries(chartSeries);
```

#### Issue: "Utility file not loaded"

**Symptoms:**

- `window.ConsistentData is undefined`
- `window.TimeLabelVi is undefined`

**Fix:**
Add to HTML `<head>`:

```html
<script src="../assets/js/data-consistency.js"></script>
<script src="../assets/js/common/time-label-vi.js"></script>
<script src="../assets/js/common/service-order.js"></script>
```

### 5.2 Debug Mode

Enable debug mode for detailed logs:

```javascript
// In browser console
window.DEBUG_CONSISTENCY = true;

// Now all consistency checks will log details
DataConsistencyChecker.check();
```

### 5.3 Reset Data

If data becomes corrupted:

```javascript
// In browser console
// Reload data from source
location.reload(true); // Force reload without cache

// Or manually reset
window.ConsistentData.metrics.today = {
  /* correct values */
};
```

---

## 6. Emergency Procedures

### 6.1 Critical Data Inconsistency Detected

**Severity:** HIGH  
**Impact:** User-facing data incorrect

**Immediate Actions:**

1. **Identify scope:**

   ```bash
   node validate-all-consistency.js > report.txt
   ```

2. **Run auto-fix:**

   ```bash
   node fix-data-consistency.js
   ```

3. **Verify fix:**

   ```bash
   node validate-all-consistency.js
   ```

4. **If auto-fix fails:**
   - Manually review `data-consistency.js`
   - Check recent commits for changes
   - Revert if necessary

### 6.2 Rollback Procedure

If consistency cannot be restored:

```bash
# 1. Identify last good commit
git log --oneline | head -20

# 2. Check what changed
git diff <good-commit> <bad-commit> -- assets/js/data-consistency.js

# 3. Revert specific file
git checkout <good-commit> -- assets/js/data-consistency.js

# 4. Test
node validate-all-consistency.js

# 5. Commit if good
git add assets/js/data-consistency.js
git commit -m "fix: revert data-consistency to working state"
```

### 6.3 Hotfix Process

For production issues:

1. **Create hotfix branch:**

   ```bash
   git checkout -b hotfix/data-consistency-<issue-id>
   ```

2. **Fix issue:**

   - Update `data-consistency.js` or affected files
   - Test thoroughly

3. **Validate:**

   ```bash
   node validate-all-consistency.js
   node verify-data-consistency.js
   node check-booking-consistency.js
   ```

4. **Deploy:**

   ```bash
   git add .
   git commit -m "hotfix: fix data consistency issue <issue-id>"
   git push origin hotfix/data-consistency-<issue-id>
   ```

5. **Merge to main:**
   - Create PR
   - Get approval
   - Merge and deploy

---

## 7. Best Practices

### 7.1 DO's

✅ **Always use utilities:**

- `TimeLabelVi.capitalize()` for time labels
- `ServiceOrder.sortByServiceOrder()` for ordering
- `ConsistentData.getData()` for metrics

✅ **Test before committing:**

- Run validation scripts
- Check in browser
- Test on multiple pages

✅ **Document changes:**

- Update TODO.md if rules change
- Comment complex logic
- Update this guide if procedures change

✅ **Single source of truth:**

- Update data only in `data-consistency.js`
- Don't duplicate data across files
- Use `ConsistentData` API everywhere

### 7.2 DON'Ts

❌ **Never hardcode data** in components
❌ **Never skip validation** before committing
❌ **Never use inconsistent** capitalization
❌ **Never change service order** arbitrarily
❌ **Never duplicate utilities** across folders

---

## 8. Tools Reference

### 8.1 Validation Scripts

| Script                         | Purpose                  | Usage                               |
| ------------------------------ | ------------------------ | ----------------------------------- |
| `validate-all-consistency.js`  | Comprehensive validation | `node validate-all-consistency.js`  |
| `verify-data-consistency.js`   | Booking data check       | `node verify-data-consistency.js`   |
| `check-booking-consistency.js` | Main vs detail check     | `node check-booking-consistency.js` |
| `fix-data-consistency.js`      | Auto-fix issues          | `node fix-data-consistency.js`      |

### 8.2 Browser Console Commands

```javascript
// Check consistency status
DataConsistencyChecker.status();

// Run manual check
DataConsistencyChecker.check();

// Get data
ConsistentData.getData("today", "all");

// Capitalize label
TimeLabelVi.capitalize("hôm nay");

// Sort services
ServiceOrder.sortByServiceOrder(items);

// Enable debug mode
window.DEBUG_CONSISTENCY = true;
```

### 8.3 Utility Files

| File                          | Exports                  | Purpose                   |
| ----------------------------- | ------------------------ | ------------------------- |
| `data-consistency.js`         | `ConsistentData`         | Centralized data store    |
| `time-label-vi.js`            | `TimeLabelVi`            | Time label capitalization |
| `service-order.js`            | `ServiceOrder`           | Service ordering          |
| `data-consistency-checker.js` | `DataConsistencyChecker` | Runtime validation        |

---

## 9. Training Checklist

New team members should:

- [ ] Read this guide completely
- [ ] Read `TODO.md` requirements
- [ ] Read `DATA-CONSISTENCY-GUIDE.md`
- [ ] Run all validation scripts
- [ ] Practice fixing a test inconsistency
- [ ] Add a new test page following guidelines
- [ ] Review recent commits for patterns
- [ ] Set up pre-commit hooks

---

## 10. Contact & Support

**Questions?** Ask in:

- Team chat: #frontend-dev
- Code reviews
- Weekly sync meetings

**Found a bug in validation tools?**

- Create issue with `data-consistency` label
- Tag: @tech-lead

**Suggest improvements:**

- Open PR with proposed changes
- Update this guide with learnings

---

**Last Updated:** 2025-01-23  
**Next Review:** 2025-02-23

**Maintained by:** Development Team  
**Approved by:** Tech Lead
