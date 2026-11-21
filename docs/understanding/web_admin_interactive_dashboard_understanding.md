# Interactive Web Admin Dashboard & Live Audit Viewer - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Frontend Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  
**References:**  
- `ReferanceData/FSD.md` (Section 5 "Admin Officer Web Dashboard", Section 5.10 "Reports Screen")  
- `ReferanceData/Development-Guidlines.md` (Part 4 "Web Admin Dashboard Guidelines", Rule 42 "Dashboard UI Standards", Rule 43 "Table and Data Management Rules")  

---

## 1. Business & User Experience Goals
State administrators and district collectors accessing the Web Admin Dashboard (`apps/web-admin` on port 3000) require:
1. **Live Dynamic Data Binding**: The dashboard must automatically load live KPIs from the .NET 8 WebAPI (`/api/v1/admin/dashboard`) on startup.
2. **Interactive Cattle Camp Monitoring**: Render a dynamic table of all registered Chara Chhavanis displaying Name, District, Taluka, Capacity, Active Cattle Headcount, Utilization %, and Spatial Geofence status.
3. **In-Browser Audit Report Preview**: Allow administrators to view and filter audit reports directly in the browser (in addition to direct CSV download) across:
   - Cattle Admissions & Release Trail
   - Fodder Stock Balance & Reconciliation
   - Itemized Operational Expenses
   - Government Officer Spot Inspections
4. **Resilient Network Handling**: If the backend API is starting up or temporarily offline, the dashboard must display graceful loading/fallback states without throwing unhandled exceptions.

---

## 2. Technical Architecture & DOM Layout

### 2.1 Component Structure (`apps/web-admin/src/index.ts`)
- `AdminWebDashboardApp`:
  - `init()`: Lifecycle hook attached to `DOMContentLoaded`.
  - `loadAndRenderKpis()`: Fetches summary data and populates DOM elements.
  - `loadAndRenderCampsTable()`: Fetches camp summary list and renders an HTML table with capacity badges.
  - `loadAndRenderReport(reportType)`: Fetches tabular audit data for the active tab and renders interactive rows with bilingual column headers.

### 2.2 Visual Hierarchy (`apps/web-admin/index.html`)
- Header: Bilingual State Government identity ("महाराष्ट्र शासन - चारा छावणी राज्यस्तरीय डॅशबोर्ड").
- Top Metrics Grid: Total Farmers, Total Admitted Cattle, Active Camps, Capacity Utilization %.
- Camps Overview Table: Real-time capacity utilization progress bars and geofence indicators.
- Interactive Audit Reports Viewer: Tab navigation (Admissions, Fodder, Expenses, Inspections) with instant CSV export buttons and preview data tables.

---

## 3. Verification Criteria
- `apps/web-admin/src/index.ts` compiles with 0 TypeScript errors (`tsc --noEmit`).
- DOM elements update dynamically upon successful API response.
- Graceful fallbacks display when API is unreachable.
