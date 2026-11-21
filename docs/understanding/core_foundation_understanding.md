# Core Foundation Understanding Document
**Module:** Core Architecture, MySQL Spatial Schema & .NET 8 Clean Architecture  
**Reference:** [BRD.md](../../ReferanceData/BRD.md), [FSD.md](../../ReferanceData/FSD.md), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
The **Chara Chhavani Management System** oversees cattle camp operations during drought conditions. The system coordinates five distinct user groups:
1. **Farmers**: Register themselves and their cattle.
2. **Government Vet Doctors**: Visit farmers to physically verify animals and log geo-tagged approvals or rejections.
3. **Officers**: Register camps and draw spatial polygon geofences.
4. **Chhavani Operators**: Admit verified animals (validating real-time GPS against camp geofences), record dual-source fodder stocks (`Store` vs `In Farm`), record feeding by animal group, and log operational expenses.
5. **Admin Officers**: Monitor district/taluka-wide metrics, capacity utilization, and system-wide audits.

---

## 2. Functional Requirements & Invariants

### 2.1 Spatial Geofencing Logic
* **Camp Geofence:** Stored as a MySQL `POLYGON` (SRID 4326 / WGS84).
* **Admission Location:** Stored as a MySQL `POINT` (SRID 4326 / WGS84).
* **Validation Rule:** An animal can only be admitted if the operator's current coordinates fall strictly inside the camp polygon:
  $$\text{IsInside} = \text{CampGeofence.Contains}(\text{AdmissionPoint})$$
* **Location Isolation:** Vet verification records the farmer's location, which must **never** be conflated with the camp admission geofence.

### 2.2 System Invariants & Business Rules
1. **Unique IDs:** System-generated unique human-readable keys (e.g., `ANM-YYYYMMDD-XXXX`, `ADM-YYYYMMDD-XXXX`, `CMP-YYYYMMDD-XXXX`).
2. **Admission Guardrails:**
   * Animal must be in `Approved` verification status.
   * Animal cannot be currently admitted in any active camp.
   * Camp must have remaining capacity ($\text{ActiveAnimals} < \text{TotalCapacity}$).
   * GPS device coordinates must fall within the camp's polygon geofence.
3. **Inventory & Feeding Invariants:**
   * Fodder inventory tracks two sources: `Store` (purchased) and `InFarm` (farm-supplied).
   * Purchases atomically increment `Store` stock.
   * Daily feeding deducts stock based on animal type/group.
   * Stock can **never** be negative ($\text{AvailableStock} \ge 0$).
   * Stock adjustments require a mandatory reason.

---

## 3. Data Flow & State Transitions

### Animal Lifecycle State Machine
```
[Draft / New] 
      │ (Submit Registration)
      ▼
[Pending Verification]
      │
      ├───────────────────────┐
      │ (Vet Approves)        │ (Vet Rejects with Reason)
      ▼                       ▼
  [Approved]              [Rejected]
      │                       │
      │ (Admit at Camp)       └─► (Farmer edits & resubmits)
      ▼
  [Admitted]
      │
      │ (Discharge / Exit)
      ▼
  [Released]
```

---

## 4. Non-Functional Requirements (NFRs)
1. **Spatial Performance:** Geofence point-in-polygon queries must execute in $< 50\text{ ms}$ using spatial indexes.
2. **Consistent Response Format:** All responses conform to the standard structure defined in `Development-Guidlines.md`:
   ```json
   {
     "success": true,
     "message": "...",
     "data": { ... },
     "errors": null,
     "traceId": "..."
   }
   ```
3. **Resilient Error Boundary:** Unhandled exceptions intercepted globally; zero stack traces exposed to client apps.
4. **Audit Trail:** Base auditable fields (`CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `IsDeleted`) on all transactional entities.

---

## 5. Architectural Contracts (.NET 8 Clean Architecture)

```
backend/
├── CharaChhavani.Domain/        # Pure domain: Entities, Enums, Value Objects, Domain Events
├── CharaChhavani.Application/   # CQRS Handlers, Behaviors, DTOs, FluentValidation, Interfaces
├── CharaChhavani.Infrastructure/# EF Core, Pomelo MySQL, NetTopologySuite, Auditing
└── CharaChhavani.WebApi/        # Controllers, Swagger/OpenAPI, Middleware, Dependency Injection
```
