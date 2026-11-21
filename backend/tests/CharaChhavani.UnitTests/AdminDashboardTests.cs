using FluentAssertions;
using Xunit;
using CharaChhavani.Application.Admin.DTOs;

namespace CharaChhavani.UnitTests;

public class AdminDashboardTests
{
    [Fact]
    public void AdminDashboardSummary_CapacityUtilization_CalculatesAccurately()
    {
        // Arrange
        var summary = new AdminDashboardSummaryDto
        {
            TotalCampCapacity = 1000,
            TotalActiveAdmittedAnimals = 750
        };

        // Assert
        summary.OverallCapacityUtilizationPercentage.Should().Be(75.0);
    }

    [Fact]
    public void AdminDashboardSummary_WhenCapacityZero_ShouldReturnZeroPercentage()
    {
        // Arrange
        var summary = new AdminDashboardSummaryDto
        {
            TotalCampCapacity = 0,
            TotalActiveAdmittedAnimals = 0
        };

        // Assert
        summary.OverallCapacityUtilizationPercentage.Should().Be(0);
    }

    [Fact]
    public void AdminDashboardSummary_TotalExpenditure_ShouldSumPurchasesAndExpenses()
    {
        // Arrange
        var summary = new AdminDashboardSummaryDto
        {
            TotalFodderPurchaseAmount = 150000m,
            TotalOperationalExpenses = 45000m
        };

        // Assert
        summary.TotalGovernmentExpenditure.Should().Be(195000m);
    }

    [Fact]
    public void AdminDashboardSummary_TotalStock_ShouldSumStoreAndInFarm()
    {
        // Arrange
        var summary = new AdminDashboardSummaryDto
        {
            TotalStoreStockKg = 12000m,
            TotalInFarmStockKg = 8500m
        };

        // Assert
        summary.TotalAvailableStockKg.Should().Be(20500m);
    }
}
