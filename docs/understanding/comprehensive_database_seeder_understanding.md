# Comprehensive Database Seeder - Understanding Document

## 1. Business Context and Target Users
The **Chara Chhavani (Maharashtra Cattle Relief Camp Monitoring System)** is designed to combat severe drought conditions across Maharashtra by providing fodder, water, shelter, and medical care for livestock in government-authorized camps (*Chhavanis*).

### Target Users & System Roles
1. **Farmers**: Drought-affected livestock owners who register animals for relief camp admission.
2. **Veterinary Doctors**: Physical inspection and verification officers checking health, age, breed, and ear tags.
3. **Camp Operators**: On-ground camp managers who record cattle admission (with geofence validation), manage daily fodder inventory, record daily feeding, and report operational expenses.
4. **Government Inspection Officers**: Tehsildars, BDOs, and Animal Husbandry Officers conducting surprise spot audits comparing physical headcount against digital registers.
5. **State & District Administrators**: Monitoring KPI dashboard, GIS distribution of camps, statutory audit reports (admissions, fodder reconciliation, expenses, and inspection logs), and automated CSV exports.

### The Problem
Previously, `DatabaseSeeder.cs` only inserted 1 camp (`CHV-MH-PAITHAN-001`), 1 farmer, 2 animals, 0 admissions, 0 expenses, 0 inspections, and limited fodder stock. Because the initial camp and farmer already exist in persistent MySQL storage, re-running the seeder created 0 records, leaving:
- Multi-district geographic distribution empty (only Paithan in Sambhajinagar).
- Active admitted animal count at 0 in KPIs.
- Capacity utilization at 0%.
- Statutory audit reports (Admissions, Fodder Reconciliation, Expenses, Inspections) empty or near-empty.
- CSV export data lacking real-world audit trails.

---

## 2. Functional Requirements & Business Rules

### 2.1 Multi-District Camp Network
Seed 4 operational cattle relief camps across major drought-prone districts in Marathwada & Western Maharashtra:
1. **Paithan Taluka Shasan-Manya Chara Chhavani** (`CHV-MH-PAITHAN-001`) - Chhatrapati Sambhajinagar (Paithan taluka), Capacity: 500
2. **Ambad Taluka Drought Relief Chhavani** (`CHV-MH-AMBAD-101`) - Jalna (Ambad taluka), Capacity: 400
3. **Georai Taluka Madhyavarti Chara Chhavani** (`CHV-MH-GEORAI-102`) - Beed (Georai taluka), Capacity: 600
4. **Madha Drought Relief Cattle Camp** (`CHV-MH-MADHA-103`) - Solapur (Madha taluka), Capacity: 450

Each camp must have:
- Valid WGS84 (SRID 4326) closed geofence polygon (5 coordinates).
- Centroid entrance Point coordinate (SRID 4326).
- Camp Operator assigned with contact information.
- Realistic initial fodder inventory (Store & InFarm) across Green Fodder, Dry Fodder, and Concentrate Feed.

### 2.2 Diverse Farmers & Livestock
Seed 5 farmers with authentic Maharashtrian agricultural profiles:
1. **Kisan Tukaram Jadhav** (`9890123456`) - Pachod, Paithan, Sambhajinagar
2. **Rameshwar Baburao Shinde** (`9822012345`) - Shevgaon Road, Paithan, Sambhajinagar
3. **Suresh Mahadev Patil** (`9822098765`) - Wadigodri, Ambad, Jalna
4. **Kisan Arjun Chavan** (`9822055555`) - Revgaon, Georai, Beed
5. **Dnyaneshwar Vitthal Gaikwad** (`9822033445`) - Kurduvadi, Madha, Solapur

Seed 10+ animals across native and dairy breeds:
- Gir Cow, Khillari Bullock, Murrah Buffalo, Osmanabadi Goat, Deccani Sheep, Dangi Cow.

