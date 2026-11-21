namespace CharaChhavani.Application.Admin.DTOs;

public class AdmissionAuditReportItemDto
{
    public long AdmissionId { get; set; }
    public string AdmissionCode { get; set; } = string.Empty;
    public long ChhavaniId { get; set; }
    public string CampName { get; set; } = string.Empty;
    public string CampCode { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public long AnimalId { get; set; }
    public string TagNumber { get; set; } = string.Empty;
    public string AnimalCategory { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public long FarmerId { get; set; }
    public string FarmerName { get; set; } = string.Empty;
    public string FarmerMobileNumber { get; set; } = string.Empty;
    public string MaskedAadhaar { get; set; } = string.Empty;
    public DateTime AdmittedAt { get; set; }
    public DateTime? ReleasedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public int ActiveDaysInCamp { get; set; }
    public string? ReleaseRemarks { get; set; }
}

public class FodderReconciliationReportItemDto
{
    public long ChhavaniId { get; set; }
    public string CampName { get; set; } = string.Empty;
    public string CampCode { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string FodderType { get; set; } = string.Empty;
    public decimal TotalPurchasedQuintals { get; set; }
    public decimal TotalPurchasedKg => TotalPurchasedQuintals * 100m;
    public decimal TotalFedKg { get; set; }
    public decimal TotalAdjustedKg { get; set; }
    public decimal AvailableStoreStockKg { get; set; }
    public decimal AvailableInFarmStockKg { get; set; }
    public decimal TotalAvailableStockKg => AvailableStoreStockKg + AvailableInFarmStockKg;
    public decimal CalculatedBalanceKg => TotalPurchasedKg - TotalFedKg + TotalAdjustedKg;
}

public class ExpenseAuditReportItemDto
{
    public long ExpenseId { get; set; }
    public long ChhavaniId { get; set; }
    public string CampName { get; set; } = string.Empty;
    public string CampCode { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? VoucherNumber { get; set; }
    public DateTime ExpenseDate { get; set; }
    public string? PaidTo { get; set; }
    public string? Description { get; set; }
    public string OperatorId { get; set; } = string.Empty;
}

public class InspectionAuditReportItemDto
{
    public long InspectionId { get; set; }
    public long ChhavaniId { get; set; }
    public string CampName { get; set; } = string.Empty;
    public string CampCode { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string OfficerId { get; set; } = string.Empty;
    public string OfficerName { get; set; } = string.Empty;
    public string OfficerDesignation { get; set; } = string.Empty;
    public DateTime InspectionDate { get; set; }
    public int ActualCattleHeadcount { get; set; }
    public int SystemReportedCattleCount { get; set; }
    public int HeadcountDiscrepancy => ActualCattleHeadcount - SystemReportedCattleCount;
    public bool FodderStockAdequate { get; set; }
    public bool WaterSupplyAdequate { get; set; }
    public string HygieneCondition { get; set; } = string.Empty;
    public string? GeneralRemarks { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public enum ReportExportFormat
{
    Json,
    Csv
}
