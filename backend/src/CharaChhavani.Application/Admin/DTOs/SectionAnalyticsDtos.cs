namespace CharaChhavani.Application.Admin.DTOs;

public class CampAnalyticsDto
{
    public int TotalCamps { get; set; }
    public int ActiveCamps { get; set; }
    public int InactiveCamps { get; set; }
    public int TotalConfiguredCapacity { get; set; }
    public int OccupiedCapacity { get; set; }
    public int AvailableCapacity { get; set; }
    public decimal OverallUtilizationPercentage { get; set; }
    public List<CampUtilizationRankingItemDto> CampRankings { get; set; } = new();
    public List<DistrictCapacityItemDto> DistrictBreakdown { get; set; } = new();
}

public class CampUtilizationRankingItemDto
{
    public long CampId { get; set; }
    public string CampName { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int Admitted { get; set; }
    public int Available { get; set; }
    public decimal UtilizationPercentage { get; set; }
    public bool IsNearCapacity { get; set; } // > 90%
}

public class DistrictCapacityItemDto
{
    public string District { get; set; } = string.Empty;
    public int CampCount { get; set; }
    public int TotalCapacity { get; set; }
    public int AdmittedAnimals { get; set; }
    public decimal UtilizationPercentage { get; set; }
}

public class AnimalAnalyticsDto
{
    public int TotalRegisteredAnimals { get; set; }
    public int PendingVerification { get; set; }
    public int VerifiedAnimals { get; set; }
    public int RejectedAnimals { get; set; }
    public int AdmittedAnimals { get; set; }
    public int ReleasedAnimals { get; set; }
    public Dictionary<string, int> AnimalTypeDistribution { get; set; } = new();
    public List<TimeTrendItemDto> RegistrationVsAdmissionTrend { get; set; } = new();
}

public class TimeTrendItemDto
{
    public string Period { get; set; } = string.Empty;
    public int Registrations { get; set; }
    public int Admissions { get; set; }
    public int Releases { get; set; }
}

public class VeterinaryAnalyticsDto
{
    public int TotalVerificationRequests { get; set; }
    public int PendingVerifications { get; set; }
    public int ApprovedVerifications { get; set; }
    public int RejectedVerifications { get; set; }
    public decimal ApprovalRatePercentage { get; set; }
    public List<DistrictPendingVerificationDto> PendingByDistrict { get; set; } = new();
}

public class DistrictPendingVerificationDto
{
    public string District { get; set; } = string.Empty;
    public int PendingCount { get; set; }
}

public class FodderAnalyticsDto
{
    public decimal TotalStoreStockKg { get; set; }
    public decimal TotalInFarmStockKg { get; set; }
    public decimal TotalAvailableStockKg { get; set; }
    public decimal TotalPurchasedKg { get; set; }
    public decimal TotalFeedingIssuedKg { get; set; }
    public Dictionary<string, decimal> StockByFodderType { get; set; } = new();
    public List<CampStockRankItemDto> TopCampsByStock { get; set; } = new();
}

public class CampStockRankItemDto
{
    public string CampName { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public decimal StoreStockKg { get; set; }
    public decimal InFarmStockKg { get; set; }
    public decimal TotalStockKg { get; set; }
}

public class FinancialAnalyticsDto
{
    public decimal TotalFodderPurchaseAmountInr { get; set; }
    public decimal TotalOperationalExpensesInr { get; set; }
    public decimal CombinedGovernmentExpenditureInr { get; set; }
    public Dictionary<string, decimal> ExpensesByCategory { get; set; } = new();
    public List<CampExpenditureItemDto> TopCampsByExpenditure { get; set; } = new();
}

public class CampExpenditureItemDto
{
    public string CampName { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public decimal FodderPurchasesInr { get; set; }
    public decimal OperationalExpensesInr { get; set; }
    public decimal TotalInr { get; set; }
}
