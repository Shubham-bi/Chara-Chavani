# State Government Audit, Compliance & Reporting Engine - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Principal Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  
**References:**  
- `ReferanceData/BRD.md` (Sections on Drought Relief Accountability & Subsidy Auditing)  
- `ReferanceData/FSD.md` (Section 5.10 "Reports Screen")  
- `ReferanceData/Development-Guidlines.md` (Rule 10 "Audit Trail", Rule 43 "Table and Data Management")  

---

## 1. Business Context & Problem Statement
During severe drought conditions in Maharashtra, state funds are disbursed based on daily cattle occupancy in Chara Chhavanis (Fodder Camps), daily feed consumption ($14\text{ kg}$ dry fodder for large animals, $7\text{ kg}$ for small animals), and operational subsidies (water tankers, labour, electricity).

To prevent fraudulent subsidy claims and ensure complete fiscal transparency:
1. **Admission & Release Audit**: State auditors require an exact day-by-day record of cattle admissions, active days in camp, release dates, and associated farmer identity (Aadhaar & Bank IFSC).
2. **Fodder Stock Reconciliation**: Balance verification between purchased fodder (in Quintals), converted inventory (in Kg), distributed feeding, and documented wastage adjustments.
3. **Operational Expenditure Breakdown**: Itemized expenditure reports filtered by camp, taluka, district, and expense category (water, electricity, labour, transport).
4. **Officer Spot Inspection Audit**: Complete history of field inspections, recorded cattle headcount discrepancies, and hygiene observations.
5. **Government Compliance Export**: Automated CSV data export capability enabling direct import into state treasury and revenue monitoring systems.

---

## 2. Target Users & Stakeholders
- **State Disaster Management Authority (Admin)**: Monitors statewide camp utilization, expenditure, and fodder consumption.
- **District Collectors & Revenue Officers**: Conduct spot audits and verify subsidy billing before sanctioning payments.
- **Camp Operators**: Review daily reconciliation statements to ensure audit readiness.

---

## 3. Functional Requirements & Business Rules

### 3.1 Camp-Wise Admission & Release Report
- Filters: `chhavaniId` (optional), `district` (optional), `startDate`, `endDate`, `status` (`Active`, `Released`).
- Fields:
  - Admission Code / ID
  - Animal Tag Number & Category (Large/Small)
  - Farmer Full Name, Aadhaar (masked except last 4 digits), Mobile Number
  - Admission Date & Geofence GPS Stamping
  - Days in Camp (Active days for subsidy calculation)
  - Release Date (if released) & Release Reason

### 3.2 Fodder Stock Reconciliation Report
- Verifies mathematical balance per camp:
  $$\text{Closing Stock} = \text{Opening Stock} + \text{Purchases} - \text{Feeding} \pm \text{Adjustments}$$
- Fields:
  - Camp Code & Name
  - Fodder Type
  - Total Purchased ($Q$ and $\text{kg}$)
  - Total Fed ($\text{kg}$)
  - Total Adjustments / Wastage ($\text{kg}$)
  - Current Available Store Stock ($\text{kg}$)
  - Current Available In-Farm Stock ($\text{kg}$)

### 3.3 Camp Operational Expense Report
- Filters: `chhavaniId`, `category`, `startDate`, `endDate`.
- Fields:
  - Camp Name, District, Taluka
  - Expense Category
  - Voucher / Invoice Number
  - Amount ($\text{INR}$)
  - Payee Name & Purpose Description
  - Transaction Date

### 3.4 Government Inspection Audit Report
- Filters: `district`, `taluka`, `chhavaniId`, `startDate`, `endDate`.
- Fields:
  - Inspection Date
  - Officer Name & Designation
  - Camp Name
  - Recorded System Cattle Count vs Actual Physical Headcount
  - Headcount Discrepancy ($\Delta$)
  - Water & Fodder Adequacy Flag
  - General Remarks & GPS Coordinates

### 3.5 Automated CSV Export Capability
- Formats reports into RFC 4180 compliant CSV stream with UTF-8 byte order mark (BOM) to support regional Marathi character display in Excel.

---

## 4. API & Contract Specifications

### 4.1 Query Contracts (`CharaChhavani.Application.Admin.DTOs`)
- `AdmissionAuditReportDto`: Itemized admission/release row with farmer details and active days.
- `FodderReconciliationReportDto`: Stock reconciliation balancing purchases, feeding, wastage, and current stock.
- `ExpenseAuditReportDto`: Itemized expense transaction for audit trail.
- `InspectionAuditReportDto`: Field inspection report with physical discrepancy metrics.

### 4.2 WebAPI Endpoints (`AdminController.cs`)
- `GET /api/v1/admin/reports/admissions`: Paginated admission/release report.
- `GET /api/v1/admin/reports/fodder-reconciliation`: Camp fodder balance reconciliation.
- `GET /api/v1/admin/reports/expenses`: Itemized operational expense report.
- `GET /api/v1/admin/reports/inspections`: Government officer inspection audit trail.
- `GET /api/v1/admin/reports/export`: Streams CSV file for the selected report type and filters.

---

## 5. Verification & Quality Acceptance Criteria
1. Backend unit tests cover all report queries and calculation logic (active days calculation, stock reconciliation).
2. All endpoints support server-side pagination, date filtering, and district/camp filtering.
3. CSV generator properly quotes commas, handles nulls, and prepends UTF-8 BOM.
4. `@chara-chhavani/api-client` exposes typed methods for all report endpoints.
5. All 63 existing tests continue to pass with zero regressions.
