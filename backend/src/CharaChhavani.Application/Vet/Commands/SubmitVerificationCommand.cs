using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Vet.DTOs;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Vet.Commands;

public record SubmitVerificationCommand : IRequest<ApiResponse<VetVerificationResultDto>>
{
    public long AnimalId { get; init; }
    public string DoctorId { get; init; } = string.Empty;
    public VerificationStatus Result { get; init; }
    public string? Remarks { get; init; }
    public double? InspectionLatitude { get; init; }
    public double? InspectionLongitude { get; init; }
    public string? VerificationPhotoUrl { get; init; }
}

public class SubmitVerificationValidator : AbstractValidator<SubmitVerificationCommand>
{
    public SubmitVerificationValidator()
    {
        RuleFor(x => x.AnimalId).GreaterThan(0);
        RuleFor(x => x.DoctorId).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Result)
            .Must(r => r == VerificationStatus.Approved || r == VerificationStatus.Rejected)
            .WithMessage("Verification result must be either Approved or Rejected.");

        When(x => x.Result == VerificationStatus.Rejected, () =>
        {
            RuleFor(x => x.Remarks)
                .NotEmpty()
                .WithMessage("Remarks (rejection reason) are strictly required when an animal is rejected.");
        });
    }
}

public class SubmitVerificationCommandHandler : IRequestHandler<SubmitVerificationCommand, ApiResponse<VetVerificationResultDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    public SubmitVerificationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<VetVerificationResultDto>> Handle(SubmitVerificationCommand request, CancellationToken cancellationToken)
    {
        var animal = await _context.Animals
            .FirstOrDefaultAsync(a => a.Id == request.AnimalId, cancellationToken);

        if (animal == null)
        {
            throw new NotFoundException(nameof(Animal), request.AnimalId);
        }

        if (animal.VerificationStatus == VerificationStatus.Approved)
        {
            return ApiResponse<VetVerificationResultDto>.Failure("This animal has already been approved and cannot be re-verified.");
        }

        // Construct Point location for doctor visit at farmer premises
        Point? inspectionPoint = null;
        if (request.InspectionLatitude.HasValue && request.InspectionLongitude.HasValue)
        {
            inspectionPoint = _geometryFactory.CreatePoint(
                new Coordinate(request.InspectionLongitude.Value, request.InspectionLatitude.Value));
        }

        var verification = new VetVerification
        {
            AnimalId = animal.Id,
            DoctorId = request.DoctorId,
            Result = request.Result,
            Remarks = request.Remarks,
            InspectionLocation = inspectionPoint,
            VerificationPhotoUrl = request.VerificationPhotoUrl,
            VerifiedAtUtc = DateTime.UtcNow
        };

        // Transition Animal state
        animal.VerificationStatus = request.Result;
        animal.UpdatedAtUtc = DateTime.UtcNow;

        _context.VetVerifications.Add(verification);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = new VetVerificationResultDto
        {
            VerificationId = verification.Id,
            AnimalId = animal.Id,
            AnimalCode = animal.AnimalCode,
            DoctorId = verification.DoctorId,
            Result = verification.Result.ToString(),
            Remarks = verification.Remarks,
            InspectionLocation = inspectionPoint != null
                ? new GeoCoordinateDto(inspectionPoint.Y, inspectionPoint.X)
                : null,
            VerifiedAtUtc = verification.VerifiedAtUtc
        };

        var message = request.Result == VerificationStatus.Approved
            ? "Animal verified and approved for Chhavani admission."
            : "Animal inspection recorded as rejected.";

        return ApiResponse<VetVerificationResultDto>.Ok(resultDto, message);
    }
}
