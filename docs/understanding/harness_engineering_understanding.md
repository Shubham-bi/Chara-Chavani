# Harness Engineering System - Understanding Document

## 1. Business Context & Problem Statement
- **Project**: Chara Chhavani (Maharashtra State Government Drought Cattle Relief Camp Management System).
- **Domain**: Mission-critical public welfare, cattle preservation, statutory public funds disbursement, spatial GIS geofencing, and multi-actor rural field operations.
- **The Challenge**:
  - The Chara Chhavani system operates in harsh rural environments where network connectivity is intermittent (2G/3G dead zones), hardware devices vary wildly, and strict government audit scrutiny applies.
  - Traditional unit and E2E tests only verify the "happy path" under ideal conditions. They do not simulate GPS sensor jitter, concurrent admission race conditions at camp gates, network partition during offline sync, or mathematical invariant violations (e.g. Fodder stock deficits, capacity over-allocation, fraudulent offline registrations).
- **What is Harness Engineering?**:
  - **Harness Engineering** is the discipline of creating a deterministic, highly controllable test execution and simulation environment that wraps the entire software system.
  - It acts as an automated "test bed" that injects simulated physical realities (GPS drift, hardware tags, network degradation, external API failures), pushes the system to stress boundaries, and continuously validates strict mathematical invariants and statutory compliance rules without manual intervention.

---

## 2. The 6 Pillars of the Chara Chhavani Test Harness

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CHARA CHHAVANI HARNESS SYSTEM                         │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ 1. GIS & Hardware Simulator   │ 2. Rural Network Chaos Harness              │
│    • GPS Drift & Jitter       │    • 2G/3G Latency & Bandwidth Throttle     │
│    • Geofence Ray-Casting     │    • Packet Drop & Connection Kill          │
│    • RFID / Ear-Tag Scanner   │    • Offline Queue Split-Brain Collision    │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 3. External Gateway Mocks     │ 4. Mathematical Invariants Verifier         │
│    • MahaDBT / PFMS Subsidy   │    • Capacity Bound: Admitted <= Capacity   │
│    • UIDAI Aadhaar Auth Stub  │    • Fodder Mass Conservation Invariant     │
│    • CDAC SMS / OTP Gateway   │    • Ration Allowance Upper Bounds          │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 5. Concurrency & Load Harness │ 6. Unified Runner & Quality Gates           │
│    • Gate Rush Hour Surge     │    • Single-command orchestration           │
│    • Double-Admission Race    │    • Automated CI/CD Regression Gate        │
│    • MySQL Spatial Query Load │    • Comprehensive HTML Diagnostic Report   │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

### Pillar 1: GIS & Hardware Sensor Emulation Harness
- **GPS Simulation**: Simulates walking paths, stationary jitter, multipath reflection errors, and boundary crossing events (e.g., cattle walking in and out of the Paithan camp 50m buffer).
- **Ear-Tag & Biometric Scanner Mock**: Injects virtual barcode/RFID tag reads with checksum validations, simulating damaged, duplicate, or unreadable tags.
- **Camera Watermark Validator**: Injects mock camera frames stamped with tamper-evident metadata (WGS84 lat/long, timestamp, SHA-256 device hash).

### Pillar 2: Rural Network Chaos & Offline Sync Harness
- **Network Degradation Engine**:
  - Simulates 2G (30kbps, 800ms latency), 3G (384kbps, 300ms latency), and complete connection drop.
- **Rule 9.6 Offline Action Queue Stress Tester**:
  - Validates that offline transactions are cryptographically signed with local timestamps and queued securely.
  - Simulates split-brain conflict resolution: e.g., animal marked "deceased" by vet while simultaneously marked "fed" by camp operator offline.

### Pillar 3: External Gateway & Third-Party Mock Harness
- **Direct Benefit Transfer (DBT) / PFMS Mock**:
  - Simulates government treasury banking webhooks (Success, Pending, Account Invalid, Treasury Insufficient Funds).
