using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Admissions.DTOs;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Admissions.Commands;

// 1. Admit Animal Command
public record AdmitAnimalCommand : IRequest<ApiResponse<AdmissionResultDto>>
{
    public long AnimalId { get; init; }
    public long ChhavaniId { get; init; }
    public string OperatorId { get; init; } = string.Empty;
    public string PhotoUrl { get; init; } = string.Empty;
    public double DeviceLatitude { get; init; }
    public double DeviceLongitude { get; init; }
}

public class AdmitAnimalValidator : AbstractValidator<AdmitAnimalCommand>
{
    public AdmitAnimalValidator()
    {
        RuleFor(x => x.AnimalId).GreaterThan(0);
        RuleFor(x => x.ChhavaniId).GreaterThan(0);
        RuleFor(x => x.OperatorId).NotEmpty().MaximumLength(50);
        RuleFor(x => x.PhotoUrl).NotEmpty().WithMessage("Admission photograph is mandatory.");
        RuleFor(x => x.DeviceLatitude).InclusiveBetween(-90, 90);
        RuleFor(x => x.DeviceLongitude).InclusiveBetween(-180, 180);
    }
}

public class AdmitAnimalCommandHandler : IRequestHandler<AdmitAnimalCommand, ApiResponse<AdmissionResultDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    public AdmitAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<AdmissionResultDto>> Handle(AdmitAnimalCommand request, CancellationToken cancellationToken)
    {
        var animal = await _context.Animals
            .FirstOrDefaultAsync(a => a.Id == request.AnimalId, cancellationToken);

        if (animal == null)
        {
            throw new NotFoundException(nameof(Animal), request.AnimalId);
        }

        var chhavani = await _context.Chhavanis
            .FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);

        if (chhavani == null)
        {
            throw new NotFoundException(nameof(Chhavani), request.ChhavaniId);
        }

        // Invariant 1: Animal must be Approved
        if (animal.VerificationStatus != VerificationStatus.Approved)
        {
            return ApiResponse<AdmissionResultDto>.Failure(
                $"Cannot admit animal. Current verification status is '{animal.VerificationStatus}'. Only approved animals can be admitted.");
        }

        // Invariant 2: Animal cannot already be admitted
        if (animal.CurrentStatus == AnimalStatus.Admitted)
        {
            return ApiResponse<AdmissionResultDto>.Failure(
                "Animal is already admitted to a Chara Chhavani. It must be released before being re-admitted.");
        }

        // Invariant 3: Camp capacity check
        if (!chhavani.HasAvailableCapacity())
        {
            return ApiResponse<AdmissionResultDto>.Failure(
                $"Camp capacity reached ({chhavani.ActiveAnimalCount}/{chhavani.TotalCapacity}). No further admissions allowed.");
        }

        // Invariant 4: Device coordinates must be inside camp polygon geofence
        if (chhavani.GeofenceBoundary == null)
        {
            return ApiResponse<AdmissionResultDto>.Failure(
                "Camp does not have an active geofence boundary defined. Please contact the administrator.");
        }

        var devicePoint = _geometryFactory.CreatePoint(new Coordinate(request.DeviceLongitude, request.DeviceLatitude));
        var isInsideGeofence = chhavani.IsPointInsideGeofence(devicePoint);

        if (!isInsideGeofence)
        {
            return ApiResponse<AdmissionResultDto>.Failure(
                "Admission rejected: Captured device GPS coordinates are OUTSIDE the camp's registered geofence boundary.");
        }

        // Generate unique AdmissionCode: ADM-YYYYMMDD-XXXX
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var randSuffix = new Random().Next(1000, 9999);
        var admissionCode = $"ADM-{datePart}-{randSuffix}";

        var admission = new AnimalAdmission
        {
            AdmissionCode = admissionCode,
            AnimalId = animal.Id,
            ChhavaniId = chhavani.Id,
            OperatorId = request.OperatorId,
            AdmissionPhotoUrl = request.PhotoUrl,
            AdmissionLocation = devicePoint,
            IsGeofenceValidated = true,
            AdmittedAtUtc = DateTime.UtcNow,
            Status = AdmissionStatus.Admitted
        };

        // Update Animal
        animal.CurrentStatus = AnimalStatus.Admitted;
        animal.CurrentChhavaniId = chhavani.Id;
        animal.UpdatedAtUtc = DateTime.UtcNow;

        // Atomically increment camp count
        chhavani.ActiveAnimalCount += 1;
        chhavani.UpdatedAtUtc = DateTime.UtcNow;

        _context.AnimalAdmissions.Add(admission);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = new AdmissionResultDto
        {
            AdmissionId = admission.Id,
            AdmissionCode = admission.AdmissionCode,
            AnimalId = animal.Id,
            AnimalCode = animal.AnimalCode,
            ChhavaniId = chhavani.Id,
            ChhavaniName = chhavani.Name,
            OperatorId = admission.OperatorId,
            PhotoUrl = admission.AdmissionPhotoUrl,
            AdmissionLocation = new GeoCoordinateDto(devicePoint.Y, devicePoint.X),
            IsGeofenceValidated = true,
            AdmittedAtUtc = admission.AdmittedAtUtc,
            ActiveCampAnimals = chhavani.ActiveAnimalCount,
            CampTotalCapacity = chhavani.TotalCapacity
        };

        return ApiResponse<AdmissionResultDto>.Ok(resultDto, "Animal successfully admitted to Chara Chhavani.");
    }
}

