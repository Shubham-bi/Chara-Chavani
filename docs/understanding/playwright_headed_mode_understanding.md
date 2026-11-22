# Playwright Headed Mode Execution - Understanding Document

## 1. Business Context & Target Users
- **Target Users**: QA Engineers, Developers, and Government Stakeholders.
- **Context**: Visual observation of automated test suites running in live Google Chrome. Headed mode launches a visible desktop Chromium window rendering the State Admin Dashboard, Google Maps GIS visualization, and the 4 mobile application simulators (Farmer, Camp Operator, Veterinary Doctor, Inspection Officer) as automated scripts click tabs, fill registration forms, validate geofences, and check audit reports.

## 2. Functional Requirements & Test Scenarios
1. **Interactive Headed Execution**:
   - Playwright must run with `--headed` flag, disabling headless mode and binding to the active Windows graphical desktop display.
   - Optional `--slow-mo` (e.g. 300ms - 500ms) to allow human stakeholders to comfortably observe user interactions, animations, and form validations.
2. **Project Scenarios Tested**:
   - `all-apps-chrome-view.spec.ts`: Visual navigation through Admin Portal, Farmer App, Camp Operator App, Vet App, Officer App, and Quad-View.
   - `smoke.spec.ts`: Fast sanity verification of dashboard rendering, role selector, and app tabs.
   - `web-admin-dashboard.spec.ts`: KPI cards, camp rankings, Google Maps type toggle, and statutory audit CSV export triggers.
3. **Npm Scripts Enhancement**:
   - Add dedicated scripts in `package.json`:
     - `"test:playwright:headed": "playwright test --headed"`
     - `"test:playwright:headed:slow": "playwright test --headed --slowmo=300"`

## 3. Data Flow & Constraints
- Both background servers must remain active:
  - Web Admin / Simulator: `http://localhost:3000`
  - ASP.NET Core WebApi: `http://localhost:5000`
  - MySQL Database: `localhost:3306`
- Workers must be set to `1` (already set in `playwright.config.ts`) so single headed browser window executes predictably without overlapping multiple desktop windows.
