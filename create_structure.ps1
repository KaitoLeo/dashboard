# Create module structure with locations and timeline
$modules = @("03-revenue", "04-crm", "05-booking", "06-reports")

foreach ($module in $modules) {
    New-Item -ItemType Directory -Path "modules\$module\locations" -Force
    New-Item -ItemType Directory -Path "modules\$module\timeline" -Force
    Write-Host "Created structure for $module"
}



