# Move Revenue files to module structure
Write-Host "Moving Revenue files to module structure..."

# Revenue files by location and timeline
$revenueFiles = @{
    # Revenue Reports
    "revenue-reports.html" = "03-revenue\timeline\reports"
    "sales-report.html" = "03-revenue\timeline\reports"
    "daily-revenue-detail.html" = "03-revenue\timeline\daily"
    "revenue-mtd-detail.html" = "03-revenue\timeline\mtd"
    "total-revenue-mtd-detail.html" = "03-revenue\timeline\mtd"
    
    # Service Revenue
    "revenue-service-detail.html" = "03-revenue\locations\service"
    "revenue-service-filtered.html" = "03-revenue\locations\service"
    
    # Club Revenue
    "club-detail.html" = "03-revenue\locations\club"
    "revenue-club-detail.html" = "03-revenue\locations\club"
    "revenue-club-filtered.html" = "03-revenue\locations\club"
    
    # Staff Revenue
    "revenue-staff-detail.html" = "03-revenue\locations\staff"
    "revenue-staff-filtered.html" = "03-revenue\locations\staff"
    
    # Payment Revenue
    "revenue-payment-detail.html" = "03-revenue\locations\payment"
    
    # Target Revenue
    "revenue-target-detail.html" = "03-revenue\locations\target"
    "sales-target-demo.html" = "03-revenue\locations\target"
    
    # Operation Revenue
    "operation-reports.html" = "03-revenue\locations\operation"
    "operation-detail.html" = "03-revenue\locations\operation"
    "operation-pt-detail.html" = "03-revenue\locations\operation"
    "operation-member-detail.html" = "03-revenue\locations\operation"
    
    # Facility Revenue
    "facility-utilization-detail.html" = "03-revenue\locations\facility"
    "facility-utilization-overview.html" = "03-revenue\locations\facility"
    "daily-average-detail.html" = "03-revenue\locations\facility"
    "growth-comparison-detail.html" = "03-revenue\locations\facility"
    
    # Analytics
    "database-analytics-demo.html" = "03-revenue\timeline\analytics"
    "auto-daily-report.html" = "03-revenue\timeline\analytics"
    
    # Fitness Revenue
    "fitness-detail.html" = "03-revenue\locations\fitness"
    "fit-today-detail.html" = "03-revenue\locations\fitness"
    "fit-mtd-detail.html" = "03-revenue\locations\fitness"
    
    # Membership Revenue
    "membership-detail.html" = "03-revenue\locations\membership"
    "pilates-occupancy-detail.html" = "03-revenue\locations\membership"
    "swimming-coach-occupancy-detail.html" = "03-revenue\locations\membership"
    "gym-occupancy-detail.html" = "03-revenue\locations\membership"
    "remaining-days-detail.html" = "03-revenue\locations\membership"
}

foreach ($file in $revenueFiles.Keys) {
    $destination = "modules\$($revenueFiles[$file])"
    if (Test-Path "pages\$file") {
        Copy-Item "pages\$file" "$destination\" -Force
        Write-Host "Moved $file to $destination"
    }
}

Write-Host "Revenue files movement completed!"


