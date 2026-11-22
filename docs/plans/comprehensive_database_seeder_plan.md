# Comprehensive Database Seeder - Dev Plan & Task List

## 1. High-Level Architectural Approach
1. **Extend DTO Contracts**:
   - Update `SeedResultDto` in `backend/src/CharaChhavani.Application/MasterData/DTOs/MasterDataDtos.cs` to include additional counts (`AdmissionsCreated`, `ExpensesCreated`, `InspectionsCreated`, `PurchasesCreated`, `FeedingEntriesCreated`) with default values of `0` to maintain backwards compatibility.
2. **Implement Idempotent Comprehensive Seeding**:
   - In `backend/src/CharaChhavani.Infrastructure/Persistence/DatabaseSeeder.cs`, refactor `SeedAsync`:
     - Camp Seeding: Lookup camps by `CampCode`. If missing, insert with polygon boundary, centroid location, operator, and initial fodder stocks. If already existing, retrieve existing entity for relational linking.
     - Farmer Seeding: Lookup farmers by `MobileNumber`. If missing, insert.
     - Animal Seeding: Lookup animals by `AnimalCode`. If missing, insert with breed, gender, age, and link to farmer.
     - Vet Verification Seeding: For verified animals without verification records, insert `VetVerification` with doctor ID, approved status, and GPS location.
     - Animal Admission Seeding: For animals marked for admission without existing admissions, insert `AnimalAdmission` with operator ID, admission location inside camp polygon, and update camp `ActiveAnimalCount` and animal `CurrentStatus = AnimalStatus.Admitted` and `CurrentChhavaniId`.
     - Fodder Purchase & Feeding Seeding: Check existing purchases and feeding entries for the camps; if count < 4, insert representative purchases and feeding entries.
     - Expense Seeding: Check existing expenses for the camps; if count < 4, insert itemized expenses across Labour, Water, Electricity, Transportation, and Medical.
     - Camp Inspection Seeding: Check existing inspections for the camps; if count < 2, insert officer inspections with physical vs system headcount and hygiene grades.
3. **Populate Playwright Seed Test Spec**:
   - In `tests/e2e-web/seed.spec.ts`, implement comprehensive test using `ApiClientHelper` and `AdminDashboardPage`:
     - Call `POST /api/v1/master/seed` and assert HTTP 200 with positive or idempotent result.
     - Navigate to Admin Dashboard (`http://localhost:3000`).
     - Verify KPI cards:
       - Total Registered Camps >= 4
       - Total Active Camps >= 4
       - Total Admitted Animals >= 5
       - Capacity Utilization > 0%
     - Verify Reports tab loads:
       - Admissions report has entries.
       - Fodder reconciliation report has entries.
       - Expenses report has entries.
       - Inspections report has entries.
4. **Run Comprehensive Verification Suite**:
   - Unit tests (`dotnet test`).
   - Playwright E2E suite (`npx playwright test seed.spec.ts`, `data-driven`, etc.).
   - PowerShell smoke test suite.
   - Linting & typechecks.

---

## 2. Granular Task Checklist

- [x] Task 1: Update `SeedResultDto` with comprehensive entity counters (`backend/src/CharaChhavani.Application/MasterData/DTOs/MasterDataDtos.cs`).
- [x] Task 2: Implement multi-district camps, farmers, animals, vet verifications, admissions, fodder purchases, feeding logs, expenses, and inspections in `DatabaseSeeder.cs` (`backend/src/CharaChhavani.Infrastructure/Persistence/DatabaseSeeder.cs`).
- [x] Task 3: Implement comprehensive verification in `tests/e2e-web/seed.spec.ts`.
- [x] Task 4: Execute `dotnet build` and `dotnet test` across backend test projects (67/67 passing).
- [x] Task 5: Execute Playwright `seed.spec.ts` test and verify all data-driven specs pass (44/44 desktop, 44/44 mobile).
- [x] Task 6: Record challenges, architectural decisions, and verification logs (`challenges_and_solutions.md` & `rca_capa_log.md`).
- [x] Task 7: Git commit and push to remote.
