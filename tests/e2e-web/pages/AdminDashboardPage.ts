import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AdminDashboardPage: Page Object Model for the Maharashtra State Relief
 * Commissionerate Web Admin Portal (Power BI Shell).
 */
export class AdminDashboardPage extends BasePage {
  // Header locators
  readonly headerTitle: Locator;
  readonly adminAuthorityBadge: Locator;
  readonly refreshButton: Locator;
  readonly lastRefreshLabel: Locator;

  // Navigation tab bar (8 Power BI sections)
  readonly navTabsBar: Locator;
  readonly navOverviewTab: Locator;
  readonly navGeographicTab: Locator;
  readonly navCampsTab: Locator;
  readonly navAnimalsTab: Locator;
  readonly navVeterinaryTab: Locator;
  readonly navFodderTab: Locator;
  readonly navFinancialTab: Locator;
  readonly navReportsTab: Locator;

  // Filter toolbar
  readonly filterDistrictSelect: Locator;
  readonly filterTalukaSelect: Locator;
  readonly filterMetricSelect: Locator;
  readonly resetFiltersButton: Locator;
  readonly breadcrumbs: Locator;

  // Top Primary KPI cards
  readonly totalFarmersCard: Locator;
  readonly totalCattleCard: Locator;
  readonly activeCampsCard: Locator;
  readonly utilizationCard: Locator;

  // Secondary KPI cards
  readonly kpiPendingVet: Locator;
  readonly kpiVerifiedAnimals: Locator;
  readonly kpiFodderStock: Locator;
  readonly kpiTotalSpend: Locator;

  // Interactive Geographic Map & Dossier
  readonly mapViewport: Locator;
  readonly mapLegend: Locator;
  readonly toggleBoundaries: Locator;
  readonly toggleMarkers: Locator;
  readonly toggleGeofence: Locator;
  readonly campDossierPanel: Locator;
  readonly dossierCampName: Locator;
  readonly dossierCampCode: Locator;
  readonly dossierCapacity: Locator;
  readonly dossierAdmitted: Locator;

  // Active Camps Table
  readonly campsTableContainer: Locator;
  readonly campsTableBody: Locator;
  readonly campsTableRows: Locator;

  // Reports Section
  readonly csvExportActions: Locator;
  readonly tabAdmissions: Locator;
  readonly tabFodder: Locator;
  readonly tabExpenses: Locator;
  readonly tabInspections: Locator;
  readonly reportTableContainer: Locator;

  constructor(page: Page) {
    super(page);

    this.headerTitle = page.locator('.header h2');
    this.adminAuthorityBadge = page.locator('.header');
    this.refreshButton = page.locator('#btn-refresh');
    this.lastRefreshLabel = page.locator('#last-refresh-time');

    this.navTabsBar = page.locator('#main-nav-bar');
    this.navOverviewTab = page.locator('button[data-section="overview"]');
    this.navGeographicTab = page.locator('button[data-section="geographic"]');
    this.navCampsTab = page.locator('button[data-section="camps"]');
    this.navAnimalsTab = page.locator('button[data-section="animals"]');
    this.navVeterinaryTab = page.locator('button[data-section="veterinary"]');
    this.navFodderTab = page.locator('button[data-section="fodder"]');
    this.navFinancialTab = page.locator('button[data-section="financial"]');
    this.navReportsTab = page.locator('button[data-section="reports"]');

    this.filterDistrictSelect = page.locator('#filter-district');
    this.filterTalukaSelect = page.locator('#filter-taluka');
    this.filterMetricSelect = page.locator('#filter-metric');
    this.resetFiltersButton = page.locator('#btn-reset-filters');
    this.breadcrumbs = page.locator('#map-breadcrumbs');

    this.totalFarmersCard = page.locator('#total-farmers');
    this.totalCattleCard = page.locator('#total-cattle');
    this.activeCampsCard = page.locator('#active-camps');
    this.utilizationCard = page.locator('#utilization');

    this.kpiPendingVet = page.locator('#kpi-pending-vet');
    this.kpiVerifiedAnimals = page.locator('#kpi-verified-animals');
    this.kpiFodderStock = page.locator('#kpi-fodder-stock');
    this.kpiTotalSpend = page.locator('#kpi-total-spend');

    this.mapViewport = page.locator('#map-viewport');
    this.mapLegend = page.locator('#map-legend-container');
    this.toggleBoundaries = page.locator('#toggle-layer-boundaries');
    this.toggleMarkers = page.locator('#toggle-layer-markers');
    this.toggleGeofence = page.locator('#toggle-layer-geofence');
    this.campDossierPanel = page.locator('#camp-dossier-panel');
    this.dossierCampName = page.locator('#dossier-camp-name');
    this.dossierCampCode = page.locator('#dossier-camp-code');
    this.dossierCapacity = page.locator('#dossier-capacity');
    this.dossierAdmitted = page.locator('#dossier-admitted');

    this.campsTableContainer = page.locator('#camps-table-container');
    this.campsTableBody = page.locator('#camps-table-body');
    this.campsTableRows = page.locator('#camps-table-body tr');

    this.csvExportActions = page.locator('#csv-export-actions');
    this.tabAdmissions = page.locator('#tab-admissions');
    this.tabFodder = page.locator('#tab-fodder');
    this.tabExpenses = page.locator('#tab-expenses');
    this.tabInspections = page.locator('#tab-inspections');
    this.reportTableContainer = page.locator('#report-table-container');
  }

  async navigateToSection(section: 'overview' | 'geographic' | 'camps' | 'animals' | 'veterinary' | 'fodder' | 'financial' | 'reports') {
    const tabLocator = this.page.locator(`button[data-section="${section}"]`);
    await tabLocator.click();
    await expect(tabLocator).toHaveClass(/active/);
    await expect(this.page.locator(`#section-${section}`)).toBeVisible();
  }

  async selectDistrict(districtName: string) {
    await this.filterDistrictSelect.selectOption(districtName);
    await this.pause(300);
  }

  async selectMetric(metric: 'camps' | 'animals' | 'utilization') {
    await this.filterMetricSelect.selectOption(metric);
    await this.pause(300);
  }

  async selectFirstCamp() {
    await expect(this.campsTableRows.first()).toBeVisible();
    await this.campsTableRows.first().click();
  }

  async expectKpisLoaded() {
    await expect(this.totalFarmersCard).toBeVisible();
    await expect(this.totalCattleCard).toBeVisible();
    await expect(this.activeCampsCard).toBeVisible();
    await expect(this.utilizationCard).toBeVisible();
  }

  async expectDossierOpen() {
    await expect(this.campDossierPanel).toBeVisible();
    await expect(this.dossierCampName).toBeVisible();
    await expect(this.dossierCampCode).toBeVisible();
    await expect(this.dossierCapacity).toBeVisible();
  }
}
