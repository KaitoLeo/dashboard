# Move remaining files (Booking and Reports)
Write-Host "Moving remaining files to module structure..."

# Booking files
$bookingFiles = @{
    "booking.html" = "05-booking\timeline\management"
}

# Reports files
$reportsFiles = @{
    "receipt-reports.html" = "06-reports\timeline\receipt"
    "audit-reports.html" = "06-reports\timeline\audit"
}

# Move booking files
foreach ($file in $bookingFiles.Keys) {
    $destination = "modules\$($bookingFiles[$file])"
    if (Test-Path "pages\$file") {
        Copy-Item "pages\$file" "$destination\" -Force
        Write-Host "Moved $file to $destination"
    }
}

# Move reports files
foreach ($file in $reportsFiles.Keys) {
    $destination = "modules\$($reportsFiles[$file])"
    if (Test-Path "pages\$file") {
        Copy-Item "pages\$file" "$destination\" -Force
        Write-Host "Moved $file to $destination"
    }
}

Write-Host "All files movement completed!"


