# MySQL Migration & Database Schema Understanding Document
**Module:** MySQL 8.0 Relational & Spatial Database Schema  
**Reference:** [BRD.md](../../ReferanceData/BRD.md), [FSD.md](../../ReferanceData/FSD.md), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target System
The **Chara Chhavani Management System** requires a high-integrity, transactional MySQL 8.0 database schema capable of managing:
- Spatial polygons for camp geofence boundaries (SRID 4326).
- Spatial points for animal admission and veterinary inspection coordinates (SRID 4326).
- Relational tables for camps, operators, farmers, animals, vet verifications, animal admissions, dual-source fodder stock, feeding logs, adjustments, and operational expenses.

---

## 2. Schema Requirements & Invariants

### 2.1 Database Tables & Constraints
1. **`chhavanis`**:
   * Columns: `Id` (BIGINT PK AUTO_INCREMENT), `CampCode` (VARCHAR 50 UNIQUE), `Name`, `Address`, `Village`, `Taluka`, `District`, `State`, `TotalCapacity` (INT), `ActiveAnimalCount` (INT), `Status` (INT), `GeofenceBoundary` (POLYGON SRID 4326), `Location` (POINT SRID 4326), Auditable columns.
2. **`chhavani_operators`**:
   * FK: `ChhavaniId` $\rightarrow$ `chhavanis.Id` (ON DELETE CASCADE).
   * Index on `MobileNumber`.
3. **`farmers`**:
   * Columns: `Id` (PK), `Name`, `MobileNumber` (Indexed), Address fields, `IsRegisteredSeller` (BOOL).
4. **`animals`**:
   * Columns: `Id` (PK), `AnimalCode` (VARCHAR 50 UNIQUE), `TagNumber`, `FarmerId` (FK), `AnimalType`, `Breed`, `Gender`, `AgeInMonths`, `PhotoUrl`, `VerificationStatus`, `CurrentStatus`, `CurrentChhavaniId` (FK NULL).
5. **`vet_verifications`**:
   * Columns: `Id` (PK), `AnimalId` (FK), `DoctorId`, `Result`, `Remarks`, `InspectionLocation` (POINT SRID 4326), `VerifiedAtUtc`.
6. **`animal_admissions`**:
   * Columns: `Id` (PK), `AdmissionCode` (VARCHAR 50 UNIQUE), `AnimalId` (FK), `ChhavaniId` (FK), `OperatorId`, `AdmissionLocation` (POINT SRID 4326), `IsGeofenceValidated` (BOOL), `AdmittedAtUtc`, `ReleasedAtUtc`, `Status`.
7. **`fodder_stocks`**:
   * Columns: `Id` (PK), `ChhavaniId` (FK), `Source` (Store/InFarm), `FodderType`, `AvailableQuantity` (DECIMAL 18, 2), `Unit`.
   * Composite UNIQUE constraint: `(ChhavaniId, Source, FodderType)`.
8. **`fodder_purchases`**:
   * Columns: `Id` (PK), `PurchaseCode` (UNIQUE), `ChhavaniId` (FK), `SellerName`, `Quantity` (DECIMAL 18, 2), `RatePerUnit`, `TotalAmount`, `PurchaseDate`.
9. **`feeding_entries`**:
   * Columns: `Id` (PK), `ChhavaniId` (FK), `Source`, `AnimalType`, `FodderType`, `QuantityIssued` (DECIMAL 18, 2), `FeedingDateTime`.
10. **`stock_adjustments`**:
    * Columns: `Id` (PK), `ChhavaniId` (FK), `Source`, `FodderType`, `AdjustmentType`, `Quantity`, `Reason` (VARCHAR 500 NOT NULL).
11. **`expenses`**:
    * Columns: `Id` (PK), `ChhavaniId` (FK), `Category`, `Amount` (DECIMAL 18, 2), `Description`, `ExpenseDate`.

### 2.2 Character Set & Spatial Invariants
* Schema Character Set: `utf8mb4` with `utf8mb4_unicode_ci` for Marathi / Devanagari text support.
* Geometry columns mapped with SRID 4326.
