using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Chhavanis.Commands;

public record CreateChhavaniCommand : IRequest<ApiResponse<ChhavaniDto>>
{
    public string Name { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public string Village { get; init; } = string.Empty;
    public string Taluka { get; init; } = string.Empty;
    public string District { get; init; } = string.Empty;
    public string State { get; init; } = "Maharashtra";
    public int TotalCapacity { get; init; }
    public string OperatorName { get; init; } = string.Empty;
    public string OperatorMobile { get; init; } = string.Empty;
    public double? EntranceLatitude { get; init; }
    public double? EntranceLongitude { get; init; }
    public List<GeoCoordinateDto>? GeofenceCoordinates { get; init; }
}

public class CreateChhavaniValidator : AbstractValidator<CreateChhavaniCommand>
{
    public CreateChhavaniValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Village).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Taluka).NotEmpty().MaximumLength(100);
        RuleFor(x => x.District).NotEmpty().MaximumLength(100);
        RuleFor(x => x.TotalCapacity).GreaterThan(0).WithMessage("Total capacity must be greater than zero.");
        RuleFor(x => x.OperatorName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.OperatorMobile).NotEmpty().Matches(@"^[6-9]\d{9}$")
            .WithMessage("Operator mobile number must be a valid 10-digit Indian phone number.");

        When(x => x.GeofenceCoordinates != null && x.GeofenceCoordinates.Any(), () =>
        {
            RuleFor(x => x.GeofenceCoordinates)
                .Must(coords => coords!.Count >= 3)
                .WithMessage("Geofence polygon must contain at least 3 distinct coordinates.");
        });
    }
}

public class CreateChhavaniCommandHandler : IRequestHandler<CreateChhavaniCommand, ApiResponse<ChhavaniDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    public CreateChhavaniCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ChhavaniDto>> Handle(CreateChhavaniCommand request, CancellationToken cancellationToken)
    {
        // Generate unique CampCode: CMP-<DISTRICT_PREFIX>-YYYYMMDD-XXXX
        var districtPrefix = request.District.Length >= 3 ? request.District[..3].ToUpper() : "CMP";
        var dateStamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var randomSuffix = new Random().Next(1000, 9999);
        var campCode = $"CMP-{districtPrefix}-{dateStamp}-{randomSuffix}";

        // Construct Geofence Polygon if coordinates provided
        Polygon? polygon = null;
        if (request.GeofenceCoordinates != null && request.GeofenceCoordinates.Count >= 3)
        {
            var coords = request.GeofenceCoordinates
                .Select(c => new Coordinate(c.Longitude, c.Latitude))
                .ToList();

            if (coords.First() != coords.Last())
            {
                coords.Add(coords.First()); // Close the ring
            }
            polygon = _geometryFactory.CreatePolygon(coords.ToArray());
        }

        // Entrance Point
        Point? entrancePoint = null;
        if (request.EntranceLatitude.HasValue && request.EntranceLongitude.HasValue)
        {
            entrancePoint = _geometryFactory.CreatePoint(
                new Coordinate(request.EntranceLongitude.Value, request.EntranceLatitude.Value));
        }

        var chhavani = new Chhavani
        {
            CampCode = campCode,
            Name = request.Name,
            Address = request.Address,
            Village = request.Village,
            Taluka = request.Taluka,
            District = request.District,
            State = request.State,
            TotalCapacity = request.TotalCapacity,
            ActiveAnimalCount = 0,
            Status = CampStatus.Active,
            GeofenceBoundary = polygon,
            Location = entrancePoint
        };

        var chhavaniOperator = new ChhavaniOperator
        {
            Name = request.OperatorName,
            MobileNumber = request.OperatorMobile,
            Address = request.Address,
            IsActive = true
        };

        chhavani.Operators.Add(chhavaniOperator);

        _context.Chhavanis.Add(chhavani);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = MapToDto(chhavani);
        return ApiResponse<ChhavaniDto>.Ok(dto, "Chara Chhavani registered successfully.");
    }

    private static ChhavaniDto MapToDto(Chhavani c)
    {
        var dto = new ChhavaniDto
        {
            Id = c.Id,
            CampCode = c.CampCode,
            Name = c.Name,
            Address = c.Address,
            Village = c.Village,
            Taluka = c.Taluka,
            District = c.District,
            State = c.State,
            TotalCapacity = c.TotalCapacity,
            ActiveAnimalCount = c.ActiveAnimalCount,
            Status = c.Status.ToString(),
            Location = c.Location != null ? new GeoCoordinateDto(c.Location.Y, c.Location.X) : null,
            Operators = c.Operators.Select(o => new OperatorDto
            {
                Id = o.Id,
                Name = o.Name,
                MobileNumber = o.MobileNumber,
                IsActive = o.IsActive
            }).ToList()
        };

        if (c.GeofenceBoundary != null)
        {
            dto.GeofenceCoordinates = c.GeofenceBoundary.Coordinates
                .Select(coord => new GeoCoordinateDto(coord.Y, coord.X))
                .ToList();
        }

        return dto;
    }
}
