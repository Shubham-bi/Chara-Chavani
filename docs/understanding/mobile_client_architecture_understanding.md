# React Native Mobile Client & Shared API Client Understanding Document
**Module:** React Native Multi-App Architecture & Shared TypeScript Client  
**Reference:** [BRD.md](../../ReferanceData/BRD.md), [FSD.md](../../ReferanceData/FSD.md), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md) (Part 2)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Apps
The **Chara Chhavani Management System** requires four distinct, purpose-built mobile applications serving different operational roles in rural regions:
1. **Farmer App (`apps/mobile-farmer`)**:
   * Target: Livestock owners in drought-hit villages.
   * Key Flows: Mobile OTP login, profile management, animal registration with camera photo upload, tracking verification/admission status, resubmitting rejected animals.
2. **Vet Doctor App (`apps/mobile-vet`)**:
   * Target: Government veterinary officers.
   * Key Flows: OTP login, queue of pending animals, physical on-farm inspection with GPS coordinate stamping, approve/reject decision with mandatory remarks.
3. **Officer App (`apps/mobile-officer`)**:
   * Target: Taluka / District administration officers.
   * Key Flows: Registering new camps, drawing and saving closed polygon geofence boundaries on interactive maps, capacity configuration.
4. **Chara Chhavani App (`apps/mobile-chhavani`)**:
   * Target: Cattle camp operators and attendants.
   * Key Flows: Intake animal search, live camera photo capture with device GPS verification against camp polygon geofence, animal admission and release, recording fodder purchases (`Store`), logging group feedings, stock adjustments, and operational expenses.

---

## 2. Shared Architecture & Code Reuse Strategy
To prevent code duplication across the 4 applications while adhering strictly to Rule 2 of `Development-Guidlines.md` (*"Do not duplicate business logic across applications"*):
* **`packages/api-client`**:
  * Centralizes all TypeScript interfaces, DTOs, and API service functions.
  * Ensures 100% type-safety with ASP.NET Core endpoints.
  * Standardizes response parsing (`ApiResponse<T>`) and error extraction (`ApiError`).
* **Consistent Directory Standard**: Each mobile app adheres to the uniform directory layout mandated in Section 4 of `Development-Guidlines.md`:
  `src/assets`, `components`, `screens`, `navigation`, `services`, `hooks`, `context`, `models`, `utils`, `constants`, `validation`, `storage`, `config`.

---

## 3. Technical Constraints & Protocols
1. **Strict TypeScript:** No `any` types; all API payloads, state objects, and navigation parameters strictly typed.
2. **Standard API Client:** Configurable `BASE_URL` with automatic timeout, trace ID tracking, and centralized error normalization.
3. **Camera & GPS Standards:**
   * Photos compressed to JPEG 0.75 quality before base64/multipart dispatch.
   * Real-time GPS coordinate capture synchronized with photo shutter event.
4. **Offline Resilience:** Local storage adapters (MMKV / AsyncStorage) for caching offline dashboard counts and draft submissions.
