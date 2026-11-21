# Officer App & Camp Field Inspection Module - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Problem Statement
In drought-affected regions of Maharashtra, the state government establishes and subsidizes Chara Chhavanis (temporary cattle camps) to preserve livestock. Because substantial public subsidies are allocated based on daily cattle count and fodder distribution, rigorous government oversight is mandatory to prevent ghost registrations, subsidy leakages, and inadequate cattle welfare.

Government Officers (Tahasildar, Block Development Officer, District Animal Husbandry Officer, Taluka Agriculture Officer) require dedicated tools to:
1. Register and configure camps and associate verified camp operators/owners.
2. Define and calibrate camp geofence boundaries.
3. Conduct unexpected/routine field inspections with tamper-evident GPS timestamping.
4. Perform physical audit of cattle headcounts against active system enrollments and flag discrepancies immediately.
5. Inspect fodder stocks, drinking water adequacy, and sanitization standards.

---

## 2. Affected Actors
- **Officer (Government Inspector):** Conducts field inspections, verifies headcount, records observations, and registers camps.
- **Chhavani Operator:** Receives inspection visits, presents physical registers, stock, and livestock for audit.
- **District Admin Officer:** Reviews audit trails, discrepancy flags, and inspection reports across talukas.

---

## 3. Functional Requirements & Business Rules

### 3.1 Officer Dashboard
- Aggregate totals of:
  - Total registered camps in taluka/district.
  - Active operators/owners.
  - Total active admitted livestock.
  - Total inspections performed this month.
  - Flagged discrepancies requiring administrative intervention.

### 3.2 Camp Registration & Operator Association
- Register a new camp with:
  - Name, Village, Taluka, District, State.
  - Authorized animal capacity ($N \ge 10$).
  - Camp operator contact details (Name, Mobile, Aadhar/ID).
  - Center coordinates (`Latitude`, `Longitude`).

### 3.3 Camp Geofence Setting
- Define a closed polygon boundary ($[P_1, P_2, \dots, P_N, P_1]$) in WGS84 (SRID 4326).
- Guard against non-closed rings and invalid geometries.

### 3.4 Field Inspection & Cattle Headcount Audit
- **Inspection GPS Verification:** Record the inspector's exact device GPS coordinates (`Point`).
- **Physical Headcount Audit:**
  - Officer counts animals physically in sheds: $C_{physical}$.
  - System captures current active admissions: $C_{system}$.
  - Compute variance: $\Delta = C_{physical} - C_{system}$.
  - If $\Delta \ne 0$, set `DiscrepancyDetected = true`.
- **Fodder & Welfare Checklist:**
  - Water Availability: `Adequate`, `Scarce`, `Critical`.
  - Fodder Stock Assessment: `Satisfactory`, `Deficient`, `Critical`.
  - Shed Cleanliness & Shade: Score 1 to 5.
  - General Findings & Officer Actionable Directives.
- **Immutable Audit Trail:** Inspection reports cannot be edited or deleted once submitted; any subsequent assessment creates a new inspection event.

---

## 4. Entity Schema & API Contracts

### 4.1 New Entity: `CampInspection`
```csharp
public class CampInspection : BaseEntity
{
    public Guid ChhavaniId { get; set; }
    public Guid OfficerId { get; set; }
    public DateTime InspectionDate { get; set; }
    public Point InspectorLocation { get; set; }
    public int PhysicalAnimalCount { get; set; }
    public int SystemAnimalCount { get; set; }
    public int DiscrepancyCount { get; set; }
    public bool DiscrepancyDetected { get; set; }
    public string WaterAvailability { get; set; } // Adequate, Scarce, Critical
    public string FodderStockCondition { get; set; } // Satisfactory, Deficient, Critical
    public int CleanlinessScore { get; set; } // 1 to 5
    public string Remarks { get; set; }
    public string Recommendations { get; set; }

    // Navigation
    public ChhavaniCamp Chhavani { get; set; }
}
```

### 4.2 API Endpoints
- `GET /api/v1/officer/dashboard` -> `OfficerDashboardSummaryDto`
- `POST /api/v1/officer/inspections` -> `RecordCampInspectionCommand` -> `Guid`
- `GET /api/v1/officer/camps/{campId}/inspections` -> `List<CampInspectionSummaryDto>`

---

## 5. Non-Functional Requirements
- **Spatial Precision:** NetTopologySuite with SRID 4326.
- **Audit Tamper-Resistance:** Strict append-only log with database indexing on `(ChhavaniId, InspectionDate)`.
- **Performance:** Sub-100ms response for inspection submission and discrepancy calculation.
