using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.Application.Admin.Queries.Reports;

public class GetInspectionAuditReportQuery : IRequest<ApiResponse<List<InspectionAuditReportItemDto>>>
{
    public long? ChhavaniId { get; set; }
    public string? District { get; set; }
    public string? Taluka { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class GetInspectionAuditReportQueryHandler : IRequestHandler<GetInspectionAuditReportQuery, ApiResponse<List<InspectionAuditReportItemDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetInspectionAuditReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<InspectionAuditReportItemDto>>> Handle(
        GetInspectionAuditReportQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.CampInspections
            .Include(i => i.Chhavani)
            .Where(i => !i.IsDeleted)
            .AsNoTracking();

        if (request.ChhavaniId.HasValue)
        {
            query = query.Where(i => i.ChhavaniId == request.ChhavaniId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.District))
        {
            query = query.Where(i => i.Chhavani != null && i.Chhavani.District.ToLower() == request.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Taluka))
        {
            query = query.Where(i => i.Chhavani != null && i.Chhavani.Taluka.ToLower() == request.Taluka.ToLower());
        }

        if (request.StartDate.HasValue)
        {
            query = query.Where(i => i.InspectionDateUtc >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            query = query.Where(i => i.InspectionDateUtc <= request.EndDate.Value);
        }

        var inspections = await query
            .OrderByDescending(i => i.InspectionDateUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var reportItems = inspections.Select(i => new InspectionAuditReportItemDto
        {
            InspectionId = i.Id,
            ChhavaniId = i.ChhavaniId,
            CampName = i.Chhavani?.Name ?? string.Empty,
            CampCode = i.Chhavani?.CampCode ?? string.Empty,
            District = i.Chhavani?.District ?? string.Empty,
            Taluka = i.Chhavani?.Taluka ?? string.Empty,
            OfficerId = i.OfficerId,
            OfficerName = i.OfficerName,
            OfficerDesignation = i.OfficerDesignation,
            InspectionDate = i.InspectionDateUtc,
            ActualCattleHeadcount = i.PhysicalAnimalCount,
            SystemReportedCattleCount = i.SystemAnimalCount,
            FodderStockAdequate = i.FodderStockCondition.Equals("Satisfactory", StringComparison.OrdinalIgnoreCase),
            WaterSupplyAdequate = i.WaterAvailability.Equals("Adequate", StringComparison.OrdinalIgnoreCase),
            HygieneCondition = $"Score: {i.CleanlinessScore}/5",
            GeneralRemarks = i.Remarks,
            Latitude = i.InspectorLocation?.Y ?? 0.0,
            Longitude = i.InspectorLocation?.X ?? 0.0
        }).ToList();

        return ApiResponse<List<InspectionAuditReportItemDto>>.Ok(reportItems, "Inspection audit report generated successfully.");
    }
}
