# Move files to module structure based on logic
Write-Host "Moving files to module structure..."

# Module 1: Check-in files
$checkinFiles = @{
    "pt-fitness-checkin-detail.html" = "01-checkin\timeline\today"
    "pt-fitness-checkin-today-detail.html" = "01-checkin\timeline\today"
    "pt-fitness-checkin-mtd-detail.html" = "01-checkin\timeline\mtd"
    "pilates-checkin-detail.html" = "01-checkin\timeline\today"
    "pilates-checkin-today-detail.html" = "01-checkin\timeline\today"
    "pilates-checkin-mtd-detail.html" = "01-checkin\timeline\mtd"
    "swimming-coach-checkin-detail.html" = "01-checkin\timeline\today"
    "swimming-coach-checkin-today-detail.html" = "01-checkin\timeline\today"
    "swimming-coach-checkin-mtd-detail.html" = "01-checkin\timeline\mtd"
    "late-checkin-detail.html" = "01-checkin\timeline\today"
    "late-checkin-today-detail.html" = "01-checkin\timeline\today"
    "late-checkin-mtd-detail.html" = "01-checkin\timeline\mtd"
    "manual-checkin-detail.html" = "01-checkin\timeline\today"
    "members-list-detail.html" = "01-checkin\timeline\today"
    "visitors-detail.html" = "01-checkin\timeline\today"
    "trial-guests-detail.html" = "01-checkin\timeline\today"
}

foreach ($file in $checkinFiles.Keys) {
    $destination = "modules\$($checkinFiles[$file])"
    if (Test-Path "pages\$file") {
        Copy-Item "pages\$file" "$destination\" -Force
        Write-Host "Moved $file to $destination"
    }
}

# Module 2: Contract files
$contractFiles = @{
    "contract-reports.html" = "02-contract\timeline\reports"
    "contract-member-detail.html" = "02-contract\timeline\member"
    "contract-trainer-detail.html" = "02-contract\timeline\trainer"
    "contract-activation-detail.html" = "02-contract\timeline\activation"
    "burn-rate-detail.html" = "02-contract\timeline\burn-rate"
    "burn-rate-detail-new.html" = "02-contract\timeline\burn-rate"
    "burn-rate-detail-old.html" = "02-contract\timeline\burn-rate"
    "completion-rate-detail.html" = "02-contract\timeline\completion"
}

foreach ($file in $contractFiles.Keys) {
    $destination = "modules\$($contractFiles[$file])"
    if (Test-Path "pages\$file") {
        Copy-Item "pages\$file" "$destination\" -Force
        Write-Host "Moved $file to $destination"
    }
}

Write-Host "File movement completed!"



