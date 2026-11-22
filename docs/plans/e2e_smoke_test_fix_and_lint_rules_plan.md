# Dev Plan & Task Checklist: E2E Smoke Test Fix & Granular Lint Rules

**Module / Task:** Fix `scripts/e2e_smoke_test.ps1` and Establish Granular Lint Rules Across All Mobile Apps, Web Admin Dashboard & Backend  
**Document Version:** 1.0.0  
**Status:** Approved  
**Lifecycle Stage:** Stage 3 (Plan & Task List)  
**Author:** Lead Enterprise Solutions Architect & QA SDET  

---

## 1. High-Level Architectural Approach

1. **`scripts/e2e_smoke_test.ps1` Hardening:**
   * Rewrite `Invoke-Api` with safe splatting, `-UseBasicParsing`, body detection, and detailed HTTP response stream extraction.
   * Add defensive null-safety across all 19 assertion tests to ensure no unhandled property access exceptions occur when responses are null or malformed.
   * Save script with standard UTF-8 without BOM and CRLF line endings.
2. **Granular Per-App Linting & Scripts:**
   * Update `apps/mobile-chhavani/package.json` with `"lint"` and `"typecheck"` scripts.
   * Update `apps/mobile-farmer/package.json` with `"lint"` and `"typecheck"` scripts.
   * Update `apps/mobile-officer/package.json` with `"lint"` and `"typecheck"` scripts.
   * Update `apps/mobile-vet/package.json` with `"lint"` and `"typecheck"` scripts.
   * Update `apps/web-admin/package.json` with `"lint"` and `"typecheck"` scripts.
   * Update `packages/api-client/package.json` and `packages/ui-core/package.json` with `"lint"` scripts.
3. **Backend Linting Integration & Root Orchestrator:**
   * Configure root `package.json` scripts:
     - `"lint:apps"`
     - `"lint:dashboard"`
     - `"lint:packages"`
     - `"lint:backend"`
     - `"lint:all"`
   * Verify all granular scripts run cleanly and exit with code 0.
4. **Verification & Testing:**
   * Run `npm run lint:apps`, `npm run lint:dashboard`, `npm run lint:backend`, and `npm run lint:all`.
   * Run `powershell -ExecutionPolicy Bypass -File .\scripts\e2e_smoke_test.ps1 -ApiBaseUrl "http://localhost:5000"`.
   * Ensure 100% tests pass and zero lint/compiler errors exist across the entire project.

---

## 2. Granular Task Checklist

### Phase 1: `scripts/e2e_smoke_test.ps1` Fix
- [x] **Task 1.1:** Harden `Invoke-Api` helper in `scripts/e2e_smoke_test.ps1` with `-UseBasicParsing` and safe body serializing.
- [x] **Task 1.2:** Implement error stream extraction in catch block for HTTP error diagnostics.
- [x] **Task 1.3:** Apply safe null-coalescing on all 19 test result assertions.
- [x] **Task 1.4:** Verify `scripts/e2e_smoke_test.ps1` passes 19/19 with zero warnings/errors.

### Phase 2: Per-App and Dashboard Package.json Lint Scripts
- [x] **Task 2.1:** Update `apps/mobile-chhavani/package.json`.
- [x] **Task 2.2:** Update `apps/mobile-farmer/package.json`.
- [x] **Task 2.3:** Update `apps/mobile-officer/package.json`.
- [x] **Task 2.4:** Update `apps/mobile-vet/package.json`.
- [x] **Task 2.5:** Update `apps/web-admin/package.json`.
- [x] **Task 2.6:** Update `packages/api-client/package.json` and `packages/ui-core/package.json`.

### Phase 3: Root Workspace Lint Orchestration & Backend Linting
- [x] **Task 3.1:** Update root `package.json` with `lint:apps`, `lint:dashboard`, `lint:packages`, `lint:backend`, and `lint:all`.
- [x] **Task 3.2:** Execute each lint target individually and verify code 0.
- [x] **Task 3.3:** Run `dotnet test backend/CharaChhavani.sln -c Release` to verify backend integrity.

### Phase 4: Stage 5–13 Documentation & Sign-off
- [x] **Task 4.1:** Document challenges and solutions in `docs/logs/challenges_and_solutions.md`.
- [x] **Task 4.2:** Mark all checklist items complete in dev plan.
- [x] **Task 4.3:** Commit and push changes to remote repository.
