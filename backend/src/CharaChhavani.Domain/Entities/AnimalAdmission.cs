using NetTopologySuite.Geometries;
using CharaChhavani.Domain.Common;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Domain.Entities;

public class AnimalAdmission : AuditableEntity<long>
{
    public string AdmissionCode { get; set; } = string.Empty; // e.g. ADM-20261122-1001
    public long AnimalId { get; set; }
    public Animal? Animal { get; set; }
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public string OperatorId { get; set; } = string.Empty;
    public string? AdmissionPhotoUrl { get; set; }

    // GPS location captured by operator on device at admission time (SRID 4326)
    public Point? AdmissionLocation { get; set; }
    public bool IsGeofenceValidated { get; set; }
    public DateTime AdmittedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ReleasedAtUtc { get; set; }
    public string? ReleaseRemarks { get; set; }
    public AdmissionStatus Status { get; set; } = AdmissionStatus.Admitted;
}
