# Farmer & Animal Registration Plan & Task List

**Module:** Farmer Management & Animal Registration  
**Reference Understanding Doc:** [farmer_animal_registration_understanding.md](../understanding/farmer_animal_registration_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (CQRS Commands & Queries)**:
   * `SendOtpCommand` & `VerifyOtpCommand`: Simulated OTP generation and validation for rapid development, returning farmer authentication info.
   * `RegisterOrUpdateFarmerCommand`: Creates/updates farmer profile.
   * `GetFarmerDashboardQuery`: Returns farmer profile with aggregated counts (`TotalAnimals`, `PendingVerification`, `Approved`, `Rejected`, `Admitted`).
   * `RegisterAnimalCommand`: Validates animal details (photo, type, breed, age), generates `ANM-YYYYMMDD-XXXX` ID, sets `Pending` status.
   * `GetFarmerAnimalsQuery`: Lists animals belonging to a farmer, filtered by `VerificationStatus` or `AnimalStatus`.
   * `GetAnimalDetailsQuery`: Fetches animal details, verification history, and admission status.
   * `ResubmitAnimalCommand`: Validates animal is in `Rejected` status, updates details, resets to `Pending`.
2. **WebApi Layer**:
   * `FarmersController` (`/api/v1/farmers`) for auth, profile, and dashboard.
   * `AnimalsController` (`/api/v1/animals`) for animal registration, retrieval, and resubmission.
3. **Verification & Testing**:
   * Unit and integration tests covering:
     * OTP verification and farmer profile upsert.
     * Animal registration code generation (`ANM-YYYYMMDD-XXXX`).
     * State transition to `Pending`.
     * Resubmission constraints (cannot resubmit an approved or admitted animal).

---

## Granular Atomic Task List

- [x] **Task 1: Implement Farmer & Animal DTOs**
  - Scope: `FarmerDto`, `FarmerDashboardDto`, `AnimalDto`, `RegisterAnimalDto`, `ResubmitAnimalDto`.
  - Target: `CharaChhavani.Application/Farmers/DTOs/` & `CharaChhavani.Application/Animals/DTOs/`
- [x] **Task 2: Implement Farmer CQRS Commands, Queries & Validators**
  - Scope: `SendOtpCommand`, `VerifyOtpCommand`, `RegisterOrUpdateFarmerCommand`, `GetFarmerDashboardQuery`.
  - Target: `CharaChhavani.Application/Farmers/`
- [x] **Task 3: Implement Animal CQRS Commands, Queries & Validators**
  - Scope: `RegisterAnimalCommand`, `GetFarmerAnimalsQuery`, `GetAnimalDetailsQuery`, `ResubmitAnimalCommand`.
  - Target: `CharaChhavani.Application/Animals/`
- [x] **Task 4: Implement FarmersController & AnimalsController in WebApi**
  - Scope: REST API endpoints adhering to standard `ApiResponse<T>`.
  - Target: `CharaChhavani.WebApi/Controllers/`
- [x] **Task 5: Write Unit & Domain Tests**
  - Scope: Tested unique ID generation, status transitions, resubmission rules, dashboard counts.
  - Target: `CharaChhavani.UnitTests/FarmerAnimalTests.cs`
- [x] **Task 6: Build & Test Verification**
  - Scope: Executed `dotnet test backend/CharaChhavani.sln` to achieve 100% test pass rate (15/15 passed).
  - Target: Solution-wide
