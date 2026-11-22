using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.Application.Admin.Queries;

public record GetGeographicDistributionQuery : IRequest<ApiResponse<GeographicDistributionDto>>
{
    public string? District { get; init; }
    public string? Taluka { get; init; }
    public string? Metric { get; init; } = "camps"; // camps | animals | utilization
}

public class GetGeographicDistributionQueryHandler : IRequestHandler<GetGeographicDistributionQuery, ApiResponse<GeographicDistributionDto>>
{
    private readonly IApplicationDbContext _context;

    // Standard baseline Maharashtra drought-prone districts
    private static readonly string[] MaharashtraDistricts = new[]
    {
        "Chhatrapati Sambhajinagar",
        "Jalna",
        "Beed",
        "Dharashiv",
        "Solapur",
        "Ahmednagar",
        "Parbhani",
        "Latur",
        "Nanded",
        "Hingoli"
    };

    public GetGeographicDistributionQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<GeographicDistributionDto>> Handle(GetGeographicDistributionQuery request, CancellationToken cancellationToken)
    {
        var metric = string.IsNullOrWhiteSpace(request.Metric) ? "camps" : request.Metric.ToLower();
        var campsQuery = _context.Chhavanis.Where(c => !c.IsDeleted).AsNoTracking();

        if (string.IsNullOrWhiteSpace(request.District))
        {
            // Level 1: State View -> Group by District
            var activeCamps = await campsQuery.ToListAsync(cancellationToken);
            var farmers = await _context.Farmers.Where(f => !f.IsDeleted).AsNoTracking().ToListAsync(cancellationToken);
            var animals = await _context.Animals.Where(a => !a.IsDeleted).AsNoTracking().ToListAsync(cancellationToken);

            var items = new List<GeographicAreaItemDto>();

            foreach (var dist in MaharashtraDistricts)
            {
                var distCamps = activeCamps.Where(c => string.Equals(c.District, dist, StringComparison.OrdinalIgnoreCase)).ToList();
                var distFarmers = farmers.Count(f => string.Equals(f.District, dist, StringComparison.OrdinalIgnoreCase));
                var distAnimals = animals.Count(a => string.Equals(a.Farmer?.District, dist, StringComparison.OrdinalIgnoreCase));
                var totalCap = distCamps.Sum(c => c.TotalCapacity);
                var admitted = distCamps.Sum(c => c.ActiveAnimalCount);
                var util = totalCap > 0 ? Math.Round((decimal)admitted / totalCap * 100m, 1) : 0m;

                var color = ResolveColorGrade(metric, distCamps.Count, admitted, util);

                items.Add(new GeographicAreaItemDto
                {
                    Id = dist.Replace(" ", "-").ToLower(),
                    Name = dist,
                    Parent = "Maharashtra",
                    CampCount = distCamps.Count,
                    FarmerCount = distFarmers,
                    AnimalCount = distAnimals,
                    AdmittedCattle = admitted,
                    TotalCapacity = totalCap,
                    UtilizationPercentage = util,
                    ColorGrade = color,
                    HasCamps = distCamps.Count > 0,
                    Latitude = GetApproximateDistrictLatitude(dist),
                    Longitude = GetApproximateDistrictLongitude(dist)
                });
            }

            return ApiResponse<GeographicDistributionDto>.Ok(new GeographicDistributionDto
            {
                Level = "State",
                SelectedArea = "Maharashtra",
                Metric = metric,
                Items = items
            });
        }
        else if (string.IsNullOrWhiteSpace(request.Taluka))
        {
            // Level 2: District View -> Group by Taluka
            var distCamps = await campsQuery
                .Where(c => c.District.ToLower() == request.District.ToLower())
                .ToListAsync(cancellationToken);

            var talukaGroups = distCamps
                .GroupBy(c => c.Taluka)
                .Select(g =>
                {
                    var campCount = g.Count();
                    var totalCap = g.Sum(c => c.TotalCapacity);
                    var admitted = g.Sum(c => c.ActiveAnimalCount);
                    var util = totalCap > 0 ? Math.Round((decimal)admitted / totalCap * 100m, 1) : 0m;
                    return new GeographicAreaItemDto
                    {
                        Id = g.Key.Replace(" ", "-").ToLower(),
                        Name = g.Key,
                        Parent = request.District,
                        CampCount = campCount,
                        AdmittedCattle = admitted,
                        TotalCapacity = totalCap,
                        UtilizationPercentage = util,
                        ColorGrade = ResolveColorGrade(metric, campCount, admitted, util),
                        HasCamps = true
                    };
                })
                .ToList();

            if (!talukaGroups.Any())
            {
                talukaGroups.Add(new GeographicAreaItemDto
                {
                    Id = "default-taluka",
                    Name = $"{request.District} Central",
                    Parent = request.District,
                    CampCount = 0,
                    ColorGrade = "Light grey",
                    HasCamps = false
                });
            }

            return ApiResponse<GeographicDistributionDto>.Ok(new GeographicDistributionDto
            {
                Level = "District",
                SelectedArea = request.District,
                Metric = metric,
                Items = talukaGroups
            });
        }
        else
        {
            // Level 3: Taluka View -> Group by Village
            var talukaCamps = await campsQuery
                .Where(c => c.District.ToLower() == request.District.ToLower() && c.Taluka.ToLower() == request.Taluka.ToLower())
                .ToListAsync(cancellationToken);

            var villageGroups = talukaCamps
                .GroupBy(c => c.Village)
                .Select(g =>
                {
                    var campCount = g.Count();
                    var totalCap = g.Sum(c => c.TotalCapacity);
                    var admitted = g.Sum(c => c.ActiveAnimalCount);
                    var util = totalCap > 0 ? Math.Round((decimal)admitted / totalCap * 100m, 1) : 0m;
                    return new GeographicAreaItemDto
                    {
                        Id = g.Key.Replace(" ", "-").ToLower(),
                        Name = g.Key,
                        Parent = request.Taluka,
                        CampCount = campCount,
                        AdmittedCattle = admitted,
                        TotalCapacity = totalCap,
                        UtilizationPercentage = util,
                        ColorGrade = ResolveColorGrade(metric, campCount, admitted, util),
                        HasCamps = true
                    };
                })
                .ToList();

            return ApiResponse<GeographicDistributionDto>.Ok(new GeographicDistributionDto
            {
                Level = "Taluka",
                SelectedArea = $"{request.Taluka}, {request.District}",
                Metric = metric,
                Items = villageGroups
            });
        }
    }

