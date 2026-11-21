using FluentAssertions;
using Xunit;
using CharaChhavani.Application.Officer.Commands;
using CharaChhavani.Application.Officer.DTOs;
using CharaChhavani.Domain.Entities;
using NetTopologySuite.Geometries;

namespace CharaChhavani.UnitTests;

public class OfficerInspectionTests
{
    [Fact]
    public void CampInspection_WhenHeadcountMatches_DiscrepancyShouldBeZeroAndFalse()
    {
        // Arrange
        var camp = new Chhavani
        {
            Id = 1,
            CampCode = "CHV-2026-TEST",
            ActiveAnimalCount = 200,
            TotalCapacity = 500
        };

        int physicalCount = 200;
        int systemCount = camp.ActiveAnimalCount;
        int discrepancy = physicalCount - systemCount;
        bool detected = discrepancy != 0;

        // Assert
        discrepancy.Should().Be(0);
        detected.Should().BeFalse();
    }

    [Fact]
    public void CampInspection_WhenPhysicalCountDeficient_DiscrepancyShouldBeNegativeAndFlagged()
    {
        // Arrange
        var camp = new Chhavani
        {
            Id = 2,
            CampCode = "CHV-2026-SHORT",
            ActiveAnimalCount = 350,
            TotalCapacity = 500
        };

        int physicalCount = 310; // 40 animals missing
        int systemCount = camp.ActiveAnimalCount;
        int discrepancy = physicalCount - systemCount;
        bool detected = discrepancy != 0;

        // Assert
        discrepancy.Should().Be(-40);
        detected.Should().BeTrue();
    }

    [Fact]
    public void CampInspection_InspectorLocation_ShouldPreserveSpatialPoint()
    {
        // Arrange
        double lat = 19.8762;
        double lng = 75.3433;
        var inspectorPoint = new Point(lng, lat) { SRID = 4326 };

        var inspection = new CampInspection
        {
            ChhavaniId = 1,
            OfficerId = "OFF-001",
            OfficerName = "Tahasildar Patil",
            InspectorLocation = inspectorPoint,
            PhysicalAnimalCount = 100,
            SystemAnimalCount = 100
        };

        // Assert
        inspection.InspectorLocation.Should().NotBeNull();
        inspection.InspectorLocation!.X.Should().Be(lng);
        inspection.InspectorLocation!.Y.Should().Be(lat);
        inspection.InspectorLocation!.SRID.Should().Be(4326);
    }

    [Theory]
    [InlineData("Adequate", true)]
    [InlineData("Scarce", true)]
    [InlineData("Critical", true)]
    [InlineData("Abundant", false)] // Invalid according to business rules
    public void RecordCampInspectionValidator_WaterAvailability_ValidatesCorrectly(string status, bool isValid)
    {
        var validator = new RecordCampInspectionCommandValidator();
        var command = new RecordCampInspectionCommand
        {
            ChhavaniId = 1,
            OfficerId = "OFF-001",
            OfficerName = "Inspector Jadhav",
            Latitude = 19.0,
            Longitude = 75.0,
            PhysicalAnimalCount = 150,
            WaterAvailability = status,
            FodderStockCondition = "Satisfactory",
            CleanlinessScore = 4
        };

        var result = validator.Validate(command);
        result.IsValid.Should().Be(isValid);
    }

    [Theory]
    [InlineData(0, false)] // Cleanliness score < 1 invalid
    [InlineData(1, true)]
    [InlineData(5, true)]
    [InlineData(6, false)] // Cleanliness score > 5 invalid
    public void RecordCampInspectionValidator_CleanlinessScore_ValidatesRange(int score, bool isValid)
    {
        var validator = new RecordCampInspectionCommandValidator();
        var command = new RecordCampInspectionCommand
        {
            ChhavaniId = 1,
            OfficerId = "OFF-001",
            OfficerName = "Inspector Jadhav",
            Latitude = 19.0,
            Longitude = 75.0,
            PhysicalAnimalCount = 150,
            WaterAvailability = "Adequate",
            FodderStockCondition = "Satisfactory",
            CleanlinessScore = score
        };

        var result = validator.Validate(command);
        result.IsValid.Should().Be(isValid);
    }
}
