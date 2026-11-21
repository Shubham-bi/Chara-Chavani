namespace CharaChhavani.Application.Admin.DTOs;

public class AdminDashboardSummaryDto
{
    // Farmer & Animal Metrics
    public int TotalRegisteredFarmers { get; set; }
    public int TotalRegisteredAnimals { get; set; }
    public int PendingAnimalVerification { get; set; }
    public int VerifiedAnimals { get; set; }
    public int RejectedAnimals { get; set; }

    // Camp Capacity & Occupancy
    public int TotalCharaChhavaniCentres { get; set; }
    public int TotalCampCapacity { get; set; }
    public int TotalActiveAdmittedAnimals { get; set; }
    public double OverallCapacityUtilizationPercentage =>
        TotalCampCapacity > 0 ? Math.Round((double)TotalActiveAdmittedAnimals / TotalCampCapacity * 100, 2) : 0;

    // Fodder Stock Reserves
    public decimal TotalStoreStockKg { get; set; }
    public decimal TotalInFarmStockKg { get; set; }
    public decimal TotalAvailableStockKg => TotalStoreStockKg + TotalInFarmStockKg;

    // Financial Metrics
    public decimal TotalFodderPurchaseAmount { get; set; }
    public decimal TotalOperationalExpenses { get; set; }
    public decimal TotalGovernmentExpenditure => TotalFodderPurchaseAmount + TotalOperationalExpenses;
}

public class CampUtilizationSummaryDto
{
    public long CampId { get; set; }
    public string CampCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int ActiveAnimalCount { get; set; }
    public double UtilizationPercentage { get; set; }
    public bool HasGeofence { get; set; }
}
