using NetTopologySuite.Geometries;
using CharaChhavani.Domain.Common;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Domain.Entities;

public class Chhavani : AuditableEntity<long>
{
    public string CampCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Village { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = "Maharashtra";
    public int TotalCapacity { get; set; }
    public int ActiveAnimalCount { get; set; }
    public CampStatus Status { get; set; } = CampStatus.Active;

    // Spatial Polygon representing the camp boundary (SRID 4326)
    public Polygon? GeofenceBoundary { get; set; }

    // Centroid or primary GPS coordinate of the camp
    public Point? Location { get; set; }

    public ICollection<ChhavaniOperator> Operators { get; set; } = new List<ChhavaniOperator>();
    public ICollection<AnimalAdmission> Admissions { get; set; } = new List<AnimalAdmission>();
    public ICollection<FodderStock> Stocks { get; set; } = new List<FodderStock>();

    public bool HasAvailableCapacity() => ActiveAnimalCount < TotalCapacity;

    public bool IsPointInsideGeofence(Point point)
    {
        if (GeofenceBoundary == null) return false;
        return GeofenceBoundary.Contains(point);
    }
}
