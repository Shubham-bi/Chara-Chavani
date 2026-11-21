using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Animals.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Animals.Queries;

// 1. Get Farmer Animals List
public record GetFarmerAnimalsQuery : IRequest<ApiResponse<List<AnimalDto>>>
{
    public long FarmerId { get; init; }
    public VerificationStatus? VerificationStatus { get; init; }
    public AnimalStatus? CurrentStatus { get; init; }
}

public class GetFarmerAnimalsQueryHandler : IRequestHandler<GetFarmerAnimalsQuery, ApiResponse<List<AnimalDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetFarmerAnimalsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<AnimalDto>>> Handle(GetFarmerAnimalsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Animals
            .Include(a => a.Farmer)
            .Include(a => a.CurrentChhavani)
            .Where(a => a.FarmerId == request.FarmerId && !a.IsDeleted)
            .AsNoTracking();

        if (request.VerificationStatus.HasValue)
        {
            query = query.Where(a => a.VerificationStatus == request.VerificationStatus.Value);
        }

        if (request.CurrentStatus.HasValue)
        {
            query = query.Where(a => a.CurrentStatus == request.CurrentStatus.Value);
        }

        var animals = await query
            .OrderByDescending(a => a.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        var dtos = animals.Select(a => new AnimalDto
        {
            Id = a.Id,
            AnimalCode = a.AnimalCode,
            TagNumber = a.TagNumber,
            FarmerId = a.FarmerId,
            FarmerName = a.Farmer?.Name ?? "",
            AnimalType = a.AnimalType.ToString(),
            Breed = a.Breed,
            Gender = a.Gender.ToString(),
            AgeInMonths = a.AgeInMonths,
            PhotoUrl = a.PhotoUrl,
            VerificationStatus = a.VerificationStatus.ToString(),
            CurrentStatus = a.CurrentStatus.ToString(),
            CurrentChhavaniId = a.CurrentChhavaniId,
            CurrentChhavaniName = a.CurrentChhavani?.Name,
            RegistrationDateUtc = a.CreatedAtUtc
        }).ToList();

        return ApiResponse<List<AnimalDto>>.Ok(dtos, $"Found {dtos.Count} registered animals.");
    }
}

// 2. Get Animal Details by Id
public record GetAnimalDetailsQuery(long AnimalId) : IRequest<ApiResponse<AnimalDto>>;

public class GetAnimalDetailsQueryHandler : IRequestHandler<GetAnimalDetailsQuery, ApiResponse<AnimalDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAnimalDetailsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<AnimalDto>> Handle(GetAnimalDetailsQuery request, CancellationToken cancellationToken)
    {
        var a = await _context.Animals
            .Include(x => x.Farmer)
            .Include(x => x.CurrentChhavani)
            .Include(x => x.Verifications)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.AnimalId, cancellationToken);

        if (a == null)
        {
            throw new NotFoundException(nameof(Domain.Entities.Animal), request.AnimalId);
        }

        var dto = new AnimalDto
        {
            Id = a.Id,
            AnimalCode = a.AnimalCode,
            TagNumber = a.TagNumber,
            FarmerId = a.FarmerId,
            FarmerName = a.Farmer?.Name ?? "",
            AnimalType = a.AnimalType.ToString(),
            Breed = a.Breed,
            Gender = a.Gender.ToString(),
            AgeInMonths = a.AgeInMonths,
            PhotoUrl = a.PhotoUrl,
            VerificationStatus = a.VerificationStatus.ToString(),
            CurrentStatus = a.CurrentStatus.ToString(),
            CurrentChhavaniId = a.CurrentChhavaniId,
            CurrentChhavaniName = a.CurrentChhavani?.Name,
            RegistrationDateUtc = a.CreatedAtUtc,
            Verifications = a.Verifications.Select(v => new VerificationHistoryDto
            {
                Id = v.Id,
                DoctorId = v.DoctorId,
                Result = v.Result.ToString(),
                Remarks = v.Remarks,
                VerifiedAtUtc = v.VerifiedAtUtc
            }).ToList()
        };

        return ApiResponse<AnimalDto>.Ok(dto);
    }
}
