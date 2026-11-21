import { apiClient } from '../config';
import { VerificationStatus, SubmitVerificationRequest, VetVerificationResult } from '@chara-chhavani/api-client';

export class VetVerificationController {
  public static async submitVerification(params: {
    animalId: number;
    doctorId: string;
    result: VerificationStatus;
    remarks?: string;
    inspectionLatitude?: number;
    inspectionLongitude?: number;
    verificationPhotoUrl?: string;
  }): Promise<VetVerificationResult | null> {
    const request: SubmitVerificationRequest = {
      animalId: params.animalId,
      doctorId: params.doctorId,
      result: params.result,
      remarks: params.remarks,
      inspectionLatitude: params.inspectionLatitude,
      inspectionLongitude: params.inspectionLongitude,
      verificationPhotoUrl: params.verificationPhotoUrl,
    };

    const res = await apiClient.vet.verify(request);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Verification submission failed.');
  }
}
