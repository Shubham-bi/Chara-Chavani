import { apiClient } from '../config';
import { 
  AdminDashboardSummaryDto, 
  CampUtilizationSummaryDto,
  AdmissionAuditReportItemDto,
  FodderReconciliationReportItemDto,
  ExpenseAuditReportItemDto,
  InspectionAuditReportItemDto
} from '@chara-chhavani/api-client';

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

  public static async fetchAdmissionReport(campId?: number, district?: string): Promise<AdmissionAuditReportItemDto[]> {
    const res = await apiClient.reports.getAdmissions({ campId, district });
    return res.data || [];
  }

  public static async fetchFodderReconciliation(campId?: number, district?: string): Promise<FodderReconciliationReportItemDto[]> {
    const res = await apiClient.reports.getFodderReconciliation({ campId, district });
    return res.data || [];
  }

  public static async fetchExpenseAudit(campId?: number, district?: string): Promise<ExpenseAuditReportItemDto[]> {
    const res = await apiClient.reports.getExpenses({ campId, district });
    return res.data || [];
  }

  public static async fetchInspectionAudit(campId?: number, district?: string): Promise<InspectionAuditReportItemDto[]> {
    const res = await apiClient.reports.getInspections({ campId, district });
    return res.data || [];
  }

  public static getReportDownloadUrl(reportType: 'admissions' | 'fodder' | 'expenses' | 'inspections', campId?: number, district?: string): string {
    return apiClient.reports.getExportUrl(reportType, { campId, district });
  }
}

