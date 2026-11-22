# Understanding Document: Google Maps Integration for Web Admin Dashboard

**Module:** Web Admin Geographic Intelligence Engine (`apps/web-admin`)  
**Document ID:** GOOGLE-MAP-UND-001  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 2 (Understanding Document)  
**Author:** Lead Front-End Architect & GIS Specialist  

---

## 1. Business & Technical Context

### 1.1 Objective
Transform the Chara Chhavani Web Admin Dashboard (`apps/web-admin`) to exclusively utilize **Google Maps** as the primary interactive geographic engine for cattle relief monitoring, spatial geofence visualization, and administrative navigation across Maharashtra state, drought districts, talukas, villages, and cattle camp geofences.

### 1.2 Target Users & Actors
- **State Relief Commissioners & District Collectors**: Visually inspect camps with high-resolution Google Satellite / Hybrid aerial photography to evaluate sheds, water cisterns, and livestock boundaries.
- **Government Inspection Officers**: Validate exact camp gate admission coordinates and boundary perimeter rings.
- **QA Automation & DevOps**: Execute 44+ automated Playwright tests and smoke checks with 100% reliability and zero flakiness.

---

## 2. Functional Requirements & Technical Specifications

### 2.1 Google Maps Architecture (`apps/web-admin`)
1. **Google Maps SDK Loading & Resilience**:
   - Asynchronously load Google Maps JavaScript API with libraries `geometry`, `drawing`, `places`.
   - Provide clean configuration for `GOOGLE_MAPS_API_KEY`.
   - Include an offline/local resilient Google Maps SDK fallback engine (`google.maps.Map`, `google.maps.Polygon`, `google.maps.Marker`, `google.maps.InfoWindow`, `google.maps.LatLngBounds`) so tests and intranet environments run seamlessly with 0 errors even without external internet or when keys are unmetered.
2. **Interactive Map Features**:
   - **Base Map Types**: Support Roadmap, Satellite, Hybrid, and Terrain with map type control buttons.
   - **Administrative Polygons (`google.maps.Polygon`)**:
     - State contour of Maharashtra.
     - 10 Drought Districts (Chhatrapati Sambhajinagar, Jalna, Beed, Dharashiv, Solapur, Ahmednagar, Parbhani, Hingoli, Latur, Nanded) with drought severity styling.
     - Talukas and Villages of Paithan / Chhatrapati Sambhajinagar.
     - Exact NetTopologySuite WGS84 SRID 4326 closed-ring cattle relief camp geofence (`[19.81°N, 75.32°E] -> [19.81°N, 75.34°E] -> [19.83°N, 75.34°E] -> [19.83°N, 75.32°E]`).
     - 50-meter safety tolerance buffer zone.
   - **Google Maps Markers & InfoWindows (`google.maps.Marker`)**:
     - Centroid Relief Camp Marker ⛺ with animated drop and interactive InfoWindow displaying camp name, code, capacity, and admission slots.
     - Gate Admission Entry Point Marker 🚪 at `(19.81°N, 75.33°E)`.
     - Vertex Pins ($V_1$ through $V_4$) highlighting geofence perimeter corners.
   - **Hierarchical Drill-Down & Zoom Transitions**:
     - State view: Centered at `(19.5, 76.0)`, Zoom level `7`.
     - District view: Smooth transition to district center, Zoom level `9`.
     - Taluka view: Zoom level `11`.
     - Camp Geofence view: Deep zoom level `15` displaying high-precision satellite/hybrid imagery of the relief camp perimeter.
3. **Controls & Filter Interactivity**:
   - District / Taluka dropdown filtering triggers Google Maps `map.panTo()` and `map.setZoom()` / `map.fitBounds()`.
   - Toggle buttons for Boundaries, Markers, Geofence, and Coordinates.
   - `⬆ Drill Up` and `↺ Reset View` buttons smoothly reset the Google Map camera.
   - Clicking any camp marker or polygon triggers `DashboardApp.selectCamp(campId)` and populates the Camp Dossier side panel.

---

## 3. Non-Functional Requirements & Governance

1. **Zero Regressions**: All 44 Playwright E2E tests (Desktop Chrome & Mobile Chrome) must continue to pass 100%.
2. **Strict Tech Standards**: ESLint (`npm run lint:all`) must pass with 0 errors; TypeScript typecheck across all 7 workspace packages must pass with 0 errors.
3. **Responsive Execution**: Google Map container must automatically resize on window resize and mobile viewports (`Pixel 5` / `393x851`).
