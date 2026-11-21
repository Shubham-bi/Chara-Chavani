using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Fodder.DTOs;

public class FodderStockItemDto
{
    public string Source { get; set; } = string.Empty;
    public string FodderType { get; set; } = string.Empty;
    public decimal AvailableQuantity { get; set; }
    public string Unit { get; set; } = "kg";
}

public class CampStockOverviewDto
{
    public long ChhavaniId { get; set; }
    public string CampName { get; set; } = string.Empty;
    public List<FodderStockItemDto> StoreStock { get; set; } = new();
    public List<FodderStockItemDto> InFarmStock { get; set; } = new();
    public decimal TotalAvailableStock => StoreStock.Sum(s => s.AvailableQuantity) + InFarmStock.Sum(s => s.AvailableQuantity);
}

public class PurchaseRecordResultDto
{
    public long PurchaseId { get; set; }
    public string PurchaseCode { get; set; } = string.Empty;
    public long ChhavaniId { get; set; }
    public string SellerName { get; set; } = string.Empty;
    public string FodderType { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal RatePerUnit { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal UpdatedStoreStock { get; set; }
}

public class FeedingRecordResultDto
{
    public long FeedingId { get; set; }
    public long ChhavaniId { get; set; }
    public string AnimalType { get; set; } = string.Empty;
    public string FodderType { get; set; } = string.Empty;
    public decimal QuantityIssued { get; set; }
    public decimal RemainingStock { get; set; }
}

public class StockAdjustmentResultDto
{
    public long AdjustmentId { get; set; }
    public long ChhavaniId { get; set; }
    public string Source { get; set; } = string.Empty;
    public string FodderType { get; set; } = string.Empty;
    public string AdjustmentType { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UpdatedAvailableStock { get; set; }
    public string Reason { get; set; } = string.Empty;
}
