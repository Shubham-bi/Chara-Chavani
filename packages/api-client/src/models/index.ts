// 1. Core API Response Envelope matching ASP.NET Core
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[];
  traceId: string;
}

export interface ApiError {
  field: string;
  code: string;
  message: string;
}

// 2. Domain Enums
export enum AnimalType {
  Cow = 'Cow',
  Buffalo = 'Buffalo',
  Bullock = 'Bullock',
  Goat = 'Goat',
  Sheep = 'Sheep',
  Other = 'Other'
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum VerificationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum AnimalStatus {
  Registered = 'Registered',
  Verified = 'Verified',
  Admitted = 'Admitted',
  Released = 'Released'
}

export enum StockSource {
  Store = 'Store',
  InFarm = 'InFarm'
}

export enum FodderType {
  GreenFodder = 'GreenFodder',
  DryFodder = 'DryFodder',
  Silage = 'Silage',
  ConcentrateFeed = 'ConcentrateFeed'
}

export enum AdjustmentType {
  Increase = 'Increase',
  Decrease = 'Decrease'
}

export enum CampStatus {
  Draft = 'Draft',
  Active = 'Active',
  Inactive = 'Inactive',
  Closed = 'Closed'
}

export enum AdmissionStatus {
  Admitted = 'Admitted',
  Released = 'Released'
}

// 3. Coordinates & GIS
export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

// 4. Chhavani (Camp) Models
export interface OperatorDto {
  id: number;
  name: string;
  mobileNumber: string;
  isActive: boolean;
}

export interface ChhavaniDto {
  id: number;
  campCode: string;
  name: string;
  address: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  totalCapacity: number;
  activeAnimalCount: number;
  availableCapacity: number;
  status: string;
  location?: GeoCoordinate;
  geofenceCoordinates: GeoCoordinate[];
  operators: OperatorDto[];
}

export interface CreateChhavaniRequest {
  name: string;
  address: string;
  village: string;
  taluka: string;
  district: string;
  state?: string;
  totalCapacity: number;
  operatorName: string;
  operatorMobile: string;
  entranceLatitude?: number;
  entranceLongitude?: number;
  geofenceCoordinates?: GeoCoordinate[];
}

export interface GeofenceValidationResult {
  chhavaniId: number;
  campCode: string;
  isInsideGeofence: boolean;
  latitudeEvaluated: number;
  longitudeEvaluated: number;
  message: string;
}

// 5. Farmer Models
export interface FarmerDto {
  id: number;
  name: string;
  mobileNumber: string;
  address?: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  isRegisteredSeller: boolean;
}

export interface FarmerDashboardDto {
  farmer: FarmerDto;
  totalRegisteredAnimals: number;
  pendingVerificationCount: number;
  verifiedCount: number;
  rejectedCount: number;
  admittedCount: number;
}

export interface AuthTokenResponse {
  token: string;
  farmerId: number;
  mobileNumber: string;
  name: string;
  isProfileCompleted: boolean;
}

// 6. Animal Models
export interface VerificationHistoryDto {
  id: number;
  doctorId: string;
  result: string;
  remarks?: string;
  verifiedAtUtc: string;
}

export interface AnimalDto {
  id: number;
  animalCode: string;
  tagNumber?: string;
  farmerId: number;
  farmerName: string;
  animalType: string;
  breed: string;
  gender: string;
  ageInMonths: number;
  photoUrl?: string;
  verificationStatus: string;
  currentStatus: string;
  currentChhavaniId?: number;
  currentChhavaniName?: string;
  registrationDateUtc: string;
  verifications?: VerificationHistoryDto[];
}

export interface RegisterAnimalRequest {
  farmerId: number;
  animalType: AnimalType;
  breed: string;
  gender: Gender;
  ageInMonths: number;
  tagNumber?: string;
  photoUrl: string;
}

// 7. Veterinary Verification Models
export interface VetDashboardDto {
  pendingCount: number;
  verifiedCount: number;
  rejectedCount: number;
}

export interface PendingVerificationAnimalDto {
  animalId: number;
  animalCode: string;
  tagNumber?: string;
  animalType: string;
  breed: string;
  gender: string;
  ageInMonths: number;
  photoUrl?: string;
  registrationDateUtc: string;
  farmerId: number;
  farmerName: string;
  farmerMobile: string;
  farmerVillage: string;
  farmerTaluka: string;
  farmerDistrict: string;
}

export interface SubmitVerificationRequest {
  animalId: number;
  doctorId: string;
  result: VerificationStatus;
  remarks?: string;
  inspectionLatitude?: number;
  inspectionLongitude?: number;
  verificationPhotoUrl?: string;
}

export interface VetVerificationResult {
  verificationId: number;
  animalId: number;
  animalCode: string;
  doctorId: string;
  result: string;
  remarks?: string;
  inspectionLocation?: GeoCoordinate;
  verifiedAtUtc: string;
}

// 8. Admission Models
export interface AnimalAdmissionSearchDto {
  animalId: number;
  animalCode: string;
  tagNumber?: string;
  farmerId: number;
  farmerName: string;
  farmerMobile: string;
  animalType: string;
  breed: string;
  photoUrl?: string;
  verificationStatus: string;
  currentStatus: string;
  isEligibleForAdmission: boolean;
  ineligibilityReason?: string;
}

export interface AdmitAnimalRequest {
  animalId: number;
  chhavaniId: number;
  operatorId: string;
  photoUrl: string;
  deviceLatitude: number;
  deviceLongitude: number;
}

export interface AdmissionResult {
  admissionId: number;
  admissionCode: string;
  animalId: number;
  animalCode: string;
  chhavaniId: number;
  chhavaniName: string;
  operatorId: string;
  photoUrl?: string;
  admissionLocation?: GeoCoordinate;
  isGeofenceValidated: boolean;
  admittedAtUtc: string;
  activeCampAnimals: number;
  campTotalCapacity: number;
}

export interface ReleaseResult {
  admissionId: number;
  animalId: number;
  animalCode: string;
  chhavaniId: number;
  releasedAtUtc: string;
  releaseRemarks?: string;
  activeCampAnimals: number;
}

// 9. Fodder & Expense Models
export interface FodderStockItemDto {
  source: string;
  fodderType: string;
  availableQuantity: number;
  unit: string;
}

export interface CampStockOverviewDto {
  chhavaniId: number;
  campName: string;
  storeStock: FodderStockItemDto[];
  inFarmStock: FodderStockItemDto[];
  totalAvailableStock: number;
}

export interface RecordFodderPurchaseRequest {
  chhavaniId: number;
  sellerName: string;
  sellerMobile?: string;
  sellerFarmerId?: number;
  fodderType: FodderType;
  quantity: number;
  unit?: string;
  ratePerUnit: number;
  purchaseDate?: string;
}

export interface RecordFeedingRequest {
  chhavaniId: number;
  source: StockSource;
  animalType: AnimalType;
  fodderType: FodderType;
  quantityIssued: number;
  unit?: string;
}

export interface RecordStockAdjustmentRequest {
  chhavaniId: number;
  source: StockSource;
  fodderType: FodderType;
  adjustmentType: AdjustmentType;
  quantity: number;
  unit?: string;
  reason: string;
}

export interface ExpenseDto {
  id: number;
  chhavaniId: number;
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
}

export interface CampExpenseSummaryDto {
  chhavaniId: number;
  totalOperationalExpenses: number;
  expensesByCategory: Record<string, number>;
  recentExpenses: ExpenseDto[];
}

export interface RecordExpenseRequest {
  chhavaniId: number;
  category: string;
  amount: number;
  description?: string;
  expenseDate?: string;
}

// 10. Admin Analytics Models
export interface AdminDashboardSummaryDto {
  totalRegisteredFarmers: number;
  totalRegisteredAnimals: number;
  pendingAnimalVerification: number;
  verifiedAnimals: number;
  rejectedAnimals: number;
  totalCharaChhavaniCentres: number;
  totalCampCapacity: number;
  totalActiveAdmittedAnimals: number;
  overallCapacityUtilizationPercentage: number;
  totalStoreStockKg: number;
  totalInFarmStockKg: number;
  totalAvailableStockKg: number;
  totalFodderPurchaseAmount: number;
  totalOperationalExpenses: number;
  totalGovernmentExpenditure: number;
}

export interface CampUtilizationSummaryDto {
  campId: number;
  campCode: string;
  name: string;
  district: string;
  taluka: string;
  totalCapacity: number;
  activeAnimalCount: number;
  utilizationPercentage: number;
  hasGeofence: boolean;
}
