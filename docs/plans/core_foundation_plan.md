# Core Foundation Development Plan & Task List

**Module:** Core System Foundation (.NET 8 Clean Architecture + MySQL Spatial)  
**Reference Understanding Doc:** [core_foundation_understanding.md](../understanding/core_foundation_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. Initialize a Clean Architecture .NET 8 solution with 4 decoupled projects:
   * `CharaChhavani.Domain` (Zero external dependencies except NetTopologySuite core).
   * `CharaChhavani.Application` (MediatR, FluentValidation, AutoMapper/Manual mappers).
   * `CharaChhavani.Infrastructure` (Pomelo.EntityFrameworkCore.MySql with NetTopologySuite plugin).
   * `CharaChhavani.WebApi` (ASP.NET Core controllers, Swagger OpenAPI, Global Error Middleware).
2. Create foundational entities: `Chhavani`, `Farmer`, `Animal`, `VetVerification`, `AnimalAdmission`, `FodderStock`, `FodderPurchase`, `FeedingEntry`, `StockAdjustment`, `Expense`.
3. Configure `ApplicationDbContext` with MySQL Spatial Polygon and Point mappings with SRID 4326.
4. Implement standard API response wrapper (`ApiResponse<T>`) and global exception handling middleware.
5. Create health check and spatial verification integration test.

---

## Granular Atomic Task List

- [x] **Task 1: Scaffold .NET 8 Clean Architecture Solution**
  - Scope: Created `CharaChhavani.sln` and 5 projects (`Domain`, `Application`, `Infrastructure`, `WebApi`, `UnitTests`).
  - Target: `backend/`
- [x] **Task 2: Configure Project Dependencies & NuGet Packages**
  - Scope: Added `Pomelo.EntityFrameworkCore.MySql`, `Microsoft.EntityFrameworkCore.Design`, `NetTopologySuite`, `MediatR`, `FluentValidation`, `FluentAssertions`.
  - Target: `.csproj` files
- [x] **Task 3: Implement Domain Entities & Enums**
  - Scope: Created `BaseEntity`, `AuditableEntity`, enums, and domain models with spatial geometries (`Polygon`, `Point`).
  - Target: `CharaChhavani.Domain/`
- [x] **Task 4: Implement Application Layer Contracts & Response Wrappers**
  - Scope: Created `ApiResponse<T>`, `ApiError`, `IApplicationDbContext`, custom exceptions (`BusinessException`, `NotFoundException`, `CustomValidationException`).
  - Target: `CharaChhavani.Application/`
- [x] **Task 5: Implement Infrastructure Layer & EF Core DbContext**
  - Scope: Configured entity mappings, MySQL spatial types (SRID 4326), `ApplicationDbContext`.
  - Target: `CharaChhavani.Infrastructure/`
- [x] **Task 6: Implement WebApi Configuration & Middleware**
  - Scope: Global exception handler middleware, Swagger OpenAPI, Dependency Injection wiring, Geofence verification endpoint.
  - Target: `CharaChhavani.WebApi/`
- [x] **Task 7: Build & Test Verification**
  - Scope: Compiled solution (`dotnet build`), executed tests (`dotnet test` 5/5 passed).
  - Target: Solution-wide
