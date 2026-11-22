# Browser Instance & Page Reuse in Playwright - Understanding Document

## 1. Business Context & Problem Statement
- **Target Users**: QA Engineers, Developers, and Government Stakeholders observing automated test runs.
- **Problem**: By default, Playwright isolates each test by launching a brand new `BrowserContext` and `Page`. While this provides pure sandbox isolation, in headed mode it causes Chromium to continuously spawn, render, close, and re-spawn on the desktop display for every individual `test()` block. For a test suite of dozens of tests, this creates disruptive desktop window flashing and adds substantial overhead (approx. 400ms - 1200ms per test in context recreation).
- **Goal**: Launch the browser window **once** per worker/suite and reuse the active browser, context, and page across tests where possible. The browser remains smoothly visible on the desktop, navigating between test steps seamlessly without closing and reopening.

## 2. Technical Architecture & Constraints
1. **Worker-Scoped Playwright Fixtures**:
   - Playwright's `browser` fixture is already worker-scoped.
   - By creating a worker-scoped `sharedContext` and `sharedPage`, a single browser window is opened when the worker initializes.
   - The test-scoped `page` and `context` fixtures are overridden to supply `sharedPage` and `sharedContext`.
   - `workerInfo.project.use` is passed to `browser.newContext(...)` to guarantee device emulation parameters (viewport, user agent, mobile presets) remain strictly preserved.
2. **State Management & Test Independence**:
   - Each test begins by navigating to its target URL or resetting application state (`await page.goto('/')`).
   - Cookies and local storage can be cleared if needed, or preserved for continuous user journey scenarios.
3. **Execution Mode Support**:
   - Functions identically in headless CI mode (`npm test`) and live headed visual mode (`npm run test:playwright:headed`).
   - Dramatic speedup in execution time and eliminate window flashing on the desktop.
