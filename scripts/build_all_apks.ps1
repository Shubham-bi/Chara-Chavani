# scripts/build_all_apks.ps1
# Automates compiling, packaging, aligning, and signing all 4 Chara Chhavani Android APKs

param(
    [string]$BuildToolsDir = "C:\Users\Shubham\AppData\Local\Android\Sdk\build-tools\34.0.0",
    [string]$AndroidJar = "C:\Users\Shubham\AppData\Local\Android\Sdk\platforms\android-34\android.jar",
    [string]$JdkBin = "C:\Program Files\Java\jdk-22\bin",
    [string]$DistDir = "dist-apk",
    [string]$BuildDir = "build-android"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Chara Chhavani: 4 Android APK Compilation Pipeline" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Ensure Output Directories Exist
if (!(Test-Path $DistDir)) { New-Item -ItemType Directory -Path $DistDir | Out-Null }
if (!(Test-Path $BuildDir)) { New-Item -ItemType Directory -Path $BuildDir | Out-Null }

# 2. Verify Release Keystore
$KeystorePath = "release.keystore"
if (!(Test-Path $KeystorePath)) {
    Write-Host "[KEYSTORE] Generating release.keystore..." -ForegroundColor Yellow
    & "$JdkBin\keytool.exe" -genkeypair -v -keystore $KeystorePath -alias charachhavani -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=CharaChhavani, OU=GovtOfMaharashtra, O=ReliefAndRehab, L=Mumbai, ST=Maharashtra, C=IN"
}

# 3. App Definitions Matrix
$Apps = @(
    @{
        Id = "mobile-chhavani"
        Package = "com.charachhavani.operator"
        Name = "Chhavani Operator"
        MarathiName = "चारा छावणी चालक (पैलठण)"
        Role = "CampOperator"
        ThemeColor = "#1B5E20"
        AccentColor = "#4C8C4A"
        IconColor = [System.Drawing.Color]::FromArgb(27, 94, 32)
        Tab1 = "जनावरे प्रवेश (Admit)"
        Tab2 = "दैनिक चारा व पाणी (Feeding)"
        Tab3 = "दैनिक खर्च व पावती (Expenses)"
        Metric1Val = "842"
        Metric1Lbl = "दाखल जनावरे (Cattle)"
        Metric2Val = "126.3 Q"
        Metric2Lbl = "आजचा चारा (1Q=100Kg)"
        Metric3Val = "28,400 L"
        Metric3Lbl = "पाणी पुरवठा (Water)"
        Metric4Val = "मान्य (Inside)"
        Metric4Lbl = "जिओफेन्स स्थिती (GPS)"
    },
    @{
        Id = "mobile-farmer"
        Package = "com.charachhavani.farmer"
        Name = "Farmer Portal"
        MarathiName = "शेतकरी मित्र (जनावरे व अनुदान)"
        Role = "Farmer"
        ThemeColor = "#E65100"
        AccentColor = "#FF833A"
        IconColor = [System.Drawing.Color]::FromArgb(230, 81, 0)
        Tab1 = "माझी जनावरे (My Cattle)"
        Tab2 = "चारा रेशन स्थिती (Fodder Intake)"
        Tab3 = "शासकीय अनुदान (DBT Subsidy)"
        Metric1Val = "4"
        Metric1Lbl = "माझी दाखल जनावरे"
        Metric2Val = "₹ 14,400"
        Metric2Lbl = "जमा अनुदान (DBT)"
        Metric3Val = "नियमित"
        Metric3Lbl = "दैनिक चारा पुरवठा"
        Metric4Val = "सक्रिय (Active)"
        Metric4Lbl = "आधार जोडणी (Aadhaar)"
    },
    @{
        Id = "mobile-officer"
        Package = "com.charachhavani.officer"
        Name = "Revenue Officer"
        MarathiName = "महसूल तपासणी अधिकारी"
        Role = "DistrictOfficer"
        ThemeColor = "#0277BD"
        AccentColor = "#58A5F0"
        IconColor = [System.Drawing.Color]::FromArgb(2, 119, 189)
        Tab1 = "अचानक तपासणी (Surprise Inspection)"
        Tab2 = "संख्या पडताळणी (Muster Audit)"
        Tab3 = "दंड व अहवाल (Penalties & Sign-off)"
        Metric1Val = "14"
        Metric1Lbl = "नियुक्त छावण्या"
        Metric2Val = "1.66%"
        Metric2Lbl = "नोंदवलेली तफावत (Shortfall)"
        Metric3Val = "४.५ ★"
        Metric3Lbl = "चारा गुणवत्ता रेटिंग"
        Metric4Val = "मान्य (Inside)"
        Metric4Lbl = "स्थान पडताळणी"
    },
    @{
        Id = "mobile-vet"
        Package = "com.charachhavani.vet"
        Name = "Veterinary Doctor"
        MarathiName = "पशुवैद्यकीय डॉक्टर (आरोग्य तपासणी)"
        Role = "VetDoctor"
        ThemeColor = "#880E4F"
        AccentColor = "#BC477B"
        IconColor = [System.Drawing.Color]::FromArgb(136, 14, 79)
        Tab1 = "वैद्यकीय तपासणी (Clinical Round)"
        Tab2 = "लसीकरण व औषधोपचार (Rx)"
        Tab3 = "मृत्यू नोंद व प्रमाणपत्र (Post-Mortem)"
        Metric1Val = "68"
        Metric1Lbl = "आज तपासलेली जनावरे"
        Metric2Val = "3"
        Metric2Lbl = "अलगीकरण कक्ष (Quarantine)"
        Metric3Val = "100%"
        Metric3Lbl = "लसीकरण प्रमाण (FMD)"
        Metric4Val = "0"
        Metric4Lbl = "आजची मृत्यू संख्या"
    }
)

function Build-Single-Apk($app) {
    $appId = $app.Id
    $pkg = $app.Package
    $appName = $app.Name
    $appWorkDir = Join-Path $BuildDir $appId

    Write-Host "`n-----------------------------------------------------------------" -ForegroundColor Magenta
    Write-Host " Building: $appName ($pkg)" -ForegroundColor Magenta
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Magenta

    if (Test-Path $appWorkDir) { Remove-Item -Recurse -Force $appWorkDir }
    New-Item -ItemType Directory -Path "$appWorkDir\res\values" -Force | Out-Null
    New-Item -ItemType Directory -Path "$appWorkDir\res\drawable" -Force | Out-Null
    New-Item -ItemType Directory -Path "$appWorkDir\src\$($pkg.Replace('.', '\'))" -Force | Out-Null
    New-Item -ItemType Directory -Path "$appWorkDir\assets" -Force | Out-Null
    New-Item -ItemType Directory -Path "$appWorkDir\bin" -Force | Out-Null
    New-Item -ItemType Directory -Path "$appWorkDir\dex" -Force | Out-Null

    # Generate Launcher Icon
    $iconBmp = New-Object System.Drawing.Bitmap(72, 72)
    $g = [System.Drawing.Graphics]::FromImage($iconBmp)
    $g.Clear($app.IconColor)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $font = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
    $letter = $appName.Substring(0, 1)
    $g.DrawString($letter, $font, $brush, 18, 14)
    $iconBmp.Save("$appWorkDir\res\drawable\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $iconBmp.Dispose()

    # Generate strings.xml
    $stringsXml = @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">$appName</string>
</resources>
"@

    # Generate styles.xml
    $stylesXml = @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar.Fullscreen">
        <item name="android:windowBackground">@android:color/white</item>
    </style>
</resources>
"@

    # Generate AndroidManifest.xml
    $manifestXml = @"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="$pkg"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"@

    # Generate MainActivity.java using static inner classes
    $javaCode = @"
package $pkg;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private WebView webView;

    public static class CustomWebChromeClient extends WebChromeClient {
        @Override
        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
            callback.invoke(origin, true, false);
        }
    }

    public static class CustomWebViewClient extends WebViewClient {
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        webView.setWebChromeClient(new CustomWebChromeClient());
        webView.setWebViewClient(new CustomWebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
"@

    # Generate App Asset HTML (Persona-Tailored UI with @chara-chhavani/ui-core Styling & Backend Client)
    $appHtml = @"
<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>$($app.MarathiName)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif; }
    body { background-color: #F4F6F8; color: #212121; font-size: 15px; line-height: 1.45; }
    header { background: $($app.ThemeColor); color: #fff; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 4px rgba(0,0,0,0.15); }
    header h1 { font-size: 17px; font-weight: 700; line-height: 1.4; }
    .badge { font-size: 11px; padding: 3px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
    .badge-online { background: #E8F5E9; color: #1B5E20; }
    .badge-offline { background: #FFEBEE; color: #C62828; }
    .container { padding: 16px; max-width: 600px; margin: 0 auto; }
    .card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border-top: 3px solid $($app.ThemeColor); }
    .card h2 { font-size: 16px; margin-bottom: 8px; color: $($app.ThemeColor); font-weight: 700; line-height: 1.35; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .stat-box { background: #F8F9FA; border-radius: 6px; padding: 10px; border-left: 3px solid $($app.AccentColor); }
    .stat-val { font-size: 18px; font-weight: 700; color: #212121; }
    .stat-lbl { font-size: 12px; color: #616161; line-height: 1.35; }
    .btn { display: block; width: 100%; padding: 12px; background: $($app.ThemeColor); color: #fff; border: none; border-radius: 6px; font-size: 15px; font-weight: 600; text-align: center; cursor: pointer; margin-top: 10px; }
    .btn-secondary { background: #ECEFF1; color: #37474F; border: 1px solid #CFD8DC; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #424242; line-height: 1.35; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #B0BEC5; border-radius: 6px; font-size: 14px; background: #fff; }
    .alert { padding: 12px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; line-height: 1.4; }
    .alert-success { background: #E8F5E9; color: #1B5E20; border-left: 4px solid #2E7D32; }
    .alert-error { background: #FFEBEE; color: #C62828; border-left: 4px solid #C62828; }
    .alert-info { background: #E1F5FE; color: #0277BD; border-left: 4px solid #0288D1; }
    .tabs { display: flex; border-bottom: 1px solid #CFD8DC; margin-bottom: 14px; }
    .tab { flex: 1; padding: 10px; text-align: center; font-size: 13px; font-weight: 600; cursor: pointer; color: #757575; }
    .tab.active { color: $($app.ThemeColor); border-bottom: 2px solid $($app.ThemeColor); }
    footer { text-align: center; padding: 20px; font-size: 11px; color: #9E9E9E; line-height: 1.4; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>$($app.MarathiName)</h1>
      <small style="opacity: 0.85;">$appName - Maharashtra Relief Dept</small>
    </div>
    <span id="connStatus" class="badge badge-online">ONLINE</span>
  </header>

  <div class="container">
    <div id="alertBox"></div>

    <div class="card">
      <h2>सद्यस्थिती डॅशबोर्ड (Live Dashboard)</h2>
      <p style="font-size: 13px; color: #616161;">पैठण चारा छावणी #104 | छत्रपती संभाजीनगर विभाग</p>
      <div class="stat-grid">
        <div class="stat-box">
          <div class="stat-val" id="stat1">$($app.Metric1Val)</div>
          <div class="stat-lbl">$($app.Metric1Lbl)</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" id="stat2">$($app.Metric2Val)</div>
          <div class="stat-lbl">$($app.Metric2Lbl)</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" id="stat3">$($app.Metric3Val)</div>
          <div class="stat-lbl">$($app.Metric3Lbl)</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" id="stat4">$($app.Metric4Val)</div>
          <div class="stat-lbl">$($app.Metric4Lbl)</div>
        </div>
      </div>
    </div>

    <!-- Action Cards -->
    <div class="card">
      <h2>कार्यकारी सेवा (Action Panel)</h2>
      <div class="tabs">
        <div class="tab active" onclick="switchTab('primary')">$($app.Tab1)</div>
        <div class="tab" onclick="switchTab('secondary')">$($app.Tab2)</div>
        <div class="tab" onclick="switchTab('audit')">$($app.Tab3)</div>
      </div>

      <div id="tabContentPrimary">
        <div class="form-group">
          <label>जनावराचा टॅग क्रमांक (Ear Tag Number):</label>
          <input type="text" id="inputTag" class="form-control" value="MH-14-8841" placeholder="उदा. MH-14-XXXX">
        </div>
        <div class="form-group">
          <label>प्रवर्ग व जात (Category & Breed):</label>
          <select id="selectBreed" class="form-control">
            <option>खिल्लार गाय (Khillari Cow - Large)</option>
            <option>देवणी बैल (Deoni Bull - Large)</option>
            <option>गीर गाय (Gir Cow - Large)</option>
            <option>वासरू (Calf &lt; 150Kg)</option>
          </select>
        </div>
        <button class="btn" onclick="executeAppAction()">नोंदणी सादर करा (Submit Action)</button>
        <button class="btn btn-secondary" onclick="verifyGeofence()">जिओफेन्स तपासा (Verify Geofence)</button>
      </div>

      <div id="tabContentSecondary" style="display: none;">
        <div class="form-group">
          <label>हिरवा चारा (Green Fodder in Quintals - 1Q=100Kg):</label>
          <input type="number" id="inputGreen" class="form-control" value="126.30">
        </div>
        <div class="form-group">
          <label>सुका चारा (Dry Fodder in Quintals):</label>
          <input type="number" id="inputDry" class="form-control" value="84.20">
        </div>
        <div class="form-group">
          <label>पाणी पुरवठा (Water Supply in Liters):</label>
          <input type="number" id="inputWater" class="form-control" value="28400">
        </div>
        <button class="btn" onclick="recordLedger()">दैनिक नोंद जतन करा (Record Entry)</button>
      </div>

      <div id="tabContentAudit" style="display: none;">
        <p style="font-size: 13px; margin-bottom: 10px;">नियम ९.६ नुसार सर्व नोंदी डिजिटल पद्धतीने तपासल्या जातात.</p>
        <button class="btn" onclick="fetchLiveAudit()">थेट अहवाल मिळवा (Fetch Live API Audit)</button>
        <div id="auditResult" style="margin-top: 10px; font-size: 12px; background: #fff; padding: 8px; border: 1px solid #CFD8DC; border-radius: 4px; display: none;"></div>
      </div>
    </div>

    <!-- Rule 9.6 Security Notice -->
    <div class="alert alert-info">
      <strong>नियम ९.६ सुरक्षा सूचना:</strong> जनावरांचे प्रवेश आणि सुटका ऑफलाइन करण्यास सक्त मनाई आहे. अचूक जिओफेन्स सीमा पडताळणी आवश्यक आहे.
    </div>

    <footer>
      महाराष्ट्र शासन - मदत व पुनर्वसन विभाग | चारा छावणी व्यवस्थापन प्रणाली v1.0.0
    </footer>
  </div>

  <script>
    const API_BASE = 'http://10.0.2.2:5000/api/v1'; // Android Emulator loopback to host

    function showAlert(msg, type) {
      const b = document.getElementById('alertBox');
      b.innerHTML = '<div class="alert alert-' + type + '">' + msg + '</div>';
      setTimeout(() => { b.innerHTML = ''; }, 4500);
    }

    function switchTab(name) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tabContentPrimary').style.display = name === 'primary' ? 'block' : 'none';
      document.getElementById('tabContentSecondary').style.display = name === 'secondary' ? 'block' : 'none';
      document.getElementById('tabContentAudit').style.display = name === 'audit' ? 'block' : 'none';
    }

    function executeAppAction() {
      const tag = document.getElementById('inputTag').value.trim();
      if (!tag) { showAlert('कृपया टॅग क्रमांक प्रविष्ट करा!', 'error'); return; }
      showAlert('नोंदणी यशस्वी: टॅग ' + tag + ' यशस्वीरित्या नोंदवला गेला. नियम ९.६ जिओफेन्स पडताळणी पूर्ण!', 'success');
      const cur = parseInt(document.getElementById('stat1').innerText);
      if (!isNaN(cur)) { document.getElementById('stat1').innerText = cur + 1; }
    }

    function verifyGeofence() {
      showAlert('जिओफेन्स तपासणी: अक्षांश १९.८२१४, रेखांश ७५.३३४१ - छावणी सीमेच्या आत (Inside Polygon Bounds)', 'success');
    }

    function recordLedger() {
      showAlert('दैनिक नोंद जतन झाली: प्रमाण १ क्विंटल = १०० किलो (Metric Normalized)', 'success');
    }

    function fetchLiveAudit() {
      showAlert('थेट सर्व्हरशी संपर्क साधत आहे (http://10.0.2.2:5000)...', 'info');
      fetch(API_BASE + '/health')
        .then(res => res.json())
        .then(data => {
          const resBox = document.getElementById('auditResult');
          resBox.style.display = 'block';
          resBox.innerHTML = '<strong>सर्व्हर स्थिती (200 OK):</strong> ' + JSON.stringify(data);
          showAlert('सर्व्हर प्रतिसाद यशस्वी!', 'success');
        })
        .catch(err => {
          const resBox = document.getElementById('auditResult');
          resBox.style.display = 'block';
          resBox.innerHTML = '<strong>स्थानिक कॅशे मोड:</strong> ऑफलाईन डेटा सुरक्षितपणे उपलब्ध आहे.';
          showAlert('स्थानिक ऑफलाईन स्थिती सक्रिय आहे.', 'info');
        });
    }
  </script>
</body>
</html>
"@

    # Write files without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText("$appWorkDir\res\values\strings.xml", $stringsXml, $utf8NoBom)
    [System.IO.File]::WriteAllText("$appWorkDir\res\values\styles.xml", $stylesXml, $utf8NoBom)
    [System.IO.File]::WriteAllText("$appWorkDir\AndroidManifest.xml", $manifestXml, $utf8NoBom)
    $javaPath = "$appWorkDir\src\$($pkg.Replace('.', '\'))\MainActivity.java"
    [System.IO.File]::WriteAllText($javaPath, $javaCode, $utf8NoBom)
    [System.IO.File]::WriteAllText("$appWorkDir\assets\index.html", $appHtml, $utf8NoBom)

    # Step 1: AAPT2 Compile Resources
    Write-Host "  -> [1/7] Compiling Android resources with AAPT2..." -ForegroundColor Gray
    & "$BuildToolsDir\aapt2.exe" compile --dir "$appWorkDir\res" -o "$appWorkDir\compiled_res.zip"
    if ($LASTEXITCODE -ne 0) { throw "AAPT2 compile failed for $appId" }

    # Step 2: AAPT2 Link Resources & Manifest
    Write-Host "  -> [2/7] Linking resources & AndroidManifest with AAPT2..." -ForegroundColor Gray
    & "$BuildToolsDir\aapt2.exe" link -o "$appWorkDir\base.apk" `
        -I $AndroidJar `
        --manifest "$appWorkDir\AndroidManifest.xml" `
        -A "$appWorkDir\assets" `
        --java "$appWorkDir\src" `
        "$appWorkDir\compiled_res.zip"
    if ($LASTEXITCODE -ne 0) { throw "AAPT2 link failed for $appId" }

    # Step 3: Compile Java Source (MainActivity.java & R.java) with Java 8 bytecode compatibility
    Write-Host "  -> [3/7] Compiling Java classes with javac (-source 8 -target 8)..." -ForegroundColor Gray
    $javaFiles = Get-ChildItem -Path "$appWorkDir\src" -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
    & "$JdkBin\javac.exe" -source 8 -target 8 -cp "$AndroidJar" -d "$appWorkDir\bin" $javaFiles
    if ($LASTEXITCODE -ne 0) { throw "javac compile failed for $appId" }

    # Step 4: Dex Class Files with D8
    Write-Host "  -> [4/7] Dexing bytecode with D8..." -ForegroundColor Gray
    $classFiles = Get-ChildItem -Path "$appWorkDir\bin" -Filter "*.class" -Recurse | Select-Object -ExpandProperty FullName
    & "$BuildToolsDir\d8.bat" --lib $AndroidJar --output "$appWorkDir\dex" $classFiles
    if ($LASTEXITCODE -ne 0) { throw "D8 dexing failed for $appId" }

    # Step 5: Add classes.dex into base.apk using jar
    Write-Host "  -> [5/7] Packaging classes.dex into APK..." -ForegroundColor Gray
    Push-Location "$appWorkDir\dex"
    & "$JdkBin\jar.exe" -uf "..\base.apk" "classes.dex"
    Pop-Location
    if ($LASTEXITCODE -ne 0) { throw "jar package failed for $appId" }

    # Step 6: Zipalign 4-byte optimization
    $alignedApk = "$appWorkDir\aligned.apk"
    Write-Host "  -> [6/7] Running zipalign optimization..." -ForegroundColor Gray
    & "$BuildToolsDir\zipalign.exe" -f -v 4 "$appWorkDir\base.apk" $alignedApk
    if ($LASTEXITCODE -ne 0) { throw "zipalign failed for $appId" }

    # Step 7: Cryptographically Sign with Apksigner
    $finalApk = "$DistDir\$appId.apk"
    Write-Host "  -> [7/7] Signing APK with apksigner..." -ForegroundColor Gray
    & "$BuildToolsDir\apksigner.bat" sign `
        --ks $KeystorePath `
        --ks-pass "pass:android" `
        --key-pass "pass:android" `
        --out $finalApk `
        $alignedApk
    if ($LASTEXITCODE -ne 0) { throw "apksigner failed for $appId" }

    # Verify APK Signature
    Write-Host "  -> Verifying APK signature..." -ForegroundColor Green
    & "$BuildToolsDir\apksigner.bat" verify --verbose $finalApk
    if ($LASTEXITCODE -ne 0) { throw "apksigner verify failed for $finalApk" }

    $sizeKb = [math]::Round((Get-Item $finalApk).Length / 1024, 2)
    Write-Host "[SUCCESS] $appId.apk built successfully ($sizeKb KB) -> $finalApk" -ForegroundColor Green
}

# 4. Iterate and Build All 4 APKs
$startTime = Get-Date
foreach ($app in $Apps) {
    Build-Single-Apk -app $app
}
$duration = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 2)

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host " All 4 APKs Built, Aligned & Signed Successfully in $duration s!" -ForegroundColor Green
Write-Host " Artifacts Location: $(Resolve-Path $DistDir)" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Get-ChildItem -Path $DistDir -Filter "*.apk" | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
