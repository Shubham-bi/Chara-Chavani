# Veterinary Doctor Verification Plan & Task List

**Module:** Veterinary Doctor Verification & Inspection Workflow  
**Reference Understanding Doc:** [vet_verification_understanding.md](../understanding/vet_verification_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (CQRS Commands & Queries)**:
   * `GetVetDashboardQuery`: Aggregates overall pending, verified, and rejected animal metrics.
   * `GetPendingVerificationsQuery`: Lists `Pending` animals with pagination and geographic filters.
   * `SubmitVerificationCommand`: Validates doctor ID, result, mandatory rejection reason, stamps GPS coordinates as `Point`, updates `Animal.VerificationStatus` atomically within a transaction, and saves audit record.
   * `GetVetVerificationHistoryQuery`: Lists verifications filtered by doctor or date range.
2. **WebApi Layer**:
   * `VetController` (`/api/v1/vet`) exposing REST endpoints with standard `ApiResponse<T>`.
3. **Verification & Testing**:
   * Unit tests covering:
     * Mandatory rejection reason validator when result is `Rejected`.
     * Optional remarks when result is `Approved`.
     * State transition to `Approved` and `Rejected`.
     * GPS point coordinate creation.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Vet Verification DTOs**
  - Scope: `VetDashboardDto`, `PendingVerificationAnimalDto`, `SubmitVerificationDto`.
  - Target: `CharaChhavani.Application/Vet/DTOs/`
- [x] **Task 2: Implement CQRS Commands, Queries & Validators**
  - Scope: `SubmitVerificationCommand`, `SubmitVerificationValidator`, `GetVetDashboardQuery`, `GetPendingVerificationsQuery`, `GetVetVerificationHistoryQuery`.
  - Target: `CharaChhavani.Application/Vet/`
- [x] **Task 3: Implement VetController in WebApi**
  - Scope: REST API endpoints for doctor dashboard, queue, verification submission, and audit history.
  - Target: `CharaChhavani.WebApi/Controllers/VetController.cs`
- [x] **Task 4: Write Unit & Domain Tests**
  - Scope: Tested rejection reason enforcement, approval transition, and inspection point creation.
  - Target: `CharaChhavani.UnitTests/VetVerificationTests.cs`
- [x] **Task 5: Build & Test Verification**
  - Scope: Executed `dotnet test backend/CharaChhavani.sln` to achieve 100% test pass rate (20/20 passed).
  - Target: Solution-wide
