using FluentAssertions;
using NetTopologySuite.Geometries;
using Xunit;
using CharaChhavani.Application.Chhavanis.Commands;
using CharaChhavani.Application.Chhavanis.DTOs;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.UnitTests;

public class ChhavaniManagementTests
{
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    [Fact]
    public void Validator_WhenMobileNumberIsInvalid_ShouldFailValidation()
    {
        // Arrange
        var validator = new CreateChhavaniValidator();
        var command = new CreateChhavaniCommand
        {
            Name = "Shirur Chhavani",
            Village = "Shirur",
            Taluka = "Shirur",
            District = "Pune",
            TotalCapacity = 500,
            OperatorName = "Ramesh Patil",
            OperatorMobile = "12345" // Invalid
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "OperatorMobile");
    }

    [Fact]
    public void Validator_WhenMobileNumberIsValidIndianPhone_ShouldPassValidation()
    {
        // Arrange
        var validator = new CreateChhavaniValidator();
        var command = new CreateChhavaniCommand
        {
            Name = "Shirur Chhavani",
            Village = "Shirur",
            Taluka = "Shirur",
            District = "Pune",
            TotalCapacity = 500,
            OperatorName = "Ramesh Patil",
            OperatorMobile = "9876543210" // Valid
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validator_WhenPolygonHasLessThan3Points_ShouldFail()
    {
        // Arrange
        var validator = new CreateChhavaniValidator();
        var command = new CreateChhavaniCommand
        {
            Name = "Shirur Chhavani",
            Village = "Shirur",
            Taluka = "Shirur",
            District = "Pune",
            TotalCapacity = 500,
            OperatorName = "Ramesh Patil",
            OperatorMobile = "9876543210",
            GeofenceCoordinates = new List<GeoCoordinateDto>
            {
                new(18.5204, 73.8567),
                new(18.5250, 73.8600)
            } // Only 2 coordinates - invalid for polygon
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "GeofenceCoordinates");
    }

    [Fact]
    public void Geofence_PointContainment_ShouldAccuratelyIdentifyPoints()
    {
        // Define a triangular camp geofence in Pune region
        var coords = new[]
        {
            new Coordinate(73.80, 18.50),
            new Coordinate(73.90, 18.50),
            new Coordinate(73.85, 18.60),
            new Coordinate(73.80, 18.50) // Closed ring
        };
        var polygon = _geometryFactory.CreatePolygon(coords);

        var camp = new Chhavani
        {
            CampCode = "CMP-PUN-20261122-1001",
            Name = "Pune Central Chhavani",
            TotalCapacity = 1000,
            GeofenceBoundary = polygon
        };

        // Point inside the triangle
        var insidePoint = _geometryFactory.CreatePoint(new Coordinate(73.85, 18.53));
        // Point outside the triangle
        var outsidePoint = _geometryFactory.CreatePoint(new Coordinate(73.95, 18.55));

        // Act & Assert
        camp.IsPointInsideGeofence(insidePoint).Should().BeTrue();
        camp.IsPointInsideGeofence(outsidePoint).Should().BeFalse();
    }
}
