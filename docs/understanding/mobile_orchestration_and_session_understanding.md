# Mobile App Orchestration, Secure Session & Offline Resilience - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Mobile & Security Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Problem Statement
In rural drought cattle camps across Maharashtra, field operators, farmers, and veterinary doctors frequently experience intermittent, high-latency, or absent cellular network coverage. At the same time, security and transaction safety are critical:
- **Mandatory Live Backend Guards:** Rule 9.6 of `Development-Guidlines.md` dictates that **animal admissions must never be finalized offline** without server-side geofence point-in-polygon verification and atomic camp capacity validation.
- **Offline Draft Preservation:** Farmers drafting animal registrations or officers recording field observations in dead zones must not lose unsaved input upon connectivity drops (Rule 9.5).
- **Secure Token Lifecycle:** Tokens must be stored securely, protected against memory leakage, auto-attached to API headers, and cleared upon session logout (Rule 10).
- **Unified Screen Orchestration:** Each of the 4 mobile applications requires an orchestrator that ties together:
  1. Login with Mobile Number + OTP.
  2. Responsive View Layouts from `@chara-chhavani/ui-core`.
  3. API Client communication with loading/error state management.

---

## 2. Technical Architecture & Constraints

### 2.1 Secure Session Management (`SessionManager`)
- Implements device-safe token persistence with in-memory caching.
- Emits session state change events (`authenticated`, `unauthenticated`, `expired`).
- Hooks directly into `@chara-chhavani/api-client` via `getAuthToken()` callback.

### 2.2 Offline Resilience & Pending Action Queue (`OfflineActionQueue`)
- Queue structure with persistent storage backing.
- Action Classification:
  - `CanQueueOffline: true` -> Draft animal registration, offline notes, inspection drafts.
  - `CanQueueOffline: false` -> Animal admission (locked to live geofence verification), stock adjustments, payments.
- Auto-replay when network state transitions to online with exponential backoff and deduplication keys.

### 2.3 Mobile App Screen Orchestrators
Each app (`mobile-farmer`, `mobile-vet`, `mobile-officer`, `mobile-chhavani`) provides:
1. `src/screens/AppOrchestrator.ts`: State machine controlling authentication state, screen transitions (Login -> Dashboard -> Workflow Screen), and active user session.
2. `src/index.ts`: Standard library and app exports.

### 2.4 Interactive Web Admin Dashboard (`apps/web-admin`)
- Provides clean, responsive dashboard components:
  - `AdminDashboardPage`: Real-time KPI summary (farmers, cattle, centres, capacity, expenditure).
  - `CampUtilizationTable`: Sortable camp list with capacity progress bars and geofence badges.
  - `AdminLoginPage`: Username + Password challenge form.

---

## 3. Verification Criteria
- Zero data loss when draft actions are saved offline.
- Explicit blocking of offline animal admission with error code `ERR_ONLINE_GEOFENCE_REQUIRED`.
- Clean session wipe upon logout.
- TypeScript compiler passes with 0 errors across all 4 mobile apps, `web-admin`, and `@chara-chhavani/ui-core`.
