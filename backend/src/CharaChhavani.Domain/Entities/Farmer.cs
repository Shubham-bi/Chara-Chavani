using CharaChhavani.Domain.Common;

namespace CharaChhavani.Domain.Entities;

public class Farmer : AuditableEntity<long>
{
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string Village { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = "Maharashtra";
    public bool IsRegisteredSeller { get; set; } = false;

    public ICollection<Animal> Animals { get; set; } = new List<Animal>();
}
