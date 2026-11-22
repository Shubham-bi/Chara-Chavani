# Business Requirement Document (BRD)
## Chara Chhavani Management System (चारा छावणी व्यवस्थापन प्रणाली)

---

### Document Control
- **Document Version**: 1.0.0
- **Author**: Government of Maharashtra / Relief & Rehabilitation Directorate
- **Status**: Approved & Baselined
- **Target Audience**: State Administration, Project Managers, Solution Architects, Lead Developers, Auditing Authorities

---

## 1. Executive Summary & Context
In recurring severe drought situations across Maharashtra (notably Marathwada and Western Maharashtra: Chhatrapati Sambhajinagar, Jalna, Beed, Dharashiv, Solapur, Ahmednagar, Latur, Nanded, Parbhani, Hingoli), farmers face acute shortages of green fodder, dry fodder, and drinking water for cattle. The Government of Maharashtra sanctions and subsidizes **Cattle Relief Camps (चारा छावण्या)** operated by NGOs, APMCs, and Sugar Cooperatives to shelter and feed livestock until monsoon revival.

Historically, manual paper-based registers led to:
- "Ghost cattle" (bogus admissions claimed for government fodder subsidies).
- Multiple camp admissions for the same animal across taluka borders.
- Fodder stock leakages and unauthorized diversion.
- Delayed subsidy disbursements to honest camp operators.

The **Chara Chhavani Management System** is an enterprise-grade digital governance platform mandating GPS polygon geofencing, veterinary pre-admission verification, mobile OTP authentication, and transparent ledger auditing.

---

## 2. Business Objectives
1. **Zero Bogus Admissions**: Eliminate fraudulent subsidy claims through point-in-polygon GPS validation (Rule 9.6) and independent veterinary inspection.
2. **Real-time Subsidy Calculation**: Automate fodder and maintenance expense accounting with exact metric normalization ($1\text{ Quintal} = 100\text{ Kg}$).
3. **Auditing & Public Transparency**: Provide district collectors and state relief commissioners with live executive KPI dashboards and instant RFC 4180 CSV exports.
4. **Farmer Empowerment**: Allow drought-affected farmers to register cattle from their villages using simple mobile OTP logins, without middlemen.

---

## 3. Stakeholder Matrix & Actors

| Stakeholder / Actor | Primary Responsibility | Key Success Metric |
| :--- | :--- | :--- |
| **Drought-Affected Farmer (शेतकरी)** | Registers self and livestock; uploads 7/12 land records. | Smooth OTP registration in <2 mins; zero physical paperwork. |
| **Veterinary Doctor (पशुधन विकास अधिकारी)** | Visits farmer's barn; verifies health, tag, and photo; issues approval. | 100% verified cattle prior to camp admission; zero uninspected admissions. |
| **Camp Operator (छावणी चालक / व्यवस्थापक)** | Admits cattle inside GPS geofence; manages fodder inventory & feeding. | Strict point-in-polygon compliance; non-negative stock balances. |
| **Monitoring Officer (तहसीलदार / कृषी अधिकारी)** | Conducts surprise spot inspections; audits headcount & water supply. | Instant discrepancy detection against system headcount. |
| **State Admin (मदत व पुनर्वसन विभाग / जिल्हाधिकारी)** | Approves camps, monitors capacity utilization, releases subsidies. | Real-time state dashboard; instant Excel audit reports. |

---

## 4. High-Level Business Rules & Policies
1. **Rule BR-01 (Mandatory Veterinary Inspection)**: No animal may be admitted to a cattle camp unless a government veterinary officer has approved the animal following a physical barn visit.
2. **Rule BR-02 (Anti-Fraud Geofencing)**: Animal admission is physically restricted to the registered polygon boundary of the sanctioned camp. Offline admissions are prohibited.
3. **Rule BR-03 (Camp Capacity Enforcement)**: No camp may exceed its government-sanctioned capacity limit.
4. **Rule BR-04 (Metric Standard & Non-Negative Inventory)**: All fodder purchases, stock adjustments, and feedings must be recorded in kilograms, normalized to metric quintals ($1\text{ Q} = 100\text{ kg}$). Available stock must never drop below zero.
5. **Rule BR-05 (Immutable Inspection Audit Trail)**: Spot inspection reports submitted by government officers are immutable and immediately calculate headcount discrepancy $\Delta = \text{Physical} - \text{System}$.
