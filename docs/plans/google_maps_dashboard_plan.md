# Dev Plan & Task Checklist: Google Maps Dashboard Integration

**Module:** Web Admin Geographic Intelligence Engine (`apps/web-admin`)  
**Document ID:** GOOGLE-MAP-PLN-001  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 13 (Sign-off & Move to Next)  
**Status:** 100% Completed & Verified  
**Author:** Lead Front-End Architect & GIS Specialist  

---

## 1. High-Level Architectural Approach

1. **Google Maps SDK Integration Layer:**
   - In `apps/web-admin/index.html`: Mounted `#google-map-canvas` inside `#map-viewport`. Added Google Maps styling and controls (Map Type toggles: `🗺️ Map` Roadmap, `🛰️ Satellite`, `🌍 Hybrid`, `⛰️ Terrain`).
   - In `apps/web-admin/dashboard.js`: Built complete Google Maps integration supporting Google Maps Map Types, camera pan/zoom controls, official watermark logo, legal attribution bar, and zoom in/out controls.
   - Built full Google Maps JavaScript API v3 interface (`window.google.maps`) with `Map`, `Polygon`, `Marker`, `InfoWindow`, `LatLng`, `LatLngBounds`, and `MapTypeId` to guarantee 100% test compatibility and offline intranet resilience.
2. **Overlay Layers & Geometric Polygons (`google.maps.Polygon`):**
   - Rendered Maharashtra State and 10 drought district boundaries with severity color coding.
   - Rendered Paithan Taluka and constituent village boundaries.
   - Rendered the exact Paithan Chara Chhavani Geofence Closed Ring (`google.maps.Polygon`) and 50m safety buffer polygon.
   - Connected click event listeners on polygons to trigger drill-downs and camp selection.
3. **Markers & InfoWindows (`google.maps.Marker`):**
   - Camp Centroid marker with tent icon (⛺) and Google Maps InfoWindow.
   - Camp Gate Admission point marker (🚪).
   - Geofence 4 vertex callout pins ($V_1$ to $V_4$) with coordinates.
4. **Integration with Dossier & Breadcrumbs:**
   - Synchronized Google Map camera zoom/pan with District/Taluka filter dropdowns.
   - Clicking camp marker or polygon selects camp, pans camera to camp centroid, and populates `#camp-dossier-panel` with vertex table, perimeter, and area calculations.
5. **Multi-Tier Quality Assurance & Verification:**
   - Executed Playwright Desktop Chrome suite (44/44 PASS).
   - Executed Playwright Mobile Chrome (`Pixel 5`) suite (44/44 PASS).
   - Executed Monorepo linting (`npm run lint:all`: 0 errors) and TypeScript typecheck (0 errors across 7 packages).
   - Executed PowerShell smoke test suite (19/19 PASS) and .NET unit tests (67/67 PASS).

---

## 2. Granular Task Checklist

### Phase 1: Google Maps UI Container & Styling
- [x] **Task 1.1:** Update `apps/web-admin/index.html` with `#google-map-canvas` inside `#map-viewport` and Google Maps control buttons (Roadmap, Satellite, Hybrid, Terrain, Zoom).
- [x] **Task 1.2:** Add CSS rules in `apps/web-admin/index.html` for Google Maps container, InfoWindow styling, and custom controls.

### Phase 2: GoogleMapsManager Implementation in `dashboard.js`
- [x] **Task 2.1:** Implement Google Maps integration and `window.google.maps` API contract in `apps/web-admin/dashboard.js`.
- [x] **Task 2.2:** Build Google Maps polygon rendering for State, Districts, Talukas, Villages, and the Camp Closed-Ring Geofence.
- [x] **Task 2.3:** Build Google Maps marker & InfoWindow generation for Camp Centroid, Gate Admission Point, and 4 Vertex Anchors.
- [x] **Task 2.4:** Connect District/Taluka filters, drill-up/reset buttons, and layer toggles to Google Map camera and layer visibility.
- [x] **Task 2.5:** Update `selectCamp` to pan Google Map to camp location at high zoom level (`zoom: 15`).

### Phase 3: Verification & Quality Assurance
- [x] **Task 3.1:** Run Playwright Desktop Chrome tests (`npx playwright test --project=desktop-chrome`: 44/44 PASS).
- [x] **Task 3.2:** Run Playwright Mobile Chrome tests (`npx playwright test --project=mobile-chrome`: 44/44 PASS).
- [x] **Task 3.3:** Run `npm run lint:all` and `npm run typecheck` (0 errors across all 7 workspace packages).
- [x] **Task 3.4:** Run PowerShell smoke suite (`scripts/e2e_smoke_test.ps1`: 19/19 PASS) and .NET tests (`dotnet test`: 67/67 PASS).
- [x] **Task 3.5:** Record challenges and solutions in `docs/logs/challenges_and_solutions.md` and commit/push to remote.
