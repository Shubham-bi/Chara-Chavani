# Dev Plan & Task Checklist: Playwright Data-Driven Testing (JSON/Excel) & Common Utilities

**Module:** End-to-End Test Automation Suite (`tests/e2e-web`)  
**Document ID:** QA-PLAYWRIGHT-PLN-002  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 13 (Sign-off & Move to Next)  
**Status:** 100% Completed & Verified  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. High-Level Architectural Approach

1. **Common Utilities Layer (`tests/e2e-web/common/`)**:
   - `EnvironmentConfig.ts`: Standardized endpoints, timeouts, and dev accounts.
   - `DataLoader.ts`: Built robust reader for JSON files and Excel (`.xlsx`) workbooks using `xlsx` (SheetJS) with in-memory caching.
   - `CommonAssertions.ts`: Defined domain-specific assertion methods (`assertKpiCardsPopulated`, `assertGeofenceResult`, `assertCampDossierDetails`, `assertCsvHeaders`, etc.).
   - `ReportingHelper.ts`: Implemented test auditing, step tracking, iteration data logging, and formatted console banners.
   - `TestFixtures.ts`: Extended `@playwright/test` `test` with custom fixtures injecting Page Objects, API Client, Database Helper, Data Loader, and Reporting.

2. **Test Datasets (`tests/fixtures/data/`)**:
   - JSON Data Files: `farmers.json`, `camps.json`, `animals.json`, `geofences.json`, `dashboard-metrics.json`.
   - Excel Workbook: `test_matrix.xlsx` containing multiple sheets (`Farmers`, `Camps`, `Geofences`, `Animals`, `KPIThresholds`).
   - Excel Generation Script: `scripts/generate_test_matrix_excel.js` to build and verify `test_matrix.xlsx`.

3. **Complete Data-Driven Playwright Test Cases (`tests/e2e-web/data-driven/`)**:
   - `data-driven-farmers.spec.ts`: Parameterized farmer OTP login, dev token verification, and negative tests driven by JSON and Excel datasets.
   - `data-driven-camps.spec.ts`: Parameterized camp capacity, dossier verification, and district filter breadcrumbs driven by JSON and Excel datasets.
   - `data-driven-geofences.spec.ts`: Parametric geofence coordinate containment checks (Inside, Edge, Outside, Far Outside) and vector map layer toggles driven by JSON and Excel datasets.
   - `data-driven-animals-vet.spec.ts`: Cattle admission and statutory feeding rules (Large vs Small Cattle) driven by JSON and Excel datasets.
   - `data-driven-reports-export.spec.ts`: Statutory audit CSV reports, header column assertions, and 8 analytical sections navigation driven by JSON and Excel datasets.

4. **Verification & Quality Assurance**:
   - Playwright Desktop Chrome: 44/44 PASS.
   - Playwright Mobile Chrome (`Pixel 5`): 44/44 PASS.
   - .NET 8 Release Unit Tests: 67/67 PASS.
   - PowerShell E2E Smoke Tests: 19/19 PASS.
   - Monorepo Linting (`npm run lint:all`): 0 errors.
   - TypeScript Typechecking (`npm run typecheck` across all 7 packages): 0 errors.

---

## 2. Granular Task Checklist

### Phase 1: Common Utilities & Framework Infrastructure
- [x] **Task 1.1:** Create `tests/e2e-web/common/EnvironmentConfig.ts`.
- [x] **Task 1.2:** Create `tests/e2e-web/common/DataLoader.ts` supporting `.json` and `.xlsx` parsing.
- [x] **Task 1.3:** Create `tests/e2e-web/common/CommonAssertions.ts` with domain validation helpers.
- [x] **Task 1.4:** Create `tests/e2e-web/common/ReportingHelper.ts` for structured logging.
- [x] **Task 1.5:** Create `tests/e2e-web/common/TestFixtures.ts` extending base Playwright test.

### Phase 2: Test Data Assets (JSON & Excel)
- [x] **Task 2.1:** Create JSON datasets in `tests/fixtures/data/` (`farmers.json`, `camps.json`, `animals.json`, `geofences.json`, `dashboard-metrics.json`).
- [x] **Task 2.2:** Create script `scripts/generate_test_matrix_excel.js` and generate `tests/fixtures/data/test_matrix.xlsx` with sheets: `Farmers`, `Camps`, `Geofences`, `Animals`, `KPIThresholds`.
- [x] **Task 2.3:** Verify data loader parses both JSON and Excel sheets with exact row counts.

### Phase 3: Data-Driven Playwright Test Cases
- [x] **Task 3.1:** Implement `tests/e2e-web/data-driven/data-driven-farmers.spec.ts`.
- [x] **Task 3.2:** Implement `tests/e2e-web/data-driven/data-driven-camps.spec.ts`.
- [x] **Task 3.3:** Implement `tests/e2e-web/data-driven/data-driven-geofences.spec.ts`.
- [x] **Task 3.4:** Implement `tests/e2e-web/data-driven/data-driven-animals-vet.spec.ts`.
- [x] **Task 3.5:** Implement `tests/e2e-web/data-driven/data-driven-reports-export.spec.ts`.

### Phase 4: Verification, Linting & Sign-Off
- [x] **Task 4.1:** Run Playwright Desktop Chrome tests (`npx playwright test --project=desktop-chrome`: 44/44 PASS).
- [x] **Task 4.2:** Run Playwright Mobile Chrome tests (`npx playwright test --project=mobile-chrome`: 44/44 PASS).
- [x] **Task 4.3:** Run `npm run lint:all` and `npm run typecheck` (0 errors across all 7 workspace packages).
- [x] **Task 4.4:** Run PowerShell smoke suite (`scripts/e2e_smoke_test.ps1`: 19/19 PASS) and .NET tests (`dotnet test`: 67/67 PASS).
- [x] **Task 4.5:** Record challenges in `docs/logs/challenges_and_solutions.md` and commit/push.
