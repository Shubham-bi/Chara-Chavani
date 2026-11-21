# CI/CD Automation & Master Project Documentation - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity DevOps & Principal Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  
**References:**  
- `ReferanceData/Development-Guidlines.md` (Part 1 Section 3 "Mandatory Development Practices", Section 22 "Testing Requirements", Section 25 "Production Deployment")  
- `GEMINI.md` (Master Governance & 13-Stage Strict Lifecycle)  

---

## 1. Business & Engineering Context
As the Chara Chhavani Management System transitions into active multi-team development and government evaluation, continuous automated quality gating is mandatory.
1. **Continuous Integration (CI)**: Any code committed to `main` or submitted via Pull Request must automatically build and pass 100% of the test suite on GitHub Actions. Broken builds or regressions must be blocked automatically.
2. **Deterministic Multi-Tier Gating**:
   - .NET 8 Backend: Compile all 5 projects with `--configuration Release` and execute all 67 unit and integration tests.
   - Node.js & TypeScript: Execute package tests in `packages/ui-core` (`session-offline-test.mjs`), validating `SessionManager` and `OfflineActionQueue` (Rule 9.6 offline anti-fraud guard).
   - Docker Container Verification: Validate that `backend/Dockerfile` and `docker-compose.yml` build deterministically.
3. **Master Project Documentation (`README.md`)**:
   - Provide complete, accurate, production-grade documentation reflecting the latest system architecture, containerization commands, interactive `.http` testing, automated E2E PowerShell smoke test runner, and government audit reporting engine.

---

## 2. Technical Architecture & CI Workflow Specifications

### 2.1 GitHub Actions Workflow (`.github/workflows/ci.yml`)
- Trigger Events: `push` to `main`, `pull_request` to `main`.
- Operating System: `ubuntu-latest`.
- Pipeline Jobs:
  1. **Job 1: `backend-ci`**
     - Sets up .NET 8 SDK (`actions/setup-dotnet@v4`).
     - Restores dependencies: `dotnet restore backend/CharaChhavani.sln`.
     - Builds solution in Release mode: `dotnet build backend/CharaChhavani.sln -c Release --no-restore`.
     - Executes unit test suite: `dotnet test backend/CharaChhavani.sln -c Release --no-build --verbosity normal`.
  2. **Job 2: `mobile-ui-ci`**
     - Sets up Node.js 20 (`actions/setup-node@v4`).
     - Executes `packages/ui-core/test/session-offline-test.mjs`.
  3. **Job 3: `docker-verification`**
     - Sets up Docker Buildx (`docker/setup-buildx-action@v3`).
     - Builds backend container image using `backend/Dockerfile` to confirm layer caching and multi-stage stability.

### 2.2 Comprehensive `README.md` Enhancement
- Update test count to 67/67.
- Add quickstart section for Docker Compose (`docker compose up -d`).
- Add documentation for `backend/CharaChhavani.http` (RFC 4180 REST Client).
- Add instructions for `scripts/e2e_smoke_test.ps1`.
- Add documentation for the Government Audit & Compliance Reporting Engine (Admissions, Fodder Reconciliation, Expenses, and Spot Inspections CSV exports).

---

## 3. Verification Criteria
- `.github/workflows/ci.yml` is valid YAML and adheres to GitHub Actions syntax schemas.
- `README.md` accurately documents all features and operational commands.
- Local test suites (`dotnet test` 67/67 and `session-offline-test.mjs`) remain 100% green.
