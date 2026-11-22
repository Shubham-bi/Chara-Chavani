# Understanding Document: Playwright Data-Driven Testing Framework (JSON/Excel) & Common Utilities

**Module:** End-to-End Test Automation Suite (`tests/e2e-web`)  
**Document ID:** QA-PLAYWRIGHT-UND-002  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 2 (Understanding Document)  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Business & Technical Context

### 1.1 Objective
Enhance the Chara Chhavani Playwright E2E automation framework to support:
1. **Data-Driven Testing (DDT)** leveraging both **JSON** and **Excel (.xlsx)** data sources.
2. **Comprehensive Common Utilities and Common Features** (fixtures, data loaders, assertions, reporting, environment config).
3. **Complete End-to-End Test Coverage** covering Farmer lifecycle, Camp capacity and geofence invariants, Animal breeds & veterinary inspections, and Statutory audit reporting.

### 1.2 Target Users & Actors
- **QA Engineers & SDETs**: Execute parameter-driven test matrices across multiple environments without code duplication.
- **State Relief Administrators & Auditors**: Verify that the system adheres strictly to statutory thresholds and anti-fraud rules with audit trail logs.
- **CI/CD Automation Pipelines**: Run smoke, regression, and data-driven suites in headless browsers (Desktop Chrome, Mobile Chrome Pixel 5, Mobile Safari).

---

## 2. Functional Requirements & Common Features

### 2.1 Common Utilities Architecture (`tests/e2e-web/common/`)
- **`DataLoader.ts`**:
  - Unified data ingestion utility supporting both `.json` and `.xlsx` formats.
  - Native Excel workbook parsing using `xlsx` (SheetJS) to extract tabular records from multiple named worksheets (`Farmers`, `Camps`, `Geofences`, `Animals`, `KPIThresholds`).
  - Type-safe generic interfaces (`loadJson<T>`, `loadExcel<T>`).
- **`TestFixtures.ts`**:
  - Playwright custom fixture extending `base.test` with automatic dependency injection of `AdminDashboardPage`, `ApiClientHelper`, `DatabaseHelper`, `MobileAppViewPage`, and `DataLoader`.
  - Built-in failure hooks for automatic screenshots and step timing.
- **`CommonAssertions.ts`**:
  - Reusable domain assertions:
    - `assertKpiValuesMatch`: Validates displayed cards against database / API ground truth.
    - `assertGeofencePoint`: Asserts point-in-polygon containment (`isInside: true/false`).
    - `assertCampDossierCoordinates`: Verifies vertex coordinates, perimeter, and area in the camp dossier.
    - `assertNoConsoleErrors`: Asserts zero uncaught JavaScript errors in browser console.
- **`EnvironmentConfig.ts`**:
  - Centralized URLs, API endpoints, timeouts, and dev credentials.
- **`ReportingHelper.ts`**:
  - Formatted test execution logs, step auditing, and execution metrics.

### 2.2 Data-Driven Test Cases Matrix
- **`data-driven-farmers.spec.ts`**:
  - Tests mobile OTP authentication and profile completeness across diverse mobile number variations from `farmers.json` and `test_matrix.xlsx` (`Farmers` sheet).
- **`data-driven-camps.spec.ts`**:
  - Tests camp occupancy, available capacity calculation, and dossier coordinates across multiple relief camps from `camps.json` and `test_matrix.xlsx` (`Camps` sheet).
- **`data-driven-geofences.spec.ts`**:
  - Validates spatial boundaries (Inside, Edge, Outside, Far Outside) across multiple test coordinate pairs from `geofences.json` and `test_matrix.xlsx` (`Geofences` sheet).
- **`data-driven-animals-vet.spec.ts`**:
  - Validates breed classifications, large vs small cattle rules, and veterinary inspection states from `animals.json` and `test_matrix.xlsx` (`Animals` sheet).
- **`data-driven-reports-export.spec.ts`**:
  - Verifies statutory audit CSV export links and analytical sections from `dashboard-metrics.json`.

---

## 3. Data Flow & Test Lifecycle

```
[test_matrix.xlsx / JSON Files]
           │
           ▼
    [DataLoader.ts]
           │
           ▼
[Playwright Custom Fixture (TestFixtures.ts)]
           │
     ┌─────┴────────────────────────┐
     ▼                              ▼
[Page Object Models (POM)]    [Common Assertions]
 (AdminDashboardPage, etc.)    (CommonAssertions.ts)
     │                              │
     └──────────────┬───────────────┘
                    ▼
          [Test Execution Run]
                    │
                    ▼
       [HTML / List / JSON Reports]
```

---

## 4. Non-Functional Requirements & Governance

1. **Zero Regressions**: All 29 existing Playwright tests must continue to pass 100%.
2. **Lint & Type Safety**: Strict TypeScript with 0 compilation errors (`tsc --noEmit`) and 0 ESLint warnings (`eslint .`).
3. **Execution Efficiency**: Single-pass data loading with in-memory caching to prevent test slowdowns.
4. **Offline Capability**: Data files stored locally in repository; no external network dependencies.
