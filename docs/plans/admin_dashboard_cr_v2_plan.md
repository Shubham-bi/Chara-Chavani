# Dev Plan & Task Checklist: Admin Dashboard CR v2.0 (Geographic Intelligence & Power BI Analytics)

**Module / Task:** Change Request (CR) Implementation for Chara Chhavani Admin Dashboard Version 2.0  
**Document Version:** 2.0.0  
**Status:** Completed  
**Lifecycle Stage:** Stage 13 (Sign-Off & Done)  
**Author:** Lead Enterprise Solutions Architect & QA SDET  

---

## 1. High-Level Architectural Approach

1. **Backend Server-Side Aggregations (Clean Architecture & CQRS):**
   - Provide optimized MediatR queries for geographic hierarchy, camp GeoJSON map features, and section-specific analytical breakdowns.
   - Avoid client-side full table downloads; enforce server-side aggregation and caching.
2. **Interactive Geographic Intelligence Map:**
   - Implement hierarchical drill-down (`State → District → Taluka → Village → Camp`).
   - Deliver choropleth color grading across 3 selectable metrics (`Camps Count`, `Admitted Cattle`, `Capacity Utilization %`).
   - Render exact registered camp coordinates as markers and actual closed geofence polygons (SRID 4326).
3. **Power BI-Style Analytical Sections:**
   - 8 distinct analytical views: `Overview`, `Geographic`, `Camp`, `Animal`, `Veterinary`, `Fodder`, `Financial`, `Reports`.
   - Global filter bar with instant breadcrumb tracking and reset.
   - Detailed Camp Selection Drawer with real-time operational dossier.
4. **Automated Verification:**
   - Playwright automated browser tests covering all 8 tabs, map interactions, filters, and export buttons.
   - Zero-regression policy: lint 0, typecheck 0, unit tests passing.

---

## 2. Granular Task Checklist

### Phase 1: Backend Domain & Application CQRS Aggregations
- [x] **Task 1.1:** Create DTOs in `CharaChhavani.Application.Admin.DTOs` (`GeographicDistributionDto`, `CampMapFeatureDto`, `SectionAnalyticsDtos`).
- [x] **Task 1.2:** Implement MediatR queries and handlers (`GetGeographicDistributionQuery`, `GetCampMapFeaturesQuery`, `GetAdminSectionAnalyticsQuery`).
- [x] **Task 1.3:** Expose endpoints in `AdminController.cs` (`/api/v1/admin/geographic-distribution`, `/api/v1/admin/camps-map`, `/api/v1/admin/analytics/{section}`).
- [x] **Task 1.4:** Verify backend compilation and execute `dotnet test` (all tests pass).

### Phase 2: API Client SDK & Type Definitions
- [x] **Task 2.1:** Add interfaces and models in `@chara-chhavani/api-client` (`src/models/index.ts`).
- [x] **Task 2.2:** Add client service methods in `@chara-chhavani/api-client` (`src/services/index.ts`).
- [x] **Task 2.3:** Rebuild `@chara-chhavani/api-client` (`npm run build --workspace=@chara-chhavani/api-client`).

### Phase 3: React Web Admin Dashboard Core Implementation (`apps/web-admin`)
- [x] **Task 3.1:** Implement Power BI layout shell with State emblem, last refresh timestamp, and global filter toolbar.
- [x] **Task 3.2:** Implement Interactive Geographical Map with hierarchical drill-down, choropleth color-grading, metric switching, camp markers, and geofence polygons.
- [x] **Task 3.3:** Implement Camp Selection Dossier side panel & modal.
- [x] **Task 3.4:** Implement 8 multi-tab analytical views (Overview, Geographic, Camp, Animal, Veterinary, Fodder, Financial, Reports).

### Phase 4: Playwright E2E Test Suite Expansion & Validation
- [x] **Task 4.1:** Expand `tests/e2e-web/web-admin-dashboard.spec.ts` to test all 8 tabs, interactive map drill-down, metric switcher, and camp drawer.
- [x] **Task 4.2:** Execute `npm run test:playwright` (100% passing - 10/10 tests).
- [x] **Task 4.3:** Run unified linting (`npm run lint:all`) and typechecking (`npm run typecheck`).
- [x] **Task 4.4:** Run `scripts/e2e_smoke_test.ps1` against running WebAPI (19/19 passing).

### Phase 5: Governance Documentation & Sign-off
- [x] **Task 5.1:** Document challenges and solutions in `docs/logs/challenges_and_solutions.md`.
- [x] **Task 5.2:** Update dev plan checklist items (`- [x]`).
- [x] **Task 5.3:** Commit and push changes to remote repository.
