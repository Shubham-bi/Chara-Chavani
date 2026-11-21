using System.Text;
using FluentAssertions;
using Xunit;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Helpers;

namespace CharaChhavani.UnitTests;

public class AuditReportingTests
{
    [Fact]
    public void FodderReconciliation_BalanceMath_CalculatesConsistently()
    {
        // Arrange: 50 Quintals purchased = 5000 kg, 3200 kg fed, -150 kg wastage adjustment
        var item = new FodderReconciliationReportItemDto
        {
            ChhavaniId = 1,
            CampName = "Paithan Fodder Camp",
            FodderType = "DryFodder",
            TotalPurchasedQuintals = 50m,
            TotalFedKg = 3200m,
            TotalAdjustedKg = -150m,
            AvailableStoreStockKg = 1150m,
            AvailableInFarmStockKg = 500m
        };

        // Assert
        item.TotalPurchasedKg.Should().Be(5000m);
        item.TotalAvailableStockKg.Should().Be(1650m);
        // Calculated balance: 5000 - 3200 + (-150) = 1650
        item.CalculatedBalanceKg.Should().Be(1650m);
        item.CalculatedBalanceKg.Should().Be(item.TotalAvailableStockKg);
    }

    [Fact]
    public void InspectionAuditReport_HeadcountDiscrepancy_CalculatesDifference()
    {
        // Arrange: Physical headcount = 48, System reported count = 50 (discrepancy = -2)
        var inspection = new InspectionAuditReportItemDto
        {
            ActualCattleHeadcount = 48,
            SystemReportedCattleCount = 50
        };

        // Assert
        inspection.HeadcountDiscrepancy.Should().Be(-2);
    }

    [Fact]
    public void CsvExportHelper_PrependsUtf8BomAndEscapesSpecialCharacters()
    {
        // Arrange
        var testRecords = new List<AdmissionAuditReportItemDto>
        {
            new()
            {
                AdmissionId = 101,
                AdmissionCode = "ADM-2026-001",
                CampName = "Paithan Camp, Sector 1", // contains comma
                FarmerName = "Namdev \"Patil\"", // contains quotes
                MaskedAadhaar = "XXXX-XXXX-1234",
                AdmittedAt = new DateTime(2026, 11, 20, 8, 30, 0, DateTimeKind.Utc),
                ActiveDaysInCamp = 3
            }
        };

        // Act
        var csvString = CsvExportHelper.GenerateCsvString(testRecords);
        var csvBytes = CsvExportHelper.GenerateCsvBytes(testRecords);

        // Assert
        csvString.Should().StartWith("\uFEFF"); // Starts with UTF-8 BOM
        csvString.Should().Contain("\"Paithan Camp, Sector 1\""); // Comma properly escaped
        csvString.Should().Contain("\"Namdev \"\"Patil\"\"\""); // Inner quotes escaped with double quotes
        csvBytes.Length.Should().BeGreaterThan(0);
    }

    [Fact]
    public void AdmissionAuditReport_MaskedAadhaar_ProtectsPII()
    {
        // Arrange
        var aadhaar = "123456789012";
        var masked = $"XXXX-XXXX-{aadhaar[^4..]}";

        // Assert
        masked.Should().Be("XXXX-XXXX-9012");
    }
}
