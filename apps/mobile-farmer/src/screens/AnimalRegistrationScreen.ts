import { apiClient } from '../config';
import { AnimalType, Gender, RegisterAnimalRequest, AnimalDto } from '@chara-chhavani/api-client';

export class AnimalRegistrationController {
  public static async registerAnimal(params: {
    farmerId: number;
    animalType: AnimalType;
    breed: string;
    gender: Gender;
    ageInMonths: number;
    tagNumber?: string;
    photoUrl: string;
  }): Promise<AnimalDto | null> {
    const request: RegisterAnimalRequest = {
      farmerId: params.farmerId,
      animalType: params.animalType,
      breed: params.breed,
      gender: params.gender,
      ageInMonths: params.ageInMonths,
      tagNumber: params.tagNumber,
      photoUrl: params.photoUrl,
    };

    const res = await apiClient.animals.register(request);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to register animal.');
  }
}
