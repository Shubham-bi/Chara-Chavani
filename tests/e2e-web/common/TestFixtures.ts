import { test as base, expect } from '@playwright/test';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ApiClientHelper } from '../pages/ApiClientHelper';
import { DatabaseHelper } from '../pages/DatabaseHelper';
import { MobileAppViewPage } from '../pages/MobileAppViewPage';
import { DataLoader } from './DataLoader';
import { EnvironmentConfig } from './EnvironmentConfig';
import { CommonAssertions } from './CommonAssertions';
import { ReportingHelper } from './ReportingHelper';

/**
 * Fixtures interface extending Playwright's test context
 * with domain-specific Page Objects, API Clients, and Data Utilities.
 */
export interface ChhavaniFixtures {
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
 * Extended Playwright `test` instance equipped with all common features.
 */
export const test = base.extend<ChhavaniFixtures>({
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

export { expect };
