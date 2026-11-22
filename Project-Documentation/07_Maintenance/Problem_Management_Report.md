# Problem Management & Known Error Database (KEDB)

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Framework:** ITIL Problem Management  
**Custodian:** Lead Enterprise Architect & Quality Assurance Lead  

---

## 1. Problem Management vs Incident Management

* **Incident Management:** Focuses on restoring normal service operations as rapidly as possible (e.g. rebooting container, falling back to read replica).
* **Problem Management:** Focuses on analyzing recurring patterns, determining structural root causes, implementing permanent architectural fixes, and maintaining the **Known Error Database (KEDB)**.

---

## 2. Known Error Database (KEDB)

The KEDB documents structural errors, known environmental behaviors, and certified workarounds for field engineers and support teams:

| Problem ID | Component | Symptom | Root Cause | Workaround / Permanent Solution |
|---|---|---|---|---|
| **PRB-001** | Configuration / Windows Host | WebAPI fails on startup or binds to unexpected user database. | Host OS ambient environment variables (such as Windows `USERNAME` or `COMPUTERNAME`) collide with app configuration keys. | **Permanent Fix:** `EnvLoader.cs` reads `backend/.env` directly and overrides memory variables, isolating app from shell environment. |
| **PRB-002** | Export Service / Excel | Marathi Devanagari text in exported CSV files displays corrupted characters (mojibake) when opened in Microsoft Excel on Windows. | Microsoft Excel defaults to Windows-1252 ANSI encoding unless a UTF-8 Byte Order Mark (`\uFEFF`) is explicitly present at the byte stream start. | **Permanent Fix:** All CSV export endpoints in `ExportController.cs` prepend `\uFEFF` before streaming tabular records. |
| **PRB-003** | Mobile Client / React Native | Upper and lower Marathi diacritic marks (matras and u-kars) get clipped off vertically on small-screen Android devices. | React Native / Yoga layout engine calculates font bounds based on Latin baselines without vertical padding for Devanagari extensions. | **Permanent Fix:** `@chara-chhavani/ui-core` enforces $\text{lineHeight} \ge 1.35 \times \text{fontSize}$ globally across all typography tokens. |
| **PRB-004** | Field Operations / Connectivity | Camp operators in remote rural talukas experience network failure while trying to admit cattle. | Intermittent 2G cellular coverage at drought camp sites. | **Structural Invariant (Rule 9.6):** Animal admission CANNOT be performed offline due to anti-fraud policy. Operator must move to a verified online spot within the camp geofence. Routine feeding logs use SQLite queue. |
| **PRB-005** | Master Data Routing | WebAdmin and client apps received HTTP 404 on `/api/v1/master` routes. | ASP.NET Core controller named `MasterDataController` resolved by convention to `/api/v1/masterdata`. | **Permanent Fix:** Added dual routing attributes `[Route("api/v1/master")]` and `[Route("api/v1/masterdata")]` to `MasterDataController.cs`. |

---

## 3. Recurring Pattern Surveillance & Review Cadence

The Problem Management board convenes bi-weekly to review:
1. All P1 and P2 incidents logged during the preceding 14 days.
2. Recurring error logs grouped by trace identifier in Serilog / CloudWatch.
3. Discrepancies reported by Taluka Revenue Officers during physical camp audits.
4. Identification of items to transition from "Known Error with Workaround" to "Architectural Backlog Item" for permanent code refactoring.
