# Risk Assessment & Mitigation Plan (Chara Chhavani)

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead Enterprise Solutions Architect & Delivery Manager  
**Reviewed By:** District Collectorate Tech Advisory Board & QA Lead  

---

## 1. Executive Summary & Purpose

The Chara Chhavani platform manages drought-relief cattle camps across Maharashtra. Because the system directly governs statutory animal admissions, fodder allocations, biometric tag registrations, medical health records, and multi-crore DBT (Direct Benefit Transfer) subsidy disbursements, operational failure or fraudulent activities pose high financial, legal, and humanitarian risks.

This document systematically categorizes, assesses, scores, and establishes mitigation and contingency protocols for all identified technical, architectural, operational, security, and governance risks.

---

## 2. Risk Assessment Methodology & Scoring Matrix

Risks are evaluated using standard enterprise qualitative and quantitative risk matrix scoring:
$$\text{Risk Score} = \text{Probability (1–5)} \times \text{Impact (1–5)}$$

* **Severity Tiers:**
  * **Critical (Red: 16–25):** Immediate system or fiscal integrity threat; mandatory automated guardrails and manual executive oversight required.
  * **High (Orange: 10–15):** Substantial operational impact or data consistency risk; strict automated mitigation required.
  * **Medium (Yellow: 5–9):** Moderate business degradation; standard procedural controls.
  * **Low (Green: 1–4):** Negligible impact; acceptable residual risk.

---

## 3. Comprehensive Risk Matrix

| Risk ID | Category | Risk Description | Probability (1-5) | Impact (1-5) | Score | Risk Tier | Primary Mitigation Strategy | Residual Risk |
|---|---|---|---|---|---|---|---|---|
| **RSK-SEC-01** | Security / Fraud | **GPS Spoofing / Mock Location Fraud:** Camp operators manipulate GPS to fake animal presence outside genuine camp boundaries. | 4 | 5 | **20** | **Critical** | Native Android Mock Location API detection (`isFromMockProvider`), cell tower triangulation corroboration, and strict NetTopologySuite polygon validation on server. | Low |
| **RSK-OPR-02** | Operational / Integrity | **Offline Ghost Animal Admissions:** Operators claim offline network failure to batch-admit non-existent or duplicate cattle without real-time checks. | 4 | 5 | **20** | **Critical** | **Rule 9.6 Anti-Fraud Invariant:** Animal Admission and Release transactions are strictly forbidden while offline. Real-time online validation against central database is enforced. | Low |
| **RSK-DAT-03** | Data / Financial | **Duplicate Tag Registration:** Re-using RFID/Ear-tag numbers across multiple camps or re-admitting released animals under duplicate profiles. | 3 | 5 | **15** | **High** | Unique composite database constraint on `(TagNumber, State)` and distributed Redis cache check with immediate rejection if tag is active in any camp. | Low |
| **RSK-TEC-04** | Connectivity / Infrastructure | **Rural Network Outage (Edge Disconnection):** Severe 2G/3G network drops in remote drought talukas preventing daily feeding and health logs. | 5 | 3 | **15** | **High** | Offline SQLite-backed persistence queue for daily fodder distribution and vet health logs with deterministic UUID idempotency keys for reconciliation. | Low |
| **RSK-INT-05** | Integration / UI | **Devanagari Marathi Font Mojibake in Excel:** Statutory revenue reports exported to CSV appearing corrupt in Microsoft Excel on government workstations. | 4 | 3 | **12** | **High** | Mandatory UTF-8 Byte Order Mark (`\uFEFF`) prepended to all HTTP CSV streaming endpoints (`ExportFeedingCsv`, `ExportInspectionCsv`, etc.). | Very Low |
| **RSK-UI-06** | Mobile / UX | **Devanagari Matra Clipping on Low-End Devices:** Marathi diacritics cut off on 4.5"–5" budget Android phones running non-standard vendor ROMs. | 4 | 2 | **8** | **Medium** | Strict typography rules in `@chara-chhavani/ui-core`: $\text{lineHeight} \ge 1.35 \times \text{fontSize}$ enforced globally across all text rendering tokens. | Very Low |
| **RSK-PERF-07**| Performance / Scale | **Morning Inspection Concurrency Spike:** 500+ taluka officers and operators synchronizing morning feeding tallies simultaneously between 08:00–10:00 AM. | 3 | 4 | **12** | **High** | Read-optimized CQRS query handlers, MySQL connection pooling (Max Pool Size = 150), and Redis caching of camp polygons and master lookups. | Low |
| **RSK-ENV-08** | Environment / Deployment | **Host OS Variable Collisions:** Service initialization crashes when loading configuration due to host OS variable hijacking (e.g. Windows `USERNAME`). | 3 | 3 | **9** | **Medium** | `EnvLoader.cs` reads `.env` configuration file directly and overrides environment variables without relying on ambient shell environment defaults. | Low |
| **RSK-SEC-09** | Security / Auth | **JWT Token Theft & Privilege Escalation:** Compromised operator credentials used to access District Officer inspection approval or subsidy disbursement routes. | 2 | 5 | **10** | **High** | Role-based authorization (`[Authorize(Roles = "DistrictOfficer,SuperAdmin")]`), HMAC-SHA256 signature verification, and 8-hour token expiry with sliding refresh. | Very Low |
| **RSK-GOV-10** | Legal / Compliance | **Inaccurate DBT Subsidy Calculation:** Divergence in fodder conversion rates (Kg vs Quintal) leading to treasury overpayment or underpayment. | 2 | 5 | **10** | **High** | Strict domain normalization ($1 \text{ Quintal} = 100 \text{ Kg}$) enforced at database schema (`DECIMAL(12, 2)`) and Application Layer invariants. | Zero |

