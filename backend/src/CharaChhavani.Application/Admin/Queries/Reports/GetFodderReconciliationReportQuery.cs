using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Admin.Queries.Reports;

public class GetFodderReconciliationReportQuery : IRequest<ApiResponse<List<FodderReconciliationReportItemDto>>>
{
    public long? ChhavaniId { get; set; }
    public string? District { get; set; }
    public string? Taluka { get; set; }
}

public class GetFodderReconciliationReportQueryHandler : IRequestHandler<GetFodderReconciliationReportQuery, ApiResponse<List<FodderReconciliationReportItemDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetFodderReconciliationReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<FodderReconciliationReportItemDto>>> Handle(
        GetFodderReconciliationReportQuery request,
        CancellationToken cancellationToken)
    {
        var campsQuery = _context.Chhavanis
            .Where(c => !c.IsDeleted)
            .AsNoTracking();

        if (request.ChhavaniId.HasValue)
        {
            campsQuery = campsQuery.Where(c => c.Id == request.ChhavaniId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.District))
        {
            campsQuery = campsQuery.Where(c => c.District.ToLower() == request.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Taluka))
        {
            campsQuery = campsQuery.Where(c => c.Taluka.ToLower() == request.Taluka.ToLower());
        }

        var camps = await campsQuery.ToListAsync(cancellationToken);
        var campIds = camps.Select(c => c.Id).ToList();

        var purchases = await _context.FodderPurchases
            .Where(p => campIds.Contains(p.ChhavaniId) && !p.IsDeleted)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var feedings = await _context.FeedingEntries
            .Where(f => campIds.Contains(f.ChhavaniId) && !f.IsDeleted)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var adjustments = await _context.StockAdjustments
            .Where(a => campIds.Contains(a.ChhavaniId) && !a.IsDeleted)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var stocks = await _context.FodderStocks
            .Where(s => campIds.Contains(s.ChhavaniId) && !s.IsDeleted)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var results = new List<FodderReconciliationReportItemDto>();

        foreach (var camp in camps)
        {
            var campPurchases = purchases.Where(p => p.ChhavaniId == camp.Id).ToList();
            var campFeedings = feedings.Where(f => f.ChhavaniId == camp.Id).ToList();
            var campAdjustments = adjustments.Where(a => a.ChhavaniId == camp.Id).ToList();
            var campStocks = stocks.Where(s => s.ChhavaniId == camp.Id).ToList();

            // Distinct fodder types across all transactions
            var fodderTypes = campPurchases.Select(p => p.FodderType)
                .Union(campFeedings.Select(f => f.FodderType))
                .Union(campStocks.Select(s => s.FodderType))
                .Distinct();

            foreach (var fType in fodderTypes)
            {
                var purchasedKg = campPurchases.Where(p => p.FodderType == fType).Sum(p => p.Quantity);
                var purchasedQuintals = Math.Round(purchasedKg / 100m, 2);
                var fedKg = campFeedings.Where(f => f.FodderType == fType).Sum(f => f.QuantityIssued);

                var increaseAdj = campAdjustments.Where(a => a.FodderType == fType && a.AdjustmentType == AdjustmentType.Increase).Sum(a => a.Quantity);
                var decreaseAdj = campAdjustments.Where(a => a.FodderType == fType && a.AdjustmentType == AdjustmentType.Decrease).Sum(a => a.Quantity);
                var netAdjustmentKg = increaseAdj - decreaseAdj;

                var storeStock = campStocks.FirstOrDefault(s => s.FodderType == fType && s.Source == StockSource.Store)?.AvailableQuantity ?? 0m;
                var inFarmStock = campStocks.FirstOrDefault(s => s.FodderType == fType && s.Source == StockSource.InFarm)?.AvailableQuantity ?? 0m;

                results.Add(new FodderReconciliationReportItemDto
                {
                    ChhavaniId = camp.Id,
                    CampName = camp.Name,
                    CampCode = camp.CampCode,
                    District = camp.District,
                    Taluka = camp.Taluka,
                    FodderType = fType.ToString(),
                    TotalPurchasedQuintals = purchasedQuintals,
                    TotalFedKg = fedKg,
                    TotalAdjustedKg = netAdjustmentKg,
                    AvailableStoreStockKg = storeStock,
                    AvailableInFarmStockKg = inFarmStock
                });
            }
        }

        return ApiResponse<List<FodderReconciliationReportItemDto>>.Ok(results, "Fodder reconciliation report generated successfully.");
    }
}
