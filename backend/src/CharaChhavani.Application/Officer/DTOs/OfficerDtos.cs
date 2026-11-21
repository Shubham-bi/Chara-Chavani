namespace CharaChhavani.Application.Officer.DTOs;

public record OfficerDashboardSummaryDto
{
    public int TotalRegisteredCamps { get; init; }
    public int ActiveCamps { get; init; }
    public int TotalCampOperators { get; init; }
    public int TotalAdmittedLivestock { get; init; }
    public int TotalCapacity { get; init; }
    public double CapacityUtilizationPercentage { get; init; }
    public int InspectionsConductedThisMonth { get; init; }
    public int DiscrepanciesFlaggedThisMonth { get; init; }
}

public record CampInspectionSummaryDto
{
    public long Id { get; init; }
    public long ChhavaniId { get; init; }
    public string CampName { get; init; } = string.Empty;
    public string CampCode { get; init; } = string.Empty;
    public string OfficerId { get; init; } = string.Empty;
    public string OfficerName { get; init; } = string.Empty;
    public string OfficerDesignation { get; init; } = string.Empty;
    public DateTime InspectionDateUtc { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public int PhysicalAnimalCount { get; init; }
    public int SystemAnimalCount { get; init; }
    public int DiscrepancyCount { get; init; }
    public bool DiscrepancyDetected { get; init; }
    public string WaterAvailability { get; init; } = string.Empty;
    public string FodderStockCondition { get; init; } = string.Empty;
    public int CleanlinessScore { get; init; }
    public string? Remarks { get; init; }
    public string? Recommendations { get; init; }
    public string? InspectionPhotoUrl { get; init; }
}

public record RecordCampInspectionRequest
{
    public long ChhavaniId { get; init; }
    public string OfficerId { get; init; } = string.Empty;
    public string OfficerName { get; init; } = string.Empty;
    public string OfficerDesignation { get; init; } = string.Empty;
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public int PhysicalAnimalCount { get; init; }
    public string WaterAvailability { get; init; } = "Adequate";
    public string FodderStockCondition { get; init; } = "Satisfactory";
    public int CleanlinessScore { get; init; } = 4;
    public string? Remarks { get; init; }
    public string? Recommendations { get; init; }
    public string? InspectionPhotoUrl { get; init; }
}
