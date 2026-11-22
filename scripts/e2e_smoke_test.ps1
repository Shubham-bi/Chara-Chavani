<#
.SYNOPSIS
    Automated End-to-End Smoke Test Suite for Chara Chhavani Management System.
.DESCRIPTION
    Validates the end-to-end multi-tier pipeline against a running WebAPI instance:
    - Service Health & NetTopologySuite Geofence checks
    - Standardized Master Reference Data catalogs
    - Database Seeder execution
    - Mobile OTP Authentication (Farmer/Vet/Officer/Operator)
    - Admin Dashboard Username/Password authentication
    - Camp Point-in-Polygon Geofence verification
    - State Executive KPI Dashboard aggregation
.PARAMETER ApiBaseUrl
    The base URL of the ASP.NET Core WebAPI (default: http://localhost:5000).
.EXAMPLE
    .\scripts\e2e_smoke_test.ps1 -ApiBaseUrl "http://localhost:5000"
#>

[CmdletBinding()]
param (
    [string]$ApiBaseUrl = "http://localhost:5000",
    [int]$TimeoutSeconds = 30,
    [switch]$SkipSeed
)

$ErrorActionPreference = "Stop"

$script:TotalTests = 0
$script:PassedTests = 0
$script:FailedTests = 0

function Write-TestHeader([string]$Title) {
    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
}

function Assert-Result([string]$TestName, [bool]$Condition, [string]$Details = "") {
    $script:TotalTests++
    if ($Condition) {
        $script:PassedTests++
        Write-Host " [PASS] $TestName" -ForegroundColor Green
        if ($Details) {
            Write-Host "        $Details" -ForegroundColor Gray
        }
    }
    else {
        $script:FailedTests++
        Write-Host " [FAIL] $TestName" -ForegroundColor Red
        if ($Details) {
            Write-Host "        $Details" -ForegroundColor DarkYellow
        }
    }
}

function Invoke-Api([string]$Method, [string]$Path, [object]$Body = $null) {
    $url = "$ApiBaseUrl$Path"
    $headers = @{
        "Accept" = "application/json"
    }
    
    $params = @{
        Uri        = $url
        Method     = $Method
        Headers    = $headers
        TimeoutSec = $TimeoutSeconds
    }

    if ($Body -ne $null) {
        $params["ContentType"] = "application/json; charset=utf-8"
        $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
    }

    try {
        $res = Invoke-RestMethod @params
        return $res
    }
    catch {
        Write-Host "  [HTTP ERROR] $Method $url : $_" -ForegroundColor Red
        return $null
    }
}

Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "  CHARA CHHAVANI E2E SMOKE TEST RUNNER" -ForegroundColor Magenta
Write-Host "  Target Base URL: $ApiBaseUrl" -ForegroundColor Magenta
Write-Host "  Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Magenta
Write-Host "========================================================" -ForegroundColor Magenta

# 1. Health & Spatial Diagnostics
Write-TestHeader "1. Health & Geofence Diagnostics"
$health = Invoke-Api -Method "GET" -Path "/api/v1/health"
Assert-Result "Service Health Status Check" ($null -ne $health -and $health.success -eq $true) "Service: $($health.data.service), Status: $($health.data.status)"

$geofencePayload = @{
    polygonCoordinates = @(
        @{ latitude = 19.4780; longitude = 75.3880 },
        @{ latitude = 19.4810; longitude = 75.3880 },
        @{ latitude = 19.4810; longitude = 75.3910 },
        @{ latitude = 19.4780; longitude = 75.3910 }
    )
    pointLatitude      = 19.4795
    pointLongitude     = 75.3895
}
$geofenceCheck = Invoke-Api -Method "POST" -Path "/api/v1/health/verify-geofence" -Body $geofencePayload
Assert-Result "Spatial Ray-Casting Geofence Check" ($null -ne $geofenceCheck -and $geofenceCheck.success -eq $true -and $geofenceCheck.data.isInside -eq $true) "Point inside polygon: $($geofenceCheck.data.isInside)"

# 2. Master Reference Data
Write-TestHeader "2. Master Reference Data Services"
$districts = Invoke-Api -Method "GET" -Path "/api/v1/master/districts"
Assert-Result "Districts Catalog Retrieval" ($null -ne $districts -and $districts.success -eq $true -and $districts.data.Count -ge 8) "Retrieved $($districts.data.Count) drought-prone districts"

$talukas = Invoke-Api -Method "GET" -Path "/api/v1/master/talukas?district=Chhatrapati%20Sambhajinagar"
Assert-Result "Talukas Catalog Retrieval (Chhatrapati Sambhajinagar)" ($null -ne $talukas -and $talukas.success -eq $true -and $talukas.data.Count -ge 5) "Retrieved $($talukas.data.Count) talukas"

$breeds = Invoke-Api -Method "GET" -Path "/api/v1/master/breeds?category=Small"
Assert-Result "Small Animal Breeds Catalog" ($null -ne $breeds -and $breeds.success -eq $true -and $breeds.data.Count -ge 4) "Retrieved $($breeds.data.Count) breeds"

$fodderTypes = Invoke-Api -Method "GET" -Path "/api/v1/master/fodder-types"
Assert-Result "Standardized Fodder Types Catalog" ($null -ne $fodderTypes -and $fodderTypes.success -eq $true -and $fodderTypes.data.Count -ge 4) "Retrieved $($fodderTypes.data.Count) fodder types"

# 3. Database Seeding (Optional / Idempotent)
if (-not $SkipSeed) {
    Write-TestHeader "3. Database Baseline Seeder"
    $seedRes = Invoke-Api -Method "POST" -Path "/api/v1/master/seed" -Body @{}
    Assert-Result "Database Seeder Execution" ($null -ne $seedRes -and $seedRes.success -eq $true) "$($seedRes.message)"
}

# 4. Authentication Flows
Write-TestHeader "4. Authentication & Security Flows"
$otpSend = Invoke-Api -Method "POST" -Path "/api/v1/auth/mobile/send-otp" -Body @{ mobileNumber = "9822012345"; role = "Farmer" }
Assert-Result "Mobile OTP Dispatch (Farmer)" ($null -ne $otpSend -and $otpSend.success -eq $true) "$($otpSend.data)"

$otpVerify = Invoke-Api -Method "POST" -Path "/api/v1/auth/mobile/verify-otp" -Body @{ mobileNumber = "9822012345"; otp = "123456"; role = "Farmer" }
Assert-Result "Mobile OTP Verification (Farmer Login)" ($null -ne $otpVerify -and $otpVerify.success -eq $true -and -not [string]::IsNullOrEmpty($otpVerify.data.token)) "User: $($otpVerify.data.fullName), Role: $($otpVerify.data.role)"

$adminLogin = Invoke-Api -Method "POST" -Path "/api/v1/auth/admin/login" -Body @{ username = "admin"; password = "AdminPassword@123" }
Assert-Result "Admin Username/Password Authentication" ($null -ne $adminLogin -and $adminLogin.success -eq $true -and -not [string]::IsNullOrEmpty($adminLogin.data.token)) "Admin Role: $($adminLogin.data.role)"

# 5. Camp Geofence Validation
Write-TestHeader "5. Cattle Camp Spatial Boundary Checks"
$camps = Invoke-Api -Method "GET" -Path "/api/v1/camps"
Assert-Result "Camps Listing Retrieval" ($null -ne $camps -and $camps.success -eq $true -and $camps.data.Count -ge 1) "Active camps found: $($camps.data.Count)"

if ($camps -ne $null -and $camps.data.Count -gt 0) {
    $targetCamp = ($camps.data | Where-Object { $_.campCode -eq "CHV-MH-PAITHAN-001" })
    if ($null -eq $targetCamp) { $targetCamp = $camps.data[0] }
    $campId = $targetCamp.id
    # Inside coordinate (Paithan camp center: 19.82, 75.33)
    $pointInside = Invoke-Api -Method "GET" -Path "/api/v1/camps/$campId/validate-point?latitude=19.82&longitude=75.33"
    Assert-Result "Camp Geofence Validation (Point Inside)" ($null -ne $pointInside -and $pointInside.success -eq $true -and $pointInside.data.isInside -eq $true) "Status: $($pointInside.data.message)"

    # Outside coordinate (Far away: 18.0000, 74.0000)
    $pointOutside = Invoke-Api -Method "GET" -Path "/api/v1/camps/$campId/validate-point?latitude=18.0000&longitude=74.0000"
    Assert-Result "Camp Geofence Validation (Point Outside)" ($null -ne $pointOutside -and $pointOutside.success -eq $true -and $pointOutside.data.isInside -eq $false) "Status: $($pointOutside.data.message)"
}

# 6. Admin KPI Dashboard Summary
Write-TestHeader "6. State Executive KPI Dashboard"
$dashboard = Invoke-Api -Method "GET" -Path "/api/v1/admin/dashboard"
Assert-Result "Admin Dashboard KPI Metrics" ($null -ne $dashboard -and $dashboard.success -eq $true) "Total Camps: $($dashboard.data.totalCharaChhavaniCentres), Cattle: $($dashboard.data.totalActiveAdmittedAnimals), Fodder: $($dashboard.data.totalAvailableStockKg) kg"

# 7. Officer Audit Trail
Write-TestHeader "7. Government Officer Dashboard"
$officerDash = Invoke-Api -Method "GET" -Path "/api/v1/officer/dashboard"
Assert-Result "Officer Audit Overview" ($null -ne $officerDash -and $officerDash.success -eq $true) "Camps Monitored: $($officerDash.data.totalRegisteredCamps), Cattle Headcount: $($officerDash.data.totalAdmittedLivestock)"

# 8. State Government Audit & Compliance Reporting
Write-TestHeader "8. State Government Audit & Compliance Reporting"
$admissionsReport = Invoke-Api -Method "GET" -Path "/api/v1/admin/reports/admissions?pageNumber=1&pageSize=10"
Assert-Result "Admissions Audit Report Generation" ($null -ne $admissionsReport -and $admissionsReport.success -eq $true) "Records returned: $($admissionsReport.data.Count)"

$fodderReport = Invoke-Api -Method "GET" -Path "/api/v1/admin/reports/fodder-reconciliation"
Assert-Result "Fodder Stock Reconciliation Report" ($null -ne $fodderReport -and $fodderReport.success -eq $true) "Stock balances evaluated: $($fodderReport.data.Count)"

$expensesReport = Invoke-Api -Method "GET" -Path "/api/v1/admin/reports/expenses?pageNumber=1&pageSize=10"
Assert-Result "Operational Expenses Audit Report" ($null -ne $expensesReport -and $expensesReport.success -eq $true) "Expense records returned: $($expensesReport.data.Count)"

$inspectionsReport = Invoke-Api -Method "GET" -Path "/api/v1/admin/reports/inspections?pageNumber=1&pageSize=10"
Assert-Result "Officer Inspection Audit Report" ($null -ne $inspectionsReport -and $inspectionsReport.success -eq $true) "Inspection logs returned: $($inspectionsReport.data.Count)"

# Final Summary Report
Write-Host "`n========================================================" -ForegroundColor Magenta
Write-Host "  SMOKE TEST EXECUTION SUMMARY" -ForegroundColor Magenta
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "  Total Tests Executed : $script:TotalTests"
Write-Host "  Passed Tests         : $script:PassedTests" -ForegroundColor Green
Write-Host "  Failed Tests         : $script:FailedTests" -ForegroundColor $(if ($script:FailedTests -eq 0) { "Green" } else { "Red" })
Write-Host "========================================================`n" -ForegroundColor Magenta

if ($script:FailedTests -gt 0) {
    exit 1
}
else {
    exit 0
}
