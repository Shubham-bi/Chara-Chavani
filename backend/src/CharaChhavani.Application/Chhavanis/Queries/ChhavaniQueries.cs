using MediatR;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Chhavanis.Queries;

// 1. Get By Id
public record GetChhavaniByIdQuery(long Id) : IRequest<ApiResponse<ChhavaniDto>>;

public class GetChhavaniByIdQueryHandler : IRequestHandler<GetChhavaniByIdQuery, ApiResponse<ChhavaniDto>>
{
    private readonly IApplicationDbContext _context;

    public GetChhavaniByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ChhavaniDto>> Handle(GetChhavaniByIdQuery request, CancellationToken cancellationToken)
    {
        var c = await _context.Chhavanis
            .Include(x => x.Operators)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (c == null)
        {
            throw new NotFoundException(nameof(Domain.Entities.Chhavani), request.Id);
        }

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

        return ApiResponse<ChhavaniDto>.Ok(dto);
    }
}

// 2. List Camps Query with Filters
public record GetChhavanisQuery : IRequest<ApiResponse<List<ChhavaniDto>>>
{
    public string? District { get; init; }
    public string? Taluka { get; init; }
    public CampStatus? Status { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 50;
}

public class GetChhavanisQueryHandler : IRequestHandler<GetChhavanisQuery, ApiResponse<List<ChhavaniDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetChhavanisQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<ChhavaniDto>>> Handle(GetChhavanisQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Chhavanis
            .Include(c => c.Operators)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.District))
            query = query.Where(c => c.District == request.District);

        if (!string.IsNullOrWhiteSpace(request.Taluka))
            query = query.Where(c => c.Taluka == request.Taluka);

        if (request.Status.HasValue)
            query = query.Where(c => c.Status == request.Status.Value);

        var camps = await query
            .OrderByDescending(c => c.CreatedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = camps.Select(c => new ChhavaniDto
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
            }).ToList(),
            GeofenceCoordinates = c.GeofenceBoundary != null
                ? c.GeofenceBoundary.Coordinates.Select(coord => new GeoCoordinateDto(coord.Y, coord.X)).ToList()
                : new List<GeoCoordinateDto>()
        }).ToList();

        return ApiResponse<List<ChhavaniDto>>.Ok(dtos, $"Retrieved {dtos.Count} camps.");
    }
}

// 3. Validate Point Query
public record ValidateCampGeofenceQuery(long ChhavaniId, double Latitude, double Longitude)
    : IRequest<ApiResponse<GeofenceValidationResultDto>>;

public class ValidateCampGeofenceQueryHandler : IRequestHandler<ValidateCampGeofenceQuery, ApiResponse<GeofenceValidationResultDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    public ValidateCampGeofenceQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<GeofenceValidationResultDto>> Handle(ValidateCampGeofenceQuery request, CancellationToken cancellationToken)
    {
        var chhavani = await _context.Chhavanis
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);

        if (chhavani == null)
        {
            throw new NotFoundException(nameof(Domain.Entities.Chhavani), request.ChhavaniId);
        }

        if (chhavani.GeofenceBoundary == null)
        {
            return ApiResponse<GeofenceValidationResultDto>.Failure(
                "Camp does not have a registered geofence boundary.",
                traceId: ""
            );
        }

        var checkPoint = _geometryFactory.CreatePoint(new Coordinate(request.Longitude, request.Latitude));
        var isInside = chhavani.IsPointInsideGeofence(checkPoint);

        var result = new GeofenceValidationResultDto
        {
            ChhavaniId = chhavani.Id,
            CampCode = chhavani.CampCode,
            IsInsideGeofence = isInside,
            LatitudeEvaluated = request.Latitude,
            LongitudeEvaluated = request.Longitude,
            Message = isInside
                ? "Coordinates are within the registered Chara Chhavani geofence."
                : "Coordinates are OUTSIDE the registered Chara Chhavani geofence."
        };

        return ApiResponse<GeofenceValidationResultDto>.Ok(result);
    }
}
