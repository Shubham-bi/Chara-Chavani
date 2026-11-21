import { apiClient } from '../config';
import { ReleaseResult, AdmissionResult } from '@chara-chhavani/api-client';

export class AnimalReleaseController {
  public static async loadCampAdmittedAnimals(campId: number): Promise<AdmissionResult[]> {
    try {
      const res = await apiClient.admissions.getCampAdmissions(campId, 'Admitted');
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch (e) {
      console.error('Failed to load admitted animals:', e);
      return [];
    }
  }

  public static async releaseAnimal(
    admissionId: number,
    operatorId: string,
    remarks?: string
  ): Promise<{ success: boolean; message: string; data?: ReleaseResult }> {
    try {
      const res = await apiClient.admissions.release(admissionId, operatorId, remarks);
      if (res.success && res.data) {
        return {
          success: true,
          message: 'जनावर यशस्वीरीत्या सोडण्यात आले (Animal released successfully).',
          data: res.data,
        };
      }
      return { success: false, message: res.message || 'जनावर सोडणे अयशस्वी.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'नेटवर्क त्रुटी.' };
    }
  }
}
