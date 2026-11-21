using MediatR;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Application.Officer.Commands;

public record RecordCampInspectionCommand : IRequest<long>
{
    public long ChhavaniId { get; init; }
    public string OfficerId { get; init; } = string.Empty;
    public string OfficerName { get; init; } = string.Empty;
    public string OfficerDesignation { get; init; } = string.Empty;
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public int PhysicalAnimalCount { get; init; }
    public string WaterAvailability { get; init; } = "Adequate";
    public string FodderStockCondition { get; init; } = "Satisfactory";
    public int CleanlinessScore { get; init; } = 4;
    public string? Remarks { get; init; }
    public string? Recommendations { get; init; }
    public string? InspectionPhotoUrl { get; init; }
}

public class RecordCampInspectionCommandValidator : AbstractValidator<RecordCampInspectionCommand>
{
    private static readonly string[] ValidWaterStatuses = ["Adequate", "Scarce", "Critical"];
    private static readonly string[] ValidFodderStatuses = ["Satisfactory", "Deficient", "Critical"];

    public RecordCampInspectionCommandValidator()
    {
        RuleFor(v => v.ChhavaniId)
            .GreaterThan(0).WithMessage("Valid Chhavani ID is required.");

        RuleFor(v => v.OfficerId)
            .NotEmpty().WithMessage("Officer ID is required.");

        RuleFor(v => v.OfficerName)
            .NotEmpty().WithMessage("Officer Name is required.");

        RuleFor(v => v.Latitude)
            .InclusiveBetween(-90.0, 90.0).WithMessage("Latitude must be between -90 and 90 degrees.");

        RuleFor(v => v.Longitude)
            .InclusiveBetween(-180.0, 180.0).WithMessage("Longitude must be between -180 and 180 degrees.");

        RuleFor(v => v.PhysicalAnimalCount)
            .GreaterThanOrEqualTo(0).WithMessage("Physical animal count cannot be negative.");

        RuleFor(v => v.WaterAvailability)
            .Must(status => ValidWaterStatuses.Contains(status))
            .WithMessage("Water availability must be Adequate, Scarce, or Critical.");

        RuleFor(v => v.FodderStockCondition)
            .Must(status => ValidFodderStatuses.Contains(status))
            .WithMessage("Fodder condition must be Satisfactory, Deficient, or Critical.");

        RuleFor(v => v.CleanlinessScore)
            .InclusiveBetween(1, 5).WithMessage("Cleanliness score must be between 1 and 5.");
    }
}

public class RecordCampInspectionCommandHandler : IRequestHandler<RecordCampInspectionCommand, long>
{
    private readonly IApplicationDbContext _context;

    public RecordCampInspectionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<long> Handle(RecordCampInspectionCommand request, CancellationToken cancellationToken)
    {
        var camp = await _context.Chhavanis
            .FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);

        if (camp == null)
        {
            throw new NotFoundException(nameof(Chhavani), request.ChhavaniId);
        }

        var systemCount = camp.ActiveAnimalCount;
        var discrepancyCount = request.PhysicalAnimalCount - systemCount;
        var discrepancyDetected = discrepancyCount != 0;

        var inspectorPoint = new Point(request.Longitude, request.Latitude)
        {
            SRID = 4326
        };

        var inspection = new CampInspection
        {
            ChhavaniId = request.ChhavaniId,
            OfficerId = request.OfficerId,
            OfficerName = request.OfficerName,
            OfficerDesignation = request.OfficerDesignation,
            InspectionDateUtc = DateTime.UtcNow,
            InspectorLocation = inspectorPoint,
            PhysicalAnimalCount = request.PhysicalAnimalCount,
            SystemAnimalCount = systemCount,
            DiscrepancyCount = discrepancyCount,
            DiscrepancyDetected = discrepancyDetected,
            WaterAvailability = request.WaterAvailability,
            FodderStockCondition = request.FodderStockCondition,
            CleanlinessScore = request.CleanlinessScore,
            Remarks = request.Remarks,
            Recommendations = request.Recommendations,
            InspectionPhotoUrl = request.InspectionPhotoUrl,
            CreatedBy = request.OfficerId,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.CampInspections.Add(inspection);
        await _context.SaveChangesAsync(cancellationToken);

        return inspection.Id;
    }
}
