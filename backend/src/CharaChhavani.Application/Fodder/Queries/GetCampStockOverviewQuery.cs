using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Fodder.DTOs;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Fodder.Queries;

public record GetCampStockOverviewQuery(long ChhavaniId) : IRequest<ApiResponse<CampStockOverviewDto>>;

public class GetCampStockOverviewQueryHandler : IRequestHandler<GetCampStockOverviewQuery, ApiResponse<CampStockOverviewDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCampStockOverviewQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<CampStockOverviewDto>> Handle(GetCampStockOverviewQuery request, CancellationToken cancellationToken)
    {
        var chhavani = await _context.Chhavanis
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);

        if (chhavani == null) throw new NotFoundException(nameof(Chhavani), request.ChhavaniId);

        var stocks = await _context.FodderStocks
            .Where(s => s.ChhavaniId == request.ChhavaniId)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var storeStocks = stocks
            .Where(s => s.Source == StockSource.Store)
            .Select(s => new FodderStockItemDto
            {
                Source = "Store",
                FodderType = s.FodderType.ToString(),
                AvailableQuantity = s.AvailableQuantity,
                Unit = s.Unit
            }).ToList();

        var inFarmStocks = stocks
            .Where(s => s.Source == StockSource.InFarm)
            .Select(s => new FodderStockItemDto
            {
                Source = "InFarm",
                FodderType = s.FodderType.ToString(),
                AvailableQuantity = s.AvailableQuantity,
                Unit = s.Unit
            }).ToList();

        var overview = new CampStockOverviewDto
        {
            ChhavaniId = chhavani.Id,
            CampName = chhavani.Name,
            StoreStock = storeStocks,
            InFarmStock = inFarmStocks
        };

        return ApiResponse<CampStockOverviewDto>.Ok(overview);
    }
}
