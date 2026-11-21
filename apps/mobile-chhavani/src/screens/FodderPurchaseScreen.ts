import { apiClient } from '../config';
import { RecordFodderPurchaseRequest } from '@chara-chhavani/api-client';

export class FodderPurchaseController {
  public static async recordPurchase(
    request: RecordFodderPurchaseRequest
  ): Promise<{ success: boolean; message: string }> {
    if (request.quantityKg <= 0) {
      return { success: false, message: 'चाऱ्याचे वजन ० पेक्षा जास्त असणे आवश्यक आहे (Quantity must be greater than 0).' };
    }
    if (request.ratePerKg <= 0) {
      return { success: false, message: 'चाऱ्याचा दर ० पेक्षा जास्त असणे आवश्यक आहे (Rate must be greater than 0).' };
    }
    if (!request.supplierName || request.supplierName.trim().length === 0) {
      return { success: false, message: 'चारा पुरवठादाराचे नाव आवश्यक आहे (Supplier name is required).' };
    }

    try {
      const res = await apiClient.fodder.recordPurchase(request);
      if (res.success) {
        return { success: true, message: 'चारा खरेदी नोंद यशस्वी झाली (Fodder purchase recorded successfully).' };
      }
      return { success: false, message: res.message || 'चारा खरेदी नोंद अयशस्वी.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'नेटवर्क त्रुटी.' };
    }
  }
}
