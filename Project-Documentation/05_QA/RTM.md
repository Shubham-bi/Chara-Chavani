# Requirement Traceability Matrix (RTM)

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-RTM-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Bidirectional Traceability Matrix

| BRD / FRD Req ID | Requirement Description | Affected Architecture Layer | Test Scenario ID | Test Case ID | Automated Test File | Test Status |
|---|---|---|---|---|---|:---:|
| **BRD-REQ-01** | Farmer Mobile OTP Authentication | Backend WebAPI, Mobile Farmer | SCN-FAR-01 | TC-AUTH-01, TC-AUTH-02 | `sanity.spec.ts`, `smoke_test.ps1` | **PASS** |
| **BRD-REQ-02** | Farmer Profile & Landholding KYC | Mobile Farmer, MySQL Database | SCN-FAR-02 | TC-AUTH-02 | `e2e-full-workflow.spec.ts` | **PASS** |
| **BRD-REQ-03** | Cattle Registration with Geolocation & Photo | Mobile Farmer, WebAPI | SCN-FAR-03 | TC-ADM-01 | `e2e-full-workflow.spec.ts` | **PASS** |
| **BRD-REQ-04** | Veterinary Doctor On-Farm Inspection Queue | Mobile Vet, WebAPI | SCN-VET-01 | TC-ADM-01 | `CharaChhavani.UnitTests` | **PASS** |
| **BRD-REQ-05** | Veterinary GPS Stamping (Farmer Location) | Mobile Vet, WebAPI | SCN-VET-03 | TC-ADM-01 | `CharaChhavani.UnitTests` | **PASS** |
| **BRD-REQ-06** | Veterinary Approval / Rejection Workflow | Mobile Vet, WebAPI, MySQL | SCN-VET-04, 05 | TC-ADM-01, TC-ADM-03 | `e2e-full-workflow.spec.ts` | **PASS** |
| **BRD-REQ-07** | Camp Geofence Polygon Registration (SRID 4326) | Web Admin, WebAPI, NetTopologySuite | SCN-INV-04 | TC-GEO-01 | `CharaChhavani.UnitTests` | **PASS** |
| **BRD-REQ-08** | Real-Time Cattle Admission inside Geofence | Mobile Operator, NetTopologySuite | SCN-OPR-03 | TC-GEO-01, TC-ADM-01 | `sanity.spec.ts`, `regression.spec.ts` | **PASS** |
| **BRD-REQ-09** | Rejection of Admission Outside Geofence | Mobile Operator, WebAPI | SCN-OPR-02 | TC-GEO-02, TC-ADM-02 | `regression.spec.ts`, `smoke_test.ps1` | **PASS** |
| **BRD-REQ-10** | Camp Maximum Capacity Saturation Enforcement | WebAPI Domain Invariant | SCN-INV-01 | TC-CAP-01 | `regression.spec.ts` | **PASS** |
| **BRD-REQ-11** | Anti-Fraud Rule 9.6 (No Offline Admissions) | Mobile Offline Queue, WebAPI | SCN-INV-02 | TC-ADM-03 | `regression.spec.ts` | **PASS** |
| **BRD-REQ-12** | Dual-Source Fodder Stock Balance (Store + In Farm) | Mobile Operator, MySQL Ledger | SCN-OPR-04, 05 | TC-FOD-01 | `e2e-full-workflow.spec.ts` | **PASS** |
| **BRD-REQ-13** | Daily Cattle Feed Consumption Tracking | Mobile Operator, WebAPI | SCN-OPR-06 | TC-FOD-02 | `CharaChhavani.UnitTests` | **PASS** |
| **BRD-REQ-14** | State Executive Web Admin Power BI Dashboard | Web Admin (`apps/web-admin`) | SCN-ADM-01, 02 | TC-DSH-01, TC-DSH-02 | `smoke.spec.ts`, `web-admin-dashboard.spec.ts` | **PASS** |
| **BRD-REQ-15** | Interactive Maharashtra GIS Vector Map | Web Admin, SVG Viewport | SCN-ADM-03, 04 | TC-DSH-03 | `sanity.spec.ts`, `web-admin-dashboard.spec.ts` | **PASS** |
| **BRD-REQ-16** | Selected Camp Operational Dossier Drawer | Web Admin, WebAPI | SCN-ADM-05 | TC-DSH-04 | `e2e-full-workflow.spec.ts` | **PASS** |
| **BRD-REQ-17** | RFC 4180 CSV Statutory Exports (UTF-8 BOM) | Web Admin, WebAPI | SCN-ADM-07 | TC-DSH-05 | `sanity.spec.ts`, `smoke_test.ps1` | **PASS** |
| **BRD-REQ-18** | Multi-Device Mobile Responsive Emulation | React Native, Web Viewports | SCN-FAR-01 | TC-MOB-01 | `regression.spec.ts`, Playwright Mobile Chrome | **PASS** |
| **BRD-REQ-19** | Android Emulator LDPlayer 14 APK Integration | Android Emulator, ADB | SCN-OPR-01 | TC-LDP-01 | `ldplayer-integration.spec.ts` | **PASS** |

---

## 2. Traceability Metrics Summary
- Total Requirements: **19**
- Requirements with Automated Test Coverage: **19 (100%)**
- Total Test Cases Mapped: **18 unique test case IDs**
- Current Traceability Compliance: **100% Green**
