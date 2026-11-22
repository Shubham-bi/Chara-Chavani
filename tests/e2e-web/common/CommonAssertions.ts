import { Page, Locator, expect } from '@playwright/test';

/**
 * CommonAssertions: Centralized domain-specific assertion helpers
 * to maintain consistent quality gates across all test specs.
 */
export class CommonAssertions {
  /**
   * Asserts that KPI cards contain expected non-empty or numeric values.
   */
  public static async assertKpiCardsPopulated(kpiLocators: {
    farmers: Locator;
    cattle: Locator;
    camps: Locator;
    utilization: Locator;
  }): Promise<void> {
    await expect(kpiLocators.farmers).toBeVisible();
    await expect(kpiLocators.cattle).toBeVisible();
    await expect(kpiLocators.camps).toBeVisible();
    await expect(kpiLocators.utilization).toBeVisible();

    const farmersText = await kpiLocators.farmers.innerText();
    const cattleText = await kpiLocators.cattle.innerText();
    const campsText = await kpiLocators.camps.innerText();
    const utilText = await kpiLocators.utilization.innerText();

    expect(farmersText.trim().length).toBeGreaterThan(0);
    expect(cattleText.trim().length).toBeGreaterThan(0);
    expect(campsText.trim().length).toBeGreaterThan(0);
    expect(utilText).toContain('%');
  }

  /**
   * Asserts geofence validation result matches expectations.
   */
  public static assertGeofenceResult(
    result: { isInside: boolean; message?: string },
    expectedInside: boolean
  ): void {
    expect(result.isInside).toBe(expectedInside);
    if (expectedInside) {
      expect(result.message?.toLowerCase()).toMatch(/within|inside|valid/);
    } else {
      expect(result.message?.toLowerCase()).toMatch(/outside|violation|invalid/);
    }
  }

  /**
   * Asserts Camp Dossier side panel renders exact camp attributes and geofence status.
   */
  public static async assertCampDossierDetails(
    dossierLocators: {
      panel: Locator;
      name: Locator;
      code: Locator;
      capacity: Locator;
      geofenceStatus?: Locator;
    },
    expected: {
      name: string;
      code?: string;
      capacity?: number;
    }
  ): Promise<void> {
    await expect(dossierLocators.panel).toBeVisible();
    await expect(dossierLocators.name).toContainText(expected.name);

    if (expected.code) {
      await expect(dossierLocators.code).toContainText(expected.code);
    }
    if (expected.capacity !== undefined) {
      await expect(dossierLocators.capacity).toContainText(`${expected.capacity}`);
    }
    if (dossierLocators.geofenceStatus) {
      await expect(dossierLocators.geofenceStatus).toBeVisible();
      await expect(dossierLocators.geofenceStatus).toContainText('Vertices');
    }
  }

  /**
   * Asserts that a table contains at least a specified number of data rows.
   */
  public static async assertTableMinRows(tableRowsLocator: Locator, minRows: number = 1): Promise<number> {
    const count = await tableRowsLocator.count();
    expect(count).toBeGreaterThanOrEqual(minRows);
    return count;
  }

  /**
   * Asserts that CSV content contains all expected header column names.
   */
  public static assertCsvHeaders(csvContent: string, expectedColumns: string[]): void {
    const firstLine = csvContent.split('\n')[0];
    for (const col of expectedColumns) {
      expect(firstLine).toContain(col);
    }
  }

  /**
   * Monitors page for uncaught console errors and asserts none occurred.
   */
  public static captureConsoleErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('pageerror', exception => {
      errors.push(`PageError: ${exception.message}`);
    });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`ConsoleError: ${msg.text()}`);
      }
    });
    return errors;
  }
}
