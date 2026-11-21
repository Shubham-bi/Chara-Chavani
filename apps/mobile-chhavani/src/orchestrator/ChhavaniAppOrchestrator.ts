import { apiClient } from '../config';
import { sessionManager } from '@chara-chhavani/ui-core';
import { AnimalAdmissionView } from '../views/AnimalAdmissionView';
import { FodderStockView } from '../views/FodderStockView';
import {
  AdmitAnimalRequest,
  RecordFeedingRequest,
  RecordFodderPurchaseRequest,
  CampStockOverviewDto,
} from '@chara-chhavani/api-client';

export type ChhavaniScreenName = 'Login' | 'Dashboard' | 'AdmitAnimal' | 'FodderStock' | 'RecordFeeding';

export class ChhavaniAppOrchestrator {
  private currentScreen: ChhavaniScreenName = 'Login';
  private assignedCampId: number = 1;
  private stockSummary: CampStockOverviewDto | null = null;
  private isLoading = false;
  private errorMessage: string | null = null;

  public async loginWithMobile(mobileNumber: string, otp: string): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const res = await apiClient.auth.verifyMobileOtp(mobileNumber, otp, 'CampOperator');
      if (res.success && res.data) {
        await sessionManager.setSession({
          token: res.data.token,
          userId: res.data.userId,
          role: 'CampOperator',
          mobileNumber: res.data.mobileNumber,
          displayName: res.data.displayName,
          isProfileCompleted: true,
          authenticatedAt: Date.now(),
        });

        this.currentScreen = 'Dashboard';
        await this.refreshStockSummary();
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

  public async refreshStockSummary(): Promise<CampStockOverviewDto | null> {
    this.isLoading = true;
    try {
      const res = await apiClient.fodder.getStock(this.assignedCampId);
      if (res.success && res.data) {
        this.stockSummary = res.data;
        return res.data;
      }
    } finally {
      this.isLoading = false;
    }
    return null;
  }

  /**
   * Enforces Rule 9.6 of Development Guidelines:
   * "Do not perform offline animal admission without explicit backend validation."
   */
  public async admitAnimal(
    request: AdmitAnimalRequest,
    isOnline: boolean = true
  ): Promise<any | null> {
    if (!isOnline) {
      throw new Error(
        'ERR_ONLINE_GEOFENCE_REQUIRED: Animal admission cannot be performed offline without live backend geofence verification.'
      );
    }

    this.isLoading = true;
    try {
      const res = await apiClient.admissions.admit(request);
      if (res.success && res.data) {
        this.currentScreen = 'Dashboard';
        return res.data;
      }
      this.errorMessage = res.message || 'Admission failed.';
    } finally {
      this.isLoading = false;
    }
    return null;
  }

  public async recordFeeding(request: RecordFeedingRequest): Promise<boolean> {
    this.isLoading = true;
    try {
      const res = await apiClient.fodder.recordFeeding(request);
      if (res.success) {
        await this.refreshStockSummary();
        this.currentScreen = 'FodderStock';
        return true;
      }
      this.errorMessage = res.message || 'Feeding record failed.';
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  public async recordFodderPurchase(request: RecordFodderPurchaseRequest): Promise<boolean> {
    this.isLoading = true;
    try {
      const res = await apiClient.fodder.recordPurchase(request);
      if (res.success) {
        await this.refreshStockSummary();
        return true;
      }
      this.errorMessage = res.message || 'Purchase record failed.';
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  public navigateTo(screen: ChhavaniScreenName): void {
    this.currentScreen = screen;
  }

  public getCurrentScreen(): ChhavaniScreenName {
    return this.currentScreen;
  }

  public setAssignedCampId(id: number): void {
    this.assignedCampId = id;
  }

  public async logout(): Promise<void> {
    await sessionManager.logout();
    this.currentScreen = 'Login';
    this.stockSummary = null;
  }
}
