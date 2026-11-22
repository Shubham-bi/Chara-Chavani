import { test, expect } from '../common/TestFixtures';

test.describe('Chara Chhavani - Data-Driven Statutory Reports & Analytical Views', () => {
  test('DDT-REPORT-01: Parameterized Audit CSV Exports Verification via JSON', async ({
    adminDashboard,
    apiClient,
    dataLoader,
    reporting,
    assertions,
  }) => {
    const metricsConfig = dataLoader.loadJson<any>('dashboard-metrics.json');
    const reports = metricsConfig.statutoryReports;
    expect(reports.length).toBe(4);

    await adminDashboard.goto();
    await adminDashboard.waitForReady();

    // Navigate to Reports Section
    reporting.logStep('Navigating to Reports analytical section');
    await adminDashboard.page.locator('button[data-section="reports"]').click();
    await adminDashboard.page.waitForTimeout(200);

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      reporting.logDataIteration('Audit Report Tab Check', i, reports.length, {
        tab: report.tabId,
        endpoint: report.endpoint,
        file: report.fileName,
      });

      // Click tab
      const tabLocator = adminDashboard.page.locator(`#${report.tabId}`);
      await expect(tabLocator).toBeVisible();
      await tabLocator.click();
      await expect(tabLocator).toHaveClass(/active/);

      // Verify export link
      const exportLink = adminDashboard.page.locator(`#${report.exportLinkId}`);
      await expect(exportLink).toBeVisible();
      const href = await exportLink.getAttribute('href');
      expect(href).toContain(report.endpoint);

      // Direct API verification of CSV output
      const csvRes = await fetch(`${apiClient.baseUrl}${report.endpoint}`);
      expect(csvRes.ok).toBe(true);
      const csvText = await csvRes.text();
      assertions.assertCsvHeaders(csvText, report.expectedColumns);

      reporting.logStep(`Verified statutory report [${report.fileName}] headers and endpoint`);
    }
  });

  test('DDT-REPORT-02: Parameterized Analytical Navigation Sections via JSON', async ({
    adminDashboard,
    dataLoader,
    reporting,
  }) => {
    const metricsConfig = dataLoader.loadJson<any>('dashboard-metrics.json');
    const sections = metricsConfig.analyticalSections;
    expect(sections.length).toBe(8);

    await adminDashboard.goto();

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      reporting.logStep(`Navigating to analytical view: ${sec.id}`);

      const navBtn = adminDashboard.page.locator(sec.navSelector);
      await expect(navBtn).toBeVisible();
      await navBtn.click();
      await adminDashboard.page.waitForTimeout(100);

      const view = adminDashboard.page.locator(sec.viewSelector);
      await expect(view).toBeVisible();
    }
  });

  test('DDT-REPORT-03: Parameterized KPI Thresholds Audit via Excel (.xlsx)', async ({
    adminDashboard,
    dataLoader,
    reporting,
  }) => {
    const excelKpis = dataLoader.loadExcel<any>('test_matrix.xlsx', 'KPIThresholds');
    expect(excelKpis.length).toBe(4);

    await adminDashboard.goto();
    await adminDashboard.waitForReady();

    for (const row of excelKpis) {
      reporting.logStep(`Auditing KPI card: ${row.MetricName} (Key: ${row.KpiKey})`);
      const cardValueEl = adminDashboard.page.locator(`#${row.KpiKey}`);
      await expect(cardValueEl).toBeVisible();

      const text = await cardValueEl.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
      reporting.logStep(`KPI [${row.MetricName}] displayed value: "${text.trim()}"`);
    }
  });
});
