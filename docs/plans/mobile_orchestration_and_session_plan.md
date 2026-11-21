# Mobile App Orchestration, Secure Session & Offline Resilience Plan

**Module:** Mobile Screen Orchestration, Secure Session & Offline Resilience  
**Reference Understanding Doc:** [mobile_orchestration_and_session_understanding.md](../understanding/mobile_orchestration_and_session_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Core Shared Library Extensions (`packages/ui-core`)**:
   - `SessionManager`: Thread-safe session management with token injection and logout cleanup.
   - `OfflineActionQueue`: Persistent action queue respecting Rule 9.6 (strictly blocks offline admission without server-side geofence checks).
2. **Mobile Application Orchestrators**:
   - `apps/mobile-farmer`: `FarmerAppOrchestrator.ts` & `index.ts`.
   - `apps/mobile-vet`: `VetAppOrchestrator.ts` & `index.ts`.
   - `apps/mobile-officer`: `OfficerAppOrchestrator.ts` & `index.ts`.
   - `apps/mobile-chhavani`: `ChhavaniAppOrchestrator.ts` & `index.ts`.
3. **Web Admin Dashboard Application (`apps/web-admin`)**:
   - Complete `index.html`, `src/App.tsx`, and dashboard components.
4. **Testing & Verification**:
   - Unit tests for SessionManager, OfflineActionQueue, and Admission guard.
   - TypeScript typechecks across all 4 mobile apps, `web-admin`, and `@chara-chhavani/ui-core`.

---

## Granular Atomic Task List

- [x] **Task 1: Implement SessionManager in `packages/ui-core`**
  - Scope: Secure token handling, login/logout state machine, token attachment.
  - Target: `packages/ui-core/src/storage/SessionManager.ts`
- [x] **Task 2: Implement OfflineActionQueue in `packages/ui-core`**
  - Scope: Offline action queue with rule 9.6 guard (rejects offline admissions).
  - Target: `packages/ui-core/src/offline/OfflineActionQueue.ts`
- [x] **Task 3: Implement Mobile Screen Orchestrators across all 4 Mobile Apps**
  - Scope: Login flow, screen state management, and view binding.
  - Target: `apps/mobile-*/src/orchestrator/` and `apps/mobile-*/src/index.ts`
- [x] **Task 4: Build Interactive Web Admin Dashboard in `apps/web-admin`**
  - Scope: HTML template, App container, KPI cards, camp table, login page.
  - Target: `apps/web-admin/`
- [x] **Task 5: Execute Tests & Verification**
  - Scope: Unit tests, typechecks across all packages and apps.
  - Target: Solution-wide
