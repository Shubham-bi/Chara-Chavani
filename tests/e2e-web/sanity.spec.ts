import { test, expect } from '@playwright/test';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ApiClientHelper } from './pages/ApiClientHelper';

test.describe('Chara Chhavani - Sanity Test Suite', () => {
  let dashboard: AdminDashboardPage;
  const api = new ApiClientHelper('http://localhost:5000');

  test.beforeEach(async ({ page }) => {
    dashboard = new AdminDashboardPage(page);
  });

  test('Sanity 01: Mobile OTP authentication flow for Farmer', async () => {
    const mobile = '9822012345';
    const otpRes = await api.requestFarmerOtp(mobile);
    expect(otpRes.success).toBe(true);
    expect(otpRes.devOtp).toBe('123456');

    const verifyRes = await api.verifyFarmerOtp(mobile, otpRes.devOtp || '123456');
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.role).toBe('Farmer');
    expect(verifyRes.token).toBeDefined();
  });

  test('Sanity 02: Camp Geofence boundary verification (Inside vs Outside)', async () => {
    const camps = await api.getCamps();
    expect(camps.length).toBeGreaterThanOrEqual(1);
    const campId = camps[0].id;

    // Inside coordinates (Paithan camp center: 19.82, 75.33)
    const insideCheck = await api.checkGeofence(campId, 19.82, 75.33);
    expect(insideCheck.isInside).toBe(true);
    expect(insideCheck.message).toContain('within the registered');

    // Outside coordinates (Far away: Mumbai 18.92, 72.83)
    const outsideCheck = await api.checkGeofence(campId, 18.92, 72.83);
    expect(outsideCheck.isInside).toBe(false);
    expect(outsideCheck.message).toContain('OUTSIDE');
  });

  test('Sanity 03: Geographic map metric toggling updates map legend', async () => {
    await dashboard.goto('/');
    await expect(dashboard.mapViewport).toBeVisible();
    await expect(dashboard.mapLegend).toBeVisible();

    await dashboard.selectMetric('animals');
    await expect(dashboard.mapLegend).toBeVisible();

    await dashboard.selectMetric('utilization');
    await expect(dashboard.mapLegend).toBeVisible();
  });

  test('Sanity 04: Statutory CSV audit export links present inside Reports section', async () => {
    await dashboard.goto('/');
    await dashboard.navigateToSection('reports');
    await expect(dashboard.csvExportActions).toBeVisible();

    const exportLinks = dashboard.csvExportActions.locator('a');
    await expect(exportLinks).toHaveCount(4);
    await expect(exportLinks.nth(0)).toHaveAttribute('href', /reportType=admissions/);
    await expect(exportLinks.nth(1)).toHaveAttribute('href', /reportType=fodder/);
    await expect(exportLinks.nth(2)).toHaveAttribute('href', /reportType=expenses/);
    await expect(exportLinks.nth(3)).toHaveAttribute('href', /reportType=inspections/);
  });
});
