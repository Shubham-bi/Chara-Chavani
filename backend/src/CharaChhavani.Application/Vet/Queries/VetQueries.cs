using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Vet.DTOs;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Vet.Queries;

// 1. Doctor Dashboard Metrics Query
public record GetVetDashboardQuery(string? DoctorId = null) : IRequest<ApiResponse<VetDashboardDto>>;

public class GetVetDashboardQueryHandler : IRequestHandler<GetVetDashboardQuery, ApiResponse<VetDashboardDto>>
{
    private readonly IApplicationDbContext _context;

    public GetVetDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<VetDashboardDto>> Handle(GetVetDashboardQuery request, CancellationToken cancellationToken)
    {
        var pendingCount = await _context.Animals
            .CountAsync(a => a.VerificationStatus == VerificationStatus.Pending && !a.IsDeleted, cancellationToken);

        var verifiedCount = await _context.VetVerifications
            .CountAsync(v => v.Result == VerificationStatus.Approved && (request.DoctorId == null || v.DoctorId == request.DoctorId), cancellationToken);

        var rejectedCount = await _context.VetVerifications
            .CountAsync(v => v.Result == VerificationStatus.Rejected && (request.DoctorId == null || v.DoctorId == request.DoctorId), cancellationToken);

        var dto = new VetDashboardDto
        {
            PendingCount = pendingCount,
            VerifiedCount = verifiedCount,
            RejectedCount = rejectedCount
        };

        return ApiResponse<VetDashboardDto>.Ok(dto);
    }
}

// 2. Pending Verification Animal List
public record GetPendingVerificationsQuery : IRequest<ApiResponse<List<PendingVerificationAnimalDto>>>
{
    public string? District { get; init; }
    public string? Taluka { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 50;
}

public class GetPendingVerificationsQueryHandler : IRequestHandler<GetPendingVerificationsQuery, ApiResponse<List<PendingVerificationAnimalDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetPendingVerificationsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<PendingVerificationAnimalDto>>> Handle(GetPendingVerificationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Animals
            .Include(a => a.Farmer)
            .Where(a => a.VerificationStatus == VerificationStatus.Pending && !a.IsDeleted)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.District))
            query = query.Where(a => a.Farmer != null && a.Farmer.District == request.District);

        if (!string.IsNullOrWhiteSpace(request.Taluka))
            query = query.Where(a => a.Farmer != null && a.Farmer.Taluka == request.Taluka);

        var animals = await query
            .OrderBy(a => a.CreatedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = animals.Select(a => new PendingVerificationAnimalDto
        {
            AnimalId = a.Id,
            AnimalCode = a.AnimalCode,
            TagNumber = a.TagNumber,
            AnimalType = a.AnimalType.ToString(),
            Breed = a.Breed,
            Gender = a.Gender.ToString(),
            AgeInMonths = a.AgeInMonths,
            PhotoUrl = a.PhotoUrl,
            RegistrationDateUtc = a.CreatedAtUtc,
            FarmerId = a.FarmerId,
            FarmerName = a.Farmer?.Name ?? "",
            FarmerMobile = a.Farmer?.MobileNumber ?? "",
            FarmerVillage = a.Farmer?.Village ?? "",
            FarmerTaluka = a.Farmer?.Taluka ?? "",
            FarmerDistrict = a.Farmer?.District ?? ""
        }).ToList();

        return ApiResponse<List<PendingVerificationAnimalDto>>.Ok(dtos, $"Found {dtos.Count} animals pending verification.");
    }
}

// 3. Verification History Query
public record GetVetVerificationHistoryQuery(string? DoctorId = null, int PageNumber = 1, int PageSize = 50)
    : IRequest<ApiResponse<List<VetVerificationResultDto>>>;

public class GetVetVerificationHistoryQueryHandler : IRequestHandler<GetVetVerificationHistoryQuery, ApiResponse<List<VetVerificationResultDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetVetVerificationHistoryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<VetVerificationResultDto>>> Handle(GetVetVerificationHistoryQuery request, CancellationToken cancellationToken)
    {
        var query = _context.VetVerifications
            .Include(v => v.Animal)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.DoctorId))
            query = query.Where(v => v.DoctorId == request.DoctorId);

        var verifications = await query
            .OrderByDescending(v => v.VerifiedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = verifications.Select(v => new VetVerificationResultDto
        {
            VerificationId = v.Id,
            AnimalId = v.AnimalId,
            AnimalCode = v.Animal?.AnimalCode ?? "",
            DoctorId = v.DoctorId,
            Result = v.Result.ToString(),
            Remarks = v.Remarks,
            InspectionLocation = v.InspectionLocation != null
                ? new GeoCoordinateDto(v.InspectionLocation.Y, v.InspectionLocation.X)
                : null,
            VerifiedAtUtc = v.VerifiedAtUtc
        }).ToList();

        return ApiResponse<List<VetVerificationResultDto>>.Ok(dtos);
    }
}
