# DevOps Containerization & End-to-End Smoke Testing Plan & Task List

**Module:** DevOps Containerization, Developer Tooling & E2E Smoke Testing  
**Reference Understanding Doc:** [devops_containerization_e2e_understanding.md](../understanding/devops_containerization_e2e_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Containerization Layer (`backend/Dockerfile`, `.dockerignore`, `docker-compose.yml`)**:
   - Multi-stage build for ASP.NET Core 8.0 WebAPI:
     - Build stage: `mcr.microsoft.com/dotnet/sdk:8.0` compiles, restores, tests, and publishes binaries in Release mode.
     - Runtime stage: `mcr.microsoft.com/dotnet/aspnet:8.0` slim image running as unprivileged user `app` listening on port 5000.
   - Root `docker-compose.yml` orchestrating:
     - `mysql`: MySQL 8.0 with spatial GIS capabilities, persistent volume `mysql_data`, and healthcheck.
     - `backend`: WebAPI service with health checks, connecting to MySQL via Docker network.
     - `web-admin`: Nginx serving the compiled administrative web dashboard.
2. **Developer Tooling Layer (`backend/CharaChhavani.http`)**:
   - Visual Studio / VS Code REST Client RFC-compliant `.http` specification.
   - Comprehensive request coverage for all 12 controllers with sample JSON payloads and response contracts.
3. **Automated E2E Smoke Test Suite (`scripts/e2e_smoke_test.ps1`)**:
   - Automated test runner that validates end-to-end API health, master data catalog, spatial geofence validation, and dashboard metrics.
4. **Verification & Sign-off**:
   - Run compilation and test suite (`dotnet test`).
   - Run TypeScript validation (`tsc --noEmit`).
   - Validate Dockerfile and Compose configurations.
   - Record challenges and solutions in `docs/logs/challenges_and_solutions.md`.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Backend Multi-Stage Dockerfile & .dockerignore**
  - Scope: `backend/Dockerfile`, `backend/.dockerignore`.
  - Target: `backend/Dockerfile`, `backend/.dockerignore`
- [x] **Task 2: Implement Root Docker Compose Specification**
  - Scope: `docker-compose.yml` with MySQL 8.0, WebAPI backend, web-admin, and volume/network definitions.
  - Target: `docker-compose.yml`
- [x] **Task 3: Implement Interactive HTTP Request Collection**
  - Scope: `backend/CharaChhavani.http` with ready-to-run requests for all API controllers.
  - Target: `backend/CharaChhavani.http`
- [x] **Task 4: Implement Automated PowerShell E2E Smoke Test Script**
  - Scope: `scripts/e2e_smoke_test.ps1` with automated assertions.
  - Target: `scripts/e2e_smoke_test.ps1`
- [x] **Task 5: Execute Comprehensive Verification Suite**
  - Scope: Run `dotnet test`, typechecks across all 4 mobile apps and web-admin, verify Compose syntax.
  - Target: `backend/CharaChhavani.sln`, `apps/*`, `packages/*`
- [x] **Task 6: Record Challenges, Solutions & Governance Sign-Off**
  - Scope: Document Docker/DevOps decisions in `docs/logs/challenges_and_solutions.md`, mark plan completed, commit and push to Git.
  - Target: `docs/logs/challenges_and_solutions.md`, `docs/plans/devops_containerization_e2e_plan.md`
