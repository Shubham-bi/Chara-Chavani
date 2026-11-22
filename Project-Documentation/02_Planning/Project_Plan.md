# Project Plan & Work Breakdown Structure (WBS)
## Chara Chhavani Management System

---

## 1. Project Overview & Timeline
- **Project Duration**: 16 Weeks (4 Phases / 8 Sprints)
- **Methodology**: Agile Scrum with strict cyclical engineering governance (Stage 1 to 13)
- **Target Launch**: Prior to peak pre-monsoon drought window (April 2026)

---

## 2. Work Breakdown Structure (WBS)

```
1.0 Core Platform & Foundation (Sprint 1-2)
  1.1 Database Architecture & NetTopologySuite Spatial GIS Setup
  1.2 ASP.NET Core (.NET 8) Clean Architecture Scaffolding
  1.3 Master Reference Data Seeding (Districts, Talukas, Breeds, Fodder Types)
  1.4 Security & Authentication (Mobile OTP + Admin Password)

2.0 Field Operations & Mobile Suite (Sprint 3-4)
  2.1 Farmer Mobile App (Profile, Landholding, Animal Registration, My Animals)
  2.2 Vet Doctor App (Barn Inspection Queue, Approval/Rejection, Certificates)
  2.3 Camp Operator App (Admissions, Point-in-Polygon Geofencing, Releases)
  2.4 Officer App (Inspection Form, Headcount Discrepancy, Water/Fodder Audits)

3.0 Inventory, Financials & Reporting Engine (Sprint 5-6)
  3.1 Fodder Procurement & Metric Normalization (1 Q = 100 kg)
  3.2 Daily Feeding Distribution & Non-Negative Inventory Ledger
  3.3 Itemized Operational Expense Tracker (Government Subsidy Codes)
  3.4 Streaming Audit Engine with RFC 4180 CSV & UTF-8 BOM Encoding

4.0 Governance, Verification & Production Rollout (Sprint 7-8)
  4.1 Web Admin Interactive Dashboard (DOM Data Binding, Progress Bars)
  4.2 Containerization & Multi-Service Compose Orchestration
  4.3 Automated Smoke Test & End-to-End Regression Verification
  4.4 Phased Regional Pilot Launch (Chhatrapati Sambhajinagar, Jalna, Beed)
```

---

## 3. Sprint Schedule & Major Milestones

| Sprint | Weeks | Key Deliverables | Quality Gate Target |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | Wk 1–2 | MySQL Schema, Spatial Indexes, MediatR CQRS, Master Data APIs | Unit tests pass >90% |
| **Sprint 2** | Wk 3–4 | Mobile OTP Auth, Admin Login, NetTopologySuite Polygon Geofence Engine | Ray-casting inside/outside validated |
| **Sprint 3** | Wk 5–6 | Farmer Mobile App, Vet Verification workflow & offline draft queue | Mobile session tests 100% green |
| **Sprint 4** | Wk 7–8 | Rule 9.6 Online Admission Enforcement, Animal Release, Gate pass receipt | Geofence rejection verified |
| **Sprint 5** | Wk 9–10 | Fodder stock weighbridge entry, Daily feeding balance safeguards | Non-negative inventory verified |
| **Sprint 6** | Wk 11–12 | Officer spot inspection checklist, Discrepancy detector, CSV report engine | Excel Devanagari UTF-8 BOM verified |
| **Sprint 7** | Wk 13–14 | Web Admin Interactive Dashboard, Docker multi-container stack | 67/67 unit tests + 19/19 smoke tests green |
| **Sprint 8** | Wk 15–16 | Production readiness sign-off, Security audit, District Pilot Rollout | Formal Stage 13 sign-off |
