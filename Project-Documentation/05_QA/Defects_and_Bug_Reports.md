# Defects & Bug Reports Document

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-DEF-001  
**Version:** 1.0.0  
**Status:** Maintained  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Defect Severity & Priority Classification

| Severity Level | Definition | SLA for Resolution | Escalation Authority |
|---|---|---|---|
| **S1 - Critical (Blocker)** | System crash, data corruption, unauthorized relief fund disbursement, or bypass of spatial geofence validation. | Immediate (< 4 hours) | State Relief Commissioner |
| **S2 - High** | Major business feature non-functional with no workaround (e.g. Failure of mobile OTP delivery, offline admission queue hang). | < 24 hours | Technical Project Manager |
| **S3 - Medium** | Feature failure with an acceptable operational workaround (e.g. Export CSV filter ordering mismatch, visual map legend rendering delay). | < 3 business days | QA Lead / Dev Lead |
| **S4 - Low (Trivial)** | Minor cosmetic, styling, Marathi typography, or UI alignment imperfection. | Next scheduled sprint | Front-End Lead |

---

## 2. Standard Defect Report Template

```markdown
### Bug ID: BUG-[MODULE]-[NUMBER]
- **Title**: Brief descriptive defect summary
- **Severity**: S1 / S2 / S3 / S4
- **Priority**: P0 / P1 / P2
- **Environment**: Local / Staging / Production (OS, Browser, Device)
- **Preconditions**: Required system state before reproduction
- **Steps to Reproduce**:
  1. Step 1
  2. Step 2
  3. Step 3
- **Expected Behavior**: What the system should do per BRD/FSD
- **Actual Behavior**: What actually occurred (include error codes/logs)
- **Root Cause Analysis (RCA)**: 5-Whys analysis
- **Corrective & Preventive Action (CAPA)**: Immediate fix and regression safeguard
- **Status**: New / In-Progress / Resolved / Verified / Closed
```

---

## 3. Historical Defect Resolution Log

### BUG-SPATIAL-001: NetTopologySuite Geometry LinearRing Coordinate Closure
- **Severity**: S1 (Critical) | **Priority**: P0 | **Status**: Verified & Closed
- **Description**: Submitting 4-coordinate polygon from mobile map drawing tool caused `TopologyException` due to unclosed linear ring.
- **Root Cause**: Mobile UI sent $N$ vertices without repeating the first vertex at the end; NetTopologySuite requires $N+1$ points where point 1 equals point $N+1$.
- **Fix (CAPA)**: Automated backend ring closure in `ChhavaniCampCommandHandler` and unit test guard in `ChhavaniCampTests.cs`.

### BUG-INVENTORY-002: EF Core Navigation Null Reference in Fodder Stock Aggregation
- **Severity**: S2 (High) | **Priority**: P1 | **Status**: Verified & Closed
- **Description**: `GetGeographicDistributionQuery` threw `NullReferenceException` when grouping by `s.Chhavani.Name` on un-included entities.
- **Root Cause**: EF Core projection lacked `.Where(s => s.Chhavani != null)` null-guard filter.
- **Fix (CAPA)**: Added defensive null-check filter in LINQ aggregation and unit test in `AdminAnalyticsQueryTests`.

### BUG-E2E-003: Smoke Test PowerShell Terminator Exception on Network Retries
- **Severity**: S2 (High) | **Priority**: P1 | **Status**: Verified & Closed
- **Description**: `scripts/e2e_smoke_test.ps1` terminated abruptly with `NullReferenceException` when checking `$health.data.service` before verification.
- **Root Cause**: PowerShell `$ErrorActionPreference = "Stop"` aborted execution on null sub-properties before assertion evaluation.
- **Fix (CAPA)**: Applied safe ternary null-coalescing across all 19 assertions in smoke test runner.
