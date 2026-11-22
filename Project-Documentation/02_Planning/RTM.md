# Requirement Traceability Matrix (RTM)

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Lifecycle Stage:** Cross-Cutting / Planning through Release  

---

## 1. Overview & Objective

The Requirement Traceability Matrix (RTM) establishes bidirectional traceability across all phases of the project lifecycle. It guarantees that every business requirement (BRD) flows down into technical specifications (SRS/FRD), is realized in architectural design components (HLD/LLD), is implemented in specific code files, and is validated by corresponding automated tests and smoke test scenarios.

---

## 2. Bidirectional Traceability Matrix

| Req ID | Business Requirement (BRD) | Functional Spec (FRD / SRS) | Architecture / Component | Implementation Code Files | Verification Test ID | Status |
|---|---|---|---|---|---|---|
| **REQ-AUTH-01** | Multi-role secure login (Admin, Officer, Operator, Vet, Farmer) | FRD-SEC-01 / SRS §3.1 | Identity & JWT Auth Engine | `AuthController.cs`, `AuthService.cs`, `TokenProvider.cs` | `AUTH_TC_01`, `AUTH_TC_02`, Smoke Test #1-4 | **VERIFIED** |
| **REQ-CAMP-01** | Camp application, boundary definition & verification | FRD-CMP-01 / SRS §3.2 | Camp Management & Spatial Module | `CampController.cs`, `CampRegistrationHandler.cs`, `Camp.cs` | `CAMP_TC_01`, `CAMP_TC_02`, Smoke Test #5 | **VERIFIED** |
| **REQ-GEO-02** | Geofence polygon validation with SRID 4326 | FRD-GEO-01 / SRS §3.3 | GIS NetTopologySuite Service | `GeofenceService.cs`, `PolygonValidator.cs` | `GEO_TC_01`, `GEO_TC_02`, Smoke Test #6 | **VERIFIED** |
| **REQ-ANIM-01** | Cattle admission with Tag verification & photo | FRD-ANM-01 / SRS §3.4 | Animal Ledger Service | `AnimalController.cs`, `AdmitAnimalCommandHandler.cs`, `Animal.cs` | `ANM_TC_01`, `ANM_TC_02`, Smoke Test #7 | **VERIFIED** |
| **REQ-ANIM-02** | Rule 9.6 Anti-Fraud: No offline animal admission or release | FRD-ANM-02 / SRS §3.4.2 | Application Guardrail & Client Logic | `AdmitAnimalCommandHandler.cs`, `session-offline-test.mjs` | `RULE96_TC_01`, Offline Test Suite | **VERIFIED** |
| **REQ-FEED-01** | Daily fodder distribution & metric normalization ($1\text{ Q} = 100\text{ Kg}$) | FRD-FOD-01 / SRS §3.5 | Inventory & Feeding Engine | `FeedingController.cs`, `RecordFeedingCommandHandler.cs`, `FeedingLedger.cs` | `FEED_TC_01`, Smoke Test #8 | **VERIFIED** |
| **REQ-FEED-02** | Offline-capable daily feeding sync with idempotency keys | FRD-FOD-02 / SRS §3.5.3 | Client SQLite Queue & Batch Sync | `SyncController.cs`, `SyncBatchCommandHandler.cs`, `OfflineQueue.ts` | `SYNC_TC_01`, `SYNC_TC_02` | **VERIFIED** |
| **REQ-VET-01** | Veterinary medical records, vaccination & mortality triage | FRD-VET-01 / SRS §3.6 | Vet Care & Disease Surveillance | `VeterinaryController.cs`, `RecordMedicalTreatmentHandler.cs` | `VET_TC_01`, Smoke Test #9 | **VERIFIED** |
| **REQ-INSP-01** | Surprise field inspection & tally discrepancy logging | FRD-INS-01 / SRS §3.7 | Field Audit Module | `OfficerController.cs`, `RecordInspectionCommandHandler.cs` | `INSP_TC_01`, Smoke Test #10 | **VERIFIED** |
| **REQ-MAST-01** | Unified Master Data endpoints for breeds, talukas, feed types | FRD-MST-01 / SRS §3.8 | Master Data Provider | `MasterDataController.cs`, `GetMasterDataQueryHandler.cs` | `MAST_TC_01`, Smoke Test #11 | **VERIFIED** |
| **REQ-EXP-01** | Statutory Devanagari CSV exports with UTF-8 BOM (`\uFEFF`) | FRD-RPT-01 / SRS §3.9 | Export & Reporting Engine | `ExportController.cs`, `CsvExportService.cs` | `EXP_TC_01-04`, Smoke Test #12-15 | **VERIFIED** |
| **REQ-ENV-01** | Clean configuration loading avoiding OS variable collision | NFR-ENV-01 / SRS §4.3 | Core Infrastructure Loader | `EnvLoader.cs`, `Program.cs` | Integration Test Suite | **VERIFIED** |
| **REQ-UI-01** | Devanagari font rendering with $\text{lineHeight} \ge 1.35 \times \text{fontSize}$ | NFR-UX-01 / SRS §4.4 | `@chara-chhavani/ui-core` Tokens | `typography.ts`, `theme.ts`, `MarathiText.tsx` | UI Visual Regression Test Suite | **VERIFIED** |
| **REQ-RES-01** | Standardized JSON Response envelope `{ success, message, data, errors, traceId }` | NFR-INT-01 / SRS §4.5 | API Framework Wrapper | `ApiControllerBase.cs`, `ApiResponse.cs`, `ExceptionHandlingMiddleware.cs` | All 67 dotnet integration tests | **VERIFIED** |

---

## 3. Coverage Analysis

* **Total Business Requirements (BRD):** 14
* **Total Functional Requirements (FRD):** 14
* **Requirements Mapped to Code:** 14 (100%)
* **Requirements Mapped to Automated Tests:** 14 (100%)
* **Current Test Execution Pass Rate:** 100% (67 dotnet unit/integration tests + 19 E2E smoke tests + Node.js offline suite).
