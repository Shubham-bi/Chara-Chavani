import { HttpClient } from '../http';
import * as M from '../models';

export class CharaChhavaniApiClient {
  private http: HttpClient;

  constructor(baseUrl: string = 'http://localhost:5000', getAuthToken?: () => string | null) {
    this.http = new HttpClient({ baseUrl, getAuthToken });
  }

  public setBaseUrl(url: string) {
    this.http.setBaseUrl(url);
  }

  // 1. Camps & Geofence
  public camps = {
    create: (data: M.CreateChhavaniRequest) =>
      this.http.post<M.ChhavaniDto>('/api/v1/camps', data),

    updateGeofence: (id: number, coords: M.GeoCoordinate[]) =>
      this.http.put<M.ChhavaniDto>(`/api/v1/camps/${id}/geofence`, coords),

    getById: (id: number) =>
      this.http.get<M.ChhavaniDto>(`/api/v1/camps/${id}`),

    list: (params?: { district?: string; taluka?: string; status?: string; pageNumber?: number }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.http.get<M.ChhavaniDto[]>(`/api/v1/camps?${q}`);
    },

    validatePoint: (id: number, lat: number, lng: number) =>
      this.http.get<M.GeofenceValidationResult>(`/api/v1/camps/${id}/validate-point?latitude=${lat}&longitude=${lng}`),
  };

  // 2. Farmer Management & Auth
  public farmers = {
    sendOtp: (mobileNumber: string) =>
      this.http.post<string>('/api/v1/farmers/auth/send-otp', { mobileNumber }),

    verifyOtp: (mobileNumber: string, otp: string) =>
      this.http.post<M.AuthTokenResponse>('/api/v1/farmers/auth/verify-otp', { mobileNumber, otp }),

    updateProfile: (profile: Partial<M.FarmerDto> & { farmerId: number }) =>
      this.http.post<M.FarmerDto>('/api/v1/farmers/profile', profile),

    getDashboard: (farmerId: number) =>
      this.http.get<M.FarmerDashboardDto>(`/api/v1/farmers/${farmerId}/dashboard`),

    getAnimals: (farmerId: number, statusFilter?: string) => {
      const q = statusFilter ? `?verificationStatus=${statusFilter}` : '';
      return this.http.get<M.AnimalDto[]>(`/api/v1/farmers/${farmerId}/animals${q}`);
    },
  };

  // 3. Animal Registration & Life Cycle
  public animals = {
    register: (animal: M.RegisterAnimalRequest) =>
      this.http.post<M.AnimalDto>('/api/v1/animals', animal),

    getById: (id: number) =>
      this.http.get<M.AnimalDto>(`/api/v1/animals/${id}`),

    resubmit: (id: number, updates: { breed: string; ageInMonths: number; tagNumber?: string; photoUrl?: string }) =>
      this.http.put<M.AnimalDto>(`/api/v1/animals/${id}/resubmit`, { animalId: id, ...updates }),
  };

  // 4. Veterinary Inspection Workflow
  public vet = {
    getDashboard: (doctorId?: string) => {
      const q = doctorId ? `?doctorId=${doctorId}` : '';
      return this.http.get<M.VetDashboardDto>(`/api/v1/vet/dashboard${q}`);
    },

    getPendingAnimals: (params?: { district?: string; taluka?: string; pageNumber?: number }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.http.get<M.PendingVerificationAnimalDto[]>(`/api/v1/vet/pending-animals?${q}`);
    },

    verify: (decision: M.SubmitVerificationRequest) =>
      this.http.post<M.VetVerificationResult>('/api/v1/vet/verify', decision),

    getHistory: (doctorId?: string) => {
      const q = doctorId ? `?doctorId=${doctorId}` : '';
      return this.http.get<M.VetVerificationResult[]>(`/api/v1/vet/history${q}`);
    },
  };

  // 5. Animal Admission & Release (Chhavani Operator)
  public admissions = {
    search: (searchTerm: string) =>
      this.http.get<M.AnimalAdmissionSearchDto[]>(`/api/v1/admissions/search?searchTerm=${encodeURIComponent(searchTerm)}`),

    admit: (admission: M.AdmitAnimalRequest) =>
      this.http.post<M.AdmissionResult>('/api/v1/admissions', admission),

    getCampAdmissions: (campId: number, status?: string) => {
      const q = status ? `?status=${status}` : '';
      return this.http.get<M.AdmissionResult[]>(`/api/v1/admissions/camp/${campId}${q}`);
    },

    release: (admissionId: number, operatorId: string, remarks?: string) =>
      this.http.post<M.ReleaseResult>(`/api/v1/admissions/${admissionId}/release`, { operatorId, remarks }),
  };

  // 6. Fodder Inventory & Feeding
  public fodder = {
    recordPurchase: (purchase: M.RecordFodderPurchaseRequest) =>
      this.http.post<any>('/api/v1/fodder/purchases', purchase),

    getStock: (campId: number) =>
      this.http.get<M.CampStockOverviewDto>(`/api/v1/fodder/stock/${campId}`),

    recordFeeding: (feeding: M.RecordFeedingRequest) =>
      this.http.post<any>('/api/v1/fodder/feeding', feeding),

    recordAdjustment: (adjustment: M.RecordStockAdjustmentRequest) =>
      this.http.post<any>('/api/v1/fodder/adjustments', adjustment),
  };

  // 7. Operational Expenses
  public expenses = {
    record: (expense: M.RecordExpenseRequest) =>
      this.http.post<M.ExpenseDto>('/api/v1/expenses', expense),

    getSummary: (campId: number) =>
      this.http.get<M.CampExpenseSummaryDto>(`/api/v1/expenses/camp/${campId}`),
  };
}
