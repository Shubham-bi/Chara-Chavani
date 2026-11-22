# Detailed Test Scenarios Document

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-SCN-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Persona-Based High-Level Scenarios

### Persona 1: Farmer (शेतकरी)
- **SCN-FAR-01**: Farmer logs in using mobile OTP authentication (`9822012345` / OTP `123456`).
- **SCN-FAR-02**: Farmer completes KYC profile with Aadhaar number and landholding survey numbers.
- **SCN-FAR-03**: Farmer registers a new cattle (Cow / Buffalo / Goat) with breed, age, tag number, and GPS coordinates.
- **SCN-FAR-04**: Farmer uploads animal photo and submits registration for veterinary verification.
- **SCN-FAR-05**: Farmer views real-time verification status (Pending -> Approved / Rejected).
- **SCN-FAR-06**: Farmer corrects and resubmits rejected animal details based on doctor's rejection remarks.

### Persona 2: Veterinary Doctor (पशुवैद्यकीय अधिकारी)
- **SCN-VET-01**: Vet logs in and reviews pending animal verification requests filtered by Taluka.
- **SCN-VET-02**: Vet performs physical inspection, verifies tag ID, and captures timestamped verification photo.
- **SCN-VET-03**: Vet records physical GPS coordinates at farmer's location (distinct from camp geofence).
- **SCN-VET-04**: Vet approves verified cattle, transitioning status to `ApprovedForCamp`.
- **SCN-VET-05**: Vet rejects unfit/ineligible animal with mandatory statutory rejection reason.

### Persona 3: Camp Operator (छावणी चालक / व्यवस्थापक)
- **SCN-OPR-01**: Operator checks camp capacity status prior to admitting new cattle.
- **SCN-OPR-02**: Operator attempts admission of cattle outside camp geofence boundary -> Rejected with error.
- **SCN-OPR-03**: Operator admits approved cattle inside camp geofence polygon (SRID 4326) with photo proof.
- **SCN-OPR-04**: Operator receives bulk fodder shipment into Store Stock (`+45,000 kg`).
- **SCN-OPR-05**: Operator transfers fodder from Store to In Farm feeding area (`12,000 kg`).
- **SCN-OPR-06**: Operator records daily cattle feed distribution (`-10 kg` per large cattle).
- **SCN-OPR-07**: Operator processes official cattle discharge/release back to farmer.

### Persona 4: Government Inspecting Officer (शासकीय तपासणी अधिकारी)
- **SCN-OFF-01**: Officer conducts surprise camp inspection and checks live cattle headcount vs database ledger.
- **SCN-OFF-02**: Officer audits physical fodder stacks against digital Store/In Farm balance.
- **SCN-OFF-03**: Officer logs geotagged inspection audit report with compliance ratings.
- **SCN-OFF-04**: Officer escalates severe irregularities directly to State Relief Commissioner.

### Persona 5: State Relief Commissioner / Admin (राज्यस्तरीय प्रशासक)
- **SCN-ADM-01**: Admin authenticates to Web Admin Dashboard (`http://localhost:3000`).
- **SCN-ADM-02**: Admin monitors real-time primary KPI cards (`Total Farmers`, `Admitted Cattle`, `Active Camps`, `Utilization %`).
- **SCN-ADM-03**: Admin interacts with GIS vector map, drilling down from State -> District -> Taluka.
- **SCN-ADM-04**: Admin toggles map metrics between `Camps Count`, `Admitted Cattle`, and `Capacity Utilization %`.
- **SCN-ADM-05**: Admin inspects camp operational markers and clicks to view Camp Dossier side panel.
- **SCN-ADM-06**: Admin reviews 8 Power BI analytical tabs (Geographic, Camps, Animals, Vet, Fodder, Finance, Reports).
- **SCN-ADM-07**: Admin exports RFC 4180 CSV compliance audit reports with UTF-8 BOM encoding.

---

## 2. Invariant & Boundary Scenarios

- **SCN-INV-01 (Capacity Saturation)**: Camp configured capacity = 500; current occupancy = 500; 501st admission request blocked.
- **SCN-INV-02 (Anti-Fraud Rule 9.6)**: Offline admission requests blocked; system requires active online authorization.
- **SCN-INV-03 (Dual-Source Fodder Conservation)**: `Store Stock + In Farm Stock == Procured - Consumed`.
- **SCN-INV-04 (NetTopologySuite Polygon Invariant)**: Camp boundaries must form a closed linear ring ($N+1$ points where point 1 equals point $N+1$).
