import { test, expect } from './common/TestFixtures';
import * as path from 'path';

test.describe('Chara Chhavani - All 5 Applications in Chrome View Suite', () => {
  test('ALL-APPS-01: Chrome View Portal renders and navigates all 5 applications seamlessly', async ({
    mobileApp,
    env,
    page,
  }) => {
    const artifactDir = 'C:/Users/Shubham/.gemini/antigravity/brain/89cd608d-4484-41d3-8696-f5413b7bb689';

    // 1. Navigate to the unified multi-app portal in Chrome
    await mobileApp.goto(env.webAdminUrl);
    await expect(mobileApp.appLauncherBar).toBeVisible();

    // 2. Verify State Admin Portal is loaded by default
    await expect(mobileApp.viewAdmin).toBeVisible();
    await expect(mobileApp.tabAdmin).toHaveClass(/active/);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-01-admin-portal.png'), fullPage: false });

    // 3. Switch to Farmer Relief Mobile App
    await mobileApp.switchApp('farmer');
    await expect(mobileApp.viewFarmer).toBeVisible();
    await expect(page.locator('#farmer-bezel')).toBeVisible();
    await expect(page.locator('#farmer-cattle-list')).toBeVisible();

    // Assert farmer profile and livestock items
    const farmerText = await page.locator('#app-view-farmer').innerText();
    expect(farmerText).toContain('किसन तुकाराम जाधव');
    expect(farmerText).toContain('9890123456');
    expect(farmerText).toContain('MH-20-4001');
    expect(farmerText).toContain('MH-20-4002');

    // Register a new animal in Farmer App
    await page.fill('#farmer-reg-tag', 'MH-20-4009');
    await page.selectOption('#farmer-reg-breed', 'Gir');
    await page.click('#farmer-btn-register');
    await expect(page.locator('#farmer-reg-feedback')).toBeVisible();
    expect(await page.locator('#farmer-reg-feedback').innerText()).toContain('नोंदणी यशस्वी');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-02-farmer-app.png') });

    // 4. Switch to Chhavani Camp Operator App
    await mobileApp.switchApp('chhavani');
    await expect(mobileApp.viewChhavani).toBeVisible();
    await expect(page.locator('#operator-bezel')).toBeVisible();

    // Assert camp profile
    const operatorText = await page.locator('#app-view-chhavani').innerText();
    expect(operatorText).toContain('CHV-MH-PAITHAN-001');

    // Test Gate Admission & Geofence Validator
    await page.fill('#op-adm-tag', 'MH-20-4003');
    await page.fill('#op-adm-lat', '19.8210');
    await page.fill('#op-adm-lon', '75.3310');
    await page.click('#op-btn-validate-geofence');
    await expect(page.locator('#op-geofence-feedback')).toBeVisible();
    expect(await page.locator('#op-geofence-feedback').innerText()).toMatch(/जिओफेन्स|कुंपणाच्या आत/);

    // Test Issue Daily Feeding
    await page.click('#op-btn-quick-feeding');
    await expect(page.locator('#op-feeding-feedback')).toBeVisible();
    expect(await page.locator('#op-feeding-feedback').innerText()).toContain('यशस्वीरित्या नोंदवले');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-03-chhavani-operator-app.png') });

    // 5. Switch to Veterinary Doctor App
    await mobileApp.switchApp('vet');
    await expect(mobileApp.viewVet).toBeVisible();
    await expect(page.locator('#vet-bezel')).toBeVisible();

    const vetText = await page.locator('#app-view-vet').innerText();
    expect(vetText).toContain('DOC-MH-AUR-01');
    expect(vetText).toContain('MH-20-4004');

    // Perform clinical approval
    await page.click('#vet-btn-approve');
    await expect(page.locator('#vet-approval-feedback')).toBeVisible();
    expect(await page.locator('#vet-approval-feedback').innerText()).toContain('वैद्यकीय मंजुरी');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-04-vet-doctor-app.png') });

    // 6. Switch to Government Inspection Officer App
    await mobileApp.switchApp('officer');
    await expect(mobileApp.viewOfficer).toBeVisible();
    await expect(page.locator('#officer-bezel')).toBeVisible();

    const officerText = await page.locator('#app-view-officer').innerText();
    expect(officerText).toContain('डॉ. आनंद देशमुख');

    // Test Headcount Discrepancy Real-time Calculation
    await page.fill('#officer-physical-count', '3');
    await page.dispatchEvent('#officer-physical-count', 'input');
    await expect(page.locator('#officer-discrepancy-badge')).toHaveText(/MATCH/);

    // Test Discrepancy Alert when counts differ
    await page.fill('#officer-physical-count', '5');
    await page.dispatchEvent('#officer-physical-count', 'input');
    await expect(page.locator('#officer-discrepancy-badge')).toHaveText(/तफावत आढळली/);

    // Submit Officer Inspection Audit Report
    await page.click('#officer-btn-submit');
    await expect(page.locator('#officer-inspection-feedback')).toBeVisible();
    expect(await page.locator('#officer-inspection-feedback').innerText()).toContain('शासन दप्तरी नोंदवला');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-05-officer-audit-app.png') });

    // 7. Switch to Quad Multi-App View
    await mobileApp.switchApp('quad');
    await expect(mobileApp.viewQuad).toBeVisible();
    const quadText = await page.locator('#app-view-quad').innerText();
    expect(quadText).toContain('शेतकरी ॲप');
    expect(quadText).toContain('छावणी ऑपरेटर');
    expect(quadText).toContain('पशुवैद्यकीय अधिकारी');
    expect(quadText).toContain('क्षेत्रीय तपासणी');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-06-quad-multi-app.png') });

    // 8. Toggle Device Frame (Smartphone Bezel vs Full-Width View)
    await mobileApp.switchApp('farmer');
    await mobileApp.toggleDeviceFrame();
    await expect(page.locator('#farmer-bezel')).toHaveClass(/full-width/);
    await mobileApp.toggleDeviceFrame();
    await expect(page.locator('#farmer-bezel')).not.toHaveClass(/full-width/);

    // 9. Return to State Admin Portal
    await mobileApp.switchApp('admin');
    await expect(mobileApp.viewAdmin).toBeVisible();
  });
});
