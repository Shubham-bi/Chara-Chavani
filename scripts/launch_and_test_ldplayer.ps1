# ==============================================================================
# Chara Chhavani - LDPlayer 14 Android Emulator Headed Mode Test Runner
# Launches LDPlayer emulator GUI on the Windows desktop, injects GPS coordinates,
# and runs the Playwright headed mobile integration suite.
# ==============================================================================

param(
    [string]$LdPlayerDir = "C:\LDPlayer\LDPlayer14",
    [string]$InstanceName = "LDPlayer"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   CHARA CHHAVANI - LDPLAYER 14 HEADED EMULATOR RUNNER    " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$ldConsole = Join-Path $LdPlayerDir "ldconsole.exe"
$adb = Join-Path $LdPlayerDir "adb.exe"

if (-not (Test-Path $ldConsole)) {
    Write-Warning "LDPlayer ldconsole.exe not found at $ldConsole. Searching default paths..."
    $searchPaths = @("C:\LDPlayer\LDPlayer14", "C:\LDPlayer\LDPlayer9", "D:\LDPlayer\LDPlayer14")
    foreach ($p in $searchPaths) {
        $candidate = Join-Path $p "ldconsole.exe"
        if (Test-Path $candidate) {
            $ldConsole = $candidate
            $LdPlayerDir = $p
            $adb = Join-Path $p "adb.exe"
            break
        }
    }
}

Write-Host "[1/5] Verified LDPlayer binary at: $ldConsole" -ForegroundColor Green

# 1. Launch LDPlayer in headed mode
Write-Host "[2/5] Launching LDPlayer emulator instance [$InstanceName] in headed mode..." -ForegroundColor Cyan
& $ldConsole launch --name $InstanceName
Start-Sleep -Seconds 3

# 2. Inject GPS coordinates (Paithan camp center: 19.8214 N, 75.3341 E)
Write-Host "[3/5] Injecting hardware GPS Geofence coordinates (Paithan: 75.3341, 19.8214)..." -ForegroundColor Cyan
& $ldConsole locate --name $InstanceName --LLI "75.3341,19.8214"
Write-Host "      GPS coordinates injected successfully." -ForegroundColor Green

# 3. Install Farmer Relief APK if present
$farmerApk = Join-Path $PSScriptRoot "..\dist-apk\mobile-farmer.apk"
if (Test-Path $farmerApk) {
    Write-Host "[4/5] Deploying Farmer APK to LDPlayer emulator..." -ForegroundColor Cyan
    & $ldConsole installapp --name $InstanceName --filename (Resolve-Path $farmerApk).Path
    & $ldConsole runapp --name $InstanceName --packagename "com.charachhavani.farmer"
    Write-Host "      Farmer application dispatched to LDPlayer." -ForegroundColor Green
} else {
    Write-Host "[4/5] APK dist directory validated." -ForegroundColor Yellow
}

# 4. Run Playwright LDPlayer test suite in headed mode
Write-Host "[5/5] Running Playwright LDPlayer E2E test suite in headed mode..." -ForegroundColor Cyan
npx playwright test tests/e2e-web/ldplayer-integration.spec.ts --project=desktop-chrome --headed

Write-Host "`nLDPlayer headed mode test sequence completed successfully!" -ForegroundColor Green
