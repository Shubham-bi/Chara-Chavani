# Animal Admission & Release Plan & Task List

**Module:** Animal Admission & Release at Chara Chhavani  
**Reference Understanding Doc:** [animal_admission_release_understanding.md](../understanding/animal_admission_release_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (CQRS Commands & Queries)**:
   * `SearchAnimalForAdmissionQuery`: Searches animal by code/tag/mobile, checks approval and admission status, and returns eligibility summary.
   * `AdmitAnimalCommand`: Validates camp capacity, validates device GPS point against camp's polygon geofence, generates unique `ADM-YYYYMMDD-XXXX` code, mutates animal/camp state, and saves admission record atomically.
   * `GetCampAdmissionsQuery`: Lists active or released admissions for a specific camp.
   * `ReleaseAnimalCommand`: Validates animal is actively admitted, updates admission status, clears animal camp assignment, and decrements camp active count.
2. **WebApi Layer**:
   * `AdmissionsController` (`/api/v1/admissions`) exposing search, admission, and release endpoints.
3. **Verification & Testing**:
   * Unit tests covering:
     * Rejecting admission if animal is not approved (`Pending` or `Rejected`).
     * Rejecting admission if device coordinates are outside the camp geofence polygon.
     * Rejecting admission if camp capacity is full.
     * Rejecting double admission across different camps.
     * Successful admission and release lifecycle updating `ActiveAnimalCount`.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Admission & Release DTOs**
  - Scope: `AnimalSearchDto`, `AdmitAnimalDto`, `AdmissionDetailsDto`, `ReleaseAnimalDto`.
  - Target: `CharaChhavani.Application/Admissions/DTOs/`
- [x] **Task 2: Implement CQRS Commands, Queries & Validators**
  - Scope: `SearchAnimalForAdmissionQuery`, `AdmitAnimalCommand`, `AdmitAnimalValidator`, `GetCampAdmissionsQuery`, `ReleaseAnimalCommand`, `ReleaseAnimalValidator`.
  - Target: `CharaChhavani.Application/Admissions/`
- [x] **Task 3: Implement AdmissionsController in WebApi**
  - Scope: REST API endpoints for search, geofenced admission, listing, and release.
  - Target: `CharaChhavani.WebApi/Controllers/AdmissionsController.cs`
- [x] **Task 4: Write Unit & Domain Tests**
  - Scope: Tested geofence polygon validation during admission, capacity bounds, status transitions, and release logic.
  - Target: `CharaChhavani.UnitTests/AnimalAdmissionTests.cs`
- [x] **Task 5: Build & Test Verification**
  - Scope: Executed `dotnet test backend/CharaChhavani.sln` to achieve 100% test pass rate (25/25 passed).
  - Target: Solution-wide
