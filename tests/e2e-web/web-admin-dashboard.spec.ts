import { test, expect } from './common/TestFixtures';

test.describe('Chara Chhavani - State Relief Administration Web Admin Dashboard', () => {

  test('should load the dashboard with government title and header', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Chara Chhavani - State Relief Administration Dashboard/i);

    // Check header text
    const header = page.locator('.header h2');
    await expect(header).toBeVisible();
    await expect(header).toContainText('महाराष्ट्र शासन');
    await expect(header).toContainText('State Relief Dashboard');

    // Check admin authority badge
    const adminRole = page.locator('.header');
    await expect(adminRole).toContainText('State Relief Commissioner');
  });

  test('should display all four top KPI metric cards', async ({ page }) => {
    await page.goto('/');

    const metricsGrid = page.locator('#metrics-grid');
    await expect(metricsGrid).toBeVisible();

    const farmersCard = page.locator('#total-farmers');
    const cattleCard = page.locator('#total-cattle');
    const campsCard = page.locator('#active-camps');
    const utilCard = page.locator('#utilization');

    await expect(farmersCard).toBeVisible();
    await expect(cattleCard).toBeVisible();
    await expect(campsCard).toBeVisible();
    await expect(utilCard).toBeVisible();
  });

  test('should display active cattle camps monitoring table', async ({ page }) => {
    await page.goto('/');

    const tableContainer = page.locator('#camps-table-container');
    await expect(tableContainer).toBeVisible();

    // Verify table headers
    const tableHeader = tableContainer.locator('thead');
    await expect(tableHeader).toContainText('छावणी कोड');
    await expect(tableHeader).toContainText('छावणीचे नाव');
    await expect(tableHeader).toContainText('भौगोलिक कुंपण');

    // Wait for table to load
    await page.waitForTimeout(1000);
    const rows = tableContainer.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should render and navigate through all 8 Power BI analytical section tabs', async ({ page }) => {
    await page.goto('/');

    const sections = [
      { tab: 'overview', sectionId: '#section-overview' },
      { tab: 'geographic', sectionId: '#section-geographic' },
      { tab: 'camps', sectionId: '#section-camps' },
      { tab: 'animals', sectionId: '#section-animals' },
      { tab: 'veterinary', sectionId: '#section-veterinary' },
      { tab: 'fodder', sectionId: '#section-fodder' },
      { tab: 'financial', sectionId: '#section-financial' },
      { tab: 'reports', sectionId: '#section-reports' },
    ];

    for (const sec of sections) {
      const tabBtn = page.locator(`button[data-section="${sec.tab}"]`);
      await expect(tabBtn).toBeVisible();
      await tabBtn.click();
      await expect(tabBtn).toHaveClass(/active/);
      const sectionEl = page.locator(sec.sectionId);
      await expect(sectionEl).toBeVisible();
    }
  });

  test('should display interactive Geographic Intelligence Map and support metric toggles', async ({ page }) => {
    await page.goto('/');

    // Geographic viewport is on Overview
    const mapViewport = page.locator('#map-viewport');
    await expect(mapViewport).toBeVisible();

    // Map legend
    const legend = page.locator('#map-legend-container');
    await expect(legend).toBeVisible();

    // Metric selector toggle
    const metricSelect = page.locator('#filter-metric');
    await expect(metricSelect).toBeVisible();

    // Change to animals metric
    await metricSelect.selectOption('animals');
    await page.waitForTimeout(300);
    await expect(legend).toBeVisible();

    // Change to utilization metric
    await metricSelect.selectOption('utilization');
    await page.waitForTimeout(300);
    await expect(legend).toBeVisible();
  });

  test('should open Camp Dossier Side Panel when camp row is clicked', async ({ page }) => {
    await page.goto('/');

    // Ensure camps are loaded
    await page.waitForTimeout(1000);
    const firstCampRow = page.locator('#camps-table-body tr').first();
    await expect(firstCampRow).toBeVisible();

    // Click camp row
    await firstCampRow.click();

    // Verify Camp Dossier Side Panel
    const dossierPanel = page.locator('#camp-dossier-panel');
    await expect(dossierPanel).toBeVisible();

    const campName = page.locator('#dossier-camp-name');
    await expect(campName).toBeVisible();
    const campCode = page.locator('#dossier-camp-code');
    await expect(campCode).toBeVisible();
    const capacity = page.locator('#dossier-capacity');
    await expect(capacity).toBeVisible();
  });

  test('should filter geographic hierarchy and update breadcrumbs', async ({ page }) => {
    await page.goto('/');

    const districtFilter = page.locator('#filter-district');
    await expect(districtFilter).toBeVisible();

    // Select Chhatrapati Sambhajinagar
    await districtFilter.selectOption('Chhatrapati Sambhajinagar');
    await page.waitForTimeout(300);

    // Verify breadcrumbs contain district name
    const breadcrumbs = page.locator('#map-breadcrumbs');
    await expect(breadcrumbs).toContainText('Chhatrapati Sambhajinagar');
  });

  test('should display and navigate audit and compliance report tabs inside Reports section', async ({ page }) => {
    await page.goto('/');

    // Navigate to Reports section
    await page.locator('button[data-section="reports"]').click();

    const tabAdmissions = page.locator('#tab-admissions');
    const tabFodder = page.locator('#tab-fodder');
    const tabExpenses = page.locator('#tab-expenses');
    const tabInspections = page.locator('#tab-inspections');

    await expect(tabAdmissions).toBeVisible();
    await expect(tabFodder).toBeVisible();
    await expect(tabExpenses).toBeVisible();
    await expect(tabInspections).toBeVisible();

    // Default active tab is admissions
    await expect(tabAdmissions).toHaveClass(/active/);

    // Switch to Fodder Balance tab
    await tabFodder.click();
    await expect(tabFodder).toHaveClass(/active/);
    await expect(tabAdmissions).not.toHaveClass(/active/);

    // Switch to Expenses tab
    await tabExpenses.click();
    await expect(tabExpenses).toHaveClass(/active/);
    await expect(tabFodder).not.toHaveClass(/active/);

    // Switch to Inspections tab
    await tabInspections.click();
    await expect(tabInspections).toHaveClass(/active/);
    await expect(tabExpenses).not.toHaveClass(/active/);
  });

  test('should display all four CSV audit export download links inside Reports section', async ({ page }) => {
    await page.goto('/');

    // Navigate to Reports section
    await page.locator('button[data-section="reports"]').click();

    const exportContainer = page.locator('#csv-export-actions');
    await expect(exportContainer).toBeVisible();

    const exportLinks = exportContainer.locator('a');
    await expect(exportLinks).toHaveCount(4);

    await expect(exportLinks.nth(0)).toHaveAttribute('href', /reportType=admissions/);
    await expect(exportLinks.nth(1)).toHaveAttribute('href', /reportType=fodder/);
    await expect(exportLinks.nth(2)).toHaveAttribute('href', /reportType=expenses/);
    await expect(exportLinks.nth(3)).toHaveAttribute('href', /reportType=inspections/);
  });

  test('should render properly in mobile responsive viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const header = page.locator('.header');
    await expect(header).toBeVisible();

    const metricsGrid = page.locator('#metrics-grid');
    await expect(metricsGrid).toBeVisible();
  });
});
