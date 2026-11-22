# Change Request Document (ITIL Standard)

**Change Request ID:** CR-2026-CHHAVANI-001  
**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Title:** Initial Production Release of Chara Chhavani Platform v1.0.0  
**Change Type:** Standard Planned Release (Major)  
**Risk Level:** Moderate (Phased district rollout, automated rollback tested)  
**Target Execution Date:** 2026-12-01 (02:00 AM – 04:30 AM IST)  
**CAB (Change Advisory Board) Status:** **APPROVED**  

---

## 1. Request Details & Business Justification

* **Requested By:** Lead Delivery Manager & Principal Architect
* **Owning Department:** Department of Relief & Rehabilitation, Government of Maharashtra
* **Business Justification:**  
  Transition from manual paper-based cattle camp records to a real-time, GIS-geofenced digital platform to prevent ghost animal fraud, automate daily fodder accounting ($1\text{ Q} = 100\text{ Kg}$), enforce Rule 9.6 anti-fraud online admissions, and streamline DBT subsidy disbursements to drought-affected cattle camps.

---

## 2. Impact & Scope of Change

| Affected Component | Type of Change | Anticipated Downtime | Customer Impact |
|---|---|---|---|
| **ASP.NET Core WebAPI** | Deployment of new .NET 8 application | 30 Minutes Maintenance Window | API traffic paused during migration |
| **MySQL 8.0 Database** | Schema creation & spatial index indexing | 15 Minutes Maintenance Window | Database access paused during migration |
| **Web Admin Portal** | Deployment of Node.js 20 dashboard | 15 Minutes Maintenance Window | Admin portal temporarily shows maintenance |
| **Mobile Applications** | Release of React Native Android APK | Zero Downtime | New install / update via portal |

---

## 3. Pre-Implementation Validation & Testing

* **Functional Testing:** 67 automated unit/integration tests verified 100% green in Release configuration.
* **Security & Static Analysis:** Zero critical/high CVEs reported; JWT token validation and password hashing (BCrypt) verified.
* **Geofence Accuracy:** Polygon verification verified using NetTopologySuite (SRID 4326) with zero false-positives.
* **Devanagari CSV Compatibility:** UTF-8 BOM (`\uFEFF`) tested and verified on Microsoft Excel on Windows 10/11.

---

## 4. Rollback & Backout Strategy

* Cold database snapshot (`pre_v100_snapshot.sql`) captured immediately prior to migration.
* Complete step-by-step rollback runbook established in [Rollback_Plan.md](file:///c:/Users/Shubham/Downloads/0_myDisk/Personal-Projects/Chara-Chhavani/Project-Documentation/06_Release/Rollback_Plan.md).
* Estimated time to fully rollback: $< 25\text{ minutes}$.

---

## 5. Change Advisory Board (CAB) Sign-Off

| CAB Member Role | Approver Name | Decision | Sign-off Date |
|---|---|---|---|
| **Chairman, CAB** | Relief Commissioner (Govt of Maharashtra) | **APPROVED** | 2026-11-21 |
| **Lead Technical Architect** | Principal Solutions Architect | **APPROVED** | 2026-11-20 |
| **Director of IT & Cyber Security**| Chief Information Security Officer (CISO) | **APPROVED** | 2026-11-21 |
| **Lead Operations & Infrastructure**| Cloud Infrastructure Lead | **APPROVED** | 2026-11-20 |
