import { apiClient } from '../config';
import { RecordCampInspectionRequest } from '@chara-chhavani/api-client';

export class CampInspectionFormController {
  public static async submitInspection(
    request: RecordCampInspectionRequest
  ): Promise<{ success: boolean; message: string; inspectionId?: number }> {
    if (request.chhavaniId <= 0) {
      return { success: false, message: 'छावणी निवडणे आवश्यक आहे (Camp must be selected).' };
    }
    if (request.physicalAnimalCount < 0) {
      return { success: false, message: 'प्रत्यक्ष जनावरांची संख्या ० किंवा जास्त असावी.' };
    }
    if (request.cleanlinessScore !== undefined && (request.cleanlinessScore < 1 || request.cleanlinessScore > 5)) {
      return { success: false, message: 'स्वच्छता गुण १ ते ५ दरम्यान असावे.' };
    }

    try {
      const res = await apiClient.officer.recordInspection(request);
      if (res.success && res.data) {
        return {
          success: true,
          message: 'तपासणी अहवाल यशस्वीरीत्या नोंदवला (Inspection recorded successfully).',
          inspectionId: res.data,
        };
      }
      return { success: false, message: res.message || 'तपासणी नोंद अयशस्वी.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'नेटवर्क त्रुटी.' };
    }
  }
}
