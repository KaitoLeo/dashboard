# Script để đánh số phân loại các file chưa được đánh số trong thư mục pages

# Định nghĩa mapping cho các file chưa đánh số
$fileMappings = @{
    # Check-in related files (03-01)
    "checkin-overview.html" = "03-01-01-01-checkin-overview.html"
    "checkin-today-detail.html" = "03-01-01-02-checkin-today-detail.html"
    "checkin-yesterday-detail.html" = "03-01-01-03-checkin-yesterday-detail.html"
    "checkin-mtd-detail.html" = "03-01-01-04-checkin-mtd-detail.html"
    "checkin-frequency-detail.html" = "03-01-01-05-checkin-frequency-detail.html"
    "frequency-analysis.html" = "03-01-01-06-checkin-frequency-analysis.html"
    
    # Membership check-in (03-01-02)
    "membership-checkin-detail.html" = "03-01-02-01-membership-checkin-detail.html"
    "membership-checkin-today-detail.html" = "03-01-02-02-membership-checkin-today-detail.html"
    "membership-checkin-mtd-detail.html" = "03-01-02-03-membership-checkin-mtd-detail.html"
    
    # PT Fitness check-in (03-01-04)
    "pt-fitness-checkin-detail.html" = "03-01-04-01-pt-fitness-checkin-detail.html"
    "pt-fitness-checkin-today-detail.html" = "03-01-04-02-pt-fitness-checkin-today-detail.html"
    "pt-fitness-checkin-mtd-detail.html" = "03-01-04-03-pt-fitness-checkin-mtd-detail.html"
    
    # Pilates check-in (03-01-05)
    "pilates-checkin-detail.html" = "03-01-05-01-pilates-checkin-detail.html"
    "pilates-checkin-today-detail.html" = "03-01-05-02-pilates-checkin-today-detail.html"
    "pilates-checkin-mtd-detail.html" = "03-01-05-03-pilates-checkin-mtd-detail.html"
    "pilates-occupancy-detail.html" = "03-01-05-04-pilates-occupancy-detail.html"
    
    # Swimming Coach check-in (03-01-06)
    "swimming-coach-checkin-detail.html" = "03-01-06-01-swimming-coach-checkin-detail.html"
    "swimming-coach-checkin-today-detail.html" = "03-01-06-02-swimming-coach-checkin-today-detail.html"
    "swimming-coach-checkin-mtd-detail.html" = "03-01-06-03-swimming-coach-checkin-mtd-detail.html"
    "swimming-coach-occupancy-detail.html" = "03-01-06-04-swimming-coach-occupancy-detail.html"
    
    # Late check-in (03-01-07)
    "late-checkin-detail.html" = "03-01-07-01-late-checkin-detail.html"
    "late-checkin-today-detail.html" = "03-01-07-02-late-checkin-today-detail.html"
    "late-checkin-mtd-detail.html" = "03-01-07-03-late-checkin-mtd-detail.html"
    
    # Manual check-in & visitors (03-01-08)
    "manual-checkin-detail.html" = "03-01-08-01-manual-checkin-detail.html"
    "members-list-detail.html" = "03-01-08-02-members-list-detail.html"
    "visitors-detail.html" = "03-01-08-03-visitors-detail.html"
    "trial-guests-detail.html" = "03-01-08-04-trial-guests-detail.html"
    
    # Contract related (03-02)
    "contract-reports.html" = "03-02-01-01-contract-reports.html"
    "contract-member-detail.html" = "03-02-02-01-contract-member-detail.html"
    "contract-trainer-detail.html" = "03-02-03-01-contract-trainer-detail.html"
    "contract-activation-detail.html" = "03-02-04-01-contract-activation-detail.html"
    "burn-rate-detail.html" = "03-02-05-01-burn-rate-detail.html"
    "burn-rate-detail-new.html" = "03-02-05-02-burn-rate-new-detail.html"
    "burn-rate-detail-old.html" = "03-02-05-03-burn-rate-old-detail.html"
    "completion-rate-detail.html" = "03-02-06-01-completion-rate-detail.html"
    
    # Revenue related (03-03)
    "revenue-reports.html" = "03-03-01-01-revenue-reports.html"
    "sales-report.html" = "03-03-01-02-sales-report.html"
    "daily-revenue-detail.html" = "03-03-01-03-daily-revenue-detail.html"
    "revenue-mtd-detail.html" = "03-03-01-04-revenue-mtd-detail.html"
    "total-revenue-mtd-detail.html" = "03-03-01-05-total-revenue-mtd-detail.html"
    "revenue-service-detail.html" = "03-03-02-01-revenue-service-detail.html"
    "revenue-service-filtered.html" = "03-03-02-02-revenue-service-filtered.html"
    "club-detail.html" = "03-03-03-01-club-detail.html"
    "revenue-club-detail.html" = "03-03-03-02-revenue-club-detail.html"
    "revenue-club-filtered.html" = "03-03-03-03-revenue-club-filtered.html"
    "revenue-staff-detail.html" = "03-03-04-01-revenue-staff-detail.html"
    "revenue-staff-filtered.html" = "03-03-04-02-revenue-staff-filtered.html"
    "revenue-payment-detail.html" = "03-03-05-01-revenue-payment-detail.html"
    "revenue-target-detail.html" = "03-03-06-01-revenue-target-detail.html"
    "sales-target-demo.html" = "03-03-06-02-sales-target-demo.html"
    "operation-reports.html" = "03-03-07-01-operation-reports.html"
    "operation-detail.html" = "03-03-07-02-operation-detail.html"
    "operation-pt-detail.html" = "03-03-07-03-operation-pt-detail.html"
    "operation-member-detail.html" = "03-03-07-04-operation-member-detail.html"
    "facility-utilization-detail.html" = "03-03-08-01-facility-utilization-detail.html"
    "facility-utilization-overview.html" = "03-03-08-02-facility-utilization-overview.html"
    "daily-average-detail.html" = "03-03-08-03-daily-average-detail.html"
    "growth-comparison-detail.html" = "03-03-08-04-growth-comparison-detail.html"
    "database-analytics-demo.html" = "03-03-09-01-database-analytics-demo.html"
    "auto-daily-report.html" = "03-03-09-02-auto-daily-report.html"
    "fitness-detail.html" = "03-03-10-01-fitness-detail.html"
    "fit-today-detail.html" = "03-03-10-02-fitness-today-detail.html"
    "fit-mtd-detail.html" = "03-03-10-03-fitness-mtd-detail.html"
    "membership-detail.html" = "03-03-11-01-membership-detail.html"
    "pilates-occupancy-detail.html" = "03-03-11-02-pilates-occupancy-detail.html"
    "swimming-coach-occupancy-detail.html" = "03-03-11-03-swimming-coach-occupancy-detail.html"
    "gym-occupancy-detail.html" = "03-03-11-04-gym-occupancy-detail.html"
    "remaining-days-detail.html" = "03-03-12-01-remaining-days-detail.html"
    
    # CRM related (03-04)
    "crm-reports.html" = "03-04-01-01-crm-reports.html"
    "crm-detail.html" = "03-04-01-02-crm-detail.html"
    "customers.html" = "03-04-02-01-customers.html"
    "csr-reports.html" = "03-04-03-01-csr-reports.html"
    "member-movement-detail.html" = "03-04-04-01-member-movement-detail.html"
    "birthday-members-detail.html" = "03-04-05-01-birthday-members-detail.html"
    
    # Booking related (03-05)
    "booking.html" = "03-05-01-01-booking-management.html"
    "booking-today-detail.html" = "03-05-01-02-booking-today-detail.html"
    "booking-yesterday-detail.html" = "03-05-01-03-booking-yesterday-detail.html"
    "booking-mtd-detail.html" = "03-05-01-04-booking-mtd-detail.html"
    "booking-this-week-detail.html" = "03-05-01-05-booking-this-week-detail.html"
    
    # Audit related (03-06)
    "audit-reports.html" = "03-06-01-01-audit-reports.html"
    "receipt-reports.html" = "03-06-02-01-receipt-reports.html"
    
    # Settings/Generic (99)
    "settings.html" = "99-01-01-settings.html"
    "generic-detail.html" = "99-01-02-generic-detail.html"
}

