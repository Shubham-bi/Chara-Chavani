# Master Test Plan

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-PLN-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Scope of Testing

### 1.1 In-Scope Components
- **Web Admin Portal (`apps/web-admin`)**:
  - Administrative authentication, executive KPI grids, interactive Maharashtra GIS choropleth vector map, camp operational dossier side panel, 8 Power BI analytical sections, and statutory RFC 4180 CSV audit reports.
- **Backend Core REST API (`backend/src/CharaChhavani.WebApi`)**:
  - ASP.NET Core 8 WebAPI endpoints, CQRS query/command handlers, NetTopologySuite spatial calculations, JWT authentication, and MySQL EF Core persistence.
- **Mobile Applications (`apps/mobile-*`)**:
  - Farmer App: Mobile OTP login, profile registration, cattle registration, verification status.
  - Vet App: Verification queue, health inspection, GPS geotagging, approve/reject workflow.
  - Camp Operator App: Geofence admission validation, cattle release, fodder inventory tracking, daily feeding records.
  - Officer App: Camp inspection, spot headcounts, escalation of irregularities.
- **Database & Spatial Invariants (`MySQL 8.0`)**:
  - Spatial indexing on camp boundaries (`POLYGON`) and admission points (`POINT`).
  - Strict transaction rollbacks for concurrent admissions.

### 1.2 Out-of-Scope
- Physical biometric iris scanners (emulated via digital photo and mock payload).
- Hardware GPS hardware antenna failure simulation (tested via mock lat/long coordinates).

---

## 2. Test Environments & Tooling

| Environment | Host URL / Port | Technology Stack |
|---|---|---|
| **Local Development** | `http://localhost:5000` (API)<br>`http://localhost:3000` (Web Admin) | .NET 8 WebAPI, Node.js static server, MySQL 8.0, Playwright |
| **Android Emulator** | Port `5555` / `emulator-5554` | LDPlayer 14, Android Debug Bridge (ADB), MCP LDPlayer |
| **Mobile Web Emulation** | Viewports: 375x667, 412x915 | Chromium / WebKit (Pixel 5, iPhone 13) |

---

## 3. Test Schedules & Milestones

1. **Sprint Milestone 1: Core Foundation & API Sanity**:
   - Backend unit tests (67/67 passing).
   - Automated smoke suite (19/19 passing).
2. **Sprint Milestone 2: Web Admin CR v2.0 & POM Automation**:
   - Page Object Model design in `tests/e2e-web/pages/`.
   - Desktop and Mobile viewport test suites (29/29 passing).
3. **Sprint Milestone 3: End-to-End System Integration**:
   - Multi-actor workflow validation (Farmer -> Vet -> Operator -> Admin).
   - Boundary geofence testing and anti-fraud Rule 9.6 enforcement.
4. **Sprint Milestone 4: Final UAT & Production Sign-off**:
   - Final regression runs, CSV export validation, and stakeholder sign-off.

---

## 4. Entry and Exit Criteria

### Entry Criteria:
- Code builds with 0 compiler warnings/errors (`dotnet build backend/CharaChhavani.sln`).
- Monorepo passes typechecking with 0 errors (`npm run typecheck`).
- Baseline reference seeder executed successfully.

### Exit Criteria:
- 100% of critical (P0) and major (P1) test cases pass.
- Zero open critical defects in defect log.
- All 5 Quality Gates signed off.
