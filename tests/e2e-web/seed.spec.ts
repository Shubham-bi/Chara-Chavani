import { test, expect } from './common/TestFixtures';

test.describe('Database Seeder & System Hydration E2E Suite', () => {
  test('execute comprehensive database seeding and verify full system hydration', async ({
    adminDashboard,
    apiClient,
    env,
    page,
  }) => {
    // 1. Trigger database seeding via API endpoint
    const seedResult = await apiClient.seedDatabase();
    expect(seedResult).toBeDefined();
    expect(seedResult.message || '').toContain('completed successfully');

    // 2. Direct API verification of hydrated state
    const dashboardKpi = await apiClient.getDashboard();
    expect(dashboardKpi).toBeDefined();
    const campsCount = dashboardKpi.totalCharaChhavaniCentres ?? dashboardKpi.totalRegisteredCamps ?? 0;
    expect(campsCount).toBeGreaterThanOrEqual(4);

    const farmersCount = dashboardKpi.totalRegisteredFarmers ?? dashboardKpi.totalFarmers ?? 0;
    expect(farmersCount).toBeGreaterThanOrEqual(5);

    const animalsCount = dashboardKpi.totalRegisteredAnimals ?? dashboardKpi.totalAnimals ?? 0;
    expect(animalsCount).toBeGreaterThanOrEqual(8);

    const admittedCount = dashboardKpi.totalActiveAdmittedAnimals ?? dashboardKpi.admittedAnimals ?? 0;
    expect(admittedCount).toBeGreaterThanOrEqual(5);

    // 3. Verify Relief Camps API
    const camps = await apiClient.getCamps();
    expect(camps.length).toBeGreaterThanOrEqual(4);
    const campCodes = camps.map((c: any) => c.campCode);
    expect(campCodes).toContain('CHV-MH-PAITHAN-001');
    expect(campCodes).toContain('CHV-MH-AMBAD-101');
    expect(campCodes).toContain('CHV-MH-GEORAI-102');
    expect(campCodes).toContain('CHV-MH-MADHA-103');

    // 4. Verify Statutory Reports Data via API
    const admissionsReport = await apiClient.getReport('admissions');
    const admCount = admissionsReport.items?.length ?? (Array.isArray(admissionsReport) ? admissionsReport.length : 0);
    expect(admCount).toBeGreaterThan(0);

    const fodderReport = await apiClient.getReport('fodder');
    const fodderCount = fodderReport.items?.length ?? (Array.isArray(fodderReport) ? fodderReport.length : 0);
    expect(fodderCount).toBeGreaterThan(0);

    const expensesReport = await apiClient.getReport('expenses');
    const expCount = expensesReport.items?.length ?? (Array.isArray(expensesReport) ? expensesReport.length : 0);
    expect(expCount).toBeGreaterThan(0);

    const inspectionsReport = await apiClient.getReport('inspections');
    const inspCount = inspectionsReport.items?.length ?? (Array.isArray(inspectionsReport) ? inspectionsReport.length : 0);
    expect(inspCount).toBeGreaterThan(0);

    // 5. Navigate to Web Admin Portal and verify UI rendering on Overview
    await adminDashboard.goto(env.webAdminUrl);
    await adminDashboard.expectKpisLoaded();

    // Verify UI KPI metric values
    const farmersText = await adminDashboard.totalFarmersCard.innerText();
    expect(parseInt(farmersText, 10)).toBeGreaterThanOrEqual(5);

    const campsText = await adminDashboard.activeCampsCard.innerText();
    expect(parseInt(campsText, 10)).toBeGreaterThanOrEqual(4);

    const cattleText = await adminDashboard.totalCattleCard.innerText();
    expect(parseInt(cattleText, 10)).toBeGreaterThanOrEqual(5);

    const utilText = await adminDashboard.utilizationCard.innerText();
    expect(utilText).toContain('%');
    expect(utilText).not.toBe('0.0%');

    // 6. Verify Camps monitoring table on Overview
    await expect(adminDashboard.campsTableContainer).toBeVisible();
    await adminDashboard.pause(600);
    const campRowCount = await adminDashboard.campsTableRows.count();
    expect(campRowCount).toBeGreaterThanOrEqual(4);

    const tableContent = await adminDashboard.campsTableBody.innerText();
    expect(tableContent).toContain('Paithan');
    expect(tableContent).toContain('Ambad');
    expect(tableContent).toContain('Georai');
    expect(tableContent).toContain('Madha');

    // 7. Navigate to Camps tab and verify camp rankings section
    await adminDashboard.navigateToSection('camps');
    await adminDashboard.pause(400);
    const rankingsTable = page.locator('#camp-rankings-table-body tr');
    await expect(rankingsTable.first()).toBeVisible();
    const rankingCount = await rankingsTable.count();
    expect(rankingCount).toBeGreaterThanOrEqual(4);

    // 8. Navigate to Reports tab and verify interactive statutory tables
    await adminDashboard.navigateToSection('reports');
    await expect(adminDashboard.csvExportActions).toBeVisible();

    // Check Admissions Tab
    await adminDashboard.tabAdmissions.click();
    await page.waitForTimeout(400);
    await expect(adminDashboard.reportTableContainer).toBeVisible();
    const admissionsTableText = await adminDashboard.reportTableContainer.innerText();
    expect(admissionsTableText).toContain('ADM-');

    // Check Fodder Tab
    await adminDashboard.tabFodder.click();
    await page.waitForTimeout(400);
    const fodderTableText = await adminDashboard.reportTableContainer.innerText();
    expect(fodderTableText.length).toBeGreaterThan(20);

    // Check Expenses Tab
    await adminDashboard.tabExpenses.click();
    await page.waitForTimeout(400);
    const expensesTableText = await adminDashboard.reportTableContainer.innerText();
    expect(expensesTableText).toMatch(/Labour|Water|Electricity|Transportation/);

    // Check Inspections Tab
    await adminDashboard.tabInspections.click();
    await page.waitForTimeout(400);
    const inspectionsTableText = await adminDashboard.reportTableContainer.innerText();
    expect(inspectionsTableText).toMatch(/Deshmukh|More|Sonawane|OFF-/);
  });
});
