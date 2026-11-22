# Official Release Notes (v1.0.0)

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Release Tag:** `v1.0.0`  
**Git Commit Hash:** `c719aec`  
**Release Date:** 2026-11-22  
**Target Platform:** ASP.NET Core 8 (.NET 8), Node.js 20, React Native (@chara-chhavani/ui-core)  

---

## 1. Release Highlights & Overview

Version 1.0.0 marks the initial General Availability (GA) enterprise release of the **Chara Chhavani Platform**. Engineered to eradicate ghost cattle registrations, streamline fodder accounting, and automate statutory government audits, this release brings together real-time GIS geofencing, high-resilience offline queues, and statutory Marathi CSV reporting.

---

## 2. Key Features & Capabilities

### 2.1 Geospatial Boundary & Anti-Fraud Enclosure
* **SRID 4326 Geofencing:** Server-side geofence calculation with NetTopologySuite (`ST_Contains`) verifying cattle admissions within sanctioned polygon boundaries.
* **Rule 9.6 Hard Invariant:** Mandatory online validation for all animal admissions and releases. The mobile client actively disables offline admission workflows, preventing ghost-animal fraud.

### 2.2 Fodder & Water Distribution Ledger
* **Standardized Metric Normalization:** Enforces standard $1\text{ Quintal} = 100\text{ Kg}$ metric across all fodder ledgers.
* **Resilient Edge Sync:** Offline queuing for daily feeding distributions and water supply logs with UUIDv4 idempotency keys preventing duplicate submissions.

### 2.3 Veterinary & Mortality Surveillance
* Comprehensive veterinary doctor examination module with diagnosis tagging, medication prescription, and quarantine triage.
* Cattle mortality logging requiring mandatory geotagged photographic evidence and automated ear-tag de-activation.

### 2.4 District Officer Surprise Inspections
* Surprise physical headcount tool comparing on-ground muster against system registration.
* Automated calculation of shortfall percentages and subsidy penalty deductions.

### 2.5 Statutory Devanagari Reporting
* Streaming CSV export endpoints (`/api/v1/export/*`) prepending UTF-8 BOM (`\uFEFF`) to ensure seamless Marathi Devanagari rendering in Microsoft Excel without character corruption.

---

## 3. API Endpoints & Contract Enhancements

* Dual routing enabled for Master Data: `/api/v1/master` and `/api/v1/masterdata`.
* Unified JSON response envelope applied across all controllers: `{ success, message, data, errors, traceId }`.
* Global error handling interceptor catching `FluentValidation.ValidationException` and converting to RFC 7807 compliant HTTP 400 Bad Request responses.

---

## 4. Test Verification & Quality Audit Summary

* **Unit & Integration Test Suite:** 67 tests executed in Release configuration (`dotnet test -c Release`) $\rightarrow$ **67 Passed, 0 Failed**.
* **Mobile Offline & Storage Tests:** Node.js mobile suite (`packages/ui-core/test/session-offline-test.mjs`) $\rightarrow$ **100% Passed**.
* **E2E Smoke Verification:** 19 functional checks executed against local server $\rightarrow$ **19 Passed, 0 Failed**.

---

## 5. Known Limitations & Workarounds

* **Offline Tag Lookups:** Tag history lookups require an active cellular connection; offline mode only caches the most recent 200 herd records locally.
* **Camera Resolution:** Images captured on devices with $>48\text{ MP}$ cameras are compressed to a maximum of $1920 \times 1080$ at $80\%$ quality before upload to minimize bandwidth usage in 2G/3G zones.
