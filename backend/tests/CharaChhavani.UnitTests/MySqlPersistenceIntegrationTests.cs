using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using NetTopologySuite.Geometries;
using Xunit;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;
using CharaChhavani.Infrastructure.Common;
using CharaChhavani.Infrastructure.Persistence;

namespace CharaChhavani.UnitTests;

public class MySqlPersistenceIntegrationTests
{
    private ApplicationDbContext CreateLiveDbContext()
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

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task MySQL_EndToEnd_StoreAndRetrieval_VerifiesSpatialAndRelationalIntegrity()
    {
        using var context = CreateLiveDbContext();

        var testCampCode = $"CHV-VERIFY-{Guid.NewGuid():N}"[..18];
        var testMobile = "9" + Random.Shared.Next(100000000, 999999999).ToString();
        var testTag = $"TAG-{Guid.NewGuid():N}"[..12];
        var testAnimalCode = $"ANM-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";

        try
        {
            // 1. STORE (INSERT) - Spatial Camp Geofence Polygon + Centroid Point
            var ringCoords = new Coordinate[]
            {
                new(75.30, 19.80),
                new(75.35, 19.80),
                new(75.35, 19.85),
                new(75.30, 19.85),
                new(75.30, 19.80) // Closed ring
            };

            var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
            var linearRing = geometryFactory.CreateLinearRing(ringCoords);
            var polygon = geometryFactory.CreatePolygon(linearRing);
            var centroid = new Point(75.32, 19.82) { SRID = 4326 };

            var camp = new Chhavani
            {
                CampCode = testCampCode,
                Name = "Pachod Adarsh Chara Chhavani",
                Address = "Gat No 42, Pachod Road",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar",
                TotalCapacity = 500,
                ActiveAnimalCount = 0,
                Status = CampStatus.Active,
                GeofenceBoundary = polygon,
                Location = centroid,
                CreatedBy = "IntegrationTest",
                CreatedAtUtc = DateTime.UtcNow
            };

            context.Chhavanis.Add(camp);
            await context.SaveChangesAsync();

            // 2. STORE (INSERT) - Farmer & Animal
            var farmer = new Farmer
            {
                Name = "Kisan Baburao Patil",
                MobileNumber = testMobile,
                Address = "Near Grampanchayat",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar",
                IsRegisteredSeller = true,
                CreatedBy = "IntegrationTest",
                CreatedAtUtc = DateTime.UtcNow
            };

            context.Farmers.Add(farmer);
            await context.SaveChangesAsync();

            var animal = new Animal
            {
                AnimalCode = testAnimalCode,
                FarmerId = farmer.Id,
                TagNumber = testTag,
                AnimalType = AnimalType.Cow,
                Breed = "Gir",
                Gender = Gender.Female,
                AgeInMonths = 48,
                VerificationStatus = VerificationStatus.Approved,
                CurrentStatus = AnimalStatus.Verified,
                PhotoUrl = "https://cdn.chhavani.gov.in/photos/sample.jpg",
                CreatedBy = "IntegrationTest",
                CreatedAtUtc = DateTime.UtcNow
            };

            context.Animals.Add(animal);
            await context.SaveChangesAsync();

            // 3. STORE (INSERT) - Officer Camp Inspection
            var inspectionPoint = new Point(75.321, 19.821) { SRID = 4326 };
            var inspection = new CampInspection
            {
                ChhavaniId = camp.Id,
                OfficerId = "OFF-MAHA-042",
                OfficerName = "Tahasildar Deshmukh",
                OfficerDesignation = "Taluka Magistrate",
                InspectionDateUtc = DateTime.UtcNow,
                InspectorLocation = inspectionPoint,
                PhysicalAnimalCount = 120,
                SystemAnimalCount = 120,
                DiscrepancyCount = 0,
                DiscrepancyDetected = false,
                WaterAvailability = "Adequate",
                FodderStockCondition = "Satisfactory",
                CleanlinessScore = 5,
                Remarks = "Camp is impeccably maintained with adequate clean water and green fodder.",
                CreatedBy = "IntegrationTest",
                CreatedAtUtc = DateTime.UtcNow
            };

            context.CampInspections.Add(inspection);
            await context.SaveChangesAsync();

            // ==========================================
            // 4. RETRIEVE & ASSERT FROM MYSQL DATABASE
            // ==========================================
            var retrievedCamp = await context.Chhavanis
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CampCode == testCampCode);

            retrievedCamp.Should().NotBeNull();
            retrievedCamp!.Name.Should().Be("Pachod Adarsh Chara Chhavani");
            retrievedCamp.TotalCapacity.Should().Be(500);
            retrievedCamp.GeofenceBoundary.Should().NotBeNull();
            retrievedCamp.GeofenceBoundary!.SRID.Should().Be(4326);
            retrievedCamp.GeofenceBoundary.IsValid.Should().BeTrue();

            // Spatial containment check retrieved from MySQL
            var testInsidePoint = new Point(75.32, 19.82) { SRID = 4326 };
            retrievedCamp.IsPointInsideGeofence(testInsidePoint).Should().BeTrue();

            var testOutsidePoint = new Point(74.00, 18.00) { SRID = 4326 };
            retrievedCamp.IsPointInsideGeofence(testOutsidePoint).Should().BeFalse();

            // Retrieve Farmer & Animal
            var retrievedFarmer = await context.Farmers
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.MobileNumber == testMobile);

            retrievedFarmer.Should().NotBeNull();
            retrievedFarmer!.Name.Should().Be("Kisan Baburao Patil");

            var retrievedAnimal = await context.Animals
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.TagNumber == testTag);

            retrievedAnimal.Should().NotBeNull();
            retrievedAnimal!.FarmerId.Should().Be(retrievedFarmer.Id);
            retrievedAnimal.Breed.Should().Be("Gir");
            retrievedAnimal.AgeInMonths.Should().Be(48);

            // Retrieve Inspection Audit Log
            var retrievedInspection = await context.CampInspections
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.ChhavaniId == retrievedCamp.Id);

            retrievedInspection.Should().NotBeNull();
            retrievedInspection!.OfficerName.Should().Be("Tahasildar Deshmukh");
            retrievedInspection.CleanlinessScore.Should().Be(5);
            retrievedInspection.WaterAvailability.Should().Be("Adequate");
            retrievedInspection.InspectorLocation.Should().NotBeNull();
            retrievedInspection.InspectorLocation!.X.Should().BeApproximately(75.321, 0.0001);
            retrievedInspection.InspectorLocation!.Y.Should().BeApproximately(19.821, 0.0001);
        }
        finally
        {
            // Cleanup test records
            var toDeleteAnimals = await context.Animals.Where(a => a.TagNumber == testTag).ToListAsync();
            context.Animals.RemoveRange(toDeleteAnimals);

            var toDeleteFarmer = await context.Farmers.Where(f => f.MobileNumber == testMobile).ToListAsync();
            context.Farmers.RemoveRange(toDeleteFarmer);

            var toDeleteInspections = await context.CampInspections.Where(i => i.OfficerId == "OFF-MAHA-042").ToListAsync();
            context.CampInspections.RemoveRange(toDeleteInspections);

            var toDeleteCamps = await context.Chhavanis.Where(c => c.CampCode == testCampCode).ToListAsync();
            context.Chhavanis.RemoveRange(toDeleteCamps);

            await context.SaveChangesAsync();
        }
    }
}
