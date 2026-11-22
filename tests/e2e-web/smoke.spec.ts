import { test, expect } from './common/TestFixtures';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ApiClientHelper } from './pages/ApiClientHelper';

test.describe('Chara Chhavani - Smoke Test Suite', () => {
  let dashboard: AdminDashboardPage;
  const api = new ApiClientHelper('http://localhost:5000');

  test.beforeEach(async ({ page }) => {
    dashboard = new AdminDashboardPage(page);
  });

  test('Smoke 01: Core WebAPI health status should be Healthy', async () => {
    const health = await api.getHealth();
    expect(health.status).toBe('Healthy');
    expect(health.service).toContain('Chara Chhavani');
  });

  test('Smoke 02: Web Admin Dashboard loads with Maharashtra Government header', async () => {
    await dashboard.goto('/');
    const title = await dashboard.getTitle();
    expect(title).toMatch(/Chara Chhavani - State Relief Administration Dashboard/i);

    await expect(dashboard.headerTitle).toBeVisible();
    await expect(dashboard.headerTitle).toContainText('महाराष्ट्र शासन');
    await expect(dashboard.adminAuthorityBadge).toContainText('State Relief Commissioner');
  });

  test('Smoke 03: Primary 4 KPI metric cards render successfully', async () => {
    await dashboard.goto('/');
    await dashboard.expectKpisLoaded();
  });

  test('Smoke 04: Master reference catalog retrieves drought-prone districts', async () => {
    const districts = await api.getDistricts();
    expect(districts.length).toBeGreaterThanOrEqual(10);
    const csDistrict = districts.find(d => d.name.includes('Sambhajinagar'));
    expect(csDistrict).toBeDefined();
  });

  test('Smoke 05: Active cattle camps monitoring table loads records', async () => {
    await dashboard.goto('/');
    await expect(dashboard.campsTableContainer).toBeVisible();
    await dashboard.pause(800);
    const rowCount = await dashboard.campsTableRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });
});
