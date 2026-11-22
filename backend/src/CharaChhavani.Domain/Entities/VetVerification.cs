using NetTopologySuite.Geometries;
using CharaChhavani.Domain.Common;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Domain.Entities;

public class VetVerification : AuditableEntity<long>
{
    public long AnimalId { get; set; }
    public Animal? Animal { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public VerificationStatus Result { get; set; }
    public string? Remarks { get; set; }
    public string? VerificationPhotoUrl { get; set; }

    // GPS location captured at farmer location during physical visit (SRID 4326)
    public Point? InspectionLocation { get; set; }
    public DateTime VerifiedAtUtc { get; set; } = DateTime.UtcNow;
}
