import { apiClient } from '../config';
import { VetDashboardDto } from '@chara-chhavani/api-client';

export class VetDashboardController {
  public static async loadDashboard(doctorId?: string): Promise<VetDashboardDto | null> {
    try {
      const res = await apiClient.vet.getDashboard(doctorId);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (e) {
      console.error('Failed to load vet dashboard:', e);
      return null;
    }
  }
}
