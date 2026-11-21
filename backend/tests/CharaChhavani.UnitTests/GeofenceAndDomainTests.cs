using FluentAssertions;
using NetTopologySuite.Geometries;
using Xunit;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.UnitTests;

public class GeofenceAndDomainTests
{
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    [Fact]
    public void PointInsideCampPolygon_ShouldReturnTrue()
    {
        // Arrange - Create a square geofence polygon (Coordinates: (0,0), (0,10), (10,10), (10,0), (0,0))
        var polygonCoords = new[]
        {
            new Coordinate(74.00, 18.00),
            new Coordinate(74.00, 18.10),
            new Coordinate(74.10, 18.10),
            new Coordinate(74.10, 18.00),
            new Coordinate(74.00, 18.00) // Closing the ring
        };
        var campPolygon = _geometryFactory.CreatePolygon(polygonCoords);

        var camp = new Chhavani
        {
            CampCode = "CMP-PUNE-01",
            Name = "Baramati Chara Chhavani",
            TotalCapacity = 500,
            ActiveAnimalCount = 100,
            GeofenceBoundary = campPolygon
        };

        // Coordinate inside the camp (74.05, 18.05)
        var insidePoint = _geometryFactory.CreatePoint(new Coordinate(74.05, 18.05));

        // Act
        var isInside = camp.IsPointInsideGeofence(insidePoint);

        // Assert
        isInside.Should().BeTrue();
    }

    [Fact]
    public void PointOutsideCampPolygon_ShouldReturnFalse()
    {
        // Arrange
        var polygonCoords = new[]
        {
            new Coordinate(74.00, 18.00),
            new Coordinate(74.00, 18.10),
            new Coordinate(74.10, 18.10),
            new Coordinate(74.10, 18.00),
            new Coordinate(74.00, 18.00)
        };
        var campPolygon = _geometryFactory.CreatePolygon(polygonCoords);

        var camp = new Chhavani
        {
            CampCode = "CMP-PUNE-01",
            Name = "Baramati Chara Chhavani",
            TotalCapacity = 500,
            ActiveAnimalCount = 100,
            GeofenceBoundary = campPolygon
        };

        // Coordinate far outside the camp (75.00, 19.00)
        var outsidePoint = _geometryFactory.CreatePoint(new Coordinate(75.00, 19.00));

        // Act
        var isInside = camp.IsPointInsideGeofence(outsidePoint);

        // Assert
        isInside.Should().BeFalse();
    }

    [Fact]
    public void HasAvailableCapacity_WhenActiveLessThanTotal_ShouldReturnTrue()
    {
        // Arrange
        var camp = new Chhavani
        {
            TotalCapacity = 500,
            ActiveAnimalCount = 499
        };

        // Act & Assert
        camp.HasAvailableCapacity().Should().BeTrue();
    }

    [Fact]
    public void HasAvailableCapacity_WhenActiveEqualsTotal_ShouldReturnFalse()
    {
        // Arrange
        var camp = new Chhavani
        {
            TotalCapacity = 500,
            ActiveAnimalCount = 500
        };

        // Act & Assert
        camp.HasAvailableCapacity().Should().BeFalse();
    }

    [Fact]
    public void ApiResponse_Ok_ShouldHaveCorrectContract()
    {
        // Arrange & Act
        var response = ApiResponse<string>.Ok("TestData", "Operation Successful", "trace-123");

        // Assert
        response.Success.Should().BeTrue();
        response.Message.Should().Be("Operation Successful");
        response.Data.Should().Be("TestData");
        response.TraceId.Should().Be("trace-123");
        response.Errors.Should().BeNull();
    }
}
