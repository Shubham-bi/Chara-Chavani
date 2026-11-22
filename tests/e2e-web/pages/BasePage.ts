import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage: Core abstract page encapsulating common browser actions,
 * responsive viewport management, and synchronization helpers.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.waitForReady();
  }

  async waitForReady() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }

  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async pause(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
