# Browser Instance & Page Reuse in Playwright - Dev Plan & Task List

## 1. High-Level Architectural Approach
1. **Build Unified Base Fixture (`tests/e2e-web/fixtures/baseTest.ts`)**:
   - Define worker-scoped `sharedContext` and `sharedPage` using `workerInfo.project.use`.
   - Override default `context` and `page` fixtures to supply the persistent worker-scoped page.
   - Inject typed Page Object Model helpers (`adminDashboard`, `mobileAppView`, `apiHelper`).
   - Export `{ test, expect }` from `baseTest.ts`.
2. **Refactor Test Suites to Import Reusable Fixture**:
   - Update spec files to import `test` and `expect` from `./fixtures/baseTest` (or `../fixtures/baseTest`).
   - Remove redundant `test.beforeEach(async ({ page }) => ...)` boilerplate where POM is now auto-injected.
3. **Verification**:
   - Run headed test suite: visually verify that the browser window opens once, stays open continuously across tests, and closes only when finished.
   - Verify 100% green test passes across all suites (Smoke, Dashboard, Multi-App, Sanity, Regression, Seed, Data-Driven).
   - Verify typecheck and linting across workspaces.
4. **Governance Documentation**:
   - Update `challenges_and_solutions.md` with trade-off analysis ("What & Why").
   - Commit and push to `origin/main`.

---

## 2. Granular Task Checklist
- [x] Task 1: Create `tests/e2e-web/fixtures/baseTest.ts` with worker-scoped browser/page reuse and POM fixtures.
- [x] Task 2: Refactor `tests/e2e-web/web-admin-dashboard.spec.ts` and `tests/e2e-web/smoke.spec.ts` to use `baseTest`.
- [x] Task 3: Refactor `tests/e2e-web/all-apps-chrome-view.spec.ts` to use `baseTest`.
- [x] Task 4: Refactor other test specs (`sanity.spec.ts`, `regression.spec.ts`, `seed.spec.ts`, and `data-driven/*.spec.ts`) to use `baseTest`.
- [x] Task 5: Execute Playwright in headed mode to verify the browser launches once and reuses the window across tests.
- [x] Task 6: Run full regression and typecheck (`npm run typecheck`, `npm run lint:all`).
- [x] Task 7: Update `challenges_and_solutions.md`, commit, and push.
