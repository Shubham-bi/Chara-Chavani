using CharaChhavani.Domain.Common;

namespace CharaChhavani.Domain.Entities;

public class ChhavaniOperator : AuditableEntity<long>
{
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Address { get; set; }
    public bool IsActive { get; set; } = true;
}
