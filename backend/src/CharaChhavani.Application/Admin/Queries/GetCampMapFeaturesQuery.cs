using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Admin.Queries;

public record GetCampMapFeaturesQuery : IRequest<ApiResponse<List<CampMapFeatureDto>>>
{
    public string? District { get; init; }
    public string? Taluka { get; init; }
    public string? Status { get; init; }
}

public class GetCampMapFeaturesQueryHandler : IRequestHandler<GetCampMapFeaturesQuery, ApiResponse<List<CampMapFeatureDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCampMapFeaturesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CampMapFeatureDto>>> Handle(GetCampMapFeaturesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Chhavanis
            .Where(c => !c.IsDeleted)
            .Include(c => c.Operators.Where(o => !o.IsDeleted && o.IsActive))
            .Include(c => c.Stocks)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.District))
        {
            query = query.Where(c => c.District.ToLower() == request.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Taluka))
        {
            query = query.Where(c => c.Taluka.ToLower() == request.Taluka.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<CampStatus>(request.Status, true, out var campStatus))
        {
            query = query.Where(c => c.Status == campStatus);
        }

        var camps = await query.ToListAsync(cancellationToken);

        var campIds = camps.Select(c => c.Id).ToList();
        var expenses = await _context.Expenses
            .Where(e => campIds.Contains(e.ChhavaniId) && !e.IsDeleted)
            .GroupBy(e => e.ChhavaniId)
            .Select(g => new { CampId = g.Key, Total = g.Sum(e => e.Amount) })
            .ToDictionaryAsync(x => x.CampId, x => x.Total, cancellationToken);

        var dtos = camps.Select(c =>
        {
            var op = c.Operators.FirstOrDefault();
            var lat = c.Location != null ? c.Location.Y : 19.8200;
            var lng = c.Location != null ? c.Location.X : 75.3300;

            var polygonCoords = new List<CoordinatePairDto>();
            if (c.GeofenceBoundary != null && c.GeofenceBoundary.Coordinates.Length > 0)
            {
                foreach (var coord in c.GeofenceBoundary.Coordinates)
                {
                    // NetTopologySuite: X = Longitude, Y = Latitude
                    polygonCoords.Add(new CoordinatePairDto(coord.Y, coord.X));
                }
            }
            else
            {
                // Fallback default box around camp center if polygon is unassigned
                polygonCoords.Add(new CoordinatePairDto(lat - 0.003, lng - 0.003));
                polygonCoords.Add(new CoordinatePairDto(lat + 0.003, lng - 0.003));
                polygonCoords.Add(new CoordinatePairDto(lat + 0.003, lng + 0.003));
                polygonCoords.Add(new CoordinatePairDto(lat - 0.003, lng + 0.003));
                polygonCoords.Add(new CoordinatePairDto(lat - 0.003, lng - 0.003));
            }

            var storeStock = c.Stocks.Where(s => s.Source == StockSource.Store).Sum(s => s.AvailableQuantity);
            var inFarmStock = c.Stocks.Where(s => s.Source == StockSource.InFarm).Sum(s => s.AvailableQuantity);
            var totalExp = expenses.TryGetValue(c.Id, out var expVal) ? expVal : 0m;

            var available = Math.Max(0, c.TotalCapacity - c.ActiveAnimalCount);
            var util = c.TotalCapacity > 0 ? Math.Round((decimal)c.ActiveAnimalCount / c.TotalCapacity * 100m, 1) : 0m;

            return new CampMapFeatureDto
            {
                CampId = c.Id,
                CampCode = c.CampCode,
                Name = c.Name,
                Address = c.Address,
                Village = c.Village,
                Taluka = c.Taluka,
                District = c.District,
                State = c.State,
                Latitude = lat,
                Longitude = lng,
                TotalCapacity = c.TotalCapacity,
                AdmittedCattle = c.ActiveAnimalCount,
                AvailableCapacity = available,
                UtilizationPercentage = util,
                Status = c.Status.ToString(),
                OperatorName = op?.Name ?? "Designated Camp Officer",
                OperatorMobile = op?.MobileNumber ?? "9822000000",
                PolygonCoordinates = polygonCoords,
                StoreStockKg = storeStock,
                InFarmStockKg = inFarmStock,
                TotalExpensesInr = totalExp
            };
        }).ToList();

        return ApiResponse<List<CampMapFeatureDto>>.Ok(dtos);
    }
}
