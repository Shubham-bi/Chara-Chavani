# Understanding Document: Comprehensive QA System Testing & Automation Framework

**Project Name:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-SYS-UND-001  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 2 (Understanding Document)  
**Author:** Lead QA Automation Architect & SDET  

---

## 1. Business Context & Testing Scope

Chara Chhavani is a multi-tier disaster relief management platform deployed for the Maharashtra State Relief Commissionerate (Disaster Management, Relief & Rehabilitation Department). Its purpose is to monitor, verify, and disburse relief for drought-affected cattle camps across 10 drought-prone districts.

The entire system encompasses five interconnected application components:
1. **Farmer Mobile App (`apps/mobile-farmer`)**: OTP-based mobile authentication, farmer profile registration, cattle registration with geolocation, photo capture, and verification tracking.
2. **Veterinary Doctor Mobile App (`apps/mobile-vet`)**: Physical on-farm inspection queue, health verification, cattle photo timestamping, GPS tagging, and approve/reject workflows.
3. **Camp Operator Mobile App (`apps/mobile-chhavani`)**: Real-time admission with geofence validation, livestock release, dual-source fodder stock management (Store vs In Farm), daily feeding logs, and expense submissions.
4. **Government Officer Mobile App (`apps/mobile-officer`)**: Surprise inspections, geotagged spot-checks, headcounts, escalation of irregularities, and statutory audits.
5. **State Relief Web Admin Dashboard (`apps/web-admin`)**: Power BI-style executive portal featuring interactive Maharashtra GIS vector map, camp geofence visualizer, Camp Operational Dossier, 8 analytical domains, and RFC 4180 CSV statutory compliance reporting.
6. **Backend Core WebAPI (`backend/src/CharaChhavani.WebApi`)**: .NET 8 Clean Architecture with CQRS/MediatR, NetTopologySuite spatial geometry engine, JWT authentication, and FluentValidation.
7. **Database Layer (`MySQL 8.0`)**: Relational tables with spatial indexes (`SPATIAL INDEX`) on camp boundary polygons and admission points, ensuring strict transactional integrity.

---

## 2. QA Roles & Quality Gates (Per `QA roles.md`)

