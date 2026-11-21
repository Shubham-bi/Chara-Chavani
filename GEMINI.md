# Strict Development & Quality Assurance Rules (Chara Chhavani Project)

These rules are mandatory for all AI agents and developers working in this workspace. Every feature, task, and architectural component must strictly adhere to the cyclical workflow defined below.

---

## 1. The 13-Stage Strict Engineering Lifecycle

For every task or feature, you must strictly follow this exact sequential lifecycle without skipping steps:

```
[1. Understand Requirement]
         │
         ▼
[2. Create Understanding Document]
         │
         ▼
[3. Create Dev Plan & Task List]
         │
         ▼
[4. Execute Implementation]
         │
         ▼
[5. Record Challenges Faced]
         │
         ▼
[6. Finalize Solution & Rationale ("What & Why")]
         │
         ▼
[7. Apply Solution]
         │
         ▼
[8. Verify Feature]
         │
    ┌────┴─────────────────────────────┐
    ▼ (Issues found)                   ▼ (All checks pass)
[9. List Bug(s)]                [13. Sign-off & Move to Next]
    │
    ▼
[10. RCA & CAPA Analysis]
    │
    ▼
[11. Record in RCA/CAPA Log]
    │
    ▼
[12. Re-verify Feature & Safeguards]
    │
    └───► (Loops back to 8 until 100% OK)
```

---

## 2. Stage-by-Stage Mandates & Protocols

### Stage 1: Understand the Requirement
* Inspect business context from `ReferanceData/BRD.md`, `ReferanceData/FSD.md`, and user inputs.
* Identify affected actors (Farmer, Vet Doctor, Officer, Chhavani Operator, Admin).
* Identify technical constraints across layers: React Native (Mobile), ASP.NET Core (Backend), MySQL (Database/GIS).
* Clarify any missing or ambiguous requirements before writing any code.

### Stage 2: Create Understanding Document
* Location: `docs/understanding/<feature_or_module_name>_understanding.md`
* Must include:
  1. Business context and target users.
  2. Functional requirements and business rules.
  3. Data flow & state transitions.
  4. Non-functional requirements (e.g., offline capability, GPS accuracy, geofence latency).
  5. API and entity contracts.

### Stage 3: Create Dev Plan & Task List
* Location: `docs/plans/<feature_or_module_name>_plan.md`
* Must include:
  * High-level architectural approach.
  * Granular, atomic checklist items: `- [ ] Task Name (Scope, target file)`.
  * Dependency order (Database -> Backend API -> Contract Generation -> React Native UI -> Tests).

### Stage 4: Execute Implementation
* Execute strictly according to the task list, checking off items (`- [x]`) as completed.
* Adhere to tech stack best practices:
  * **C# / ASP.NET Core**: Clean Architecture, CQRS/MediatR, FluentValidation, NetTopologySuite for spatial queries.
  * **MySQL**: Proper indexing, spatial indexes on polygons/points, UTF8mb4, transaction safety.
  * **React Native**: Strict TypeScript, modular UI components, offline-first sync considerations.

### Stage 5: Record Challenges Faced
* Location: `docs/logs/challenges_and_solutions.md`
* Document any technical friction, third-party library limitations, edge cases, performance bottlenecks, or environmental quirks encountered during execution.

### Stage 6: Finalize Solution & Rationale ("What & Why")
* Before applying a complex fix or architectural choice, document:
  * **Alternative Options Considered** (Option A, Option B).
  * **Selected Solution** ("What").
  * **Technical Justification** ("Why"): Explain trade-offs, performance, maintainability, and alignment with BRD/FSD.

### Stage 7: Apply Solution
* Implement the finalized solution cleanly across affected files.
* Ensure no regressions or half-implemented changes remain.

### Stage 8: Verify Feature
* Run comprehensive verification:
  * Backend: Unit and integration tests (`dotnet test`), Swagger endpoint execution.
  * Database: Schema and query verification in MySQL.
  * Mobile: React Native component tests, TypeScript type checks (`tsc --noEmit`), lint checks.
* If all verifications pass cleanly with zero issues, proceed directly to **Stage 13**.
* If any defect, discrepancy, or failure is detected, transition to **Stage 9**.

### Stage 9: List the Bug(s)
* Location: Append to `docs/logs/rca_capa_log.md`
* For each bug, detail:
  * **Bug ID & Title**
  * **Severity** (Critical / High / Medium / Low)
  * **Steps to Reproduce**
  * **Expected Behavior vs. Actual Behavior**
  * **Error Logs / Stack Traces**

### Stage 10: Root Cause Analysis (RCA) & CAPA
* **RCA (Root Cause Analysis)**:
  * Use the **5 Whys** method to trace the issue past superficial symptoms to the fundamental architectural, logic, or environment flaw.
* **CAPA (Corrective and Preventive Action)**:
  * **Corrective Action (Immediate)**: Exact fix applied to resolve the immediate bug.
  * **Preventive Action (Long-Term)**: Safeguard added to guarantee this bug cannot re-occur (e.g., new automated regression test, compiler constraint, input validator, or architecture rule).

### Stage 11: Record
* Formally record the complete RCA & CAPA report in `docs/logs/rca_capa_log.md`.

### Stage 12: Verify Again
* Re-run all verification steps:
  1. Verify the bug is resolved.
  2. Verify the preventive safeguard functions as intended.
  3. Run full regression suite to ensure adjacent features remain intact.

### Stage 13: Sign-Off & Move to Next
* Only when Stage 12 is 100% green and verified:
  * Mark the task as completed in the Dev Plan.
  * Commit or archive progress.
  * Move to the next task in the plan, restarting from **Stage 1**.

---

## 3. Directory Layout for Governance Documentation

```
Chara-Chhavani/
├── GEMINI.md                          # Master Workspace Rules (This file)
├── .agents/rules/strict-workflow.md   # Discovery Rule Copy
└── docs/
    ├── understanding/                 # Stage 2: Understanding Documents
    ├── plans/                         # Stage 3: Dev Plans & Checklists
    └── logs/                          # Tracking Logs
        ├── challenges_and_solutions.md# Stage 5 & 6: Challenges & Solutions Log
        └── rca_capa_log.md            # Stage 9, 10 & 11: Bug, RCA & CAPA Log
```
