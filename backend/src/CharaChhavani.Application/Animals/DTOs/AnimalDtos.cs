namespace CharaChhavani.Application.Animals.DTOs;

public class AnimalDto
{
    public long Id { get; set; }
    public string AnimalCode { get; set; } = string.Empty;
    public string? TagNumber { get; set; }
    public long FarmerId { get; set; }
    public string FarmerName { get; set; } = string.Empty;
    public string AnimalType { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public int AgeInMonths { get; set; }
    public string? PhotoUrl { get; set; }
    public string VerificationStatus { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = string.Empty;
    public long? CurrentChhavaniId { get; set; }
    public string? CurrentChhavaniName { get; set; }
    public DateTime RegistrationDateUtc { get; set; }
    public List<VerificationHistoryDto> Verifications { get; set; } = new();
}

public class VerificationHistoryDto
{
    public long Id { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
    public string? Remarks { get; set; }
    public DateTime VerifiedAtUtc { get; set; }
}
