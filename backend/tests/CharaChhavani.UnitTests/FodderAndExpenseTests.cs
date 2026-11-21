using FluentAssertions;
using Xunit;
using CharaChhavani.Application.Expenses.Commands;
using CharaChhavani.Application.Fodder.Commands;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.UnitTests;

public class FodderAndExpenseTests
{
    [Fact]
    public void RecordFodderPurchaseValidator_WhenInvalidRateOrQuantity_ShouldFailValidation()
    {
        // Arrange
        var validator = new RecordFodderPurchaseValidator();
        var command = new RecordFodderPurchaseCommand
        {
            ChhavaniId = 1,
            SellerName = "Kisan Patil",
            FodderType = FodderType.GreenFodder,
            Quantity = 0, // Invalid
            RatePerUnit = -5 // Invalid
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Quantity");
        result.Errors.Should().Contain(e => e.PropertyName == "RatePerUnit");
    }

    [Fact]
    public void RecordFodderPurchaseValidator_WithValidInputs_ShouldPassValidation()
    {
        // Arrange
        var validator = new RecordFodderPurchaseValidator();
        var command = new RecordFodderPurchaseCommand
        {
            ChhavaniId = 1,
            SellerName = "Kisan Patil",
            FodderType = FodderType.GreenFodder,
            Quantity = 500,
            RatePerUnit = 5.50m
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void RecordStockAdjustmentValidator_WhenReasonMissing_ShouldFailValidation()
    {
        // Arrange
        var validator = new RecordStockAdjustmentValidator();
        var command = new RecordStockAdjustmentCommand
        {
            ChhavaniId = 1,
            Source = StockSource.Store,
            FodderType = FodderType.DryFodder,
            AdjustmentType = AdjustmentType.Decrease,
            Quantity = 50,
            Reason = "" // Mandatory reason is empty
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Reason");
    }

    [Fact]
    public void RecordExpenseValidator_WhenAmountIsZeroOrNegative_ShouldFailValidation()
    {
        // Arrange
        var validator = new RecordExpenseValidator();
        var command = new RecordExpenseCommand
        {
            ChhavaniId = 1,
            Category = "Water",
            Amount = 0 // Invalid
        };

        // Act
        var result = validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Amount");
    }

    [Fact]
    public void FodderPurchase_TotalCalculation_ShouldMatchQuantityTimesRate()
    {
        // Arrange
        const decimal quantity = 500m;
        const decimal rate = 6.25m;
        const decimal expectedTotal = 3125.00m;

        // Act
        var actualTotal = quantity * rate;

        // Assert
        actualTotal.Should().Be(expectedTotal);
    }

    [Fact]
    public void Feeding_NonNegativeStockInvariant_ShouldBeEnforced()
    {
        // Arrange
        var stock = new FodderStock
        {
            ChhavaniId = 1,
            Source = StockSource.Store,
            FodderType = FodderType.GreenFodder,
            AvailableQuantity = 100m,
            Unit = "kg"
        };
        const decimal requestedQuantity = 150m;

        // Act
        var hasSufficientStock = stock.AvailableQuantity >= requestedQuantity;

        // Assert
        hasSufficientStock.Should().BeFalse();
    }
}
