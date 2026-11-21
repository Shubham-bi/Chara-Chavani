using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Officer.DTOs;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Officer.Queries;

public record GetOfficerDashboardQuery : IRequest<OfficerDashboardSummaryDto>
{
    public string? Taluka { get; init; }
    public string? District { get; init; }
}

public class GetOfficerDashboardQueryHandler : IRequestHandler<GetOfficerDashboardQuery, OfficerDashboardSummaryDto>
{
    private readonly IApplicationDbContext _context;

    public GetOfficerDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OfficerDashboardSummaryDto> Handle(GetOfficerDashboardQuery request, CancellationToken cancellationToken)
    {
        var campsQuery = _context.Chhavanis.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.District))
        {
            campsQuery = campsQuery.Where(c => c.District.ToLower() == request.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Taluka))
        {
            campsQuery = campsQuery.Where(c => c.Taluka.ToLower() == request.Taluka.ToLower());
        }

        var totalCamps = await campsQuery.CountAsync(cancellationToken);
        var activeCamps = await campsQuery.CountAsync(c => c.Status == CampStatus.Active, cancellationToken);
        var totalOperators = await _context.ChhavaniOperators.CountAsync(cancellationToken);

        var totalAdmitted = await campsQuery.SumAsync(c => c.ActiveAnimalCount, cancellationToken);
        var totalCapacity = await campsQuery.SumAsync(c => c.TotalCapacity, cancellationToken);

        double utilization = totalCapacity > 0
            ? Math.Round(((double)totalAdmitted / totalCapacity) * 100.0, 2)
            : 0.0;

        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var inspectionsThisMonth = await _context.CampInspections
            .CountAsync(i => i.InspectionDateUtc >= startOfMonth, cancellationToken);

        var discrepanciesThisMonth = await _context.CampInspections
            .CountAsync(i => i.InspectionDateUtc >= startOfMonth && i.DiscrepancyDetected, cancellationToken);

        return new OfficerDashboardSummaryDto
        {
            TotalRegisteredCamps = totalCamps,
            ActiveCamps = activeCamps,
            TotalCampOperators = totalOperators,
            TotalAdmittedLivestock = totalAdmitted,
            TotalCapacity = totalCapacity,
            CapacityUtilizationPercentage = utilization,
            InspectionsConductedThisMonth = inspectionsThisMonth,
            DiscrepanciesFlaggedThisMonth = discrepanciesThisMonth
        };
    }
}
