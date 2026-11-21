namespace CharaChhavani.Application.Chhavanis.DTOs;

public class GeoCoordinateDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public GeoCoordinateDto() { }

    public GeoCoordinateDto(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }
}

public class ChhavaniDto
{
    public long Id { get; set; }
    public string CampCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Village { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int ActiveAnimalCount { get; set; }
    public int AvailableCapacity => Math.Max(0, TotalCapacity - ActiveAnimalCount);
    public string Status { get; set; } = string.Empty;
    public GeoCoordinateDto? Location { get; set; }
    public List<GeoCoordinateDto> GeofenceCoordinates { get; set; } = new();
    public List<OperatorDto> Operators { get; set; } = new();
}

public class OperatorDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class GeofenceValidationResultDto
{
    public long ChhavaniId { get; set; }
    public string CampCode { get; set; } = string.Empty;
    public bool IsInsideGeofence { get; set; }
    public bool IsInside => IsInsideGeofence;
    public double LatitudeEvaluated { get; set; }
    public double LongitudeEvaluated { get; set; }
    public string Message { get; set; } = string.Empty;
}
