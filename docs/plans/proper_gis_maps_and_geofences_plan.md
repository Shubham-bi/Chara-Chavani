# Dev Plan & Task Checklist: Proper Administrative Boundaries & Geofence Visualization

**Module:** Web Admin Geographic Intelligence Engine (`apps/web-admin`)  
**Document ID:** GIS-MAP-PLN-001  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 13 (Sign-off & Move to Next)  
**Status:** 100% Completed & Verified  
**Author:** Lead GIS Solutions Architect & Front-End Engineer  

---

## 1. High-Level Architectural Approach

1. **Equirectangular GIS Projection Engine:**
   - Implemented dynamic bounding box calculation and coordinate projection from real WGS84 coordinates (Latitude, Longitude) to SVG screen space.
   - Built smooth zoom and pan bounding for each level of the hierarchy (`State → District → Taluka → Village → Camp`).
2. **Realistic Boundary Datasets:**
   - **State Level:** Official Maharashtra outer perimeter polygon and 10 major drought-prone administrative districts with realistic geographical shapes and adjacent buffer polygons.
   - **District Level:** Constituent Taluka boundaries for selected districts (9 Talukas of Chhatrapati Sambhajinagar: Paithan, Gangapur, Vaijapur, Aurangabad, Kannad, Khuldabad, Phulambri, Sillod, Soegaon).
   - **Taluka Level:** Constituent Village boundaries for selected talukas (8 Villages of Paithan: Pachod, Bidkin, Balanagar, Adul, Apegaon, Navgaon, Isarwadi, Pimpalwadi).
   - **Camp Geofence Level:** High-precision rendering of the exact NetTopologySuite polygon coordinates (`camp.polygonCoordinates`) with 4-5 vertices, vertex pins, 50m tolerance buffer, gate entry marker, and centroid icon.
3. **Map Controls & Interactivity:**
   - Click-to-drill-down and `⬆ Drill Up` / `↺ Reset View` buttons.
   - Layer toggles: Boundaries, Camp Markers, Geofence Polygons, Lat/Long Parallel Grid (Graticules).
   - Camp selection drawer linking directly from polygon/marker clicks to full dossier view with coordinate table.
4. **Verification & Quality Assurance:**
   - Verified Playwright E2E tests (Desktop Chrome 29/29 PASS, Mobile Chrome 29/29 PASS).
   - Verified .NET 8 unit tests (67/67 PASS), PowerShell smoke test (19/19 PASS), Monorepo linting (0 errors), and TypeScript typechecks (0 errors across 7 packages).

---

## 2. Granular Task Checklist

### Phase 1: GIS Dataset & Projection Engine Architecture
- [x] **Task 1.1:** Build Equirectangular GIS projection helper (`EquirectangularProjection`, `computeBoundingBox`) in `apps/web-admin/dashboard.js`.
- [x] **Task 1.2:** Define official geographical boundary datasets for Maharashtra State, Districts, Talukas, and Villages.
- [x] **Task 1.3:** Implement dynamic level-switching logic (`state`, `district`, `taluka`, `village`, `camp`).

### Phase 2: Hierarchical Map Vector Rendering
- [x] **Task 2.1:** Implement State-level rendering with district choropleths, camp counts, and hover tooltips.
- [x] **Task 2.2:** Implement District-level rendering with taluka boundary polygons and drill-down clicks.
- [x] **Task 2.3:** Implement Taluka-level rendering with village boundary polygons.
- [x] **Task 2.4:** Implement Village & Camp Geofence rendering with exact WGS84 NetTopologySuite polygon coordinates, vertex pins, tolerance buffer, and gate marker.
- [x] **Task 2.5:** Add geographic coordinate grid (parallels & meridians with lat/lon labels) and compass rose / scale indicator.

### Phase 3: UI Controls & Camp Dossier Enrichment
- [x] **Task 3.1:** Update `apps/web-admin/index.html` with grid layer toggle, drill-up/reset buttons, and scope indicator badge.
- [x] **Task 3.2:** Update Camp Dossier side panel (`#camp-dossier-panel`) with detailed vertex coordinate table, perimeter, and area calculations.

### Phase 4: Verification & Testing
- [x] **Task 4.1:** Verify Playwright test suite passes (`npm run test:playwright` Desktop: 29/29 PASS, Mobile: 29/29 PASS).
- [x] **Task 4.2:** Run `npm run lint:all` and `npm run typecheck` (0 errors across all 7 workspace packages).
- [x] **Task 4.3:** Run PowerShell smoke suite (`scripts/e2e_smoke_test.ps1`: 19/19 PASS) and .NET unit tests (`dotnet test`: 67/67 PASS).
- [x] **Task 4.4:** Document challenges and solutions in `docs/logs/challenges_and_solutions.md`.
- [x] **Task 4.5:** Update Dev Plan checklist items (`- [x]`) and commit/push to remote repository.
