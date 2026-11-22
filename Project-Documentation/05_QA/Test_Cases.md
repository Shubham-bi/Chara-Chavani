# Granular Test Cases Document

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-CAS-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Test Case Table (P0 / P1 / P2)

| TC ID | Module | Scenario / Description | Preconditions | Test Steps | Test Data | Expected Result | Priority | Automated |
|---|---|---|---|---|---|---|:---:|:---:|
| **TC-AUTH-01** | Auth | Farmer OTP Request | Valid mobile network | 1. Call `/api/v1/auth/mobile/send-otp`<br>2. Submit mobile number | `mobile: "9822012345"`, `role: "Farmer"` | HTTP 200, OTP dispatched successfully | P0 | Yes (Playwright) |
| **TC-AUTH-02** | Auth | Farmer OTP Verification | OTP dispatched | 1. Call `/api/v1/auth/mobile/verify-otp`<br>2. Submit mobile and OTP | `otp: "123456"` | HTTP 200, JWT token returned, role = Farmer | P0 | Yes (Playwright) |
| **TC-AUTH-03** | Auth | Admin Authentication | Backend running | 1. Call `/api/v1/auth/admin/login`<br>2. Submit admin credentials | `username: "admin"`, `password: "AdminPassword@123"` | HTTP 200, Admin token generated, role = Admin | P0 | Yes (Playwright) |
| **TC-GEO-01** | Spatial | Geofence Point Inside Camp | Active Paithan camp | 1. Send point inside camp polygon | `lat: 19.82`, `lon: 75.33` | HTTP 200, `isInside: true`, inside message | P0 | Yes (Playwright) |
| **TC-GEO-02** | Spatial | Geofence Point Outside Camp | Active Paithan camp | 1. Send point outside camp boundary | `lat: 18.00`, `lon: 74.00` | HTTP 200, `isInside: false`, outside error message | P0 | Yes (Playwright) |
| **TC-ADM-01** | Admission | Valid Cattle Admission | Cattle approved by Vet | 1. Submit admission request with GPS inside camp | `cattleId: 101`, `campId: 3`, `lat: 19.82`, `lon: 75.33` | HTTP 200, cattle admitted, camp occupancy incremented | P0 | Yes (API & Unit) |
| **TC-ADM-02** | Admission | Admission Outside Boundary Blocked | Cattle approved by Vet | 1. Submit admission with GPS outside camp | `cattleId: 102`, `campId: 3`, `lat: 18.52`, `lon: 73.85` | HTTP 400, admission rejected with geofence error | P0 | Yes (Playwright) |
| **TC-ADM-03** | Admission | Unverified Cattle Admission Blocked | Cattle status = Pending | 1. Submit admission request for pending cattle | `cattleId: 103`, `campId: 3` | HTTP 400, admission rejected: animal not verified | P0 | Yes (Unit Test) |
| **TC-CAP-01** | Capacity | Camp Capacity Saturation Limit | Camp at 500/500 | 1. Submit admission request for 501st animal | `campId: 3`, capacity = 500 | HTTP 400, rejected: camp capacity full | P0 | Yes (Unit Test) |
| **TC-FOD-01** | Fodder | Dual-Source Stock Invariant | Baseline stock loaded | 1. Calculate `storeStock + inFarmStock`<br>2. Compare to total balance | `store: 45000 kg`, `inFarm: 12000 kg` | Sum equals 57000 kg exactly | P1 | Yes (Playwright) |
| **TC-FOD-02** | Fodder | Daily Feeding Distribution | In-farm stock > 100 kg | 1. Issue 50 kg fodder to cattle<br>2. Check in-farm balance | `issuedKg: 50` | In-farm stock decreases by 50 kg | P1 | Yes (API & Unit) |
| **TC-DSH-01** | Web Admin | Dashboard Header & Title | Web admin loaded | 1. Open `http://localhost:3000`<br>2. Inspect page title & header | URL: `/` | Title contains Maharashtra Gov, authority badge visible | P1 | Yes (Playwright) |
| **TC-DSH-02** | Web Admin | Primary KPI Metric Cards | Web admin loaded | 1. Check `#metrics-grid`<br>2. Inspect cards | 4 primary cards | Farmers, Cattle, Camps, Utilization rendered | P0 | Yes (Playwright) |
| **TC-DSH-03** | Web Admin | Power BI 8 Analytical Tabs | Web admin loaded | 1. Click each of the 8 tabs<br>2. Assert section display | 8 tabs | Active tab highlighted, section becomes visible | P0 | Yes (Playwright) |
| **TC-DSH-04** | Web Admin | Camp Dossier Side Panel Drawer | Camps table loaded | 1. Click camp row in monitoring table | Camp row 1 | `#camp-dossier-panel` opens with camp details | P0 | Yes (Playwright) |
| **TC-DSH-05** | Web Admin | RFC 4180 CSV Export Links | Reports tab active | 1. Check `#csv-export-actions`<br>2. Inspect links | 4 CSV links | Links contain UTF-8 BOM query `reportType=*` | P1 | Yes (Playwright) |
| **TC-MOB-01** | Mobile | Responsive Mobile Viewport | Mobile viewport | 1. Set viewport `375x667`<br>2. Navigate to dashboard | Viewport: 375x667 | Header, KPIs, tables render without clipping | P1 | Yes (Playwright) |
| **TC-LDP-01** | LDPlayer | Emulator APK Artifact Readiness | Android build complete | 1. Inspect `dist-apk/` directory | 4 APK files | `mobile-farmer.apk`, `mobile-vet.apk`, etc. Exist | P1 | Yes (Playwright) |