---

## 4. Deep-Dive Analysis of Critical & High Risks

### 4.1 RSK-SEC-01 & RSK-OPR-02: Geofencing & Ghost Admission Fraud

#### Problem Statement
In drought relief operations, dishonest camp organizers might attempt to collect per-cattle daily subsidies by creating "ghost records" without physical animals inside the camp boundaries, or claiming admissions when outside the camp area.

#### Multi-Tier Defense Architecture
1. **Client-Side (React Native / Android):**
   * Detection of Android `Location.isFromMockProvider()` or `Location.getExtras().getBoolean("mockLocation")`.
   * Accuracy threshold enforcement: Reject location fixes where horizontal accuracy $> 25\text{ meters}$.
2. **Server-Side Enforcement (ASP.NET Core WebAPI):**
   * Raw coordinates $(Lat, Long)$ passed in request payload are mapped to a NetTopologySuite geometry point with SRID 4326:
     ```csharp
     var userLocation = geometryFactory.CreatePoint(new Coordinate(command.Longitude, command.Latitude));
     var isInside = camp.BoundaryPolygon.Contains(userLocation);
     if (!isInside) throw new GeofenceViolationException("Operation attempted outside authorized camp boundary.");
     ```
3. **Rule 9.6 Hard Invariant:**
   * Offline animal admission and offline animal release are permanently disabled in client business logic. The application displays a mandatory modal informing the operator that cellular data is required to verify real-time tag registry.

---

### 4.2 RSK-DAT-03: Duplicate Cattle Tagging Fraud

#### Threat Vector
An ear-tag (RFID/visual barcode) assigned to Animal $A$ in Camp 1 could be entered again in Camp 2, or re-admitted after release to artificially inflate camp occupancy counts.

#### Mitigation Protocol
* Unique index `UX_Animals_TagNumber_Active` in MySQL ensures no tag can exist simultaneously in `Active`, `Admitted`, or `InQuarantine` states.
* Cross-camp real-time validation:
  ```sql
  SELECT COUNT(1) FROM Animals 
  WHERE TagNumber = @TagNumber AND Status NOT IN ('Deceased', 'Released');
  ```
* If count $> 0$, the WebAPI immediately responds with `409 Conflict` and logs a security alert event for audit.

---

### 4.3 RSK-TEC-04: Network Instability in Rural Talukas

#### Threat Vector
Cattle camps are predominantly situated in parched rural regions with intermittent cellular coverage. If operators cannot log daily feeding or vet treatments, paper ledgers will be reintroduced, breaking auditability.

#### Mitigation Protocol
* **Two-Track Capability Architecture:**
  * *Track 1 (Online Only):* Animal Admission, Animal Release, Bank Account Modifications, Expense Approvals (Zero tolerance for offline state).
  * *Track 2 (Offline First):* Daily Fodder Distribution, Daily Water Supply Logs, Veterinary Health Checks, Mortality Logs.
* Offline entries are stored in encrypted client-side SQLite/WatermelonDB storage with:
  * Client-generated UUID v4 as Idempotency Key.
  * Local timestamp + GPS coordinate at capture time.
  * Sync queue manager automatically flushes payloads in sequential order once connectivity is restored.

---

## 5. Contingency & Disaster Recovery Plan

| Scenario | Trigger Condition | RTO (Recovery Time Objective) | RPO (Recovery Point Objective) | Disaster Recovery Procedure |
|---|---|---|---|---|
| **Primary MySQL Database Failure** | Unresponsive for $> 60\text{ seconds}$ | $< 15\text{ minutes}$ | $< 1\text{ minute}$ | Automated failover to Multi-AZ Read Replica. DNS endpoint updated. |
| **API Host Server Outage** | 3 consecutive health probe failures | $< 5\text{ minutes}$ | $0$ | Auto-healing container restart in Docker/Kubernetes cluster. |
| **Corrupted Subsidy Ledger Batch** | Discrepancy detected during night reconciliation | $< 2\text{ hours}$ | $0$ (Auditable rollback) | Execute compensating transactions using the immutable event audit log. Re-calculate totals using ledger snapshots. |

---

## 6. Document Sign-Off

| Stakeholder Role | Name | Signature / Status | Date |
|---|---|---|---|
| Chief Technology Officer | Dr. A. V. Deshmukh | **APPROVED** | 2026-11-20 |
| Lead Enterprise Architect | S. Joshi | **APPROVED** | 2026-11-20 |
| Principal QA & Security Engineer | P. Nair | **APPROVED** | 2026-11-20 |
| Revenue & Relief Commissionerate Rep | V. K. Patil (IAS) | **APPROVED** | 2026-11-21 |
