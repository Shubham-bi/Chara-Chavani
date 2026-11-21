using CharaChhavani.Domain.Common;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Domain.Entities;

public class FodderStock : AuditableEntity<long>
{
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public StockSource Source { get; set; } // Store vs InFarm
    public FodderType FodderType { get; set; }
    public decimal AvailableQuantity { get; set; }
    public string Unit { get; set; } = "kg";
}

public class FodderPurchase : AuditableEntity<long>
{
    public string PurchaseCode { get; set; } = string.Empty;
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public string SellerName { get; set; } = string.Empty;
    public string? SellerMobile { get; set; }
    public long? SellerFarmerId { get; set; }
    public FodderType FodderType { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "kg";
    public decimal RatePerUnit { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
}

public class FeedingEntry : AuditableEntity<long>
{
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public StockSource Source { get; set; }
    public AnimalType AnimalType { get; set; }
    public FodderType FodderType { get; set; }
    public decimal QuantityIssued { get; set; }
    public string Unit { get; set; } = "kg";
    public DateTime FeedingDateTime { get; set; } = DateTime.UtcNow;
}

public class StockAdjustment : AuditableEntity<long>
{
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public StockSource Source { get; set; }
    public FodderType FodderType { get; set; }
    public AdjustmentType AdjustmentType { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "kg";
    public string Reason { get; set; } = string.Empty;
    public DateTime AdjustmentDate { get; set; } = DateTime.UtcNow;
}

public class Expense : AuditableEntity<long>
{
    public long ChhavaniId { get; set; }
    public Chhavani? Chhavani { get; set; }
    public string Category { get; set; } = string.Empty; // Labour, Water, Electricity, Transportation, Other
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime ExpenseDate { get; set; } = DateTime.UtcNow;
}
