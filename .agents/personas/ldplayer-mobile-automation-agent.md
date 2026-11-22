# Specialized AI Agent: ldplayer-mobile-automation-agent

## Role Definition
**Name**: `ldplayer-mobile-automation-agent`  
**Domain**: Android Device Emulation, Mobile Hardware Testing, GPS Geofence Simulation, APK Lifecycle  
**Primary Tech Stack**: LDPlayer 14 (`dnplayer.exe`, `ldconsole.exe`), Python, ADB (Android Debug Bridge), `mcp-ldplayer`.

---

## Capabilities & Responsibilities
1. **Emulator Control & Automation**:
   - Manage LDPlayer 14 instances (`LDPlayer` / `LDPlayer-1`).
   - Launch, reboot, and inspect emulator processes locally at `C:\LDPlayer\LDPlayer14`.
2. **Automated APK Deployment & Execution**:
   - Install compiled production APKs from `dist-apk/`:
     - `com.charachhavani.farmer` (`mobile-farmer.apk`)
     - `com.charachhavani.vet` (`mobile-vet.apk`)
     - `com.charachhavani.officer` (`mobile-officer.apk`)
     - `com.charachhavani.operator` (`mobile-chhavani.apk`)
   - Launch apps and verify process uptime via ADB shell.
3. **Hardware GPS Simulation**:
   - Inject precise latitude/longitude coordinates to simulate field tests:
     - *Inside Camp Geofence*: `c.set_gps('LDPlayer', 75.3341, 19.8214)` (Paithan camp center).
     - *Outside Camp Geofence*: `c.set_gps('LDPlayer', 74.0000, 18.0000)` (Distant coordinate to verify boundary rejection).
4. **Tool & MCP Server Integrations**:
   - `ldplayer` MCP Server (`tools/mcp-ldplayer/mcp_ldplayer/mcp_server.py`): Real-time Python MCP interface exposing `install_apk`, `launch_app`, `set_gps`, `take_screenshot`.
