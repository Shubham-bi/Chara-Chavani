# MySQL Migration & Database Schema Plan & Task List

**Module:** MySQL 8.0 Relational & Spatial Database Schema  
**Reference Understanding Doc:** [mysql_migration_understanding.md](../understanding/mysql_migration_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. Updated `CharaChhavani.Infrastructure/DependencyInjection.cs` to explicitly configure `MySqlServerVersion(new Version(8, 0, 42))` to allow deterministic offline migration generation without requiring an active database connection.
2. Executed `dotnet dotnet-ef migrations add InitialCreate` targeting `CharaChhavani.Infrastructure` with startup project `CharaChhavani.WebApi`.
3. Generated the idempotent raw SQL deployment script `backend/scripts/init_schema.sql` using `dotnet dotnet-ef migrations script`.
4. Verified migration files and SQL script syntax for spatial columns (`polygon`, `point`, SRID 4326), precision types (`decimal(18,2)`), and unique indexes.

---

## Granular Atomic Task List

- [x] **Task 1: Explicitly Configure MySQL Server Version in Infrastructure**
  - Scope: Updated `DependencyInjection.cs` to use explicit `MySqlServerVersion(new Version(8, 0, 42))`.
  - Target: `CharaChhavani.Infrastructure/DependencyInjection.cs`
- [x] **Task 2: Generate Initial EF Core Migration**
  - Scope: Ran `dotnet dotnet-ef migrations add InitialCreate` to generate C# migration files.
  - Target: `CharaChhavani.Infrastructure/Migrations/`
- [x] **Task 3: Generate SQL Deployment Script**
  - Scope: Ran `dotnet dotnet-ef migrations script` to generate standalone `backend/scripts/init_schema.sql`.
  - Target: `backend/scripts/init_schema.sql`
- [x] **Task 4: Build & Test Verification**
  - Scope: Compiled solution and ran full test suite with 31/31 passed.
  - Target: Solution-wide
