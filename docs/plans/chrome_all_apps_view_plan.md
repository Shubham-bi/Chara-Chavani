# All Applications Chrome Multi-View Portal - Dev Plan & Task List

## 1. High-Level Architectural Approach
1. **Extend Web Admin Shell (`apps/web-admin/index.html` & `dashboard.js`)**:
   - Add a persistent **Multi-App Switcher Top Bar** above the Admin Dashboard:
     - Tabs: `🏛️ State Admin Dashboard`, `🌾 Farmer App`, `🏕️ Camp Operator App`, `🩺 Vet Doctor App`, `👮 Officer App`, `📱 Quad-App View`.
     - Device Frame Toggle: `📱 Phone Frame (375x667)` vs `💻 Full View`.
     - Role Selector: `#role-selector` dropdown (`admin`, `farmer`, `operator`, `vet`, `officer`).
   - Add container `#mobile-apps-container` with smartphone bezel styling (`.smartphone-bezel`, `.speaker-notch`, `.phone-screen`) and full-screen capability.
2. **Implement Interactive Mobile Application Views**:
   - **Farmer App View (`#view-app-farmer`)**:
     - Profile card with farmer details.
     - Registered animals list with status badges (`Approved`, `Admitted`).
     - Live form to register new livestock with breed selector and age.
   - **Camp Operator App View (`#view-app-chhavani`)**:
     - Camp overview with current headcount vs capacity.
     - Gate admission simulator with interactive GPS Geofence validation.
     - Fodder stock overview (Store vs In-Farm) and daily feeding log form.
     - Operational expense logging form.
   - **Veterinary Doctor App View (`#view-app-vet`)**:
     - Doctor profile.
     - Pending verifications queue with tag & breed verification.
     - Verification approval/rejection action with GPS stamp and clinical remarks.
   - **Inspection Officer App View (`#view-app-officer`)**:
     - Officer profile.
     - Surprise spot inspection form: camp selection, physical headcount input, automatic discrepancy calculation, water/fodder rating, hygiene score, and submit action.
   - **Quad Multi-App View (`#view-app-quad`)**:
     - 4-column responsive grid embedding all 4 mobile apps side-by-side for simultaneous multi-actor observation.
3. **Automated Verification**:
   - Update `tests/e2e-web/pages/MobileAppViewPage.ts` to support navigating and testing the mobile apps in browser mobile view.
   - Add new Playwright spec: `tests/e2e-web/all-apps-chrome-view.spec.ts`.
   - Run full regression suites (Playwright Desktop, Mobile, .NET tests, Smoke test, Lint, Typecheck).
4. **Browser Subagent Chrome Execution**:
   - Launch the `browser` subagent to navigate to `http://localhost:3000`, switch through each application tab, exercise forms, and verify visual rendering.

---

## 2. Granular Task Checklist

- [x] Task 1: Add top Multi-App Switcher Bar and mobile app containers to `apps/web-admin/index.html`.
- [x] Task 2: Implement UI styles and interaction logic for Farmer, Operator, Vet, Officer, and Quad-View in `apps/web-admin/dashboard.js`.
- [x] Task 3: Implement Playwright spec `tests/e2e-web/all-apps-chrome-view.spec.ts` testing all 5 applications in Chrome view.
- [x] Task 4: Run typecheck and linting across workspaces (`npm run lint:all`, `npm run typecheck`).
- [x] Task 5: Run Playwright test suite and backend unit tests.
- [x] Task 6: Delegate to browser subagent to interact with and verify all applications in live Chrome.
- [x] Task 7: Git commit and push changes to `origin/main`.
