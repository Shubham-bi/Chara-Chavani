using FluentAssertions;
using Xunit;
using CharaChhavani.Application.Animals.Commands;
using CharaChhavani.Application.Farmers.Commands;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.UnitTests;

public class FarmerAnimalTests
{
    [Fact]
    public void RegisterAnimalValidator_WhenPhotoUrlMissing_ShouldFailValidation()
    {
        // Arrange
        var validator = new RegisterAnimalValidator();
        var command = new RegisterAnimalCommand
        {
            FarmerId = 1,
            AnimalType = AnimalType.Cow,
            Breed = "Gir",
            Gender = Gender.Female,
            AgeInMonths = 24,
            PhotoUrl = null // Missing
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "PhotoUrl");
    }

    [Fact]
    public void RegisterAnimalValidator_WhenAgeIsZeroOrNegative_ShouldFailValidation()
    {
        // Arrange
        var validator = new RegisterAnimalValidator();
        var command = new RegisterAnimalCommand
        {
            FarmerId = 1,
            AnimalType = AnimalType.Buffalo,
            Breed = "Murrah",
            Gender = Gender.Female,
            AgeInMonths = 0, // Invalid
            PhotoUrl = "https://storage.example.com/animals/photo1.jpg"
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "AgeInMonths");
    }

    [Fact]
    public void RegisterAnimalValidator_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var validator = new RegisterAnimalValidator();
        var command = new RegisterAnimalCommand
        {
            FarmerId = 1,
            AnimalType = AnimalType.Cow,
            Breed = "Khillari",
            Gender = Gender.Male,
            AgeInMonths = 36,
            PhotoUrl = "https://storage.example.com/animals/photo1.jpg"
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void SendOtpValidator_WhenInvalidMobile_ShouldFail()
    {
        // Arrange
        var validator = new SendOtpValidator();
        var command = new SendOtpCommand("123");

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "MobileNumber");
    }

    [Fact]
    public void SendOtpValidator_WhenValidIndianMobile_ShouldPass()
    {
        // Arrange
        var validator = new SendOtpValidator();
        var command = new SendOtpCommand("9822012345");

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Animal_InitialRegistrationState_ShouldBePendingAndRegistered()
    {
        // Arrange
        var animal = new Animal
        {
            AnimalCode = "ANM-20261122-1001",
            FarmerId = 1,
            AnimalType = AnimalType.Cow,
            Breed = "Gir",
            Gender = Gender.Female,
            AgeInMonths = 18,
            PhotoUrl = "https://storage.example.com/photo.jpg",
            VerificationStatus = VerificationStatus.Pending,
            CurrentStatus = AnimalStatus.Registered
        };

        // Assert
        animal.VerificationStatus.Should().Be(VerificationStatus.Pending);
        animal.CurrentStatus.Should().Be(AnimalStatus.Registered);
        animal.CurrentChhavaniId.Should().BeNull();
    }
}
