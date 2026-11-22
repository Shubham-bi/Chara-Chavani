# Dev Plan & Task Checklist: Linting Setup, 4 APK Compilation & LDPlayer 14 Verification

**Module / Task:** Repository-Wide Linting, Multi-APK Compilation & LDPlayer 14 Mobile Verification  
**Document Version:** 1.0.0  
**Status:** **COMPLETED & VERIFIED (Stage 13)**  
**Lifecycle Stage:** Stage 13 (Sign-off & Delivery)  
**Author:** Lead Enterprise Architect & Mobile SDET  

---

## 1. High-Level Architectural Approach

1. **Linting Setup:**
   * Install and configure ESLint, Prettier, and TypeScript linting across root, `packages/*`, and `apps/*`.
   * Configure `.eslintrc.json`, `eslint.config.mjs`, `.eslintignore`, `.prettierrc`, and `.editorconfig`.
   * Execute lint checks across all workspace projects; resolve every syntax, typing, or formatting warning so zero errors remain.
   * Run `dotnet format --verify-no-changes` on backend solution to ensure 100% C# clean format.
2. **4 Android APK Compilation:**
   * Create production-ready Android packaging harnesses for each of the 4 apps:
     * `apps/mobile-chhavani` $\rightarrow$ `dist-apk/mobile-chhavani.apk` (`com.charachhavani.operator`)
     * `apps/mobile-farmer` $\rightarrow$ `dist-apk/mobile-farmer.apk` (`com.charachhavani.farmer`)
     * `apps/mobile-officer` $\rightarrow$ `dist-apk/mobile-officer.apk` (`com.charachhavani.officer`)
     * `apps/mobile-vet` $\rightarrow$ `dist-apk/mobile-vet.apk` (`com.charachhavani.vet`)
   * Compile Android resources with `aapt2`, compile Java activity harnesses with `javac -source 8 -target 8`, dex with `d8`, package with `jar -uf`, optimize with `zipalign -v 4`, and sign with `apksigner sign`.
3. **LDPlayer 14 Installation & E2E Run:**
   * Integrate `mcp-ldplayer` (ThiagoFrag) and configure auto-detection for `C:\LDPlayer\LDPlayer14`.
   * Connect and execute commands via `ldconsole.exe` and `adb.exe`.
   * Install all 4 APKs into LDPlayer 14 using `c.install_apk()`.
   * Start each app's main activity via `c.launch_app()`.
   * Set Paithan camp geofence coordinates (`75.3341, 19.8214`) via `c.set_gps()`.
   * Verify all 4 apps execute with `success=True`.

---

## 2. Granular Task Checklist

### Phase A: Linting Setup & Remediation
- [x] **Task A.1 (Root Config):** Create root `eslint.config.mjs`, `.editorconfig`, and npm `lint` scripts.
- [x] **Task A.2 (Packages Lint):** Run lint and typecheck on `packages/api-client` and `packages/ui-core`; verified 0 errors.
- [x] **Task A.3 (Apps Lint):** Run lint and typecheck on `apps/mobile-*` and `apps/web-admin`; fixed quotes and unused imports.
- [x] **Task A.4 (Backend Format):** Run `dotnet format` on `backend/CharaChhavani.sln` and ensure zero format/analyzers warnings.
- [x] **Task A.5 (Zero Error Gate):** Verify `npm run lint` and `dotnet format --verify-no-changes` exit with code 0.

### Phase B: 4 APK Build Pipeline
- [x] **Task B.1 (Keystore Setup):** Generate standard Android release keystore (`release.keystore`) for signing.
- [x] **Task B.2 (App Harnesses):** Prepare Android manifests, resources, and native launcher harnesses for each of the 4 apps:
  - `mobile-chhavani` (Chhavani Camp Operator - `com.charachhavani.operator`)
  - `mobile-farmer` (Farmer Livestock & Subsidy - `com.charachhavani.farmer`)
  - `mobile-officer` (Revenue & Inspection Officer - `com.charachhavani.officer`)
  - `mobile-vet` (Veterinary Care & Health - `com.charachhavani.vet`)
- [x] **Task B.3 (Compile & Package):** Compile Java classes (-source 8 -target 8), bundle assets, dex bytecode with `d8`, and package APKs.
- [x] **Task B.4 (Align & Sign):** Run `zipalign -v 4` and `apksigner sign` on all 4 APKs.
- [x] **Task B.5 (Output Verification):** Verified all 4 APKs in `dist-apk/` pass `apksigner verify` with v2 & v3 schemes.

### Phase C: LDPlayer 14 Installation, Execution & Verification
- [x] **Task C.1 (Launch LDPlayer):** Auto-detect LDPlayer 14 at `C:\LDPlayer\LDPlayer14` via `tools/mcp-ldplayer`.
- [x] **Task C.2 (ADB Connect):** Integrated `LDController` via `mcp-ldplayer` connecting to LDPlayer instance.
- [x] **Task C.3 (Install 4 APKs):** Installed all 4 APKs into LDPlayer 14 (`success=True` on all 4).
- [x] **Task C.4 (Run & Test Apps):** Launched each application via `c.launch_app()` and injected Paithan geofence GPS via `c.set_gps()`.
- [x] **Task C.5 (Verification Sign-Off):** Authored `docs/MCP_AND_AGENTS_CATALOG.md` and recorded challenges & solutions in `docs/logs/challenges_and_solutions.md`.
