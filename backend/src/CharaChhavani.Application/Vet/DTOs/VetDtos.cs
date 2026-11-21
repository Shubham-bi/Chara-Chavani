using CharaChhavani.Application.Chhavanis.DTOs;

namespace CharaChhavani.Application.Vet.DTOs;

public class VetDashboardDto
{
    public int PendingCount { get; set; }
    public int VerifiedCount { get; set; }
    public int RejectedCount { get; set; }
}

public class PendingVerificationAnimalDto
{
    public long AnimalId { get; set; }
    public string AnimalCode { get; set; } = string.Empty;
    public string? TagNumber { get; set; }
    public string AnimalType { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public int AgeInMonths { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime RegistrationDateUtc { get; set; }
    public long FarmerId { get; set; }
    public string FarmerName { get; set; } = string.Empty;
    public string FarmerMobile { get; set; } = string.Empty;
    public string FarmerVillage { get; set; } = string.Empty;
    public string FarmerTaluka { get; set; } = string.Empty;
    public string FarmerDistrict { get; set; } = string.Empty;
}

public class VetVerificationResultDto
{
    public long VerificationId { get; set; }
    public long AnimalId { get; set; }
    public string AnimalCode { get; set; } = string.Empty;
    public string DoctorId { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
    public string? Remarks { get; set; }
    public GeoCoordinateDto? InspectionLocation { get; set; }
    public DateTime VerifiedAtUtc { get; set; }
}
