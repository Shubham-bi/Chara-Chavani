# Automation Framework Architecture Document

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-AUT-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Automation Framework Overview

The Chara Chhavani test automation architecture is constructed using **Playwright** with the **Page Object Model (POM)** pattern, designed to handle both Desktop Web Admin experiences and Mobile browser viewports, with a dedicated bridge to the **LDPlayer 14 Android Emulator** and the ASP.NET Core WebAPI.

```
tests/e2e-web/
├── pages/
│   ├── BasePage.ts                 # Base interaction & viewport abstraction
│   ├── AdminDashboardPage.ts       # Web Admin Page Object Model (Power BI shell)
│   ├── MobileAppViewPage.ts        # Mobile responsive view Page Object Model
│   ├── ApiClientHelper.ts          # Direct HTTP client for API test fixtures
│   └── DatabaseHelper.ts           # DB integrity & math verification helper
├── smoke.spec.ts                   # Smoke test suite (Health, Header, KPIs, Catalog)
├── sanity.spec.ts                  # Sanity test suite (OTP, Geofence, Map, CSV links)
├── e2e-full-workflow.spec.ts       # Multi-actor lifecycle test (Farmer -> Vet -> Operator -> Admin)
├── regression.spec.ts              # Boundary, Capacity, Anti-Fraud, Tab persistence
└── ldplayer-integration.spec.ts    # Android emulator / LDPlayer 14 ADB test bridge
```

---

## 2. Key Framework Design Patterns

### 2.1 Page Object Model (POM)
- Encapsulates DOM element selectors and page interactions inside typed TypeScript classes.
- Test specifications contain only test intent, business workflows, and assertions.
- Minimizes maintenance overhead when UI components or CSS classes change.

### 2.2 Cross-Device Multi-Viewport Emulation
- Configured in `playwright.config.ts`:
  1. `desktop-chrome`: 1280x720 desktop resolution.
  2. `mobile-chrome`: Google Pixel 5 emulation (`393x851` viewport, mobile user agent).
  3. `mobile-safari`: Apple iPhone 13 emulation (`390x844` viewport).

### 2.3 Resilient Bilingual Locators
- Handles bilingual Marathi and English UI text gracefully:
  - Role-based locators: `page.locator('button[data-section="reports"]')`
  - Case-insensitive regex: `page.getByRole('button', { name: /प्रवेश|admissions/i })`
  - Explicit element IDs: `#camp-dossier-panel`, `#map-viewport`, `#metrics-grid`

### 2.4 Hybrid Web + API Verification
- Combines browser actions with direct REST calls via `ApiClientHelper` to assert that numbers displayed on the UI match the backend database state.

### 2.5 LDPlayer 14 Android Emulator Integration
- Connected via `tools/mcp-ldplayer/` (`mcp_ldplayer/mcp_server.py`) and standard ADB bridge.
- Automatically verifies APK readiness from `dist-apk/` (`mobile-farmer.apk`, `mobile-vet.apk`, `mobile-officer.apk`, `mobile-chhavani.apk`).

---

## 3. Automation Execution Commands

```powershell
# Run full suite on Desktop Chrome
npx playwright test --project=desktop-chrome

# Run full suite in Mobile Viewport (Pixel 5)
npx playwright test --project=mobile-chrome

# Run specific suite
npx playwright test tests/e2e-web/smoke.spec.ts

# Generate HTML visual test report
npx playwright show-report
```
