using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.MasterData.DTOs;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Infrastructure.Persistence;

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly ApplicationDbContext _context;

    public DatabaseSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SeedResultDto> SeedAsync(CancellationToken cancellationToken = default)
    {
        int campsCreated = 0;
        int operatorsCreated = 0;
        int farmersCreated = 0;
        int animalsCreated = 0;

        const string sampleCampCode = "CHV-MH-PAITHAN-001";

        // 1. Seed Sample Cattle Camp
        var existingCamp = await _context.Chhavanis
            .FirstOrDefaultAsync(c => c.CampCode == sampleCampCode, cancellationToken);

        if (existingCamp == null)
        {
            var ringCoords = new Coordinate[]
            {
                new(75.3200, 19.8100),
                new(75.3400, 19.8100),
                new(75.3400, 19.8300),
                new(75.3200, 19.8300),
                new(75.3200, 19.8100)
            };

            var gf = new GeometryFactory(new PrecisionModel(), 4326);
            var polygon = gf.CreatePolygon(gf.CreateLinearRing(ringCoords));
            var centroid = new Point(75.3300, 19.8200) { SRID = 4326 };

            existingCamp = new Chhavani
            {
                CampCode = sampleCampCode,
                Name = "Paithan Taluka Shasan-Manya Chara Chhavani",
                Address = "Gat No 88, Pachod-Paithan Highway",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar",
                State = "Maharashtra",
                TotalCapacity = 500,
                ActiveAnimalCount = 0,
                Status = CampStatus.Active,
                GeofenceBoundary = polygon,
                Location = centroid,
                CreatedBy = "SystemSeeder",
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.Chhavanis.Add(existingCamp);
            await _context.SaveChangesAsync(cancellationToken);
            campsCreated++;

            // Seed Operator for the camp
            var op = new ChhavaniOperator
            {
                ChhavaniId = existingCamp.Id,
                Name = "Rameshwar Baburao Shinde",
                MobileNumber = "9822114455",
                Address = "Pachod, Taluka Paithan",
                IsActive = true,
                CreatedBy = "SystemSeeder",
                CreatedAtUtc = DateTime.UtcNow
            };
            _context.ChhavaniOperators.Add(op);
            operatorsCreated++;

            // Seed Initial Fodder Stock
            _context.FodderStocks.AddRange(
                new FodderStock
                {
                    ChhavaniId = existingCamp.Id,
                    Source = StockSource.Store,
                    FodderType = FodderType.GreenFodder,
                    AvailableQuantity = 15000.0m,
                    Unit = "kg",
                    CreatedAtUtc = DateTime.UtcNow
                },
                new FodderStock
                {
                    ChhavaniId = existingCamp.Id,
                    Source = StockSource.Store,
                    FodderType = FodderType.DryFodder,
                    AvailableQuantity = 25000.0m,
                    Unit = "kg",
                    CreatedAtUtc = DateTime.UtcNow
                },
                new FodderStock
                {
                    ChhavaniId = existingCamp.Id,
                    Source = StockSource.Store,
                    FodderType = FodderType.ConcentrateFeed,
                    AvailableQuantity = 5000.0m,
                    Unit = "kg",
                    CreatedAtUtc = DateTime.UtcNow
                },
                new FodderStock
                {
                    ChhavaniId = existingCamp.Id,
                    Source = StockSource.InFarm,
                    FodderType = FodderType.GreenFodder,
                    AvailableQuantity = 4000.0m,
                    Unit = "kg",
                    CreatedAtUtc = DateTime.UtcNow
                },
                new FodderStock
                {
                    ChhavaniId = existingCamp.Id,
                    Source = StockSource.InFarm,
                    FodderType = FodderType.DryFodder,
                    AvailableQuantity = 8000.0m,
                    Unit = "kg",
                    CreatedAtUtc = DateTime.UtcNow
                }
            );

            await _context.SaveChangesAsync(cancellationToken);
        }

        // 2. Seed Sample Farmers & Livestock
        const string sampleFarmerMobile = "9890123456";
        var existingFarmer = await _context.Farmers
            .FirstOrDefaultAsync(f => f.MobileNumber == sampleFarmerMobile, cancellationToken);

        if (existingFarmer == null)
        {
            existingFarmer = new Farmer
            {
                Name = "Kisan Tukaram Jadhav",
                MobileNumber = sampleFarmerMobile,
                Address = "House No 45, Near Hanuman Temple",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar",
                State = "Maharashtra",
                IsRegisteredSeller = false,
                CreatedBy = "SystemSeeder",
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.Farmers.Add(existingFarmer);
            await _context.SaveChangesAsync(cancellationToken);
            farmersCreated++;

            // Seed 2 animals for Farmer 1
            _context.Animals.AddRange(
                new Animal
                {
                    AnimalCode = "ANM-20261122-1001",
                    FarmerId = existingFarmer.Id,
                    TagNumber = "MH-20-4001",
                    AnimalType = AnimalType.Cow,
                    Breed = "Gir",
                    Gender = Gender.Female,
                    AgeInMonths = 36,
                    VerificationStatus = VerificationStatus.Approved,
                    CurrentStatus = AnimalStatus.Verified,
                    PhotoUrl = "https://cdn.chhavani.gov.in/photos/gir_cow_sample.jpg",
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow
                },
                new Animal
                {
                    AnimalCode = "ANM-20261122-1002",
                    FarmerId = existingFarmer.Id,
                    TagNumber = "MH-20-4002",
                    AnimalType = AnimalType.Bullock,
                    Breed = "Khillari",
                    Gender = Gender.Male,
                    AgeInMonths = 48,
                    VerificationStatus = VerificationStatus.Approved,
                    CurrentStatus = AnimalStatus.Verified,
                    PhotoUrl = "https://cdn.chhavani.gov.in/photos/khillari_bull_sample.jpg",
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow
                }
            );

            animalsCreated += 2;
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new SeedResultDto
        {
            CampsCreated = campsCreated,
            OperatorsCreated = operatorsCreated,
            FarmersCreated = farmersCreated,
            AnimalsCreated = animalsCreated,
            Message = "Database seeding completed successfully."
        };
    }
}
