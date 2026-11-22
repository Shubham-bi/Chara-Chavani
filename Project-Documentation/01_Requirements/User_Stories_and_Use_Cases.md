# User Stories & Use Case Specifications
## Chara Chhavani Management System

---

## 1. User Stories by Persona

### 👨‍🌾 Farmer Persona (शेतकरी)
- **US-FMR-01**: *As a drought-affected farmer*, I want to log in using my mobile number and OTP, so that I don't have to remember complex passwords or visit a government office.
- **US-FMR-02**: *As a farmer*, I want to update my village, taluka, and 7/12 landholding details, so that my cattle camp eligibility is verified.
- **US-FMR-03**: *As a farmer*, I want to register my cows and bullocks with photo and ear tag, so that they can be inspected for relief admission.
- **US-FMR-04**: *As a farmer*, I want to track whether my animals are Pending, Verified, or Admitted, so that I know when to transport them to the camp.

### 🩺 Veterinary Doctor Persona (पशुधन विकास अधिकारी)
- **US-VET-01**: *As a government vet doctor*, I want to view a taluka-wise queue of pending cattle registrations, so that I can schedule barn inspection visits.
- **US-VET-02**: *As a vet doctor*, I want to examine physical health, tag the animal, capture GPS coordinates, and approve or reject it with remarks, so that only healthy, eligible cattle enter camps.

### ⛺ Camp Operator Persona (छावणी चालक / व्यवस्थापक)
- **US-OPR-01**: *As a camp operator*, I want to admit an approved animal only when physically present inside the camp geofence, so that fraudulent admissions are eliminated.
- **US-OPR-02**: *As a camp operator*, I want to release an animal back to its farmer and issue a digital gate pass, so that the active camp headcount decreases accurately.
- **US-OPR-03**: *As a camp operator*, I want to record incoming fodder weighbridge slips (Gross/Tare/Net) with supplier name, so that fodder purchases are officially accounted for.
- **US-OPR-04**: *As a camp operator*, I want to log daily feeding deductions and spot expenses, so that government subsidies can be claimed without discrepancy.

### 📋 Government Monitoring Officer Persona (तपासणी अधिकारी)
- **US-OFC-01**: *As a revenue monitoring officer*, I want to conduct spot inspections by counting physical heads and comparing against system numbers, so that ghost cattle claims are immediately flagged.
- **US-OFC-02**: *As an officer*, I want to rate camp water availability, fodder freshness, and cleanliness, so that cattle welfare is maintained.

### 📊 State Administrator Persona (मदत व पुनर्वसन विभाग)
- **US-ADM-01**: *As a state relief administrator*, I want a live dashboard of total camps, admitted cattle, and utilization rates, so that drought relief funds are allocated efficiently.
- **US-ADM-02**: *As an auditor*, I want to export Admissions, Fodder Balances, Expenses, and Inspections as Excel-compatible CSVs with UTF-8 BOM, so that regional Marathi text renders without mojibake.

---

## 2. Detailed Use Case Specifications

### Use Case UC-01: Admit Approved Livestock to Cattle Camp
- **Primary Actor**: Camp Operator
- **Preconditions**:
  1. Animal status is `Verified` by a licensed veterinarian.
  2. Animal is not currently marked `Admitted`.
  3. Camp active animal count is less than `TotalCapacity`.
  4. Operator mobile device has GPS enabled and active internet.
- **Main Success Scenario**:
  1. Operator searches animal by Ear Tag, Animal Code, or Farmer Mobile.
  2. System returns matching verified animal profile and farmer name.
  3. Operator captures live entry photograph of the animal at the camp entrance.
  4. Device captures current GPS coordinates (`latitude`, `longitude`).
  5. Operator clicks "Admit Animal".
  6. Backend invokes NetTopologySuite `Polygon.Contains(Point)` against camp geofence.
  7. Point is confirmed inside polygon; camp active count increments by 1.
  8. Admission record created with UTC timestamp; response returns HTTP 201 Created.
- **Alternate / Exception Flows**:
  - *4a. GPS location is outside camp geofence*: Backend rejects with `Coordinates are OUTSIDE the registered geofence`; admission blocked.
  - *4b. Animal is in Pending or Rejected status*: System displays error `Only verified animals can be admitted`.
  - *4c. Camp is at 100% capacity*: Backend rejects with `Camp capacity limit reached`.
  - *4d. Offline network state*: App `OfflineActionQueue` throws `ERR_ONLINE_GEOFENCE_REQUIRED` under Rule 9.6; admission cannot be drafted offline.

### Use Case UC-02: Fodder Stock Purchase & Metric Reconciliation
- **Primary Actor**: Camp Operator / Store Manager
- **Preconditions**: Camp operator authenticated; camp is active.
- **Main Success Scenario**:
  1. Operator selects Fodder Category (`GreenFodder`, `DryFodder`, `Silage`, `ConcentrateFeed`).
  2. Operator enters supplier name, vehicle/truck number, gross weight, and tare weight.
  3. System automatically calculates $\text{Net Kg} = \text{Gross} - \text{Tare}$ and converts to $\text{Net Quintals} = \text{Net Kg} / 100$.
  4. Operator enters rate per quintal and invoice voucher number.
  5. Operator submits purchase.
  6. Backend increments `AvailableStoreStockKg` by Net Kg and creates an immutable ledger entry.
  7. State Admin dashboard immediately reflects updated available stock reserves.