Per [ReferanceData/QA/QA roles.md](file:///c:/Users/Shubham/Downloads/0_myDisk/Personal-Projects/Chara-Chhavani/ReferanceData/QA/QA%20roles.md), Quality Assurance governs 10 core responsibility domains across 5 strict quality gates:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        5 Strict Quality Gates                          │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ Gate 1: Code       │ Gate 2: API & DB   │ Gate 3: UI & POM Automation  │
│ Zero Lint Errors   │ Unit & Spatial Tests│ Playwright Desktop & Mobile  │
│ Zero Type Errors   │ 100% Passing       │ Headless & LDPlayer Validated│
├────────────────────┴────────────────────┴──────────────────────────────┤
│ Gate 4: Security & Anti-Fraud           │ Gate 5: Production Readiness │
│ Rule 9.6 Offline Admission Block        │ 19/19 Smoke Tests Green      │
│ Role-Based Access Isolation             │ Audit CSVs UTF-8 BOM Valid   │
└─────────────────────────────────────────┴──────────────────────────────┘
```

### The 10 QA Domains:
1. **Requirement Analysis & Review**: Clarify edge cases before coding (e.g. Can a released animal be re-admitted? What occurs when camp capacity is 100%?).
2. **Test Planning & Test Case Design**: Complete traceability between BRD/FRD and atomic test cases.
3. **Mobile Application Testing**: Field permissions (Camera, GPS), mobile responsive viewport, and Android emulator (LDPlayer 14).
4. **Web Admin Dashboard Testing**: Visual validation, drill-down maps, dossier panel, and data reconciliation against backend figures.
5. **Backend API Testing**: HTTP status codes, request/response contracts, boundary payloads, and duplicate transaction handling.
6. **Database Testing**: Spatial indexing (`ST_Contains`), stock reconciliation (Store + In Farm), transaction rollbacks, and foreign key constraints.
7. **Critical Project-Specific Scenarios**: Geofence containment invariants, concurrent camp capacity saturation, dual-source stock tracking.
8. **Test Automation Framework**: Playwright with Page Object Model (POM) and LDPlayer MCP Android bridge.
9. **Bug Tracking & Reporting**: Formal Defect Lifecycle, 5-Whys RCA, and CAPA logs.
10. **Documentation & Sign-off**: Complete suite of 14 QA deliverables matching SDLC specifications.

---

## 3. Playwright Page Object Model (POM) Architecture

To ensure high maintainability, zero test flakiness, and cross-platform reusability across desktop, mobile viewports, and emulators, the test suite is structured following the Page Object Model (POM):

```
tests/e2e-web/
├── pages/
│   ├── BasePage.ts                 # Common interactions, waits, viewport handling
│   ├── AdminDashboardPage.ts       # Web Admin: tabs, filters, SVG map, dossier, tables
│   ├── MobileFarmerPage.ts         # Mobile Farmer: OTP, registration, cattle submission
│   ├── MobileVetPage.ts            # Mobile Vet: inspection queue, approval, GPS stamping
│   ├── MobileChhavaniPage.ts       # Mobile Operator: admission, geofence, fodder ledger
│   ├── MobileOfficerPage.ts        # Mobile Officer: surprise checks, camp inspection
│   ├── ApiClientHelper.ts          # Direct REST API client for test setup/assertions
│   └── DatabaseHelper.ts           # Database state verification & baseline seeding
├── smoke.spec.ts                   # Fast sanity & smoke validation (< 15 seconds)
├── sanity.spec.ts                  # Critical workflow sanity (Auth, Approval, Admission)
├── e2e-full-workflow.spec.ts       # Full multi-actor journey (Farmer -> Vet -> Camp -> Admin)
├── regression.spec.ts              # Boundary conditions, full capacity, concurrency, anti-fraud
└── ldplayer-integration.spec.ts    # Android emulator / LDPlayer 14 integration test bridge
```

---

## 4. Test Suite Categorization

1. **Smoke Tests (`smoke.spec.ts`)**:
   - System health endpoint `GET /health`
   - Web Admin Dashboard initial load & title verification
   - Global filter bar & 4 top KPI metric cards rendering
   - Master reference data retrieval (Districts, Talukas, Breeds, Fodder Types)
   - Spatial ray-casting check (Point inside polygon)

2. **Sanity Tests (`sanity.spec.ts`)**:
   - Mobile OTP authentication flow (Request OTP -> Verify OTP)
   - Admin authentication & JWT token generation
   - Cattle camp geofence verification (Point inside vs Point outside)
   - Statutory CSV export download links verification with UTF-8 BOM

3. **E2E Tests (`e2e-full-workflow.spec.ts`)**:
   - Step 1: Farmer registers profile and submits cattle for verification.
   - Step 2: Veterinary Doctor inspects cattle on-farm, stamps GPS, and issues Approval.
   - Step 3: Camp Operator admits cattle inside camp geofence boundary (SRID 4326).
   - Step 4: Camp Operator receives fodder purchase (Store stock) and records daily feeding.
   - Step 5: State Relief Commissioner views updated metrics on Geographic Map & Camp Dossier.

4. **Regression Tests (`regression.spec.ts`)**:
   - Boundary: Admission rejected when GPS is outside camp polygon.
   - Boundary: Admission rejected when animal status is `PendingVerification` or `Rejected`.
   - Boundary: Admission rejected when camp reaches 100% capacity.
   - Invariant: Anti-Fraud Rule 9.6 (Offline cattle admission strictly blocked).
   - Fodder stock mathematical balance: `Store Stock + In Farm Stock == Procured - Consumed`.
   - Multi-tab navigation across all 8 Power BI sections with breadcrumb persistence.

---

## 5. QA Documentation Suite Deliverables (Phase 5)

Per project requirements, the following formal documents are established under `Project-Documentation/05_QA/`:
1. `Test_Strategy.md`: Overall testing philosophy, pyramid, quality gates, and tooling stack.
2. `Test_Plan.md`: Master test plan defining scope, environments, roles, schedule, risks.
3. `Test_Scenarios.md`: High-level test scenarios across all 5 user personas and system components.
4. `Test_Cases.md`: Detailed test cases with preconditions, steps, test data, and expected results.
5. `Test_Data_Document.md`: Synthetic cattle, farmer profiles, GPS points, and geofence polygons.
6. `RTM.md`: Requirement Traceability Matrix linking BRD/FRD to Test Cases.
7. `Defects_and_Bug_Reports.md`: Defect reporting standard, severity scale, and historical bug log.
8. `Test_Execution_Report.md`: Pass/fail/blocked summary across all test execution runs.
9. `Test_Summary_Report.md`: Executive test summary, test coverage metrics, and sign-off status.
10. `Automation_Framework_Document.md`: Playwright POM architecture, LDPlayer bridge, CI/CD setup.
11. `API_Testing_Documentation.md`: REST API test suite, Swagger contracts, and boundary matrices.
12. `Performance_Test_Report.md`: Load benchmarks, concurrent requests, and spatial query metrics.
13. `Security_Test_Report.md`: Role-based authorization, JWT expiration, input sanitization.
14. `UAT_Test_Plan_and_Signoff.md`: User acceptance test scripts and formal stakeholder sign-off.
