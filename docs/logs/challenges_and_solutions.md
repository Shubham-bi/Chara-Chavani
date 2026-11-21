# Challenges & Solutions Log

This log documents technical challenges, trade-off evaluations, finalized solutions, and technical rationales ("What & Why") encountered during development.

---

## [2026-11-22] - Feature / Task: Core Foundation & .NET 8 Clean Architecture Setup

### 1. Challenge Faced
- **Context**: Scaffolding Clean Architecture backend projects using the installed .NET SDK.
- **Symptoms / Friction**: The host machine has .NET SDK `10.0.100-rc.2.25502.107` installed, which by default generated projects targeting preview `net10.0` and new `.slnx` solution format, causing template errors when passing `-f net8.0` directly to `dotnet new`.
- **Impact**: Without explicit pinning to .NET 8 LTS, dependencies (such as Pomelo.EntityFrameworkCore.MySql 8.0.2) and production deployment targets could face compatibility risks.

### 2. Solutions Evaluated
- **Option A**: Use default `net10.0` preview across all projects.
  - *Pros / Cons*: Works with newer CLI defaults, but `net10.0` is an unreleased preview runtime unsuitable for production stability and lacking official Pomelo EF Core 10 releases.
- **Option B (Selected)**: Configure `<TargetFramework>net8.0</TargetFramework>` across all `.csproj` files and generate standard `CharaChhavani.sln` alongside `CharaChhavani.slnx`.
  - *Pros / Cons*: Guarantees Long-Term Support (LTS) stability, 100% compatibility with Pomelo.EntityFrameworkCore.MySql 8.x and NetTopologySuite, cleanly compiled by the .NET 10 SDK compiler.

### 3. Finalized Solution ("What")
- Configured all 5 backend projects (`Domain`, `Application`, `Infrastructure`, `WebApi`, `UnitTests`) to target `net8.0`.
- Integrated `NetTopologySuite 2.5.0` for spatial polygon geofencing calculations.
- Integrated `Pomelo.EntityFrameworkCore.MySql 8.0.2` with spatial extension `Pomelo.EntityFrameworkCore.MySql.NetTopologySuite`.

### 4. Technical Rationale ("Why")
- Adheres strictly to the architectural standards in `ReferanceData/Development-Guidlines.md`.
- Provides maximum LTS reliability, native MySQL spatial index support, and fast in-memory spatial validations (`Polygon.Contains(Point)`).

### 5. Status
- Applied: Yes
- Verified: Yes (`dotnet test` passed 5/5 tests in 1s).

---

## [2026-11-22] - Feature / Task: Chhavani Camp Management & Polygon Geofence Invariants

### 1. Challenge Faced
- **Context**: Converting client-supplied polygon coordinates into GIS `Polygon` geometries.
- **Symptoms / Friction**: Mobile apps or web map drawing tools often send an array of vertices without closing the ring (i.e. Without repeating the first vertex at the end). NetTopologySuite throws `TopologyException` or fails to construct a `LinearRing` if the first point does not match the last point.
- **Impact**: API requests from mobile or web apps could randomly fail or crash when saving camp geofence boundaries.

### 2. Solutions Evaluated
- **Option A**: Require client applications to strictly submit $N+1$ points where point 1 equals point $N+1$.
  - *Pros / Cons*: Shifts burden to frontends; prone to client-side bugs or mismatch between map libraries.
- **Option B (Selected)**: Enforce a minimum of 3 unique vertices in `FluentValidation`, and automatically close the linear ring in the backend command handler if the first point does not equal the last point.
  - *Pros / Cons*: Robust backend safeguard that tolerates both open vertex lists and pre-closed rings without crashing.

### 3. Finalized Solution ("What")
- Implemented automatic ring closure:
  ```csharp
  if (coords.First() != coords.Last()) {
      coords.Add(coords.First());
  }
  var polygon = _geometryFactory.CreatePolygon(coords.ToArray());
  ```
- Added coordinate order normalization and spatial SRID 4326 mapping.

