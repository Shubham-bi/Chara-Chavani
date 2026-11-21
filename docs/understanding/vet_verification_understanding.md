# Veterinary Doctor Verification Understanding Document
**Module:** Veterinary Doctor Verification & Inspection Workflow  
**Reference:** [BRD.md](../../ReferanceData/BRD.md) (Workflow 1, Steps 3–4), [FSD.md](../../ReferanceData/FSD.md) (Section 2), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
- **Target User:** Government Veterinary Doctors appointed by the Animal Husbandry Department.
- **Workflow Context:** Before any animal can be admitted to a Chara Chhavani, a designated government veterinarian must visit the farmer's location, physically inspect the cattle to confirm health, age, breed, and ownership, and record an official verification decision.
- **Critical Recommendation from BRD:** The GPS coordinates captured during veterinary verification represent the **farmer's location** and must remain strictly distinct from camp admission geofences.

---

## 2. Functional Requirements & Invariants

### 2.1 Doctor Queue & Dashboard
* View pending animals awaiting inspection filtered by District, Taluka, or Village.
* Summary dashboard counts: `PendingCount`, `VerifiedCount`, `RejectedCount`.

### 2.2 Inspection & Decision Invariants
* **Result Options:** `Approved` or `Rejected`.
* **Rejection Constraint:** If `Rejected`, `Remarks` (reason for rejection) is strictly mandatory.
* **Location Stamping:** Vet's current GPS coordinate (`Latitude`, `Longitude`) is stamped as `InspectionLocation` (stored as NetTopologySuite `Point` with SRID 4326).
* **Audit Trail:** Doctor ID, timestamp (`VerifiedAtUtc`), remarks, and optional verification photograph are preserved in the permanent `vet_verifications` audit table. Resubmissions never overwrite prior verification records.
* **Animal State Transition:**
  * If `Approved`: `animal.VerificationStatus` becomes `Approved`. Animal can now be admitted to any camp.
  * If `Rejected`: `animal.VerificationStatus` becomes `Rejected`. Animal cannot be admitted until farmer resubmits and vet re-verifies.

---

## 3. Data Flow & API Contracts

### Endpoints
* `GET /api/v1/vet/dashboard`: Returns counts of pending, approved, and rejected animals for the doctor.
* `GET /api/v1/vet/pending-animals`: Returns list of animals in `Pending` verification status with farmer details and photographs.
* `POST /api/v1/vet/verify`: Submit inspection outcome (Approve/Reject) with GPS point and doctor credentials.
* `GET /api/v1/vet/history`: Returns historical verification records executed by the doctor.
