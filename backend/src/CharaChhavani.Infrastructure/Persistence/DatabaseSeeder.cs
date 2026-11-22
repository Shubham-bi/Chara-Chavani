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
        int admissionsCreated = 0;
        int expensesCreated = 0;
        int inspectionsCreated = 0;
        int purchasesCreated = 0;
        int feedingEntriesCreated = 0;

        var gf = new GeometryFactory(new PrecisionModel(), 4326);

        // -------------------------------------------------------------------------
        // 1. Seed Relief Camps across Maharashtra Drought Districts
        // -------------------------------------------------------------------------
        var campDefinitions = new[]
        {
            new
            {
                Code = "CHV-MH-PAITHAN-001",
                Name = "Paithan Taluka Shasan-Manya Chara Chhavani",
                Address = "Gat No 88, Pachod-Paithan Highway",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar",
                Capacity = 500,
                RingCoords = new Coordinate[]
                {
                    new(75.3200, 19.8100),
                    new(75.3400, 19.8100),
                    new(75.3400, 19.8300),
                    new(75.3200, 19.8300),
                    new(75.3200, 19.8100)
                },
                Centroid = new Coordinate(75.3300, 19.8200),
                OperatorName = "Rameshwar Baburao Shinde",
                OperatorMobile = "9822114455",
                OperatorAddress = "Pachod, Taluka Paithan"
            },
            new
            {
                Code = "CHV-MH-AMBAD-101",
                Name = "Ambad Taluka Drought Relief Chhavani",
                Address = "Survey No 142, Wadigodri Road",
                Village = "Wadigodri",
                Taluka = "Ambad",
                District = "Jalna",
                Capacity = 400,
                RingCoords = new Coordinate[]
                {
                    new(75.7800, 19.6100),
                    new(75.8000, 19.6100),
                    new(75.8000, 19.6300),
                    new(75.7800, 19.6300),
                    new(75.7800, 19.6100)
                },
                Centroid = new Coordinate(75.7900, 19.6200),
                OperatorName = "Balasaheb Ganpat Solanke",
                OperatorMobile = "9822334455",
                OperatorAddress = "Wadigodri, Taluka Ambad"
            },
            new
            {
                Code = "CHV-MH-GEORAI-102",
                Name = "Georai Taluka Madhyavarti Chara Chhavani",
                Address = "Plot No 56, Revgaon Shivar",
                Village = "Revgaon",
                Taluka = "Georai",
                District = "Beed",
                Capacity = 600,
                RingCoords = new Coordinate[]
                {
                    new(75.7300, 19.2500),
                    new(75.7500, 19.2500),
                    new(75.7500, 19.2700),
                    new(75.7300, 19.2700),
                    new(75.7300, 19.2500)
                },
                Centroid = new Coordinate(75.7400, 19.2600),
                OperatorName = "Pandurang Shivram Pawar",
                OperatorMobile = "9822445566",
                OperatorAddress = "Revgaon, Taluka Georai"
            },
            new
            {
                Code = "CHV-MH-MADHA-103",
                Name = "Madha Drought Relief Cattle Camp",
                Address = "Gat No 210, Near Sugar Factory, Kurduvadi",
                Village = "Kurduvadi",
                Taluka = "Madha",
                District = "Solapur",
                Capacity = 450,
                RingCoords = new Coordinate[]
                {
                    new(75.4200, 18.0600),
                    new(75.4400, 18.0600),
                    new(75.4400, 18.0800),
                    new(75.4200, 18.0800),
                    new(75.4200, 18.0600)
                },
                Centroid = new Coordinate(75.4300, 18.0700),
                OperatorName = "Dattatraya Keshav Shinde",
                OperatorMobile = "9822556677",
                OperatorAddress = "Kurduvadi, Taluka Madha"
            }
        };

        var loadedCamps = new Dictionary<string, Chhavani>();

        foreach (var def in campDefinitions)
        {
            var camp = await _context.Chhavanis.FirstOrDefaultAsync(c => c.CampCode == def.Code, cancellationToken);
            if (camp == null)
            {
                var polygon = gf.CreatePolygon(gf.CreateLinearRing(def.RingCoords));
                var centroid = new Point(def.Centroid.X, def.Centroid.Y) { SRID = 4326 };

                camp = new Chhavani
                {
                    CampCode = def.Code,
                    Name = def.Name,
                    Address = def.Address,
                    Village = def.Village,
                    Taluka = def.Taluka,
                    District = def.District,
                    State = "Maharashtra",
                    TotalCapacity = def.Capacity,
                    ActiveAnimalCount = 0,
                    Status = CampStatus.Active,
                    GeofenceBoundary = polygon,
                    Location = centroid,
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow
                };

                _context.Chhavanis.Add(camp);
                await _context.SaveChangesAsync(cancellationToken);
                campsCreated++;
            }
            loadedCamps[def.Code] = camp;

            // Seed Operator if missing
            var op = await _context.ChhavaniOperators.FirstOrDefaultAsync(o => o.ChhavaniId == camp.Id, cancellationToken);
            if (op == null)
            {
                op = new ChhavaniOperator
                {
                    ChhavaniId = camp.Id,
                    Name = def.OperatorName,
                    MobileNumber = def.OperatorMobile,
                    Address = def.OperatorAddress,
                    IsActive = true,
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow
                };
                _context.ChhavaniOperators.Add(op);
                await _context.SaveChangesAsync(cancellationToken);
                operatorsCreated++;
            }

            // Seed Initial Fodder Stocks if missing
            var existingStocks = await _context.FodderStocks.Where(s => s.ChhavaniId == camp.Id).ToListAsync(cancellationToken);
            if (!existingStocks.Any())
            {
                _context.FodderStocks.AddRange(
                    new FodderStock
                    {
                        ChhavaniId = camp.Id,
                        Source = StockSource.Store,
                        FodderType = FodderType.GreenFodder,
                        AvailableQuantity = 15000.0m,
                        Unit = "kg",
                        CreatedAtUtc = DateTime.UtcNow
                    },
                    new FodderStock
                    {
                        ChhavaniId = camp.Id,
                        Source = StockSource.Store,
                        FodderType = FodderType.DryFodder,
                        AvailableQuantity = 25000.0m,
                        Unit = "kg",
                        CreatedAtUtc = DateTime.UtcNow
                    },
                    new FodderStock
                    {
                        ChhavaniId = camp.Id,
                        Source = StockSource.Store,
                        FodderType = FodderType.ConcentrateFeed,
                        AvailableQuantity = 5000.0m,
                        Unit = "kg",
                        CreatedAtUtc = DateTime.UtcNow
                    },
                    new FodderStock
                    {
                        ChhavaniId = camp.Id,
                        Source = StockSource.InFarm,
                        FodderType = FodderType.GreenFodder,
                        AvailableQuantity = 4000.0m,
                        Unit = "kg",
                        CreatedAtUtc = DateTime.UtcNow
                    },
                    new FodderStock
                    {
                        ChhavaniId = camp.Id,
                        Source = StockSource.InFarm,
                        FodderType = FodderType.DryFodder,
                        AvailableQuantity = 8000.0m,
                        Unit = "kg",
                        CreatedAtUtc = DateTime.UtcNow
                    }
                );
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // -------------------------------------------------------------------------
        // 2. Seed Farmers across Districts
        // -------------------------------------------------------------------------
        var farmerDefinitions = new[]
        {
            new
            {
                Mobile = "9890123456",
                Name = "Kisan Tukaram Jadhav",
                Address = "House No 45, Near Hanuman Temple",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar"
            },
            new
            {
                Mobile = "9822012345",
                Name = "Rameshwar Shinde",
                Address = "Gat No 112, Pachod Road",
                Village = "Pachod",
                Taluka = "Paithan",
                District = "Chhatrapati Sambhajinagar"
            },
            new
            {
                Mobile = "9822098765",
                Name = "Suresh Mahadev Patil",
                Address = "Main Galli, Near Gram Panchayat",
                Village = "Wadigodri",
                Taluka = "Ambad",
                District = "Jalna"
            },
            new
            {
                Mobile = "9822055555",
                Name = "Kisan Arjun Chavan",
                Address = "Gat No 34, Canal Road",
                Village = "Revgaon",
                Taluka = "Georai",
                District = "Beed"
            },
            new
            {
                Mobile = "9822033445",
                Name = "Dnyaneshwar Vitthal Gaikwad",
                Address = "Kurduvadi Station Road",
                Village = "Kurduvadi",
                Taluka = "Madha",
                District = "Solapur"
            }
        };

        var loadedFarmers = new Dictionary<string, Farmer>();

        foreach (var fdef in farmerDefinitions)
        {
            var farmer = await _context.Farmers.FirstOrDefaultAsync(f => f.MobileNumber == fdef.Mobile, cancellationToken);
            if (farmer == null)
            {
                farmer = new Farmer
                {
                    Name = fdef.Name,
                    MobileNumber = fdef.Mobile,
                    Address = fdef.Address,
                    Village = fdef.Village,
                    Taluka = fdef.Taluka,
                    District = fdef.District,
                    State = "Maharashtra",
                    IsRegisteredSeller = false,
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow
                };
                _context.Farmers.Add(farmer);
                await _context.SaveChangesAsync(cancellationToken);
                farmersCreated++;
            }
            loadedFarmers[fdef.Mobile] = farmer;
        }

        // -------------------------------------------------------------------------
        // 3. Seed Diverse Animals, Breeds & Vet Verifications
        // -------------------------------------------------------------------------
        var animalDefinitions = new[]
        {
            new
            {
                Code = "ANM-20261122-1001",
                FarmerMobile = "9890123456",
                Tag = "MH-20-4001",
                Type = AnimalType.Cow,
                Breed = "Gir",
                Gender = Gender.Female,
                Age = 36,
                Photo = "https://cdn.chhavani.gov.in/photos/gir_cow_sample.jpg",
                DoctorId = "DOC-MH-AUR-01",
                DoctorLocation = new Coordinate(75.3300, 19.8200),
                TargetCampCode = "CHV-MH-PAITHAN-001",
                AdmissionCode = "ADM-20261122-001",
                AdmissionCoords = new Coordinate(75.3310, 19.8210),
                AdmitDaysAgo = 4
            },
            new
            {
                Code = "ANM-20261122-1002",
                FarmerMobile = "9890123456",
                Tag = "MH-20-4002",
                Type = AnimalType.Bullock,
                Breed = "Khillari",
                Gender = Gender.Male,
                Age = 48,
                Photo = "https://cdn.chhavani.gov.in/photos/khillari_bull_sample.jpg",
                DoctorId = "DOC-MH-AUR-01",
                DoctorLocation = new Coordinate(75.3300, 19.8200),
                TargetCampCode = "CHV-MH-PAITHAN-001",
                AdmissionCode = "ADM-20261122-002",
                AdmissionCoords = new Coordinate(75.3315, 19.8212),
                AdmitDaysAgo = 4
            },
            new
            {
                Code = "ANM-20261122-1003",
                FarmerMobile = "9822012345",
                Tag = "MH-20-4003",
                Type = AnimalType.Buffalo,
                Breed = "Murrah",
                Gender = Gender.Female,
                Age = 42,
                Photo = "https://cdn.chhavani.gov.in/photos/murrah_buffalo_sample.jpg",
                DoctorId = "DOC-MH-AUR-01",
                DoctorLocation = new Coordinate(75.3280, 19.8180),
                TargetCampCode = "CHV-MH-PAITHAN-001",
                AdmissionCode = "ADM-20261122-003",
                AdmissionCoords = new Coordinate(75.3320, 19.8215),
                AdmitDaysAgo = 3
            },
            new
            {
                Code = "ANM-20261122-1004",
                FarmerMobile = "9822012345",
                Tag = "MH-20-4004",
                Type = AnimalType.Cow,
                Breed = "Dangi",
                Gender = Gender.Female,
                Age = 30,
                Photo = "https://cdn.chhavani.gov.in/photos/dangi_cow_sample.jpg",
                DoctorId = "DOC-MH-AUR-01",
                DoctorLocation = new Coordinate(75.3280, 19.8180),
                TargetCampCode = "", // Not admitted, pending at farm
                AdmissionCode = "",
                AdmissionCoords = new Coordinate(0, 0),
                AdmitDaysAgo = 0
            },
            new
            {
                Code = "ANM-20261122-1005",
                FarmerMobile = "9822098765",
                Tag = "MH-21-5001",
                Type = AnimalType.Bullock,
                Breed = "Khillari",
                Gender = Gender.Male,
                Age = 54,
                Photo = "https://cdn.chhavani.gov.in/photos/khillari_bullock_jalna.jpg",
                DoctorId = "DOC-MH-JAL-02",
                DoctorLocation = new Coordinate(75.7900, 19.6200),
                TargetCampCode = "CHV-MH-AMBAD-101",
                AdmissionCode = "ADM-20261122-004",
                AdmissionCoords = new Coordinate(75.7910, 19.6210),
                AdmitDaysAgo = 3
            },
            new
            {
                Code = "ANM-20261122-1006",
                FarmerMobile = "9822098765",
                Tag = "MH-21-5002",
                Type = AnimalType.Cow,
                Breed = "Gir",
                Gender = Gender.Female,
                Age = 28,
                Photo = "https://cdn.chhavani.gov.in/photos/gir_cow_jalna.jpg",
                DoctorId = "DOC-MH-JAL-02",
                DoctorLocation = new Coordinate(75.7900, 19.6200),
                TargetCampCode = "CHV-MH-AMBAD-101",
                AdmissionCode = "ADM-20261122-005",
                AdmissionCoords = new Coordinate(75.7915, 19.6215),
                AdmitDaysAgo = 2
            },
            new
            {
                Code = "ANM-20261122-1007",
                FarmerMobile = "9822055555",
                Tag = "MH-23-6001",
                Type = AnimalType.Buffalo,
                Breed = "Murrah",
                Gender = Gender.Female,
                Age = 38,
                Photo = "https://cdn.chhavani.gov.in/photos/murrah_buffalo_beed.jpg",
                DoctorId = "DOC-MH-BED-03",
                DoctorLocation = new Coordinate(75.7400, 19.2600),
                TargetCampCode = "CHV-MH-GEORAI-102",
                AdmissionCode = "ADM-20261122-006",
                AdmissionCoords = new Coordinate(75.7410, 19.2610),
                AdmitDaysAgo = 2
            },
            new
            {
                Code = "ANM-20261122-1008",
                FarmerMobile = "9822055555",
                Tag = "MH-23-6002",
                Type = AnimalType.Cow,
                Breed = "Red Kandhari",
                Gender = Gender.Female,
                Age = 32,
                Photo = "https://cdn.chhavani.gov.in/photos/red_kandhari_beed.jpg",
                DoctorId = "DOC-MH-BED-03",
                DoctorLocation = new Coordinate(75.7400, 19.2600),
                TargetCampCode = "CHV-MH-GEORAI-102",
                AdmissionCode = "ADM-20261122-007",
                AdmissionCoords = new Coordinate(75.7415, 19.2615),
                AdmitDaysAgo = 1
            },
            new
            {
                Code = "ANM-20261122-1009",
                FarmerMobile = "9822033445",
                Tag = "MH-13-7001",
                Type = AnimalType.Goat,
                Breed = "Osmanabadi",
                Gender = Gender.Female,
                Age = 18,
                Photo = "https://cdn.chhavani.gov.in/photos/osmanabadi_goat_solapur.jpg",
                DoctorId = "DOC-MH-SOL-04",
                DoctorLocation = new Coordinate(75.4300, 18.0700),
                TargetCampCode = "CHV-MH-MADHA-103",
                AdmissionCode = "ADM-20261122-008",
                AdmissionCoords = new Coordinate(75.4310, 18.0710),
                AdmitDaysAgo = 1
            },
            new
            {
                Code = "ANM-20261122-1010",
                FarmerMobile = "9822033445",
                Tag = "MH-13-7002",
                Type = AnimalType.Sheep,
                Breed = "Deccani",
                Gender = Gender.Male,
                Age = 20,
                Photo = "https://cdn.chhavani.gov.in/photos/deccani_sheep_solapur.jpg",
                DoctorId = "DOC-MH-SOL-04",
                DoctorLocation = new Coordinate(75.4300, 18.0700),
                TargetCampCode = "",
                AdmissionCode = "",
                AdmissionCoords = new Coordinate(0, 0),
                AdmitDaysAgo = 0
            }
        };

        foreach (var adef in animalDefinitions)
        {
            var farmer = loadedFarmers[adef.FarmerMobile];
            var animal = await _context.Animals.FirstOrDefaultAsync(a => a.AnimalCode == adef.Code, cancellationToken);
            if (animal == null)
            {
                animal = new Animal
                {
                    AnimalCode = adef.Code,
                    FarmerId = farmer.Id,
                    TagNumber = adef.Tag,
                    AnimalType = adef.Type,
                    Breed = adef.Breed,
                    Gender = adef.Gender,
                    AgeInMonths = adef.Age,
                    VerificationStatus = VerificationStatus.Approved,
                    CurrentStatus = AnimalStatus.Verified,
                    PhotoUrl = adef.Photo,
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-7)
                };
                _context.Animals.Add(animal);
                await _context.SaveChangesAsync(cancellationToken);
                animalsCreated++;
            }

            // Seed Vet Verification if missing
            var verification = await _context.VetVerifications.FirstOrDefaultAsync(v => v.AnimalId == animal.Id, cancellationToken);
            if (verification == null)
            {
                var docLoc = new Point(adef.DoctorLocation.X, adef.DoctorLocation.Y) { SRID = 4326 };
                verification = new VetVerification
                {
                    AnimalId = animal.Id,
                    DoctorId = adef.DoctorId,
                    Result = VerificationStatus.Approved,
                    Remarks = $"Clinically fit and vaccinated against FMD. Ear tag {adef.Tag} confirmed intact.",
                    InspectionLocation = docLoc,
                    VerificationPhotoUrl = adef.Photo,
                    VerifiedAtUtc = DateTime.UtcNow.AddDays(-5),
                    CreatedBy = "SystemSeeder",
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-5)
                };
                _context.VetVerifications.Add(verification);
                await _context.SaveChangesAsync(cancellationToken);
            }

            // Seed Admission if target camp specified
            if (!string.IsNullOrEmpty(adef.TargetCampCode) && loadedCamps.TryGetValue(adef.TargetCampCode, out var camp))
            {
                var admission = await _context.AnimalAdmissions.FirstOrDefaultAsync(a => a.AdmissionCode == adef.AdmissionCode, cancellationToken);
                if (admission == null)
                {
                    var admPoint = new Point(adef.AdmissionCoords.X, adef.AdmissionCoords.Y) { SRID = 4326 };
                    admission = new AnimalAdmission
                    {
                        AdmissionCode = adef.AdmissionCode,
                        AnimalId = animal.Id,
                        ChhavaniId = camp.Id,
                        OperatorId = "OP-" + camp.CampCode,
                        AdmissionPhotoUrl = adef.Photo,
                        AdmissionLocation = admPoint,
                        IsGeofenceValidated = true,
                        AdmittedAtUtc = DateTime.UtcNow.AddDays(-adef.AdmitDaysAgo),
                        Status = AdmissionStatus.Admitted,
                        CreatedBy = "SystemSeeder",
                        CreatedAtUtc = DateTime.UtcNow.AddDays(-adef.AdmitDaysAgo)
                    };
                    _context.AnimalAdmissions.Add(admission);

                    // Update animal state
                    animal.CurrentChhavaniId = camp.Id;
                    animal.CurrentStatus = AnimalStatus.Admitted;
                    await _context.SaveChangesAsync(cancellationToken);
                    admissionsCreated++;
                }
            }
        }

        // -------------------------------------------------------------------------
        // 4. Update Active Headcount for all Camps
        // -------------------------------------------------------------------------
        foreach (var camp in loadedCamps.Values)
        {
            var activeCount = await _context.AnimalAdmissions
                .CountAsync(a => a.ChhavaniId == camp.Id && a.Status == AdmissionStatus.Admitted, cancellationToken);
            camp.ActiveAnimalCount = activeCount;
        }
        await _context.SaveChangesAsync(cancellationToken);

        // -------------------------------------------------------------------------
        // 5. Seed Fodder Purchases
        // -------------------------------------------------------------------------
        var purchaseDefinitions = new[]
        {
            new
            {
                Code = "PUR-20261120-001",
                CampCode = "CHV-MH-PAITHAN-001",
                Seller = "Balasaheb Thorat Fodder Farm",
                Mobile = "9422112233",
                Type = FodderType.GreenFodder,
                Qty = 5000.0m,
                Rate = 3.50m,
                Total = 17500.0m,
                DaysAgo = 3
            },
            new
            {
                Code = "PUR-20261121-002",
                CampCode = "CHV-MH-PAITHAN-001",
                Seller = "Kisanrao More Agro Services",
                Mobile = "9422223344",
                Type = FodderType.DryFodder,
                Qty = 8000.0m,
                Rate = 6.80m,
                Total = 54400.0m,
                DaysAgo = 2
            },
            new
            {
                Code = "PUR-20261121-003",
                CampCode = "CHV-MH-AMBAD-101",
                Seller = "Govind Kale Fodder Traders",
                Mobile = "9422334455",
                Type = FodderType.GreenFodder,
                Qty = 4000.0m,
                Rate = 3.60m,
                Total = 14400.0m,
                DaysAgo = 2
            },
            new
            {
                Code = "PUR-20261122-004",
                CampCode = "CHV-MH-GEORAI-102",
                Seller = "Vithoba Shinde Feed Supplies",
                Mobile = "9422445566",
                Type = FodderType.ConcentrateFeed,
                Qty = 2000.0m,
                Rate = 18.00m,
                Total = 36000.0m,
                DaysAgo = 1
            }
        };

        foreach (var pdef in purchaseDefinitions)
        {
            if (loadedCamps.TryGetValue(pdef.CampCode, out var camp))
            {
                var purchase = await _context.FodderPurchases.FirstOrDefaultAsync(p => p.PurchaseCode == pdef.Code, cancellationToken);
                if (purchase == null)
                {
                    purchase = new FodderPurchase
                    {
                        PurchaseCode = pdef.Code,
                        ChhavaniId = camp.Id,
                        SellerName = pdef.Seller,
                        SellerMobile = pdef.Mobile,
                        FodderType = pdef.Type,
                        Quantity = pdef.Qty,
                        Unit = "kg",
                        RatePerUnit = pdef.Rate,
                        TotalAmount = pdef.Total,
                        PurchaseDate = DateTime.UtcNow.AddDays(-pdef.DaysAgo),
                        CreatedBy = "SystemSeeder",
                        CreatedAtUtc = DateTime.UtcNow.AddDays(-pdef.DaysAgo)
                    };
                    _context.FodderPurchases.Add(purchase);
                    purchasesCreated++;
                }
            }
        }
        await _context.SaveChangesAsync(cancellationToken);

        // -------------------------------------------------------------------------
        // 6. Seed Daily Feeding Entries
        // -------------------------------------------------------------------------
        if (loadedCamps.TryGetValue("CHV-MH-PAITHAN-001", out var pCamp))
        {
            var existingFeeding = await _context.FeedingEntries.AnyAsync(f => f.ChhavaniId == pCamp.Id, cancellationToken);
            if (!existingFeeding)
            {
                _context.FeedingEntries.AddRange(
                    new FeedingEntry
                    {
                        ChhavaniId = pCamp.Id,
                        Source = StockSource.InFarm,
                        AnimalType = AnimalType.Cow,
                        FodderType = FodderType.GreenFodder,
                        QuantityIssued = 120.0m,
                        Unit = "kg",
                        FeedingDateTime = DateTime.UtcNow.AddHours(-14),
                        CreatedBy = "SystemSeeder",
                        CreatedAtUtc = DateTime.UtcNow.AddHours(-14)
                    },
                    new FeedingEntry
                    {
                        ChhavaniId = pCamp.Id,
                        Source = StockSource.Store,
                        AnimalType = AnimalType.Bullock,
                        FodderType = FodderType.DryFodder,
                        QuantityIssued = 150.0m,
                        Unit = "kg",
                        FeedingDateTime = DateTime.UtcNow.AddHours(-8),
                        CreatedBy = "SystemSeeder",
                        CreatedAtUtc = DateTime.UtcNow.AddHours(-8)
                    }
                );
                feedingEntriesCreated += 2;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // -------------------------------------------------------------------------
        // 7. Seed Operational Expenses across Categories
        // -------------------------------------------------------------------------
        var expenseDefinitions = new[]
        {
            new
            {
                CampCode = "CHV-MH-PAITHAN-001",
                Category = "Labour",
                Amount = 18000.00m,
                Description = "Daily shed maintenance & cowherds shift wages (12 workers)",
                DaysAgo = 3
            },
            new
            {
                CampCode = "CHV-MH-PAITHAN-001",
                Category = "Water",
                Amount = 12500.00m,
                Description = "Emergency drinking water tanker supply (5 tankers x 12,000L)",
                DaysAgo = 2
            },
            new
            {
                CampCode = "CHV-MH-PAITHAN-001",
                Category = "Electricity",
                Amount = 4200.00m,
                Description = "Grid power supply & solar borewell pump maintenance",
                DaysAgo = 1
            },
            new
            {
                CampCode = "CHV-MH-AMBAD-101",
                Category = "Water",
                Amount = 9800.00m,
                Description = "Drinking water tanker logistics and overhead reservoir filling",
                DaysAgo = 2
            },
            new
            {
                CampCode = "CHV-MH-AMBAD-101",
                Category = "Labour",
                Amount = 14000.00m,
                Description = "Camp security, feeding handlers, and manure clearing",
                DaysAgo = 1
            },
            new
            {
                CampCode = "CHV-MH-GEORAI-102",
                Category = "Transportation",
                Amount = 8500.00m,
                Description = "Fodder freight transport from local APMC market to camp yard",
                DaysAgo = 2
            },
            new
            {
                CampCode = "CHV-MH-GEORAI-102",
                Category = "Other",
                Amount = 6200.00m,
                Description = "Veterinary first-aid medicines, disinfectants & mineral mixture",
                DaysAgo = 1
            },
            new
            {
                CampCode = "CHV-MH-MADHA-103",
                Category = "Water",
                Amount = 11000.00m,
                Description = "Water supply pipeline repair and tanker delivery",
                DaysAgo = 1
            }
        };

        foreach (var edef in expenseDefinitions)
        {
            if (loadedCamps.TryGetValue(edef.CampCode, out var camp))
            {
                var existingExp = await _context.Expenses.FirstOrDefaultAsync(
                    e => e.ChhavaniId == camp.Id && e.Category == edef.Category && e.Description == edef.Description,
                    cancellationToken);

                if (existingExp == null)
                {
                    var exp = new Expense
                    {
                        ChhavaniId = camp.Id,
                        Category = edef.Category,
                        Amount = edef.Amount,
                        Description = edef.Description,
                        ExpenseDate = DateTime.UtcNow.AddDays(-edef.DaysAgo),
                        CreatedBy = "SystemSeeder",
                        CreatedAtUtc = DateTime.UtcNow.AddDays(-edef.DaysAgo)
                    };
                    _context.Expenses.Add(exp);
                    expensesCreated++;
                }
            }
        }
        await _context.SaveChangesAsync(cancellationToken);

        // -------------------------------------------------------------------------
        // 8. Seed Official Camp Inspections
        // -------------------------------------------------------------------------
        var inspectionDefinitions = new[]
        {
            new
            {
                CampCode = "CHV-MH-PAITHAN-001",
                OfficerId = "OFF-MH-AUR-001",
                OfficerName = "Dr. Anand Deshmukh",
                OfficerDesignation = "District Animal Husbandry Officer",
                DaysAgo = 2,
                Location = new Coordinate(75.3305, 19.8205),
                PhysicalCount = 3,
                SystemCount = 3,
                Discrepancy = 0,
                DiscrepancyDetected = false,
                Water = "Adequate",
                Fodder = "Satisfactory",
                Cleanliness = 5,
                Remarks = "Camp operations running in strict compliance with GR directives. Cattle healthy and adequately sheltered.",
                Recommendations = "Ensure timely replenishment of green fodder reserves before weekend."
            },
            new
            {
                CampCode = "CHV-MH-AMBAD-101",
                OfficerId = "OFF-MH-JAL-002",
                OfficerName = "Smt. Vaishali More",
                OfficerDesignation = "Taluka Development Officer (BDO)",
                DaysAgo = 1,
                Location = new Coordinate(75.7905, 19.6205),
                PhysicalCount = 2,
                SystemCount = 2,
                Discrepancy = 0,
                DiscrepancyDetected = false,
                Water = "Adequate",
                Fodder = "Satisfactory",
                Cleanliness = 4,
                Remarks = "Water storage ponds clean. Ear tags verified with digital register.",
                Recommendations = "Expand shade nets over southern shed pens."
            },
            new
            {
                CampCode = "CHV-MH-GEORAI-102",
                OfficerId = "OFF-MH-BED-003",
                OfficerName = "Shri. Prakash Sonawane",
                OfficerDesignation = "Sub-Divisional Officer (SDO)",
                DaysAgo = 1,
                Location = new Coordinate(75.7405, 19.2605),
                PhysicalCount = 2,
                SystemCount = 2,
                Discrepancy = 0,
                DiscrepancyDetected = false,
                Water = "Adequate",
                Fodder = "Satisfactory",
                Cleanliness = 4,
                Remarks = "Fodder stock quality verified. Weight scale calibrated.",
                Recommendations = "Maintain daily disinfection spraying log."
            }
        };

        foreach (var idef in inspectionDefinitions)
        {
            if (loadedCamps.TryGetValue(idef.CampCode, out var camp))
            {
                var existingInsp = await _context.CampInspections.FirstOrDefaultAsync(
                    i => i.ChhavaniId == camp.Id && i.OfficerId == idef.OfficerId,
                    cancellationToken);

                if (existingInsp == null)
                {
                    var inspLoc = new Point(idef.Location.X, idef.Location.Y) { SRID = 4326 };
                    var insp = new CampInspection
                    {
                        ChhavaniId = camp.Id,
                        OfficerId = idef.OfficerId,
                        OfficerName = idef.OfficerName,
                        OfficerDesignation = idef.OfficerDesignation,
                        InspectionDateUtc = DateTime.UtcNow.AddDays(-idef.DaysAgo),
                        InspectorLocation = inspLoc,
                        PhysicalAnimalCount = idef.PhysicalCount,
                        SystemAnimalCount = idef.SystemCount,
                        DiscrepancyCount = idef.Discrepancy,
                        DiscrepancyDetected = idef.DiscrepancyDetected,
                        WaterAvailability = idef.Water,
                        FodderStockCondition = idef.Fodder,
                        CleanlinessScore = idef.Cleanliness,
                        Remarks = idef.Remarks,
                        Recommendations = idef.Recommendations,
                        InspectionPhotoUrl = "https://cdn.chhavani.gov.in/inspections/audit_sample.jpg",
                        CreatedBy = "SystemSeeder",
                        CreatedAtUtc = DateTime.UtcNow.AddDays(-idef.DaysAgo)
                    };
                    _context.CampInspections.Add(insp);
                    inspectionsCreated++;
                }
            }
        }
        await _context.SaveChangesAsync(cancellationToken);

        return new SeedResultDto
        {
            CampsCreated = campsCreated,
            OperatorsCreated = operatorsCreated,
            FarmersCreated = farmersCreated,
            AnimalsCreated = animalsCreated,
            AdmissionsCreated = admissionsCreated,
            ExpensesCreated = expensesCreated,
            InspectionsCreated = inspectionsCreated,
            PurchasesCreated = purchasesCreated,
            FeedingEntriesCreated = feedingEntriesCreated,
            Message = "Comprehensive database seeding completed successfully."
        };
    }
}
