using CharaChhavani.Application.Chhavanis.DTOs;

namespace CharaChhavani.Application.Admissions.DTOs;

public class AnimalAdmissionSearchDto
{
    public long AnimalId { get; set; }
    public string AnimalCode { get; set; } = string.Empty;
    public string? TagNumber { get; set; }
    public long FarmerId { get; set; }
    public string FarmerName { get; set; } = string.Empty;
    public string FarmerMobile { get; set; } = string.Empty;
    public string AnimalType { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string VerificationStatus { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = string.Empty;
    public bool IsEligibleForAdmission { get; set; }
    public string? IneligibilityReason { get; set; }
}

public class AdmissionResultDto
{
    public long AdmissionId { get; set; }
    public string AdmissionCode { get; set; } = string.Empty;
    public long AnimalId { get; set; }
    public string AnimalCode { get; set; } = string.Empty;
    public long ChhavaniId { get; set; }
    public string ChhavaniName { get; set; } = string.Empty;
    public string OperatorId { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public GeoCoordinateDto? AdmissionLocation { get; set; }
    public bool IsGeofenceValidated { get; set; }
    public DateTime AdmittedAtUtc { get; set; }
    public int ActiveCampAnimals { get; set; }
    public int CampTotalCapacity { get; set; }
}

public class ReleaseResultDto
{
    public long AdmissionId { get; set; }
    public long AnimalId { get; set; }
    public string AnimalCode { get; set; } = string.Empty;
    public long ChhavaniId { get; set; }
    public DateTime ReleasedAtUtc { get; set; }
    public string? ReleaseRemarks { get; set; }
    public int ActiveCampAnimals { get; set; }
}
