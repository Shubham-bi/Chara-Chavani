import { apiClient } from '../config';
import { GeoCoordinate, ChhavaniDto } from '@chara-chhavani/api-client';

export class CampGeofenceController {
  public static async saveGeofence(campId: number, polygonCoords: GeoCoordinate[]): Promise<ChhavaniDto | null> {
    if (polygonCoords.length < 3) {
      throw new Error('A closed geofence polygon requires at least 3 coordinates.');
    }

    const res = await apiClient.camps.updateGeofence(campId, polygonCoords);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update camp geofence.');
  }
}
