import { apiClient } from '../config';
import { FodderType, StockSource, CampStockOverviewDto } from '@chara-chhavani/api-client';

export class FodderStockController {
  public static async loadStockOverview(campId: number): Promise<CampStockOverviewDto | null> {
    const res = await apiClient.fodder.getStock(campId);
    return res.data || null;
  }

  public static async recordFodderPurchase(params: {
    chhavaniId: number;
    sellerName: string;
    sellerMobile?: string;
    fodderType: FodderType;
    quantity: number;
    ratePerUnit: number;
  }) {
    const res = await apiClient.fodder.recordPurchase(params);
    if (!res.success) {
      throw new Error(res.message);
    }
    return res.data;
  }
}