- **UIDAI Aadhaar Verification Stub**:
  - Deterministic Aadhaar demographic and OTP verification responses.
- **State SMS Gateway Simulator**:
  - Captures OTPs and dispatch alerts in memory for instant verification without SMS cost or network delays.

### Pillar 4: Mathematical Invariant & Anti-Fraud Compliance Verifier
- **Formal System Invariants**:
  $$\text{Invariant 1 (Capacity Bound)}: 0 \le \sum \text{ActiveAdmitted}_{camp} \le \text{Capacity}_{camp}$$
  $$\text{Invariant 2 (Fodder Conservation)}: \text{Stock}_{initial} + \sum \text{Purchased} - \sum \text{Issued} - \sum \text{Spoilage} \equiv \text{Stock}_{current}$$
  $$\text{Invariant 3 (Ration Upper Bounds)}: \text{DailyRation}_{cow} \le 15\text{kg Green} + 6\text{kg Dry} + 3\text{kg Conc}$$
  $$\text{Invariant 4 (Spatial Containment)}: \text{GateGPS} \in \text{ST\_Contains}(\text{CampPolygon}, \text{Point})$$
  $$\text{Invariant 5 (Statutory Rule 9.6)}: \text{OfflineAdmission} \implies \text{Strictly Blocked Until Online Backend Check}$$

### Pillar 5: High-Scale Concurrency & Load Stress Harness
- **Concurrent Gate Admission Surge**: Simulates 100 farmers arriving at the camp gate simultaneously during morning drought relief check-in.
- **Double-Spend Prevention**: Simulates concurrent requests attempting to admit the exact same cattle ear tag (`MH-20-4001`) into two different camps simultaneously.
- **MySQL Spatial Index Stress**: Evaluates query execution latency for `ST_Contains` under 50,000 spatial polygon queries.

### Pillar 6: Unified Harness CLI & CI/CD Quality Gates
- Centralized execution CLI: `npm run harness:test` / `dotnet test --filter Category=Harness`.
- Generates structured JSON and HTML visual diagnostic reports detailing invariant checks, chaos injection outcomes, and latency percentiles (p50, p95, p99).

---

## 3. Architecture & Layering

```
packages/
└── test-harness/                          # Centralized Monorepo Harness Package
    ├── src/
    │   ├── core/                          # Harness Execution Engine & Life-Cycle
    │   │   ├── HarnessEngine.ts           # Orchestrator
    │   │   ├── StateHydrator.ts           # Deterministic DB & Redis state seeder
    │   │   └── InvariantEngine.ts         # Mathematical property checker
    │   ├── simulators/                    # Hardware & Sensor Simulators
    │   │   ├── GpsSensorSimulator.ts      # WGS84 coordinate drift & pathing
    │   │   ├── RfidTagSimulator.ts        # Ear-tag reader emulation
    │   │   └── CameraFrameMock.ts         # Geotagged camera frames
    │   ├── chaos/                         # Network & Failure Injectors
    │   │   ├── NetworkThrottler.ts        # 2G/3G/Offline latency & drop
    │   │   ├── DatabaseChaos.ts           # Connection kill & lock delay
    │   │   └── QueueConflictInjector.ts   # Offline sync race conditions
    │   ├── stubs/                         # External Service Stubs
    │   │   ├── PfmsSubsidyStub.ts         # Banking DBT simulator
    │   │   ├── AadhaarAuthStub.ts         # UIDAI demographic stub
    │   │   └── SmsGatewayStub.ts          # OTP memory buffer
    │   └── invariants/                    # Invariant Rule Definitions
    │       ├── CapacityInvariant.ts       # Camp capacity bounds
    │       ├── FodderMassInvariant.ts     # Fodder balance conservation
    │       └── AntiFraudInvariant.ts      # Rule 9.6 verification
    └── tests/                             # Harness Test Scenarios
```
