using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admissions.DTOs;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Admissions.Queries;

// 1. Search Animal for Admission Query
public record SearchAnimalForAdmissionQuery(string SearchTerm) : IRequest<ApiResponse<List<AnimalAdmissionSearchDto>>>;

public class SearchAnimalForAdmissionQueryHandler : IRequestHandler<SearchAnimalForAdmissionQuery, ApiResponse<List<AnimalAdmissionSearchDto>>>
{
    private readonly IApplicationDbContext _context;

    public SearchAnimalForAdmissionQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<AnimalAdmissionSearchDto>>> Handle(SearchAnimalForAdmissionQuery request, CancellationToken cancellationToken)
    {
        var term = request.SearchTerm.Trim();
        if (string.IsNullOrWhiteSpace(term))
        {
            return ApiResponse<List<AnimalAdmissionSearchDto>>.Ok(new List<AnimalAdmissionSearchDto>());
        }

        var animals = await _context.Animals
            .Include(a => a.Farmer)
            .Where(a => !a.IsDeleted && (
                a.AnimalCode == term || 
                a.TagNumber == term || 
                (a.Farmer != null && a.Farmer.MobileNumber == term)))
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var dtos = animals.Select(a =>
        {
            var isEligible = a.VerificationStatus == VerificationStatus.Approved && a.CurrentStatus != AnimalStatus.Admitted;
            string? reason = null;

            if (a.VerificationStatus != VerificationStatus.Approved)
            {
                reason = $"Verification status is '{a.VerificationStatus}'. Animal must be verified and approved by a veterinary doctor first.";
            }
            else if (a.CurrentStatus == AnimalStatus.Admitted)
            {
                reason = "Animal is already currently admitted to a camp.";
            }

            return new AnimalAdmissionSearchDto
            {
                AnimalId = a.Id,
                AnimalCode = a.AnimalCode,
                TagNumber = a.TagNumber,
                FarmerId = a.FarmerId,
                FarmerName = a.Farmer?.Name ?? "",
                FarmerMobile = a.Farmer?.MobileNumber ?? "",
                AnimalType = a.AnimalType.ToString(),
                Breed = a.Breed,
                PhotoUrl = a.PhotoUrl,
                VerificationStatus = a.VerificationStatus.ToString(),
                CurrentStatus = a.CurrentStatus.ToString(),
                IsEligibleForAdmission = isEligible,
                IneligibilityReason = reason
            };
        }).ToList();

        return ApiResponse<List<AnimalAdmissionSearchDto>>.Ok(dtos, $"Found {dtos.Count} matching records.");
    }
}

// 2. Get Camp Admissions Query
public record GetCampAdmissionsQuery : IRequest<ApiResponse<List<AdmissionResultDto>>>
{
    public long ChhavaniId { get; init; }
    public AdmissionStatus? Status { get; init; } = AdmissionStatus.Admitted;
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 50;
}

public class GetCampAdmissionsQueryHandler : IRequestHandler<GetCampAdmissionsQuery, ApiResponse<List<AdmissionResultDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCampAdmissionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<AdmissionResultDto>>> Handle(GetCampAdmissionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.AnimalAdmissions
            .Include(a => a.Animal)
            .Include(a => a.Chhavani)
            .Where(a => a.ChhavaniId == request.ChhavaniId && !a.IsDeleted)
            .AsNoTracking();

        if (request.Status.HasValue)
        {
            query = query.Where(a => a.Status == request.Status.Value);
        }

        var admissions = await query
            .OrderByDescending(a => a.AdmittedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = admissions.Select(a => new AdmissionResultDto
        {
            AdmissionId = a.Id,
            AdmissionCode = a.AdmissionCode,
            AnimalId = a.AnimalId,
            AnimalCode = a.Animal?.AnimalCode ?? "",
            ChhavaniId = a.ChhavaniId,
            ChhavaniName = a.Chhavani?.Name ?? "",
            OperatorId = a.OperatorId,
            PhotoUrl = a.AdmissionPhotoUrl,
            AdmissionLocation = a.AdmissionLocation != null 
                ? new GeoCoordinateDto(a.AdmissionLocation.Y, a.AdmissionLocation.X) 
                : null,
            IsGeofenceValidated = a.IsGeofenceValidated,
            AdmittedAtUtc = a.AdmittedAtUtc,
            ActiveCampAnimals = a.Chhavani?.ActiveAnimalCount ?? 0,
            CampTotalCapacity = a.Chhavani?.TotalCapacity ?? 0
        }).ToList();

        return ApiResponse<List<AdmissionResultDto>>.Ok(dtos, $"Found {dtos.Count} admissions.");
    }
}
