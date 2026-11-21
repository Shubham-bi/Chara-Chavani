import { apiClient } from '../config';
import { sessionManager, offlineActionQueue } from '@chara-chhavani/ui-core';
import { FarmerDashboardView } from '../views/FarmerDashboardView';
import { AnimalRegistrationView } from '../views/AnimalRegistrationView';
import { FarmerProfileView } from '../views/FarmerProfileView';
import { MyAnimalsView } from '../views/MyAnimalsView';
import {
  FarmerDashboardDto,
  AnimalDto,
  RegisterAnimalRequest,
  FarmerDto,
} from '@chara-chhavani/api-client';

export type FarmerScreenName = 'Login' | 'Dashboard' | 'RegisterAnimal' | 'Profile' | 'MyAnimals';

export class FarmerAppOrchestrator {
  private currentScreen: FarmerScreenName = 'Login';
  private dashboardData: FarmerDashboardDto | null = null;
  private animals: AnimalDto[] = [];
  private isLoading = false;
  private errorMessage: string | null = null;

  public async loginWithMobile(mobileNumber: string, otp: string): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const res = await apiClient.auth.verifyMobileOtp(mobileNumber, otp, 'Farmer');
      if (res.success && res.data) {
        await sessionManager.setSession({
          token: res.data.token,
          userId: res.data.userId,
          role: 'Farmer',
          mobileNumber: res.data.mobileNumber,
          displayName: res.data.displayName,
          isProfileCompleted: res.data.isProfileCompleted,
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

  public async refreshDashboard(): Promise<FarmerDashboardDto | null> {
    const user = sessionManager.getCurrentUser();
    if (!user) return null;

    this.isLoading = true;
    try {
      const res = await apiClient.farmers.getDashboard(user.userId);
      if (res.success && res.data) {
        this.dashboardData = res.data;
        return res.data;
      }
    } finally {
      this.isLoading = false;
    }
    return null;
  }

  public async registerAnimal(request: RegisterAnimalRequest, isOnline: boolean = true): Promise<AnimalDto | null> {
    if (!isOnline) {
      // Safely preserve user draft in offline queue
      offlineActionQueue.enqueue('DRAFT_ANIMAL_REGISTRATION', request);
      return null;
    }

    this.isLoading = true;
    try {
      const res = await apiClient.animals.register(request);
      if (res.success && res.data) {
        await this.refreshDashboard();
        this.currentScreen = 'Dashboard';
        return res.data;
      }
      this.errorMessage = res.message || 'Registration failed.';
    } finally {
      this.isLoading = false;
    }
    return null;
  }

  public async loadMyAnimals(statusFilter?: string): Promise<AnimalDto[]> {
    const user = sessionManager.getCurrentUser();
    if (!user) return [];

    this.isLoading = true;
    try {
      const res = await apiClient.farmers.getAnimals(user.userId, statusFilter);
      if (res.success && res.data) {
        this.animals = res.data;
        return res.data;
      }
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  public async saveProfile(profile: Partial<FarmerDto>): Promise<boolean> {
    const user = sessionManager.getCurrentUser();
    if (!user) return false;

    this.isLoading = true;
    try {
      const res = await apiClient.farmers.updateProfile({
        farmerId: user.userId,
        ...profile,
      });
      if (res.success && res.data) {
        await sessionManager.updateProfileCompletion(true);
        await this.refreshDashboard();
        this.currentScreen = 'Dashboard';
        return true;
      }
      this.errorMessage = res.message || 'Profile update failed.';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  public navigateTo(screen: FarmerScreenName): void {
    this.currentScreen = screen;
  }

  public getCurrentScreen(): FarmerScreenName {
    return this.currentScreen;
  }

  public async logout(): Promise<void> {
    await sessionManager.logout();
    this.currentScreen = 'Login';
    this.dashboardData = null;
    this.animals = [];
  }
}
