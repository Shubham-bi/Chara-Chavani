# Local MySQL .env Configuration & Persistence Verification Plan

**Module:** Local MySQL Environment Configuration & Data Persistence Verification  
**Reference Understanding Doc:** [local_mysql_env_persistence_understanding.md](../understanding/local_mysql_env_persistence_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Configure `backend/.env`**:
   - Ensure `USERNAME` and `PASSWORD` are set with quotes handled properly.
2. **Implement `.env` Loader in .NET Backend**:
   - Create `EnvLoader.cs` in `backend/src/CharaChhavani.Infrastructure/` to parse `backend/.env` (or project root `.env`).
   - Wire up `Program.cs` and `DependencyInjection.cs` to resolve MySQL connection string dynamically with fallback:
     - Read `USERNAME` (or `DB_USER`) and `PASSWORD` (or `DB_PASSWORD`) from environment.
     - Replace placeholders `{USERNAME}` and `{PASSWORD}` or build `MySqlConnectionStringBuilder`.
3. **Initialize MySQL Database**:
   - Create `chara_chhavani_db` database if not exists in local MySQL.
   - Run EF Core migrations (`dotnet ef database update`) or apply `init_schema.sql` via `mysql.exe`.
4. **Data Persistence & Retrieval Verification**:
   - Create an end-to-end integration verification test or script that:
     1. Creates a `Chhavani` record with a NetTopologySuite geofence `Polygon`.
     2. Inserts a `Farmer` and an `Animal`.
     3. Inserts a `CampInspection` with GPS `Point`.
     4. Queries them back from MySQL and asserts full field fidelity.
5. **Stage 13 Sign-off & Git Commit**.

---

## Granular Atomic Task List

- [x] **Task 1: Verify and Format `backend/.env`**
  - Scope: Ensure `USERNAME` and `PASSWORD` are preserved and accessible.
  - Target: `backend/.env`
- [x] **Task 2: Implement Environment Variable Loader in Backend**
  - Scope: Parse `.env` file into runtime process environment in `Program.cs` and `DependencyInjection.cs`.
  - Target: `backend/src/CharaChhavani.Infrastructure/Common/EnvLoader.cs`, `backend/src/CharaChhavani.WebApi/Program.cs`
- [x] **Task 3: Create Database and Apply Schema Migrations**
  - Scope: Create database `chara_chhavani_db` and apply migrations to MySQL.
  - Target: Local MySQL 8.0 (`localhost:3306`)
- [x] **Task 4: Implement Integration Verification for Data Storage and Retrieval**
  - Scope: Programmatic script/test to insert and query data in live MySQL.
  - Target: `backend/scripts/verify_mysql_persistence.cs` or test runner
- [x] **Task 5: Execute Verification & Sign-off**
  - Scope: Run end-to-end test against MySQL and document results.
  - Target: Solution-wide
