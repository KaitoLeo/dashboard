# Move CRM files to module structure
Write-Host "Moving CRM files to module structure..."

$crmFiles = @{
    "crm-reports.html" = "04-crm\timeline\reports"
    "crm-detail.html" = "04-crm\timeline\detail"
    "customers.html" = "04-crm\timeline\customers"
    "csr-reports.html" = "04-crm\timeline\csr"
    "member-movement-detail.html" = "04-crm\timeline\movement"
    "birthday-members-detail.html" = "04-crm\timeline\birthday"
}

foreach ($file in $crmFiles.Keys) {
    $destination = "modules\$($crmFiles[$file])"
    if (Test-Path "pages\$file") {
        Copy-Item "pages\$file" "$destination\" -Force
        Write-Host "Moved $file to $destination"
    }
}

Write-Host "CRM files movement completed!"