# Thực hiện đổi tên file
$pagesPath = "pages"
$renamedCount = 0
$skippedCount = 0

Write-Host "Bắt đầu đánh số phân loại các file chưa được đánh số..." -ForegroundColor Green

foreach ($oldName in $fileMappings.Keys) {
    $newName = $fileMappings[$oldName]
    $oldPath = Join-Path $pagesPath $oldName
    $newPath = Join-Path $pagesPath $newName
    
    if (Test-Path $oldPath) {
        if (-not (Test-Path $newPath)) {
            try {
                Rename-Item -Path $oldPath -NewName $newName
                Write-Host "✓ Đã đổi tên: $oldName -> $newName" -ForegroundColor Green
                $renamedCount++
            }
            catch {
                Write-Host "✗ Lỗi khi đổi tên $oldName : $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        else {
            Write-Host "⚠ File đích đã tồn tại: $newName" -ForegroundColor Yellow
            $skippedCount++
        }
    }
    else {
        Write-Host "⚠ Không tìm thấy file: $oldName" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host "`nKết quả:" -ForegroundColor Cyan
Write-Host "- Đã đổi tên: $renamedCount file" -ForegroundColor Green
Write-Host "- Bỏ qua: $skippedCount file" -ForegroundColor Yellow
Write-Host "`nHoàn thành việc đánh số phân loại!" -ForegroundColor Green
