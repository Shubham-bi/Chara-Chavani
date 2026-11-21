import { apiClient } from '../config';
import { FarmerDto } from '@chara-chhavani/api-client';

export class FarmerProfileController {
  public static async loadProfile(farmerId: number): Promise<FarmerDto | null> {
    const res = await apiClient.farmers.getDashboard(farmerId);
    if (res.success && res.data) {
      // Create a FarmerDto view representation
      return {
        id: res.data.farmerId,
        mobileNumber: '',
        name: res.data.farmerName,
        village: res.data.village,
        taluka: res.data.taluka,
        district: res.data.district,
        isRegisteredSeller: false,
      };
    }
    return null;
  }

  public static async saveProfile(profile: {
    farmerId: number;
    name: string;
    village: string;
    taluka: string;
    district: string;
    aadhaarNumber?: string;
    landHoldingHectares?: number;
    hasLandRecord712?: boolean;
  }): Promise<{ success: boolean; message: string; data?: FarmerDto }> {
    if (!profile.name || profile.name.trim().length < 2) {
      return { success: false, message: 'शेतकऱ्याचे पूर्ण नाव आवश्यक आहे (Full name is required).' };
    }
    if (!profile.village || !profile.taluka || !profile.district) {
      return { success: false, message: 'गाव, तालुका आणि जिल्हा निवडणे आवश्यक आहे.' };
    }

    try {
      const res = await apiClient.farmers.updateProfile(profile);
      if (res.success && res.data) {
        return { success: true, message: 'प्रोफाइल यशस्वीरीत्या जतन केले (Profile updated successfully).', data: res.data };
      }
      return { success: false, message: res.message || 'प्रोफाइल जतन अयशस्वी.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'नेटवर्क त्रुटी.' };
    }
  }
}
