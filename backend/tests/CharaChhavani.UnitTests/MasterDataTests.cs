using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Xunit;
using CharaChhavani.Application.MasterData.Queries;
using CharaChhavani.Application.MasterData.Services;
using CharaChhavani.Infrastructure.Common;
using CharaChhavani.Infrastructure.Persistence;

namespace CharaChhavani.UnitTests;

public class MasterDataTests
{
    [Fact]
    public async Task MasterData_GetDistricts_ReturnsDroughtDistrictsWithTalukas()
    {
        var handler = new GetDistrictsQueryHandler();
        var districts = await handler.Handle(new GetDistrictsQuery(), CancellationToken.None);

        districts.Should().NotBeEmpty();
        districts.Should().Contain(d => d.Name == "Chhatrapati Sambhajinagar");
        districts.Should().Contain(d => d.Name == "Beed");
        districts.Should().Contain(d => d.Name == "Jalna");
        districts.Should().Contain(d => d.Name == "Dharashiv");
        districts.Should().Contain(d => d.Name == "Solapur");
        districts.Should().Contain(d => d.Name == "Ahmednagar");

        var cs = districts.First(d => d.Name == "Chhatrapati Sambhajinagar");
        cs.Talukas.Should().Contain("Paithan");
        cs.Talukas.Should().Contain("Gangapur");
    }

    [Fact]
    public async Task MasterData_GetTalukas_ReturnsAccurateTalukasForDistrict()
    {
        var handler = new GetTalukasQueryHandler();
        var talukas = await handler.Handle(new GetTalukasQuery("Beed"), CancellationToken.None);

        talukas.Should().NotBeEmpty();
        talukas.Should().Contain("Georai");
        talukas.Should().Contain("Majalgaon");
        talukas.Should().Contain("Ashti");
    }

    [Fact]
    public async Task MasterData_GetBreeds_FilteredByCow_ReturnsIndigenousBreeds()
    {
        var handler = new GetBreedsQueryHandler();
        var cowBreeds = await handler.Handle(new GetBreedsQuery("Cow"), CancellationToken.None);

        cowBreeds.Should().NotBeEmpty();
        cowBreeds.Should().OnlyContain(b => b.AnimalType == "Cow");
        cowBreeds.Should().Contain(b => b.EnglishName == "Gir");
        cowBreeds.Should().Contain(b => b.EnglishName == "Khillari");
        cowBreeds.Should().Contain(b => b.EnglishName == "Dangi");
    }

    [Fact]
    public async Task MasterData_GetFodderTypes_VerifiesStandardBaseUnitsAndQuintalConversion()
    {
        var handler = new GetFodderTypesQueryHandler();
        var types = await handler.Handle(new GetFodderTypesQuery(), CancellationToken.None);

        types.Should().NotBeEmpty();
        var green = types.FirstOrDefault(f => f.Code == "GreenFodder");
        green.Should().NotBeNull();
        green!.BaseUnit.Should().Be("kg");
        green.QuintalConversionFactor.Should().Be(100.0);
    }

    [Fact]
    public async Task MasterData_DatabaseSeeder_SeedsSampleCampAndFarmersIntoLocalMySQL()
    {
        EnvLoader.Load();

        var envUser = EnvLoader.Get("USERNAME") ?? "root";
        var envPass = EnvLoader.Get("PASSWORD") ?? "NewPassword@123";

        var builder = new MySqlConnectionStringBuilder("Server=localhost;Port=3306;Database=chara_chhavani_db;CharSet=utf8mb4;")
        {
            UserID = envUser,
            Password = envPass,
            TreatTinyAsBoolean = true
        };

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseMySql(
                builder.ConnectionString,
                new MySqlServerVersion(new Version(8, 0, 42)),
                mysql => mysql.UseNetTopologySuite())
            .Options;

        using var context = new ApplicationDbContext(options);
        var seeder = new DatabaseSeeder(context);

        var result = await seeder.SeedAsync(CancellationToken.None);
        result.Should().NotBeNull();

        // Verify seeded camp in MySQL
        var seededCamp = await context.Chhavanis
            .Include(c => c.Operators)
            .Include(c => c.Stocks)
            .FirstOrDefaultAsync(c => c.CampCode == "CHV-MH-PAITHAN-001");

        seededCamp.Should().NotBeNull();
        seededCamp!.Name.Should().Be("Paithan Taluka Shasan-Manya Chara Chhavani");
        seededCamp.Operators.Should().NotBeEmpty();
        seededCamp.Stocks.Should().NotBeEmpty();

        // Verify seeded farmer in MySQL
        var seededFarmer = await context.Farmers
            .Include(f => f.Animals)
            .FirstOrDefaultAsync(f => f.MobileNumber == "9890123456");

        seededFarmer.Should().NotBeNull();
        seededFarmer!.Name.Should().Be("Kisan Tukaram Jadhav");
        seededFarmer.Animals.Should().NotBeEmpty();
    }
}
