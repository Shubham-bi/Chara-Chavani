# State Government Audit, Compliance & Reporting Engine - Dev Plan & Task List

**Module:** State Government Audit, Compliance & Reporting Engine  
**Reference Understanding Doc:** [audit_reporting_engine_understanding.md](../understanding/audit_reporting_engine_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (Reporting Queries & DTOs)**:
   - Define audit DTOs (`AdmissionAuditReportDto`, `FodderReconciliationReportDto`, `ExpenseAuditReportDto`, `InspectionAuditReportDto`).
   - Implement MediatR CQRS Queries with EF Core projections and filter expressions:
     - `GetAdmissionAuditReportQuery` & Handler
     - `GetFodderReconciliationReportQuery` & Handler
     - `GetExpenseAuditReportQuery` & Handler
     - `GetInspectionAuditReportQuery` & Handler
   - Implement `CsvExportHelper` for streaming RFC 4180 CSV with UTF-8 BOM encoding.
2. **WebApi Layer (`AdminController.cs`)**:
   - Add report query endpoints:
     - `GET /api/v1/admin/reports/admissions`
     - `GET /api/v1/admin/reports/fodder-reconciliation`
     - `GET /api/v1/admin/reports/expenses`
     - `GET /api/v1/admin/reports/inspections`
     - `GET /api/v1/admin/reports/export`
3. **Shared Client SDK (`packages/api-client`)**:
   - Add `reports` API service with typed query parameters and CSV download helper.
4. **Web Admin Dashboard (`apps/web-admin`)**:
   - Add Reports navigation tab and dynamic audit table rendering in `AdminDashboardController.ts`.
5. **Testing & Verification**:
   - Add unit tests in `CharaChhavani.UnitTests` covering report queries and reconciliation math.
   - Run `dotnet test` and TypeScript compilation checks.
   - Document challenges and solutions in `docs/logs/challenges_and_solutions.md`.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Audit Report DTOs and CSV Helper**
  - Scope: `ReportDtos.cs`, `CsvExportHelper.cs`.
  - Target: `backend/src/CharaChhavani.Application/Admin/DTOs/`, `backend/src/CharaChhavani.Application/Common/Helpers/`
- [x] **Task 2: Implement Reporting CQRS Queries**
  - Scope: `GetAdmissionAuditReportQuery`, `GetFodderReconciliationReportQuery`, `GetExpenseAuditReportQuery`, `GetInspectionAuditReportQuery`.
  - Target: `backend/src/CharaChhavani.Application/Admin/Queries/Reports/`
- [x] **Task 3: Implement WebApi Reporting & Export Endpoints**
  - Scope: Endpoints in `AdminController.cs`.
  - Target: `backend/src/CharaChhavani.WebApi/Controllers/AdminController.cs`
- [x] **Task 4: Update Shared Client SDK (@chara-chhavani/api-client)**
  - Scope: Add `reports` service and TypeScript contracts.
  - Target: `packages/api-client/src/`
- [x] **Task 5: Update Web Admin Dashboard Reporting Views**
  - Scope: Add reporting UI in `apps/web-admin/src/`
  - Target: `apps/web-admin/src/controllers/AdminDashboardController.ts`
- [x] **Task 6: Implement Unit Tests & Verification**
  - Scope: Unit tests for report calculations and queries; execute `dotnet test` and `tsc`.
  - Target: `backend/tests/CharaChhavani.UnitTests/Admin/ReportsTests.cs`
- [x] **Task 7: Record Challenges, Solutions & Governance Sign-Off**
  - Scope: Update `docs/logs/challenges_and_solutions.md`, mark plan completed, commit and push to Git.
  - Target: `docs/logs/challenges_and_solutions.md`, `docs/plans/audit_reporting_engine_plan.md`