### 4. Technical Rationale ("Why")
- Adheres to Part 1, Section 1, Rule 4 of `Development-Guidlines.md`: *"Never assume that data received from a mobile application is valid."*
- Ensures reliable spatial point-in-polygon containment checks.

### 5. Status
- Applied: Yes
- Verified: Yes (`dotnet test` passed 9/9 tests in 1s).

---

## [2026-11-22] - Feature / Task: Farmer Mobile Auth & Idempotent Profile Management

### 1. Challenge Faced
- **Context**: Mobile OTP login and farmer registration in rural mobile settings.
- **Symptoms / Friction**: In rural workflows, farmers re-authenticating with their mobile number might trigger registration screens again, risking duplicate account records or database primary key / unique index collisions on `MobileNumber`.
- **Impact**: User frustration and potential data inconsistency between registered animals and farmer identity.

### 2. Solutions Evaluated
- **Option A**: Separate strict registration vs strict login endpoints that reject existing or non-existing mobile numbers.
  - *Pros / Cons*: More steps in UI; requires farmers to remember if they are registered or not.
- **Option B (Selected)**: Idempotent OTP authentication with provisional farmer provisioning and unified profile upsert command.
  - *Pros / Cons*: Seamless single-flow mobile experience: verifying OTP either logs in an existing farmer or auto-provisions a new account flagged `IsProfileCompleted = false` to prompt profile completion.

### 3. Finalized Solution ("What")
- Implemented `VerifyOtpCommandHandler` that looks up existing farmer by mobile; if absent, creates provisional entity.
- Profile completion handled by `RegisterOrUpdateFarmerCommand` updating fields without recreating identity.

### 4. Technical Rationale ("Why")
- Conforms to mobile best practices in `Development-Guidlines.md` and provides a frictionless UX for rural users.

### 5. Status
- Applied: Yes
- Verified: Yes (`dotnet test` passed 15/15 tests in 1s).

---

## [2026-11-22] - Feature / Task: Veterinary Verification GPS Stamping vs Camp Geofence Separation

### 1. Challenge Faced
- **Context**: Stamping GPS location during physical veterinary inspection visits at farmer locations.
- **Symptoms / Friction**: Conflating vet visit GPS checks with camp geofences would incorrectly cause rejections if a farmer's farm is outside a camp boundary.
- **Impact**: Violation of BRD recommendation: *"Keep these two location validations separate: Veterinary verification GPS should correspond to farmer's location; Animal admission GPS must be within camp geofence."*

### 2. Solutions Evaluated
- **Option A**: Attempt to validate inspection coordinates against nearby camps.
  - *Pros / Cons*: Inapplicable because farmers reside throughout rural villages, while camps are distinct physical locations.
- **Option B (Selected)**: Record `InspectionLocation` as an auditable `Point` (SRID 4326) capturing the physical visit location at the farm, and enforce strictly that only the later `AnimalAdmission` workflow validates device GPS against camp geofence polygons.

### 3. Finalized Solution ("What")
- `SubmitVerificationCommand` captures and stores `InspectionLocation` Point with doctor ID and audit timestamp.
- Enforced mandatory `Remarks` when result is `Rejected`, and prevented double approval.

### 4. Technical Rationale ("Why")
- Directly complies with BRD Workflow 1 (Important recommendation) and Section 2 of FSD.

### 5. Status
- Applied: Yes
- Verified: Yes (`dotnet test` passed 20/20 tests in 1s).

---

## [2026-11-22] - Feature / Task: Animal Admission Geofence Enforcement & Concurrency Safety

### 1. Challenge Faced
- **Context**: Enforcing that animals can only be admitted when physically inside the camp boundaries, while simultaneously updating camp capacity and preventing race conditions.
- **Symptoms / Friction**: Potential race conditions where two operators admit animals concurrently when remaining capacity is 1, causing overcapacity. Additionally, spoofed or outside GPS coordinates could bypass physical camp presence checks.
- **Impact**: Financial fraud or over-allocation of government fodder subsidies.

### 2. Solutions Evaluated
- **Option A**: Client-side only geofence check in React Native mobile app.
  - *Pros / Cons*: Vulnerable to bypass, modified APKs, or mock GPS locations.
