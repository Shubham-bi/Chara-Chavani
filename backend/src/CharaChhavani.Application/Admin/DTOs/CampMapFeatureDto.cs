namespace CharaChhavani.Application.Admin.DTOs;

public class CampMapFeatureDto
{
    public long CampId { get; set; }
    public string CampCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Village { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = "Maharashtra";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int TotalCapacity { get; set; }
    public int AdmittedCattle { get; set; }
    public int AvailableCapacity { get; set; }
    public decimal UtilizationPercentage { get; set; }
    public string Status { get; set; } = "Active";
    public string OperatorName { get; set; } = string.Empty;
    public string OperatorMobile { get; set; } = string.Empty;
    public List<CoordinatePairDto> PolygonCoordinates { get; set; } = new();
    public decimal StoreStockKg { get; set; }
    public decimal InFarmStockKg { get; set; }
    public decimal TotalExpensesInr { get; set; }
}

public class CoordinatePairDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public CoordinatePairDto() { }
    public CoordinatePairDto(double lat, double lng)
    {
        Latitude = lat;
        Longitude = lng;
    }
}
