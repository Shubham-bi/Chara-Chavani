# Functional Requirement Document (FRD)
## Chara Chhavani Management System

---

## 1. Module 1: Farmer & Livestock Lifecycle (FR-FMR)

### FR-FMR-01: Farmer Authentication
- **Description**: Standard farmers authenticate using a 10-digit Indian mobile number (`^[6-9]\d{9}$`).
- **Processing**: System sends a 6-digit OTP (dev simulation OTP: `123456`). Upon verification, system issues a JWT token. If farmer profile does not exist, system creates a provisional record.

### FR-FMR-02: Farmer Profile & Landholding
- **Description**: Farmer records full name, village, taluka, district, 12-digit Aadhaar number, landholding in hectares, and 7/12 extract attachment flag.
- **Validation**: Name $\ge 2$ characters; village/taluka/district mandatory.

### FR-FMR-03: Livestock Registration
- **Description**: Farmer registers cattle specifying Animal Category (`Large`: Cow, Buffalo, Bullock; `Small`: Goat, Sheep, Calf), Breed, Age in months, Ear Tag Number, and live photo.
- **Initial State**: Animal is saved with `VerificationStatus = Pending`.

### FR-FMR-04: Resubmission Workflow
- **Description**: If a veterinarian rejects an animal with reasons (e.g., "Mismatched tag", "Underage calf"), the farmer can edit details and resubmit for re-inspection.

---

## 2. Module 2: Veterinary Physical Inspection (FR-VET)

### FR-VET-01: Pending Verification Queue
- **Description**: Veterinarians view cattle pending inspection filtered by their assigned district and taluka.

### FR-VET-02: Physical Barn Examination & Decision
- **Description**: The doctor visits the barn, examines physical health, checks vaccination status, attaches an official ear tag, captures GPS coordinates of the farm, and submits `Approved` or `Rejected` decision with remarks.
- **Geofence Policy**: The farm's GPS location is recorded as evidence but is NOT evaluated against camp geofences.

---

## 3. Module 3: Cattle Camp & Spatial Geofence Management (FR-CMP)

### FR-CMP-01: Camp Boundary Registration
- **Description**: District admin registers camps with code, name, capacity, and an array of polygon GPS coordinates (minimum 3 coordinates).
- **Auto-Closure Invariant**: If the first coordinate does not equal the last coordinate, the backend automatically closes the linear ring.

### FR-CMP-02: Point-in-Polygon Geofence Validation
- **Description**: System uses NetTopologySuite `Polygon.Contains(Point)` with WGS84 SRID 4326 to determine whether device coordinates are inside the camp polygon.

---

## 4. Module 4: Animal Admission & Release (FR-ADM)

### FR-ADM-01: Online Admission Verification (Rule 9.6)
- **Description**: Camp operator searches approved cattle, captures a live entry photo, and verifies device GPS coordinates against the camp geofence.
- **Guardrails**:
  1. Animal must be in `Verified` status.
  2. Animal must not already be in `Admitted` status.
  3. Device location must be inside the camp geofence polygon.
  4. Camp current occupancy must not exceed `TotalCapacity`.
  5. Offline submission is strictly blocked.

### FR-ADM-02: Animal Release & Gate Pass
- **Description**: When the drought ends or upon farmer request, operator releases animal, records remarks, generates a release receipt, and decrements camp active occupancy.

---

## 5. Module 5: Fodder Inventory & Feeding Management (FR-FOD)

### FR-FOD-01: Fodder Purchase Entry
- **Description**: Operator records incoming fodder shipments with supplier name, fodder category (Green, Dry, Silage, Feed), Gross/Tare/Net weights in kilograms, and rate per quintal.
- **Metric Normalization**: $1\text{ Quintal} = 100\text{ Kg}$. Stock is added to Camp Store.

### FR-FOD-02: Daily Feeding & Non-Negative Balance
- **Description**: Operator logs daily distributed feed. Deduction from Store/In-Farm stock is atomic. If requested quantity exceeds available stock, transaction is rejected with `InsufficientStockException`.

---

## 6. Module 6: Operational Expenses & Audits (FR-EXP)

### FR-EXP-01: Itemized Expense Accounting
- **Description**: Operators log spot camp operational expenses under standardized government codes (`WaterTanker`, `Labor`, `Electricity`, `ShedMaintenance`, `Medicines`, `Disinfection`, `Miscellaneous`) with payee name, bill voucher, and amount.

### FR-EXP-02: Officer Spot Inspection Checklist
- **Description**: Government monitoring officers conduct surprise inspections, counting physical heads vs system headcount. System automatically calculates $\Delta$ discrepancy and alerts the state dashboard if $\Delta \ne 0$.
