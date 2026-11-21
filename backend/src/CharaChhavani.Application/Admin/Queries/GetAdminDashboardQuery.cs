using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Admin.Queries;

// 1. System-wide Dashboard Summary
public record GetAdminDashboardQuery : IRequest<ApiResponse<AdminDashboardSummaryDto>>;

public class GetAdminDashboardQueryHandler : IRequestHandler<GetAdminDashboardQuery, ApiResponse<AdminDashboardSummaryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAdminDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<AdminDashboardSummaryDto>> Handle(GetAdminDashboardQuery request, CancellationToken cancellationToken)
    {
        var totalFarmers = await _context.Farmers.CountAsync(f => !f.IsDeleted, cancellationToken);
        var totalAnimals = await _context.Animals.CountAsync(a => !a.IsDeleted, cancellationToken);
        var pendingVerifications = await _context.Animals
            .CountAsync(a => a.VerificationStatus == VerificationStatus.Pending && !a.IsDeleted, cancellationToken);
        var verifiedAnimals = await _context.Animals
            .CountAsync(a => a.VerificationStatus == VerificationStatus.Approved && !a.IsDeleted, cancellationToken);
        var rejectedAnimals = await _context.Animals
            .CountAsync(a => a.VerificationStatus == VerificationStatus.Rejected && !a.IsDeleted, cancellationToken);

        var camps = await _context.Chhavanis
            .Where(c => !c.IsDeleted)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var totalCamps = camps.Count;
        var totalCapacity = camps.Sum(c => c.TotalCapacity);
        var totalAdmitted = camps.Sum(c => c.ActiveAnimalCount);

        var stocks = await _context.FodderStocks.AsNoTracking().ToListAsync(cancellationToken);
        var storeStock = stocks.Where(s => s.Source == StockSource.Store).Sum(s => s.AvailableQuantity);
        var inFarmStock = stocks.Where(s => s.Source == StockSource.InFarm).Sum(s => s.AvailableQuantity);

        var totalPurchases = await _context.FodderPurchases
            .Where(p => !p.IsDeleted)
            .SumAsync(p => p.TotalAmount, cancellationToken);

        var totalExpenses = await _context.Expenses
            .Where(e => !e.IsDeleted)
            .SumAsync(e => e.Amount, cancellationToken);

        var summary = new AdminDashboardSummaryDto
        {
            TotalRegisteredFarmers = totalFarmers,
            TotalRegisteredAnimals = totalAnimals,
            PendingAnimalVerification = pendingVerifications,
            VerifiedAnimals = verifiedAnimals,
            RejectedAnimals = rejectedAnimals,
            TotalCharaChhavaniCentres = totalCamps,
            TotalCampCapacity = totalCapacity,
            TotalActiveAdmittedAnimals = totalAdmitted,
            TotalStoreStockKg = storeStock,
            TotalInFarmStockKg = inFarmStock,
            TotalFodderPurchaseAmount = totalPurchases,
            TotalOperationalExpenses = totalExpenses
        };

        return ApiResponse<AdminDashboardSummaryDto>.Ok(summary);
    }
}

// 2. Camps Utilization Query
public record GetAdminCampsSummaryQuery : IRequest<ApiResponse<List<CampUtilizationSummaryDto>>>;

public class GetAdminCampsSummaryQueryHandler : IRequestHandler<GetAdminCampsSummaryQuery, ApiResponse<List<CampUtilizationSummaryDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAdminCampsSummaryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CampUtilizationSummaryDto>>> Handle(GetAdminCampsSummaryQuery request, CancellationToken cancellationToken)
    {
        var camps = await _context.Chhavanis
            .Where(c => !c.IsDeleted)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = camps.Select(c => new CampUtilizationSummaryDto
        {
            CampId = c.Id,
            CampCode = c.CampCode,
            Name = c.Name,
            District = c.District,
            Taluka = c.Taluka,
            TotalCapacity = c.TotalCapacity,
            ActiveAnimalCount = c.ActiveAnimalCount,
            UtilizationPercentage = c.TotalCapacity > 0 ? Math.Round((double)c.ActiveAnimalCount / c.TotalCapacity * 100, 2) : 0,
            HasGeofence = c.GeofenceBoundary != null
        }).ToList();

        return ApiResponse<List<CampUtilizationSummaryDto>>.Ok(dtos);
    }
}
