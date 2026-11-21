using NetTopologySuite.Geometries;
using CharaChhavani.Domain.Common;

namespace CharaChhavani.Domain.Entities;

public class CampInspection : AuditableEntity<long>
{
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }

    public string OfficerId { get; set; } = string.Empty;
    public string OfficerName { get; set; } = string.Empty;
    public string OfficerDesignation { get; set; } = string.Empty;

    public DateTime InspectionDateUtc { get; set; } = DateTime.UtcNow;

    // GPS location captured during physical inspection (SRID 4326)
    public Point? InspectorLocation { get; set; }

    public int PhysicalAnimalCount { get; set; }
    public int SystemAnimalCount { get; set; }
    public int DiscrepancyCount { get; set; } // PhysicalAnimalCount - SystemAnimalCount
    public bool DiscrepancyDetected { get; set; }

    public string WaterAvailability { get; set; } = "Adequate"; // Adequate, Scarce, Critical
    public string FodderStockCondition { get; set; } = "Satisfactory"; // Satisfactory, Deficient, Critical
    public int CleanlinessScore { get; set; } = 4; // 1 to 5
    public string? Remarks { get; set; }
    public string? Recommendations { get; set; }
    public string? InspectionPhotoUrl { get; set; }
}
