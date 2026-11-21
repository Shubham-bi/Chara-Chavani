import { apiClient } from '../config';
import { AnimalDto } from '@chara-chhavani/api-client';

export class MyAnimalsController {
  public static async loadAnimals(farmerId: number, statusFilter?: string): Promise<AnimalDto[]> {
    try {
      const res = await apiClient.farmers.getAnimals(farmerId, statusFilter);
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch (e) {
      console.error('Failed to load farmer animals:', e);
      return [];
    }
  }

  public static async resubmitAnimal(
    animalId: number,
    updates: { breed: string; ageInMonths: number; tagNumber?: string; photoUrl?: string }
  ): Promise<{ success: boolean; message: string; data?: AnimalDto }> {
    try {
      const res = await apiClient.animals.resubmit(animalId, updates);
      if (res.success && res.data) {
        return { success: true, message: 'जनावराची माहिती पुन्हा सादर केली (Animal resubmitted successfully).', data: res.data };
      }
      return { success: false, message: res.message || 'पुन्हा सादर करणे अयशस्वी.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'नेटवर्क त्रुटी.' };
    }
  }
}
