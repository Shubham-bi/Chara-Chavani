import { apiClient } from '../config';
import { AdminDashboardSummaryDto, CampUtilizationSummaryDto } from '@chara-chhavani/api-client';

export class AdminDashboardController {
  public static async fetchSystemKpis(): Promise<AdminDashboardSummaryDto | null> {
    const res = await apiClient.admin.getDashboard();
    if (res.success && res.data) {
      return res.data;
    }
    console.error('Failed to fetch admin KPIs:', res.message);
    return null;
  }

  public static async fetchCampsOverview(): Promise<CampUtilizationSummaryDto[]> {
    const res = await apiClient.admin.getCampsSummary();
    return res.data || [];
  }
}
