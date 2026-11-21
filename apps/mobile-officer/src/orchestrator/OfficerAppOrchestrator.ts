import { apiClient } from '../config';
import { sessionManager } from '@chara-chhavani/ui-core';
import { OfficerDashboardView } from '../views/OfficerDashboardView';
import { CampInspectionView } from '../views/CampInspectionView';
import {
  OfficerDashboardSummaryDto,
  ChhavaniDto,
  CreateChhavaniRequest,
  GeoCoordinate,
  RecordCampInspectionRequest,
} from '@chara-chhavani/api-client';

export type OfficerScreenName = 'Login' | 'Dashboard' | 'RegisterCamp' | 'GeofenceMap' | 'FieldInspection';

export class OfficerAppOrchestrator {
  private currentScreen: OfficerScreenName = 'Login';
  private dashboardData: OfficerDashboardSummaryDto | null = null;
  private selectedCampId: number | null = null;
  private isLoading = false;
  private errorMessage: string | null = null;

  public async loginWithMobile(mobileNumber: string, otp: string): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const res = await apiClient.auth.verifyMobileOtp(mobileNumber, otp, 'Officer');
      if (res.success && res.data) {
        await sessionManager.setSession({
          token: res.data.token,
          userId: res.data.userId,
          role: 'Officer',
          mobileNumber: res.data.mobileNumber,
          displayName: res.data.displayName,
          isProfileCompleted: true,
          authenticatedAt: Date.now(),
        });

        this.currentScreen = 'Dashboard';
        await this.refreshDashboard();
        return true;
      }
      this.errorMessage = res.message || 'OTP verification failed.';
      return false;
    } catch (e: any) {
      this.errorMessage = e.message || 'Network error.';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  public async refreshDashboard(district?: string, taluka?: string): Promise<OfficerDashboardSummaryDto | null> {
    this.isLoading = true;
    try {
      const res = await apiClient.officer.getDashboard({ district, taluka });
      if (res.success && res.data) {
        this.dashboardData = res.data;
        return res.data;
      }
    } finally {
      this.isLoading = false;
    }
    return null;
  }

  public async registerCamp(request: CreateChhavaniRequest): Promise<ChhavaniDto | null> {
    this.isLoading = true;
    try {
      const res = await apiClient.camps.create(request);
      if (res.success && res.data) {
        this.selectedCampId = res.data.id;
        this.currentScreen = 'GeofenceMap';
        return res.data;
      }
      this.errorMessage = res.message || 'Failed to register camp.';
    } finally {
      this.isLoading = false;
    }
    return null;
  }

  public async saveCampGeofence(campId: number, coordinates: GeoCoordinate[]): Promise<boolean> {
    this.isLoading = true;
    try {
      const res = await apiClient.camps.updateGeofence(campId, coordinates);
      if (res.success) {
        this.currentScreen = 'Dashboard';
        await this.refreshDashboard();
        return true;
      }
      this.errorMessage = res.message || 'Failed to update geofence.';
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  public async submitFieldInspection(request: RecordCampInspectionRequest): Promise<boolean> {
    this.isLoading = true;
    try {
      const res = await apiClient.officer.recordInspection(request);
      if (res.success) {
        this.currentScreen = 'Dashboard';
        await this.refreshDashboard();
        return true;
      }
      this.errorMessage = res.message || 'Inspection recording failed.';
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  public navigateTo(screen: OfficerScreenName): void {
    this.currentScreen = screen;
  }

  public getCurrentScreen(): OfficerScreenName {
    return this.currentScreen;
  }

  public async logout(): Promise<void> {
    await sessionManager.logout();
    this.currentScreen = 'Login';
    this.dashboardData = null;
    this.selectedCampId = null;
  }
}
