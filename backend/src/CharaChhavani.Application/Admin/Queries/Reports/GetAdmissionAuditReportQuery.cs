using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Admin.Queries.Reports;

public class GetAdmissionAuditReportQuery : IRequest<ApiResponse<List<AdmissionAuditReportItemDto>>>
{
    public long? ChhavaniId { get; set; }
    public string? District { get; set; }
    public string? Taluka { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public AdmissionStatus? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class GetAdmissionAuditReportQueryHandler : IRequestHandler<GetAdmissionAuditReportQuery, ApiResponse<List<AdmissionAuditReportItemDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAdmissionAuditReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<AdmissionAuditReportItemDto>>> Handle(
        GetAdmissionAuditReportQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.AnimalAdmissions
            .Include(a => a.Chhavani)
            .Include(a => a.Animal)
                .ThenInclude(an => an!.Farmer)
            .Where(a => !a.IsDeleted)
            .AsNoTracking();

        if (request.ChhavaniId.HasValue)
        {
            query = query.Where(a => a.ChhavaniId == request.ChhavaniId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.District))
        {
            query = query.Where(a => a.Chhavani != null && a.Chhavani.District.ToLower() == request.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Taluka))
        {
            query = query.Where(a => a.Chhavani != null && a.Chhavani.Taluka.ToLower() == request.Taluka.ToLower());
        }

        if (request.Status.HasValue)
        {
            query = query.Where(a => a.Status == request.Status.Value);
        }

        if (request.StartDate.HasValue)
        {
            query = query.Where(a => a.AdmittedAtUtc >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            query = query.Where(a => a.AdmittedAtUtc <= request.EndDate.Value);
        }

        var admissions = await query
            .OrderByDescending(a => a.AdmittedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var reportItems = admissions.Select(a =>
        {
            var farmer = a.Animal?.Farmer;
            var mobile = farmer?.MobileNumber ?? string.Empty;
            var maskedMobile = mobile.Length >= 4 
                ? $"XXXX-XX-{mobile[^4..]}" 
                : "XXXX-XXXXXX";

            var days = a.ReleasedAtUtc.HasValue
                ? Math.Max(1, (int)(a.ReleasedAtUtc.Value.Date - a.AdmittedAtUtc.Date).TotalDays + 1)
                : Math.Max(1, (int)(DateTime.UtcNow.Date - a.AdmittedAtUtc.Date).TotalDays + 1);

            return new AdmissionAuditReportItemDto
            {
                AdmissionId = a.Id,
                AdmissionCode = a.AdmissionCode,
                ChhavaniId = a.ChhavaniId,
                CampName = a.Chhavani?.Name ?? string.Empty,
                CampCode = a.Chhavani?.CampCode ?? string.Empty,
                District = a.Chhavani?.District ?? string.Empty,
                Taluka = a.Chhavani?.Taluka ?? string.Empty,
                AnimalId = a.AnimalId,
                TagNumber = a.Animal?.TagNumber ?? string.Empty,
                AnimalCategory = a.Animal?.AnimalType.ToString() ?? string.Empty,
                Breed = a.Animal?.Breed ?? string.Empty,
                FarmerId = a.Animal?.FarmerId ?? 0,
                FarmerName = farmer?.Name ?? string.Empty,
                FarmerMobileNumber = mobile,
                MaskedAadhaar = maskedMobile,
                AdmittedAt = a.AdmittedAtUtc,
                ReleasedAt = a.ReleasedAtUtc,
                Status = a.Status.ToString(),
                ActiveDaysInCamp = days,
                ReleaseRemarks = a.ReleaseRemarks
            };
        }).ToList();

        return ApiResponse<List<AdmissionAuditReportItemDto>>.Ok(reportItems, "Admission audit report generated successfully.");
    }
}
