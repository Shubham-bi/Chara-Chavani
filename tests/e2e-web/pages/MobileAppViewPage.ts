import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MobileAppViewPage: Page Object Model for testing the mobile application views
 * in mobile browser emulation (Farmer, Vet, Officer, Operator).
 */
export class MobileAppViewPage extends BasePage {
  readonly appHeader: Locator;
  readonly roleSelector: Locator;
  readonly actionCards: Locator;

  constructor(page: Page) {
    super(page);
    this.appHeader = page.locator('.header');
    this.roleSelector = page.locator('#role-selector');
    this.actionCards = page.locator('.action-card');
  }

  async emulateMobileDevice(width: number = 375, height: number = 667) {
    await this.page.setViewportSize({ width, height });
  }

  async expectMobileHeaderVisible() {
    await expect(this.appHeader).toBeVisible();
  }
}
