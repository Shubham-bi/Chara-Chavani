using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Officer.DTOs;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Application.Officer.Queries;

public record GetCampInspectionsQuery(long ChhavaniId) : IRequest<List<CampInspectionSummaryDto>>;

public class GetCampInspectionsQueryHandler : IRequestHandler<GetCampInspectionsQuery, List<CampInspectionSummaryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCampInspectionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CampInspectionSummaryDto>> Handle(GetCampInspectionsQuery request, CancellationToken cancellationToken)
    {
        var camp = await _context.Chhavanis
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);

        if (camp == null)
        {
            throw new NotFoundException(nameof(Chhavani), request.ChhavaniId);
        }

        var inspections = await _context.CampInspections
            .AsNoTracking()
            .Where(i => i.ChhavaniId == request.ChhavaniId)
            .OrderByDescending(i => i.InspectionDateUtc)
            .ToListAsync(cancellationToken);

        return inspections.Select(i => new CampInspectionSummaryDto
        {
            Id = i.Id,
            ChhavaniId = i.ChhavaniId,
            CampName = camp.Name,
            CampCode = camp.CampCode,
            OfficerId = i.OfficerId,
            OfficerName = i.OfficerName,
            OfficerDesignation = i.OfficerDesignation,
            InspectionDateUtc = i.InspectionDateUtc,
            Latitude = i.InspectorLocation?.Y,
            Longitude = i.InspectorLocation?.X,
            PhysicalAnimalCount = i.PhysicalAnimalCount,
            SystemAnimalCount = i.SystemAnimalCount,
            DiscrepancyCount = i.DiscrepancyCount,
            DiscrepancyDetected = i.DiscrepancyDetected,
            WaterAvailability = i.WaterAvailability,
            FodderStockCondition = i.FodderStockCondition,
            CleanlinessScore = i.CleanlinessScore,
            Remarks = i.Remarks,
            Recommendations = i.Recommendations,
            InspectionPhotoUrl = i.InspectionPhotoUrl
        }).ToList();
    }
}
