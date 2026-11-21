# Admin Officer Web Dashboard Understanding Document
**Module:** Admin Officer Web Dashboard & System-Wide Analytics  
**Reference:** [BRD.md](../../ReferanceData/BRD.md) (Web Application), [FSD.md](../../ReferanceData/FSD.md) (Section 5), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
- **Target User:** District Collectors, Animal Husbandry Officers, and State-Level Drought Monitoring Committees.
- **Workflow Context:** The Admin Dashboard provides high-level visibility over the entire district's drought relief efforts. It aggregates metrics across all camps, farmers, animals, veterinary queues, capacity utilization, fodder reserves, and government expenditures.

---

## 2. Functional Requirements & Invariants

### 2.1 System-Wide Summary Analytics
* **Farmer & Animal Metrics:**
  * Total registered farmers
  * Total registered animals
  * Pending veterinary verifications
  * Verified & approved animals
  * Rejected animals
* **Camp & Capacity Utilization:**
  * Total active Chara Chhavani centres
  * Total camp capacity vs active admitted animals
  * District / Taluka-level occupancy percentage
* **Inventory & Financial Metrics:**
  * Total `Store` fodder stock (kg)
  * Total `In Farm` fodder stock (kg)
  * Total fodder procurement amount (INR)
  * Total camp operational expenses (INR)

### 2.2 Geofence Visualization & Camp Management
* Interactive map displaying all registered camp boundaries (GeoJSON polygons) and current capacity status.
* Drill-down by District and Taluka.

---

## 3. Data Flow & API Contracts

### Endpoints
* `GET /api/v1/admin/dashboard`: Returns aggregated system KPIs across all database entities.
* `GET /api/v1/admin/camps-summary`: Returns list of camps with occupancy rates and geofences.
* `GET /api/v1/admin/reports/summary`: Exportable report data aggregating fodder consumption and operational expenses.
