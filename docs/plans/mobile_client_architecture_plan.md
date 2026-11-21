# React Native Mobile Client & Shared API Client Plan & Task List

**Module:** React Native Multi-App Architecture & Shared TypeScript Client  
**Reference Understanding Doc:** [mobile_client_architecture_understanding.md](../understanding/mobile_client_architecture_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. Scaffolded `packages/api-client`:
   * TypeScript interfaces matching all ASP.NET Core DTOs and Enums (`ApiResponse<T>`, `AnimalDto`, `ChhavaniDto`, `VetDtos`, `FodderDtos`, `ExpenseDtos`).
   * Modular API client services: `CampsService`, `FarmersService`, `AnimalsService`, `VetService`, `AdmissionsService`, `FodderService`, `ExpensesService`.
   * Centralized HTTP client wrapper with error normalization.
2. Scaffolded the 4 mobile application structures according to Section 4 of `Development-Guidlines.md`:
   * `apps/mobile-farmer`
   * `apps/mobile-vet`
   * `apps/mobile-officer`
   * `apps/mobile-chhavani`
3. Included standard navigation structure, environment configuration, and screen controllers for each role.
4. Validated TypeScript build and type definitions using `tsc --noEmit`.

---

## Granular Atomic Task List

- [x] **Task 1: Scaffold `packages/api-client` Models & Enums**
  - Scope: Created TypeScript definitions matching all backend models, enums, and `ApiResponse<T>`.
  - Target: `packages/api-client/src/models/`
- [x] **Task 2: Implement Typed API Services in `packages/api-client`**
  - Scope: HTTP service functions for Camps, Farmers, Animals, Vet, Admissions, Fodder, Expenses.
  - Target: `packages/api-client/src/services/`
- [x] **Task 3: Scaffold Farmer Mobile App Structure**
  - Scope: Directory layout, configuration, navigation, authentication, and animal registration controllers.
  - Target: `apps/mobile-farmer/`
- [x] **Task 4: Scaffold Vet Doctor Mobile App Structure**
  - Scope: Directory layout, configuration, verification queue, and physical inspection controller.
  - Target: `apps/mobile-vet/`
- [x] **Task 5: Scaffold Officer Mobile App Structure**
  - Scope: Directory layout, configuration, camp registration, and geofence map controller.
  - Target: `apps/mobile-officer/`
- [x] **Task 6: Scaffold Chara Chhavani Operator Mobile App Structure**
  - Scope: Directory layout, configuration, admission with geofence camera, fodder & feeding controllers.
  - Target: `apps/mobile-chhavani/`
- [x] **Task 7: TypeScript Verification**
  - Scope: Ran `tsc --noEmit` across shared packages and client apps (0 errors).
  - Target: Solution-wide
