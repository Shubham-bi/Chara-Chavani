# Code Review Checklist & Quality Gates

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Usage:** Mandatory for all Pull Requests merging into `develop` or `main`  
**Enforced By:** Lead Solution Architect & QA Automation SDETs  

---

## 1. Quick Review Gate Matrix

```
       [ 1. Architecture Check ]
                   │
                   ▼
       [ 2. Domain & Invariant Check ]
                   │
                   ▼
       [ 3. Security & OWASP Check ]
                   │
                   ▼
       [ 4. Performance & Spatial Check ]
                   │
                   ▼
       [ 5. Automated Verification Check ]
                   │
                   ▼
       [ Sign-Off & Squash Merge ]
```

---

## 2. Granular Review Checklist

### 2.1 Architecture & Layering Integrity
- [ ] **Clean Architecture Compliance:** Domain entities contain zero dependencies on EF Core, ASP.NET Core, or third-party web assemblies.
- [ ] **CQRS Separation:** All write operations are implemented as MediatR `IRequest<Result<T>>` commands. Queries do not mutate database state.
- [ ] **Controller Thinness:** Controllers contain zero direct business logic or raw SQL queries; each action delegates to `_mediator.Send()` and returns `HandleResult(result)`.
- [ ] **Standard Response Envelope:** All endpoints wrap responses in `{ success, message, data, errors, traceId }`.

### 2.2 Domain Invariants & Statutory Rules
- [ ] **Rule 9.6 Anti-Fraud Enclosure:** Animal Admission and Release commands verify the client is online and that location is inside the camp polygon. Mobile apps reject offline admissions.
- [ ] **Metric Normalization:** All fodder calculations adhere strictly to $1\text{ Quintal} = 100\text{ Kg}$. No mixed-unit calculations exist.
- [ ] **Excel CSV Compatibility:** All CSV export endpoints (`/api/v1/export/*`) prepend the UTF-8 Byte Order Mark (`\uFEFF`) to prevent Devanagari character corruption in MS Excel.
- [ ] **Devanagari Typography:** All React Native text elements use `@chara-chhavani/ui-core` components with $\text{lineHeight} \ge 1.35 \times \text{fontSize}$.

### 2.3 Security & Data Protection
- [ ] **SQL Injection Prevention:** No raw concatenated SQL queries. All database queries use EF Core parameterized queries or LINQ expressions.
- [ ] **Authorization Attributes:** All non-public endpoints are decorated with explicit `[Authorize(Roles = "...")]` attributes.
- [ ] **Data Sanitization:** Input models validate strings and reject potential XSS payloads; passwords hashed using BCrypt.
- [ ] **No Sensitive Logs:** Passwords, Aadhaar hashes, and JWT tokens are masked in application logs and trace exceptions.

### 2.4 Database & Spatial Performance
- [ ] **NetTopologySuite SRID:** All GIS geometry points and polygons explicitly define SRID 4326.
- [ ] **No N+1 Queries:** Database queries use `.Include()` or projection `.Select()` to avoid N+1 SELECT execution cycles.
- [ ] **AsNoTracking:** Read queries explicitly use `.AsNoTracking()` to reduce memory allocation in EF Core change tracking.
- [ ] **Cancellation Tokens:** All asynchronous database and HTTP calls accept and propagate `CancellationToken ct`.

### 2.5 Testing & Verification
- [ ] **Unit Tests:** New business logic covered by unit tests in `CharaChhavani.Application.UnitTests`.
- [ ] **Integration Tests:** New endpoints covered by integration tests in `CharaChhavani.WebApi.IntegrationTests`.
- [ ] **Regression Verification:** Full test suite passes: `dotnet test -c Release` (67/67 tests passing).
- [ ] **Smoke Test Verification:** 19 E2E smoke tests in `scripts/e2e_smoke_test.ps1` execute cleanly against `http://localhost:5000`.
