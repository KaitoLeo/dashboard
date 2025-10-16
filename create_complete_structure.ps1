# Create complete module structure with locations and timeline
Write-Host "Creating complete module structure..."

# Module 1: Check-in (03-01)
$checkinTimeline = @("today", "yesterday", "mtd", "frequency")
foreach ($timeline in $checkinTimeline) {
    New-Item -ItemType Directory -Path "modules\01-checkin\timeline\$timeline" -Force
}

# Module 2: Contract (03-02) 
$contractTimeline = @("reports", "member", "trainer", "activation", "burn-rate", "completion")
foreach ($timeline in $contractTimeline) {
    New-Item -ItemType Directory -Path "modules\02-contract\timeline\$timeline" -Force
}

# Module 3: Revenue (03-03)
$revenueLocations = @("service", "club", "staff", "payment", "target", "operation", "facility", "fitness", "membership")
$revenueTimeline = @("daily", "mtd", "reports", "analytics")
foreach ($location in $revenueLocations) {
    New-Item -ItemType Directory -Path "modules\03-revenue\locations\$location" -Force
}
foreach ($timeline in $revenueTimeline) {
    New-Item -ItemType Directory -Path "modules\03-revenue\timeline\$timeline" -Force
}

# Module 4: CRM (03-04)
$crmTimeline = @("reports", "detail", "customers", "csr", "movement", "birthday")
foreach ($timeline in $crmTimeline) {
    New-Item -ItemType Directory -Path "modules\04-crm\timeline\$timeline" -Force
}

# Module 5: Booking (03-05)
New-Item -ItemType Directory -Path "modules\05-booking\timeline\management" -Force

# Module 6: Reports (03-06)
$reportsTimeline = @("receipt", "audit")
foreach ($timeline in $reportsTimeline) {
    New-Item -ItemType Directory -Path "modules\06-reports\timeline\$timeline" -Force
}

Write-Host "Complete module structure created successfully!"



