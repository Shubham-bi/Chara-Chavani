using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.Application.Chhavanis.Commands;

public record UpdateChhavaniGeofenceCommand : IRequest<ApiResponse<ChhavaniDto>>
{
    public long ChhavaniId { get; init; }
    public List<GeoCoordinateDto> GeofenceCoordinates { get; init; } = new();
}

public class UpdateChhavaniGeofenceValidator : AbstractValidator<UpdateChhavaniGeofenceCommand>
{
    public UpdateChhavaniGeofenceValidator()
    {
        RuleFor(x => x.ChhavaniId).GreaterThan(0);
        RuleFor(x => x.GeofenceCoordinates)
            .NotEmpty()
            .Must(coords => coords.Count >= 3)
            .WithMessage("Geofence polygon must have at least 3 coordinate points.");
    }
}

public class UpdateChhavaniGeofenceCommandHandler : IRequestHandler<UpdateChhavaniGeofenceCommand, ApiResponse<ChhavaniDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    public UpdateChhavaniGeofenceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ChhavaniDto>> Handle(UpdateChhavaniGeofenceCommand request, CancellationToken cancellationToken)
    {
        var chhavani = await _context.Chhavanis
            .Include(c => c.Operators)
            .FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);

        if (chhavani == null)
        {
            throw new NotFoundException(nameof(Domain.Entities.Chhavani), request.ChhavaniId);
        }

        var coords = request.GeofenceCoordinates
            .Select(c => new Coordinate(c.Longitude, c.Latitude))
            .ToList();

        // Ensure closed ring
        if (coords.First() != coords.Last())
        {
            coords.Add(coords.First());
        }

        var polygon = _geometryFactory.CreatePolygon(coords.ToArray());
        chhavani.GeofenceBoundary = polygon;
        chhavani.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new ChhavaniDto
        {
            Id = chhavani.Id,
            CampCode = chhavani.CampCode,
            Name = chhavani.Name,
            Address = chhavani.Address,
            Village = chhavani.Village,
            Taluka = chhavani.Taluka,
            District = chhavani.District,
            State = chhavani.State,
            TotalCapacity = chhavani.TotalCapacity,
            ActiveAnimalCount = chhavani.ActiveAnimalCount,
            Status = chhavani.Status.ToString(),
            Location = chhavani.Location != null ? new GeoCoordinateDto(chhavani.Location.Y, chhavani.Location.X) : null,
            GeofenceCoordinates = polygon.Coordinates.Select(c => new GeoCoordinateDto(c.Y, c.X)).ToList(),
            Operators = chhavani.Operators.Select(o => new OperatorDto
            {
                Id = o.Id,
                Name = o.Name,
                MobileNumber = o.MobileNumber,
                IsActive = o.IsActive
            }).ToList()
        };

        return ApiResponse<ChhavaniDto>.Ok(dto, "Camp geofence updated successfully.");
    }
}
