# Master Test Strategy Document

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-STR-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Executive Summary & Objective

The primary objective of the Chara Chhavani QA strategy is to guarantee that the multi-tier disaster relief management system operates with 100% data integrity, zero fraudulent livestock claims, reliable offline queue synchronization, sub-second geofence boundary calculation, and flawless Power BI administrative visualization.

This strategy governs all testing activities across:
1. **Four React Native Mobile Applications**: Farmer, Veterinary Doctor, Camp Operator, Government Officer.
2. **State Relief Web Admin Dashboard**: Power BI analytical shell with interactive SVG Maharashtra vector map.
3. **ASP.NET Core WebAPI Core**: .NET 8 Clean Architecture with CQRS, MediatR, and NetTopologySuite GIS geometry.
4. **Database & Storage Layer**: MySQL 8.0 with spatial indexing (`SPATIAL INDEX`), transactional stock ledgers, and foreign key constraints.
5. **Hardware & Emulator Devices**: LDPlayer 14 Android Emulator, physical mobile devices, and desktop/mobile browser viewports.

---

## 2. Test Pyramid & Scope Allocation

```
             ▲
            / \
           /   \     E2E Multi-Actor Workflows (Playwright & LDPlayer)
          / E2E \    ~10% of total test effort
         /───────\
        /   API   \   API Integration & Contract Testing (Postman/Playwright)
       /Integration\  ~30% of total test effort
      /─────────────\
     /     Unit &    \ Unit, Spatial Invariants & Domain Tests (xUnit & Jest)
    /    Component    \ ~60% of total test effort
   /───────────────────\
```

### Level 1: Unit & Component Testing
- **Backend**: xUnit, FluentAssertions, Moq. Validates entity invariants, domain models, MediatR command handlers, and ray-casting algorithms.
- **Frontend / Mobile**: Jest, React Native Testing Library. Validates UI state transitions, input masks, and offline storage queues.

### Level 2: API & Integration Testing
- **Contract Testing**: Swagger / OpenAPI validation to ensure zero frontend-backend drift.
- **Spatial Calculations**: Point-in-polygon verification using MySQL `ST_Contains()` and NetTopologySuite `Polygon.Contains(Point)`.
- **Database Transaction Safety**: Rollbacks during simultaneous over-capacity admissions or insufficient stock feeding.

### Level 3: End-to-End (E2E) & System Automation
- **Playwright Automation**: Page Object Model (POM) testing across Desktop Chrome, Pixel 5 (Mobile Chrome), and iPhone 13 (Mobile Safari).
- **Android Emulator Automation**: LDPlayer 14 testing via ADB bridge and MCP LDPlayer driver.
- **Statutory Audit Exports**: RFC 4180 CSV export validation with UTF-8 BOM encoding.

---

## 3. The Five Quality Gates (Per `QA roles.md`)

No feature or release progresses without satisfying the 5 Quality Gates:

| Quality Gate | Threshold Criteria | Validation Tooling |
|---|---|---|
| **Gate 1: Code Hygiene** | 0 ESLint errors, 0 Roslyn compiler warnings/errors, 0 TypeScript errors | `npm run lint:all`, `npm run typecheck` |
| **Gate 2: Unit & Spatial** | 100% tests passing (67/67 .NET unit tests, spatial ring closure) | `dotnet test backend/CharaChhavani.sln` |
| **Gate 3: Automation (POM)** | 100% Playwright tests passing across Desktop and Mobile viewports | `npm run test:playwright` |
| **Gate 4: Anti-Fraud & Security** | Rule 9.6 enforced (No offline cattle admission), JWT auth valid | Regression Test Suite |
| **Gate 5: Smoke & Production** | 19/19 smoke tests green, CSV exports valid UTF-8 BOM | `scripts/e2e_smoke_test.ps1` |

---

## 4. Test Types & Governance

1. **Functional Testing**: Validates that all features behave according to BRD and FSD specifications.
2. **Geofence Boundary Testing**: Ray-casting containment across polygon vertices, centroid, and outer edge points.
3. **Concurrency Testing**: Multiple cattle admissions competing for the final remaining camp slot.
4. **Dual-Source Stock Math**: Mathematical reconciliation (`Store Stock + In Farm Stock == Procured - Consumed`).
5. **Usability & Localization**: Multilingual Marathi and English labels, high-contrast badges, responsive layouts.
6. **Performance & Load**: API responses < 500ms, GIS spatial checks < 100ms.
7. **Security & Vulnerability**: Role-based access control, parameterized SQL queries, prevention of GPS spoofing.