- **Option B (Selected)**: Strict server-side NetTopologySuite point-in-polygon validation (`chhavani.IsPointInsideGeofence(devicePoint)`) coupled with atomic database updates checking capacity within `AdmitAnimalCommandHandler`.

### 3. Finalized Solution ("What")
- Evaluated device coordinates against camp's closed polygon geometry on the server.
- Atomically checked capacity, updated `animal.CurrentStatus = Admitted`, `chhavani.ActiveAnimalCount += 1`, and stored admission photo and coordinates.

### 4. Technical Rationale ("Why")
- Complies with BRD Rules 2, 3, 4, and Part 3 Section 18 of `Development-Guidlines.md` regarding concurrency and transaction safety.

### 5. Status
- Applied: Yes
- Verified: Yes (`dotnet test` passed 25/25 tests in 1s).

---

## [2026-11-22] - Feature / Task: Dual-Source Stock Isolation & Non-Negative Inventory Invariants

### 1. Challenge Faced
- **Context**: Tracking two distinct sources of fodder inventory (`Store` vs `In Farm`) while guaranteeing non-negative balances across daily group feedings.
- **Symptoms / Friction**: Concurrent feedings or stock adjustments could deduct inventory below zero or incorrectly blend farm-contributed fodder with commercially purchased store fodder.
- **Impact**: Inaccurate government audit records and financial subsidy discrepancies.

### 2. Solutions Evaluated
- **Option A**: Combine all stock into a single camp total and record source only in purchase logs.
  - *Pros / Cons*: Violates BRD Rule: *"Both contribute to stock, but the source/location must remain identifiable."*
- **Option B (Selected)**: Composite unique key `(ChhavaniId, Source, FodderType)` with server-side non-negative invariant validation in `RecordFeedingCommandHandler` and `RecordStockAdjustmentCommandHandler`.

### 3. Finalized Solution ("What")
- Keyed inventory by camp, source, and fodder type using exact `decimal(18, 2)` precision.
- Enforced $\text{AvailableQuantity} \ge \text{IssuedQuantity}$ before deducting stock, and mandated a text explanation for all adjustments.

### 4. Technical Rationale ("Why")
- Complies with BRD Rules 6, 7, 8, 9, and Workflows 3, 4, and 5.

### 5. Status
- Applied: Yes
- Verified: Yes (`dotnet test` passed 31/31 tests in 1s).

---

## [2026-11-22] - Feature / Task: MySQL 8.0 EF Core Migration & Offline SQL Script Generation

### 1. Challenge Faced
- **Context**: Generating reproducible EF Core database migrations and standalone SQL scripts without hard dependencies on an active live database during CI/CD.
- **Symptoms / Friction**: Using `ServerVersion.AutoDetect` requires an active socket connection to MySQL during migration generation. If the database does not exist yet or in CI pipelines, `dotnet-ef` commands fail.
- **Impact**: Inability to generate clean database deployment scripts in offline or automated environments.

### 2. Solutions Evaluated
- **Option A**: Require developers/CI to always stand up and seed a MySQL container before generating migrations.
  - *Pros / Cons*: Adds unnecessary pipeline overhead and fragility.
- **Option B (Selected)**: Explicitly pin `new MySqlServerVersion(new Version(8, 0, 42))` in `DependencyInjection.cs`, install `dotnet-ef 8.0.11` via local tool manifest, and generate an idempotent SQL script `backend/scripts/init_schema.sql`.
  - *Pros / Cons*: 100% deterministic, enables offline schema generation, and produces clean DDL for DBAs.

### 3. Finalized Solution ("What")
- Pinned MySQL 8.0.42 server version in EF Core options.
- Generated `InitialCreate` migration and idempotent `backend/scripts/init_schema.sql` covering spatial polygon/point columns, decimal precisions, and indexes.

### 4. Technical Rationale ("Why")
- Complies with Part 1, Section 3 ("Database changes must be managed through version-controlled migrations") and Part 4 of `Development-Guidlines.md`.

### 5. Status
- Applied: Yes
- Verified: Yes (`init_schema.sql` generated with 606 lines of idempotent DDL; full test suite passed).
