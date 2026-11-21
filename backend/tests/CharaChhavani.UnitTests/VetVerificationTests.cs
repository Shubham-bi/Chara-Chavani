using FluentAssertions;
using NetTopologySuite.Geometries;
using Xunit;
using CharaChhavani.Application.Vet.Commands;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.UnitTests;

public class VetVerificationTests
{
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    [Fact]
    public void SubmitVerificationValidator_WhenRejectedWithoutRemarks_ShouldFailValidation()
    {
        // Arrange
        var validator = new SubmitVerificationValidator();
        var command = new SubmitVerificationCommand
        {
            AnimalId = 1,
            DoctorId = "DOC-MH-001",
            Result = VerificationStatus.Rejected,
            Remarks = null // Missing required rejection reason
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Remarks");
    }

    [Fact]
    public void SubmitVerificationValidator_WhenRejectedWithRemarks_ShouldPassValidation()
    {
        // Arrange
        var validator = new SubmitVerificationValidator();
        var command = new SubmitVerificationCommand
        {
            AnimalId = 1,
            DoctorId = "DOC-MH-001",
            Result = VerificationStatus.Rejected,
            Remarks = "Age does not match teeth inspection; animal is overage."
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void SubmitVerificationValidator_WhenApprovedWithoutRemarks_ShouldPassValidation()
    {
        // Arrange
        var validator = new SubmitVerificationValidator();
        var command = new SubmitVerificationCommand
        {
            AnimalId = 1,
            DoctorId = "DOC-MH-001",
            Result = VerificationStatus.Approved,
            Remarks = null // Optional when approved
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void SubmitVerificationValidator_WhenResultIsInvalid_ShouldFailValidation()
    {
        // Arrange
        var validator = new SubmitVerificationValidator();
        var command = new SubmitVerificationCommand
        {
            AnimalId = 1,
            DoctorId = "DOC-MH-001",
            Result = VerificationStatus.Pending // Invalid verification decision
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Result");
    }

    [Fact]
    public void VetVerification_ShouldStoreInspectionGPSPoint()
    {
        // Arrange - Farmer's location GPS in Pune district
        const double farmerLat = 18.5204;
        const double farmerLng = 73.8567;
        var inspectionPoint = _geometryFactory.CreatePoint(new Coordinate(farmerLng, farmerLat));

        var verification = new VetVerification
        {
            AnimalId = 101,
            DoctorId = "DOC-MH-PUNE-01",
            Result = VerificationStatus.Approved,
            InspectionLocation = inspectionPoint,
            Remarks = "Physical health verified; breed confirmed Gir."
        };

        // Assert
        verification.InspectionLocation.Should().NotBeNull();
        verification.InspectionLocation!.Y.Should().Be(farmerLat);
        verification.InspectionLocation!.X.Should().Be(farmerLng);
        verification.Result.Should().Be(VerificationStatus.Approved);
    }
}
