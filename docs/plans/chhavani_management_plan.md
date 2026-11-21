# Chhavani Camp Management & Geofencing Plan & Task List

**Module:** Chhavani Camp Management & Spatial Geofence  
**Reference Understanding Doc:** [chhavani_management_understanding.md](../understanding/chhavani_management_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (CQRS Commands & Queries)**:
   * `CreateChhavaniCommand`: Validates input with FluentValidation, generates unique `CampCode`, saves camp and assigned operator atomically.
   * `UpdateChhavaniGeofenceCommand`: Validates polygon vertices, constructs NetTopologySuite `Polygon`, and updates camp boundary.
   * `GetChhavaniByIdQuery`: Returns camp details with GeoJSON-formatted geofence coordinates and capacity utilization.
   * `GetChhavanisQuery`: Supports filtering by District, Taluka, and Status with pagination.
   * `ValidateCampGeofenceQuery`: In-memory and spatial query to test whether a given $(lat, lng)$ coordinate falls inside the camp boundary.
2. **Infrastructure Layer**:
   * Ensured database transaction handling and spatial query methods.
3. **WebApi Layer**:
   * `CampsController` exposing REST endpoints with standard `ApiResponse<T>`.
4. **Verification & Testing**:
   * Unit and integration tests covering:
     * Camp creation and unique code generation.
     * Geofence validation (inside, outside, boundary vertex).
     * Capacity check.

---

## Granular Atomic Task List

- [x] **Task 1: Implement DTOs and GeoJSON Coordinate Models**
  - Scope: `GeoCoordinateDto`, `ChhavaniDto`, `CreateChhavaniDto`, `UpdateGeofenceDto`.
  - Target: `CharaChhavani.Application/Chhavanis/DTOs/`
- [x] **Task 2: Implement CQRS Commands & FluentValidators**
  - Scope: `CreateChhavaniCommand`, `UpdateChhavaniGeofenceCommand`, and their respective validators.
  - Target: `CharaChhavani.Application/Chhavanis/Commands/`
- [x] **Task 3: Implement CQRS Queries**
  - Scope: `GetChhavaniByIdQuery`, `GetChhavanisQuery`, `ValidateCampGeofenceQuery`.
  - Target: `CharaChhavani.Application/Chhavanis/Queries/`
- [x] **Task 4: Implement CampsController in WebApi**
  - Scope: REST endpoints for camp registration, geofence setup, retrieval, and spatial validation.
  - Target: `CharaChhavani.WebApi/Controllers/CampsController.cs`
- [x] **Task 5: Write Unit & Integration Tests**
  - Scope: Tested geofence polygon boundary creation, coordinate containment validation, capacity constraints.
  - Target: `CharaChhavani.UnitTests/ChhavaniManagementTests.cs`
- [x] **Task 6: Build & Test Verification**
  - Scope: Executed `dotnet test backend/CharaChhavani.sln` to achieve 100% test pass rate (9/9 passed).
  - Target: Solution-wide
