/**
 * DatabaseHelper: Data integrity, baseline verification, and business math checks.
 */
export class DatabaseHelper {
  readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async runBaselineSeed(): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/api/v1/master/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    return res.ok;
  }

  /**
   * Validates dual-source inventory invariant:
   * Total Available Stock = Store Stock + In Farm Stock
   */
  validateDualSourceStockMath(storeKg: number, inFarmKg: number, totalExpectedKg: number): boolean {
    return Math.abs((storeKg + inFarmKg) - totalExpectedKg) < 0.001;
  }

  /**
   * Validates camp capacity invariant:
   * Occupancy <= Configured Capacity
   */
  validateCapacityLimit(admitted: number, capacity: number): boolean {
    return admitted >= 0 && admitted <= capacity;
  }
}
