# DevOps Containerization & End-to-End Smoke Testing - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Architect & DevOps Engineer  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Problem Statement
To transition the Chara Chhavani Management System from a local development environment to production-grade deployment and rapid evaluation:
1. **Zero-Friction Local Deployment:** Developers, state IT personnel, and QA engineers must be able to spin up the entire multi-tier stack (MySQL 8.0 GIS, .NET 8 WebAPI, Web Admin) with a single command without manual prerequisite setup.
2. **Reproducible Container Environment:** Multi-stage Docker builds ensuring minimal image sizes, non-root user execution, and deterministic compilation.
3. **End-to-End Verification Pipeline:** An automated smoke-test script exercising the entire 11-step lifecycle (Auth -> Camp Geofence -> Farmer/Animal -> Vet Visit -> Geofence Admission -> Fodder Stock & Feeding -> Officer Audit -> Admin KPIs).
4. **Developer Tooling:** Standard `.http` file for Visual Studio / VS Code REST Client enabling rapid API testing.

---

## 2. Technical Architecture & Constraints

### 2.1 Multi-Stage Dockerfile for .NET 8 WebAPI (`backend/Dockerfile`)
- Stage 1 (`build`): Uses `mcr.microsoft.com/dotnet/sdk:8.0` to restore dependencies, compile solution, and publish release binaries.
- Stage 2 (`runtime`): Uses `mcr.microsoft.com/dotnet/aspnet:8.0` Alpine/Debian slim base for high security, minimal attack surface, and small image size.
- Exposes port 5000 (HTTP) and 5001 (HTTPS).
- Configures environment variables to read from container environment.

### 2.2 Docker Compose (`docker-compose.yml`)
- Service 1: `mysql`
  - Image: `mysql:8.0`
  - Ports: `3306:3306`
  - Environment: `MYSQL_ROOT_PASSWORD=NewPassword@123`, `MYSQL_DATABASE=chara_chhavani_db`
  - Volume: `mysql_data` for persistent storage
  - Healthcheck: `mysqladmin ping`
- Service 2: `backend`
  - Builds from `backend/Dockerfile`
  - Ports: `5000:5000`
  - Depends on `mysql` with condition `service_healthy`
  - Environment: connection string pointing to `Server=mysql;Port=3306;...`
- Service 3: `web-admin`
  - Nginx serving the compiled web dashboard on port `3000`.

### 2.3 Interactive HTTP Request Collection (`backend/CharaChhavani.http`)
- Standard RFC-compliant HTTP collection covering all API routes with sample JSON payloads and environment variables (`@baseUrl = http://localhost:5000`).

### 2.4 End-to-End Automated Smoke Test Script (`scripts/e2e_smoke_test.ps1`)
- Automated PowerShell script that executes against the live WebAPI:
  1. Health check `/swagger/v1/swagger.json`.
  2. Mobile OTP verification `/api/v1/auth/mobile/verify-otp`.
  3. Master Data lookup `/api/v1/master/districts`.
  4. Camp Geofence validation `/api/v1/camps/{id}/validate-point`.
  5. Admin Dashboard KPIs `/api/v1/admin/dashboard`.

---

## 3. Verification Criteria
- `docker-compose.yml` and `Dockerfile` pass linting and syntax verification.
- `backend/CharaChhavani.http` contains valid, actionable request definitions for all 8 controllers.
- Automated tests pass with 100% green status.