### 2.3 Veterinary Verifications
- Approved verification records with veterinary doctor IDs (`DOC-MH-AUR-01`, `DOC-MH-JAL-02`, `DOC-MH-BED-03`, `DOC-MH-SOL-04`).
- Inspection coordinates at farmer homesteads.
- Detailed clinical remarks ("Healthy, vaccinated against FMD", "Ear tag verified", "Pregnancy negative").

### 2.4 Animal Admissions & Active Headcount
- Active admissions into camps (`ADM-20261122-001` through `008`).
- Geofence-validated admissions with admission location coordinates inside camp polygons.
- Setting `animal.CurrentChhavaniId`, `animal.CurrentStatus = AnimalStatus.Admitted`, and updating camp `ActiveAnimalCount`.

### 2.5 Fodder Purchases & Feeding Entries
- Fodder purchase batches from registered local sellers (Green Fodder @ Rs 3.50/kg, Dry Fodder @ Rs 6.80/kg).
- Daily feeding entries across animal types (Cow, Bullock, Buffalo) documenting morning and evening ration allocations.

### 2.6 Itemized Operational Expenses
- Real camp vouchers across categories:
  - **Labour**: "Daily shed maintenance & cowherds shift wages (12 workers)"
  - **Water**: "Emergency drought water tanker supply (4 tankers x 12,000L)"
  - **Electricity**: "Grid power supply & solar pump maintenance billing"
  - **Transportation**: "Fodder freight & transport from APMC market"
  - **Other / Medical**: "Antiseptic sprays, mineral mixture, veterinary first-aid kit"

### 2.7 Official Camp Spot Inspections
- Conducted by government inspection officers (District Animal Husbandry Officer, Taluka Development Officer, Sub-Divisional Officer).
- Auditing physical headcount vs digital database headcount.
- Inspecting water availability ("Adequate"), fodder condition ("Satisfactory"), cleanliness score (4/5), and formal recommendations.

---

## 3. Data Flow & State Transitions

```
[Farmer Registration]
       │
       ▼
[Animal Enrollment (Registered)]
       │
       ▼
[Vet Verification by Doctor (Approved)]
       │
       ▼
[Camp Gate Admission (Admitted, Geofence Validated)] ──► Updates Camp ActiveAnimalCount
       │
       ├───────────────────────────────┬───────────────────────────────┐
       ▼                               ▼                               ▼
[Fodder Supply & Daily Feeding]  [Operational Expenses Logged]  [Officer Spot Inspection]
       │                               │                               │
       └───────────────────────────────┴───────────────────────────────┘
                                       │
                                       ▼
                     [State Dashboard & Statutory Reports]
```

---

## 4. Non-Functional & Technical Constraints
- **Idempotency**: Seeding must be safely re-runnable multiple times without duplicating entities, violating unique indexes (`CampCode`, `AnimalCode`, `AdmissionCode`, `PurchaseCode`, etc.), or corrupting foreign keys.
- **MySQL & Spatial Accuracy**: All coordinates must use SRID 4326 with correct longitude/latitude order `Point(X=Lon, Y=Lat)`. Polygons must be closed rings with identical start and end vertices.
- **Transaction Safety**: All additions must commit within an atomic database transaction.
- **Performance**: Execution of the entire seeder must complete within 2 seconds.

---

## 5. API & Entity Contracts
- **Endpoint**: `POST /api/v1/master/seed`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "campsCreated": 3,
      "farmersCreated": 4,
      "animalsCreated": 8,
      "operatorsCreated": 3,
      "admissionsCreated": 6,
      "expensesCreated": 8,
      "inspectionsCreated": 4,
      "message": "Comprehensive database seeding completed successfully."
    },
    "message": "Operation successful."
  }
  ```
- **Automated Verification**:
  - `tests/e2e-web/seed.spec.ts` will trigger `POST /api/v1/master/seed`, verify HTTP 200, inspect `AdminDashboardPage` cards (Active Camps, Total Admitted Animals, Capacity Utilization > 0%), and verify tables in statutory reports.
