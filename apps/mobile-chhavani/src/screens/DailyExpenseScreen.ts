import { apiClient } from '../config';
import { RecordExpenseRequest, CampExpenseSummaryDto } from '@chara-chhavani/api-client';

export class DailyExpenseController {
  public static async loadExpenseSummary(campId: number): Promise<CampExpenseSummaryDto | null> {
    try {
      const res = await apiClient.expenses.getSummary(campId);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (e) {
      console.error('Failed to load expense summary:', e);
      return null;
    }
  }

  public static async recordExpense(
    request: RecordExpenseRequest
  ): Promise<{ success: boolean; message: string }> {
    if (request.amount <= 0) {
      return { success: false, message: 'खर्चाची रक्कम ० पेक्षा जास्त असणे आवश्यक आहे (Amount must be greater than 0).' };
    }
    if (!request.category || request.category.trim().length === 0) {
      return { success: false, message: 'खर्चाचा प्रकार निवडणे आवश्यक आहे (Category is required).' };
    }

    try {
      const res = await apiClient.expenses.record(request);
      if (res.success) {
        return { success: true, message: 'दैनंदिन खर्च यशस्वीरीत्या नोंदवला (Expense recorded successfully).' };
      }
      return { success: false, message: res.message || 'खर्च नोंद अयशस्वी.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'नेटवर्क त्रुटी.' };
    }
  }
}
