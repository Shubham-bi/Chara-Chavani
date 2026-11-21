# Master Reference Data & Database Seeder Plan & Task List

**Module:** Standardized Master Data Services & Database Seeder  
**Reference Understanding Doc:** [master_reference_data_understanding.md](../understanding/master_reference_data_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (Master Catalogs & DTOs)**:
   - Create `IMasterDataProvider` and implementation containing Maharashtra districts/talukas, animal breeds, fodder definitions, and expense categories.
   - Implement CQRS Queries:
     - `GetDistrictsQuery`
     - `GetTalukasQuery`
     - `GetBreedsQuery`
     - `GetFodderTypesQuery`
     - `GetExpenseCategoriesQuery`
   - Implement `SeedDatabaseCommand` + Handler.
2. **Infrastructure Layer (Database Seeder)**:
   - Create `DatabaseSeeder.cs` to insert baseline administrative data, sample active camp with geofence, sample operators, farmers, and animals into MySQL.
3. **WebApi Layer**:
   - `MasterDataController` (`/api/v1/master/...`) exposing read endpoints for mobile dropdowns and the seeding endpoint.
4. **Shared Client SDK (`packages/api-client`)**:
   - Add `master` namespace in `@chara-chhavani/api-client` with typed methods.
5. **Testing & Verification**:
   - Unit tests for master data lookup queries.
   - Execute database seeder against local MySQL `localhost:3306`.
   - Run `dotnet test` and `tsc --noEmit`.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Master Reference Data Models & Provider**
  - Scope: `MasterDataDtos.cs`, `MasterDataProvider.cs`.
  - Target: `backend/src/CharaChhavani.Application/MasterData/`
- [x] **Task 2: Implement CQRS Queries for Master Data**
  - Scope: Queries for districts, talukas, breeds, fodder types, and expense categories.
  - Target: `backend/src/CharaChhavani.Application/MasterData/Queries/`
- [x] **Task 3: Implement Database Seeder**
  - Scope: `DatabaseSeeder.cs`, `SeedDatabaseCommand.cs`.
  - Target: `backend/src/CharaChhavani.Infrastructure/Persistence/DatabaseSeeder.cs`, `backend/src/CharaChhavani.Application/MasterData/Commands/`
- [x] **Task 4: Implement MasterDataController in WebApi**
  - Scope: REST API endpoints under `/api/v1/master/`.
  - Target: `backend/src/CharaChhavani.WebApi/Controllers/MasterDataController.cs`
- [x] **Task 5: Update Shared Client SDK**
  - Scope: TypeScript models and `master` service in `@chara-chhavani/api-client`.
  - Target: `packages/api-client/src/`
- [x] **Task 6: Execute Tests & Verification**
  - Scope: Unit tests, execute seeder against local MySQL, run `dotnet test` and `tsc`.
  - Target: Solution-wide
