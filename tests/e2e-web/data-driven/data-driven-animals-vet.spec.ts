import { test, expect } from '../common/TestFixtures';

test.describe('Chara Chhavani - Data-Driven Cattle Breeds & Vet Verification', () => {
  test('DDT-ANIMAL-01: Parameterized Cattle Breeds & Fodder Rules via JSON', async ({
    apiClient,
    dataLoader,
    reporting,
  }) => {
    const animals = dataLoader.loadJson<any[]>('animals.json');
    expect(animals.length).toBeGreaterThan(0);

    // Fetch master breeds from API
    const res = await fetch(`${apiClient.baseUrl}/api/v1/master/breeds`);
    const json = await res.json();
    const liveBreeds: Array<{ id?: number; englishName?: string; marathiName?: string }> = json.data || [];
    expect(liveBreeds.length).toBeGreaterThan(0);

    for (let i = 0; i < animals.length; i++) {
      const animal = animals[i];
      reporting.logDataIteration('JSON Animal Audit', i, animals.length, {
        tag: animal.tagNumber,
        category: animal.category,
        breed: animal.breed,
        dailyKg: animal.expectedDailyFodderKg,
      });

      // Verify statutory fodder allocation limits
      if (animal.category === 'Large Cattle') {
        expect(animal.expectedDailyFodderKg).toBeGreaterThanOrEqual(12.0);
        expect(animal.expectedDailyFodderKg).toBeLessThanOrEqual(25.0);
      } else if (animal.category === 'Small Cattle') {
        expect(animal.expectedDailyFodderKg).toBeGreaterThanOrEqual(2.0);
        expect(animal.expectedDailyFodderKg).toBeLessThanOrEqual(6.0);
      }

      // Verify breed is recognized in state catalog
      const matched = liveBreeds.some(b => (b.englishName || '').toLowerCase().includes(animal.breed.split(' ')[0].toLowerCase()));
      expect(matched).toBe(true);

      reporting.logStep(`Statutory limits confirmed for ${animal.breed} (${animal.category})`);
    }
  });

  test('DDT-ANIMAL-02: Parameterized Cattle Verification Matrix via Excel (.xlsx)', async ({
    dataLoader,
    reporting,
  }) => {
    const excelAnimals = dataLoader.loadExcel<any>('test_matrix.xlsx', 'Animals');
    expect(excelAnimals.length).toBeGreaterThan(0);

    for (let i = 0; i < excelAnimals.length; i++) {
      const row = excelAnimals[i];
      reporting.logDataIteration('Excel Animal Matrix', i, excelAnimals.length, {
        tag: row.TagNumber,
        breed: row.Breed,
        category: row.Category,
        dailyKg: row.DailyFodderKg,
        status: row.Status,
      });

      expect(row.TagNumber).toMatch(/^MH-TAG-[0-9]{4}$/);
      expect(Number(row.DailyFodderKg)).toBeGreaterThan(0);
      expect(row.Status).toBe('Verified');
    }
  });

  test('DDT-ANIMAL-03: Fodder Catalog Reference Data Verification', async ({
    apiClient,
    reporting,
  }) => {
    const res = await fetch(`${apiClient.baseUrl}/api/v1/master/fodder-types`);
    const json = await res.json();
    const fodderTypes: Array<{ id?: number; englishName?: string; marathiName?: string }> = json.data || [];

    reporting.logStep(`Retrieved ${fodderTypes.length} official fodder types from master catalog`);
    expect(fodderTypes.length).toBeGreaterThanOrEqual(4);

    const names = fodderTypes.map(f => (f.englishName || '').toLowerCase());
    const hasRoughageOrGreen = names.some(n => n.includes('green') || n.includes('dry') || n.includes('sorghum') || n.includes('maize') || n.includes('roughage'));
    expect(hasRoughageOrGreen).toBe(true);
  });
});
