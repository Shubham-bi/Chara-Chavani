import { test, expect } from '../common/TestFixtures';

test.describe('Chara Chhavani - Data-Driven Spatial Geofence Verification', () => {
  test('DDT-GEO-01: Parameterized Point-in-Polygon Checks via JSON Dataset', async ({
    apiClient,
    dataLoader,
    reporting,
    assertions,
  }) => {
    const geofences = dataLoader.loadJson<any[]>('geofences.json');
    expect(geofences.length).toBeGreaterThan(0);

    for (let i = 0; i < geofences.length; i++) {
      const row = geofences[i];
      reporting.logDataIteration('JSON Geofence Check', i, geofences.length, {
        id: row.testCaseId,
        campId: row.campId,
        coords: [row.latitude, row.longitude],
        expectedInside: row.expectedInside,
        desc: row.description,
      });

      const result = await apiClient.checkGeofence(row.campId, row.latitude, row.longitude);
      assertions.assertGeofenceResult(result, row.expectedInside);

      reporting.logStep(
        `Point (${row.latitude}, ${row.longitude}) -> Inside: ${result.isInside} (Matches Expected: ${row.expectedInside})`
      );
    }
  });

  test('DDT-GEO-02: Parameterized Spatial Boundaries via Excel (.xlsx) Matrix', async ({
    apiClient,
    dataLoader,
    reporting,
    assertions,
  }) => {
    const excelGeofences = dataLoader.loadExcel<any>('test_matrix.xlsx', 'Geofences');
    expect(excelGeofences.length).toBeGreaterThan(0);

    for (let i = 0; i < excelGeofences.length; i++) {
      const row = excelGeofences[i];
      const expectedInside = row.ExpectedInside === true || String(row.ExpectedInside).toLowerCase() === 'true';

      reporting.logDataIteration('Excel Geofence Matrix', i, excelGeofences.length, {
        testCase: row.TestCaseId,
        camp: row.CampId,
        lat: row.Latitude,
        lon: row.Longitude,
        expectedInside,
      });

      const result = await apiClient.checkGeofence(Number(row.CampId), Number(row.Latitude), Number(row.Longitude));
      assertions.assertGeofenceResult(result, expectedInside);
    }
  });

  test('DDT-GEO-03: Geographic Graticule and Geofence Layer Visual Toggles', async ({
    adminDashboard,
    reporting,
  }) => {
    await adminDashboard.goto();
    await adminDashboard.waitForReady();

    reporting.logStep('Verifying map container and vector layer controls');
    await expect(adminDashboard.mapViewport).toBeVisible();

    const toggleGeofence = adminDashboard.page.locator('#toggle-layer-geofence');
    const toggleGraticule = adminDashboard.page.locator('#toggle-layer-graticule');

    if (await toggleGeofence.isVisible()) {
      await toggleGeofence.click();
      await adminDashboard.page.waitForTimeout(200);
      await toggleGeofence.click(); // Re-enable
      reporting.logStep('Toggled Geofence Polygon Vector Layer');
    }

    if (await toggleGraticule.isVisible()) {
      await toggleGraticule.click();
      await adminDashboard.page.waitForTimeout(200);
      reporting.logStep('Toggled Geographic Graticule (Lat/Lon) Parallel Grid');
    }
  });
});
