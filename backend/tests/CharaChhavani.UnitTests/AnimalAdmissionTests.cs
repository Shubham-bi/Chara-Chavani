using FluentAssertions;
using NetTopologySuite.Geometries;
using Xunit;
using CharaChhavani.Application.Admissions.Commands;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.UnitTests;

public class AnimalAdmissionTests
{
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    [Fact]
    public void AdmitAnimalValidator_WhenPhotoUrlMissing_ShouldFailValidation()
    {
        // Arrange
        var validator = new AdmitAnimalValidator();
        var command = new AdmitAnimalCommand
        {
            AnimalId = 1,
            ChhavaniId = 1,
            OperatorId = "OP-001",
            PhotoUrl = "", // Empty photo URL
            DeviceLatitude = 18.5204,
            DeviceLongitude = 73.8567
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "PhotoUrl");
    }

    [Fact]
    public void AdmitAnimalValidator_WhenInvalidCoordinates_ShouldFailValidation()
    {
        // Arrange
        var validator = new AdmitAnimalValidator();
        var command = new AdmitAnimalCommand
        {
            AnimalId = 1,
            ChhavaniId = 1,
            OperatorId = "OP-001",
            PhotoUrl = "https://storage.example.com/admission_photo.jpg",
            DeviceLatitude = 95.0, // Invalid latitude (> 90)
            DeviceLongitude = 73.8567
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "DeviceLatitude");
    }

    [Fact]
    public void Admission_GeofenceCheck_PointOutsideCamp_ShouldReject()
    {
        // Arrange - Camp polygon in Baramati
        var campCoords = new[]
        {
            new Coordinate(74.57, 18.14),
            new Coordinate(74.60, 18.14),
            new Coordinate(74.60, 18.17),
            new Coordinate(74.57, 18.17),
            new Coordinate(74.57, 18.14)
        };
        var campPolygon = _geometryFactory.CreatePolygon(campCoords);

        var camp = new Chhavani
        {
            TotalCapacity = 500,
            ActiveAnimalCount = 10,
            GeofenceBoundary = campPolygon
        };

        // Device location 10 km outside the camp (74.70, 18.25)
        var outsidePoint = _geometryFactory.CreatePoint(new Coordinate(74.70, 18.25));

        // Act & Assert
        camp.IsPointInsideGeofence(outsidePoint).Should().BeFalse();
    }

    [Fact]
    public void Admission_GeofenceCheck_PointInsideCamp_ShouldAccept()
    {
        // Arrange - Camp polygon in Baramati
        var campCoords = new[]
        {
            new Coordinate(74.57, 18.14),
            new Coordinate(74.60, 18.14),
            new Coordinate(74.60, 18.17),
            new Coordinate(74.57, 18.17),
            new Coordinate(74.57, 18.14)
        };
        var campPolygon = _geometryFactory.CreatePolygon(campCoords);

        var camp = new Chhavani
        {
            TotalCapacity = 500,
            ActiveAnimalCount = 10,
            GeofenceBoundary = campPolygon
        };

        // Device location inside the camp (74.585, 18.155)
        var insidePoint = _geometryFactory.CreatePoint(new Coordinate(74.585, 18.155));

        // Act & Assert
        camp.IsPointInsideGeofence(insidePoint).Should().BeTrue();
    }

    [Fact]
    public void Admission_StateTransition_ShouldUpdateAnimalAndCampCapacity()
    {
        // Arrange
        var camp = new Chhavani
        {
            Id = 5,
            TotalCapacity = 100,
            ActiveAnimalCount = 50
        };

        var animal = new Animal
        {
            Id = 10,
            VerificationStatus = VerificationStatus.Approved,
            CurrentStatus = AnimalStatus.Verified
        };

        // Act (Simulating Admission state change)
        animal.CurrentStatus = AnimalStatus.Admitted;
        animal.CurrentChhavaniId = camp.Id;
        camp.ActiveAnimalCount += 1;

        // Assert
        animal.CurrentStatus.Should().Be(AnimalStatus.Admitted);
        animal.CurrentChhavaniId.Should().Be(5);
        camp.ActiveAnimalCount.Should().Be(51);

        // Act (Simulating Release)
        animal.CurrentStatus = AnimalStatus.Released;
        animal.CurrentChhavaniId = null;
        camp.ActiveAnimalCount -= 1;

        // Assert
        animal.CurrentStatus.Should().Be(AnimalStatus.Released);
        animal.CurrentChhavaniId.Should().BeNull();
        camp.ActiveAnimalCount.Should().Be(50);
    }
}
