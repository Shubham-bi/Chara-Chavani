namespace CharaChhavani.Application.Admin.DTOs;

public class GeographicDistributionDto
{
    public string Level { get; set; } = "State"; // State | District | Taluka | Village
    public string SelectedArea { get; set; } = "Maharashtra";
    public string Metric { get; set; } = "camps"; // camps | animals | utilization
    public List<GeographicAreaItemDto> Items { get; set; } = new();
}

public class GeographicAreaItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Parent { get; set; } = string.Empty;
    public int CampCount { get; set; }
    public int FarmerCount { get; set; }
    public int AnimalCount { get; set; }
    public int AdmittedCattle { get; set; }
    public int TotalCapacity { get; set; }
    public decimal UtilizationPercentage { get; set; }
    public string ColorGrade { get; set; } = "Light grey";
    public bool HasCamps { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
