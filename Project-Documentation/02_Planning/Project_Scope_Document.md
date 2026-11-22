# Project Scope Document

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Prepared By:** Product & Delivery Management Office  
**Target Organization:** Department of Relief & Rehabilitation, Govt. of Maharashtra  

---

## 1. Project Purpose & Background

Due to recurrent severe drought across Marathwada and Vidarbha regions, the Government of Maharashtra authorizes temporary cattle camps (*Chara Chhavani*) to feed, shelter, and provide veterinary care to lakhs of drought-affected livestock. Historically, manual register-based camp administration suffered from delayed subsidy disbursals, ghost animal registrations, fodder misappropriation, and lack of real-time visibility for district collectors.

The **Chara Chhavani Digital Platform** is commissioned to provide end-to-end transparency, real-time geofenced cattle tracking, digital inventory control, automated veterinary logs, and tamper-proof subsidy disbursement calculations.

---

## 2. In-Scope Modules & Capabilities

### 2.1 Camp Lifecycle & Geofencing Management
* Digital application, verification, and approval workflow for establishing cattle camps by NGOs/Sugar Factories/APMCs.
* Polygon-based GIS geofencing boundary definition (SRID 4326) with minimum 3-point vertices and surface area validation.
* Real-time GPS verification of field operators during critical state transitions.
* Active camp status lifecycle: `Submitted` $\rightarrow$ `Verified` $\rightarrow$ `Approved` $\rightarrow$ `Active` $\rightarrow$ `Suspended` $\rightarrow$ `Closed`.

### 2.2 Farmer & Cattle Registration & Admission
* Farmer profile capture with Aadhaar verification, bank account details (IFSC, Account Number), land records, and 7/12 extract attachments.
* Cattle admission with mandatory individual Ear-Tag (RFID/Barcoded) indexing, breed categorization (Large/Small/Calf), and health triage.
* **Strict Invariant (Rule 9.6):** Real-time online validation inside the camp geofence for all Admissions and Releases.

### 2.3 Daily Operations: Fodder & Water Distribution
* Daily distribution logging per animal category (Dry fodder, Green fodder, Concentrates, Water supply).
* Metric normalization: Standardized strictly at $1 \text{ Quintal} = 100 \text{ Kg}$.
* Inward inventory tracking: Supplier delivery challan capture, moisture loss deductions, and digital weighbridge receipts.
* Offline distribution logging enabled for remote edge regions with automated idempotency-keyed sync queues.

### 2.4 Veterinary Health & Disease Surveillance
* Mobile veterinary doctor diary: Daily rounds, vaccinations, deworming, injury treatments, and quarantine ward assignments.
* Cattle mortality logging with mandatory post-mortem photographic evidence, ear-tag de-activation, and carcass disposal certification.
* Epidemic breakout alerts triggered automatically when contagious diseases (e.g., Lumpy Skin Disease, Foot & Mouth Disease) exceed local threshold.

### 2.5 Field Inspections & Statutory Audit
* Taluka and District Officer surprise inspections with geotagged photo capture and biometric verification.
* Automated tally discrepancies between reported camp headcounts and physical officer headcounts.
* Statutory reporting engine exporting audit-compliant CSV reports with UTF-8 BOM (`\uFEFF`) in regional Marathi (Devanagari) script.

### 2.6 Financial Calculations & Subsidy Disbursals
* Automated calculation of daily government subsidies based on verified animal headcounts and official GR rates.
* Deductions and penalties automatically applied for unverified livestock or inspection shortfalls.
* Treasury export generation for direct benefit transfer (DBT) to camp operators' verified bank accounts.

---

## 3. Out-of-Scope (Explicit Exclusions)

To maintain project boundaries and ensure on-time delivery, the following items are strictly out-of-scope for Version 1.0.0:

1. **Hardware Manufacturing:** Production, calibration, or distribution of physical RFID ear tags, handheld RFID scanners, or weighbridge hardware.
2. **Satellite Remote Sensing:** Autonomous satellite radar analysis of green biomass / fodder crop availability in surrounding agricultural land.
3. **Livestock Commercial Trading:** Marketplace or auctioning features for sale, purchase, or breeding of cattle between farmers.
4. **Interstate Transit Permits:** Interstate cattle transport permits or border check-post taxation systems.
5. **Direct Banking Integration:** Real-time direct clearing house (RBI-NEFT/RTGS) execution from within the mobile app; system produces treasury-formatted payment files for upload to the government Koshwahini portal.

---

## 4. Key Deliverables & Artifacts

| Deliverable ID | Phase | Artifact Name | Target Audience |
|---|---|---|---|
| **DEL-01** | Requirements | BRD, SRS, FRD, NFR, User Stories, BDD Acceptance Criteria | All Stakeholders |
| **DEL-02** | Planning | Project Plan, Risk Assessment, Scope Document, RTM, Feasibility Report | Management, PMO |
| **DEL-03** | Architecture & Design | HLD, LLD, Database Schema (MySQL), API OpenAPI Spec, UI/UX Guidelines | Engineering & QA |
| **DEL-04** | Core Engine | ASP.NET Core 8 WebAPI (.NET 8 Clean Architecture, NetTopologySuite) | DevOps & Backend |
| **DEL-05** | Web Admin Portal | Multi-tenant Web Administration Portal (`apps/web-admin`) | District Officers & Admins |
| **DEL-06** | Mobile Applications | Cross-platform React Native Mobile Apps (Camp Operator & Vet Doctor) | Camp Operators & Vets |
| **DEL-07** | Quality Assurance | Test Strategy, Test Execution Reports, Automation Framework, E2E Smoke Tests | QA & Certification |
| **DEL-08** | Release & Ops | Dockerized Deployment, Rollback Plan, Release Notes, Monitoring Runbook | SysAdmins & DevOps |

---

## 5. Acceptance & Scope Sign-Off Criteria

1. **Zero Data Loss:** 100% preservation of offline distribution ledgers upon synchronization.
2. **Geofence Accuracy:** Server-side geofence boundary calculation accuracy within $< 2\text{ meters}$ using SRID 4326.
3. **Statutory Compliance:** CSV exports opened in Microsoft Excel on Windows machines render regional Devanagari text cleanly without mojibake.
4. **Performance Benchmark:** P95 response time $< 250\text{ ms}$ for API transactions at 1,000 concurrent mobile requests.

---

## 6. Document Approval

* **Project Sponsor:** Divisional Commissioner, Chhatrapati Sambhajinagar Division  
* **Lead Solutions Architect:** Lead Enterprise Architect  
* **Date of Approval:** 2026-11-21
