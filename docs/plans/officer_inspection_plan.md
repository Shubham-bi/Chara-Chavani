# Officer App & Camp Field Inspection Plan & Task List

**Module:** Officer Mobile Application & Camp Inspection/Auditing  
**Reference Understanding Doc:** [officer_inspection_understanding.md](../understanding/officer_inspection_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Domain Layer**:
   - Create `CampInspection` entity inheriting from `BaseEntity` with `ChhavaniId`, `OfficerId`, `InspectorLocation`, `PhysicalAnimalCount`, `SystemAnimalCount`, `DiscrepancyDetected`, and welfare attributes.
   - Configure EF Core mapping in `ApplicationDbContext` with spatial point column and indexes.
2. **Application Layer (CQRS Commands & Queries)**:
   - `RecordCampInspectionCommand` + Handler + FluentValidation validator. Automatically queries current active admissions to compute `DiscrepancyCount` and `DiscrepancyDetected`.
   - `GetOfficerDashboardQuery` + Handler + DTO (`OfficerDashboardSummaryDto`).
   - `GetCampInspectionsQuery` + Handler + DTO (`CampInspectionSummaryDto`).
3. **WebApi Layer**:
   - `OfficerController` (`/api/v1/officer`) exposing dashboard and inspection endpoints.
4. **Shared API Client (`packages/api-client`)**:
   - Add `officer` service namespace with `getDashboard()`, `recordInspection()`, and `getCampInspections()` methods.
5. **Mobile Officer App (`apps/mobile-officer`)**:
   - Implement `OfficerDashboardScreen.ts`, `RegisterCampScreen.ts`, and `CampInspectionScreen.ts`.
6. **Testing & Verification**:
   - Domain and CQRS unit tests in `CharaChhavani.UnitTests`.
   - `dotnet test` and `tsc --noEmit` checks.

---

## Granular Atomic Task List

- [x] **Task 1: Create CampInspection Entity & EF Mapping**
  - Scope: `CampInspection.cs`, update `ApplicationDbContext.cs`.
  - Target: `backend/src/CharaChhavani.Domain/Entities/CampInspection.cs`, `backend/src/CharaChhavani.Infrastructure/Persistence/ApplicationDbContext.cs`
- [x] **Task 2: Implement CQRS Commands, Queries, and DTOs**
  - Scope: `RecordCampInspectionCommand`, `GetOfficerDashboardQuery`, `GetCampInspectionsQuery`, `OfficerDtos.cs`.
  - Target: `backend/src/CharaChhavani.Application/Officer/`
- [x] **Task 3: Implement OfficerController**
  - Scope: REST API endpoints for dashboard and inspections.
  - Target: `backend/src/CharaChhavani.WebApi/Controllers/OfficerController.cs`
- [x] **Task 4: Update Shared API Client**
  - Scope: TypeScript DTOs and `OfficerService` in `@chara-chhavani/api-client`.
  - Target: `packages/api-client/src/`
- [x] **Task 5: Implement Mobile Officer Screens**
  - Scope: `OfficerDashboardScreen.ts`, `RegisterCampScreen.ts`, `CampInspectionScreen.ts`.
  - Target: `apps/mobile-officer/src/screens/`
- [x] **Task 6: Write Unit Tests & Verify**
  - Scope: Tests for discrepancy detection, GPS recording, and dashboard metrics.
  - Target: `backend/tests/CharaChhavani.UnitTests/OfficerInspectionTests.cs`
