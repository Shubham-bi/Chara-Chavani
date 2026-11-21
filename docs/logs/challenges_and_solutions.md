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
