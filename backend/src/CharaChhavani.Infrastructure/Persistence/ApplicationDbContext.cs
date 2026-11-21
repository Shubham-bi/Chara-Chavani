using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Chhavani> Chhavanis => Set<Chhavani>();
    public DbSet<ChhavaniOperator> ChhavaniOperators => Set<ChhavaniOperator>();
    public DbSet<Farmer> Farmers => Set<Farmer>();
    public DbSet<Animal> Animals => Set<Animal>();
    public DbSet<VetVerification> VetVerifications => Set<VetVerification>();
    public DbSet<AnimalAdmission> AnimalAdmissions => Set<AnimalAdmission>();
    public DbSet<FodderStock> FodderStocks => Set<FodderStock>();
    public DbSet<FodderPurchase> FodderPurchases => Set<FodderPurchase>();
    public DbSet<FeedingEntry> FeedingEntries => Set<FeedingEntry>();
    public DbSet<StockAdjustment> StockAdjustments => Set<StockAdjustment>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<CampInspection> CampInspections => Set<CampInspection>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply UTF8mb4 to entire schema
        modelBuilder.HasCharSet("utf8mb4");

        // Chhavani (Camp) Mapping & Spatial Config
        modelBuilder.Entity<Chhavani>(entity =>
        {
            entity.ToTable("chhavanis");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CampCode).IsUnique();

            entity.Property(e => e.CampCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Village).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Taluka).HasMaxLength(100).IsRequired();
            entity.Property(e => e.District).HasMaxLength(100).IsRequired();
            entity.Property(e => e.State).HasMaxLength(100).HasDefaultValue("Maharashtra");

            // Spatial Geofence Polygon (SRID 4326 - WGS 84)
            entity.Property(e => e.GeofenceBoundary)
                .HasColumnType("polygon")
                .HasAnnotation("MySql:SpatialReferenceSystemIdentifier", 4326);

            // Centroid/Entrance Point (SRID 4326)
            entity.Property(e => e.Location)
                .HasColumnType("point")
                .HasAnnotation("MySql:SpatialReferenceSystemIdentifier", 4326);
        });

        // Chhavani Operator Mapping
        modelBuilder.Entity<ChhavaniOperator>(entity =>
        {
            entity.ToTable("chhavani_operators");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.MobileNumber).HasMaxLength(20).IsRequired();
            entity.HasIndex(e => e.MobileNumber);

            entity.HasOne(e => e.Chhavani)
                .WithMany(c => c.Operators)
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Farmer Mapping
        modelBuilder.Entity<Farmer>(entity =>
        {
            entity.ToTable("farmers");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.MobileNumber).HasMaxLength(20).IsRequired();
            entity.HasIndex(e => e.MobileNumber);
            entity.Property(e => e.Village).HasMaxLength(100);
            entity.Property(e => e.Taluka).HasMaxLength(100);
            entity.Property(e => e.District).HasMaxLength(100);
        });

        // Animal Mapping
        modelBuilder.Entity<Animal>(entity =>
        {
            entity.ToTable("animals");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.AnimalCode).IsUnique();
            entity.Property(e => e.AnimalCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Breed).HasMaxLength(100);
            entity.Property(e => e.TagNumber).HasMaxLength(100);

            entity.HasOne(e => e.Farmer)
                .WithMany(f => f.Animals)
                .HasForeignKey(e => e.FarmerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.CurrentChhavani)
                .WithMany()
                .HasForeignKey(e => e.CurrentChhavaniId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Vet Verification Mapping
        modelBuilder.Entity<VetVerification>(entity =>
        {
            entity.ToTable("vet_verifications");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DoctorId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Remarks).HasMaxLength(500);

            entity.Property(e => e.InspectionLocation)
                .HasColumnType("point")
                .HasAnnotation("MySql:SpatialReferenceSystemIdentifier", 4326);

            entity.HasOne(e => e.Animal)
                .WithMany(a => a.Verifications)
                .HasForeignKey(e => e.AnimalId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Animal Admission Mapping
        modelBuilder.Entity<AnimalAdmission>(entity =>
        {
            entity.ToTable("animal_admissions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.AdmissionCode).IsUnique();
            entity.Property(e => e.AdmissionCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.OperatorId).HasMaxLength(50).IsRequired();

            entity.Property(e => e.AdmissionLocation)
                .HasColumnType("point")
                .HasAnnotation("MySql:SpatialReferenceSystemIdentifier", 4326);

            entity.HasOne(e => e.Animal)
                .WithMany(a => a.Admissions)
                .HasForeignKey(e => e.AnimalId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Chhavani)
                .WithMany(c => c.Admissions)
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Fodder Stock Mapping
        modelBuilder.Entity<FodderStock>(entity =>
        {
            entity.ToTable("fodder_stocks");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AvailableQuantity).HasPrecision(18, 2);
            entity.Property(e => e.Unit).HasMaxLength(20).HasDefaultValue("kg");
            entity.HasIndex(e => new { e.ChhavaniId, e.Source, e.FodderType }).IsUnique();

            entity.HasOne(e => e.Chhavani)
                .WithMany(c => c.Stocks)
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Fodder Purchase Mapping
        modelBuilder.Entity<FodderPurchase>(entity =>
        {
            entity.ToTable("fodder_purchases");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Quantity).HasPrecision(18, 2);
            entity.Property(e => e.RatePerUnit).HasPrecision(18, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.Property(e => e.SellerName).HasMaxLength(200).IsRequired();

            entity.HasOne(e => e.Chhavani)
                .WithMany()
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Feeding Entry Mapping
        modelBuilder.Entity<FeedingEntry>(entity =>
        {
            entity.ToTable("feeding_entries");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.QuantityIssued).HasPrecision(18, 2);

            entity.HasOne(e => e.Chhavani)
                .WithMany()
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Stock Adjustment Mapping
        modelBuilder.Entity<StockAdjustment>(entity =>
        {
            entity.ToTable("stock_adjustments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Quantity).HasPrecision(18, 2);
            entity.Property(e => e.Reason).HasMaxLength(500).IsRequired();

            entity.HasOne(e => e.Chhavani)
                .WithMany()
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Expense Mapping
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.ToTable("expenses");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Description).HasMaxLength(500);

            entity.HasOne(e => e.Chhavani)
                .WithMany()
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Camp Inspection Mapping
        modelBuilder.Entity<CampInspection>(entity =>
        {
            entity.ToTable("camp_inspections");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ChhavaniId, e.InspectionDateUtc });

            entity.Property(e => e.OfficerId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.OfficerName).HasMaxLength(150).IsRequired();
            entity.Property(e => e.OfficerDesignation).HasMaxLength(100);
            entity.Property(e => e.WaterAvailability).HasMaxLength(50).IsRequired();
            entity.Property(e => e.FodderStockCondition).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Remarks).HasMaxLength(1000);
            entity.Property(e => e.Recommendations).HasMaxLength(1000);
            entity.Property(e => e.InspectionPhotoUrl).HasMaxLength(500);

            // Spatial Inspector Location Point (SRID 4326)
            entity.Property(e => e.InspectorLocation)
                .HasColumnType("point")
                .HasAnnotation("MySql:SpatialReferenceSystemIdentifier", 4326);

            entity.HasOne(e => e.Chhavani)
                .WithMany()
                .HasForeignKey(e => e.ChhavaniId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
