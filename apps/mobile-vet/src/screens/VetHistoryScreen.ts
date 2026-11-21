import { apiClient } from '../config';
import { VetVerificationResult } from '@chara-chhavani/api-client';

export class VetHistoryController {
  public static async loadHistory(doctorId?: string): Promise<VetVerificationResult[]> {
    try {
      const res = await apiClient.vet.getHistory(doctorId);
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch (e) {
      console.error('Failed to load vet history:', e);
      return [];
    }
  }
}
