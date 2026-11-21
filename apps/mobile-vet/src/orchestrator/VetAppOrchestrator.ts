import { apiClient } from '../config';
import { sessionManager } from '@chara-chhavani/ui-core';
import { VetVerificationView } from '../views/VetVerificationView';
import { PendingVerificationAnimalDto, SubmitVerificationRequest } from '@chara-chhavani/api-client';

export type VetScreenName = 'Login' | 'PendingQueue' | 'InspectModal';

export class VetAppOrchestrator {
  private currentScreen: VetScreenName = 'Login';
  private pendingAnimals: PendingVerificationAnimalDto[] = [];
  private selectedAnimal: PendingVerificationAnimalDto | null = null;
  private isLoading = false;
  private errorMessage: string | null = null;

  public async loginWithMobile(mobileNumber: string, otp: string): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const res = await apiClient.auth.verifyMobileOtp(mobileNumber, otp, 'VetDoctor');
      if (res.success && res.data) {
        await sessionManager.setSession({
          token: res.data.token,
          userId: res.data.userId,
          role: 'VetDoctor',
          mobileNumber: res.data.mobileNumber,
          displayName: res.data.displayName,
          isProfileCompleted: true,
          authenticatedAt: Date.now(),
        });

        this.currentScreen = 'PendingQueue';
        await this.refreshQueue();
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

  public async refreshQueue(): Promise<PendingVerificationAnimalDto[]> {
    this.isLoading = true;
    try {
      const res = await apiClient.vet.getPendingAnimals();
      if (res.success && res.data) {
        this.pendingAnimals = res.data;
        return res.data;
      }
    } finally {
      this.isLoading = false;
    }
    return [];
  }

  public startInspection(animal: PendingVerificationAnimalDto): void {
    this.selectedAnimal = animal;
    this.currentScreen = 'InspectModal';
  }

  public async submitVerification(request: SubmitVerificationRequest): Promise<boolean> {
    this.isLoading = true;
    try {
      const res = await apiClient.vet.verify(request);
      if (res.success) {
        this.selectedAnimal = null;
        this.currentScreen = 'PendingQueue';
        await this.refreshQueue();
        return true;
      }
      this.errorMessage = res.message || 'Verification submission failed.';
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  public navigateTo(screen: VetScreenName): void {
    this.currentScreen = screen;
  }

  public getCurrentScreen(): VetScreenName {
    return this.currentScreen;
  }

  public getPendingAnimalsList(): PendingVerificationAnimalDto[] {
    return [...this.pendingAnimals];
  }

  public getSelectedAnimal(): PendingVerificationAnimalDto | null {
    return this.selectedAnimal;
  }

  public async logout(): Promise<void> {
    await sessionManager.logout();
    this.currentScreen = 'Login';
    this.pendingAnimals = [];
    this.selectedAnimal = null;
  }
}
