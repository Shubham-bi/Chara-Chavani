using CharaChhavani.Domain.Common;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Domain.Entities;

public class Animal : AuditableEntity<long>
{
    public string AnimalCode { get; set; } = string.Empty; // e.g. ANM-20261122-1001
    public string? TagNumber { get; set; }
    public long FarmerId { get; set; }
    public Farmer? Farmer { get; set; }
    public AnimalType AnimalType { get; set; }
    public string Breed { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public int AgeInMonths { get; set; }
    public string? PhotoUrl { get; set; }
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
    public AnimalStatus CurrentStatus { get; set; } = AnimalStatus.Registered;
    public long? CurrentChhavaniId { get; set; }
    public Chhavani? CurrentChhavani { get; set; }

    public ICollection<VetVerification> Verifications { get; set; } = new List<VetVerification>();
    public ICollection<AnimalAdmission> Admissions { get; set; } = new List<AnimalAdmission>();
}
