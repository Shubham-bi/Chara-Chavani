import { apiClient } from '../config';
import { AdmissionResult, AnimalAdmissionSearchDto } from '@chara-chhavani/api-client';

export class AnimalAdmissionController {
  public static async searchAnimal(searchTerm: string): Promise<AnimalAdmissionSearchDto[]> {
    const res = await apiClient.admissions.search(searchTerm);
    return res.data || [];
  }

  public static async admitAnimalWithGeofence(params: {
    animalId: number;
    chhavaniId: number;
    operatorId: string;
    photoUrl: string;
    deviceLatitude: number;
    deviceLongitude: number;
  }): Promise<AdmissionResult> {
    const res = await apiClient.admissions.admit({
      animalId: params.animalId,
      chhavaniId: params.chhavaniId,
      operatorId: params.operatorId,
      photoUrl: params.photoUrl,
      deviceLatitude: params.deviceLatitude,
      deviceLongitude: params.deviceLongitude,
    });

    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Admission rejected.');
  }
}
