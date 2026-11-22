# LDPlayer Android Emulator Headed Mode Execution - Understanding Document

## 1. Business Context & Objective
- **Target Users**: Mobile QA Engineers, Automation Specialists, and Release Managers.
- **Context**: Executing live Android mobile application automation in the physical **LDPlayer 14 Android Emulator** (`dnplayer.exe` / `ldconsole.exe`) in **headed mode**. The user can visually observe the Android tablet/phone emulator GUI on the Windows desktop, displaying real-time app interactions, APK installation, activity lifecycle, and hardware GPS Geofence coordinate simulation.

## 2. Technical Stack & Environment
- **LDPlayer Path**: `C:\LDPlayer\LDPlayer14` (`ldconsole.exe`, `dnplayer.exe`, `adb.exe`).
- **Target Instance**: Index `0`, Name `LDPlayer` (1600x900 / 1080x1920 DPI 240/320).
- **APKs Under Test**: Located in `dist-apk/`:
  - `mobile-farmer.apk` (`com.charachhavani.farmer`)
  - `mobile-chhavani.apk` (`com.charachhavani.operator`)
  - `mobile-vet.apk` (`com.charachhavani.vet`)
  - `mobile-officer.apk` (`com.charachhavani.officer`)
- **Integration Bridges**:
  - `tools/mcp-ldplayer/mcp_ldplayer/ld_controller.py`: Python controller interfacing with `ldconsole.exe` and ADB.
  - `tests/e2e-web/ldplayer-integration.spec.ts`: Playwright automated integration test verifying emulator state, ADB connectivity, hardware GPS injection, and APK lifecycle.
  - Headed Visual Feedback: Emulator window opens visibly on the Windows desktop. High-res screencap saved to the conversation artifact directory.

## 3. Workflow & Verification Steps
1. **Launch Emulator in Headed Mode**:
   - Execute `ldconsole.exe launch --index 0` to spawn the visible GUI window.
   - Poll `ldconsole.exe isrunning --index 0` until status reports `running`.
   - Wait for ADB device detection (`adb devices`).
2. **Hardware GPS Simulation**:
   - Inject Paithan camp geofence centroid: `ldconsole.exe locate --index 0 --LLI 75.3341,19.8214`.
   - Inject outside boundary coordinates: `ldconsole.exe locate --index 0 --LLI 74.0000,18.0000`.
3. **APK Deployment & Execution**:
   - Verify presence of production APKs in `dist-apk/`.
   - Install or verify app package via ADB.
4. **Headed Playwright Integration**:
   - Execute `tests/e2e-web/ldplayer-integration.spec.ts` in headed mode (`--headed`).
   - Capture emulator screenshot and persist to conversation artifact directory.
