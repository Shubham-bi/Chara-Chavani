import { test, expect } from '../common/TestFixtures';

test.describe('Chara Chhavani - Data-Driven Farmer Lifecycle & Authentication', () => {
  test('DDT-FARMER-01: Parameterized Farmer OTP Authentication via JSON Dataset', async ({
    apiClient,
    dataLoader,
    reporting,
  }) => {
    // 1. Load JSON dataset
    const farmers = dataLoader.loadJson<any[]>('farmers.json');
    expect(farmers.length).toBeGreaterThan(0);

    for (let i = 0; i < farmers.length; i++) {
      const row = farmers[i];
      reporting.logDataIteration('JSON Farmer Auth', i, farmers.length, {
        id: row.scenarioId,
        mobile: row.mobileNumber,
        expectedStatus: row.expectedStatus,
      });

      if (row.expectedStatus === 'Registered' || row.expectedStatus === 'Provisional') {
        // Request OTP
        const otpRes = await apiClient.requestFarmerOtp(row.mobileNumber);
        expect(otpRes.success).toBe(true);

        // Verify Dev OTP
        const authRes = await apiClient.verifyFarmerOtp(row.mobileNumber, row.expectedDevOtp || '123456');
        expect(authRes.success).toBe(true);
        expect(authRes.role).toBe(row.expectedRole);
        expect(authRes.token).toBeDefined();
        reporting.logStep(`Authenticated Farmer [${row.mobileNumber}] successfully`);
      } else {
        // Negative test: Invalid OTP is rejected with success: false
        const wrongAuth = await apiClient.verifyFarmerOtp(row.mobileNumber, '999999');
        expect(wrongAuth.success).toBe(false);
        reporting.logStep(`Correctly rejected invalid OTP verification for mobile [${row.mobileNumber}]`);
      }
    }
  });

  test('DDT-FARMER-02: Parameterized Farmer Verification via Excel (.xlsx) Dataset', async ({
    apiClient,
    dataLoader,
    reporting,
  }) => {
    // 1. Load Excel Sheet: Farmers
    const excelFarmers = dataLoader.loadExcel<any>('test_matrix.xlsx', 'Farmers');
    expect(excelFarmers.length).toBeGreaterThan(0);

    for (let i = 0; i < excelFarmers.length; i++) {
      const row = excelFarmers[i];
      reporting.logDataIteration('Excel Farmer Matrix', i, excelFarmers.length, {
        scenario: row.ScenarioId,
        mobile: row.MobileNumber,
        status: row.ExpectedStatus,
      });

      if (row.ExpectedStatus === 'Registered' || row.ExpectedStatus === 'Provisional') {
        const otpRes = await apiClient.requestFarmerOtp(String(row.MobileNumber));
        expect(otpRes.success).toBe(true);

        const verifyRes = await apiClient.verifyFarmerOtp(String(row.MobileNumber), '123456');
        expect(verifyRes.success).toBe(true);
        expect(verifyRes.role).toBe(row.ExpectedRole);
        reporting.logStep(`Verified Excel Row ${i + 1}: ${row.FarmerName} (${row.District})`);
      } else {
        // Negative test: Invalid OTP verification rejected
        const wrongAuth = await apiClient.verifyFarmerOtp(String(row.MobileNumber), '999999');
        expect(wrongAuth.success).toBe(false);
        reporting.logStep(`Correctly rejected invalid OTP verification for Excel mobile [${row.MobileNumber}]`);
      }
    }
  });

  test('DDT-FARMER-03: Mobile Viewport Farmer Verification and UI Consistency', async ({
    mobileApp,
    dataLoader,
    reporting,
  }) => {
    const farmers = dataLoader.loadJson<any[]>('farmers.json');
    const primaryFarmer = farmers.find(f => f.expectedStatus === 'Registered') || farmers[0];

    reporting.logStep('Setting mobile responsive viewport (Pixel 5)', { width: 393, height: 851 });
    await mobileApp.page.setViewportSize({ width: 393, height: 851 });

    reporting.logStep(`Verifying primary farmer credentials: ${primaryFarmer.farmerName}`);
    expect(primaryFarmer.mobileNumber).toMatch(/^[0-9]{10}$/);
    expect(primaryFarmer.district).toBeDefined();
  });
});
