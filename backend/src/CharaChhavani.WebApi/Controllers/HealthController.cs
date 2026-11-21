using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.WebApi.Controllers;

public class HealthController : BaseApiController
{
    [HttpGet]
    public ActionResult<ApiResponse<object>> GetHealth()
    {
        var healthData = new
        {
            Status = "Healthy",
            Service = "Chara Chhavani Management System API",
            Version = "1.0.0",
            ServerTimeUtc = DateTime.UtcNow
        };

        return HandleResult<object>(healthData, "System is operating normally.");
    }

    [HttpPost("verify-geofence")]
    public ActionResult<ApiResponse<object>> VerifyGeofence([FromBody] GeofenceCheckRequest request)
    {
        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        // Construct polygon coordinates from input
        if (request.PolygonCoordinates == null || request.PolygonCoordinates.Count < 3)
        {
            return BadRequest(ApiResponse<object>.Failure("At least 3 coordinates are required to form a closed geofence."));
        }

        var coords = request.PolygonCoordinates
            .Select(c => new Coordinate(c.Longitude, c.Latitude))
            .ToList();

        // Ensure closed ring
        if (coords.First() != coords.Last())
        {
            coords.Add(coords.First());
        }

        var polygon = geometryFactory.CreatePolygon(coords.ToArray());
        var testPoint = geometryFactory.CreatePoint(new Coordinate(request.PointLongitude, request.PointLatitude));

        var isInside = polygon.Contains(testPoint);

        var result = new
        {
            IsInsideGeofence = isInside,
            DistanceToBoundaryMeters = polygon.Distance(testPoint) * 111320, // Approximate conversion from degrees to meters
            EvaluatedPoint = new { request.PointLatitude, request.PointLongitude }
        };

        return HandleResult<object>(result, isInside ? "Point is inside the camp geofence." : "Point is OUTSIDE the camp geofence.");
    }
}

public class GeofenceCheckRequest
{
    public List<CoordinateDto> PolygonCoordinates { get; set; } = new();
    public double PointLatitude { get; set; }
    public double PointLongitude { get; set; }
}

public class CoordinateDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
