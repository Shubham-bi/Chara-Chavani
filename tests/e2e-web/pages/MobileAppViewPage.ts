import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MobileAppViewPage: Page Object Model for testing the mobile application views
 * in mobile browser emulation (Farmer, Vet, Officer, Operator).
 */
export class MobileAppViewPage extends BasePage {
  readonly appLauncherBar: Locator;
  readonly appHeader: Locator;
  readonly roleSelector: Locator;
  readonly actionCards: Locator;

  // Specific App Views
  readonly viewAdmin: Locator;
  readonly viewFarmer: Locator;
  readonly viewChhavani: Locator;
  readonly viewVet: Locator;
  readonly viewOfficer: Locator;
  readonly viewQuad: Locator;

  // App Switcher Buttons
  readonly tabAdmin: Locator;
  readonly tabFarmer: Locator;
  readonly tabChhavani: Locator;
  readonly tabVet: Locator;
  readonly tabOfficer: Locator;
  readonly tabQuad: Locator;
  readonly btnToggleFrame: Locator;

  constructor(page: Page) {
    super(page);
    this.appLauncherBar = page.locator('#app-launcher-bar');
    this.appHeader = page.locator('.header, .mobile-header').first();
    this.roleSelector = page.locator('#role-selector');
    this.actionCards = page.locator('.action-card');

    this.viewAdmin = page.locator('#app-view-admin');
    this.viewFarmer = page.locator('#app-view-farmer');
    this.viewChhavani = page.locator('#app-view-chhavani');
    this.viewVet = page.locator('#app-view-vet');
    this.viewOfficer = page.locator('#app-view-officer');
    this.viewQuad = page.locator('#app-view-quad');

    this.tabAdmin = page.locator('#app-tab-admin');
    this.tabFarmer = page.locator('#app-tab-farmer');
    this.tabChhavani = page.locator('#app-tab-chhavani');
    this.tabVet = page.locator('#app-tab-vet');
    this.tabOfficer = page.locator('#app-tab-officer');
    this.tabQuad = page.locator('#app-tab-quad');
    this.btnToggleFrame = page.locator('#btn-toggle-frame');
  }

  async emulateMobileDevice(width: number = 375, height: number = 667) {
    await this.page.setViewportSize({ width, height });
  }

  async expectMobileHeaderVisible() {
    await expect(this.appHeader.first()).toBeVisible();
  }

  async switchApp(appId: 'admin' | 'farmer' | 'chhavani' | 'vet' | 'officer' | 'quad') {
    const tab = this.page.locator(`#app-tab-${appId}`);
    await tab.click();
    await expect(tab).toHaveClass(/active/);
    await expect(this.page.locator(`#app-view-${appId}`)).toBeVisible();
  }

  async selectRole(role: 'admin' | 'farmer' | 'operator' | 'vet' | 'officer') {
    await this.roleSelector.selectOption(role);
    await this.pause(300);
  }

  async toggleDeviceFrame() {
    await this.btnToggleFrame.click();
    await this.pause(200);
  }
}
