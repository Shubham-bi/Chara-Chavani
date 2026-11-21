# Admin Officer Web Dashboard Plan & Task List

**Module:** Admin Officer Web Dashboard & System-Wide Analytics  
**Reference Understanding Doc:** [admin_dashboard_understanding.md](../understanding/admin_dashboard_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (CQRS Commands & Queries)**:
   * `GetAdminDashboardQuery`: Aggregated database-wide metrics for farmers, animals, camps, inventory, and expenditures.
   * `GetAdminCampOverviewQuery`: Returned camp summary with capacity utilization percentages and geofence status.
2. **WebApi Layer**:
   * `AdminController` (`/api/v1/admin`) exposing dashboard and reporting endpoints.
3. **Shared API Client (`packages/api-client`)**:
   * Added `admin` service namespace to `CharaChhavaniApiClient`.
4. **Web Admin Application (`apps/web-admin`)**:
   * Scaffolded React + TypeScript admin client with dashboard widgets, camp overview, and geofence map components.
5. **Verification & Testing**:
   * Unit tests for admin dashboard aggregation query.
   * TypeScript typecheck verification across `apps/web-admin`.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Admin DTOs & CQRS Queries**
  - Scope: `AdminDashboardSummaryDto`, `CampUtilizationSummaryDto`, `GetAdminDashboardQuery`.
  - Target: `CharaChhavani.Application/Admin/`
- [x] **Task 2: Implement AdminController in WebApi**
  - Scope: REST API endpoints for `/api/v1/admin/dashboard` and `/api/v1/admin/camps-summary`.
  - Target: `CharaChhavani.WebApi/Controllers/AdminController.cs`
- [x] **Task 3: Update `@chara-chhavani/api-client` with Admin Service**
  - Scope: Added `admin.getDashboard()` and `admin.getCampsSummary()` methods.
  - Target: `packages/api-client/src/`
- [x] **Task 4: Scaffold `apps/web-admin` Web Dashboard**
  - Scope: Package configuration, Vite / React setup, dashboard controller, and view models.
  - Target: `apps/web-admin/`
- [x] **Task 5: Write Unit Tests for Admin Aggregation**
  - Scope: Tested metric calculations and utilization percentages.
  - Target: `CharaChhavani.UnitTests/AdminDashboardTests.cs`
- [x] **Task 6: Build & Test Verification**
  - Scope: Executed `dotnet test` (35/35 passed) and `tsc --noEmit` across `apps/web-admin`.
  - Target: Solution-wide
