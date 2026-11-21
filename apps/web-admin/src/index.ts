import { apiClient } from './config';
import { AdminDashboardController } from './controllers/AdminDashboardController';
import { AdminDashboardSummaryDto, CampUtilizationSummaryDto } from '@chara-chhavani/api-client';

export class AdminWebDashboardApp {
  public static async loadDashboardData(): Promise<{
    summary: AdminDashboardSummaryDto | null;
    camps: CampUtilizationSummaryDto[];
  }> {
    const summary = await AdminDashboardController.fetchSystemKpis();
    const camps = await AdminDashboardController.fetchCampsOverview();
    return { summary, camps };
  }

  public static async authenticateAdmin(username: string, password: string): Promise<boolean> {
    const res = await apiClient.auth.adminLogin({ username, password });
    return res.success;
  }
}

export * from './config';
export * from './controllers/AdminDashboardController';
