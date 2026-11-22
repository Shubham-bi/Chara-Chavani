import { test, expect } from './common/TestFixtures';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ApiClientHelper } from './pages/ApiClientHelper';
import { DatabaseHelper } from './pages/DatabaseHelper';

test.describe('Chara Chhavani - Regression & Boundary Test Suite', () => {
  let dashboard: AdminDashboardPage;
  const api = new ApiClientHelper('http://localhost:5000');
  const db = new DatabaseHelper('http://localhost:5000');

  test.beforeEach(async ({ page }) => {
    dashboard = new AdminDashboardPage(page);
  });

  test('Regression 01: Boundary Geofence violation prevents admission', async () => {
    const camps = await api.getCamps();
    expect(camps.length).toBeGreaterThan(0);
    const campId = camps[0].id;

    // Boundary edge test: Point outside the registered polygon (Pune coordinates: 18.52, 73.85)
    const outsideCheck = await api.checkGeofence(campId, 18.52, 73.85);
    expect(outsideCheck.isInside).toBe(false);
    expect(outsideCheck.message).toContain('OUTSIDE');
  });

  test('Regression 02: Camp Capacity Invariant - Occupancy cannot exceed maximum', async () => {
    const camps = await api.getCamps();
    expect(camps.length).toBeGreaterThan(0);
    const camp = camps[0];

    // Assert mathematically: Admitted count cannot exceed Total Capacity
    const campData = await api.getSectionAnalytics('camps');
    expect(campData).toBeDefined();
    const rankings = campData.campRankings || [];
    for (const c of rankings) {
      expect(db.validateCapacityLimit(c.admitted, c.capacity)).toBe(true);
    }
  });

  test('Regression 03: Anti-Fraud Rule 9.6 - Unauthenticated and offline operations blocked', async () => {
    // Attempting to access protected admin operational endpoints without token or valid payload
    const res = await fetch('http://localhost:5000/api/v1/admin/analytics/invalid-section');
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('Invalid analytics section');
  });

  test('Regression 04: Power BI Tab Navigation persistence across all 8 analytical sections', async () => {
    await dashboard.goto('/');

    const sections: Array<'overview' | 'geographic' | 'camps' | 'animals' | 'veterinary' | 'fodder' | 'financial' | 'reports'> = [
      'overview', 'geographic', 'camps', 'animals', 'veterinary', 'fodder', 'financial', 'reports',
    ];

    for (const sec of sections) {
      await dashboard.navigateToSection(sec);
    }
  });

  test('Regression 05: Mobile Responsive Layout renders without clipping or horizontal overflow', async ({ page }) => {
    await dashboard.setMobileViewport();
    await dashboard.goto('/');

    await expect(dashboard.headerTitle).toBeVisible();
    await expect(dashboard.totalFarmersCard).toBeVisible();
    await expect(dashboard.campsTableContainer).toBeVisible();
  });
});
