# Harness Engineering Implementation Plan & Roadmap

## 1. High-Level Architectural Approach
The goal is to introduce a **Production-Grade Harness Engineering Framework** for the Chara Chhavani project to test the system under extreme rural field conditions, enforce mathematical invariants, simulate hardware sensors, and inject network chaos.

The implementation is structured into **5 Sequential Phases**:
- **Phase 1**: Harness Foundation & Package Scaffolding (`packages/test-harness`)
- **Phase 2**: GIS & Hardware Sensor Emulation Harness (GPS Drift, RFID/Ear-Tag, Camera Watermarks)
- **Phase 3**: Rural Network Chaos & Offline Synchronization Harness (2G/3G throttles, connection drops, Rule 9.6 queue validation)
- **Phase 4**: Mathematical Invariants & Anti-Fraud Compliance Verifier (Capacity bounds, fodder conservation, ration caps)
- **Phase 5**: Concurrency Stress & Unified CI/CD Quality Gate (Gate rush surge, race prevention, HTML reporting)

---

## 2. Granular Phased Task Checklist

### Phase 1: Harness Foundation & Package Scaffolding
- [ ] Task 1.1: Create monorepo package `packages/test-harness` with `package.json`, `tsconfig.json`, and directory hierarchy (`src/core`, `src/simulators`, `src/chaos`, `src/stubs`, `src/invariants`).
- [ ] Task 1.2: Implement `HarnessEngine.ts` to manage harness lifecycle (setup, teardown, environment health checks).
- [ ] Task 1.3: Implement `StateHydrator.ts` connecting to WebAPI/Database to seed deterministic initial states (camps, quotas, balances).

### Phase 2: GIS & Hardware Sensor Emulation Harness
- [ ] Task 2.1: Implement `GpsSensorSimulator.ts` capable of generating stationary Gaussian jitter, linear walking paths, and geofence boundary crossing trajectories.
- [ ] Task 2.2: Implement `RfidTagSimulator.ts` to simulate 12-digit ear-tag barcode scans, invalid checksums, and duplicate tag collisions.
- [ ] Task 2.3: Implement `CameraFrameMock.ts` generating geotagged JPEG metadata with WGS84 coordinates, timestamp, and SHA-256 integrity hash.
- [ ] Task 2.4: Integrate with `tools/mcp-ldplayer` so simulated hardware GPS coordinates can be injected directly into the LDPlayer 14 Android Emulator.

### Phase 3: Rural Network Chaos & Offline Synchronization Harness
- [ ] Task 3.1: Implement `NetworkThrottler.ts` using Playwright CDP (`Network.emulateNetworkConditions`) and HTTP proxy to simulate 2G (30kbps / 800ms delay), 3G (384kbps / 300ms delay), and complete offline mode.
- [ ] Task 3.2: Implement `QueueConflictInjector.ts` to test Rule 9.6: simulate an operator attempting offline animal admission and verify strict backend rejection.
- [ ] Task 3.3: Implement Split-Brain Sync scenario: simulate concurrent offline updates to livestock status and assert transactional conflict resolution.

### Phase 4: Mathematical Invariants & Anti-Fraud Compliance Verifier
- [ ] Task 4.1: Implement `CapacityInvariant.ts` asserting $0 \le \text{ActiveAdmitted} \le \text{Capacity}$ across all camps before and after every batch operation.
- [ ] Task 4.2: Implement `FodderMassInvariant.ts` enforcing mass conservation: $\text{Store Stock} - \text{Dispatched} \equiv \text{Camp Stock} \equiv \sum \text{Feeding Logs}$.
- [ ] Task 4.3: Implement `AntiFraudInvariant.ts` detecting double-registration of ear tags across different camps within 24 hours.
- [ ] Task 4.4: Implement `RationBoundsInvariant.ts` verifying that daily feed issuances never exceed statutory caps (15kg green, 6kg dry, 3kg concentrate).

### Phase 5: High-Scale Concurrency, Load Stress & Unified Runner
- [ ] Task 5.1: Implement `GateSurgeSimulator.ts` executing 50 concurrent admission requests to test database row locks and atomic capacity increments.
- [ ] Task 5.2: Implement `DoubleAdmissionRaceTest.ts` sending two parallel requests to admit the same cattle tag into two camps, verifying that exactly one succeeds and one is rejected.
- [ ] Task 5.3: Implement `HarnessReporter.ts` generating visual HTML dashboards and JSON summaries with p50, p95, and p99 latency metrics.
- [ ] Task 5.4: Add npm scripts in root `package.json`:
  - `"harness:run": "tsx packages/test-harness/src/index.ts"`
  - `"harness:invariants": "tsx packages/test-harness/src/invariants/run.ts"`
  - `"harness:chaos": "tsx packages/test-harness/src/chaos/run.ts"`
- [ ] Task 5.5: Integrate Harness execution into GitHub Actions workflow (`.github/workflows/harness.yml`).

---

## 3. Dependency Order
1. Phase 1 (Foundation & State Hydrator) MUST precede all other phases.
2. Phase 2 (Sensors) and Phase 3 (Network Chaos) can be developed in parallel once Phase 1 is complete.
3. Phase 4 (Invariants) consumes outputs from Phase 2 & 3.
4. Phase 5 (Concurrency & CI/CD) ties all modules into the automated quality gate.