// 2. Release Animal Command
public record ReleaseAnimalCommand : IRequest<ApiResponse<ReleaseResultDto>>
{
    public long AdmissionId { get; init; }
    public string OperatorId { get; init; } = string.Empty;
    public string? Remarks { get; init; }
}

public class ReleaseAnimalValidator : AbstractValidator<ReleaseAnimalCommand>
{
    public ReleaseAnimalValidator()
    {
        RuleFor(x => x.AdmissionId).GreaterThan(0);
        RuleFor(x => x.OperatorId).NotEmpty().MaximumLength(50);
    }
}

public class ReleaseAnimalCommandHandler : IRequestHandler<ReleaseAnimalCommand, ApiResponse<ReleaseResultDto>>
{
    private readonly IApplicationDbContext _context;

    public ReleaseAnimalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ReleaseResultDto>> Handle(ReleaseAnimalCommand request, CancellationToken cancellationToken)
    {
        var admission = await _context.AnimalAdmissions
            .Include(a => a.Animal)
            .Include(a => a.Chhavani)
            .FirstOrDefaultAsync(a => a.Id == request.AdmissionId, cancellationToken);

        if (admission == null)
        {
            throw new NotFoundException(nameof(AnimalAdmission), request.AdmissionId);
        }

        if (admission.Status == AdmissionStatus.Released)
        {
            return ApiResponse<ReleaseResultDto>.Failure("This animal has already been released from the camp.");
        }

        // Update Admission
        admission.Status = AdmissionStatus.Released;
        admission.ReleasedAtUtc = DateTime.UtcNow;
        admission.ReleaseRemarks = request.Remarks;
        admission.UpdatedAtUtc = DateTime.UtcNow;

        // Update Animal
        if (admission.Animal != null)
        {
            admission.Animal.CurrentStatus = AnimalStatus.Released;
            admission.Animal.CurrentChhavaniId = null;
            admission.Animal.UpdatedAtUtc = DateTime.UtcNow;
        }

        // Decrement Camp active count atomically
        if (admission.Chhavani != null)
        {
            admission.Chhavani.ActiveAnimalCount = Math.Max(0, admission.Chhavani.ActiveAnimalCount - 1);
            admission.Chhavani.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = new ReleaseResultDto
        {
            AdmissionId = admission.Id,
            AnimalId = admission.AnimalId,
            AnimalCode = admission.Animal?.AnimalCode ?? "",
            ChhavaniId = admission.ChhavaniId,
            ReleasedAtUtc = admission.ReleasedAtUtc.Value,
            ReleaseRemarks = admission.ReleaseRemarks,
            ActiveCampAnimals = admission.Chhavani?.ActiveAnimalCount ?? 0
        };

        return ApiResponse<ReleaseResultDto>.Ok(resultDto, "Animal successfully released from Chara Chhavani.");
    }
}
