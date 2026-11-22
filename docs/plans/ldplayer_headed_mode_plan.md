# LDPlayer Android Emulator Headed Mode Execution - Dev Plan & Task List

## 1. High-Level Architectural Approach
1. Verify LDPlayer 14 installation and instance configuration at `C:\LDPlayer\LDPlayer14`.
2. Implement automated helper script `scripts/launch_and_test_ldplayer.ps1` that:
   - Spawns LDPlayer instance 0 in headed mode (`ldconsole.exe launch --index 0`).
   - Polls until emulator status is `running` and ADB device is connected.
   - Tests hardware GPS coordinate injection (`locate --index 0 --LLI 75.3341,19.8214`).
   - Captures an emulator screenshot via ADB and saves to `brain/<conv-id>/screenshot-07-ldplayer-emulator.png`.
3. Enhance `tests/e2e-web/ldplayer-integration.spec.ts` with comprehensive test cases:
   - LDPlayer 14 detection & binary verification.
   - ADB connectivity & bridge communication.
   - Production APK verification (`mobile-farmer`, `mobile-chhavani`, `mobile-vet`, `mobile-officer`).
   - Active emulator status inspection (`isrunning`).
   - GPS Geofence location simulation command execution.
4. Add npm script `"test:ldplayer:headed"` to `package.json`.
5. Execute the Playwright LDPlayer suite in headed mode (`--headed`).
6. Update challenges & solutions log, commit, and push.

## 2. Granular Task Checklist
- [x] Task 1: Create PowerShell automated test script `scripts/launch_and_test_ldplayer.ps1`.
- [x] Task 2: Enhance `tests/e2e-web/ldplayer-integration.spec.ts` with real emulator lifecycle assertions.
- [x] Task 3: Add npm script `"test:ldplayer:headed"` to `package.json`.
- [x] Task 4: Launch LDPlayer in headed mode and execute tests.
- [x] Task 5: Capture high-resolution screenshot artifact from LDPlayer emulator.
- [x] Task 6: Run full Playwright test suite in headed mode to verify 100% green pass.
- [x] Task 7: Update `challenges_and_solutions.md`, commit, and push.
