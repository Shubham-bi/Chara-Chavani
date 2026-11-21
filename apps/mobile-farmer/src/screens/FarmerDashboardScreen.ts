import { apiClient } from '../config';
import { FarmerDashboardDto } from '@chara-chhavani/api-client';

export class FarmerDashboardController {
  public static async loadDashboard(farmerId: number): Promise<FarmerDashboardDto | null> {
    const res = await apiClient.farmers.getDashboard(farmerId);
    if (res.success && res.data) {
      return res.data;
    }
    console.error('Failed to load farmer dashboard:', res.message);
    return null;
  }
}
