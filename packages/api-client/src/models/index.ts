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

export type FodderStockDto = FodderStockItemDto;

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

// 11. Officer Models
export interface OfficerDashboardSummaryDto {
  totalRegisteredCamps: number;
  activeCamps: number;
  totalCampOperators: number;
  totalAdmittedLivestock: number;
  totalCapacity: number;
  capacityUtilizationPercentage: number;
  inspectionsConductedThisMonth: number;
  discrepanciesFlaggedThisMonth: number;
}

export interface CampInspectionSummaryDto {
  id: number;
  chhavaniId: number;
  campName: string;
  campCode: string;
  officerId: string;
  officerName: string;
  officerDesignation?: string;
  inspectionDateUtc: string;
  latitude?: number;
  longitude?: number;
  physicalAnimalCount: number;
  systemAnimalCount: number;
  discrepancyCount: number;
  discrepancyDetected: boolean;
  waterAvailability: string;
  fodderStockCondition: string;
  cleanlinessScore: number;
  remarks?: string;
  recommendations?: string;
  inspectionPhotoUrl?: string;
}

// 12. Authentication Models
export interface SendOtpRequest {
  mobileNumber: string;
  role: 'Farmer' | 'VetDoctor' | 'Officer' | 'CampOperator';
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
  role: 'Farmer' | 'VetDoctor' | 'Officer' | 'CampOperator';
}

export interface MobileAuthResponse {
  token: string;
  userId: number;
  role: string;
  mobileNumber: string;
  displayName: string;
  isProfileCompleted: boolean;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  username: string;
  role: string;
  displayName: string;
}

// 13. Master Reference Data Models
export interface DistrictDto {
  name: string;
  marathiName: string;
  talukas: string[];
}

export interface BreedDto {
  englishName: string;
  marathiName: string;
  animalType: string;
}

export interface FodderTypeDto {
  code: string;
  englishName: string;
  marathiName: string;
  baseUnit: string;
  quintalConversionFactor: number;
}

export interface ExpenseCategoryDto {
  code: string;
  englishName: string;
  marathiName: string;
}

export interface RecordCampInspectionRequest {
  chhavaniId: number;
  officerId: string;
  officerName: string;
  officerDesignation?: string;
  latitude: number;
  longitude: number;
  physicalAnimalCount: number;
  waterAvailability?: string;
  fodderStockCondition?: string;
  cleanlinessScore?: number;
  remarks?: string;
  recommendations?: string;
  inspectionPhotoUrl?: string;
}

// 12. Authentication Models
export interface SendOtpRequest {
  mobileNumber: string;
  role: 'Farmer' | 'VetDoctor' | 'Officer' | 'CampOperator';
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
  role: 'Farmer' | 'VetDoctor' | 'Officer' | 'CampOperator';
}

export interface MobileAuthResponse {
  token: string;
  userId: number;
  role: string;
  mobileNumber: string;
  displayName: string;
  isProfileCompleted: boolean;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  username: string;
  role: string;
  displayName: string;
}

// 13. Master Reference Data Models
export interface DistrictDto {
  name: string;
  marathiName: string;
  talukas: string[];
}

export interface BreedDto {
  englishName: string;
  marathiName: string;
  animalType: string;
}

export interface FodderTypeDto {
  code: string;
  englishName: string;
  marathiName: string;
  baseUnit: string;
  quintalConversionFactor: number;
}

export interface ExpenseCategoryDto {
  code: string;
  englishName: string;
  marathiName: string;
}

export interface SeedResultDto {
  campsCreated: number;
  farmersCreated: number;
  animalsCreated: number;
  operatorsCreated: number;
  message: string;
}

// 14. State Government Audit & Reporting Models
export interface AdmissionAuditReportItemDto {
  admissionId: number;
  admissionCode: string;
  chhavaniId: number;
  campName: string;
  campCode: string;
  district: string;
  taluka: string;
  animalId: number;
  tagNumber: string;
  animalCategory: string;
  breed: string;
  farmerId: number;
  farmerName: string;
  farmerMobileNumber: string;
  maskedAadhaar: string;
  admittedAt: string;
  releasedAt?: string;
  status: string;
  activeDaysInCamp: number;
  releaseRemarks?: string;
}

export interface FodderReconciliationReportItemDto {
  chhavaniId: number;
  campName: string;
  campCode: string;
  district: string;
  taluka: string;
  fodderType: string;
  totalPurchasedQuintals: number;
  totalPurchasedKg: number;
  totalFedKg: number;
  totalAdjustedKg: number;
  availableStoreStockKg: number;
  availableInFarmStockKg: number;
  totalAvailableStockKg: number;
  calculatedBalanceKg: number;
}

export interface ExpenseAuditReportItemDto {
  expenseId: number;
  chhavaniId: number;
  campName: string;
  campCode: string;
  district: string;
  taluka: string;
  category: string;
  amount: number;
  voucherNumber?: string;
  expenseDate: string;
  paidTo?: string;
  description?: string;
  operatorId: string;
}

export interface InspectionAuditReportItemDto {
  inspectionId: number;
  chhavaniId: number;
  campName: string;
  campCode: string;
  district: string;
  taluka: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  inspectionDate: string;
  actualCattleHeadcount: number;
  systemReportedCattleCount: number;
  headcountDiscrepancy: number;
  fodderStockAdequate: boolean;
  waterSupplyAdequate: boolean;
  hygieneCondition: string;
  generalRemarks?: string;
  latitude: number;
  longitude: number;
}

