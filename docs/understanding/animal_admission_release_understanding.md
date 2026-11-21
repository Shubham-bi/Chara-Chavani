# Animal Admission & Release Workflow Understanding Document
**Module:** Animal Admission & Release at Chara Chhavani  
**Reference:** [BRD.md](../../ReferanceData/BRD.md) (Workflow 1, Steps 5–7), [FSD.md](../../ReferanceData/FSD.md) (Sections 4.3–4.6), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
- **Target User:** Chara Chhavani Operators / Camp In-Charge.
- **Workflow Context:** When a farmer brings an approved animal to a cattle camp, the camp operator searches for the animal, verifies identity, captures a live admission photo and GPS coordinates, and admits the animal if all spatial and capacity validations pass. When the farmer takes the animal home or drought emergency concludes, the operator records the release.

---

## 2. Functional Requirements & Invariants

### 2.1 Search & Pre-Admission Check
* Search query accepts `AnimalCode`, `TagNumber`, or `FarmerMobile`.
* Validates admissibility:
  1. $\text{Animal.VerificationStatus} == \text{Approved}$
  2. $\text{Animal.CurrentStatus} \ne \text{Admitted}$
  3. $\text{Chhavani.ActiveAnimalCount} < \text{Chhavani.TotalCapacity}$

### 2.2 Admission Execution & Geofence Enforcement
* **Mandatory Admission Photo:** Operator captures an intake photo of the animal at the camp.
* **Spatial Polygon Validation:** Device GPS coordinate $(lat, lng)$ is converted to a NetTopologySuite `Point` (SRID 4326) and evaluated against the camp's registered polygon:
  $$\text{IsPointInside} = \text{Camp.GeofenceBoundary.Contains}(\text{AdmissionPoint})$$
  If false, admission is strictly rejected with a clear message: `"Device GPS is outside the camp's registered geofence."`
* **Atomic State Mutation:**
  * Increment `chhavani.ActiveAnimalCount += 1`.
  * Set `animal.CurrentStatus = Admitted`.
  * Set `animal.CurrentChhavaniId = chhavani.Id`.
  * Create `AnimalAdmission` record with unique code `ADM-YYYYMMDD-XXXX`.

### 2.3 Animal Release Invariants
* Animal must currently be in `Admitted` status at the requesting camp.
* Decrement `chhavani.ActiveAnimalCount -= 1` (clamped to $\ge 0$).
* Set `animal.CurrentStatus = Released`.
* Set `animal.CurrentChhavaniId = null`.
* Mark admission record with `ReleasedAtUtc` and optional `ReleaseRemarks`.

---

## 3. Data Flow & API Contracts

### Endpoints
* `GET /api/v1/admissions/search`: Search animals for admission by code, tag, or mobile.
* `POST /api/v1/admissions`: Admit animal with live photo and device GPS coordinates.
* `GET /api/v1/admissions/camp/{campId}`: List admitted animals currently in a camp with filtering.
* `POST /api/v1/admissions/{admissionId}/release`: Release an admitted animal and update occupancy.
