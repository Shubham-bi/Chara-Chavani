# Coding Standards & Engineering Guidelines

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Languages:** C# 12 (.NET 8), TypeScript 5.x, SQL (MySQL 8.0)  
**Enforcement:** Automated Roslyn Analyzers, ESLint, Prettier, CI Build Gates  

---

## 1. C# & .NET 8 Development Standards

### 1.1 Language Features & Syntax
* **Nullable Reference Types:** Enable `<Nullable>enable</Nullable>` across all `.csproj` files. Zero compiler nullability warnings permitted.
* **File-Scoped Namespaces:** Always use file-scoped namespaces to reduce indentation:
  ```csharp
  namespace CharaChhavani.Application.Camps.Commands;
  ```
* **Primary Constructors & Records:** Use records for DTOs and command messages:
  ```csharp
  public record AdmitAnimalCommand(int CampId, string TagNumber, double Latitude, double Longitude) : IRequest<Result<int>>;
  ```
* **Pattern Matching:** Prefer pattern matching over explicit type casting:
  ```csharp
  if (shape is Polygon polygon && polygon.Contains(point)) { ... }
  ```

### 1.2 Clean Architecture Boundaries
* **Domain Layer:** Zero references to EF Core, ASP.NET Core, or MediatR. Entities must encapsulate business validation and invariants.
* **Application Layer:** Contains only interfaces (`IApplicationDbContext`, `IGeofenceService`), DTOs, MediatR handlers, and FluentValidation validators.
* **Controllers:** Controllers must remain ultra-thin (maximum 25 lines per action). Every action must delegate directly to `IMediator.Send(...)` and wrap response via `HandleResult(result)`.

### 1.3 Asynchronous Programming & Cancellation Tokens
* Every asynchronous method must accept a `CancellationToken ct` and propagate it through EF Core and I/O calls:
  ```csharp
  public async Task<Result<int>> Handle(AdmitAnimalCommand cmd, CancellationToken ct)
  {
      var exists = await _context.Animals.AnyAsync(a => a.TagNumber == cmd.TagNumber, ct);
      ...
  }
  ```

---

## 2. TypeScript & React Native Standards

### 2.1 Strict Type Safety
* `tsconfig.json` must enforce `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
* Never use `any`. Use `unknown` with type guards or define explicit interfaces:
  ```typescript
  // Bad:
  const handleData = (payload: any) => { ... };

  // Good:
  interface AnimalPayload {
    tagNumber: string;
    campId: number;
    weightKg: number;
  }
  const handleData = (payload: AnimalPayload): void => { ... };
  ```

### 2.2 Component & Hook Guidelines
* Functional components only. Class components are strictly prohibited.
* Memoize expensive callbacks with `useCallback` and computed metrics with `useMemo`.
* Typography rule: Always render text via `@chara-chhavani/ui-core`'s `ResponsiveText` to ensure $\text{lineHeight} \ge 1.35 \times \text{fontSize}$ for Marathi Devanagari text.

---

## 3. SQL & Database Conventions

* **Table Names:** Pluralized PascalCase (e.g. `Chhavanis`, `AnimalAdmissions`, `Farmers`).
* **Column Names:** PascalCase matching C# domain entity properties.
* **Financial & Metric Precision:** Never use `FLOAT` or `DOUBLE` for monetary or physical ledger values. Always use `DECIMAL(12, 2)` or `DECIMAL(10, 2)`.
* **Spatial Data:** Always specify SRID 4326 for GIS polygons and points (`POLYGON SRID 4326`).

---

## 4. Git Commit Message Conventions

Conventional Commits standard is enforced via pre-commit hooks:
$$\text{<type>}(\text{<scope>}): \text{<description>}$$

* **Valid Types:**
  * `feat`: A new user-facing feature or API endpoint.
  * `fix`: A bug fix or regression repair.
  * `docs`: Documentation updates only.
  * `refactor`: Code changes that neither fix a bug nor add a feature.
  * `test`: Adding or correcting tests.
  * `chore`: Build scripts, dependencies, or configuration changes.
* **Example:**
  ```bash
  feat(admissions): enforce Rule 9.6 real-time online validation on cattle entry
  fix(export): prepend UTF-8 BOM to feeding CSV stream for Excel compatibility
  ```
