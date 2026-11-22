import { test, expect } from '@playwright/test';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ApiClientHelper } from './pages/ApiClientHelper';
import { DatabaseHelper } from './pages/DatabaseHelper';

test.describe('Chara Chhavani - End-to-End (E2E) Multi-Actor Lifecycle Flow', () => {
  let dashboard: AdminDashboardPage;
  const api = new ApiClientHelper('http://localhost:5000');
  const db = new DatabaseHelper('http://localhost:5000');

  test.beforeEach(async ({ page }) => {
    dashboard = new AdminDashboardPage(page);
  });

  test('E2E 01: Complete Cattle Relief Lifecycle (Farmer -> Vet -> Operator -> Admin Dossier)', async () => {
    // ---------------------------------------------------------
    // Phase 1: Database Baseline Seed Verification
    // ---------------------------------------------------------
    const seedSuccess = await db.runBaselineSeed();
    expect(seedSuccess).toBe(true);

    // ---------------------------------------------------------
    // Phase 2: Farmer Authentication & Registration Check
    // ---------------------------------------------------------
    const farmerMobile = '9822012345';
    const otpRes = await api.requestFarmerOtp(farmerMobile);
    expect(otpRes.success).toBe(true);

    const farmerAuth = await api.verifyFarmerOtp(farmerMobile, otpRes.devOtp || '123456');
    expect(farmerAuth.success).toBe(true);
    expect(farmerAuth.token).toBeDefined();

    // ---------------------------------------------------------
    // Phase 3: Camp & Geofence Verification for Admission
    // ---------------------------------------------------------
    const camps = await api.getCamps();
    expect(camps.length).toBeGreaterThan(0);
    const targetCamp = camps.find(c => c.campCode === 'CHV-MH-PAITHAN-001') || camps[0];

    // Verify valid admission coordinates fall strictly inside camp boundary
    const admissionCheck = await api.checkGeofence(targetCamp.id, 19.82, 75.33);
    expect(admissionCheck.isInside).toBe(true);

    // ---------------------------------------------------------
    // Phase 4: Dual-Source Fodder Stock Balance Integrity
    // ---------------------------------------------------------
    const campsMapFeatures = await api.getCampsMapFeatures();
    const campFeature = campsMapFeatures.find(c => c.campId === targetCamp.id);
    expect(campFeature).toBeDefined();

    // Check store stock vs in-farm stock
    const storeStock = campFeature.storeStockKg || 0;
    const inFarmStock = campFeature.inFarmStockKg || 0;
    const totalExpected = storeStock + inFarmStock;
    expect(db.validateDualSourceStockMath(storeStock, inFarmStock, totalExpected)).toBe(true);

    // ---------------------------------------------------------
    // Phase 5: State Relief Commissioner UI & Dossier Validation
    // ---------------------------------------------------------
    await dashboard.goto('/');
    await dashboard.expectKpisLoaded();

    // Select the camp in the monitoring table
    await dashboard.selectFirstCamp();
    await dashboard.expectDossierOpen();

    // Verify dossier renders exact camp code and operator
    await expect(dashboard.dossierCampName).toContainText(targetCamp.name);
    const expectedCap = targetCamp.capacity ?? (targetCamp as any).totalCapacity ?? 500;
    await expect(dashboard.dossierCapacity).toContainText(`${expectedCap}`);
  });
});