    private static string ResolveColorGrade(string metric, int campCount, int admitted, decimal util)
    {
        switch (metric)
        {
            case "animals":
                if (admitted == 0) return "Light grey";
                if (admitted <= 500) return "Very light blue";
                if (admitted <= 1500) return "Light blue";
                if (admitted <= 3000) return "Medium blue";
                return "Dark blue";

            case "utilization":
                if (util == 0) return "Light grey";
                if (util <= 40) return "Light green";
                if (util <= 75) return "Medium blue";
                if (util <= 90) return "Orange";
                return "Deep red";

            case "camps":
            default:
                if (campCount == 0) return "Light grey";
                if (campCount <= 5) return "Very light blue";
                if (campCount <= 10) return "Light blue";
                if (campCount <= 20) return "Medium blue";
                if (campCount <= 50) return "Dark blue";
                return "Deep blue";
        }
    }

    private static double GetApproximateDistrictLatitude(string district) => district switch
    {
        "Chhatrapati Sambhajinagar" => 19.8762,
        "Jalna" => 19.8410,
        "Beed" => 18.9891,
        "Dharashiv" => 18.1856,
        "Solapur" => 17.6599,
        "Ahmednagar" => 19.0948,
        "Parbhani" => 19.2644,
        "Latur" => 18.4088,
        "Nanded" => 19.1383,
        "Hingoli" => 19.7196,
        _ => 19.7515
    };

    private static double GetApproximateDistrictLongitude(string district) => district switch
    {
        "Chhatrapati Sambhajinagar" => 75.3433,
        "Jalna" => 75.8864,
        "Beed" => 75.7601,
        "Dharashiv" => 76.0418,
        "Solapur" => 75.9064,
        "Ahmednagar" => 74.7480,
        "Parbhani" => 76.7749,
        "Latur" => 76.5604,
        "Nanded" => 77.3210,
        "Hingoli" => 77.1477,
        _ => 75.7139
    };
}
