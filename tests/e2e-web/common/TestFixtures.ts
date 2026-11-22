import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ApiClientHelper } from '../pages/ApiClientHelper';
import { DatabaseHelper } from '../pages/DatabaseHelper';
import { MobileAppViewPage } from '../pages/MobileAppViewPage';
import { DataLoader } from './DataLoader';
import { EnvironmentConfig } from './EnvironmentConfig';
import { CommonAssertions } from './CommonAssertions';
import { ReportingHelper } from './ReportingHelper';

/**
 * Worker-scoped fixtures for persistent browser/context/page reuse
 * across tests within each worker to eliminate launch overhead.
 */
export interface ChhavaniWorkerFixtures {
  sharedWorkerContext: BrowserContext;
  sharedWorkerPage: Page;
}

/**
 * Fixtures interface extending Playwright's test context
 * with domain-specific Page Objects, API Clients, and Data Utilities.
 */
export interface ChhavaniFixtures {
  page: Page;
  context: BrowserContext;
  adminDashboard: AdminDashboardPage;
  apiClient: ApiClientHelper;
  db: DatabaseHelper;
  mobileApp: MobileAppViewPage;
  dataLoader: typeof DataLoader;
  env: typeof EnvironmentConfig;
  assertions: typeof CommonAssertions;
  reporting: typeof ReportingHelper;
}

/**
 * Extended Playwright `test` instance equipped with:
 * 1. Persistent worker-level browser context and page reuse.
 * 2. Pre-wired Page Object Models and helpers.
 */
export const test = base.extend<ChhavaniFixtures, ChhavaniWorkerFixtures>({
  sharedWorkerContext: [async ({ browser }, use, workerInfo) => {
    // Preserve project-level device emulation settings (viewport, userAgent, etc.)
    const projectUse = workerInfo.project.use;
    const context = await browser.newContext(projectUse);
    await use(context);
    await context.close();
  }, { scope: 'worker' }],

  sharedWorkerPage: [async ({ sharedWorkerContext }, use) => {
    const page = await sharedWorkerContext.newPage();
    await use(page);
    await page.close();
  }, { scope: 'worker' }],

  // Override default test-scoped context to reuse worker context
  context: async ({ sharedWorkerContext }, use) => {
    await use(sharedWorkerContext);
  },

  // Override default test-scoped page to reuse worker page
  page: async ({ sharedWorkerPage }, use) => {
    await use(sharedWorkerPage);
  },

  adminDashboard: async ({ page }, use) => {
    const adminPage = new AdminDashboardPage(page);
    await use(adminPage);
  },

  apiClient: async ({}, use) => {
    const client = new ApiClientHelper(EnvironmentConfig.apiBaseUrl);
    await use(client);
  },

  db: async ({}, use) => {
    const dbHelper = new DatabaseHelper(EnvironmentConfig.apiBaseUrl);
    await use(dbHelper);
  },

  mobileApp: async ({ page }, use) => {
    const mobilePage = new MobileAppViewPage(page);
    await use(mobilePage);
  },

  dataLoader: async ({}, use) => {
    await use(DataLoader);
  },

  env: async ({}, use) => {
    await use(EnvironmentConfig);
  },

  assertions: async ({}, use) => {
    await use(CommonAssertions);
  },

  reporting: async ({}, use) => {
    ReportingHelper.resetSteps();
    await use(ReportingHelper);
  },
});

export { expect, Page, BrowserContext };
